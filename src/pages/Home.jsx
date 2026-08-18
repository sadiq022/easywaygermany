import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase, isSupabaseConfigured } from '../supabase'
import ProductCard from '../components/ProductCard'

/*
 * SUCCESS STORIES — add real student photos at:
 *   public/images/success-stories/<filename>.jpg
 * Until photos are added, each card shows an initials avatar.
 * Fields: name, photo (path), course, university, intake
 */
function SuccessCard({ name, photo, course, university }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 flex flex-col items-center text-center group">
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/15 group-hover:border-primary/40 transition-colors">
          {imgFailed || !photo ? (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <span className="text-white font-bold text-3xl">{initials}</span>
            </div>
          ) : (
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
          <span className="material-icons-round text-white text-sm">check</span>
        </div>
      </div>
      <h4 className="font-bold text-gray-900 text-base mb-1">{name}</h4>
      <p className="text-primary text-sm font-semibold mb-1">{course}</p>
      <p className="text-gray-500 text-xs">{university}</p>
    </div>
  )
}

const BENEFITS = [
  { icon: 'school', title: 'World-Class Education', desc: 'Study at globally ranked universities' },
  { icon: 'euro', title: 'Low or No Tuition Fees', desc: 'Affordable education with great value' },
  { icon: 'task_alt', title: 'High Visa Success Rate', desc: 'Our expert guidance increases your chances' },
  { icon: 'work', title: 'Work While You Study', desc: '20 hours/week part-time work allowed' },
  { icon: 'flight_takeoff', title: '18-Month PSW Visa', desc: 'Stay back and build your career' },
  { icon: 'public', title: 'Gateway to Europe', desc: 'Explore, travel and grow in Europe' },
]

const SERVICES = [
  { img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80', title: 'University Shortlisting', desc: 'Personalized shortlist of 8–12 universities based on your GPA, IELTS score, budget, and field of study.', link: '/services/university-shortlisting' },
  { img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80', title: 'SOP Writing', desc: 'Expert SOP writers craft powerful, personalized statements that highlight your unique strengths.', link: '/services/sop-writing' },
  { img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80', title: 'LOR Writing', desc: 'Professional Letters of Recommendation written on behalf of your professors, supervisors, or managers.', link: '/services/lor-writing' },
  { img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80', title: 'CV Preparation', desc: 'European-standard CV tailored for German universities — ATS-optimized and professionally formatted.', link: '/services/cv-preparation' },
  { img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', title: 'Visa SOP', desc: 'A Statement of Purpose for the German embassy — covering your study plan, finances, and return intent.', link: '/services/visa-sop' },
  { img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80', title: 'Visa Cover Letter', desc: 'Mandatory for the student visa — crafted by our visa experts to strengthen your embassy application.', link: '/services/visa-cover-letter' },
]

const PROCESS = [
  { n: '1', title: 'Book Consultation', desc: 'We understand your profile and goals' },
  { n: '2', title: 'Profile Evaluation', desc: 'We evaluate and suggest the best options' },
  { n: '3', title: 'University Shortlist', desc: 'We shortlist the best universities for you' },
  { n: '4', title: 'Application', desc: 'We assist in application and documentation' },
  { n: '5', title: 'Visa Processing', desc: 'We guide you through the visa process' },
  { n: '6', title: 'Fly to Germany', desc: 'Pack your bags, we\'ll handle the rest!' },
]

const UNIVERSITIES = [
  { abbr: 'TUM',  name: 'Technical University of Munich',    color: '#0066CC', logo: '/universities/tum_logo.png',            square: true,  scale: 1     },
  { abbr: 'KIT',  name: 'Karlsruhe Institute of Technology', color: '#009682', logo: '/universities/KIT-logo.jpg',            square: true,  scale: 1.15  },
  { abbr: 'RWTH', name: 'RWTH Aachen University',            color: '#006AB3', logo: '/universities/rwth-aachen.webp',        square: true,  scale: 1     },
  { abbr: 'TUB',  name: 'TU Berlin',                         color: '#CC0000', logo: '/universities/tu-berlin-logo.webp',     square: false, scale: 1.45  },
  { abbr: 'HU',   name: 'Heidelberg University',              color: '#C1272D', logo: '/universities/heidelberg-uni-logo.png', square: false, scale: 1.5   },
  { abbr: 'TUD',  name: 'TU Dresden',                         color: '#009AD4', logo: '/universities/tu-dresden-logo.jpg',    square: false, scale: 1     },
]

const TESTIMONIALS = [
  { initials: 'AR', name: 'Ananya R.', program: 'MS in Data Science, TUM', text: 'EasyWay Germany made my dream of studying in Germany come true. Their support in every step was amazing!', featured: false },
  { initials: 'RK', name: 'Rohit K.', program: 'MS in Mechanical Engineering, RWTH Aachen', text: 'From university shortlisting to visa, their team was super professional and always available. Couldn\'t have done it without them.', featured: true },
  { initials: 'PS', name: 'Priya S.', program: 'MS in Biotechnology, Heidelberg University', text: 'I highly recommend EasyWay Germany to anyone planning to study in Germany. Their SOP samples were incredibly helpful!', featured: false },
]



const SUCCESS_STORIES = [
  { name: 'Ali Abbas',                photo: '/students/ali-abbas.jpg',              course: 'MEng Electrical Engineering',                university: 'Hochschule Kempten' },
  { name: 'Anchal Singh',             photo: '/students/anchal-singh.jpg',           course: 'Masters in Agrobiotechnology',               university: 'Justus-Liebig-Universität Gießen' },
  { name: 'Gowtham Basvawajappa',     photo: '/students/gowtham-basvawajappa.jpeg',  course: "Master's in Engineering & Management",       university: 'Berlin School of Business and Innovation' },
  { name: 'Meghana Ratnam',           photo: '/students/meghana-ratnam.jpeg',        course: 'MEng Mechanical Engineering',                university: 'Hochschule Ravensburg-Weingarten' },
  { name: 'Prathamesh',               photo: '/students/prathamesh.jpg',             course: 'M.Sc Computational Modeling & Simulation',   university: 'Technical University of Dresden' },
  { name: 'Preeti Sharma',            photo: '/students/preeti-sharma.webp',         course: 'M.Sc Information Technology',                university: 'Technische Hochschule OWL' },
  { name: 'Ricky Martin',             photo: '/students/ricky-martin.jpg',           course: 'M.Sc Computational Engineering',             university: 'Friedrich-Alexander-Universität Erlangen-Nürnberg' },
  { name: 'Pooja Sharma',             photo: null,                                   course: 'MSc International Management',               university: 'Hochschule Wismar' },
]

const STATS = [
  { num: '1000+', label: 'Students Placed' },
  { num: '95%+', label: 'Visa Success Rate' },
  { num: '200+', label: 'Partner Universities' },
  { num: '10+', label: 'Years of Experience' },
]

const HOME_FAQS = [
  { q: 'Can Indian students do Masters in Germany for free?', a: "Yes. Public universities in Germany charge no tuition fees for Masters programs, including for international students from India. Students pay only a semester contribution of €100–€350 per semester, which covers public transport and administrative fees. Private universities do charge tuition but are the minority." },
  { q: 'Do I need IELTS for Masters in Germany?', a: 'Not always. Many German universities accept English-taught Masters programs without IELTS if you can prove English proficiency through your undergraduate medium of instruction, a Duolingo English Test, or a university-administered test. Some programs specifically waive IELTS for students from English-medium Indian universities.' },
  { q: 'Is the APS certificate mandatory for Indian students?', a: 'Yes. The APS (Akademische Prüfstelle) certificate is mandatory for all Indian students applying to German universities. It involves document verification and a short interview at the APS India centre in New Delhi or Mumbai. Processing typically takes 6–8 weeks.' },
  { q: 'How much does a blocked account cost for Germany?', a: 'You need to deposit €11,904 into a blocked account for 2026 German student visa applications. This is your own money — it is released in monthly instalments of €992 after you arrive in Germany. The account setup fee varies by provider: Expatrio and Fintiba both charge a one-time €49 fee.' },
  { q: 'What documents do I need for a Germany student visa from India?', a: 'Key documents include: university admission letter, APS certificate, valid passport, blocked account confirmation, health insurance proof, SOP for visa, academic transcripts, and proof of language proficiency. Requirements may vary by the German embassy handling your application.' },
  { q: 'Can I apply for Bachelors in Germany from India?', a: 'Yes. Indian students can apply for Bachelors programs in Germany after completing Class 12. However, most public German universities require either a German language certificate (B2/C1) or a one-year foundation course (Studienkolleg) before full admission into a Bachelors program.' },
  { q: 'What is the application deadline for German universities?', a: 'Most German universities have two intake periods: Winter Semester (starting October, deadline June–July) and Summer Semester (starting April, deadline January). Application deadlines vary by university and program. We recommend starting your application process at least 9–12 months before your intended start date.' },
  { q: 'How long does Germany student visa processing take from India?', a: 'Germany student visa processing from Indian embassies typically takes 6–12 weeks after the appointment. Appointment slots at German embassies in Delhi, Mumbai, Kolkata, Chennai, and Bangalore can take 2–4 months to secure. Start your visa process immediately after receiving your university admission letter.' },
  { q: 'Is GRE required for Masters in Germany?', a: 'GRE is generally not required for Masters programs at German public universities. A small number of internationally ranked programs may request GRE scores as part of a competitive selection process, but most programs rely on undergraduate GPA, language scores, SOP, and LORs for admission decisions.' },
  { q: 'How much does living in Germany cost for Indian students?', a: 'The average cost of living in Germany for international students is €800–€1,200 per month, including rent, food, transport, health insurance, and personal expenses. Costs vary by city — Dresden and Leipzig are significantly more affordable than Munich or Frankfurt.' },
  { q: 'How many years is a Masters in Germany for Indian students?', a: 'Most Masters programs in Germany run for 2 years (4 semesters). A smaller number of specialised or professional programs are 1 year (2 semesters) — always check the specific program page, since duration affects both cost and visa validity.' },
  { q: 'What is the Masters in Germany cost in Indian Rupees?', a: 'For a 2-year Masters at a public university outside Baden-Württemberg, expect roughly ₹19–₹28 lakh total for living costs, with no tuition fees. The blocked account deposit (~₹11.3 lakh) is separate — it is your own money, returned to you monthly.' },
  { q: 'Can Indian students get a scholarship for Masters in Germany?', a: "Yes. DAAD offers several scholarship programs covering a monthly stipend and health insurance for eligible students. Since public university tuition is already free, many Indian students study without a scholarship, funding living costs through a blocked account instead." },
]

const HOW_WE_HELP = [
  { title: 'SOP Writing for German Universities', body: "Your Statement of Purpose for a Masters in Germany must address academic motivation, research alignment, and your long-term career goals in Germany. Our SOP writers have reviewed hundreds of successful applications to German universities and know exactly what the admissions committee looks for." },
  { title: 'APS Certificate Guidance for Indian Students', body: 'The APS certificate (Akademische Prüfstelle) is mandatory for Indian students applying for a Masters or Bachelors in Germany. The process involves document verification and an interview at the APS centre in New Delhi or Mumbai. We guide you through every step — document checklist, interview preparation, and submission.' },
  { title: 'University Shortlisting for Masters in Germany', body: 'Choosing the right German university for your Masters is critical. We analyse your academic profile, GPA, language scores, and work experience to shortlist 5–8 universities across different tiers — ensuring you have strong options without over-applying.' },
  { title: 'Blocked Account Setup', body: 'Every Indian student needs a German blocked account (Sperrkonto) to apply for a student visa. The current required amount in 2026 is €11,904 per year. We guide you through choosing the right provider (Expatrio or Fintiba), completing the setup, and submitting the confirmation with your visa application.' },
  { title: 'Germany Student Visa SOP', body: 'The visa SOP (Letter of Motivation for visa) is different from your university SOP. It must address your financial situation, ties to home country, and intention to return. Our consultants — based in Germany — know what German embassies expect and help you write a visa SOP that avoids common rejection reasons.' },
  { title: 'LOR Writing Support', body: 'Letters of Recommendation for German university applications must highlight academic and professional capabilities in a format familiar to German professors. We help your recommenders draft LORs that align with German admission standards.' },
]

function TestimonialCard({ initials, name, program, text, featured: feat }) {
  return (
    <div className={`rounded-2xl p-7 shadow-card h-full ${feat ? 'testimonial-featured' : 'bg-white'}`}>
      <div className={`font-serif text-6xl leading-none mb-4 ${feat ? 'text-white/30' : 'text-gray-200'}`}>"</div>
      <p className={`text-sm leading-relaxed mb-6 ${feat ? 'text-white' : 'text-gray-600'}`}>{text}</p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${feat ? 'bg-white/20 text-white' : 'bg-primary text-white'}`}>
          {initials}
        </div>
        <div>
          <div className={`font-semibold text-sm ${feat ? 'text-white' : 'text-gray-900'}`}>{name}</div>
          <div className={`text-xs ${feat ? 'text-white/70' : 'text-gray-500'}`}>{program}</div>
        </div>
      </div>
    </div>
  )
}

function UniversityCard({ abbr, name, color, logo, square, scale }) {
  const [imgFailed, setImgFailed] = useState(false)
  return (
    <div className="flex flex-col items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-card transition-shadow text-center">
      <div className={`w-full overflow-hidden flex items-center justify-center ${square ? 'h-20' : 'h-16'}`}>
        {!imgFailed ? (
          <img
            src={logo}
            alt={name}
            className="w-full h-full object-contain"
            style={scale && scale !== 1 ? { transform: `scale(${scale})` } : undefined}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: color }}>
            {abbr}
          </div>
        )}
      </div>
      <span className="text-sm text-gray-600 leading-tight font-medium">{name}</span>
    </div>
  )
}

function TestimonialsCarousel() {
  const N = TESTIMONIALS.length

  // V = how many cards are visible at once (3 on desktop, 1 on mobile)
  const [V, setV] = useState(window.innerWidth >= 768 ? 3 : 1)

  useEffect(() => {
    function onResize() {
      const next = window.innerWidth >= 768 ? 3 : 1
      if (next !== V) { setV(next); setAnimated(false); setIdx(next) }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [V])

  // Clone V cards from each end so the loop never shows a blank
  const loopCards = [...TESTIMONIALS.slice(-V), ...TESTIMONIALS, ...TESTIMONIALS.slice(0, V)]
  const loopTotal = loopCards.length

  const [idx, setIdx] = useState(V)   // start at first real card
  const [animated, setAnimated] = useState(true)
  const touchStartX = useRef(null)

  function goPrev() { setAnimated(true); setIdx(i => i - 1) }
  function goNext() { setAnimated(true); setIdx(i => i + 1) }

  // After sliding into a clone region, silently snap to the real equivalent
  useEffect(() => {
    if (idx < V) {
      const t = setTimeout(() => { setAnimated(false); setIdx(idx + N) }, 500)
      return () => clearTimeout(t)
    }
    if (idx >= V + N) {
      const t = setTimeout(() => { setAnimated(false); setIdx(idx - N) }, 500)
      return () => clearTimeout(t)
    }
  }, [idx, V, N])

  useEffect(() => {
    if (!animated) {
      const t = setTimeout(() => setAnimated(true), 50)
      return () => clearTimeout(t)
    }
  }, [animated])

  // Which real card is centred in the viewport
  const dotActive = (idx - Math.ceil(V / 2) + N * 100) % N

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 40) goNext()
    else if (diff < -40) goPrev()
    touchStartX.current = null
  }

  return (
    <section className="py-10 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Student Success Stories</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Real Students. Real Stories.</h2>
        </div>

        <div className="relative flex items-center gap-3">
          <button
            onClick={goPrev}
            className="w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors flex-shrink-0"
            aria-label="Previous"
          >
            <span className="material-icons-round">chevron_left</span>
          </button>

          <div className="overflow-hidden flex-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div
              className="flex items-stretch"
              style={{
                width: `${loopTotal * 100 / V}%`,
                transform: `translateX(-${idx * 100 / loopTotal}%)`,
                transition: animated ? 'transform 0.45s ease-in-out' : 'none',
              }}
            >
              {loopCards.map((t, i) => (
                <div key={i} style={{ width: `${100 / loopTotal}%` }} className="px-2 box-border">
                  <TestimonialCard {...t} featured={i === idx + Math.floor(V / 2)} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={goNext}
            className="w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors flex-shrink-0"
            aria-label="Next"
          >
            <span className="material-icons-round">chevron_right</span>
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAnimated(true); setIdx(i + V) }}
              className={`rounded-full transition-all duration-300 ${i === dotActive ? 'w-6 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [dbBlogs, setDbBlogs] = useState([])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    
    // Fetch featured products
    supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(6)
      .then(({ data }) => setFeatured(data || []))

    // Fetch latest 3 blogs
    supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false })
      .limit(3)
      .then(({ data }) => setDbBlogs(data || []))
  }, [])

  return (
    <>
      <Helmet>
        <title>Masters & Bachelors in Germany Consultancy | EasyWay Germany — Expert Help from Dresden</title>
        <meta name="description" content="Planning Masters or Bachelors in Germany? Get expert help from consultants who actually live in Germany — SOP writing, APS certificate, university shortlisting, blocked account, and visa SOP. Free consultation available." />
        <meta name="keywords" content="masters in germany, bachelors in germany, study in germany consultancy, study in germany from india, germany university admission, APS certificate help, blocked account germany, germany student visa consultants, SOP writing germany, masters in germany indian students" />
        <meta property="og:title" content="Masters & Bachelors in Germany Consultancy | EasyWay Germany" />
        <meta property="og:description" content="Expert guidance for Indian students applying to German universities — from consultants who actually live in Germany. SOP, LOR, CV, APS certificate, blocked account & visa support." />
        <meta property="og:url" content="https://easywaygermany.com/" />
        <meta property="og:image" content="https://easywaygermany.com/images/easyway-logo.png" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://easywaygermany.com/" />

        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'EasyWay Germany',
          description: 'Study abroad consultancy for Masters and Bachelors in Germany for Indian, Bangladeshi, and Nepali students. Based in Dresden, Germany.',
          url: 'https://easywaygermany.com',
          email: 'info@easywaygermany.com',
          telephone: '+49-152-3673-8625',
          address: { '@type': 'PostalAddress', addressLocality: 'Dresden', addressRegion: 'Saxony', addressCountry: 'DE' },
          areaServed: ['India', 'Bangladesh', 'Nepal'],
          serviceType: 'Study Abroad Consultancy',
          priceRange: '$$',
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: HOME_FAQS.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <img
            src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80"
            alt="EasyWay Germany — Masters and Bachelors in Germany consultancy for Indian students"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Mobile-only overlay text ON the image itself */}
          <div className="md:hidden absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-white bg-black/40">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <svg className="rounded-sm flex-shrink-0" style={{ width: '20px', height: '12px', display: 'inline-block' }} viewBox="0 0 5 3">
                <rect width="5" height="1" y="0" fill="#000000" />
                <rect width="5" height="1" y="1" fill="#FF0000" />
                <rect width="5" height="1" y="2" fill="#FFCC00" />
              </svg>
              Your Easy Way to Study in Germany
            </div>
            <h1 className="font-serif text-3xl font-black leading-tight text-yellow-400 mb-2">
              Masters &amp; Bachelors in Germany<br />
              <span className="text-white">Made Easy!</span>
            </h1>
            <p className="text-white/90 text-xs leading-relaxed max-w-[280px] text-center font-normal">
              We simplify your journey to top German universities. From university selection to visa – we handle it all.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full hero-inner">
          {/* Centered content */}
          <div className="text-white max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Desktop-only Badge */}
            <div className="hidden md:inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <svg className="rounded-sm flex-shrink-0" style={{ width: '20px', height: '12px', display: 'inline-block' }} viewBox="0 0 5 3">
                <rect width="5" height="1" y="0" fill="#000000" />
                <rect width="5" height="1" y="1" fill="#FF0000" />
                <rect width="5" height="1" y="2" fill="#FFCC00" />
              </svg>
              Your Easy Way to Study in Germany
            </div>
            {/* Desktop-only Heading */}
            <h1 className="hidden md:block font-serif text-5xl md:text-6xl font-black leading-tight mb-4 text-center">
              Masters &amp; Bachelors in Germany<br />
              <span className="text-yellow-400">Made Easy!</span>
            </h1>
            
            {/* Paragraph (only visible on desktop, moved to image overlay on mobile) */}
            <p className="hidden md:block text-white/85 text-lg md:text-xl mb-8 leading-relaxed text-center">
              We simplify your journey to top German universities.<br />
              From university selection to visa – we handle it all.
            </p>

            {/* Buttons (always visible) */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors text-base">
                <span className="material-icons-round text-base">calendar_today</span>
                Book Consultation
              </Link>
              <Link to="/products" className="flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-gray-900 transition-colors text-base">
                <span className="material-icons-round text-base">store</span>
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Masters in Germany ── */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Why Germany</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Why Indian Students Choose Masters in Germany</h2>
          </div>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Germany is one of the top destinations for Indian students pursuing a Masters degree abroad.
              Public universities in Germany charge no tuition fees for Masters programs — even for international students.
              Students only pay a semester contribution of €100–€350 which covers public transport and administrative costs.
            </p>
            <p>
              Germany offers over 1,800 English-taught Masters programs across engineering, computer science,
              management, and natural sciences. After completing your Masters in Germany, you receive an 18-month
              post-study work visa to find employment — one of the most generous in Europe.
            </p>
            <p>
              Indian students are among the largest international student communities in Germany, with universities
              like TU Munich, RWTH Aachen, TU Dresden, and Heidelberg consistently ranked among the world's best.
              EasyWay Germany helps you navigate the entire process — from university shortlisting to visa approval —
              from our base in Dresden, Germany.
            </p>
            <p>
              Wondering how to do a Masters in Germany from India, or whether an MS in Germany for Indian students
              makes sense for your profile? We walk every applicant through the full journey — from choosing a
              program to receiving your visa.
            </p>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-2">
            <Link to="/blog/masters-in-germany-for-indian-students-complete-guide-2026" className="text-primary font-semibold hover:underline text-sm">
              Masters in Germany for Indian Students — Complete Guide →
            </Link>
            <Link to="/blog/is-masters-in-germany-free-for-international-students-2026" className="text-primary font-semibold hover:underline text-sm">
              Is a Masters in Germany Really Free? →
            </Link>
            <Link to="/blog/masters-in-germany-cost-in-indian-rupees-2026-full-breakdown" className="text-primary font-semibold hover:underline text-sm">
              Masters in Germany Cost in Indian Rupees — Full Breakdown →
            </Link>
            <Link to="/blog/how-to-study-in-germany-from-india-step-by-step-guide-2026" className="text-primary font-semibold hover:underline text-sm">
              How to Study in Germany from India — Step by Step →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Our Digital Products</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Everything You Need to<br />Crack Your German Application
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Trusted resources used by 1000+ successful students. Buy once, use forever.</p>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-card animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-2xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/products" className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">What We Do</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-500">End-to-end support for your Study in Germany journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ img, title, desc, link }) => (
              <div key={title} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow group">
                <div className="h-44 overflow-hidden">
                  <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-gray-900 text-lg mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{desc}</p>
                  <Link to={link} className="inline-block bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Help You ── */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">In Detail</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">How EasyWay Germany Helps You Get Admitted</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {HOW_WE_HELP.map(({ title, body }) => (
              <div key={title}>
                <h3 className="font-serif font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8 md:mb-14">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Our Process</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Your Journey, Step by Step</h2>
          </div>
          <div className="process-steps">
            {PROCESS.map(({ n, title, desc }, idx) => (
              <div key={n} className="flex flex-col items-center text-center px-2 relative">
                <div className="w-14 h-14 rounded-full bg-primary text-white font-serif font-bold text-xl flex items-center justify-center shadow-lg mb-3 z-10">
                  {n}
                </div>
                {idx < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-1/2 w-full h-0.5 bg-primary/20" />
                )}
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{title}</h4>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Universities ── */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Top Universities in Germany</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Study at Best. Learn from the Best.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {UNIVERSITIES.map(({ abbr, name, color, logo, square, scale }) => (
              <UniversityCard key={abbr} abbr={abbr} name={name} color={color} logo={logo} square={square} scale={scale} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products?category=university-lists" className="inline-flex items-center justify-center border-2 border-primary text-primary px-8 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
              Explore University Lists
            </Link>
          </div>
        </div>
      </section>


      {/* ── Testimonials ── */}
      <TestimonialsCarousel />

      {/* ── Success Stories ── */}
      <section className="pt-10 md:pt-20 pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Success Stories</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Students Who Made It to Germany
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Real students, real admissions. Here are some of the students we helped get into top German universities.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-10">
            {SUCCESS_STORIES.map((s, i) => (
              <SuccessCard key={i} {...s} />
            ))}
          </div>

          <div className="text-center">
            <p className="inline-block text-primary font-bold text-base bg-primary/8 border border-primary/20 px-6 py-3 rounded-full">
              You could be next — both on this list and in Germany.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">FAQ</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions — Masters &amp; Bachelors in Germany</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {HOME_FAQS.map(({ q, a }) => (
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

      {/* ── Blog Preview ── */}
      <section className="pt-10 pb-10 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Latest from Our Blog</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Tips, Updates & Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dbBlogs.length > 0 ? (
              dbBlogs.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl shadow-card overflow-hidden group flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                    {b.image ? (
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="material-icons-round text-5xl">article</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{b.category}</div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="material-icons-round text-xs">calendar_today</span>
                        {new Date(b.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons-round text-xs">schedule</span>
                        {b.read_time}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 text-base leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">{b.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{b.excerpt}</p>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link to={`/blog/${b.slug}`} className="w-full block text-center py-2.5 px-4 bg-primary text-white hover:bg-primary-dark rounded-xl text-sm font-bold transition-all shadow-sm">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-card animate-pulse overflow-hidden" style={{ minHeight: '350px' }}>
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}
