import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import SEOHead from '../components/SEOHead'

const CAT_ICONS = {
  'university-lists': 'account_balance',
  'sop-samples': 'description',
  'lor-templates': 'recommend',
  'cv-resume': 'badge',
  'application-guides': 'menu_book',
}
const CAT_CLASSES = {
  'university-lists': 'cat-university-lists',
  'sop-samples': 'cat-sop-samples',
  'lor-templates': 'cat-lor-templates',
  'cv-resume': 'cat-cv-resume',
  'application-guides': 'cat-application-guides',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [purchased, setPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [myReview, setMyReview] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: p, error } = await supabase
        .from('products')
        .select('id, title, slug, description, short_description, price, original_price, category_id, preview_image, is_featured, tags, pages, format, created_at, categories(name, slug)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error || !p) { navigate('/products'); return }
      setProduct(p)

      if (user) {
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', p.id)
          .eq('status', 'completed')
          .single()
        setPurchased(!!purchase)

        if (purchase) {
          const { data: existing } = await supabase
            .from('reviews')
            .select('id, rating, comment')
            .eq('user_id', user.id)
            .eq('product_id', p.id)
            .single()
          if (existing) {
            setMyReview(existing)
            setReviewRating(existing.rating)
            setReviewComment(existing.comment || '')
          }
        }
      }

      const { data: rel } = await supabase
        .from('products')
        .select('id, title, slug, description, short_description, price, original_price, category_id, preview_image, is_featured, tags, pages, format, created_at, categories(name, slug)')
        .eq('category_id', p.category_id)
        .eq('is_active', true)
        .neq('id', p.id)
        .limit(4)
      setRelated(rel || [])

      // Fetch reviews
      const { data: revs } = await supabase
        .from('reviews')
        .select('*, profiles(name)')
        .eq('product_id', p.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      setReviews(revs || [])

      setLoading(false)
    }
    load()
  }, [slug, user])

  async function handleDownload() {
    setDownloading(true)

    // Fetch file_path only from the user's own verified purchase — never from product state
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('products(file_path)')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .eq('status', 'completed')
      .single()

    const filePath = purchase?.products?.file_path
    if (purchaseError || !filePath) {
      toast.error('Purchase not verified. Please contact support.')
      setDownloading(false)
      return
    }

    const { data, error } = await supabase.storage
      .from('products')
      .createSignedUrl(filePath, 3600)

    if (error || !data?.signedUrl) {
      toast.error('Could not generate download link. Please try again.')
    } else {
      window.open(data.signedUrl, '_blank')
    }
    setDownloading(false)
  }

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!user) return
    setSubmittingReview(true)
    const payload = { product_id: product.id, user_id: user.id, rating: reviewRating, comment: reviewComment.trim() || null }
    const { error } = myReview
      ? await supabase.from('reviews').update({ rating: reviewRating, comment: reviewComment.trim() || null }).eq('id', myReview.id)
      : await supabase.from('reviews').insert(payload)
    if (error) {
      toast.error('Failed to submit review.')
    } else {
      toast.success(myReview ? 'Review updated!' : 'Review submitted!')
      const { data: revs } = await supabase.from('reviews').select('*, profiles(name)').eq('product_id', product.id).eq('is_approved', true).order('created_at', { ascending: false })
      setReviews(revs || [])
      if (!myReview) setMyReview({ rating: reviewRating, comment: reviewComment })
    }
    setSubmittingReview(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) return null

  const catSlug = product.categories?.slug || ''
  const catName = product.categories?.name || ''
  const catClass = CAT_CLASSES[catSlug] || 'cat-application-guides'
  const catIcon = CAT_ICONS[catSlug] || 'menu_book'
  const discountPct = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.meta_title || product.title,
    description: product.meta_description || product.short_description || product.description,
    image: product.preview_image || undefined,
    brand: { '@type': 'Brand', name: 'EasyWay Germany' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: window.location.href,
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: reviews.length,
      },
    }),
  }

  return (
    <>
      <SEOHead
        title={product.meta_title || product.title}
        description={product.meta_description || product.short_description || product.description?.slice(0, 160)}
        keywords={product.seo_keywords || product.tags}
        image={product.preview_image}
        type="product"
        structuredData={structuredData}
      />
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="material-icons-round text-sm">chevron_right</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span className="material-icons-round text-sm">chevron_right</span>
            <Link to={`/products?category=${catSlug}`} className="hover:text-primary">{catName}</Link>
            <span className="material-icons-round text-sm">chevron_right</span>
            <span className="text-gray-700 truncate max-w-xs">{product.title}</span>
          </div>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            {/* Left */}
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 rounded-2xl mb-4">
                {product.preview_image ? (
                  <img
                    src={product.preview_image}
                    alt={product.alt_text || product.title}
                    className="w-full h-full object-cover select-none"
                  />
                ) : (
                  <div className={`cat-placeholder ${catClass} absolute inset-0 w-full h-full`}>
                    <span className="material-icons-round cat-icon">{catIcon}</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full z-10">
                  <span className="material-icons-round text-xs">lock</span> Secure Purchase
                </div>
              </div>

              {discountPct > 0 && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-2 rounded-lg mb-4">
                  <span className="material-icons-round text-base">local_offer</span>
                  Save {discountPct}% today – Limited time offer!
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                {[
                  { icon: 'description', label: 'Format', value: `${product.format || 'PDF'} Document` },
                  product.pages && { icon: 'auto_stories', label: 'Pages', value: `${product.pages} pages` },
                  { icon: 'category', label: 'Category', value: catName },
                  product.tags && { icon: 'label', label: 'Tags', value: product.tags },
                ].filter(Boolean).map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <span className="material-icons-round text-primary text-base">{icon}</span>
                    <span className="text-gray-500 w-20">{label}</span>
                    <strong className="text-gray-900">{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{catName}</div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-4">{product.title}</h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-black text-gray-900">₹{Number(product.price).toFixed(2)}</span>
                {product.original_price && (
                  <span className="text-xl text-gray-400 line-through">₹{Number(product.original_price).toFixed(2)}</span>
                )}
                {discountPct > 0 && (
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-full">Save {discountPct}%</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: 'lock', label: 'Secure Payment' },
                  { icon: 'download', label: 'Instant Access' },
                  { icon: 'verified', label: '100% Genuine' },
                  { icon: 'support_agent', label: 'Expert Support' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="material-icons-round text-primary text-base">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>

              {/* CTA */}
              {purchased ? (
                <>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 bg-success text-white py-4 rounded-xl font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60 mb-3">
                    <span className="material-icons-round">{downloading ? 'hourglass_empty' : 'download'}</span>
                    {downloading ? 'Preparing download…' : 'Download Now'}
                  </button>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="material-icons-round text-success text-base">check_circle</span>
                    You own this product. Download anytime from your dashboard.
                  </p>
                </>
              ) : user ? (
                <Link to={`/checkout/${product.id}`}
                  className="flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary-dark transition-colors mb-3">
                  <span className="material-icons-round">shopping_cart</span>
                  Buy Now – ₹{Number(product.price).toFixed(2)}
                </Link>
              ) : (
                <>
                  <Link to={`/login?next=/products/${slug}`}
                    className="flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary-dark transition-colors mb-3">
                    <span className="material-icons-round">login</span>
                    Login to Purchase
                  </Link>
                  <p className="text-sm text-gray-500">
                    New user?{' '}
                    <Link to="/register" className="text-primary font-semibold hover:underline">Create a free account</Link>
                    {' '}to purchase.
                  </p>
                </>
              )}

              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mt-4">
                <span className="material-icons-round text-blue-500 text-base mt-0.5">security</span>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your payment is secured. Files are only accessible after purchase. No screenshots or previews are shown to protect content.
                </p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-serif text-2xl font-bold text-gray-900">Customer Reviews</h2>
              {avgRating && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-gray-900">{avgRating}</span>
                  <span className="material-icons-round text-yellow-400">star</span>
                  <span className="text-sm text-gray-500">({reviews.length})</span>
                </div>
              )}
            </div>

            {/* Review form */}
            {user ? (
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-1">{myReview ? 'Update Your Review' : 'Write a Review'}</h3>
                <p className="text-sm text-gray-400 mb-4">Share your honest experience to help other students.</p>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none">
                          <span className={`material-icons-round text-3xl transition-colors ${star <= (hoverRating || reviewRating) ? 'text-yellow-400' : 'text-gray-200'}`}>star</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea
                      rows={3} value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this product…"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <button type="submit" disabled={submittingReview}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60">
                    {submittingReview ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-icons-round text-base">send</span>}
                    {myReview ? 'Update Review' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 mb-8">
                <span className="material-icons-round text-primary text-2xl">rate_review</span>
                <p className="text-sm text-gray-600">
                  <Link to={`/login?next=/products/${slug}`} className="text-primary font-semibold hover:underline">Log in</Link>
                  {' '}to write a review for this product.
                </p>
              </div>
            )}

            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first to review this product after purchasing.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {(r.profiles?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{r.profiles?.name || 'Verified Buyer'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <span key={i} className={`material-icons-round text-sm ${i <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>star</span>
                          ))}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div className="text-center mb-10">
                <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">More Products</div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">You Might Also Like</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
