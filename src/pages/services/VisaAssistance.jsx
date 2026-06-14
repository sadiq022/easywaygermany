import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function VisaAssistance() {
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    {
      q: "What is your visa success rate?",
      a: "We maintain a 98% visa success rate for our students. Rejections are extremely rare when the documentation is prepared exactly as per the embassy guidelines."
    },
    {
      q: "Do you help with opening a Blocked Account (Sperrkonto)?",
      a: "Yes, we guide you through the process of opening a blocked account with providers like Fintiba, Coracle, or Expatrio, and explain the required fund transfers."
    },
    {
      q: "Will you conduct mock visa interviews?",
      a: "Yes! While German student visa interviews are typically straightforward, we conduct mock interviews to ensure you can confidently answer questions about your course, motivation, and finances."
    },
    {
      q: "Do you book the visa appointment?",
      a: "We guide you on exactly when and how to book the appointment through the VFS Global or Embassy portal. However, you will need to book it yourself as it requires personal verification."
    }
  ]

  return (
    <>
      <Helmet>
        <title>German Student Visa Assistance | EasyWayGermany</title>
        <meta name="description" content="Expert German student visa guidance. We help with blocked accounts, document preparation, and mock interviews to ensure a 98% success rate." />
      </Helmet>

      <div className="page-hero">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Service 05</div>
          <h1 className="text-4xl md:text-5xl text-white mb-6">Visa Assistance</h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Got the admit? Now secure the visa. We provide comprehensive guidance on documentation, blocked accounts, and interviews to ensure a smooth approval process.
          </p>
          <Link to="/contact" className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
            Start Visa Process
          </Link>
        </div>
      </div>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl mb-6 text-gray-900">Don't Let Bad Documentation Ruin Your Dream</h2>
          <p className="text-lg text-gray-700 mb-8">
            The German visa process is notoriously strict about documentation. A single missing paper or incorrect format can lead to delays or rejections. Our visa experts know exactly what the embassy requires. We provide a tailored checklist, review your documents, and prepare you for any questions the consular officer might ask.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-3xl mb-4">fact_check</span>
              <h3 className="text-lg mb-2 text-gray-900">Document Review</h3>
              <p className="text-gray-600 text-sm">Meticulous check of your motivation letter for visa, forms, and financial proofs.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-3xl mb-4">account_balance</span>
              <h3 className="text-lg mb-2 text-gray-900">Blocked Account</h3>
              <p className="text-gray-600 text-sm">Step-by-step guidance on setting up your Sperrkonto quickly and safely.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-3xl mb-4">record_voice_over</span>
              <h3 className="text-lg mb-2 text-gray-900">Interview Prep</h3>
              <p className="text-gray-600 text-sm">Mock sessions to build your confidence and ensure you answer concisely.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl mb-4 text-gray-900">Visa Support Pricing</h2>
          <div className="max-w-md mx-auto mt-12 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
            <h3 className="text-2xl mb-2 text-gray-900">Visa Package</h3>
            <div className="text-4xl text-primary mb-6 mt-4">€129 <span className="text-base text-gray-500 font-normal">/ complete</span></div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Personalized document checklist</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Review of Motivation Letter for Visa</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Blocked account setup guidance</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> 1 Mock Interview session</li>
            </ul>
            <Link to="/contact" className="block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors">
              Book Visa Support
            </Link>
          </div>
        </div>
      </section>

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
