import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../supabase'

const PER_PAGE = 9

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const currentCat = searchParams.get('category') || ''
  const search = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  // Fetch unique categories dynamically from the database blogs table
  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase
      .from('blogs')
      .select('category')
      .then(({ data, error }) => {
        if (error) throw error
        const uniqueCats = Array.from(new Set((data || []).map(b => b.category).filter(Boolean)))
        setCategories(uniqueCats)
      })
      .catch(err => {
        console.error('Error fetching blog categories:', err)
      })
  }, [])

  // Fetch blogs with filters and pagination
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    const from = (page - 1) * PER_PAGE
    const to = from + PER_PAGE - 1

    let query = supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, to)

    if (currentCat) {
      query = query.eq('category', currentCat)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    query
      .then(({ data, count, error }) => {
        if (error) throw error
        setBlogs(data || [])
        setTotal(count || 0)
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err)
        toast.error(`Failed to load blogs: ${err.message || 'Check database connection.'}`)
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

  // Function to format the date to a nice readable string
  function formatDate(dateStr) {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Knowledge Base</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">Our Blogs</h1>
          <p className="text-white/75">Tips, guides, and updates for your journey to study in Germany</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-card p-5 sticky top-20">
                <h3 className="font-semibold text-gray-900 mb-3 font-serif">Search</h3>
                <div className="relative mb-6">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
                  <input
                    type="text"
                    defaultValue={search}
                    placeholder="Search articles…"
                    onChange={(e) => {
                      clearTimeout(window._blogSearchTimer)
                      window._blogSearchTimer = setTimeout(() => setParam('q', e.target.value), 400)
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <h3 className="font-semibold text-gray-900 mb-4 font-serif">Categories</h3>
                <ul className="space-y-1 list-none m-0 p-0">
                  <li>
                    <button
                      onClick={() => setParam('category', '')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${!currentCat ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                      All Categories
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setParam('category', cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${currentCat === cat ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Listing */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-500 text-sm">
                  {loading ? 'Loading…' : `${total} article${total !== 1 ? 's' : ''} found`}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-card animate-pulse overflow-hidden">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-card p-16 text-center">
                  <span className="material-icons-round text-5xl text-gray-300 mb-4 block">search_off</span>
                  <h3 className="font-serif font-bold text-gray-900 text-xl mb-2">No articles found</h3>
                  <p className="text-gray-500 text-sm">Try searching for something else or changing categories.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {blogs.map((b) => (
                    <article key={b.id} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow group flex flex-col h-full">
                      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                        {b.image ? (
                          <img
                            src={b.image}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                            <span className="material-icons-round text-5xl">article</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          {b.category}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-semibold">
                          <span className="flex items-center gap-1">
                            <span className="material-icons-round text-xs">calendar_today</span>
                            {formatDate(b.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-icons-round text-xs">schedule</span>
                            {b.read_time}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {b.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                          {b.excerpt}
                        </p>
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <Link to={`/blog/${b.slug}`} className="w-full block text-center py-2.5 px-4 bg-primary text-white hover:bg-primary-dark rounded-xl text-sm font-bold transition-all shadow-sm">
                            Read Full Article
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setParam('page', String(i + 1))}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
