import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('purchases')
      .select('*, products(id, title, slug, price, categories(name, slug))')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPurchases(data || [])
        setLoading(false)
      })
  }, [user])

  async function handleDownload(purchase) {
    setDownloading(purchase.id)

    // Fetch file_path fresh from the purchase record — never cached in component state
    const { data: row, error: fetchError } = await supabase
      .from('purchases')
      .select('products(file_path)')
      .eq('id', purchase.id)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .single()

    const filePath = row?.products?.file_path
    if (fetchError || !filePath) {
      toast.error('File not available yet. Contact support.')
      setDownloading(null)
      return
    }

    const { data, error } = await supabase.storage
      .from('products')
      .createSignedUrl(filePath, 3600)

    if (error || !data?.signedUrl) {
      toast.error('Could not generate download link. Please try again.')
    } else {
      window.open(data.signedUrl, '_blank')
      toast.success('Download started!')
    }
    setDownloading(null)
  }

  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.amount), 0)
  const name = profile?.name || user?.email?.split('@')[0] || 'there'

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 to-primary py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold font-serif text-xl">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white">Hello, {name}!</h1>
              <p className="text-white/70 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { icon: 'shopping_bag', label: 'Total Purchases', value: purchases.length },
              { icon: 'currency_rupee', label: 'Total Spent', value: `₹${totalSpent.toFixed(2)}` },
              { icon: 'download', label: 'Files Available', value: purchases.length },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                <span className="material-icons-round text-2xl text-yellow-400 mb-1 block">{icon}</span>
                <div className="font-bold text-xl">{value}</div>
                <div className="text-xs text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">My Purchases</h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-card p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-16 text-center">
              <span className="material-icons-round text-6xl text-gray-200 mb-4 block">shopping_bag</span>
              <h3 className="font-serif font-bold text-gray-900 text-xl mb-2">No purchases yet</h3>
              <p className="text-gray-500 text-sm mb-6">Browse our products and find the perfect resources for your Study in Germany application.</p>
              <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
                <span className="material-icons-round text-base">store</span>
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => {
                const product = purchase.products
                const catSlug = product?.categories?.slug || ''
                const catName = product?.categories?.name || ''
                return (
                  <div key={purchase.id} className="bg-white rounded-2xl shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 cat-${catSlug || 'application-guides'}`}>
                      <span className="material-icons-round text-white text-2xl">description</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">{product?.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{catName}</span>
                        <span className="text-xs text-gray-500">₹{Number(purchase.amount).toFixed(2)}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(purchase.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-success font-semibold flex items-center gap-0.5">
                          <span className="material-icons-round text-xs">check_circle</span> Completed
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link to={`/products/${product?.slug}`}
                        className="text-xs border border-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:border-primary hover:text-primary transition-colors">
                        View
                      </Link>
                      <button
                        onClick={() => handleDownload(purchase)}
                        disabled={downloading === purchase.id}
                        className="flex items-center gap-1 text-xs bg-success text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 font-semibold">
                        <span className="material-icons-round text-sm">{downloading === purchase.id ? 'hourglass_empty' : 'download'}</span>
                        {downloading === purchase.id ? '…' : 'Download'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
