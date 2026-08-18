// Server-side SEO meta injector for the Vite/React SPA.
//
// The app is a pure client-side-rendered SPA (react-helmet-async), so the raw
// HTML Netlify serves for every route is always the same index.html — meaning
// every page (incl. /services, /contact, every blog post) was returning the
// HOMEPAGE's <title>, canonical link and OG tags to anything that doesn't
// execute JS (WhatsApp/Facebook/LinkedIn link-preview bots, some crawlers,
// and the very first HTML paint search engines see). This rewrites those
// tags at the edge, per-route, before the HTML reaches the client.
//
// Fails open: any error/timeout just falls back to the untouched origin HTML
// (today's behaviour), so this can never turn into a broken page.

const SITE = 'https://easywaygermany.com'
const SUPABASE_URL = 'https://uhknpxtwgpngdieuvurh.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoa25weHR3Z3BuZ2RpZXV2dXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTc5MDYsImV4cCI6MjA3Nzc3MzkwNn0.65AA1RLHjjzlzi5jXUhbBgZEjEuYUQG8R0zK_b6PJMo'

const OG_IMAGE_FALLBACK = `${SITE}/images/easyway-logo.png`

const STATIC_META = {
  '/': {
    title: 'Masters & Bachelors in Germany Consultancy | EasyWay Germany — Expert Help from Dresden',
    description:
      'Planning Masters or Bachelors in Germany? Get expert help from consultants who actually live in Germany — SOP writing, APS certificate, university shortlisting, blocked account, and visa SOP. Free consultation available.',
    ogTitle: 'Masters & Bachelors in Germany Consultancy | EasyWay Germany',
    type: 'website',
  },
  '/services': {
    title: 'Study in Germany Services 2026 — SOP, APS, Visa SOP, University Shortlisting | EasyWay Germany',
    description:
      'Complete study in Germany services for Indian students — SOP writing, LOR, APS certificate guidance, blocked account setup, university shortlisting, and Germany visa SOP. Expert help from Dresden.',
    ogTitle: 'Study in Germany Services 2026 — SOP, APS, Visa SOP | EasyWay Germany',
    type: 'website',
  },
  '/contact': {
    title: 'Book a Free Consultation – Study in Germany | EasyWay Germany',
    description:
      "Get a free consultation with EasyWay Germany's experts for studying in Germany. We'll evaluate your profile, suggest universities, and guide you on APS certificate, blocked account, and student visa.",
    ogTitle: 'Free Consultation – Study in Germany | EasyWay Germany',
    type: 'website',
  },
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeJson(obj) {
  // Safe to inline inside a <script> tag — escapes </script> breakout.
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

function applyMeta(html, meta) {
  let out = html

  if (meta.title) {
    out = out.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(meta.title)}</title>`)
  }
  if (meta.description) {
    out = out.replace(
      /<meta name="description" content=".*?" \/>/s,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    )
  }
  if (meta.canonical) {
    out = out.replace(
      /<link rel="canonical" href=".*?" \/>/s,
      `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
    )
  }
  if (meta.ogTitle) {
    out = out.replace(
      /<meta property="og:title" content=".*?" \/>/s,
      `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`
    )
    out = out.replace(
      /<meta name="twitter:title" content=".*?" \/>/s,
      `<meta name="twitter:title" content="${escapeHtml(meta.ogTitle)}" />`
    )
  }
  if (meta.description) {
    out = out.replace(
      /<meta property="og:description" content=".*?" \/>/s,
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
    )
    out = out.replace(
      /<meta name="twitter:description" content=".*?" \/>/s,
      `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
    )
  }
  if (meta.canonical) {
    out = out.replace(
      /<meta property="og:url" content=".*?" \/>/s,
      `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`
    )
  }
  if (meta.type) {
    out = out.replace(
      /<meta property="og:type" content=".*?" \/>/s,
      `<meta property="og:type" content="${escapeHtml(meta.type)}" />`
    )
  }
  if (meta.image) {
    out = out.replace(
      /<meta property="og:image" content=".*?" \/>/s,
      `<meta property="og:image" content="${escapeHtml(meta.image)}" />`
    )
    out = out.replace(
      /<meta name="twitter:image" content=".*?" \/>/s,
      `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`
    )
  }
  if (meta.extraHead) {
    out = out.replace('</head>', `${meta.extraHead}\n  </head>`)
  }

  return out
}

async function fetchBlog(slug) {
  const url =
    `${SUPABASE_URL}/rest/v1/blogs?slug=eq.${encodeURIComponent(slug)}` +
    `&is_published=eq.true&select=title,seo_title,seo_description,excerpt,image,og_image,date,category&limit=1`
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  })
  if (!res.ok) return null
  const rows = await res.json()
  return rows && rows[0] ? rows[0] : null
}

export default async (request, context) => {
  const response = await context.next()

  try {
    const url = new URL(request.url)
    const path = url.pathname

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) return response

    let meta = null

    if (STATIC_META[path]) {
      const base = STATIC_META[path]
      meta = {
        title: base.title,
        description: base.description,
        canonical: `${SITE}${path === '/' ? '/' : path}`,
        ogTitle: base.ogTitle,
        type: base.type,
        image: OG_IMAGE_FALLBACK,
      }
    } else if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '').replace(/\/$/, '')
      if (slug) {
        const blog = await fetchBlog(slug)
        if (blog) {
          const title = blog.seo_title || blog.title
          const description = blog.seo_description || blog.excerpt || blog.title
          const canonical = `${SITE}/blog/${slug}`
          const image = blog.og_image || blog.image || OG_IMAGE_FALLBACK
          const pageTitle = title.includes('EasyWay Germany') ? title : `${title} | EasyWay Germany`
          meta = {
            title: pageTitle,
            description,
            canonical,
            ogTitle: title,
            type: 'article',
            image,
            extraHead: `<script type="application/ld+json">${escapeJson({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: title,
              description,
              image,
              datePublished: blog.date,
              dateModified: blog.date,
              url: canonical,
              mainEntityOfPage: canonical,
              author: { '@type': 'Organization', name: 'EasyWay Germany', url: SITE },
              publisher: {
                '@type': 'Organization',
                name: 'EasyWay Germany',
                url: SITE,
                logo: { '@type': 'ImageObject', url: `${SITE}/images/easyway-logo.png` },
              },
            })}</script>`,
          }
        }
      }
    }

    if (!meta) return response

    const html = await response.text()
    const rewritten = applyMeta(html, meta)

    return new Response(rewritten, {
      status: response.status,
      headers: response.headers,
    })
  } catch (err) {
    // Never let a bug here break the page — serve the original response.
    console.error('seo-meta edge function error:', err)
    return response
  }
}

export const config = {
  path: ['/', '/services', '/contact', '/blog/*'],
}
