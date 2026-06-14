import { Link } from 'react-router-dom'

const SERVICES = [
  {
    n: '01', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=80',
    title: 'University Shortlisting',
    desc: 'We build a balanced shortlist of safe, moderate, and ambitious universities based on your profile, GPA, language scores, budget, and field of study.',
    bullets: ['Data-driven university selection', 'Deadline tracking', 'Admission probability analysis'],
    cta: 'Learn More', ctaLink: '/services/university-shortlisting',
  },
  {
    n: '02', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=80',
    title: 'SOP Writing',
    desc: 'A powerful Statement of Purpose is your most important application document. Our professional SOP writers craft compelling narratives that highlight your unique story, academic strengths, and career vision.',
    bullets: ['Personalized from scratch', 'University-specific customization', 'Unlimited revisions'],
    cta: 'Learn More', ctaLink: '/services/sop-writing',
  },
  {
    n: '03', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80',
    title: 'LOR Writing',
    desc: 'We write professional Letters of Recommendation on behalf of your professors, supervisors, or company managers — tailored to each university\'s requirements.',
    bullets: ['Written on behalf of your recommender', 'University-specific customization', 'Fast turnaround'],
    cta: 'Learn More', ctaLink: '/services/lor-writing',
  },
  {
    n: '04', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80',
    title: 'CV Preparation',
    desc: 'We prepare a European-standard CV tailored for German university applications — ATS-optimized and professionally formatted to make you stand out.',
    bullets: ['European CV standard (not Indian resume)', 'ATS-optimized & university-ready', 'Highlights academic and professional strengths'],
    cta: 'Learn More', ctaLink: '/services/cv-preparation',
  },
  {
    n: '05', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80',
    title: 'Visa SOP',
    desc: 'A Statement of Purpose written specifically for the German embassy — covering your study plan, financial situation, and clear intent to return to India after graduation.',
    bullets: ['Embassy-focused structure & tone', 'Covers study plan and finances', 'Highlights your ties to India'],
    cta: 'Learn More', ctaLink: '/services/visa-sop',
  },
  {
    n: '06', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=80',
    title: 'Visa Cover Letter',
    desc: 'A mandatory document for the German student visa application. Our visa experts craft a personalized letter explaining your financial situation, study plan, and return intent.',
    bullets: ['Mandatory for student visa', 'Crafted by visa experts', 'Compliant with embassy requirements'],
    cta: 'Learn More', ctaLink: '/services/visa-cover-letter',
  },
]

export default function Services() {
  return (
    <>
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">What We Offer</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">Our Services</h1>
          <p className="text-white/75">End-to-end support from university selection to landing in Germany</p>
        </div>
      </div>

      <section className="py-16 bg-white">
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
    </>
  )
}
