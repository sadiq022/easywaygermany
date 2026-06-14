import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ApplicationSupport() {
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    {
      q: "Do you apply on my behalf?",
      a: "We guide you step-by-step via screen sharing to fill out the applications. We ensure all information is correct, but the final submission is done by you to maintain transparency."
    },
    {
      q: "Do you handle Uni-Assist applications?",
      a: "Yes! Uni-Assist can be confusing. We provide complete support for Uni-Assist portals, VPD applications, and direct university portals."
    },
    {
      q: "What if a document needs notarization or translation?",
      a: "We will guide you on exactly how and where to get your documents notarized or translated (Apostille/German translations) as per the specific university requirements."
    },
    {
      q: "How many university applications does the package cover?",
      a: "Our standard comprehensive package covers end-to-end application support for up to 5 universities."
    }
  ]

  return (
    <>
      <Helmet>
        <title>University Application Support for Germany | EasyWayGermany</title>
        <meta name="description" content="Flawless university application support. We help with Uni-Assist, direct portals, document checks, and deadline management." />
      </Helmet>

      {/* Hero Section */}
      <div className="page-hero">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Service 04</div>
          <h1 className="text-4xl md:text-5xl text-white mb-6">Application & Portal Support</h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Uni-Assist? VPD? Direct Portals? Navigating German university applications is a maze. We ensure your application is flawless and submitted on time.
          </p>
          <Link to="/contact" className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
            Get Application Help
          </Link>
        </div>
      </div>

      {/* Details Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl mb-6 text-gray-900">Zero Errors. Zero Rejections Due to Missing Documents.</h2>
          <p className="text-lg text-gray-700 mb-8">
            A large percentage of international student applications are rejected simply because of incorrect formatting, missing apostilles, or misunderstanding the Uni-Assist portal. Our team has handled thousands of applications. We review every single PDF before you hit submit.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-4xl mb-4">find_in_page</span>
              <h3 className="text-xl mb-3 text-gray-900">Document Review</h3>
              <p className="text-gray-600">We verify that your transcripts, degree certificates, grading scales, and language certificates meet the strict German formatting requirements.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-4xl mb-4">web</span>
              <h3 className="text-xl mb-3 text-gray-900">Portal Guidance</h3>
              <p className="text-gray-600">Live screen-sharing sessions to help you navigate Uni-Assist, apply for VPD, or use the university's proprietary application portal (CampusNet, etc.).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl mb-4 text-gray-900">Application Support Pricing</h2>
          
          <div className="max-w-md mx-auto mt-12 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
            <h3 className="text-2xl mb-2 text-gray-900">Comprehensive Support</h3>
            <div className="text-4xl text-primary mb-6 mt-4">€199 <span className="text-base text-gray-500 font-normal">/ up to 5 applications</span></div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Document formatting & review</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Uni-Assist & VPD support</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Deadline tracking</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Post-submission tracking support</li>
            </ul>
            <Link to="/contact" className="block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors">
              Enrol Now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
                <button 
                  className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-bold text-gray-900 text-lg pr-8">{faq.q}</span>
                  <span className={`material-icons-round text-primary transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
