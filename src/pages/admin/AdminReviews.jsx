import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`material-icons-round text-sm ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>star</span>
      ))}
    </span>
  )
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('reviews')
      .select('*, products(title, slug), profiles(name)')
      .order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleApproval(review) {
    await supabase.from('reviews').update({ is_approved: !review.is_approved }).eq('id', review.id)
    load()
  }

  async function deleteReview(id) {
    if (!confirm('Delete this review permanently?')) return
    await supabase.from('reviews').delete().eq('id', id)
    toast.success('Review deleted.')
    load()
  }

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#c0392b] py-16 px-6 text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Admin Panel</p>
        <h1 className="font-serif text-4xl font-bold text-white mb-1">Reviews</h1>
        <p className="text-white/70 text-sm">Manage product reviews</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center">
            <span className="material-icons-round text-5xl text-gray-200 block mb-3">star</span>
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <Stars rating={r.rating} />
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {r.is_approved ? 'Approved' : 'Hidden'}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{r.profiles?.name || 'Anonymous'}</p>
                    <Link to={`/products/${r.products?.slug}`} className="text-xs text-primary hover:underline">{r.products?.title}</Link>
                    {r.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toggleApproval(r)}
                      className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition-colors">
                      {r.is_approved ? 'Hide' : 'Approve'}
                    </button>
                    <button onClick={() => deleteReview(r.id)}
                      className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
