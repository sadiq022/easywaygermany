import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const WA = 'https://wa.me/919119740154?text=Hi%20EasyWay%20Germany%2C%20I%20am%20interested%20in%20your%20admission%20services.'

const PLANS = [
  {
    name: 'Basic',
    tagline: 'For students who need core application support',
    price: '₹19,999',
    emi: '₹11,000 × 2 monthly payments',
    popular: false,
    features: [
      'University Shortlisting (5 universities)',
      'SOP Writing Assistance',
      '1 LOR Preparation',
      'CV / Resume Editing',
      'Application Filling Assistance',
    ],
  },
  {
    name: 'Standard',
    tagline: 'Complete admission package with visa support',
    price: '₹34,999',
    emi: '₹17,500 × 2 monthly payments',
    popular: true,
    features: [
      'Everything in Basic',
      'University Shortlisting (10 universities)',
      '2 LOR Preparations',
      'Application Filling Assistance',
      'Visa Documentation Guide',
      'Blocked Account Assistance',
    ],
  },
  {
    name: 'Premium',
    tagline: 'End-to-end support with post-admission services',
    price: '₹44,999',
    emi: '₹22,500 × 2 monthly payments',
    popular: false,
    features: [
      'Everything in Standard',
      'Unlimited University Applications',
      '3 LOR Preparations',
      'Education Loan Guidance',
      'Pre-Departure Briefing',
      'Accommodation Assistance',
    ],
  },
]

const TABLE_ROWS = [
  { category: 'Application Services', service: 'University Shortlisting', basic: '5 universities', standard: '10 universities', premium: 'Unlimited' },
  { category: '', service: 'SOP Writing', basic: true, standard: true, premium: true },
  { category: '', service: 'LOR Preparation', basic: '1 LOR', standard: '2 LORs', premium: '3 LORs' },
  { category: '', service: 'CV / Resume Editing', basic: true, standard: true, premium: true },
  { category: '', service: 'Application Form Review', basic: true, standard: true, premium: true },
  { category: '', service: 'Application Filling Assistance', basic: true, standard: true, premium: true },
  { category: 'Visa & Financial', service: 'Visa SOP', basic: false, standard: true, premium: true },
  { category: '', service: 'Visa Cover Letter', basic: false, standard: true, premium: true },
  { category: '', service: 'Education Loan Guidance', basic: false, standard: false, premium: true },
  { category: '', service: 'Blocked Account Assistance', basic: false, standard: true, premium: true },
  { category: 'Post-Admission', service: 'Pre-Departure Briefing', basic: false, standard: false, premium: true },
  { category: '', service: 'Accommodation Assistance', basic: false, standard: false, premium: true },
  { category: '', service: 'Packing Guidance', basic: false, standard: false, premium: true },
  { category: '', service: 'German Bank Account Opening', basic: false, standard: false, premium: true },
]

const FAQS = [
  {
    q: 'What is included in the Basic admission package for Germany?',
    a: 'The Basic plan (₹19,999) includes shortlisting 5 German universities suited to your profile, SOP writing assistance, 1 LOR preparation, CV/resume editing, and application filling support. It is ideal for students who have a clear idea of their target universities and need core documentation help.',
  },
  {
    q: 'How long does the Germany university application process take?',
    a: 'The entire process typically takes 3–6 months. Most German universities have application deadlines in January (for summer semester) and July (for winter semester). We recommend starting at least 4–5 months before your target intake to allow time for SOP drafts, APS certification, and document preparation.',
  },
  {
    q: 'Is Germany admission really free for Indian students?',
    a: 'Public German universities charge little to no tuition fees — typically €0–€500 per semester. However, you still pay semester contribution fees (€100–€350, which often includes public transport), plus living costs of around €800–€1,100/month. Our packages help you get into the best-fit university while managing these costs.',
  },
  {
    q: 'What IELTS or GRE score do I need to study in Germany?',
    a: 'Most English-taught Master\'s programs require IELTS 6.5–7.5 (or TOEFL 90–110). GRE is not required by most German universities, though some technical programs at TU Munich and RWTH Aachen may prefer it. German-taught programs require B2/C1 level (TestDaF or DSH). We shortlist universities that match your current test scores.',
  },
  {
    q: 'Can I upgrade from Basic to Standard or Premium later?',
    a: 'Yes — you can upgrade at any point before applications are submitted. You simply pay the difference between plans. We maintain all your documents, profile notes, and university shortlist so the upgrade is seamless with no duplication of effort.',
  },
  {
    q: 'What is an SOP and why is it so important for Germany?',
    a: 'SOP stands for Statement of Purpose — a 800–1000 word essay explaining why you want to study a specific program, how it connects to your academic background, and your career goals. German universities take SOPs very seriously, especially for competitive programs. A weak SOP can get you rejected even with a strong GPA. Our team writes SOPs tailored to each specific university and program you apply to.',
  },
  {
    q: 'Do I need APS certification for German universities?',
    a: 'Yes. APS (Akademische Prüfstelle) certification is mandatory for Indian students applying to German universities. APS verifies your academic documents and issues a certificate that universities and the German embassy require. The process takes 4–8 weeks and costs €75. We guide you through what to submit and when to apply.',
  },
  {
    q: 'What is the payment structure — can I pay in installments?',
    a: 'All our plans support installment payments split into 2 monthly payments. Basic: ₹11,000 × 2, Standard: ₹17,500 × 2, Premium: ₹22,500 × 2. The first installment is due when you sign up; the second is due after your university applications are submitted. Contact us on WhatsApp to get started.',
  },
]

function Cell({ value }) {
  if (value === true) return <span className="material-icons-round text-green-500 text-lg">check_circle</span>
  if (value === false) return <span className="material-icons-round text-gray-300 text-lg">cancel</span>
  return <span className="text-sm font-medium text-gray-700">{value}</span>
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl transition-all ${open ? 'border-primary/30 bg-primary/5' : 'border-gray-100 bg-white'}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span className="font-semibold text-gray-900 text-sm md:text-base leading-snug">{q}</span>
        <span className={`material-icons-round text-primary flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

export default function Pricing() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Germany University Admission Packages',
        description: 'Admission consultation packages for Indian students applying to German universities.',
        itemListElement: PLANS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: `${p.name} Admission Package`,
            offers: {
              '@type': 'Offer',
              price: p.price.replace(/[₹,]/g, ''),
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
            brand: { '@type': 'Brand', name: 'EasyWay Germany' },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <Helmet>
        <title>Germany University Admission Packages 2026 | EasyWay Germany</title>
        <meta name="description" content="Affordable Germany university admission packages for Indian students. SOP writing, university shortlisting, LOR, CV, and visa guidance. Basic ₹19,999 | Standard ₹34,999 | Premium ₹44,999." />
        <meta name="keywords" content="study in germany from india, germany university admission, germany admission package india, germany study abroad, study in germany 2026, germany university application help, sop writing germany, germany university shortlisting india, masters in germany, germany education consultants india, how to apply to german university, germany study visa india, germany tuition free university" />
        <meta property="og:title" content="Germany University Admission Packages for Indian Students | EasyWay Germany" />
        <meta property="og:description" content="Get expert help applying to German universities. SOP, LOR, CV, shortlisting and visa guidance. Plans from ₹19,999." />
        <meta property="og:url" content="https://easywaygermany.com/pricing" />
        <link rel="canonical" href="https://easywaygermany.com/pricing" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Hero */}
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Transparent Pricing</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Admission Packages</h1>
          <p className="text-white/75 max-w-xl mx-auto">Choose the perfect package for your Germany journey. All plans include personalized support and guaranteed quality.</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-6 md:items-start">
            {PLANS.map(plan => (
              <div key={plan.name} className={`relative bg-white rounded-2xl shadow-card overflow-hidden flex flex-col ${plan.popular ? 'ring-2 ring-primary' : 'border border-gray-100'}`}>
                {plan.popular && (
                  <div className="bg-primary text-white text-xs font-bold uppercase tracking-widest text-center py-2 px-4">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 border-b border-gray-100 ${plan.popular ? 'bg-primary/5' : ''}`}>
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">{plan.tagline}</p>
                  <div className="text-3xl font-extrabold text-gray-900">{plan.price}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">/ one-time payment</div>
                  <div className="mt-2 inline-block text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">
                    or {plan.emi}
                  </div>
                </div>
                <div className="p-6 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="material-icons-round text-green-500 text-base mt-0.5 flex-shrink-0">check_circle</span>
                        <span className={i === 0 && plan.name !== 'Basic' ? 'font-bold text-gray-900' : ''}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <a
                    href={WA}
                    target="_blank" rel="noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      plan.popular
                        ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    <span className="material-icons-round text-base">chat</span>
                    Get Started on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Breakdown Table */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 text-center">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Compare Plans</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Detailed Service Breakdown</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-card border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Service</th>
                  <th className="text-center px-5 py-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Basic</th>
                  <th className="text-center px-5 py-4 text-primary font-bold text-xs uppercase tracking-wider bg-primary/5">Standard</th>
                  <th className="text-center px-5 py-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TABLE_ROWS.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      {row.category ? <span className="text-xs font-bold text-primary uppercase tracking-wide">{row.category}</span> : null}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">{row.service}</td>
                    <td className="px-5 py-3.5 text-center"><Cell value={row.basic} /></td>
                    <td className="px-5 py-3.5 text-center bg-primary/5"><Cell value={row.standard} /></td>
                    <td className="px-5 py-3.5 text-center"><Cell value={row.premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <a
              href={WA}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base"
            >
              <span className="material-icons-round text-xl">chat</span>
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Visa CTA Banner */}
      <section className="py-10 bg-primary/5 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Add-On Available</div>
            <h3 className="font-serif text-2xl font-bold text-gray-900">Need Germany Student Visa Help?</h3>
            <p className="text-gray-500 text-sm mt-1">Visa SOP, blocked account, APS, VFS appointment & mock interview — <span className="font-semibold text-gray-700">₹7,999 one-time</span></p>
          </div>
          <Link
            to="/visa-package"
            className="flex-shrink-0 flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-md"
          >
            <span className="material-icons-round text-base">flight_takeoff</span>
            View Visa Package
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">FAQs</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Common Questions About Studying in Germany</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">Everything Indian students ask before starting their Germany application.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map(faq => <FAQ key={faq.q} {...faq} />)}
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm mb-4">Still have questions? Ask us directly on WhatsApp.</p>
            <a
              href={WA}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base"
            >
              <span className="material-icons-round text-xl">chat</span>
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
