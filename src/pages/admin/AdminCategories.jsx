import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('name')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { loadCategories() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const { error } = await supabase.from('categories').insert({
      name: form.name.trim(),
      slug: toSlug(form.name),
      description: form.description || null,
    })
    if (error) {
      toast.error('Failed to add category: ' + error.message)
    } else {
      toast.success('Category added!')
      setForm({ name: '', description: '' })
      loadCategories()
    }
    setSaving(false)
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this category? Products in it will be unlinked.')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete category: ' + error.message)
    } else {
      toast.success('Category deleted.')
      setCategories(prev => prev.filter(c => c.id !== id))
    }
  }

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#c0392b] py-16 px-6 text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Admin Panel</p>
        <h1 className="font-serif text-4xl font-bold text-white mb-1">Product Categories</h1>
        <p className="text-white/70 text-sm">Manage product categories</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid md:grid-cols-3 gap-6">
          {/* Add form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Add Category</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Research Papers"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  {form.name && (
                    <p className="text-xs text-gray-400 mt-1 font-mono">slug: {toSlug(form.name)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit" disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-60">
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-icons-round text-base">add</span>
                  )}
                  Add Category
                </button>
              </form>
            </div>
          </div>

          {/* Categories list */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold text-gray-900">All Categories ({categories.length})</h2>
              </div>
              {loading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="p-16 text-center text-gray-400">No categories yet.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{cat.slug}</div>
                        {cat.description && (
                          <div className="text-xs text-gray-500 mt-0.5">{cat.description}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Link to={`/products?category=${cat.slug}`}
                          className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          View products
                        </Link>
                        <button onClick={() => deleteCategory(cat.id)}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <span className="material-icons-round text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
