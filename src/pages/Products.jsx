import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { supabase, isSupabaseConfigured } from '../supabase'
import ProductCard from '../components/ProductCard'

const PER_PAGE = 12

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const currentCat = searchParams.get('category') || ''
  const search = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.from('categories').select('*')
      .then(({ data, error }) => {
        if (error) throw error
        setCategories(data || [])
      })
      .catch(err => {
        console.error('Error fetching categories:', err)
      })
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    const from = (page - 1) * PER_PAGE
    const to = from + PER_PAGE - 1

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (currentCat) {
      query = query.eq('categories.slug', currentCat)
    }
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    query
      .then(({ data, count, error }) => {
        if (error) throw error
        // Filter client-side for category since Supabase join filter behaves differently
        let filtered = data || []
        if (currentCat) {
          filtered = filtered.filter(p => p.categories?.slug === currentCat)
        }
        setProducts(filtered)
        setTotal(count || 0)
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        toast.error(`Failed to load products: ${err.message || JSON.stringify(err)}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentCat, search, page])

  function setParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <>
      <Helmet>
        <title>Study in Germany Services & Packages | EasyWay Germany</title>
        <meta name="description" content="Browse EasyWay Germany's service packages — SOP writing, LOR, CV preparation, university shortlisting, Visa SOP, and more. Affordable prices starting from ₹1,000." />
        <meta property="og:title" content="Study in Germany Services & Packages | EasyWay Germany" />
        <meta property="og:description" content="Affordable document services for German university applications. SOP, LOR, CV, Visa SOP and more." />
        <meta property="og:url" content="https://easywaygermany.com/products" />
        <link rel="canonical" href="https://easywaygermany.com/products" />
      </Helmet>

      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Our Digital Store</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">All Products</h1>
          <p className="text-white/75">Trusted resources for your Study in Germany application</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Horizontal Filter Bar */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Category pills */}
            <div className="flex-1 overflow-x-auto scrollbar-none">
              <ul className="flex gap-2 list-none m-0 p-0 flex-nowrap md:flex-wrap overflow-x-auto whitespace-nowrap scrollbar-none pb-1 md:pb-0">
                <li>
                  <button
                    onClick={() => setParam('category', '')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!currentCat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id} className="flex-shrink-0">
                    <button
                      onClick={() => setParam('category', cat.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentCat === cat.slug ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right: Search box */}
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
                <input
                  type="text"
                  defaultValue={search}
                  placeholder="Search products…"
                  onChange={(e) => {
                    clearTimeout(window._searchTimer)
                    window._searchTimer = setTimeout(() => setParam('q', e.target.value), 400)
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-500 text-sm">
                  {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-card animate-pulse">
                      <div className="h-40 bg-gray-200 rounded-t-2xl" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-5 bg-gray-200 rounded" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-card p-16 text-center">
                  <span className="material-icons-round text-5xl text-gray-300 mb-4 block">search_off</span>
                  <h3 className="font-serif font-bold text-gray-900 text-xl mb-2">No products found</h3>
                  <p className="text-gray-500 text-sm">Try a different category or search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setParam('page', String(i + 1))}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
        </div>
      </section>
    </>
  )
}
