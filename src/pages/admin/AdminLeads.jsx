import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

const STATUS_COLORS = {
  new:        'bg-blue-100 text-blue-700',
  contacted:  'bg-yellow-100 text-yellow-700',
  converted:  'bg-green-100 text-green-700',
  closed:     'bg-gray-100 text-gray-500',
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) toast.error('Failed to load leads.')
    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  async function deleteLead(id) {
    if (!confirm('Delete this lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    toast.success('Lead deleted.')
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#c0392b] py-16 px-6 text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Admin Panel</p>
        <h1 className="font-serif text-4xl font-bold text-white mb-1">Leads</h1>
        <p className="text-white/70 text-sm">{leads.length} contact form submissions</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl shadow-card animate-pulse" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center">
            <span className="material-icons-round text-5xl text-gray-200 block mb-3">contact_phone</span>
            <p className="text-gray-500 font-medium">No leads yet.</p>
            <p className="text-gray-400 text-sm mt-1">Submissions from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Name', 'Contact', 'Field', 'Message', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{lead.name}</td>
                      <td className="px-5 py-4">
                        <div className="text-gray-700">{lead.email}</div>
                        {lead.phone && <div className="text-gray-400 text-xs mt-0.5">{lead.phone}</div>}
                      </td>
                      <td className="px-5 py-4 text-gray-600 max-w-[140px] truncate">{lead.field || '—'}</td>
                      <td className="px-5 py-4 text-gray-600 max-w-[220px]">
                        <p className="line-clamp-2 text-xs leading-relaxed">{lead.message || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={e => updateStatus(lead.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <a href={`mailto:${lead.email}`}
                            className="text-xs text-blue-500 hover:text-blue-700 border border-blue-100 hover:border-blue-300 px-2.5 py-1 rounded-lg transition-colors">
                            Email
                          </a>
                          {lead.phone && (
                            <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                              className="text-xs text-green-600 hover:text-green-800 border border-green-100 hover:border-green-300 px-2.5 py-1 rounded-lg transition-colors">
                              WhatsApp
                            </a>
                          )}
                          <button onClick={() => deleteLead(lead.id)}
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
        )}
      </div>
    </AdminLayout>
  )
}
