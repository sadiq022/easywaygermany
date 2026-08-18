import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const SERVICES = [
  {
    n: '01', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=80',
    title: 'University Shortlisting for Masters in Germany',
    desc: "Selecting the right universities for your Masters application in Germany requires understanding your academic profile, program availability, German university ranking systems (QS, THE, CHE), and admission competitiveness. We shortlist 5–8 universities for each student across three tiers: ambitious targets, strong matches, and safe choices. Our shortlisting process accounts for your GPA, IELTS/TestDaF score, work experience, and target field of study — engineering, computer science, data science, management, or others.",
    bullets: ['Data-driven university selection', 'Deadline tracking', 'Admission probability analysis'],
    cta: 'Learn More', ctaLink: '/services/university-shortlisting',
  },
  {
    n: '02', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=80',
    title: 'SOP Writing for Germany Universities',
    desc: 'A Statement of Purpose for German university admission is very different from UK or US SOPs. German professors expect a research-focused, structured motivation letter that clearly explains your academic background, why you chose this specific program, and how it aligns with your career goals in Germany. Our team has written SOPs for students admitted to TU Munich, RWTH Aachen, TU Dresden, KIT, and 40+ other German universities. We tailor every SOP to the specific program and university — never a template.',
    bullets: ['Personalized from scratch', 'University-specific customization', 'Unlimited revisions'],
    cta: 'Learn More', ctaLink: '/services/sop-writing',
  },
  {
    n: '03', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80',
    title: 'LOR Writing Support for German University Applications',
    desc: "Letters of Recommendation for German universities must come from professors or supervisors who know your academic or professional work. German admissions offices expect LORs to speak specifically to your analytical ability, research potential, and preparedness for postgraduate study in Germany. We help your recommenders draft LORs in the correct format, with the right level of detail — improving your overall application quality without misrepresenting your profile.",
    bullets: ['Written on behalf of your recommender', 'University-specific customization', 'Fast turnaround'],
    cta: 'Learn More', ctaLink: '/services/lor-writing',
  },
  {
    n: '04', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80',
    title: 'CV / Resume Preparation for German Universities',
    desc: 'German universities prefer the Europass or a structured academic CV format that is very different from an Indian resume. The German academic CV includes a photo, lists education in reverse chronological order, and highlights thesis topics, publications, and internships relevant to your field. We reformat and rewrite your CV to match German academic standards — ensuring it complements your SOP and LOR.',
    bullets: ['European CV standard (not Indian resume)', 'ATS-optimized & university-ready', 'Highlights academic and professional strengths'],
    cta: 'Learn More', ctaLink: '/services/cv-preparation',
  },
  {
    n: '05', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80',
    title: 'Germany Student Visa SOP (Letter of Motivation)',
    desc: 'The SOP for your Germany student visa is a separate document from your university SOP. It must address your financial self-sufficiency, your plan of study in Germany, your ties to your home country, and your intention to return after completing your degree. German embassies use this document as part of their assessment of your visa application — a weak visa SOP is one of the most common reasons for rejection. Our consultants, based in Dresden, Germany, know exactly what each embassy expects.',
    bullets: ['Embassy-focused structure & tone', 'Covers study plan and finances', 'Highlights your ties to India'],
    cta: 'Learn More', ctaLink: '/services/visa-sop',
  },
  {
    n: '06', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=80',
    title: 'Visa Cover Letter',
    desc: 'A mandatory document for the German student visa application. Our visa experts craft a personalized letter explaining your financial situation, study plan, and return intent — compliant with the specific requirements of the German embassy or consulate handling your case, so nothing in your file raises unnecessary questions at the visa interview.',
    bullets: ['Mandatory for student visa', 'Crafted by visa experts', 'Compliant with embassy requirements'],
    cta: 'Learn More', ctaLink: '/services/visa-cover-letter',
  },
]

const SERVICES_FAQS = [
  { q: 'Do I need an APS certificate for Masters in Germany?', a: 'Yes. The APS (Akademische Prüfstelle) certificate is mandatory for all Indian students applying to German universities. EasyWay Germany guides you through the full APS process including document checklist and interview preparation.' },
  { q: "What is included in EasyWay Germany's SOP writing service?", a: 'Our SOP writing service includes a profile review, a tailored motivation letter for each German university, unlimited revisions until you are satisfied, and formatting to match German university requirements.' },
  { q: 'Which blocked account provider do you recommend for Indian students?', a: 'We recommend Expatrio or Fintiba for Indian students applying for a Germany student visa. Both are recognised by all German embassies. Expatrio charges a one-time €49 fee and provides confirmation within 1–3 business days.' },
]

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Study in Germany Services 2026 — SOP, APS, Visa SOP, University Shortlisting | EasyWay Germany</title>
        <meta name="description" content="Complete study in Germany services for Indian students — SOP writing, LOR, APS certificate guidance, blocked account setup, university shortlisting, and Germany visa SOP. Expert help from Dresden." />
        <meta name="keywords" content="SOP writing service germany, LOR writing germany, CV preparation germany, university shortlisting service germany, germany visa SOP writing service, APS certificate guidance, blocked account setup germany, study in germany services" />
        <meta property="og:title" content="Study in Germany Services 2026 — SOP, APS, Visa SOP | EasyWay Germany" />
        <meta property="og:description" content="Professional SOP, LOR, CV, university shortlisting and visa services for Indian students applying to Germany. Affordable prices, unlimited revisions." />
        <meta property="og:url" content="https://easywaygermany.com/services" />
        <meta property="og:image" content="https://easywaygermany.com/images/easyway-logo.png" />
        <link rel="canonical" href="https://easywaygermany.com/services" />

        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: SERVICES_FAQS.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        })}</script>
      </Helmet>

      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">What We Offer</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">Complete Study in Germany Services for Indian Students</h1>
          <p className="text-white/75">End-to-end support from university selection to landing in Germany</p>
        </div>
      </div>

      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-gray-600 leading-relaxed">
            Beyond application documents, our Dresden-based consultants also guide Indian students through the
            two most common blockers in a Germany application — the mandatory <strong>APS certificate</strong>{' '}
            (document verification for all Indian applicants) and setting up a <strong>blocked account</strong>{' '}
            (Sperrkonto) for the student visa. Ask us about either during your free consultation.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {SERVICES.map(({ n, img, title, desc, bullets, cta, ctaLink }, idx) => (
            <div
              key={n}
              className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center`}>
              <div className="md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
                  <img src={img} alt={title} className="w-full h-72 object-cover" loading="lazy" />
                  <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full font-serif">{n}</div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Service {n}</div>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-600 leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2 mb-7">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="material-icons-round text-primary text-base mt-0.5">check_circle</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  to={ctaLink}
                  className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
                  {cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Learn More / Internal Links ── */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Learn More</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/blog/masters-in-germany-without-ielts-updated-guide-for-2026" className="text-primary font-semibold hover:underline">
                Masters in Germany Without IELTS — Full Guide
              </Link>
            </li>
            <li>
              <Link to="/blog/germany-student-visa-without-blocked-account-alternatives-2026" className="text-primary font-semibold hover:underline">
                Germany Student Visa Without Blocked Account — 4 Legal Alternatives
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="divide-y divide-gray-100">
            {SERVICES_FAQS.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-gray-900">
                  {q}
                  <span className="material-icons-round text-primary text-xl flex-shrink-0 transition-transform group-open:rotate-45">add</span>
                </summary>
                <p className="text-gray-600 text-sm leading-relaxed mt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
