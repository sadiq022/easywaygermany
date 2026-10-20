import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { supabase, isSupabaseConfigured } from '../supabase'

function wrapCtaSections(html) {
  if (!html || typeof window === 'undefined') return html || ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const body = doc.body

  const ctaLinks = Array.from(body.querySelectorAll('a')).filter(link => {
    const href = (link.getAttribute('href') || '').toLowerCase()
    const text = (link.textContent || '').toLowerCase()
    return href.includes('wa.me') || href.includes('whatsapp') ||
           text.includes('whatsapp') || text.includes('contact us')
  })

  ctaLinks.forEach(link => {
    const linkPara = link.closest('p') || link.parentElement
    if (!linkPara?.parentElement) return
    if (linkPara.parentElement.classList.contains('blog-cta-box')) return

    const parent = linkPara.parentElement
    const siblings = Array.from(parent.children)
    const linkIdx = siblings.indexOf(linkPara)
    if (linkIdx === -1) return

    // Find nearest heading: real h2/h3/h4 OR <p><strong>...</strong></p> bold-as-heading
    let startIdx = Math.max(0, linkIdx - 5)
    for (let i = linkIdx - 1; i >= 0; i--) {
      const el = siblings[i]
      const tag = el.tagName?.toLowerCase()
      if (tag === 'h2' || tag === 'h3' || tag === 'h4') { startIdx = i; break }
      if (tag === 'p') {
        const nonEmpty = Array.from(el.childNodes).filter(
          n => n.nodeType !== 3 || n.textContent.trim()
        )
        if (nonEmpty.length === 1 &&
            (nonEmpty[0].nodeName === 'STRONG' || nonEmpty[0].nodeName === 'B')) {
          startIdx = i; break
        }
      }
    }

    const wrapper = doc.createElement('div')
    wrapper.className = 'blog-cta-box'
    parent.insertBefore(wrapper, siblings[startIdx])
    for (let i = startIdx; i <= linkIdx; i++) wrapper.appendChild(siblings[i])
  })

  return body.innerHTML
}

function extractFaqSchema(html) {
  if (!html || typeof window === 'undefined') return []
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const items = []
    
    // Check h3 headers with questions
    const h3s = Array.from(doc.querySelectorAll('h3'))
    for (const h3 of h3s) {
      const q = h3.textContent.trim()
      const qLower = q.toLowerCase()
      if (q.endsWith('?') || qLower.startsWith('what') || qLower.startsWith('how') || qLower.startsWith('is ') || qLower.startsWith('can ') || qLower.startsWith('do ') || qLower.startsWith('which')) {
        let answer = ''
        let next = h3.nextElementSibling
        while (next && (next.tagName.toLowerCase() === 'p' || next.tagName.toLowerCase() === 'ul' || next.tagName.toLowerCase() === 'ol')) {
          answer += next.textContent.trim() + ' '
          next = next.nextElementSibling
        }
        if (answer.trim()) {
          items.push({
            '@type': 'Question',
            name: q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: answer.trim()
            }
          })
        }
      }
    }
    
    // Also check <p><strong>Question?</strong> Answer</p>
    if (items.length === 0) {
      const ps = Array.from(doc.querySelectorAll('p'))
      for (const p of ps) {
        const strong = p.querySelector('strong, b')
        if (strong) {
          const q = strong.textContent.trim()
          if (q.endsWith('?') || q.toLowerCase().includes('is a master') || q.toLowerCase().includes('what are')) {
            const fullText = p.textContent.trim()
            const answer = fullText.replace(q, '').trim()
            if (answer) {
              items.push({
                '@type': 'Question',
                name: q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: answer
                }
              })
            }
          }
        }
      }
    }

    return items
  } catch {
    return []
  }
}

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])

  // Newsletter states
  const [subEmail, setSubEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)

    // Fetch primary blog post
    supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error) throw error
        if (!data) {
          toast.error('Blog post not found.')
          navigate('/blog')
          return
        }
        setBlog(data)
        
        // Fetch related blogs in same category (excluding current)
        return supabase
          .from('blogs')
          .select('id, title, slug, excerpt, image, image_alt, date, category, read_time')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3)
      })
      .then((res) => {
        if (res && res.data) {
          setRelated(res.data)
        }
      })
      .catch((err) => {
        console.error('Error fetching blog details:', err)
        toast.error('Failed to load blog article.')
        navigate('/blog')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug, navigate])

  // The seo-meta edge function injects a BlogPosting JSON-LD into the raw HTML for
  // non-JS crawlers. Once React is running, <Helmet> below renders the (richer)
  // BlogPosting itself, so drop the edge copy to avoid duplicate schema.
  useEffect(() => {
    document.querySelectorAll('script[data-ssr-schema]').forEach((el) => el.remove())
  }, [slug, blog])


  async function handleSubscribe(e) {
    e.preventDefault()
    if (!subEmail.trim()) {
      toast.error('Please enter a valid email address.')
      return
    }

    setSubscribing(true)
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: subEmail.trim().toLowerCase() })

    if (error) {
      if (error.message.includes('unique') || error.code === '23505') {
        toast.success('You are already subscribed to our newsletter!')
        setSubEmail('')
      } else {
        toast.error('Failed to subscribe: ' + error.message)
      }
    } else {
      toast.success('Thank you for subscribing to our newsletter!')
      setSubEmail('')
    }
    setSubscribing(false)
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24 mb-6" />
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-12 bg-gray-200 rounded w-1/2 mb-8" />
        <div className="h-6 bg-gray-150 rounded w-1/3 mb-12" />
        <div className="h-[400px] bg-gray-200 rounded-[2rem] mb-12" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    )
  }

  if (!blog) return null

  const pageUrl = `https://easywaygermany.com/blog/${blog.slug}`
  const metaTitle = blog.seo_title || blog.title
  const metaDescription = blog.seo_description || blog.excerpt || blog.title
  const metaKeywords = blog.seo_keywords || `study in germany, ${blog.category || ''}, germany university, indian students germany`
  const rawImage = blog.og_image || blog.image
  let ogImage = 'https://easywaygermany.com/og-banner.jpg'
  if (rawImage) {
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      // If it's a Cloudinary URL, make sure it serves 1200x630 JPEG for WhatsApp
      if (rawImage.includes('cloudinary.com')) {
        ogImage = rawImage.replace('/upload/', '/upload/c_fill,w_1200,h_630,g_auto,f_jpg,q_auto/').rsplit ? rawImage : rawImage.replace(/\.[a-zA-Z0-9]+$/, '.jpg')
      } else {
        ogImage = rawImage
      }
    } else {
      ogImage = `https://easywaygermany.com${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
    }
  }

  const faqEntities = extractFaqSchema(blog.content)

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{metaTitle.includes('EasyWay Germany') ? metaTitle : `${metaTitle} | EasyWay Germany`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        {blog.focus_keyword && <meta name="news_keywords" content={blog.focus_keyword} />}
        
        {/* Open Graph / WhatsApp / Facebook / LinkedIn */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="EasyWay Germany" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={blog.image_alt || metaTitle} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        <meta property="article:published_time" content={blog.date || blog.created_at} />
        <meta property="article:section" content={blog.category || 'Study in Germany'} />
        {blog.focus_keyword && <meta property="article:tag" content={blog.focus_keyword} />}
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: metaTitle,
          description: metaDescription,
          image: ogImage,
          keywords: metaKeywords,
          datePublished: blog.date || blog.created_at,
          dateModified: blog.updated_at || blog.date || blog.created_at,
          author: { '@type': 'Organization', name: 'EasyWay Germany', url: 'https://easywaygermany.com' },
          publisher: {
            '@type': 'Organization',
            name: 'EasyWay Germany',
            url: 'https://easywaygermany.com',
            logo: { '@type': 'ImageObject', url: 'https://easywaygermany.com/images/easyway-logo.png' }
          },
          url: pageUrl,
          mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl }
        })}</script>
        {faqEntities.length > 0 && (
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqEntities
          })}</script>
        )}
      </Helmet>
      {/* Blog Hero/Header Section */}
      <header className="bg-gradient-to-b from-gray-50 via-gray-50/50 to-white pt-10 pb-7 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between mb-5">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-red-700 transition-colors group"
            >
              <span className="material-icons-round text-base transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back to all articles
            </Link>
            <span className="text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug text-gray-900 tracking-tight mb-5">
            {blog.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-extrabold">
                EG
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm leading-none">EasyWay Germany</p>
                <p className="text-xs text-gray-400">Official Publication</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-icons-round text-primary text-base">calendar_today</span>
              <span>{formatDate(blog.date)}</span>
            </div>
            {blog.read_time && (
              <div className="flex items-center gap-1.5">
                <span className="material-icons-round text-primary text-base">schedule</span>
                <span>{blog.read_time}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Blog Article Layout */}
      <main className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Cover Image */}
          {blog.image && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-8 bg-gray-50 border border-gray-100">
              <img
                src={blog.image}
                alt={blog.image_alt || blog.title}
                className="w-full h-auto block select-none"
              />
            </div>
          )}

          {/* Rich Text Content */}
          <div
            className="blog-content mb-6"
            dangerouslySetInnerHTML={{ __html: wrapCtaSections(blog.content) }}
          />

          {/* Share/Footer Strip */}
          <div className="border-t border-b border-gray-100 py-5 flex flex-wrap justify-between items-center gap-4 mt-8 mb-6">
            <Link 
              to="/blog" 
              className="flex items-center gap-2 text-primary font-extrabold hover:text-red-700 transition-colors text-base group"
            >
              <span className="material-icons-round text-base transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back to all articles
            </Link>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/4915236738625?text=Hi,%20I%20just%20read%20your%20article%20"${encodeURIComponent(blog.title)}"%20and%20would%20like%20to%20get%20consulting!`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] hover:scale-[1.02] text-white font-extrabold text-sm px-5 py-3 rounded-2xl transition-all shadow-md active:scale-[0.98]"
              >
                <span className="material-icons-round text-lg">chat</span>
                Ask on WhatsApp
              </a>
            </div>
          </div>

          {/* Newsletter Subscription Card */}
          <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 text-white rounded-2xl p-7 md:p-10 shadow-xl overflow-hidden my-8 border border-gray-800">
            {/* Soft backdrop glow circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/10 rounded-full blur-3xl -ml-20 -mb-20 z-0 pointer-events-none" />
            
            <div className="relative z-10 grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <span className="inline-block bg-primary/20 text-primary border border-primary/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  Exclusive Updates
                </span>
                <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-white leading-tight">
                  Get the EasyWay Guide directly to your inbox
                </h3>
              </div>
              <div className="lg:col-span-2">
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">email</span>
                    <input
                      type="email"
                      required
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 transition-all cursor-pointer text-sm"
                  >
                    {subscribing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-icons-round text-base">local_post_office</span>
                        <span>Subscribe to Newsletter</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Related Articles — Full Width like Home Page */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-gray-50/70 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Keep Reading</div>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Related Articles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl shadow-card overflow-hidden group flex flex-col h-full border border-gray-100/80">
                  <Link to={`/blog/${b.slug}`} className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0 block">
                    {b.image ? (
                      <img
                        src={b.image}
                        alt={b.image_alt || b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="material-icons-round text-5xl">article</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {b.category}
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-semibold">
                      {b.date && (
                        <span className="flex items-center gap-1">
                          <span className="material-icons-round text-xs">calendar_today</span>
                          {formatDate(b.date)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="material-icons-round text-xs">schedule</span>
                        {b.read_time || '5 min read'}
                      </span>
                    </div>
                    <Link to={`/blog/${b.slug}`}>
                      <h4 className="font-serif font-bold text-gray-900 text-base leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {b.title}
                      </h4>
                    </Link>
                    {b.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                        {b.excerpt}
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link
                        to={`/blog/${b.slug}`}
                        className="w-full block text-center py-2.5 px-4 bg-primary text-white hover:bg-primary-dark rounded-xl text-sm font-bold transition-all shadow-sm"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

