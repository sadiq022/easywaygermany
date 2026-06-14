import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
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
  { abbr: 'TUM', name: 'Technical University of Munich', color: '#0066CC' },
  { abbr: 'LMU', name: 'Ludwig Maximilian University', color: '#1a5276' },
  { abbr: 'RWTH', name: 'RWTH Aachen University', color: '#1abc9c' },
  { abbr: 'KIT', name: 'Karlsruhe Institute of Technology', color: '#16a085' },
  { abbr: 'HU', name: 'Heidelberg University', color: '#8e44ad' },
  { abbr: 'UM', name: 'University of Mannheim', color: '#C0392B' },
]

const TESTIMONIALS = [
  { initials: 'AR', name: 'Ananya R.', program: 'MS in Data Science, TUM', text: 'EasyWay Germany made my dream of studying in Germany come true. Their support in every step was amazing!', featured: false },
  { initials: 'RK', name: 'Rohit K.', program: 'MS in Mechanical Engineering, RWTH Aachen', text: 'From university shortlisting to visa, their team was super professional and always available. Couldn\'t have done it without them.', featured: true },
  { initials: 'PS', name: 'Priya S.', program: 'MS in Biotechnology, Heidelberg University', text: 'I highly recommend EasyWay Germany to anyone planning to study in Germany. Their SOP samples were incredibly helpful!', featured: false },
]



const SUCCESS_STORIES = [
  { name: 'Student Name',  photo: '/images/success-stories/student1.jpg', course: 'MSc Computer Science',        university: 'TU Munich',              intake: 'Winter 2024' },
  { name: 'Student Name',  photo: '/images/success-stories/student2.jpg', course: 'MSc Mechanical Engineering',  university: 'RWTH Aachen',            intake: 'Winter 2024' },
  { name: 'Student Name',  photo: '/images/success-stories/student3.jpg', course: 'MSc Data Science',            university: 'TU Berlin',              intake: 'Summer 2024' },
  { name: 'Student Name',  photo: '/images/success-stories/student4.jpg', course: 'MSc Electrical Engineering',  university: 'KIT Karlsruhe',          intake: 'Winter 2024' },
  { name: 'Student Name',  photo: '/images/success-stories/student5.jpg', course: 'MSc Biotechnology',           university: 'Heidelberg University',  intake: 'Winter 2023' },
  { name: 'Student Name',  photo: '/images/success-stories/student6.jpg', course: 'MBA',                         university: 'University of Mannheim', intake: 'Summer 2024' },
  { name: 'Student Name',  photo: '/images/success-stories/student7.jpg', course: 'MSc Civil Engineering',       university: 'TU Darmstadt',           intake: 'Winter 2024' },
  { name: 'Student Name',  photo: '/images/success-stories/student8.jpg', course: 'MSc Finance',                 university: 'Frankfurt University',   intake: 'Winter 2023' },
]

const STATS = [
  { num: '1000+', label: 'Students Placed' },
  { num: '95%+', label: 'Visa Success Rate' },
  { num: '200+', label: 'Partner Universities' },
  { num: '10+', label: 'Years of Experience' },
]

function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(null)
  const total = TESTIMONIALS.length

  function prev() { setCurrent(i => (i - 1 + total) % total) }
  function next() { setCurrent(i => (i + 1) % total) }

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 40) next()
    else if (diff < -40) prev()
    touchStartX.current = null
  }

  const { initials, name, program, text, featured: feat } = TESTIMONIALS[current]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Student Success Stories</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Real Students. Real Stories.</h2>
        </div>

        {/* Card + Arrows */}
        <div className="relative flex items-center gap-4">
          {/* Left arrow — desktop only */}
          <button
            onClick={prev}
            className="hidden md:flex w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors flex-shrink-0"
            aria-label="Previous"
          >
            <span className="material-icons-round">chevron_left</span>
          </button>

          {/* Card */}
          <div
            className={`flex-1 rounded-2xl p-8 shadow-card select-none ${feat ? 'testimonial-featured' : 'bg-white'}`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
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

          {/* Right arrow — desktop only */}
          <button
            onClick={next}
            className="hidden md:flex w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors flex-shrink-0"
            aria-label="Next"
          >
            <span className="material-icons-round">chevron_right</span>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`}
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
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <img
            src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80"
            alt="Brandenburg Gate Berlin"
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
              Study in Germany<br />
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
              Study in Germany<br />
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



      {/* ── Featured Products ── */}
      <section className="py-20 bg-gray-50">
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
      <section className="py-20 bg-white">
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

      {/* ── Process ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Top Universities in Germany</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Study at Best. Learn from the Best.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {UNIVERSITIES.map(({ abbr, name, color }) => (
              <div key={abbr} className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:shadow-card transition-shadow text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold font-serif text-sm"
                  style={{ backgroundColor: color }}>
                  {abbr}
                </div>
                <span className="text-xs text-gray-600 leading-tight">{name}</span>
              </div>
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
      <section className="pt-20 pb-10 bg-white">
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

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full">
              <span className="material-icons-round text-primary text-base">add_circle</span>
              And 1000+ more students successfully placed
            </div>
            <p className="text-gray-400 text-sm">
              You could be next — both on this list and in Germany.
            </p>
          </div>
        </div>
      </section>

      {/* ── Blog Preview ── */}
      <section className="pt-10 pb-20 bg-white">
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
