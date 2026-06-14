import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const TIMELINE = [
  {
    date: 'January 2023',
    icon: 'lightbulb',
    title: 'The Idea Was Born',
    desc: 'While preparing his own application to study in Germany, our founder realized how confusing and expensive the process was — wrong information everywhere, agencies charging a fortune for basic help. He decided to do it differently.',
  },
  {
    date: 'Early 2023',
    icon: 'group_add',
    title: 'First Students Helped',
    desc: 'From his room in India, he started helping fellow students with SOPs, university shortlists, and LORs — for a fraction of what consultancies charged. Word spread fast. Students got admits. Trust grew.',
  },
  {
    date: 'October 2023',
    icon: 'flight_takeoff',
    title: 'Landed in Germany',
    desc: 'He packed his bags and moved to Germany himself — not just to study, but to understand the system from the inside. Living here means we give real, updated, ground-level advice — not textbook guidance.',
  },
  {
    date: 'Today — 2026',
    icon: 'emoji_events',
    title: 'Still Growing, Still Honest',
    desc: 'We\'re now a small but dedicated team operating from Germany and India. No false promises, no inflated numbers — just genuine help from people who\'ve been in your exact shoes.',
  },
]

const VALUES = [
  {
    icon: 'person_check',
    title: 'We\'ve Been You',
    desc: 'Our founder went through the same process. We lived it, so our advice is real.',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: 'verified',
    title: 'No False Promises',
    desc: 'If your profile needs work, we tell you. Honest guidance over empty assurances.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: 'attach_money',
    title: 'Fair Pricing',
    desc: 'Transparent and affordable. Quality help should not cost a fortune.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: 'update',
    title: 'Always Current',
    desc: 'Living in Germany keeps us updated on intake rules, visa changes, and more.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

const GermanyFlag = () => (
  <svg className="w-7 h-5 rounded-sm" viewBox="0 0 5 3">
    <rect width="5" height="1" y="0" fill="#000000" />
    <rect width="5" height="1" y="1" fill="#FF0000" />
    <rect width="5" height="1" y="2" fill="#FFCC00" />
  </svg>
)

const TEAM = [
  {
    name: 'Zainab Zamir',
    role: 'Founder & CEO',
    location: 'Dresden, Germany',
    img: '/images/zuzzu.webp',
    bio: ['Moved to Dresden, Germany in October 2023', 'Nearly 3 years of on-ground experience in Germany', 'Helps students with SOPs, shortlisting & visa docs'],
  },
  {
    name: 'Sadiq Ali',
    role: 'Co-Founder',
    location: 'Dresden, Germany',
    img: '/images/sadiq.webp',
    bio: ['Moved to Dresden, Germany in October 2023', 'Handles student onboarding & document preparation', 'Your first point of contact when you reach out'],
  },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us – EasyWay Germany | Study in Germany Consultancy</title>
        <meta name="description" content="Meet the team behind EasyWay Germany. Founded by Indian students living in Dresden, Germany — we help students navigate the German university application process with honest, affordable guidance." />
        <meta property="og:title" content="About EasyWay Germany – Founded by Students, for Students" />
        <meta property="og:description" content="EasyWay Germany was started by an Indian student who moved to Dresden in 2023. We offer SOP, LOR, CV, university shortlisting and visa SOP services." />
        <meta property="og:url" content="https://easywaygermany.com/about" />
        <link rel="canonical" href="https://easywaygermany.com/about" />
      </Helmet>

      {/* Hero */}
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Our Story</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">About EasyWay Germany</h1>
          <p className="text-white/75">Built by a student who made it — so you can too</p>
        </div>
      </div>

      {/* Origin story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl overflow-hidden shadow-card-hover">
              <img
                src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=700&q=80"
                alt="Germany street"
                className="w-full h-80 object-cover"
              />
            </div>
            <div>
              <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Who We Are</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                Not an Agency.<br />
                <span className="text-primary">A Fellow Student Who Made It.</span>
              </h2>
              <ul className="space-y-3 mb-6">
                {[
                  'Started by a student, not a consultancy.',
                  'Expensive agencies, wrong info, template SOPs everywhere.',
                  'He just wanted to help the way no one helped him.',
                  'EasyWay Germany began in January 2023, from India.',
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="material-icons-round text-primary text-base mt-0.5 flex-shrink-0">check_circle</span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="space-y-4">
                {[
                  { icon: 'verified', title: 'Transparency First', desc: 'Honest guidance — no false promises, no hidden charges' },
                  { icon: 'support_agent', title: 'Personal, Not Generic', desc: 'Your profile is unique. Your SOP, CV, and shortlist should be too.' },
                  { icon: 'emoji_events', title: 'Results That Matter', desc: 'We measure success by your admits and your visa approval' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-round text-primary text-base">{icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{title}</div>
                      <div className="text-gray-500 text-sm">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder + Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">The People Behind It</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">A Small Team.<br />A Big Commitment.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We're not a faceless consultancy. We're two people who genuinely care about getting you to Germany.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TEAM.map(({ name, role, location, img, bio }) => (
              <div key={name} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-card transition-shadow">
                <div className="w-40 h-40 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-primary to-primary-dark">
                  <img src={img} alt={name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-serif text-xl font-bold text-gray-900">{name}</h3>
                  <GermanyFlag />
                </div>
                <div className="text-primary font-semibold text-sm mb-1">{role}</div>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
                  <span className="material-icons-round text-xs">location_on</span>
                  {location}
                </div>
                <ul className="space-y-2 mb-5">
                  {bio.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="material-icons-round text-primary text-base mt-0.5 flex-shrink-0">check_circle</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Our Journey</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">From India to Germany —<br />And We're Still Here for You</h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
            <div className="space-y-10">
              {TIMELINE.map(({ date, icon, title, desc }, i) => (
                <div key={i} className="flex gap-6 md:gap-10 items-start">
                  <div className="flex-shrink-0 w-16 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-md z-10 relative">
                      <span className="material-icons-round text-white text-2xl">{icon}</span>
                    </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{date}</div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why trust us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Why Students Choose Us</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">What Makes Us Different</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc, color, bg }) => (
              <div key={title} className={`${bg} rounded-2xl p-7 border border-gray-100 hover:shadow-card transition-shadow`}>
                <span className={`material-icons-round text-4xl mb-4 block ${color}`}>{icon}</span>
                <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The reality check — curiosity / trust section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            {/* subtle background pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #C0392B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C0392B 0%, transparent 40%)'
            }} />
            <div className="relative z-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                "Can I really get into a German university?"
              </h2>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white/10 rounded-xl px-5 py-3 text-white text-sm font-medium">
                  ✅ Average GPA? We've helped.
                </div>
                <div className="bg-white/10 rounded-xl px-5 py-3 text-white text-sm font-medium">
                  ✅ No work experience? We've helped.
                </div>
                <div className="bg-white/10 rounded-xl px-5 py-3 text-white text-sm font-medium">
                  ✅ First time applicant? We've helped.
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition-colors text-base shadow-lg">
                <span className="material-icons-round text-base">calendar_today</span>
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
