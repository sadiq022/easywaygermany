import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminBlogCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '' })
  const [saving, setSaving] = useState(false)

  async function loadCategories() {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')
    if (error) {
      toast.error('Failed to load blog categories.')
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }

  useEffect(() => { loadCategories() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const { error } = await supabase.from('blog_categories').insert({
      name: form.name.trim(),
      slug: toSlug(form.name),
    })
    if (error) {
      toast.error('Failed to add category: ' + error.message)
    } else {
      toast.success('Blog category added!')
      setForm({ name: '' })
      loadCategories()
    }
    setSaving(false)
  }

  async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this blog category?')) return
    const { error } = await supabase.from('blog_categories').delete().eq('id', id)
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
        <h1 className="font-serif text-4xl font-bold text-white mb-1">Blog Categories</h1>
        <p className="text-white/70 text-sm">Manage categories for your blogs</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid md:grid-cols-3 gap-6">
          {/* Add Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Add Blog Category</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Visa Assistance"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  {form.name && (
                    <p className="text-xs text-gray-400 mt-1 font-mono">slug: {toSlug(form.name)}</p>
                  )}
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

          {/* Categories List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold text-gray-900">All Blog Categories ({categories.length})</h2>
              </div>
              {loading ? (
                <div className="p-6 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="p-16 text-center text-gray-400">No blog categories yet.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{cat.slug}</div>
                      </div>
                      <button onClick={() => deleteCategory(cat.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1">
                        <span className="material-icons-round text-base">delete</span>
                      </button>
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
