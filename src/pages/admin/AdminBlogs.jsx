import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function loadBlogs() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false })
    if (error) {
      toast.error('Failed to load blogs.')
    } else {
      setBlogs(data || [])
    }
    setLoading(false)
  }

  useEffect(() => { loadBlogs() }, [])

  async function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete blog post.')
    } else {
      toast.success('Blog post deleted.')
      setBlogs(prev => prev.filter(b => b.id !== id))
    }
  }

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#c0392b] py-16 px-6 text-center relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Admin Panel</p>
            <h1 className="font-serif text-4xl font-bold text-white mb-1">Blogs</h1>
            <p className="text-white/70 text-sm">{blogs.length} total blog posts</p>
          </div>
          <Link to="/admin/blogs/add" className="flex items-center gap-1.5 bg-white text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm">
            <span className="material-icons-round text-base">add</span> Add Blog
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-8">
          <div className="relative">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
            <input
              type="text"
              placeholder="Search blogs by title or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-gray-50/50"
            />
          </div>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Blog Details', 'Category', 'Read Time', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                      No blogs found.{' '}
                      <Link to="/admin/blogs/add" className="text-primary font-semibold">Create one</Link>
                    </td>
                  </tr>
                ) : filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 max-w-xs truncate">{b.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">{b.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
                        {b.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{b.read_time}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {b.date ? new Date(b.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to={`/blog/${b.slug}`}
                          className="text-xs text-gray-500 hover:text-primary border border-gray-200 px-2.5 py-1 rounded-lg transition-colors">
                          View
                        </Link>
                        <Link to={`/admin/blogs/edit/${b.id}`}
                          className="text-xs text-blue-500 hover:text-blue-700 border border-blue-100 hover:border-blue-300 px-2.5 py-1 rounded-lg transition-colors font-medium">
                          Edit
                        </Link>
                        <button onClick={() => deleteBlog(b.id)}
                          className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 px-2.5 py-1 rounded-lg transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
