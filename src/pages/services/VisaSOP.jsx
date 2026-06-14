import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

const STEPS = [
  {
    num: '01', icon: 'forum',
    title: 'Share Your Profile',
    desc: 'Tell us about your program, university, financial situation, and ties to your home country.',
  },
  {
    num: '02', icon: 'edit_note',
    title: 'We Write Your Visa SOP',
    desc: 'Our experts draft a visa SOP tailored for the German embassy — covering your study plan, finances, and return intent.',
  },
  {
    num: '03', icon: 'task_alt',
    title: 'Review & Deliver',
    desc: 'You review, request changes, and receive your final embassy-ready Visa SOP within 2–3 working days.',
  },
]

const WHY_US = [
  {
    icon: 'verified_user',
    title: 'Embassy-Focused Writing',
    desc: 'We know exactly what German visa officers look for — a convincing study plan and clear return intent.',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: 'all_inclusive',
    title: 'Unlimited Revisions',
    desc: 'We iterate until your Visa SOP is perfect — no extra charges for revision rounds.',
    color: 'text-success',
    bg: 'bg-green-50',
  },
  {
    icon: 'lock',
    title: '100% Confidential',
    desc: 'Your personal and financial information is handled with complete privacy and never shared.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

const FAQS = [
  {
    q: 'What is a Visa SOP and why do I need one?',
    a: 'A Visa SOP (Statement of Purpose for Visa) is a letter addressed to the German embassy explaining why you want to study in Germany, your chosen program and university, your financial situation, and your intention to return to India after graduation. It is a required document for the German student visa.',
  },
  {
    q: 'Is a Visa SOP different from a university SOP?',
    a: 'Yes. A university SOP focuses on your academic background, research interests, and career goals for the university admission committee. A Visa SOP is addressed to the German embassy and focuses on your study plan, financial proof, and ties to India — it has a completely different tone and structure.',
  },
  {
    q: 'How long does the Visa SOP process take?',
    a: 'Generally 2–3 working days after you share your profile details. If you need it urgently, contact us on WhatsApp and we will do our best.',
  },
  {
    q: 'What information do I need to provide?',
    a: "We'll ask for your program and university name, financial documents summary, blocked account status, start date of studies, and any specific instructions from the embassy or consulate you are applying at.",
  },
  {
    q: 'Does a good Visa SOP guarantee a visa?',
    a: 'While no document guarantees a visa, a well-written Visa SOP significantly strengthens your application by clearly communicating your intentions. Combined with complete documentation, it greatly improves your chances.',
  },
]

export default function VisaSOP() {
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <>
      <Helmet>
        <title>Visa SOP Writing for Germany Student Visa | EasyWayGermany</title>
        <meta
          name="description"
          content="Get a professional Statement of Purpose for your German student visa application. Written by experts who know what embassy officers look for. Just ₹1,500."
        />
      </Helmet>

      {/* Hero */}
      <div className="page-hero">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Visa SOP Writing Service
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            A Statement of Purpose crafted specifically for the German embassy — clear, convincing, and visa-ready.
          </p>
        </div>
      </div>

      {/* Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-14 items-center">
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80"
                  alt="Visa SOP Writing"
                  className="w-full h-[360px] object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-5 py-3 shadow-lg flex items-baseline gap-2">
                  <span className="text-gray-500 text-sm">Just</span>
                  <span className="text-2xl font-bold text-primary">₹1,500</span>
                  <span className="text-gray-500 text-sm">per Visa SOP</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">What You Get</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Embassy-Ready Visa SOP</h2>
              <p className="text-gray-500 mb-6">
                Delivered in <strong className="text-gray-700">2–3 working days</strong> &nbsp;·&nbsp;
                <span className="text-green-600 font-semibold">Unlimited Revisions</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Addressed directly to the German embassy/consulate',
                  'Covers your study plan and chosen program',
                  'Explains your financial situation clearly',
                  'Highlights your ties to India and return intent',
                  'Proper formal tone and embassy-standard structure',
                  'Tailored to your specific university and intake',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <span className="material-icons-round text-primary text-xl mt-0.5">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">Embassy-Focused</span>
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">Fast Delivery</span>
                <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-1.5 rounded-full">Visa Experts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visa SOP vs University SOP */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Know the Difference</div>
            <h2 className="text-3xl font-bold text-gray-900">Visa SOP vs University SOP</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="material-icons-round text-primary">flight_takeoff</span>
                Visa SOP (This Service)
              </h3>
              <ul className="space-y-2">
                {[
                  'Addressed to the German Embassy',
                  'Focuses on study plan & finances',
                  'Explains intent to return to India',
                  'Formal, concise embassy style',
                  'Required for student visa application',
                ].map(p => (
                  <li key={p} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="material-icons-round text-primary text-base mt-0.5">check</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="material-icons-round text-gray-500">school</span>
                University SOP (Separate Service)
              </h3>
              <ul className="space-y-2">
                {[
                  'Addressed to the university / department',
                  'Focuses on academic & research interest',
                  'Highlights your career goals',
                  'Persuasive, storytelling format',
                  'Required for university admission',
                ].map(p => (
                  <li key={p} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="material-icons-round text-gray-400 text-base mt-0.5">check</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Simple Process</div>
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
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

      {/* Why Choose Us */}
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

      {/* FAQ */}
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
