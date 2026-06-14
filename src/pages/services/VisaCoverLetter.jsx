import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

/*
 * IMAGE NEEDED:
 *   Place your image at: public/images/services/visa_cover_letter.jpg
 *   You can reuse public/images/services/SOP_Image.jpg if you don't have a separate one.
 *   A photo of someone writing/reading a document works well.
 */

const LETTER_TYPES = [
  {
    icon: 'flight_takeoff',
    title: 'Student Visa Cover Letter',
    sub: 'For German consulate / embassy',
    desc: 'Addresses study plan, financial proof, and intent to return — exactly what the visa officer needs.',
    color: 'text-primary',
    bg: 'bg-primary/8',
    border: 'border-primary/20',
  },
  {
    icon: 'laptop_chromebook',
    title: 'Working Student (Werkstudent)',
    sub: 'For part-time jobs while studying',
    desc: 'Tailored cover letter for working student positions — highlights your skills alongside your study schedule.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: 'business_center',
    title: 'Full-Time Job Application',
    sub: 'For jobs after graduation in Germany',
    desc: 'Professional cover letter for full-time roles — structured for German HR standards and Bewerbung format.',
    color: 'text-success',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: 'science',
    title: 'Internship / Praktikum',
    sub: 'For internships during your studies',
    desc: 'Focused cover letter for internship applications — shows motivation and relevant academic background.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
  },
]

const STRUCTURE_ROWS = [
  { section: 'Header',                  content: 'Your name, address, contact details, date, and embassy/employer address' },
  { section: 'Introduction',            content: 'Purpose of the letter — visa application, program name, or job title' },
  { section: 'Academic Background',     content: 'Summary of your education and relevant achievements' },
  { section: 'Motivation',              content: 'Why this course/job, why Germany, why this university/company' },
  { section: 'Financial Proof',         content: 'Blocked account, scholarship, or sponsorship details (for visa letters)' },
  { section: 'Supporting Documents',    content: 'List of attached documents — admission letter, transcripts, APS, proof of funds' },
  { section: 'Closing',                 content: 'Polite closing statement and signature' },
]

const VISA_CHECKLIST = [
  'Valid passport and completed visa application form',
  'Letter of admission from a German university',
  'Visa SOP and Cover Letter (well-formatted and concise)',
  'Proof of funds — blocked account, scholarship, or sponsorship',
  'Academic certificates and transcripts',
  'Proof of language proficiency (IELTS / TOEFL / German)',
  'Health insurance',
  'APS certificate (mandatory for Indian students)',
  'CV / Resume',
  'Other documents required by your consulate',
]

const WHY_US = [
  {
    icon: 'verified',
    title: 'Perfect Structure',
    desc: 'All embassy and employer requirements covered — nothing missed, nothing generic.',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: 'groups',
    title: 'Personal Touch',
    desc: 'Written by students who have successfully cleared the German visa process and landed jobs here.',
    color: 'text-success',
    bg: 'bg-green-50',
  },
  {
    icon: 'all_inclusive',
    title: 'Unlimited Revisions',
    desc: "We keep editing until you're completely satisfied — at no extra cost.",
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

const FAQS = [
  {
    q: 'Is a cover letter mandatory for a German student visa?',
    a: 'Yes, most German consulates require a cover letter summarising your study plan, financial situation, and intent to return to your home country.',
  },
  {
    q: 'What makes a good visa cover letter?',
    a: 'A good visa cover letter is concise, factual, well-formatted, and directly addresses the visa officer\'s requirements — no vague statements.',
  },
  {
    q: 'Can I get help for both SOP and Cover Letter together?',
    a: 'Absolutely! We offer combined packages and coordinate the content for both, ensuring they are consistent and compliant.',
  },
  {
    q: 'How quickly can I get my cover letter?',
    a: 'Usually in 2–3 working days. If you have an urgent visa appointment, just mention your date and we will prioritise.',
  },
  {
    q: 'What details do I need to provide?',
    a: 'We will ask about your academic history, course details, financial proof, and any other documents required by the embassy or employer.',
  },
]

export default function VisaCoverLetter() {
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <>
      <Helmet>
        <title>Visa Cover Letter Writing Service for Germany | EasyWayGermany</title>
        <meta
          name="description"
          content="Embassy-compliant Visa Cover Letter writing for German student visa, jobs, internships, and working student applications. Unlimited revisions. Just ₹1,500."
        />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Visa Cover Letter Writing Service',
          serviceType: 'Visa Cover Letter Writing',
          provider: { '@type': 'Organization', name: 'EasyWayGermany' },
          areaServed: { '@type': 'Country', name: 'Germany' },
          description: 'Embassy-compliant Visa Cover Letter writing for German student visa applications, jobs, and internships.',
          offers: {
            '@type': 'Offer',
            price: '1500',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
        })}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Visa Cover Letter Writing Service
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Embassy-compliant cover letters for your German student visa, job applications,
            internships, and working student positions — all in one place.
          </p>
        </div>
      </div>

      {/* ── Overview + Image ─────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-14 items-center">

            {/* Image — place at: public/images/services/visa_cover_letter.jpg */}
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src="/images/services/visa_cover_letter.jpg"
                  alt="Visa Cover Letter Service"
                  className="w-full h-[360px] object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-5 py-3 shadow-lg flex items-baseline gap-2">
                  <span className="text-gray-500 text-sm">Just</span>
                  <span className="text-2xl font-bold text-primary">₹1,500</span>
                  <span className="text-gray-500 text-sm">per letter</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="md:w-1/2">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">What You Get</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Everything in One Letter</h2>
              <p className="text-gray-500 mb-6">
                Delivered in <strong className="text-gray-700">2–3 working days</strong>&nbsp;·&nbsp;
                <span className="text-green-600 font-semibold">Unlimited Edits</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Embassy-compliant, clear, and concise letter',
                  'Highlights motivation, program choice, and financial proof',
                  'Personalized draft based on your academic and personal profile',
                  'Addresses common concerns — gaps, funding, return intent',
                  'Works for visa, jobs, internships & working student roles',
                  'Unlimited edits until you are completely satisfied',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3 text-gray-700">
                    <span className="material-icons-round text-primary text-xl mt-0.5">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">Tailored</span>
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">Student-centric</span>
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full">Fast Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Not Just For Visa ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-4">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">More Than Just Visa</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">We Write Cover Letters for Everything in Germany</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A cover letter is mandatory — not just for your visa, but also for every job,
              internship, and working student application in Germany. German employers take it seriously.
              We cover all of them.
            </p>
          </div>

          <div className="mt-8 bg-primary/8 border border-primary/20 rounded-2xl px-6 py-5 flex items-start gap-4 max-w-3xl mx-auto mb-10">
            <span className="material-icons-round text-primary text-3xl mt-0.5 flex-shrink-0">tips_and_updates</span>
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Did you know?</strong> In Germany, sending a job application
              without a cover letter (<em>Anschreiben</em>) is considered unprofessional and is often rejected
              outright — even for student part-time roles and internships.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {LETTER_TYPES.map(({ icon, title, sub, desc, color, bg, border }) => (
              <div key={title} className={`${bg} border ${border} rounded-2xl p-6 flex items-start gap-4 hover:shadow-card transition-shadow`}>
                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <span className={`material-icons-round ${color} text-2xl`}>{icon}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{title}</p>
                  <p className={`text-xs font-semibold ${color} mb-1`}>{sub}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://wa.me/919119740154?text=Hi%20EasyWayGermany%2C%20I%20want%20to%20order%20your%20Visa%20Cover%20Letter%20writing%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg"
            >
              <span className="material-icons-round text-xl">chat</span>
              Order Your Cover Letter on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Cover Letter Structure ────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Structure</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Sample Visa Cover Letter Structure</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Here is exactly what a well-structured German visa cover letter looks like.
              Every section we write covers all of these points.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wide text-xs rounded-tl-2xl w-44">Section</th>
                  <th className="text-left px-6 py-4 font-semibold uppercase tracking-wide text-xs rounded-tr-2xl">What to Include</th>
                </tr>
              </thead>
              <tbody>
                {STRUCTURE_ROWS.map((r, i) => (
                  <tr key={r.section} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-bold text-gray-900 align-top whitespace-nowrap">{r.section}</td>
                    <td className="px-6 py-4 text-gray-600">{r.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Visa Checklist ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Be Prepared</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">German Student Visa Checklist</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Make sure you have all these documents before your visa appointment.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 shadow-card p-8">
            <ul className="space-y-3">
              {VISA_CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="material-icons-round text-primary text-xl mt-0.5 flex-shrink-0">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href="https://india.diplo.de/in-en/service/2552164-2552164"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                <span className="material-icons-round text-xl">open_in_new</span>
                Official German Consulate Visa Checklist
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Our Edge</div>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Cover Letter Service?</h2>
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
