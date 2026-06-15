import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const LAST_UPDATED = 'June 15, 2026'

export default function TermsConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | EasyWay Germany</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
          <p className="text-white/75">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-8 text-gray-700 leading-relaxed">

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
              <p>By accessing or using the website <strong>https://easywaygermany.com</strong> and purchasing any service or product, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. About EasyWay Germany</h2>
              <p>EasyWay Germany is a study-abroad consultancy that helps Indian students apply to German universities. We provide document preparation services (SOP, LOR, CV), university shortlisting, visa document support, and digital study resources.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Services</h2>
              <p>Our services include:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>University Shortlisting</li>
                <li>Statement of Purpose (SOP) Writing</li>
                <li>Letter of Recommendation (LOR) Writing</li>
                <li>CV / Resume Preparation</li>
                <li>Visa SOP Writing</li>
                <li>Visa Cover Letter Writing</li>
                <li>Digital products (templates, guides, sample documents)</li>
              </ul>
              <p className="mt-3">All services are delivered digitally. We do not guarantee admission to any university or visa approval, as these decisions rest solely with the institutions and German authorities.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Payments</h2>
              <p>Payments are processed securely through <strong>Razorpay</strong>. By making a payment, you agree to Razorpay's terms of service. All prices are listed in Indian Rupees (INR) inclusive of applicable taxes.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Digital Products</h2>
              <p>Upon successful payment, digital products (PDF documents, templates, guides) are delivered to your registered account immediately or within 24 hours. Due to the digital nature of these products, they are non-refundable once delivered, unless the file is corrupt or inaccessible.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Consultancy Services</h2>
              <p>For document preparation services (SOP, LOR, CV, Visa SOP), work begins after payment confirmation. Delivery timelines are communicated at the time of booking. Revisions are included as specified per service. We reserve the right to refuse service in cases of abusive behaviour or fraudulent activity.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. No Guarantee of Outcome</h2>
              <p>EasyWay Germany provides expert guidance and document preparation assistance. We do not guarantee admission to any German university, scholarship approval, or student visa issuance. These decisions are at the sole discretion of the respective institutions and the German embassy/consulate.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
              <p>All content on this website — including text, images, logos, and digital products — is the intellectual property of EasyWay Germany. You may not reproduce, distribute, or resell any content without our written permission. Digital products purchased are licensed for personal use only.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your account or use it for any unlawful purpose. We reserve the right to terminate accounts that violate these terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
              <p>EasyWay Germany shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our maximum liability is limited to the amount paid for the specific service in question.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Governing Law</h2>
              <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to Terms</h2>
              <p>We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contact</h2>
              <p>For questions about these terms, contact us at:<br />
              <strong>Email:</strong> <a href="mailto:info@easywaygermany.com" className="text-primary">info@easywaygermany.com</a><br />
              <strong>WhatsApp:</strong> +91 9119740154</p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
