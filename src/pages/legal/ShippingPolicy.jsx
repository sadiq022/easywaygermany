import { Helmet } from 'react-helmet-async'

const LAST_UPDATED = 'June 15, 2026'

export default function ShippingPolicy() {
  return (
    <>
      <Helmet>
        <title>Shipping & Delivery Policy | EasyWay Germany</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Shipping & Delivery Policy</h1>
          <p className="text-white/75">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-8 text-gray-700 leading-relaxed">

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <p className="text-gray-800 font-medium">EasyWay Germany is a fully digital business. All our products and services are delivered electronically — there is no physical shipping involved.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Digital Products</h2>
              <p>All products sold on EasyWay Germany (PDF templates, sample SOPs, LOR templates, CV formats, university guides) are digital downloads. Upon successful payment:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>The product is instantly accessible in your account under "My Purchases"</li>
                <li>A confirmation email is sent to your registered email address</li>
                <li>Delivery is immediate — no waiting period</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Consultancy Services</h2>
              <p>For document preparation services (SOP, LOR, CV, Visa SOP, University Shortlisting), delivery timelines are as follows:</p>
              <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm mt-3">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Service</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Delivery Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3">SOP Writing</td>
                    <td className="px-4 py-3">3–5 business days (first draft)</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td className="px-4 py-3">LOR Writing</td>
                    <td className="px-4 py-3">2–3 business days</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3">CV Preparation</td>
                    <td className="px-4 py-3">2–3 business days</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td className="px-4 py-3">Visa SOP</td>
                    <td className="px-4 py-3">3–5 business days</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3">Visa Cover Letter</td>
                    <td className="px-4 py-3">2–3 business days</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td className="px-4 py-3">University Shortlisting</td>
                    <td className="px-4 py-3">3–5 business days</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-sm text-gray-500">All timelines are counted from the date we receive your complete profile information. Final documents are delivered via email or WhatsApp in PDF format.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Delivery Method</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Digital products: accessible immediately in your account on the website</li>
                <li>Consultancy documents: delivered via email to your registered address, and/or via WhatsApp</li>
                <li>No physical delivery is made under any circumstances</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Delivery Issues</h2>
              <p>If you have not received your digital product or document within the stated timeframe, please contact us immediately:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Email:</strong> <a href="mailto:info@easywaygermany.com" className="text-primary">info@easywaygermany.com</a></li>
                <li><strong>WhatsApp:</strong> +91 9119740154</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. No Physical Shipping</h2>
              <p>EasyWay Germany does not ship any physical goods. We are a purely digital service provider. No courier, postal, or physical delivery service is used.</p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
