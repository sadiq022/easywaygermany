import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const WHY_ITEMS = [
  {
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    icon: 'school',
    title: 'World-Class Universities',
    desc: 'Germany is home to 400+ public universities including TU Munich, RWTH Aachen, and Heidelberg — globally ranked and recognised by every employer worldwide.',
  },
  {
    img: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80',
    icon: 'euro_symbol',
    title: 'Zero Tuition Fees',
    desc: 'Public universities in Germany charge no tuition for international students — only a semester contribution of €100–€350, which often includes a public transport pass for the entire city.',
  },
  {
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    icon: 'work',
    title: 'Work While You Study',
    desc: 'Students can work up to 120 full days per year (20 hrs/week during semester). Average student jobs pay €12–€15/hour — enough to cover most monthly expenses.',
  },
  {
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    icon: 'trending_up',
    title: '18-Month Job-Seeker Visa',
    desc: 'After completing your degree, Germany allows you to stay 18 months to find a job. Most graduates receive EU Blue Cards and eventually permanent residency.',
  },
  {
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    icon: 'public',
    title: 'Gateway to All of Europe',
    desc: 'Living in Germany means free movement across 26 Schengen countries. Travel, internships, and weekend trips across Europe become part of student life.',
  },
  {
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    icon: 'health_and_safety',
    title: 'Affordable Healthcare',
    desc: "Germany's public health insurance costs students just €110–€130/month and covers virtually everything — doctor visits, hospital, prescriptions.",
  },
]

const PROCESS_STEPS = [
  {
    n: '01',
    icon: 'manage_accounts',
    title: 'Profile Evaluation',
    desc: 'We assess your GPA, backlogs, IELTS/TOEFL score, work experience, and preferred field to identify your realistic university options.',
    img: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80',
  },
  {
    n: '02',
    icon: 'fact_check',
    title: 'APS Certificate',
    desc: 'Indian students must get their academic documents verified by APS India before applying to German universities. We guide you through every step.',
    img: 'https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=600&q=80',
    link: '/services',
  },
  {
    n: '03',
    icon: 'menu_book',
    title: 'University Shortlisting & Application',
    desc: 'We shortlist 8–12 universities matching your profile, write your SOP & LOR, prepare your CV, and file complete applications via uni-assist or direct portals.',
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    link: '/services/university-shortlisting',
  },
  {
    n: '04',
    icon: 'account_balance',
    title: 'Blocked Account (Sperrkonto)',
    desc: 'Open a blocked account with €11,904 (2026 requirement) via Fintiba, Expatrio, or Deutsche Bank. We help you choose the right provider and complete the process.',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    link: '/blocked-account-germany',
  },
  {
    n: '05',
    icon: 'assignment_turned_in',
    title: 'Student Visa Application',
    desc: 'We prepare your complete visa file — Visa SOP, cover letter, and document checklist — and brief you for the VFS Global visa appointment.',
    img: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=600&q=80',
    link: '/visa-package',
  },
  {
    n: '06',
    icon: 'flight_takeoff',
    title: 'Fly to Germany',
    desc: 'Once your visa is approved, we guide you on pre-departure essentials — health insurance, accommodation, Anmeldung registration, and settling in.',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
  },
]

const CLUSTERS = [
  {
    img: 'https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=700&q=80',
    icon: 'verified',
    title: 'APS Certificate',
    desc: 'Mandatory document verification for all Indian students. We explain what it is, how to apply, what documents are needed, and how to prepare for the APS interview.',
    link: '/services',
    tag: 'Required for all Indian students',
    color: 'bg-blue-50 border-blue-100',
    iconColor: 'text-blue-600 bg-blue-100',
  },
  {
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=80',
    icon: 'account_balance',
    title: 'Blocked Account (Sperrkonto)',
    desc: 'You need €11,904 in a German blocked account for your student visa. We compare providers (Fintiba vs Expatrio vs Deutsche Bank) and guide you through opening one from India.',
    link: '/blocked-account-germany',
    tag: '€11,904 required for 2026',
    color: 'bg-green-50 border-green-100',
    iconColor: 'text-green-600 bg-green-100',
  },
  {
    img: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=700&q=80',
    icon: 'flight_takeoff',
    title: 'Student Visa',
    desc: 'Complete guide to the German student visa — document checklist, VFS appointment booking, interview preparation, processing times from India, Bangladesh & Nepal.',
    link: '/visa-package',
    tag: 'Takes 6–12 weeks',
    color: 'bg-purple-50 border-purple-100',
    iconColor: 'text-purple-600 bg-purple-100',
  },
  {
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=700&q=80',
    icon: 'school',
    title: 'Top Universities',
    desc: "TU Munich, RWTH Aachen, TU Berlin, KIT, Heidelberg — Germany's TU9 and beyond. We help you find the right university for your profile and field of study.",
    link: '/services/university-shortlisting',
    tag: '400+ public universities',
    color: 'bg-orange-50 border-orange-100',
    iconColor: 'text-orange-600 bg-orange-100',
  },
  {
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=80',
    icon: 'edit_note',
    title: 'SOP & LOR Writing',
    desc: 'A strong Statement of Purpose and Letters of Recommendation can make or break your application. Our writers — all Germany-based — craft yours from scratch.',
    link: '/services/sop-writing',
    tag: 'Starting ₹2,500',
    color: 'bg-red-50 border-red-100',
    iconColor: 'text-red-600 bg-red-100',
  },
  {
    img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80',
    icon: 'workspace_premium',
    title: 'Scholarships',
    desc: 'DAAD, Deutschlandstipendium, Erasmus Mundus and more. Germany has generous scholarship options for Indian, Bangladeshi and Nepali students.',
    link: '/services',
    tag: 'DAAD, Erasmus & more',
    color: 'bg-yellow-50 border-yellow-100',
    iconColor: 'text-yellow-600 bg-yellow-100',
  },
]

const COST_ITEMS = [
  { icon: 'school', label: 'Tuition Fees', value: '€0 – €350/sem', note: 'Semester contribution only at public universities', color: 'text-green-600' },
  { icon: 'home', label: 'Accommodation', value: '€300 – €700/mo', note: 'Dormitory: €250–350 · Private: €500–700', color: 'text-blue-600' },
  { icon: 'restaurant', label: 'Food & Groceries', value: '€150 – €250/mo', note: 'Cooking at home keeps costs low', color: 'text-orange-600' },
  { icon: 'directions_transit', label: 'Public Transport', value: '€0 – €29/mo', note: 'Often free with semester ticket; €49 Deutschlandticket', color: 'text-purple-600' },
  { icon: 'health_and_safety', label: 'Health Insurance', value: '~€150/mo', note: 'TK, DAK, AOK — mandatory for all students', color: 'text-red-600' },
  { icon: 'phonelink', label: 'Phone & Internet', value: '€10 – €20/mo', note: 'Prepaid SIM from Aldi/Lidl or contracts', color: 'text-indigo-600' },
  { icon: 'savings', label: 'Total per Month', value: '€700 – €1,100/mo', note: 'Can be offset by part-time work (€12–15/hr)', color: 'text-gray-900' },
]

const FAQS = [
  {
    q: 'Can Indian students study in Germany without IELTS?',
    a: 'Yes. Many universities accept TOEFL, Duolingo, or a medium-of-instruction letter from your previous university as proof of English proficiency. However, IELTS (6.0–6.5 band) is most widely accepted and gives you the broadest choice of programs.',
  },
  {
    q: 'What is the minimum percentage required for Masters in Germany?',
    a: 'Most German public universities require 60–65% (7.0 CGPA) in your bachelor\'s. Top universities like TU Munich and RWTH Aachen prefer 70–75%+. However, a strong SOP, relevant projects, and work experience can compensate for a slightly lower GPA at many universities.',
  },
  {
    q: 'How many backlogs are acceptable for Germany university admission?',
    a: 'Most universities accept up to 5–7 cleared backlogs. Backlogs must be cleared by the time you apply. A smaller number of backlogs and a strong overall profile (GPA, SOP, projects) significantly improves your chances.',
  },
  {
    q: 'Is APS certificate mandatory? What if I already graduated?',
    a: 'APS certificate is mandatory for all Indian students, regardless of when you graduated. It verifies the authenticity of your academic documents (10th, 12th, bachelor\'s degree and transcripts). You can apply for APS even after completing your degree.',
  },
  {
    q: 'What is the blocked account amount required in 2026?',
    a: 'The German government requires international students to show €11,904 in a blocked account (Sperrkonto) for 2026. This amount is updated annually (it was €11,208 in 2023 and has increased each year). You can withdraw approximately €992/month after arriving in Germany.',
  },
  {
    q: 'How long does the Germany student visa take from India?',
    a: 'Visa appointment waiting time at VFS Global can be 4–8 weeks. Processing after submission takes 6–12 weeks. Plan to start your visa process at least 4–5 months before your intended travel date to avoid missing the semester start.',
  },
  {
    q: 'Can I work part-time while studying in Germany?',
    a: 'Yes. International students can work up to 120 full days or 240 half-days per year. During semester breaks, you can work full-time. Average wages are €12–€15/hour. This can comfortably cover your monthly living expenses once you settle in.',
  },
  {
    q: 'Does EasyWay Germany help students from Bangladesh and Nepal?',
    a: 'Absolutely. We regularly assist students from India, Bangladesh, and Nepal. The core process (APS, blocked account, visa) is similar, but there are country-specific differences — particularly for the embassy process in Dhaka and Kathmandu, which we\'ll guide you through specifically.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? 'border-primary/30 shadow-sm' : 'border-gray-200'}`}>
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-semibold text-gray-900 text-sm leading-snug">{q}</span>
        <span className={`material-icons-round flex-shrink-0 text-primary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://easywaygermany.com/' },
    { '@type': 'ListItem', position: 2, name: 'Study in Germany', item: 'https://easywaygermany.com/study-in-germany' },
  ],
}

export default function StudyInGermany() {
  return (
    <>
      <Helmet>
        <title>Study in Germany 2026: Complete Guide for Indian, Bangladeshi & Nepali Students | EasyWay Germany</title>
        <meta name="description" content="The most comprehensive guide to studying in Germany in 2026 — APS certificate, blocked account (€11,904), student visa, top universities, scholarships, cost of living, and how to apply. Free consultation from experts who live in Germany." />
        <meta name="keywords" content="study in germany 2026, study in germany from india, study in germany complete guide, masters in germany indian students, APS certificate germany, blocked account germany 2026, germany student visa india, study in germany requirements, germany university admission, study in germany step by step" />
        <meta property="og:title" content="Study in Germany 2026: Complete Guide | EasyWay Germany" />
        <meta property="og:description" content="Everything you need to study in Germany — APS certificate, blocked account, student visa, top universities, scholarships, and cost of living. Expert guidance from Dresden." />
        <meta property="og:url" content="https://easywaygermany.com/study-in-germany" />
        <meta property="og:image" content="https://easywaygermany.com/og-image.jpg" />
        <meta property="og:type" content="article" />
        <link rel="canonical" href="https://easywaygermany.com/study-in-germany" />
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_SCHEMA)}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <img
            src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1800&q=85"
            alt="Brandenburg Gate Berlin Germany"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Mobile-only overlay text ON the image */}
          <div className="md:hidden absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-white bg-black/40">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <span className="material-icons-round text-xs text-yellow-400">auto_awesome</span>
              Updated for 2026
            </div>
            <h1 className="font-serif text-3xl font-black leading-tight text-yellow-400 mb-2">
              Study in Germany<br />
              <span className="text-white">Complete Guide 2026</span>
            </h1>
            <p className="text-white/90 text-xs leading-relaxed max-w-[280px] text-center font-normal">
              APS certificate, blocked account, student visa &amp; top universities — all in one guide.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full hero-inner">
          <div className="text-white max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Breadcrumb (desktop only) */}
            <nav className="hidden md:flex items-center gap-2 text-white/60 text-xs mb-5 flex-wrap justify-center">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="material-icons-round text-xs">chevron_right</span>
              <span className="text-white">Study in Germany</span>
            </nav>
            {/* Desktop-only Badge */}
            <div className="hidden md:inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="material-icons-round text-xs text-yellow-400">auto_awesome</span>
              Updated for 2026 — Blocked account: €11,904
            </div>
            {/* Desktop-only Heading */}
            <h1 className="hidden md:block font-serif text-5xl md:text-6xl font-black leading-tight mb-4 text-center">
              Study in Germany<br />
              <span className="text-yellow-400">Complete Guide 2026</span>
            </h1>
            {/* Paragraph (desktop only) */}
            <p className="hidden md:block text-white/85 text-lg md:text-xl mb-8 leading-relaxed text-center">
              Everything you need to know — APS certificate, blocked account, student visa,<br />
              top universities &amp; cost of living — from consultants who live in Germany.
            </p>
            {/* Buttons (always visible) */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl transition-colors">
                <span className="material-icons-round text-base">calendar_today</span>
                Free Consultation
              </Link>
              <a href="#process"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-gray-900 transition-colors">
                <span className="material-icons-round text-base">arrow_downward</span>
                See the Process
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY GERMANY ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Why Choose Germany</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Study in Germany in 2026?
            </h2>
            <p className="text-gray-900 max-w-2xl mx-auto text-base">
              Germany offers a unique combination of world-class education, zero tuition fees, and a clear path to European residency — making it the top destination for Indian students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_ITEMS.map(item => (
              <div key={item.title} className="group rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-white border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                      <span className="material-icons-round text-white text-base">{item.icon}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                  <p className="text-gray-900 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COST BREAKDOWN ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Real Numbers</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cost of Studying in Germany for Indian Students (2026)
            </h2>
            <p className="text-sm text-gray-900 max-w-2xl mx-auto leading-relaxed">
              Germany is genuinely affordable compared to the UK, USA, or Australia. Your biggest cost is not tuition (€0 at public universities) — it's living expenses, which you can offset with part-time work.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {COST_ITEMS.map(item => (
              <div key={item.label} className={`flex items-center gap-4 p-5 bg-white rounded-xl border shadow-sm ${item.label === 'Total per Month' ? 'border-primary/30 bg-primary/5' : 'border-gray-100'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.label === 'Total per Month' ? 'bg-primary' : 'bg-gray-100'}`}>
                  <span className={`material-icons-round text-base ${item.label === 'Total per Month' ? 'text-white' : item.color}`}>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-gray-900">{item.label}</span>
                    <span className={`font-bold text-sm text-right ${item.label === 'Total per Month' ? 'text-primary' : item.color}`}>{item.value}</span>
                  </div>
                  <p className="text-sm text-gray-900 mt-0.5">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FULL PROCESS ── */}
      <section id="process" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Step by Step</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              How to Study in Germany: Complete Process
            </h2>
            <p className="text-gray-900 max-w-2xl mx-auto">
              From your first consultation to landing in Germany — here's the full 6-step process, with typical timelines and what to expect at each stage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.n} className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-white border border-gray-100">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 bg-primary text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    Step {step.n}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons-round text-primary text-base">{step.icon}</span>
                    <h3 className="font-bold text-gray-900 text-base">{step.title}</h3>
                  </div>
                  <p className="text-gray-900 text-sm leading-relaxed">{step.desc}</p>
                  {step.link && (
                    <Link to={step.link} className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-3 hover:underline">
                      Learn more <span className="material-icons-round text-xs">arrow_forward</span>
                    </Link>
                  )}
                </div>

                {/* Connector arrow (except last) */}
                {i < PROCESS_STEPS.length - 1 && i % 3 !== 2 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-icons-round text-primary text-base">arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY TOPICS CLUSTER HUB ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Deep Dive</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Everything You Need to Know
            </h2>
            <p className="text-gray-900 max-w-xl mx-auto">
              Each step of the Germany study process has its own details and requirements. Explore each topic in depth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLUSTERS.map(c => (
              <Link
                key={c.title}
                to={c.link}
                className={`group block rounded-2xl overflow-hidden border ${c.color} hover:shadow-card-hover transition-all duration-300`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700 px-2.5 py-1 rounded-lg">
                    {c.tag}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.iconColor}`}>
                      <span className="material-icons-round text-sm">{c.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{c.title}</h3>
                  </div>
                  <p className="text-gray-900 text-sm leading-relaxed">{c.desc}</p>
                  <div className="mt-4">
                    <span className="inline-block bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg group-hover:bg-primary-dark transition-colors">
                      Explore
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── UNIVERSITIES BANNER ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=500&q=80', name: 'TU Munich' },
                { img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80', name: 'RWTH Aachen' },
                { img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80', name: 'TU Berlin' },
                { img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80', name: 'Heidelberg' },
              ].map((u, i) => (
                <div key={u.name} className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'row-span-2 h-72' : 'h-32'}`}>
                  <img src={u.img} alt={u.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-bold">{u.name}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Top Institutions</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Germany's World-Renowned Universities
              </h2>
              <p className="text-gray-900 mb-6 leading-relaxed">
                Germany is home to 9 TU9 universities — the country's most prestigious technical institutions. Along with the Excellence Initiative universities, they rank among the best in the world for engineering, computer science, natural sciences, and business.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-7">
                {['TU Munich (TUM)', 'RWTH Aachen', 'TU Berlin', 'KIT Karlsruhe', 'Heidelberg Uni', 'LMU Munich', 'TU Dresden', 'Uni Stuttgart'].map(u => (
                  <div key={u} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="material-icons-round text-primary text-sm">check_circle</span>
                    {u}
                  </div>
                ))}
              </div>
              <Link to="/services/university-shortlisting"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-xl transition-colors">
                <span className="material-icons-round text-base">school</span>
                Get University Shortlisting
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY ── */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Requirements</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">Eligibility to Study in Germany</h2>
            <p className="text-gray-900 max-w-xl mx-auto">Requirements differ between Master's and Bachelor's degrees. Here's a quick comparison.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                level: "Master's (MS/M.Sc/MEng)",
                icon: 'school',
                items: [
                  { icon: 'grade', label: 'GPA', value: '60–65% or 7.0 CGPA minimum (75%+ for top TU9)' },
                  { icon: 'language', label: 'English', value: 'IELTS 6.0–7.0 or TOEFL iBT 80–100' },
                  { icon: 'menu_book', label: 'Background', value: 'Bachelor\'s in relevant field (4-year degree)' },
                  { icon: 'verified', label: 'APS', value: 'Mandatory for all Indian applicants' },
                  { icon: 'account_balance', label: 'Blocked Account', value: '€11,904 for student visa' },
                  { icon: 'badge', label: 'Backlogs', value: 'Up to 5–7 cleared backlogs usually acceptable' },
                ],
              },
              {
                level: "Bachelor's (B.Sc/B.Eng)",
                icon: 'auto_stories',
                items: [
                  { icon: 'grade', label: 'Education', value: '12th grade (10+2) with 60%+ in relevant subjects' },
                  { icon: 'translate', label: 'German', value: 'B2/C1 required for German-taught; IELTS for English' },
                  { icon: 'school', label: 'Studienkolleg', value: 'Most Indian students need a 1-year foundation year' },
                  { icon: 'verified', label: 'APS', value: 'Mandatory — apply with 10th & 12th certificates' },
                  { icon: 'account_balance', label: 'Blocked Account', value: '€11,904 for student visa' },
                  { icon: 'info', label: 'Note', value: '13-year education rule — gap year may be required' },
                ],
              },
            ].map(col => (
              <div key={col.level} className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-icons-round text-primary">{col.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{col.level}</h3>
                </div>
                <div className="space-y-3">
                  {col.items.map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-icons-round text-gray-900 text-sm">{item.icon}</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{item.label} — </span>
                        <span className="text-sm text-gray-700">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Common Questions</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-900 max-w-xl mx-auto">
              Answers to the questions Indian, Bangladeshi & Nepali students ask most about studying in Germany.
            </p>
          </div>
          <div className="space-y-3">
            {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

    </>
  )
}
