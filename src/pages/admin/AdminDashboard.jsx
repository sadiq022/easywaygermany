import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, purchases: 0, revenue: 0, blogs: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [usersRes, productsRes, purchasesRes, recentRes, blogsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('purchases').select('amount').eq('status', 'completed'),
        supabase.from('purchases')
          .select('*, profiles(name), products(title)')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
      ])

      const revenue = (purchasesRes.data || []).reduce((s, p) => s + Number(p.amount), 0)
      setStats({
        users: usersRes.count || 0,
        products: productsRes.count || 0,
        purchases: (purchasesRes.data || []).length,
        revenue,
        blogs: blogsRes.count || 0,
      })
      setRecent(recentRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { icon: 'group', label: 'Total Users', value: stats.users, color: 'bg-blue-500' },
    { icon: 'store', label: 'Total Products', value: stats.products, color: 'bg-primary' },
    { icon: 'article', label: 'Total Blogs', value: stats.blogs, color: 'bg-indigo-500' },
    { icon: 'receipt', label: 'Completed Sales', value: stats.purchases, color: 'bg-green-500' },
    { icon: 'currency_rupee', label: 'Total Revenue', value: `₹${stats.revenue.toFixed(2)}`, color: 'bg-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="page-hero !py-12 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Administrative Center</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/75 text-sm max-w-xl mx-auto">EasyWay Germany management panel</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Nav tabs */}
        <div className="flex flex-wrap gap-1 bg-white rounded-xl shadow-card p-1 mb-8 w-fit overflow-x-auto">
          {[
            { to: '/admin',                 label: 'Overview',           icon: 'dashboard' },
            { to: '/admin/products',        label: 'Products',           icon: 'store' },
            { to: '/admin/categories',      label: 'Product Categories', icon: 'category' },
            { to: '/admin/blogs',           label: 'Blogs',              icon: 'article' },
            { to: '/admin/blog-categories', label: 'Blog Categories',    icon: 'bookmarks' },
            { to: '/admin/coupons',         label: 'Coupons',            icon: 'local_offer' },
            { to: '/admin/reviews',         label: 'Reviews',            icon: 'star' },
            { to: '/admin/settings',        label: 'Settings',           icon: 'settings' },
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${to === '/admin' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <span className="material-icons-round text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-5 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3" />
                <div className="h-6 bg-gray-200 rounded mb-1 w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {cards.map(({ icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl shadow-card p-5">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <span className="material-icons-round text-white text-base">{icon}</span>
                </div>
                <div className="font-bold text-2xl text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent purchases */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Purchases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['User', 'Product', 'Amount', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">No purchases yet</td>
                  </tr>
                ) : recent.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.profiles?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{p.products?.title || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{Number(p.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.status === 'completed' ? 'bg-green-100 text-green-700' :
                        p.status === 'refunded' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.status}
                      </span>
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
