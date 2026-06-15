import { Helmet } from 'react-helmet-async'

const LAST_UPDATED = 'June 15, 2026'

export default function RefundPolicy() {
  return (
    <>
      <Helmet>
        <title>Refund & Cancellation Policy | EasyWay Germany</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Refund & Cancellation Policy</h1>
          <p className="text-white/75">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-8 text-gray-700 leading-relaxed">

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <p className="text-gray-800 font-medium">We want you to be completely satisfied with your purchase. Please read our refund policy carefully before placing an order.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Digital Products</h2>
              <p>Digital products (PDF templates, sample documents, university guides) are delivered instantly upon payment. Due to their digital nature, <strong>all digital product sales are final and non-refundable</strong> once the product has been accessed or downloaded.</p>
              <p className="mt-3">Exceptions are made only if:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>The file is corrupt and cannot be opened</li>
                <li>The product delivered is significantly different from its description</li>
                <li>A technical error prevented delivery</li>
              </ul>
              <p className="mt-3">In such cases, please contact us within <strong>48 hours</strong> of purchase and we will either replace the product or issue a full refund.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Consultancy Services (SOP, LOR, CV, Visa SOP)</h2>
              <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm mt-2">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Stage</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3">Cancelled before work begins (within 24 hours)</td>
                    <td className="px-4 py-3 text-green-700 font-semibold">100% refund</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td className="px-4 py-3">Cancelled after work has started but before first draft</td>
                    <td className="px-4 py-3 text-yellow-700 font-semibold">50% refund</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3">First draft delivered to client</td>
                    <td className="px-4 py-3 text-red-700 font-semibold">No refund</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td className="px-4 py-3">Final document delivered</td>
                    <td className="px-4 py-3 text-red-700 font-semibold">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. University Shortlisting</h2>
              <p>Cancellations requested within <strong>24 hours of payment</strong> and before the shortlist has been prepared will receive a full refund. No refund is applicable once the shortlist has been shared with the client.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. No Guarantee of Admission or Visa</h2>
              <p>Refunds are <strong>not</strong> provided on the grounds of rejection from a university or denial of a student visa. EasyWay Germany provides preparation and guidance services — admission and visa decisions are solely at the discretion of universities and German authorities.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. How to Request a Refund</h2>
              <p>To request a refund, contact us within the eligible time window:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Email:</strong> <a href="mailto:info@easywaygermany.com" className="text-primary">info@easywaygermany.com</a></li>
                <li><strong>WhatsApp:</strong> +91 9119740154</li>
              </ul>
              <p className="mt-3">Please include your order ID, registered email address, and reason for the refund request. Approved refunds are processed within <strong>5–7 business days</strong> to the original payment method.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cancellations by EasyWay Germany</h2>
              <p>In the rare event that we are unable to fulfil your order, we will notify you and issue a full refund within 5–7 business days.</p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
