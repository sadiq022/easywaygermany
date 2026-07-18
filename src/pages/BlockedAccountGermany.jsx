import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const PROVIDERS = [
  {
    name: 'Fintiba',
    tagline: 'Fastest & most popular',
    recommended: true,
    fee: '€149',
    feeNote: 'One-time setup',
    time: '3–5 business days',
    online: true,
    app: true,
    support: 'English support',
    pros: ['Fastest approval', 'Full English interface', 'Accepted at all German embassies', 'Monthly auto-release on 1st'],
    cons: ['Slightly higher fee than Expatrio basic'],
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80',
    color: 'border-primary',
    badge: 'Most Popular',
    badgeColor: 'bg-primary text-white',
  },
  {
    name: 'Expatrio',
    tagline: 'Best value + insurance combo',
    recommended: false,
    fee: '€89–€129',
    feeNote: 'Basic / Premium plan',
    time: '3–5 business days',
    online: true,
    app: true,
    support: 'English support',
    pros: ['Lower setup fee on basic plan', 'Optional health insurance bundle', 'Full online process from India', 'Good customer support'],
    cons: ['Premium plan needed for faster processing'],
    img: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80',
    color: 'border-gray-200',
    badge: 'Best Value',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    name: 'Coracle',
    tagline: 'Digital-first alternative',
    recommended: false,
    fee: '€99',
    feeNote: 'One-time setup',
    time: '3–5 business days',
    online: true,
    app: true,
    support: 'English support',
    pros: ['Fully online process', 'English interface', 'Competitive setup fee', 'Accepted at German embassies'],
    cons: ['Smaller brand vs Fintiba/Expatrio', 'Less community reviews available'],
    img: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80',
    color: 'border-gray-200',
    badge: 'Alternative',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
]

const STEPS = [
  {
    n: '01',
    icon: 'manage_search',
    title: 'Choose Your Provider',
    desc: 'Decide between Fintiba, Expatrio, and Coracle (we recommend Fintiba for most students — fastest, fully in English). Expatrio and Coracle are solid alternatives depending on your budget.',
    img: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80',
  },
  {
    n: '02',
    icon: 'person_add',
    title: 'Register & Submit Documents',
    desc: 'Create your account on the provider\'s website. Upload your passport, admission letter (or conditional acceptance), and fill in your personal details. No German bank account needed.',
    img: 'https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=600&q=80',
  },
  {
    n: '03',
    icon: 'currency_exchange',
    title: 'Transfer €11,904 from India',
    desc: 'Send the required amount via SWIFT from your Indian bank account. TCS rules apply if total remittance exceeds ₹7 lakh/year — factor this into your timeline (claim it back via ITR).',
    img: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=600&q=80',
  },
  {
    n: '04',
    icon: 'mark_email_read',
    title: 'Receive Confirmation Letter',
    desc: 'Once your funds clear (3–7 business days), the provider sends a blocked account confirmation letter — the official document your embassy needs to issue the student visa.',
    img: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&q=80',
  },
  {
    n: '05',
    icon: 'assignment_turned_in',
    title: 'Include in Visa Application',
    desc: 'Submit the confirmation letter with your visa documents at VFS Global. This single document proves you have sufficient funds for one full year of living in Germany.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
  },
  {
    n: '06',
    icon: 'savings',
    title: 'Access Monthly After Arrival',
    desc: '€992 is automatically released to your linked German bank account on the 1st of each month after you arrive. The account is yours — remaining balance is returned when you close it.',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
  },
]

const WITHDRAWAL_RULES = [
  { icon: 'calendar_today', title: '€992/month released', desc: 'Automatically on the 1st of each month after your arrival in Germany.' },
  { icon: 'account_balance', title: 'Linked to your German bank', desc: 'You must open a German bank account (N26, Deutsche Bank, Sparkasse) to receive the monthly releases.' },
  { icon: 'trending_up', title: 'Unused months accumulate', desc: 'If you don\'t use a month\'s release, it carries forward. You can access it the following month.' },
  { icon: 'cancel', title: 'Cannot exceed monthly limit', desc: 'You cannot withdraw multiple months at once — the Sperrkonto is designed to release funds gradually.' },
  { icon: 'money_off', title: 'Balance returned on closure', desc: 'When your studies end and you close the account, any remaining balance is refunded to you.' },
  { icon: 'verified', title: 'Accepted at all German embassies', desc: 'Fintiba and Expatrio confirmation letters are accepted by all German embassies including New Delhi, Mumbai, Chennai, Dhaka, and Kathmandu.' },
]

const REJECTION_REASONS = [
  {
    icon: 'description',
    title: 'Incorrect or missing documents',
    desc: 'The most common reason. Providers require a valid passport, admission letter (or conditional acceptance), and sometimes a bank statement from India. Any mismatch causes rejection.',
  },
  {
    icon: 'swap_horiz',
    title: 'Name mismatch',
    desc: 'Your name on the blocked account application must exactly match your passport. Even minor spelling differences (e.g., "Mohammed" vs "Mohammad") trigger a rejection.',
  },
  {
    icon: 'payments',
    title: 'Incomplete transfer',
    desc: 'Sending €11,800 instead of €11,904 — or the transfer arriving net of bank charges — means the account cannot be activated. Always send slightly more or confirm the net amount.',
  },
  {
    icon: 'timer_off',
    title: 'Transfer delay from India',
    desc: 'SWIFT transfers from Indian banks can take 3–7 business days. If you start too late before your visa appointment, the confirmation letter won\'t arrive in time.',
  },
  {
    icon: 'error_outline',
    title: 'SWIFT code or IBAN error',
    desc: 'One wrong character in the provider\'s IBAN or BIC/SWIFT code sends the money somewhere else. Always verify the exact transfer details from your account dashboard.',
  },
  {
    icon: 'gavel',
    title: 'TCS hold by Indian bank',
    desc: 'Some banks hold remittances exceeding ₹7 lakh for TCS verification. Inform your bank in advance and carry a purpose-of-remittance declaration for education.',
  },
]

const FAQS = [
  {
    q: 'What is a blocked account (Sperrkonto) in Germany?',
    a: 'A Sperrkonto is a special restricted bank account where you deposit the funds required by the German government as proof of financial support for your student visa. The money is "blocked" — you cannot freely access it all at once. Instead, €992 is released to you each month after you arrive in Germany. This system ensures international students have enough money to live on without working illegally.',
  },
  {
    q: 'How much money is required in the blocked account in 2026?',
    a: 'In 2026, you need to deposit €11,904 into your blocked account. This amount is set annually by the German government and represents approximately one year of living expenses (€992 × 12 months). It does not cover tuition (which is free at public universities) or the cost of flights.',
  },
  {
    q: 'Which is better — Fintiba or Expatrio?',
    a: 'For most Indian, Bangladeshi, and Nepali students, Fintiba is the better choice: it\'s fully English, faster to set up (3–5 days), and has the clearest process for international applicants. Expatrio is a good second option and is slightly cheaper on the basic plan — some students choose Expatrio if they also want to bundle health insurance. Coracle is a newer digital-first alternative with a competitive fee and English support, worth considering if Fintiba and Expatrio are unavailable or over capacity.',
  },
  {
    q: 'Can I open a blocked account without a German bank account?',
    a: 'Yes. Both Fintiba and Expatrio can be opened entirely from India — you only need a passport and an admission or conditional admission letter from a German university. You do not need a German bank account to open the Sperrkonto. However, you will need a German bank account after you arrive to receive your monthly €992 releases.',
  },
  {
    q: 'How long does it take to open a blocked account?',
    a: 'With Fintiba or Expatrio, the account setup itself takes 1–2 business days. After that, you need to transfer €11,904 via SWIFT from India, which takes 3–7 business days. Once the funds are received, the provider sends your confirmation letter within 1–2 business days. Total end-to-end time: typically 7–14 days. Start this process at least 3 weeks before your visa appointment to be safe.',
  },
  {
    q: 'Can a sponsor letter replace a blocked account?',
    a: 'It depends on the German embassy and your specific situation. Some embassies accept a sponsor letter (Verpflichtungserklärung) from a German resident who commits to covering your expenses. However, this is less reliable and many embassies now specifically require a blocked account. For most Indian, Bangladeshi, and Nepali students, a blocked account is the safest and most accepted route.',
  },
  {
    q: 'Is TCS applicable when I send money to Germany for the blocked account?',
    a: 'Yes, TCS (Tax Collected at Source) applies to overseas remittances above ₹7 lakh per financial year. For educational remittances financed by an education loan, the TCS rate is 0.5%. For self-financed education abroad, the TCS rate is 5% on the amount exceeding ₹7 lakh. At €11,904 ≈ ₹10.6 lakh, you would pay TCS on roughly ₹3.6 lakh at 5% = ~₹18,000. This is refundable when you file your ITR — it is not a permanent cost.',
  },
  {
    q: 'What happens to the blocked account money after I arrive in Germany?',
    a: '€992 is automatically released to your linked German bank account on the 1st of each month after you register your address (Anmeldung) and provide your arrival proof. You continue receiving monthly releases for 12 months. If you have money remaining after 12 months (for example, because you worked part-time and didn\'t need all of it), you can access the remaining balance freely.',
  },
]

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
    { '@type': 'ListItem', position: 3, name: 'Blocked Account Germany', item: 'https://easywaygermany.com/blocked-account-germany' },
  ],
}

function FaqItem({ q, a }) {
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
        <div className="px-5 pb-4 text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export default function BlockedAccountGermany() {
  return (
    <>
      <Helmet>
        <title>Blocked Account Germany 2026: Exact Amount, Best Providers & Step-by-Step Guide | EasyWay Germany</title>
        <meta name="description" content="Open your German blocked account (Sperrkonto) the right way. €11,904 required in 2026, Fintiba vs Expatrio full comparison, step-by-step process from India, and TCS rules explained. Expert assistance from consultants who live in Germany." />
        <meta name="keywords" content="blocked account germany 2026, blocked account germany for indian students, sperrkonto germany, fintiba vs expatrio, blocked account germany amount, how to open blocked account germany from india, blocked account germany consultants, expatrio blocked account, fintiba blocked account, blocked account germany bangladeshi students, blocked account germany nepali students" />
        <meta property="og:title" content="Blocked Account Germany 2026 — Fintiba vs Expatrio, Exact Amount & Process | EasyWay Germany" />
        <meta property="og:description" content="Complete guide to opening a German blocked account for your student visa. €11,904 required, provider comparison, and hands-on help from EasyWay Germany." />
        <meta property="og:url" content="https://easywaygermany.com/blocked-account-germany" />
        <meta property="og:image" content="https://easywaygermany.com/og-image.jpg" />
        <meta property="og:type" content="article" />
        <link rel="canonical" href="https://easywaygermany.com/blocked-account-germany" />
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_SCHEMA)}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=85"
            alt="German bank building — blocked account Germany"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Mobile-only overlay text ON the image */}
          <div className="md:hidden absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-white bg-black/40">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <span className="material-icons-round text-xs text-yellow-400">verified</span>
              Updated for 2026 — €11,904
            </div>
            <h1 className="font-serif text-3xl font-black leading-tight text-yellow-400 mb-2">
              Blocked Account<br />
              <span className="text-white">Germany 2026</span>
            </h1>
            <p className="text-white/90 text-xs leading-relaxed max-w-[280px] text-center font-normal">
              Sperrkonto guide: amounts, providers &amp; step-by-step process from India.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full hero-inner">
          <div className="text-white max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Breadcrumb (desktop only) */}
            <nav className="hidden md:flex items-center gap-2 text-white/60 text-xs mb-5 flex-wrap justify-center">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="material-icons-round text-xs">chevron_right</span>
              <Link to="/study-in-germany" className="hover:text-white transition-colors">Study in Germany</Link>
              <span className="material-icons-round text-xs">chevron_right</span>
              <span className="text-white">Blocked Account</span>
            </nav>
            {/* Desktop-only Badge */}
            <div className="hidden md:inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="material-icons-round text-xs text-yellow-400">verified</span>
              Updated for 2026 — Amount: €11,904
            </div>
            {/* Desktop-only Heading */}
            <h1 className="hidden md:block font-serif text-5xl md:text-6xl font-black leading-tight mb-4 text-center">
              Blocked Account<br />
              <span className="text-yellow-400">Germany 2026</span>
            </h1>
            {/* Paragraph (desktop only) */}
            <p className="hidden md:block text-white/85 text-lg md:text-xl mb-8 leading-relaxed text-center">
              Everything you need to open your Sperrkonto — the exact amount,<br />
              Fintiba vs Expatrio, step-by-step process from India &amp; TCS rules.
            </p>
            {/* Buttons (always visible) */}
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://wa.me/4915236738625?text=Hi%20EasyWay%20Germany%2C%20I%20need%20help%20with%20my%20blocked%20account"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                <span className="material-icons-round text-base">chat</span>
                Get Help on WhatsApp
              </a>
              <a href="#process"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-gray-900 transition-colors">
                <span className="material-icons-round text-base">arrow_downward</span>
                Step-by-Step Process
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS A BLOCKED ACCOUNT ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">The Basics</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            What Is a Blocked Account and Why Is It Mandatory?
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            A <strong className="text-gray-900">Sperrkonto</strong> (blocked account) is a special restricted bank account you must open before applying for a German student visa. The German embassy requires proof that you can financially support yourself for one full year without relying on illegal work.
          </p>

          <ul className="space-y-3 mb-8">
            {[
              { icon: 'lock', text: 'You deposit €11,904 upfront — the money is "blocked" and cannot be accessed until you arrive in Germany.' },
              { icon: 'payments', text: 'After arrival, €992 is automatically released to your German bank account every month for 12 months.' },
              { icon: 'gavel', text: 'It is mandatory for all non-EU international students applying for a German student visa — there is no alternative route.' },
              { icon: 'school', text: 'Even scholarship recipients typically need one, unless their scholarship includes an embassy-accepted proof-of-funds letter.' },
              { icon: 'savings', text: 'Any remaining balance at the end of your study period is fully refunded to you when you close the account.' },
            ].map(item => (
              <li key={item.icon + item.text.slice(0, 20)} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-icons-round text-primary text-sm">{item.icon}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>

          {/* Key fact box */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="material-icons-round text-primary mt-0.5">info</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">The €11,904 amount changes every year</p>
                <p className="text-sm text-gray-700 leading-relaxed">The German government updates this amount annually based on BAföG (student support) calculations. For 2026 it is <strong>€11,904</strong>. If you opened a blocked account with last year's amount, you may need to top it up. Always verify the current amount before transferring.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2026 AMOUNT ── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">2026 Figures</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Exact Amounts for 2026
            </h2>
            <p className="text-gray-700">Updated annually — always verify before you transfer</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border-2 border-primary shadow-card p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-round text-primary text-2xl">account_balance_wallet</span>
              </div>
              <div className="text-4xl font-black text-primary mb-1">€11,904</div>
              <div className="font-semibold text-sm text-gray-900 mb-2">Total deposit required</div>
              <p className="text-sm text-gray-700 leading-relaxed">One-time deposit covering 12 months of living expenses. Must be in the account before your visa appointment.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-round text-green-600 text-2xl">payments</span>
              </div>
              <div className="text-4xl font-black text-green-600 mb-1">€992</div>
              <div className="font-semibold text-sm text-gray-900 mb-2">Monthly release</div>
              <p className="text-sm text-gray-700 leading-relaxed">Automatically released to your German bank account on the 1st of each month after you register in Germany.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-round text-blue-600 text-2xl">currency_rupee</span>
              </div>
              <div className="text-4xl font-black text-blue-600 mb-1">~₹10.6L</div>
              <div className="font-semibold text-sm text-gray-900 mb-2">Approx. in Indian Rupees</div>
              <p className="text-sm text-gray-700 leading-relaxed">At ~₹89/€ exchange rate. Exchange rates fluctuate — always check live rates when transferring.</p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-700 mt-6">
            Amount verified for 2026. Next update expected January 2027. Source: German government BAföG calculation.
          </p>
        </div>
      </section>

      {/* ── PROVIDER COMPARISON ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Neutral Comparison</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Fintiba vs Expatrio vs Coracle
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              All three are accepted by German embassies. Here's an honest breakdown of what each actually costs and how long each actually takes — no affiliate bias.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {PROVIDERS.map(p => (
              <div key={p.name} className={`rounded-2xl overflow-hidden border-2 ${p.color} shadow-card hover:shadow-card-hover transition-all duration-300`}>
                <div className="relative h-40 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.badgeColor}`}>
                    {p.badge}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-gray-900 text-xl">{p.name}</h3>
                    {p.recommended && (
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-icons-round text-sm">verified</span>
                        <span className="text-xs font-bold">Recommended</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{p.tagline}</p>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <div className="font-bold text-gray-900 text-sm">{p.fee}</div>
                      <div className="text-gray-700 text-xs">{p.feeNote}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <div className="font-bold text-gray-900 text-sm">{p.time}</div>
                      <div className="text-gray-700 text-xs">Processing time</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className={`flex items-center gap-1 text-xs font-medium ${p.online ? 'text-green-600' : 'text-gray-700'}`}>
                      <span className="material-icons-round text-sm">{p.online ? 'check_circle' : 'cancel'}</span>
                      {p.online ? 'Fully online' : 'Partial online'}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${p.app ? 'text-green-600' : 'text-gray-700'}`}>
                      <span className="material-icons-round text-sm">{p.app ? 'check_circle' : 'cancel'}</span>
                      {p.app ? 'App available' : 'No app'}
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {p.pros.map(pro => (
                      <div key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="material-icons-round text-green-500 text-sm mt-0.5 flex-shrink-0">check</span>
                        {pro}
                      </div>
                    ))}
                    {p.cons.map(con => (
                      <div key={con} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="material-icons-round text-gray-500 text-sm mt-0.5 flex-shrink-0">remove</span>
                        {con}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verdict box */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-icons-round text-primary">lightbulb</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Our honest recommendation</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>Go with Fintiba if</strong> you want the fastest, simplest process and English support throughout. The €149 setup fee is worth it for the speed and reliability — especially with tight visa appointment windows. <strong>Choose Expatrio</strong> if you also need health insurance and want to bundle it for a lower combined cost. <strong>Consider Coracle</strong> as a newer digital-first alternative with a competitive €99 fee if the other two are over capacity or unavailable in your region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STEP BY STEP PROCESS ── */}
      <section id="process" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Step by Step</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              How to Open a Blocked Account from India
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              The complete process — from choosing a provider to accessing your monthly €992 after you arrive in Germany.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {STEPS.map(step => (
              <div key={step.n} className="group rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-white border border-gray-100">
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
                  <p className="text-gray-700 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline note */}
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="material-icons-round text-orange-500 mt-0.5 flex-shrink-0">timer</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Start at least 3 weeks before your visa appointment</p>
                <p className="text-gray-700 text-sm">SWIFT transfers from India take 3–7 days. Processing takes 3–5 days. The confirmation letter takes 1–2 days. Adding buffer for any errors: <strong>3 weeks minimum</strong>, 4 weeks is safe. Do not leave this until the last week before your VFS appointment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WITHDRAWAL RULES ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">After Arrival</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Monthly Withdrawal Rules Explained
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Once you arrive in Germany and register your address (Anmeldung), you begin receiving your monthly releases. Here's exactly how it works.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WITHDRAWAL_RULES.map(r => (
              <div key={r.title} className="flex items-start gap-3 p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <span className="material-icons-round text-primary text-base">{r.icon}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">{r.title}</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TCS RULES ── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">India-Specific</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">
              TCS Rules When Sending Money to Germany
            </h2>
            <p className="text-gray-700">Tax Collected at Source (TCS) applies to overseas remittances — here is exactly what it means for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-7">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                <span className="material-icons-round text-blue-600">account_balance</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Self-funded education abroad</h3>
              <p className="text-sm text-gray-700 leading-relaxed">If you're sending your own money (not an education loan), TCS is <strong className="text-gray-900">5%</strong> on the amount above ₹7 lakh per financial year.</p>
              <div className="mt-3 bg-blue-50 rounded-lg p-3 text-sm text-blue-700 font-medium">
                Example: ₹10.6L total → TCS on ₹3.6L = ~₹18,000
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <span className="material-icons-round text-green-600">credit_score</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Funded by education loan</h3>
              <p className="text-sm text-gray-700 leading-relaxed">If the amount is sent from an education loan account, the TCS rate drops to <strong className="text-gray-900">0.5%</strong> regardless of the amount.</p>
              <div className="mt-3 bg-green-50 rounded-lg p-3 text-sm text-green-700 font-medium">
                Example: ₹10.6L → TCS = only ~₹5,300
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
                <span className="material-icons-round text-yellow-600">receipt_long</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">TCS is refundable</h3>
              <p className="text-sm text-gray-700 leading-relaxed">TCS is NOT a permanent tax. It is credited to your PAN. Claim it back when you or your parents file the Income Tax Return (ITR) for the year.</p>
              <div className="mt-3 bg-yellow-50 rounded-lg p-3 text-sm text-yellow-700 font-medium">
                File ITR to get 100% refund of TCS paid
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-3">
            <span className="material-icons-round text-orange-500 mt-0.5 flex-shrink-0">warning</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">Tell your Indian bank it's for education abroad</p>
              <p className="text-sm text-gray-700 leading-relaxed">At the time of remittance, declare the purpose code as "S0305 – Studies Abroad" and carry your admission letter. Some banks may ask for TCS proof of identity. This avoids delays in the transfer and ensures the correct (lower) TCS rate if applicable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── REJECTION REASONS ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Avoid These Mistakes</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Common Reasons Blocked Accounts Get Rejected
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Every mistake below adds 1–2 weeks to your timeline. Know them before you start.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REJECTION_REASONS.map((r, i) => (
              <div key={r.title} className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <span className="material-icons-round text-primary text-base">{r.icon}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">{r.title}</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW EASYWAY HELPS ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                alt="EasyWay Germany team helping students with blocked account"
                className="rounded-2xl shadow-card-hover w-full h-[440px] object-cover"
              />
              <div className="absolute -top-5 -right-5 bg-primary text-white rounded-2xl shadow-card p-5 max-w-[210px]">
                <div className="text-3xl font-black mb-1">500+</div>
                <p className="text-white/85 text-xs leading-relaxed">Students guided through blocked account opening since 2023</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Our Service</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                How EasyWay Germany Helps You Open Your Blocked Account
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                We've guided 500+ students through the Sperrkonto process — from students who had documents rejected to those who had SWIFT transfers bounce. We know every failure mode and how to avoid it.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: 'manage_search', title: 'Provider selection guidance', desc: 'We tell you exactly which provider fits your timeline and budget — no generic advice, specific to your visa appointment date.' },
                  { icon: 'description', title: 'Document checklist review', desc: 'We check your passport, admission letter, and all submission documents before you upload — catching name mismatches and format errors that cause rejections.' },
                  { icon: 'currency_exchange', title: 'Transfer process walkthrough', desc: 'We walk you through the SWIFT transfer setup step by step, including the correct IBAN, BIC, and purpose-of-remittance declaration for your Indian bank.' },
                  { icon: 'support_agent', title: 'WhatsApp support throughout', desc: 'Message us at any point in the process. We respond within 2 hours on working days — including when providers ask for additional documents.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-icons-round text-primary text-base">{item.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-0.5">{item.title}</div>
                      <p className="text-gray-700 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/4915236738625?text=Hi%2C%20I%20need%20help%20opening%20my%20blocked%20account%20for%20Germany"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
                >
                  <span className="material-icons-round text-base">chat</span>
                  WhatsApp Us Now
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
                >
                  <span className="material-icons-round text-base">mail</span>
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Common Questions</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Blocked Account Germany — FAQs
            </h2>
            <p className="text-gray-700">Answers to the questions we get asked every day</p>
          </div>

          <div className="space-y-3">
            {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKS ── */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8 text-center">Related Guides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { to: '/study-in-germany', icon: 'school', title: 'Study in Germany 2026', sub: 'Complete guide — all steps' },
              { to: '/germany-student-visa', icon: 'flight_takeoff', title: 'Student Visa Guide', sub: 'Documents, fees & interview tips' },
              { to: '/aps-certificate', icon: 'verified_user', title: 'APS Certificate', sub: 'Mandatory for Indian students' },
              { to: '/pricing', icon: 'local_offer', title: 'Our Packages', sub: 'Full end-to-end support' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-card transition-all group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-icons-round text-primary text-base group-hover:text-white">{link.icon}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{link.title}</div>
                  <div className="text-gray-700 text-sm">{link.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
