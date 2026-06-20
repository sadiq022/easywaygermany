import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import AdminLayout from '../../components/AdminLayout'

const STATUS_COLORS = {
  new:       'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  closed:    'bg-gray-100 text-gray-500',
}

function LeadModal({ lead, onClose, onStatusChange, onDelete }) {
  if (!lead) return null

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#c0392b] rounded-t-2xl px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Lead Details</p>
            <h2 className="text-white font-serif text-2xl font-bold">{lead.name}</h2>
            <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white capitalize`}>
              {lead.status}
            </span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white mt-1">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <a href={`mailto:${lead.email}`} className="text-sm font-medium text-primary hover:underline break-all">
                {lead.email}
              </a>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
              <p className="text-sm font-medium text-gray-800">{lead.phone || '—'}</p>
            </div>
          </div>

          {/* Field of interest */}
          {lead.field && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Field / Course</p>
              <p className="text-sm font-medium text-gray-800">{lead.field}</p>
            </div>
          )}

          {/* Message */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {lead.message || 'No message provided.'}
            </p>
          </div>

          {/* Date */}
          <div className="text-xs text-gray-400">
            Submitted on {new Date(lead.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>

          {/* Status change */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {['new', 'contacted', 'converted', 'closed'].map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(lead.id, s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-all border ${
                    lead.status === s
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
            <a href={`mailto:${lead.email}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl transition-colors">
              <span className="material-icons-round text-base">email</span>
              Send Email
            </a>
            {lead.phone && (
              <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors">
                <span className="material-icons-round text-base">chat</span>
                WhatsApp
              </a>
            )}
            <button onClick={() => { onDelete(lead.id); onClose() }}
              className="flex items-center gap-1.5 text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors ml-auto">
              <span className="material-icons-round text-base">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState(null)

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
    setSelectedLead(prev => prev?.id === id ? { ...prev, status } : prev)
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
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Click any row to see full details</p>
              <span className="text-xs font-semibold text-gray-400">{leads.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Field', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map(lead => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-primary/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap group-hover:text-primary">
                        {lead.name}
                      </td>
                      <td className="px-5 py-4 text-gray-600 max-w-[180px] truncate">{lead.email}</td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{lead.phone || '—'}</td>
                      <td className="px-5 py-4 text-gray-500 max-w-[140px] truncate">{lead.field || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <LeadModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={updateStatus}
        onDelete={deleteLead}
      />
    </AdminLayout>
  )
}
