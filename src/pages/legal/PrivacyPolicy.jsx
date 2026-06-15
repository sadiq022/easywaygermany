import { Helmet } from 'react-helmet-async'

const LAST_UPDATED = 'June 15, 2026'

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
          <p className="text-white/75">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6 prose prose-gray max-w-none">
          <div className="space-y-8 text-gray-700 leading-relaxed">

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
              <p>EasyWay Germany ("we", "our", "us") is a study-abroad consultancy operating from Dresden, Germany, helping Indian students apply to German universities. Our website is <strong>https://easywaygermany.com</strong>. You can reach us at <a href="mailto:info@easywaygermany.com" className="text-primary">info@easywaygermany.com</a>.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p>We collect the following information when you use our website or services:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Personal details:</strong> Name, email address, phone number (when you submit a contact form or register)</li>
                <li><strong>Payment information:</strong> Processed securely through Razorpay — we do not store your card or bank details</li>
                <li><strong>Profile information:</strong> Academic background, field of study, target universities (shared voluntarily during consultation)</li>
                <li><strong>Usage data:</strong> Pages visited, time spent, browser type, IP address (via Google Analytics)</li>
                <li><strong>Communication data:</strong> Messages sent via our contact form or WhatsApp</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide and deliver the services you purchase</li>
                <li>To respond to your enquiries and consultation requests</li>
                <li>To process payments securely through Razorpay</li>
                <li>To send service updates, newsletters (only if you opted in)</li>
                <li>To improve our website and services using analytics data</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Sharing Your Information</h2>
              <p>We do not sell or rent your personal information. We may share it with:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Razorpay</strong> — for payment processing</li>
                <li><strong>Supabase</strong> — for secure database storage</li>
                <li><strong>Google Analytics</strong> — for anonymised website usage analytics</li>
                <li>Legal authorities, if required by law</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
              <p>We retain your personal data for as long as necessary to deliver our services and comply with legal obligations. You may request deletion of your account and data at any time by emailing us.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
              <p>We use cookies for website analytics (Google Analytics) and to maintain your login session. You can disable cookies in your browser settings, though some features may not work correctly.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. To exercise these rights, email us at <a href="mailto:info@easywaygermany.com" className="text-primary">info@easywaygermany.com</a>.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Security</h2>
              <p>We use industry-standard security measures including HTTPS encryption, secure database storage, and trusted third-party payment processing. However, no method of transmission over the internet is 100% secure.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
              <p>For any privacy-related questions, contact us at:<br />
              <strong>Email:</strong> <a href="mailto:info@easywaygermany.com" className="text-primary">info@easywaygermany.com</a><br />
              <strong>WhatsApp:</strong> +91 9119740154<br />
              <strong>Address:</strong> Dresden, Germany</p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
