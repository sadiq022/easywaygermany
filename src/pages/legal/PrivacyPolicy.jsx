import { Helmet } from 'react-helmet-async'

const LAST_UPDATED = 'June 15, 2026'

const SECTIONS = [
  {
    n: '1',
    title: 'Who We Are',
    content: (
      <>
        <p className="text-sm text-gray-900 leading-relaxed">
          EasyWay Germany ("we", "our", "us") is a study-abroad consultancy helping Indian, Bangladeshi, and Nepali students apply to German universities. Our website is{' '}
          <a href="https://easywaygermany.com" className="text-primary font-medium hover:underline">https://easywaygermany.com</a>.
          You can reach us at{' '}
          <a href="mailto:info@easywaygermany.com" className="text-primary font-medium hover:underline">info@easywaygermany.com</a>.
        </p>
      </>
    ),
  },
  {
    n: '2',
    title: 'Information We Collect',
    content: (
      <>
        <p className="text-sm text-gray-900 leading-relaxed mb-4">We collect the following information when you use our website or services:</p>
        <ul className="space-y-2.5">
          {[
            { label: 'Personal details', desc: 'Name, email address, phone number (when you submit a contact form or register)' },
            { label: 'Payment information', desc: 'Processed securely through our payment gateway — we do not store your card or bank details' },
            { label: 'Profile information', desc: 'Academic background, field of study, target universities (shared voluntarily during consultation)' },
            { label: 'Usage data', desc: 'Pages visited, time spent, browser type, IP address (via Google Analytics)' },
            { label: 'Communication data', desc: 'Messages sent via our contact form or WhatsApp' },
          ].map(item => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="material-icons-round text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
              <span className="text-sm text-gray-900 leading-relaxed"><strong>{item.label}:</strong> {item.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    n: '3',
    title: 'How We Use Your Information',
    content: (
      <ul className="space-y-2.5">
        {[
          'To provide and deliver the services you purchase',
          'To respond to your enquiries and consultation requests',
          'To process payments securely through our payment gateway',
          'To send service updates and newsletters (only if you opted in)',
          'To improve our website and services using analytics data',
          'To comply with legal obligations',
        ].map(item => (
          <li key={item} className="flex items-start gap-3">
            <span className="material-icons-round text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
            <span className="text-sm text-gray-900 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    n: '4',
    title: 'Sharing Your Information',
    content: (
      <>
        <p className="text-sm text-gray-900 leading-relaxed mb-4">We do not sell or rent your personal information. We may share it with:</p>
        <ul className="space-y-2.5">
          {[
            { label: 'Payment processor', desc: 'for secure payment processing' },
            { label: 'Supabase', desc: 'for secure database storage' },
            { label: 'Google Analytics', desc: 'for anonymised website usage analytics' },
            { label: 'Legal authorities', desc: 'if required by law' },
          ].map(item => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="material-icons-round text-primary text-sm mt-0.5 flex-shrink-0">check_circle</span>
              <span className="text-sm text-gray-900 leading-relaxed"><strong>{item.label}</strong> — {item.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    n: '5',
    title: 'Data Retention',
    content: (
      <p className="text-sm text-gray-900 leading-relaxed">
        We retain your personal data for as long as necessary to deliver our services and comply with legal obligations. You may request deletion of your account and data at any time by emailing us.
      </p>
    ),
  },
  {
    n: '6',
    title: 'Cookies',
    content: (
      <p className="text-sm text-gray-900 leading-relaxed">
        We use cookies for website analytics (Google Analytics) and to maintain your login session. You can disable cookies in your browser settings, though some features may not work correctly.
      </p>
    ),
  },
  {
    n: '7',
    title: 'Your Rights',
    content: (
      <p className="text-sm text-gray-900 leading-relaxed">
        You have the right to access, correct, or delete your personal data. To exercise these rights, email us at{' '}
        <a href="mailto:info@easywaygermany.com" className="text-primary font-medium hover:underline">info@easywaygermany.com</a>.
      </p>
    ),
  },
  {
    n: '8',
    title: 'Security',
    content: (
      <p className="text-sm text-gray-900 leading-relaxed">
        We use industry-standard security measures including HTTPS encryption, secure database storage, and trusted third-party payment processing. However, no method of transmission over the internet is 100% secure.
      </p>
    ),
  },
  {
    n: '9',
    title: 'Changes to This Policy',
    content: (
      <p className="text-sm text-gray-900 leading-relaxed">
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this page periodically.
      </p>
    ),
  },
  {
    n: '10',
    title: 'Contact',
    content: (
      <ul className="space-y-2.5">
        {[
          { icon: 'mail', label: 'Email', value: 'info@easywaygermany.com', href: 'mailto:info@easywaygermany.com' },
          { icon: 'chat', label: 'WhatsApp', value: '+49 152 3673 8625', href: 'https://wa.me/4915236738625' },
          { icon: 'location_on', label: 'Address', value: 'Dresden, Germany', href: null },
        ].map(item => (
          <li key={item.label} className="flex items-start gap-3">
            <span className="material-icons-round text-primary text-sm mt-0.5 flex-shrink-0">{item.icon}</span>
            <span className="text-sm text-gray-900">
              <strong>{item.label}:</strong>{' '}
              {item.href
                ? <a href={item.href} className="text-primary font-medium hover:underline">{item.value}</a>
                : item.value}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | EasyWay Germany</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/90 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-5">
            {SECTIONS.map(s => (
              <div key={s.n} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-black text-sm">{s.n}</span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-base">{s.title}</h2>
                </div>
                {s.content}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
