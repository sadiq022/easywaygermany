import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

/*
 * IMAGE NEEDED:
 *   Place your image at: public/images/services/university.jpg
 *   (copy from old Flask project: static/images/services/university.jpg)
 *   Recommended: landscape photo, at least 800×500 px, under 200 KB
 */

const FAQS = [
  {
    q: 'What details do you need from me to begin?',
    a: "We'll ask for your academic transcripts, work experience, resume/CV, language test results (IELTS, TOEFL, etc.), and your target subject area. A short call helps us understand your priorities — location, deadlines, and budget.",
  },
  {
    q: 'How many universities will you shortlist for me?',
    a: 'Typically 7–10 universities best suited to your profile. If you want a larger or more focused list, just let us know.',
  },
  {
    q: 'Will I get all application details for each university?',
    a: 'Yes! Your report includes university names, courses, both intake windows, language requirements, application procedure, required documents, official course links, and our remarks.',
  },
  {
    q: 'What if I have questions after I receive my list?',
    a: 'We offer post-report support for all your queries about the universities on your list — by WhatsApp, email, or call.',
  },
  {
    q: 'Is this list guaranteed to get me admission?',
    a: 'We only suggest universities where you stand a genuine chance based on your profile. The final decision always lies with the university, but our goal is to maximise your chances and save your time, money, and effort.',
  },
  {
    q: 'How long will it take to receive my report?',
    a: "You'll receive your shortlist within 2–3 working days of providing all required information.",
  },
]

const SAMPLE_ROWS = [
  {
    uni: 'RWTH Aachen',
    course: 'MSc Computer Science',
    summer: 'Apr – Jul',
    winter: 'Oct – Jan',
    lang: 'IELTS 6.5 / B2',
    proc: 'Uni-Assist',
    docs: 'CV, SOP, LOR, Transcript',
    remarks: 'Highly competitive',
  },
  {
    uni: 'TU Munich',
    course: 'MSc Data Engineering',
    summer: '—',
    winter: 'Oct – Mar',
    lang: 'IELTS 6.5',
    proc: 'Direct',
    docs: 'CV, SOP, LOR, Degree',
    remarks: 'English-taught',
  },
  {
    uni: 'TU Berlin',
    course: 'MSc Electrical Eng.',
    summer: 'Apr – Jun',
    winter: 'Oct – Dec',
    lang: 'IELTS 6.0 / B1',
    proc: 'Uni-Assist',
    docs: 'CV, SOP, Transcript',
    remarks: 'Good acceptance rate',
  },
]

const NEED_FROM_YOU = [
  { icon: 'school',         label: 'Academic Transcripts',          sub: 'All semesters, grade sheet or marksheet' },
  { icon: 'translate',      label: 'Language Test Score',           sub: 'IELTS / TOEFL / Duolingo result' },
  { icon: 'work',           label: 'Work Experience (if any)',       sub: 'Internships, part-time, or full-time roles' },
  { icon: 'description',    label: 'Updated CV / Resume',           sub: 'Current version, even a rough draft is fine' },
  { icon: 'track_changes',  label: 'Target Field of Study',         sub: 'E.g. Computer Science, Mechanical, Finance' },
  { icon: 'tune',           label: 'Preferences',                   sub: 'Budget, city, intake, language of instruction' },
]

const WHY_US = [
  {
    icon: 'manage_search',
    title: 'Genuine Profiling',
    desc: "We don't just match scores — we look at your story and ambitions to find the best real fit.",
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: 'bar_chart',
    title: 'Data-Driven',
    desc: 'Our lists are based on the latest admission stats and intake trends — no guesswork, just results.',
    color: 'text-success',
    bg: 'bg-green-50',
  },
  {
    icon: 'support_agent',
    title: 'Post-Report Support',
    desc: 'We stay connected for your follow-up questions — beyond just handing over the list.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

export default function UniversityShortlisting() {
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <>
      <Helmet>
        <title>University Shortlisting for Germany | EasyWayGermany</title>
        <meta
          name="description"
          content="Personalized university shortlisting for Masters in Germany — data-driven recommendations, one-on-one consultation, and a detailed shortlist report. Only public universities where you have high chances."
        />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'University Shortlisting Service',
          serviceType: 'University Shortlisting & Profile Analysis',
          provider: { '@type': 'Organization', name: 'EasyWayGermany' },
          areaServed: { '@type': 'Country', name: 'Germany' },
          description: 'Personalized university shortlisting for Masters in Germany. Data-driven, public universities only, high admission chances.',
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
            Expert University Shortlisting Service
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Get a personalized list of best-fit German universities for your profile —
            data-driven recommendations with all the application details you need.
          </p>
        </div>
      </div>

      {/* ── Overview + Image ─────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-14 items-center">

            {/* Image — place file at: public/images/services/university.jpg */}
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src="/images/services/university.jpg"
                  alt="University Shortlisting Service"
                  className="w-full h-[360px] object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-5 py-3 shadow-lg flex items-baseline gap-2">
                  <span className="text-gray-500 text-sm">Just</span>
                  <span className="text-2xl font-bold text-primary">₹2,500</span>
                  <span className="text-gray-500 text-sm">per profile</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="md:w-1/2">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">What You Get</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Everything in One Report</h2>
              <p className="text-gray-500 mb-6">
                Delivered in <strong className="text-gray-700">2–3 working days</strong>&nbsp;·&nbsp;
                <span className="text-green-600 font-semibold">One-on-One Consultation</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Profile analysis — academics, work experience & transcripts',
                  'Personalized list of 7–10 universities with high admission chances',
                  'One-on-one call to clarify your goals and preferences',
                  'Detailed report with intakes, documents, and course links',
                  'Ongoing support for follow-up questions about listed universities',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <span className="material-icons-round text-primary text-xl mt-0.5">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">Student-centric advice</span>
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">Transparent criteria</span>
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full">2–3 day delivery</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Public Universities Only ──────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-gray-900 to-primary rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                <span className="material-icons-round text-white text-5xl">account_balance</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Our Promise</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                We Only Shortlist Public Universities
              </h2>
              <p className="text-white/75 leading-relaxed max-w-2xl">
                Every university on your list is a <strong className="text-white">tuition-free public university</strong> in
                Germany — no private colleges, no hidden fees. More importantly, we only include universities where
                your profile gives you a <strong className="text-white">genuine, high chance of admission</strong>.
                We'd rather give you a focused list of 7 real options than 20 unrealistic ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dream / Target / Safe Tiers ──────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Balanced Strategy</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">A List Built to Get You In</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Applying only to top-tier universities risks rejection. Applying only to safe ones means missing better opportunities.
              We create a balanced portfolio across three tiers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: 'Dream',
                border: 'border-t-primary',
                dot: 'bg-primary',
                icon: 'emoji_events',
                color: 'text-primary',
                desc: 'Top-ranked universities where your profile meets the minimum criteria. Highly competitive — but worth trying.',
              },
              {
                label: 'Target',
                border: 'border-t-yellow-500',
                dot: 'bg-yellow-400',
                icon: 'gps_fixed',
                color: 'text-yellow-600',
                desc: 'Universities where your profile aligns well with historical admission trends. Your strongest bets.',
              },
              {
                label: 'Safe',
                border: 'border-t-green-500',
                dot: 'bg-green-500',
                icon: 'shield',
                color: 'text-green-600',
                desc: 'Excellent universities where your profile significantly exceeds the average. High confidence of getting in.',
              },
            ].map(({ label, border, dot, icon, color, desc }) => (
              <div key={label} className={`bg-white rounded-2xl shadow-card border-t-4 ${border} p-7`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${dot}`} />
                  <span className="font-bold text-gray-900 text-lg">{label}</span>
                  <span className={`material-icons-round ${color} ml-auto`}>{icon}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Report Table ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Sample Preview</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Shortlist Report Includes</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Here's a glimpse of what your personalised report looks like. Every row is filled with verified, up-to-date data.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  {['University', 'Course', 'Summer Intake', 'Winter Intake', 'Language', 'Procedure', 'Key Documents', 'Remarks'].map(h => (
                    <th key={h} className="text-left px-4 py-4 font-semibold text-xs uppercase tracking-wide whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ROWS.map((r, i) => (
                  <tr key={r.uni} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap">{r.uni}</td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{r.course}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{r.summer}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{r.winter}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{r.lang}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{r.proc}</td>
                    <td className="px-4 py-4 text-gray-600">{r.docs}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        r.remarks.toLowerCase().includes('competitive')
                          ? 'bg-red-50 text-red-600'
                          : r.remarks.toLowerCase().includes('english')
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-green-50 text-green-700'
                      }`}>
                        {r.remarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            * Sample data for illustration only. Your actual report will have course links, official deadlines, and personalised remarks.
          </p>
        </div>
      </section>

      {/* ── What We Need From You ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Getting Started</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What We Need From You</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No lengthy forms. Just share these 6 things and we'll take it from there.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {NEED_FROM_YOU.map(({ icon, label, sub }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons-round text-primary">{icon}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://wa.me/919119740154?text=Hi%20EasyWayGermany%2C%20I%20want%20to%20order%20your%20university%20shortlisting%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg"
            >
              <span className="material-icons-round text-xl">chat</span>
              Start Shortlisting on WhatsApp
            </a>
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
