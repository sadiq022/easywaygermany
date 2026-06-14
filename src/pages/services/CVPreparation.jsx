import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

/*
 * IMAGES NEEDED:
 *   1. public/images/services/cv_sample.png  ← CV preview/sample screenshot
 *      (copy from old Flask project: static/images/services/cv_sample.png)
 *      This is shown in the "CV Preview" section below.
 *      Tip: use a clean screenshot of a Europass CV — no real personal data.
 */

const CV_SECTIONS = [
  { icon: 'school',         label: 'Education',           sub: 'Degrees, institutions, grades, years' },
  { icon: 'work',           label: 'Work Experience',     sub: 'Jobs, internships, part-time roles' },
  { icon: 'emoji_objects',  label: 'Skills & Tools',      sub: 'Technical skills, software, frameworks' },
  { icon: 'translate',      label: 'Languages',           sub: 'English, German, mother tongue + levels' },
  { icon: 'build',          label: 'Projects',            sub: 'Academic and personal projects' },
  { icon: 'card_membership','label': 'Certifications',    sub: 'Courses, MOOCs, achievements' },
]

const NEED_FROM_YOU = [
  { icon: 'school',        label: 'Academic Background',      sub: 'Degrees, institutions, years, GPA/percentage' },
  { icon: 'work',          label: 'Work / Internship Details', sub: 'Role, company, duration, responsibilities' },
  { icon: 'emoji_objects', label: 'Skills & Tools',           sub: 'Programming, software, soft skills' },
  { icon: 'translate',     label: 'Language Levels',          sub: 'IELTS/TOEFL score, German level if any' },
  { icon: 'build',         label: 'Projects & Achievements',  sub: 'Thesis, publications, awards, certifications' },
  { icon: 'photo_camera',  label: 'Photo (Optional)',         sub: 'Professional headshot — some universities require it' },
]

const WHY_US = [
  {
    icon: 'assignment_turned_in',
    title: 'Admissions & Job Ready',
    desc: 'Format, language, and structure optimised for German university admissions and job platforms.',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: 'all_inclusive',
    title: 'Unlimited Edits',
    desc: 'We update your CV until you are completely satisfied — no hidden costs, no revision limits.',
    color: 'text-success',
    bg: 'bg-green-50',
  },
  {
    icon: 'groups',
    title: 'Personal Touch',
    desc: 'Prepared by students currently in Germany who know exactly what universities and employers look for.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

const FAQS = [
  {
    q: 'What information do I need to provide?',
    a: "We'll need your academic background, work and internship experiences, skills, projects, certifications, and a recent photo if required by your university.",
  },
  {
    q: 'Do you use Europass format only?',
    a: 'Europass is the standard in Europe and preferred by German universities, but we also offer other academic CV styles on request — just let us know your preference.',
  },
  {
    q: 'How long will it take to get my CV?',
    a: 'Usually within 1–2 working days after you provide all your details.',
  },
  {
    q: 'Can I request changes after the first draft?',
    a: 'Absolutely! Edits are unlimited and free until you are satisfied.',
  },
  {
    q: 'Will my CV be ATS-friendly and accepted by universities?',
    a: 'Yes — we optimise your CV for both online application systems (ATS) and German university guidelines.',
  },
  {
    q: 'Can you help with cover letters too?',
    a: 'Definitely! Mention it during your CV order and we will guide you, or check our other document services.',
  },
]

export default function CVPreparation() {
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <>
      <Helmet>
        <title>Professional CV Preparation Service for Germany | EasyWayGermany</title>
        <meta
          name="description"
          content="Get a Europass-compliant, ATS-friendly CV for German universities and employers. Expert preparation, editable files, unlimited revisions. Just ₹1,000."
        />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'CV Preparation Service',
          serviceType: 'European CV / Resume Preparation',
          provider: { '@type': 'Organization', name: 'EasyWayGermany' },
          areaServed: { '@type': 'Country', name: 'Germany' },
          description: 'Europass-compliant CV preparation for university admissions and job applications in Germany. ATS-friendly, editable files included.',
          offers: {
            '@type': 'Offer',
            price: '1000',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
        })}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Professional CV Preparation Service
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Impress German universities and employers with a clear, impactful CV —
            ATS-friendly, Europass-compliant, and tailored to your profile.
          </p>
        </div>
      </div>

      {/* ── Overview + Features ───────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-14 items-center">

            {/* CV sample image — place at: public/images/services/cv_sample.png */}
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover border-2 border-gray-100">
                <img
                  src="/images/services/cv_sample.png"
                  alt="Europass CV Sample"
                  className="w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-5 py-3 shadow-lg flex items-baseline gap-2">
                  <span className="text-gray-500 text-sm">Just</span>
                  <span className="text-2xl font-bold text-primary">₹1,000</span>
                  <span className="text-gray-500 text-sm">per CV</span>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                Sample Europass CV layout · Your final CV will be personalised
              </p>
            </div>

            {/* Features */}
            <div className="md:w-1/2">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">What You Get</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Everything in One CV</h2>
              <p className="text-gray-500 mb-6">
                Delivered in <strong className="text-gray-700">1–2 working days</strong>&nbsp;·&nbsp;
                <span className="text-green-600 font-semibold">Unlimited Edits</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Formatted to European (Europass) or university-specific standards',
                  'ATS-friendly and visually clean layout',
                  'Academic achievements, skills, experience & projects highlighted',
                  'Personalised review and editing session with our team',
                  'Dos & don\'ts tips for maximum impact',
                  'Editable source file + PDF delivery',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <span className="material-icons-round text-primary text-xl mt-0.5">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">Europass compliant</span>
                <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">Student-focused</span>
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full">Quick turnaround</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── European CV is Mandatory ──────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-gray-900 to-primary rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                <span className="material-icons-round text-white text-5xl">article</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Important for Germany</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                European CV is the Standard in Germany
              </h2>
              <p className="text-white/75 leading-relaxed max-w-2xl">
                German universities and employers expect a <strong className="text-white">Europass CV</strong> — the pan-European
                format recognised across all EU countries. Submitting an Indian-style resume or a US-format CV
                can create a poor first impression and even lead to rejection.
                Our team ensures your CV strictly follows Europass guidelines, with the right structure, language,
                and layout that German admission committees and HR teams expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Goes Into Your CV ────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">CV Structure</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Goes Into Your CV</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A strong German application CV covers six key areas. We make sure every section is clear, complete, and impactful.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {CV_SECTIONS.map(({ icon, label, sub }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
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

      {/* ── What We Need From You ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Getting Started</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What We Need From You</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No complicated forms. Share these details and we will handle the rest.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {NEED_FROM_YOU.map(({ icon, label, sub }) => (
              <div key={label} className="bg-gray-50 rounded-2xl border border-gray-100 shadow-card p-6 flex items-start gap-4">
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
              href="https://wa.me/919119740154?text=Hi%20EasyWayGermany%2C%20I%20want%20to%20order%20your%20CV%20preparation%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg"
            >
              <span className="material-icons-round text-xl">chat</span>
              Order Your CV on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Our Edge</div>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our CV Service?</h2>
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
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Got Questions?</div>
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
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
