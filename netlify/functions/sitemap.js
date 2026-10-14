import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://easywaygermany.com'

// Public anon credentials (same ones shipped in the client bundle and the
// seo-meta edge function). Used as a fallback so the sitemap still lists blog
// posts even if the VITE_* env vars are not exposed to the functions runtime.
const SUPABASE_URL_FALLBACK = 'https://uhknpxtwgpngdieuvurh.supabase.co'
const SUPABASE_ANON_KEY_FALLBACK =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoa25weHR3Z3BuZ2RpZXV2dXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTc5MDYsImV4cCI6MjA3Nzc3MzkwNn0.65AA1RLHjjzlzi5jXUhbBgZEjEuYUQG8R0zK_b6PJMo'

const STATIC_ROUTES = [
  { url: '/',                                   priority: '1.0',  changefreq: 'weekly' },
  { url: '/study-in-germany',                   priority: '0.95', changefreq: 'monthly' },
  { url: '/blocked-account-germany',            priority: '0.95', changefreq: 'monthly' },
  { url: '/services',                           priority: '0.9',  changefreq: 'monthly' },
  { url: '/pricing',                            priority: '0.9',  changefreq: 'monthly' },
  { url: '/visa-package',                       priority: '0.9',  changefreq: 'monthly' },
  { url: '/services/university-shortlisting',   priority: '0.85', changefreq: 'monthly' },
  { url: '/services/sop-writing',               priority: '0.85', changefreq: 'monthly' },
  { url: '/services/lor-writing',               priority: '0.85', changefreq: 'monthly' },
  { url: '/services/visa-sop',                  priority: '0.85', changefreq: 'monthly' },
  { url: '/services/cv-preparation',            priority: '0.8',  changefreq: 'monthly' },
  { url: '/services/visa-cover-letter',         priority: '0.8',  changefreq: 'monthly' },
  { url: '/contact',                            priority: '0.85', changefreq: 'monthly' },
  { url: '/about',                              priority: '0.8',  changefreq: 'monthly' },
  { url: '/blog',                               priority: '0.85', changefreq: 'daily' },
  { url: '/products',                           priority: '0.75', changefreq: 'weekly' },
  { url: '/privacy-policy',                     priority: '0.3',  changefreq: 'yearly' },
  { url: '/terms-conditions',                   priority: '0.3',  changefreq: 'yearly' },
  { url: '/refund-policy',                      priority: '0.3',  changefreq: 'yearly' },
]

function urlEntry({ url, priority, changefreq, lastmod }) {
  return `
  <url>
    <loc>${BASE_URL}${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export const handler = async () => {
  let blogEntries = []
  let productEntries = []

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || SUPABASE_URL_FALLBACK,
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_FALLBACK
    )

    // NOTE: `blogs` has no created_at/updated_at columns — the publish date is `date`.
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('slug, date')
      .eq('is_published', true)
      .order('date', { ascending: false })

    if (blogsError) console.error('sitemap: blogs query failed:', blogsError.message)

    if (blogs) {
      blogEntries = blogs.map(b => urlEntry({
        url: `/blog/${b.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: (b.date || '').split('T')[0],
      }))
    }

    // `products` has created_at but no updated_at.
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('slug, created_at')
      .eq('is_active', true)

    if (productsError) console.error('sitemap: products query failed:', productsError.message)

    if (products) {
      productEntries = products.map(p => urlEntry({
        url: `/products/${p.slug}`,
        priority: '0.6',
        changefreq: 'weekly',
        lastmod: (p.created_at || '').split('T')[0],
      }))
    }
  } catch (e) {
    // Supabase unavailable — static routes only
    console.error('sitemap: Supabase unavailable, serving static routes only:', e)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_ROUTES.map(urlEntry).join('')}
${blogEntries.join('')}
${productEntries.join('')}
</urlset>`

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
    body: xml,
  }
}
