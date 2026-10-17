import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../supabase'
import PhoneInput from './PhoneInput'
import { isPlausiblePhone } from '../data/countries'

const INTEREST_FIELDS = [
  'Computer Science / IT',
  'Data Science / AI',
  'Mechanical Engineering',
  'Electrical Engineering',
  'MBA / Management',
  'Biotechnology',
  'Bachelors in Germany',
  'Public University Admission',
  'Visa & Blocked Account',
  'Other'
]

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    field: '',
    message: ''
  })

  useEffect(() => {
    // Check if user already dismissed or submitted in this session
    const dismissed = sessionStorage.getItem('lead_popup_dismissed')
    const alreadySubmitted = sessionStorage.getItem('lead_popup_submitted')

    if (dismissed || alreadySubmitted) return

    // 10-second timer to open popup
    const timer = setTimeout(() => {
      // Recheck before opening
      if (!sessionStorage.getItem('lead_popup_dismissed') && !sessionStorage.getItem('lead_popup_submitted')) {
        setIsOpen(true)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  function handleClose() {
    setIsOpen(false)
    sessionStorage.setItem('lead_popup_dismissed', 'true')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Please enter your name.')
      return
    }

    if (!form.phone || !form.phone.trim()) {
      toast.error('Please enter your phone number with country code.')
      return
    }

    if (!isPlausiblePhone(form.phone)) {
      toast.error('Please enter a valid phone number.')
      return
    }

    setSubmitting(true)

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      field: form.field || null,
      message: form.message.trim() || 'Submitted via 10-second Website Popup',
      status: 'new'
    }

    const { error } = await supabase.from('leads').insert(payload)

    if (error) {
      console.error('Lead popup submit error:', error)
      toast.error('Failed to submit. Please try contacting us on WhatsApp!')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    setSubmitted(true)
    sessionStorage.setItem('lead_popup_submitted', 'true')
    toast.success('Thank you! Our expert counselor will reach out to you soon.')

    // Auto-close after 2.5 seconds
    setTimeout(() => {
      setIsOpen(false)
    }, 2500)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) handleClose()
      }}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[390px] overflow-hidden border border-gray-100 transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={submitting}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <span className="material-icons-round text-base leading-none">close</span>
        </button>

        {/* Modal Banner */}
        <div className="bg-gradient-to-br from-[#7a0000] via-primary to-[#b82b1c] px-5 py-4 text-white relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
            <span className="material-icons-round text-[11px]">school</span>
            Free Consultation
          </div>
          <h3 className="font-serif text-xl font-bold leading-snug mb-0.5 text-white">
            Plan Your Studies in Germany
          </h3>
          <p className="text-white/85 text-xs font-medium leading-tight">
            Get 1-on-1 guidance from students living in Dresden.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5">
          {submitted ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <span className="material-icons-round text-2xl">check_circle</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-gray-900">Request Received!</h4>
              <p className="text-gray-600 text-xs max-w-xs mx-auto">
                Thank you, <strong>{form.name}</strong>. Our counselors will connect with you on WhatsApp/Phone shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">person</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary transition-colors bg-white font-medium"
                  />
                </div>
              </div>

              {/* Phone with Country Code */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phone / WhatsApp Number <span className="text-primary">*</span>
                </label>
                <PhoneInput
                  compact={true}
                  value={form.phone}
                  onChange={(phone) => setForm(prev => ({ ...prev, phone }))}
                  placeholder="Enter phone number"
                />
              </div>

              {/* Field of Interest */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Field of Interest
                </label>
                <div className="relative">
                  <select
                    value={form.field}
                    onChange={(e) => setForm(prev => ({ ...prev, field: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary transition-colors bg-white font-medium text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="">Select your target course / field</option>
                    {INTEREST_FIELDS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <span className="material-icons-round absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Message / Questions <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your GPA, intake, or queries..."
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary transition-colors resize-none font-medium text-gray-700"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-1"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons-round text-sm">send</span>
                    <span>Request Free Callback</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-0.5 text-[10px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-icons-round text-green-500 text-[11px]">verified</span>
                  100% Free
                </span>
                <span>•</span>
                <span>Response within 24 hours</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
