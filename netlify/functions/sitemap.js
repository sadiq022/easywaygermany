const { createClient } = require('@supabase/supabase-js')

const BASE_URL = 'https://easywaygermany.com'

const STATIC_ROUTES = [
  { url: '/',                                   priority: '1.0', changefreq: 'weekly' },
  { url: '/about',                              priority: '0.8', changefreq: 'monthly' },
  { url: '/services',                           priority: '0.9', changefreq: 'monthly' },
  { url: '/services/university-shortlisting',   priority: '0.8', changefreq: 'monthly' },
  { url: '/services/sop-writing',               priority: '0.8', changefreq: 'monthly' },
  { url: '/services/lor-writing',               priority: '0.8', changefreq: 'monthly' },
  { url: '/services/cv-preparation',            priority: '0.8', changefreq: 'monthly' },
  { url: '/services/visa-sop',                  priority: '0.8', changefreq: 'monthly' },
  { url: '/services/visa-cover-letter',         priority: '0.8', changefreq: 'monthly' },
  { url: '/products',                           priority: '0.7', changefreq: 'weekly' },
  { url: '/blog',                               priority: '0.8', changefreq: 'daily' },
  { url: '/contact',                            priority: '0.8', changefreq: 'monthly' },
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

exports.handler = async () => {
  let blogEntries = []
  let productEntries = []

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    )

    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (blogs) {
      blogEntries = blogs.map(b => urlEntry({
        url: `/blog/${b.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: (b.updated_at || b.created_at || '').split('T')[0],
      }))
    }

    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at, created_at')
      .eq('is_active', true)

    if (products) {
      productEntries = products.map(p => urlEntry({
        url: `/products/${p.slug}`,
        priority: '0.6',
        changefreq: 'weekly',
        lastmod: (p.updated_at || p.created_at || '').split('T')[0],
      }))
    }
  } catch (e) {
    // Supabase unavailable — static routes only
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
