import { useState } from 'react'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', field: '', message: '' })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    // Simulate sending (integrate email service like Resend/EmailJS here)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', phone: '', field: '', message: '' })
    setSending(false)
  }

  return (
    <>
      <Helmet>
        <title>Contact Us – Book a Free Consultation | EasyWay Germany</title>
        <meta name="description" content="Get in touch with EasyWay Germany. Book a free consultation for studying in Germany. Reach us via email, phone, or WhatsApp. Based in Dresden, Germany." />
        <meta property="og:title" content="Contact EasyWay Germany – Book Your Free Consultation" />
        <meta property="og:description" content="Talk to our experts about studying in Germany. Free consultation available via WhatsApp, email, or our contact form." />
        <meta property="og:url" content="https://easywaygermany.com/contact" />
        <link rel="canonical" href="https://easywaygermany.com/contact" />
      </Helmet>

      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Get In Touch</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-white/75">Book your free consultation and start your journey today</p>
        </div>
      </div>

      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div>
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Reach Us</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
              Let's Talk About Your<br />
              <span className="text-primary">Germany Dreams</span>
            </h2>
            <p className="text-gray-600 mb-8">Our expert counselors are ready to help you every step of the way. Book a free 30-minute consultation.</p>

            <div className="space-y-5">
              {[
                { icon: 'mail', label: 'Email', value: 'info@easywaygermany.com' },
                { icon: 'phone', label: 'Phone / WhatsApp', value: '+49 1521 1234567' },
                { icon: 'location_on', label: 'Location', value: 'Berlin, Germany' },
                { icon: 'schedule', label: 'Working Hours', value: 'Mon–Sat: 9:00 AM – 6:00 PM CET' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons-round text-primary text-base">{icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{label}</div>
                    <div className="text-gray-600 text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h3 className="font-serif font-bold text-gray-900 text-xl mb-6">Book Consultation</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">person</span>
                  <input
                    type="text" required placeholder="Full name"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">mail</span>
                  <input
                    type="email" required placeholder="you@example.com"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp</label>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">phone</span>
                  <input
                    type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Interest</label>
                <select
                  value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white">
                  <option value="">Select your field</option>
                  {['Computer Science / IT', 'Electrical Engineering', 'Mechanical Engineering', 'MBA / Management', 'Data Science / AI', 'Biotechnology', 'Other'].map(f => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea
                  rows={4} placeholder="Tell us about your profile and goals…"
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-60">
                <span className="material-icons-round text-base">{sending ? 'hourglass_empty' : 'send'}</span>
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
