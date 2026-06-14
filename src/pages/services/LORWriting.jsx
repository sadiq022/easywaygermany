import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

/*
 * IMAGE NEEDED:
 *   Place your image at: public/images/services/LOR_Image.jpg
 *   You can use the same image as SOP (public/images/services/SOP_Image.jpg)
 *   or a different one — a photo of someone writing/signing works well.
 *   Recommended: landscape, at least 800×500 px, under 200 KB.
 */

const SIGNERS = [
  { icon: 'school',        label: 'Professor',           sub: 'From your undergraduate or postgraduate studies' },
  { icon: 'science',       label: 'Thesis Advisor',      sub: 'Research supervisor or guide' },
  { icon: 'business',      label: 'Employer / Manager',  sub: 'From a full-time or part-time job' },
  { icon: 'engineering',   label: 'Internship Mentor',   sub: 'Technical or corporate internship supervisor' },
  { icon: 'apartment',     label: 'Company Head / HOD',  sub: 'Department head or senior authority' },
  { icon: 'diversity_3',   label: 'Any Other Authority', sub: 'Academic, corporate, or research — we adapt' },
]

const STEPS = [
  {
    num: '01',
    icon: 'forum',
    title: 'Share the Details',
    desc: 'Tell us about your achievements, relationship with the recommender, and the universities you are applying to.',
  },
  {
    num: '02',
    icon: 'draw',
    title: 'We Write the Draft',
    desc: 'Our team crafts a compelling, tailored LOR in 2–3 working days — unique every time, never templated.',
  },
  {
    num: '03',
    icon: 'task_alt',
    title: 'Review & Finalise',
    desc: 'Request unlimited changes until the LOR perfectly captures your recommender\'s voice and your strengths.',
  },
]

const WHY_US = [
  {
    icon: 'workspace_premium',
    title: 'Academic & Industry Focused',
    desc: 'Our LORs meet the standards of both university admissions and professional programs — no one-size-fits-all drafts.',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: 'all_inclusive',
    title: 'Unlimited Edits',
    desc: 'We refine your LOR until you are 100% satisfied. No extra charges, no revision limits.',
    color: 'text-success',
    bg: 'bg-green-50',
  },
  {
    icon: 'lock',
    title: 'Strictly Confidential',
    desc: 'Every LOR is written from scratch and never reused or shared. Your information stays private, always.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

const FAQS = [
  {
    q: 'Who should I get my LORs from?',
    a: 'Ideally from professors, thesis advisors, or employers who know your academic or professional strengths well. Most German universities ask for 1–2 LORs.',
  },
  {
    q: 'What information do you need to write my LOR?',
    a: "We'll ask about your achievements, projects, relevant experiences, your relationship with the recommender, and the programs you're applying to.",
  },
  {
    q: 'Can you write LORs for both university and visa applications?',
    a: 'Yes! We tailor LORs for university admissions as well as German student visa requirements — just let us know which one you need.',
  },
  {
    q: 'How long will it take to get my LOR draft?',
    a: 'Usually 2–3 working days. If you have an urgent deadline, let us know and we will do our best to deliver sooner.',
  },
  {
    q: 'Can I ask for changes after the first draft?',
    a: 'Absolutely — edits are unlimited and free until you are completely happy with the final letter.',
  },
  {
    q: 'Is my LOR unique and confidential?',
    a: '100%. Every LOR is written from scratch, personalised to your recommender and your story, and never shared or reused for anyone else.',
  },
]

export default function LORWriting() {
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <>
      <Helmet>
        <title>Professional LOR Writing Service for Germany | EasyWayGermany</title>
        <meta
          name="description"
          content="Get expertly crafted Letters of Recommendation for German universities and visa applications. Written on behalf of professors, employers, and supervisors. Just ₹1,250 per LOR."
        />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'LOR Writing Service',
          serviceType: 'Letter of Recommendation Writing',
          provider: { '@type': 'Organization', name: 'EasyWayGermany' },
          areaServed: { '@type': 'Country', name: 'Germany' },
          description: 'Professional LOR writing for university and visa applications. Confidential, tailored letters for German programs.',
          offers: {
            '@type': 'Offer',
            price: '1250',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
        })}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Professional LOR Writing Service
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Expertly crafted Letters of Recommendation that showcase your strengths —
            tailored for German universities and visa applications, fast and confidential.
          </p>
        </div>
      </div>

      {/* ── Overview + Image ─────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-14 items-center">

            {/* Image — place file at: public/images/services/LOR_Image.jpg */}
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src="/images/services/LOR_Image.jpg"
                  alt="LOR Writing Service"
                  className="w-full h-[360px] object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-5 py-3 shadow-lg flex items-baseline gap-2">
                  <span className="text-gray-500 text-sm">Just</span>
                  <span className="text-2xl font-bold text-primary">₹1,250</span>
                  <span className="text-gray-500 text-sm">per LOR</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="md:w-1/2">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">What You Get</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Everything in One LOR</h2>
              <p className="text-gray-500 mb-6">
                Delivered in <strong className="text-gray-700">2–3 working days</strong>&nbsp;·&nbsp;
                <span className="text-green-600 font-semibold">Unlimited Revisions</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Customized LORs for professors, supervisors, or employers',
                  'One-on-one consultation to capture your unique achievements',
                  'Highlights skills, projects & qualities relevant to your program',
                  'Suitable for university, visa, or job applications',
                  'Unlimited free edits and formatting for institution guidelines',
                  'Confidential — never reused or shared',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <span className="material-icons-round text-primary text-xl mt-0.5">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">Authentic</span>
                <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">Student-led team</span>
                <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-1.5 rounded-full">Fast Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Who Signs the LOR ────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-4">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Written On Their Behalf</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">We Write It. They Sign It.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We work with all types of recommenders. Just tell us who is writing your LOR
              and we will craft a letter that matches their voice and authority.
            </p>
          </div>

          {/* highlight strip */}
          <div className="my-8 bg-primary/8 border border-primary/20 rounded-2xl px-6 py-5 flex items-start gap-4 max-w-3xl mx-auto">
            <span className="material-icons-round text-primary text-3xl mt-0.5 flex-shrink-0">tips_and_updates</span>
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Did you know?</strong> Most applicants ask us to ghost-write
              the LOR for their recommender. It saves the recommender's time, and the letter ends up being
              stronger because it's crafted specifically for the target program.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
            {SIGNERS.map(({ icon, label, sub }) => (
              <div key={label} className="bg-gray-50 rounded-2xl border border-gray-100 shadow-card p-6 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons-round text-primary">{icon}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
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

          <div className="text-center mt-12">
            <a
              href="https://wa.me/919119740154?text=Hi%20EasyWayGermany%2C%20I%20want%20to%20order%20your%20LOR%20writing%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg"
            >
              <span className="material-icons-round text-xl">chat</span>
              Order Your LOR on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Our Edge</div>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our LOR Service?</h2>
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
