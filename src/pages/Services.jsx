import { Link } from 'react-router-dom'

const SERVICES = [
  {
    n: '01', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80',
    title: 'Career Counseling',
    desc: 'Our expert counselors analyze your academic background, work experience, and career goals to suggest the most suitable course and universities. We help you make the right choice—not just the popular one.',
    bullets: ['Profile evaluation & gap analysis', 'Course recommendation by GPA & IELTS', 'Career path planning for Germany'],
    cta: 'Book Consultation', ctaLink: '/contact',
  },
  {
    n: '02', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=80',
    title: 'SOP Writing',
    desc: 'A powerful Statement of Purpose is your most important application document. Our professional SOP writers craft compelling narratives that highlight your unique story, academic strengths, and career vision.',
    bullets: ['Personalized from scratch', 'University-specific customization', 'Unlimited revisions'],
    cta: 'Get SOP Help', ctaLink: '/contact',
  },
  {
    n: '03', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=80',
    title: 'University Shortlisting',
    desc: 'We build a balanced shortlist of safe, moderate, and ambitious universities based on your profile, GPA, language scores, budget, and field of study.',
    bullets: ['Data-driven university selection', 'Deadline tracking', 'Admission probability analysis'],
    cta: 'View University Lists', ctaLink: '/products?category=university-lists',
  },
  {
    n: '04', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80',
    title: 'Application Support',
    desc: 'We guide you through every portal, form, and document checklist. No missed deadlines. No rejected applications due to incomplete documents.',
    bullets: ['Uni-Assist portal guidance', 'Document preparation & translation', 'Application tracking'],
    cta: 'Get Application Help', ctaLink: '/contact',
  },
  {
    n: '05', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=80',
    title: 'Visa Assistance',
    desc: 'Our visa experts have a 95%+ success rate. We guide you on blocked account setup, document preparation, and visa interview coaching.',
    bullets: ['Visa document checklist', 'Blocked account guidance', 'Mock visa interviews'],
    cta: 'Visa Consultation', ctaLink: '/contact',
  },
  {
    n: '06', img: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?w=700&q=80',
    title: 'Pre-Departure Support',
    desc: 'Our support doesn\'t end at visa. We help you with accommodation search, health insurance, forex, SIM cards, and everything to settle smoothly in Germany.',
    bullets: ['Accommodation search assistance', 'Health insurance guidance', 'Arrival checklist'],
    cta: 'Pre-Departure Help', ctaLink: '/contact',
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
