// Server-side SEO meta injector for the Vite/React SPA.
//
// The app is a pure client-side-rendered SPA (react-helmet-async), so the raw
// HTML Netlify serves for every route is always the same index.html — meaning
// every page was returning the HOMEPAGE's <title>, canonical link and OG tags
// to anything that doesn't execute JS (WhatsApp/Facebook/LinkedIn link-preview
// bots, some crawlers, and the very first HTML paint search engines see).
// This rewrites those tags at the edge, per-route, before the HTML reaches
// the client.
//
// Fails open: any error/timeout just falls back to the untouched origin HTML
// (today's behaviour), so this can never turn into a broken page.

const SITE = 'https://easywaygermany.com'
const SUPABASE_URL = 'https://uhknpxtwgpngdieuvurh.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoa25weHR3Z3BuZ2RpZXV2dXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTc5MDYsImV4cCI6MjA3Nzc3MzkwNn0.65AA1RLHjjzlzi5jXUhbBgZEjEuYUQG8R0zK_b6PJMo'

const OG_IMAGE_FALLBACK = `${SITE}/images/easyway-logo.png`

// Keep title/description in sync with the <Helmet> block of each page — the
// edge value is what crawlers see before JS runs, Helmet takes over after.
// `ogTitle` / `ogDescription` are optional and fall back to title / description.
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
  '/about': {
    title: 'About EasyWay Germany | Study Abroad Consultants Who Live in Dresden, Germany',
    description:
      'EasyWay Germany is run by Indian students who moved to Germany and know the process firsthand. We offer honest, affordable guidance on admissions, APS certificate, blocked account, and student visa — not from India, but from Germany itself.',
    ogTitle: 'About EasyWay Germany – Consultants Who Actually Live in Germany',
    ogDescription:
      'Founded by an Indian student in Dresden — we guide students through German university admissions, APS, blocked account, and visa from firsthand experience.',
    type: 'website',
  },
  '/blog': {
    title: 'Study in Germany Blog 2026 – APS, Visa, Blocked Account, University Guides | EasyWay Germany',
    description:
      'Expert blog on studying in Germany for Indian, Bangladeshi & Nepali students. Step-by-step guides on APS certificate, Germany student visa, blocked account (Sperrkonto), university shortlisting, SOP writing, scholarships, and life in Germany.',
    ogTitle: 'Study in Germany Blog 2026 – Expert Guides & Tips | EasyWay Germany',
    ogDescription:
      'Comprehensive guides on APS certificate, Germany student visa, blocked account, university admissions and life in Germany — written by consultants who live there.',
    type: 'website',
  },
  '/study-in-germany': {
    title: 'Study in Germany 2026: Complete Guide for Indian, Bangladeshi & Nepali Students | EasyWay Germany',
    description:
      'The most comprehensive guide to studying in Germany in 2026 — APS certificate, blocked account (€11,904), student visa, top universities, scholarships, cost of living, and how to apply. Free consultation from experts who live in Germany.',
    ogTitle: 'Study in Germany 2026: Complete Guide | EasyWay Germany',
    ogDescription:
      'Everything you need to study in Germany — APS certificate, blocked account, student visa, top universities, scholarships, and cost of living. Expert guidance from Dresden.',
    type: 'article',
  },
  '/blocked-account-germany': {
    title: 'Blocked Account Germany 2026: Exact Amount, Best Providers & Step-by-Step Guide | EasyWay Germany',
    description:
      'Open your German blocked account (Sperrkonto) the right way. €11,904 required in 2026, Fintiba vs Expatrio full comparison, step-by-step process from India, and TCS rules explained. Expert assistance from consultants who live in Germany.',
    ogTitle: 'Blocked Account Germany 2026 — Fintiba vs Expatrio, Exact Amount & Process | EasyWay Germany',
    ogDescription:
      'Complete guide to opening a German blocked account for your student visa. €11,904 required, provider comparison, and hands-on help from EasyWay Germany.',
    type: 'article',
  },
  '/pricing': {
    title: 'Germany University Admission Packages 2026 | EasyWay Germany',
    description:
      'Affordable Germany university admission packages for Indian students. SOP writing, university shortlisting, LOR, CV, and visa guidance. Basic ₹19,999 | Standard ₹34,999 | Premium ₹44,999.',
    ogTitle: 'Germany University Admission Packages for Indian Students | EasyWay Germany',
    ogDescription:
      'Get expert help applying to German universities. SOP, LOR, CV, shortlisting and visa guidance. Plans from ₹19,999.',
    type: 'website',
  },
  '/visa-package': {
    title: 'Germany Student Visa Package for Indian Students 2026 | EasyWay Germany',
    description:
      'Complete Germany student visa assistance for Indian students — Visa SOP, blocked account guidance, APS help, VFS appointment, health insurance, and mock interview. ₹7,999 one-time.',
    ogTitle: 'Germany Student Visa Package for Indian Students | EasyWay Germany',
    ogDescription:
      'Expert visa assistance — Visa SOP, blocked account, APS, VFS appointment and mock interview. ₹7,999 one-time.',
    type: 'website',
  },
  '/products': {
    title: 'Study in Germany Services & Packages | EasyWay Germany',
    description:
      "Browse EasyWay Germany's service packages — SOP writing, LOR, CV preparation, university shortlisting, Visa SOP, and more. Affordable prices starting from ₹1,000.",
    ogTitle: 'Study in Germany Services & Packages | EasyWay Germany',
    ogDescription:
      'Affordable document services for German university applications. SOP, LOR, CV, Visa SOP and more.',
    type: 'website',
  },
  '/services/sop-writing': {
    title: 'Professional SOP Writing Service for Germany | EasyWayGermany',
    description:
      'Get a personalized, plagiarism-free Statement of Purpose for German universities. Written by students studying in Germany. Just ₹2,500 with unlimited revisions.',
    type: 'website',
  },
  '/services/lor-writing': {
    title: 'Professional LOR Writing Service for Germany | EasyWayGermany',
    description:
      'Get expertly crafted Letters of Recommendation for German universities and visa applications. Written on behalf of professors, employers, and supervisors. Just ₹1,250 per LOR.',
    type: 'website',
  },
  '/services/cv-preparation': {
    title: 'Professional CV Preparation Service for Germany | EasyWayGermany',
    description:
      'Get a Europass-compliant, ATS-friendly CV for German universities and employers. Expert preparation, editable files, unlimited revisions. Just ₹1,000.',
    type: 'website',
  },
  '/services/university-shortlisting': {
    title: 'University Shortlisting for Germany | EasyWayGermany',
    description:
      'Personalized university shortlisting for Masters in Germany — data-driven recommendations, one-on-one consultation, and a detailed shortlist report. Only public universities where you have high chances.',
    type: 'website',
  },
  '/services/visa-sop': {
    title: 'Visa SOP Writing for Germany Student Visa | EasyWayGermany',
    description:
      'Get a professional Statement of Purpose for your German student visa application. Written by experts who know what embassy officers look for. Just ₹1,500.',
    type: 'website',
  },
  '/services/visa-cover-letter': {
    title: 'Visa Cover Letter Writing Service for Germany | EasyWayGermany',
    description:
      'Embassy-compliant Visa Cover Letter writing for German student visa, jobs, internships, and working student applications. Unlimited revisions. Just ₹1,500.',
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

// Replacement callbacks (not strings) so `$` sequences in titles/descriptions
// (e.g. "$&", "$1") are never interpreted as regex back-references.
function applyMeta(html, meta) {
  let out = html
  const swap = (pattern, replacement) => {
    out = out.replace(pattern, () => replacement)
  }

  const ogTitle = meta.ogTitle || meta.title
  const ogDescription = meta.ogDescription || meta.description

  if (meta.title) {
    swap(/<title>.*?<\/title>/s, `<title>${escapeHtml(meta.title)}</title>`)
  }
  if (meta.description) {
    swap(
      /<meta name="description" content=".*?" \/>/s,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    )
  }
  if (meta.canonical) {
    swap(
      /<link rel="canonical" href=".*?" \/>/s,
      `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
    )
    swap(
      /<meta property="og:url" content=".*?" \/>/s,
      `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`
    )
  }
  if (ogTitle) {
    swap(
      /<meta property="og:title" content=".*?" \/>/s,
      `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`
    )
    swap(
      /<meta name="twitter:title" content=".*?" \/>/s,
      `<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`
    )
  }
  if (ogDescription) {
    swap(
      /<meta property="og:description" content=".*?" \/>/s,
      `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`
    )
    swap(
      /<meta name="twitter:description" content=".*?" \/>/s,
      `<meta name="twitter:description" content="${escapeHtml(ogDescription)}" />`
    )
  }
  if (meta.type) {
    swap(
      /<meta property="og:type" content=".*?" \/>/s,
      `<meta property="og:type" content="${escapeHtml(meta.type)}" />`
    )
  }
  if (meta.image) {
    swap(
      /<meta property="og:image" content=".*?" \/>/s,
      `<meta property="og:image" content="${escapeHtml(meta.image)}" />`
    )
    swap(
      /<meta name="twitter:image" content=".*?" \/>/s,
      `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`
    )
  }
  if (meta.noindex) {
    swap(
      /<meta name="robots" content=".*?" \/>/s,
      '<meta name="robots" content="noindex, follow" />'
    )
  }
  if (meta.extraHead) {
    swap(/<\/head>/, `${meta.extraHead}\n  </head>`)
  }
  if (meta.bodyHtml) {
    swap(/<div id="root"><\/div>/, `<div id="root">${meta.bodyHtml}</div>`)
  }

  return out
}

// Article HTML comes from the admin-authored `blogs.content` column. React renders it
// with dangerouslySetInnerHTML (which never runs <script> tags), but when we write it
// into the raw HTML the browser WOULD execute them — so strip anything executable.
// JSON-LD blocks are inert data and are kept (FAQ schema lives inside post content).
function sanitizeArticleHtml(html) {
  return String(html)
    .replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<(iframe|object|embed|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|link|meta|base)\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"')
    // The shell already has the post title as its one <h1>.
    .replace(/<(\/?)h1\b/gi, '<$1h2')
}

// Crawlable copy of the article for clients that don't run JS. React's createRoot()
// replaces everything inside #root on boot, so this never conflicts with hydration.
function buildArticleShell(blog, image) {
  const alt = blog.image_alt || blog.title
  return (
    '<article id="ssr-article" style="max-width:48rem;margin:0 auto;padding:1.5rem 1rem;' +
    'font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.65;color:#111827">' +
    `<h1>${escapeHtml(blog.title)}</h1>` +
    (image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(alt)}" style="max-width:100%;height:auto" />` : '') +
    sanitizeArticleHtml(blog.content || '') +
    '</article>'
  )
}

// Returns { state: 'found', blog } | { state: 'missing' } | { state: 'error' }.
// 'missing' (query succeeded, no row) is the only state that may produce a 404 —
// a Supabase outage must never turn valid blog URLs into 404s.
async function fetchBlog(slug) {
  const url =
    `${SUPABASE_URL}/rest/v1/blogs?slug=eq.${encodeURIComponent(slug)}` +
    `&is_published=eq.true&select=title,seo_title,seo_description,seo_keywords,excerpt,image,image_alt,og_image,date,category,content&limit=1`
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  })
  if (!res.ok) return { state: 'error' }
  const rows = await res.json()
  if (!Array.isArray(rows)) return { state: 'error' }
  return rows[0] ? { state: 'found', blog: rows[0] } : { state: 'missing' }
}

export default async (request, context) => {
  const response = await context.next()

  try {
    const url = new URL(request.url)
    // Normalise "/services/" -> "/services" (root stays "/").
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) return response

    let meta = null
    let status = response.status

    if (STATIC_META[path]) {
      const base = STATIC_META[path]
      meta = {
        title: base.title,
        description: base.description,
        canonical: `${SITE}${path}`,
        ogTitle: base.ogTitle,
        ogDescription: base.ogDescription,
        type: base.type,
        image: OG_IMAGE_FALLBACK,
      }
    } else if (path.startsWith('/services/')) {
      // Only the six routes in STATIC_META exist under /services/.
      status = 404
      meta = { noindex: true }
    } else if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '')
      if (slug && !slug.includes('/')) {
        const result = await fetchBlog(slug)
        if (result.state === 'found') {
          const { blog } = result
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
            bodyHtml: buildArticleShell(blog, blog.image || image),
            // data-ssr-schema: BlogDetail.jsx removes this tag on mount because
            // its own <Helmet> BlogPosting schema replaces it — avoids duplicates.
            extraHead: `<script type="application/ld+json" data-ssr-schema="true">${escapeJson({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: title,
              description,
              image,
              keywords: blog.seo_keywords || undefined,
              datePublished: blog.date,
              dateModified: blog.date,
              url: canonical,
              mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
              author: { '@type': 'Organization', name: 'EasyWay Germany', url: SITE },
              publisher: {
                '@type': 'Organization',
                name: 'EasyWay Germany',
                url: SITE,
                logo: { '@type': 'ImageObject', url: `${SITE}/images/easyway-logo.png` },
              },
            })}</script>`,
          }
        } else if (result.state === 'missing') {
          // Unknown / unpublished slug: return a real 404 (the SPA still renders
          // and redirects humans to /blog) instead of a soft-404 200.
          status = 404
          meta = { noindex: true }
        }
      }
    }

    if (!meta) return response

    const html = await response.text()
    const rewritten = applyMeta(html, meta)

    const headers = new Headers(response.headers)
    headers.delete('content-length') // body length changed
    if (status === 404) headers.set('cache-control', 'public, max-age=0, must-revalidate')

    return new Response(rewritten, { status, headers })
  } catch (err) {
    // Never let a bug here break the page — serve the original response.
    console.error('seo-meta edge function error:', err)
    return response
  }
}

export const config = {
  path: [
    '/',
    '/services',
    '/services/*',
    '/contact',
    '/about',
    '/blog',
    '/blog/*',
    '/study-in-germany',
    '/blocked-account-germany',
    '/pricing',
    '/visa-package',
    '/products',
  ],
}
