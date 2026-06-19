import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

const EMPTY_FORM = { code: '', type: 'percent', value: '', min_amount: '', max_uses: '', valid_from: '', valid_until: '' }

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    setCoupons(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.code.trim() || !form.value) { toast.error('Code and value are required.'); return }
    setSaving(true)
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: parseFloat(form.value),
      min_amount: form.min_amount ? parseFloat(form.min_amount) : 0,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      valid_from: form.valid_from || null,
      valid_until: form.valid_until || null,
      is_active: true,
    }
    const { error } = await supabase.from('coupons').insert(payload)
    if (error) {
      toast.error('Failed: ' + error.message)
    } else {
      toast.success('Coupon created!')
      setForm(EMPTY_FORM)
      setShowForm(false)
      load()
    }
    setSaving(false)
  }

  async function toggleActive(coupon) {
    await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id)
    load()
  }

  async function deleteCoupon(id) {
    if (!confirm('Delete this coupon?')) return
    await supabase.from('coupons').delete().eq('id', id)
    toast.success('Coupon deleted.')
    load()
  }

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#c0392b] py-16 px-6 text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Admin Panel</p>
        <h1 className="font-serif text-4xl font-bold text-white mb-1">Coupons</h1>
        <p className="text-white/70 text-sm">Manage discount codes</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900">Coupons</h2>
          <button onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors">
            <span className="material-icons-round text-base">{showForm ? 'close' : 'add'}</span>
            {showForm ? 'Cancel' : 'New Coupon'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Create Coupon</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input type="text" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
                  placeholder="SAVE20"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary font-mono uppercase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white">
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value * {form.type === 'percent' ? '(%)' : '(₹)'}
                </label>
                <input type="number" step="0.01" min="0" value={form.value} onChange={e => set('value', e.target.value)}
                  placeholder={form.type === 'percent' ? '20' : '50'}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                <input type="number" step="0.01" min="0" value={form.min_amount} onChange={e => set('min_amount', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                <input type="number" min="1" value={form.max_uses} onChange={e => set('max_uses', e.target.value)}
                  placeholder="Unlimited"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                <input type="datetime-local" value={form.valid_from} onChange={e => set('valid_from', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input type="datetime-local" value={form.valid_until} onChange={e => set('valid_until', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-3 flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-icons-round text-base">save</span>}
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading…</div>
          ) : coupons.length === 0 ? (
            <div className="p-16 text-center">
              <span className="material-icons-round text-5xl text-gray-200 block mb-3">local_offer</span>
              <p className="text-gray-500">No coupons yet. Create your first one above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Code', 'Discount', 'Min Order', 'Uses', 'Valid Until', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono font-bold text-gray-900">{c.code}</td>
                      <td className="px-5 py-3 text-gray-700">
                        {c.type === 'percent' ? `${c.value}%` : `₹${Number(c.value).toFixed(2)}`}
                      </td>
                      <td className="px-5 py-3 text-gray-500">₹{Number(c.min_amount).toFixed(0)}</td>
                      <td className="px-5 py-3 text-gray-500">{c.uses}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {c.valid_until ? new Date(c.valid_until).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 flex gap-2">
                        <button onClick={() => toggleActive(c)}
                          className="text-xs border border-gray-200 px-3 py-1 rounded-lg hover:border-primary hover:text-primary transition-colors">
                          {c.is_active ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => deleteCoupon(c.id)}
                          className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
