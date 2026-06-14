import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

const UNIVERSITIES = [
  { name: 'TU München',          city: 'Munich',      logo: 'https://logo.clearbit.com/tum.de' },
  { name: 'RWTH Aachen',         city: 'Aachen',      logo: 'https://logo.clearbit.com/rwth-aachen.de' },
  { name: 'TU Berlin',           city: 'Berlin',      logo: 'https://logo.clearbit.com/tu-berlin.de' },
  { name: 'LMU Munich',          city: 'Munich',      logo: 'https://logo.clearbit.com/lmu.de' },
  { name: 'Heidelberg Uni',      city: 'Heidelberg',  logo: 'https://logo.clearbit.com/uni-heidelberg.de' },
  { name: 'KIT',                 city: 'Karlsruhe',   logo: 'https://logo.clearbit.com/kit.edu' },
  { name: 'TU Darmstadt',        city: 'Darmstadt',   logo: 'https://logo.clearbit.com/tu-darmstadt.de' },
  { name: 'Uni Stuttgart',       city: 'Stuttgart',   logo: 'https://logo.clearbit.com/uni-stuttgart.de' },
  { name: 'Uni Hamburg',         city: 'Hamburg',     logo: 'https://logo.clearbit.com/uni-hamburg.de' },
  { name: 'FAU Erlangen',        city: 'Erlangen',    logo: 'https://logo.clearbit.com/fau.de' },
]

const STEPS = [
  {
    num: '01',
    icon: 'forum',
    title: 'Consultation',
    desc: 'We start with a one-on-one call to understand your background, goals, and target universities.',
  },
  {
    num: '02',
    icon: 'edit_note',
    title: 'First Draft',
    desc: 'Our expert writes a compelling, plagiarism-free SOP tailored to your unique story within 3–5 days.',
  },
  {
    num: '03',
    icon: 'task_alt',
    title: 'Revisions & Delivery',
    desc: 'Review the draft, request unlimited changes, and receive your final SOP ready to submit.',
  },
]

const WHY_US = [
  {
    icon: 'person_check',
    title: 'Student-Led Experts',
    desc: 'Written by students who succeeded in German admissions — real, practical guidance, not generic advice.',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: 'all_inclusive',
    title: 'Unlimited Edits',
    desc: 'No hidden charges for revisions. We iterate until you are 100% satisfied with every word.',
    color: 'text-success',
    bg: 'bg-green-50',
  },
  {
    icon: 'verified_user',
    title: 'Confidential & Unique',
    desc: 'Your data is 100% private. Every SOP is written from scratch — zero plagiarism, zero templates.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

const FAQS = [
  {
    q: 'How do I start my SOP order?',
    a: "Click the WhatsApp button and message us. We'll share a short questionnaire and kick things off within 24 hours.",
  },
  {
    q: 'Can I request changes after the first draft?',
    a: 'Yes! We offer unlimited revisions at no extra cost until you are completely satisfied.',
  },
  {
    q: 'How long does the SOP writing process take?',
    a: "Generally 3–5 working days after we receive your details. Need it sooner? Let us know — we'll do our best.",
  },
  {
    q: 'What information do you need from me?',
    a: "We'll ask about your academic background, work experience, career goals, target universities, and any achievements that set you apart.",
  },
  {
    q: 'Is my information kept confidential?',
    a: 'Absolutely. We never share your documents or personal story with anyone. Your trust is our highest priority.',
  },
]

function UniCard({ name, city, logo }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow p-5 flex flex-col items-center gap-3 text-center">
      <div className="w-14 h-14 flex items-center justify-center">
        {imgFailed ? (
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{initials}</span>
          </div>
        ) : (
          <img
            src={logo}
            alt={name}
            className="w-12 h-12 object-contain"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm leading-tight">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{city}</p>
      </div>
    </div>
  )
}

export default function SOPWriting() {
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <>
      <Helmet>
        <title>Professional SOP Writing Service for Germany | EasyWayGermany</title>
        <meta
          name="description"
          content="Get a personalized, plagiarism-free Statement of Purpose for German universities. Written by students studying in Germany. Just ₹2,500 with unlimited revisions."
        />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'SOP Writing Service for Germany',
          serviceType: 'Statement of Purpose Writing',
          provider: { '@type': 'Organization', name: 'EasyWayGermany' },
          areaServed: { '@type': 'Country', name: 'Germany' },
          description: 'Professional SOP Writing for German university applications. Student-led, plagiarism-free, unlimited revisions.',
          offers: {
            '@type': 'Offer',
            price: '2500',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
        })}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Professional SOP Writing Service
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            A Statement of Purpose written by students who got into German universities — not by agencies using templates.
          </p>
        </div>
      </div>

      {/* ── Overview + Image ─────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-14 items-center">

            {/* Image */}
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src="/images/services/SOP_Image.jpg"
                  alt="SOP Writing Service"
                  className="w-full h-[360px] object-cover"
                  loading="lazy"
                />
                {/* price overlay */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-5 py-3 shadow-lg flex items-baseline gap-2">
                  <span className="text-gray-500 text-sm">Just</span>
                  <span className="text-2xl font-bold text-primary">₹2,500</span>
                  <span className="text-gray-500 text-sm">per SOP</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="md:w-1/2">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">What You Get</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Everything in One SOP</h2>
              <p className="text-gray-500 mb-6">
                Delivered in <strong className="text-gray-700">3–5 working days</strong> &nbsp;·&nbsp;
                <span className="text-green-600 font-semibold">Unlimited Revisions</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Personalized one-on-one consultation',
                  'Unique SOP tailored for each university',
                  'Gap & low-grade explanations if needed',
                  'Compliant with German university requirements',
                  'Flawless formatting & structure',
                  'Plagiarism report on request',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <span className="material-icons-round text-primary text-xl mt-0.5">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">Plagiarism-free</span>
                <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">Student-led team</span>
                <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-1.5 rounded-full">Fast Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Simple Process</div>
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gray-200 z-0" />
            {STEPS.map(({ num, icon, title, desc }) => (
              <div key={num} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/8 flex items-center justify-center mb-5 border border-primary/10">
                  <span className="material-icons-round text-primary text-4xl">{icon}</span>
                </div>
                <div className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">{num}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Universities ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Proven Track Record</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Students We've Helped Get Into
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our SOPs have helped students secure admissions at Germany's most competitive universities.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {UNIVERSITIES.map(u => (
              <UniCard key={u.name} {...u} />
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-500 text-sm font-medium px-6 py-3 rounded-full shadow-sm">
              <span className="material-icons-round text-primary text-base">add_circle</span>
              And 50+ more universities across Germany
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Our Edge</div>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_US.map(({ icon, title, desc, color, bg }) => (
              <div key={title} className={`${bg} rounded-2xl p-8 border border-gray-100 text-center hover:shadow-card transition-shadow`}>
                <span className={`material-icons-round text-5xl mb-4 ${color}`}>{icon}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Got Questions?</div>
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className="font-bold text-gray-900 text-lg pr-8">{faq.q}</span>
                  <span className={`material-icons-round text-primary transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
