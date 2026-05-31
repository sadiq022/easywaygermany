import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { loadProducts() }, [])

  async function toggleActive(product) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)
    if (error) {
      toast.error('Failed to update product.')
    } else {
      toast.success('Product updated.')
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete product.')
    } else {
      toast.success('Product deleted.')
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const AdminNav = () => (
    <div className="flex flex-wrap gap-1 bg-white rounded-xl shadow-card p-1 mb-8 w-fit">
      {[
        { to: '/admin', label: 'Overview', icon: 'dashboard' },
        { to: '/admin/products', label: 'Products', icon: 'store', active: true },
        { to: '/admin/categories', label: 'Product Categories', icon: 'category' },
        { to: '/admin/blogs', label: 'Blogs', icon: 'article' },
        { to: '/admin/blog-categories', label: 'Blog Categories', icon: 'bookmarks' },
      ].map(({ to, label, icon, active }) => (
        <Link key={to} to={to}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          <span className="material-icons-round text-base">{icon}</span>
          {label}
        </Link>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="page-hero !py-12 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-4">
          <div>
            <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Administrative Center</div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">Products</h1>
            <p className="text-white/75 text-sm max-w-xl mx-auto">{products.length} total products</p>
          </div>
          <div className="mt-2">
            <Link to="/admin/products/add" className="flex items-center gap-1.5 bg-white text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm w-fit">
              <span className="material-icons-round text-base">add</span> Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AdminNav />

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Product', 'Category', 'Price', 'Status', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                      No products yet.{' '}
                      <Link to="/admin/products/add" className="text-primary font-semibold">Add one</Link>
                    </td>
                  </tr>
                ) : products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-xs truncate">{p.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{p.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.categories?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">₹{Number(p.price).toFixed(2)}</span>
                      {p.original_price && (
                        <span className="text-xs text-gray-400 line-through ml-1">₹{Number(p.original_price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleActive(p)}
                        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          p.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        <span className="material-icons-round text-xs">{p.is_active ? 'toggle_on' : 'toggle_off'}</span>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {p.is_featured ? (
                        <span className="text-yellow-500 material-icons-round text-base">star</span>
                      ) : (
                        <span className="text-gray-300 material-icons-round text-base">star_border</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to={`/products/${p.slug}`}
                          className="text-xs text-gray-500 hover:text-primary border border-gray-200 px-2.5 py-1 rounded-lg transition-colors font-semibold">
                          View
                        </Link>
                        <Link to={`/admin/products/edit/${p.id}`}
                          className="text-xs text-blue-500 hover:text-blue-700 border border-blue-100 hover:border-blue-300 px-2.5 py-1 rounded-lg transition-colors font-semibold">
                          Edit
                        </Link>
                        <button onClick={() => deleteProduct(p.id)}
                          className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 px-2.5 py-1 rounded-lg transition-colors font-semibold">
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
    </div>
  )
}
