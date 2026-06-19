import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const WA = 'https://wa.me/919119740154?text=Hi%20EasyWay%20Germany%2C%20I%20am%20interested%20in%20your%20visa%20assistance%20package.'

const FAQS = [
  {
    q: 'What documents do I need for a German student visa from India?',
    a: 'You need: valid passport, university admission letter (Zulassungsbescheid), blocked account proof (€11,904), APS certificate, health insurance, Visa SOP, cover letter, biometric photos, and proof of accommodation. We help you prepare and verify all of these.',
  },
  {
    q: 'What is a blocked account (Sperrkonto) and how much do I need?',
    a: 'A blocked account is a special German bank account that holds your living expenses (€11,904 for 2026) as proof of financial support for your visa. The money is released monthly (€992/month) once you arrive in Germany. We guide you through opening it with providers like Expatrio or Fintiba.',
  },
  {
    q: 'What is the difference between a University SOP and a Visa SOP?',
    a: 'A University SOP (800–1000 words) focuses on your academic goals, research interests, and career ambitions. A Visa SOP (max 500 words) is written for the German embassy — it emphasises your study plan, financial situation, and clear intent to return to India after graduation. They are two completely different documents.',
  },
  {
    q: 'How long does it take to get a German student visa from India?',
    a: 'The German student visa typically takes 6–12 weeks after your VFS appointment. Appointment availability varies by city — Mumbai, Delhi, Chennai, and Hyderabad VFS offices can have waiting times of 4–8 weeks. We recommend starting the visa process at least 4–5 months before your course begins.',
  },
  {
    q: 'Do I need APS certification for Germany?',
    a: 'Yes. Indian students applying to German universities must get their academic documents verified by APS (Akademische Prüfstelle) in New Delhi. This is mandatory for your student visa application. APS processing takes 4–8 weeks and costs €75. We advise you to start APS early in parallel with your university applications.',
  },
  {
    q: 'What is a mock visa interview and why do I need it?',
    a: 'German embassy officers may ask questions about your study plan, financial situation, choice of university, and return intent. A mock interview prepares you to answer confidently, avoid common mistakes, and understand what the embassy is looking for. Many visa rejections happen because students are unprepared for these questions.',
  },
  {
    q: 'Can I work while on a German student visa?',
    a: 'Yes — Indian students can work up to 140 full days (or 280 half-days) per year, which is roughly 20 hours/week during the semester. Mandatory internships listed in your degree curriculum are exempt from this limit. You can work full-time during semester breaks within the annual limit.',
  },
  {
    q: 'What health insurance do I need for a German student visa?',
    a: 'You need travel health insurance covering Germany for the duration of your visa application. Once in Germany, you must enrol in public statutory health insurance (GKV) — the most common options are TK, AOK, and Barmer. We guide you through selecting the right insurance before your VFS appointment.',
  },
]

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl transition-all ${open ? 'border-primary/30 bg-primary/5' : 'border-gray-100 bg-white'}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span className="font-semibold text-gray-900 text-sm md:text-base leading-snug">{q}</span>
        <span className={`material-icons-round text-primary flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

export default function VisaPackage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: 'Germany Student Visa Assistance Package',
        description: 'Complete support for your German student visa application — Visa SOP, blocked account guidance, VFS appointment, mock interview and more.',
        offers: {
          '@type': 'Offer',
          price: '7999',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
        brand: { '@type': 'Brand', name: 'EasyWay Germany' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <Helmet>
        <title>Germany Student Visa Package for Indian Students 2026 | EasyWay Germany</title>
        <meta name="description" content="Complete Germany student visa assistance for Indian students — Visa SOP, blocked account guidance, APS help, VFS appointment, health insurance, and mock interview. ₹7,999 one-time." />
        <meta name="keywords" content="germany student visa india, german student visa from india 2026, germany visa assistance india, blocked account germany, sperrkonto india, aps certificate india, vfs germany appointment india, germany student visa documents, visa sop germany, germany study visa process india, how to get germany student visa, german embassy india student visa" />
        <meta property="og:title" content="Germany Student Visa Package for Indian Students | EasyWay Germany" />
        <meta property="og:description" content="Expert visa assistance — Visa SOP, blocked account, APS, VFS appointment and mock interview. ₹7,999 one-time." />
        <meta property="og:url" content="https://easywaygermany.com/visa-package" />
        <link rel="canonical" href="https://easywaygermany.com/visa-package" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Hero */}
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Visa Assistance</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Germany Student Visa Package</h1>
          <p className="text-white/75 max-w-xl mx-auto">End-to-end support for your German student visa application — from Visa SOP to VFS appointment booking.</p>
        </div>
      </div>

      {/* Visa Card */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-card ring-2 ring-primary overflow-hidden">
              <div className="bg-primary text-white text-xs font-bold uppercase tracking-widest text-center py-2.5 px-4">
                Visa Essential
              </div>
              <div className="p-6 border-b border-gray-100 bg-primary/5">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Visa Support Package</h2>
                <p className="text-gray-500 text-sm mb-4">Complete support for your student visa application</p>
                <div className="text-3xl font-extrabold text-gray-900">₹7,999</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">/ one-time payment</div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {[
                    { icon: '📝', text: 'Visa-Specific SOP (different from University SOP)' },
                    { icon: '📋', text: 'Document Checklist & Verification' },
                    { icon: '🏦', text: 'Blocked Account Guidance (€11,904 proof)' },
                    { icon: '🏥', text: 'Health Insurance Setup' },
                    { icon: '📅', text: 'VFS Appointment Booking' },
                    { icon: '🎤', text: 'Mock Visa Interview' },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-base flex-shrink-0">{icon}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                {/* SOP Comparison */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">University SOP vs Visa SOP</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-semibold text-gray-600">Feature</th>
                          <th className="text-center py-2 font-semibold text-gray-600">University SOP</th>
                          <th className="text-center py-2 font-semibold text-primary">Visa SOP</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 font-medium text-gray-700">Focus</td>
                          <td className="text-center py-2 text-gray-500">Academic goals</td>
                          <td className="text-center py-2 text-gray-700 font-medium">Return intent</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 font-medium text-gray-700">Length</td>
                          <td className="text-center py-2 text-gray-500">800–1000 words</td>
                          <td className="text-center py-2 text-gray-700 font-medium">500 words max</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium text-gray-700">Tone</td>
                          <td className="text-center py-2 text-gray-500">Academic / research</td>
                          <td className="text-center py-2 text-gray-700 font-medium">Embassy-formal</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <a
                  href={WA}
                  target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-md"
                >
                  <span className="material-icons-round text-base">chat</span>
                  Start Visa Process on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visa Process Timeline */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Step by Step</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900">How the Visa Process Works</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">A typical German student visa takes 4–5 months from start to finish. Here's what to expect.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { step: '01', title: 'Get Admission Letter', desc: 'Receive your Zulassungsbescheid from a German university. This is the foundation of your visa application.' },
              { step: '02', title: 'APS Certification', desc: 'Get your Indian academic documents verified by APS New Delhi. Takes 4–8 weeks. Apply early.' },
              { step: '03', title: 'Open Blocked Account', desc: 'Deposit €11,904 in a Sperrkonto (Expatrio / Fintiba). We guide you through the entire process.' },
              { step: '04', title: 'Prepare Documents', desc: 'Visa SOP, cover letter, health insurance, photos, passport, APS certificate — we check every document.' },
              { step: '05', title: 'Book VFS Appointment', desc: 'Book your appointment at the nearest German VFS centre. We help you choose the right date and city.' },
              { step: '06', title: 'Mock Interview & Submit', desc: 'We prepare you for embassy questions, then you attend your VFS appointment and submit your file.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{step}</div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{title}</div>
                  <div className="text-gray-500 text-sm mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">FAQs</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Germany Student Visa Questions</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">Everything Indian students ask about the German student visa process.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map(faq => <FAQ key={faq.q} {...faq} />)}
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm mb-4">Still have questions? Ask us directly on WhatsApp.</p>
            <a
              href={WA}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base"
            >
              <span className="material-icons-round text-xl">chat</span>
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
