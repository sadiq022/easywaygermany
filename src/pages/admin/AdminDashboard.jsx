import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

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
    { icon: 'group',           label: 'Total Users',      value: stats.users },
    { icon: 'store',           label: 'Total Products',   value: stats.products },
    { icon: 'article',         label: 'Total Blogs',      value: stats.blogs },
    { icon: 'receipt',         label: 'Completed Sales',  value: stats.purchases },
    { icon: 'currency_rupee',  label: 'Total Revenue',    value: `₹${stats.revenue.toFixed(2)}` },
  ]

  return (
    <AdminLayout>
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#c0392b] py-16 px-6 text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Management Panel</p>
        <h1 className="font-serif text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/70 text-sm">EasyWay Germany — control everything from here</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
                <div className="h-10 w-10 bg-gray-100 rounded-xl mb-3" />
                <div className="h-6 bg-gray-100 rounded mb-2 w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {cards.map(({ icon, label, value }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <span className="material-icons-round text-primary text-[18px]">{icon}</span>
                </div>
                <div className="font-bold text-2xl text-gray-900 leading-none mb-1">{value}</div>
                <div className="text-xs text-gray-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent purchases */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="material-icons-round text-primary text-base">receipt_long</span>
            <h2 className="font-semibold text-gray-900 text-sm">Recent Purchases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['User', 'Product', 'Amount', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                      <span className="material-icons-round block text-3xl text-gray-200 mb-2">receipt</span>
                      No purchases yet
                    </td>
                  </tr>
                ) : recent.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.profiles?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{p.products?.title || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{Number(p.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.status === 'completed' ? 'bg-green-50 text-green-700' :
                        p.status === 'refunded'  ? 'bg-red-50 text-red-600' :
                        'bg-yellow-50 text-yellow-700'
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
    </AdminLayout>
  )
}
