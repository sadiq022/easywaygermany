import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

export default function AdminSettings() {
  const [keyId, setKeyId] = useState('')
  const [keySecret, setKeySecret] = useState('')
  const [mode, setMode] = useState('test')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('key, value')
      if (data) {
        const map = Object.fromEntries(data.map(r => [r.key, r.value]))
        setKeyId(map.razorpay_key_id || '')
        setKeySecret(map.razorpay_key_secret || '')
        setMode(map.razorpay_mode || 'test')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function upsert(key, value) {
    await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!keyId.trim()) { toast.error('Key ID is required.'); return }
    setSaving(true)
    await Promise.all([
      upsert('razorpay_key_id',     keyId.trim()),
      upsert('razorpay_key_secret', keySecret.trim()),
      upsert('razorpay_mode',       mode),
    ])
    toast.success('Razorpay settings saved!')
    setSaving(false)
  }

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#c0392b] py-16 px-6 text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Admin Panel</p>
        <h1 className="font-serif text-4xl font-bold text-white mb-1">Settings</h1>
        <p className="text-white/70 text-sm">Payment gateway configuration</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <span className="material-icons-round text-white text-base">payment</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Razorpay Payment Gateway</h2>
                  <p className="text-xs text-gray-500">Keys are stored securely in the database</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-5 text-sm text-amber-800">
                <strong>Important:</strong> Use Test keys for testing, Live keys for real payments. Never share your Key Secret publicly.
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select value={mode} onChange={e => setMode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white">
                    <option value="test">Test Mode</option>
                    <option value="live">Live Mode</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key ID <span className="text-gray-400 font-normal">(starts with rzp_test_ or rzp_live_)</span>
                  </label>
                  <input
                    type="text" value={keyId} onChange={e => setKeyId(e.target.value)}
                    placeholder="rzp_test_xxxxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Secret</label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'} value={keySecret}
                      onChange={e => setKeySecret(e.target.value)}
                      placeholder="Your Razorpay Key Secret"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary font-mono pr-11"
                    />
                    <button type="button" onClick={() => setShowSecret(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                      <span className="material-icons-round text-base">{showSecret ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Used for server-side verification. Keep this private.</p>
                </div>

                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-icons-round text-base">save</span>}
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
