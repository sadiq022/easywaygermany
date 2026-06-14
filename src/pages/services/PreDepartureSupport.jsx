import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function PreDepartureSupport() {
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    {
      q: "Can you help me find accommodation in Germany?",
      a: "Yes! Finding housing is one of the hardest parts of moving to Germany. We provide strategies, reliable websites, and templates to contact landlords or Studentenhof (student dormitories)."
    },
    {
      q: "Do you help with health insurance?",
      a: "Absolutely. We explain the difference between public (TK, AOK) and private health insurance and help you register for the one that suits your age and study program."
    },
    {
      q: "Will you help me after I land in Germany?",
      a: "Our pre-departure support includes a checklist of things you must do upon arrival: City Registration (Anmeldung), activating your blocked account, and getting a residence permit."
    },
    {
      q: "Are flights included?",
      a: "No, we do not book flights, but we can advise you on the best student discounts and timing for booking."
    }
  ]

  return (
    <>
      <Helmet>
        <title>Pre-Departure & Arrival Support Germany | EasyWayGermany</title>
        <meta name="description" content="Settle down easily in Germany. We help with accommodation search, health insurance setup, Anmeldung, and everything you need before you fly." />
      </Helmet>

      <div className="page-hero">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Service 06</div>
          <h1 className="text-4xl md:text-5xl text-white mb-6">Pre-Departure & Arrival Support</h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            The visa is just the beginning. From finding housing to setting up health insurance, we make your transition to life in Germany seamless.
          </p>
          <Link to="/contact" className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
            Get Arrival Support
          </Link>
        </div>
      </div>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl mb-6 text-gray-900">Arrive in Germany with Confidence</h2>
          <p className="text-lg text-gray-700 mb-8">
            Moving to a new country with a different language and bureaucratic system can be incredibly stressful. Our pre-departure support takes away the anxiety. We ensure you have a place to stay, insurance sorted, and a clear checklist of what to do the moment you land.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-4xl mb-4">home</span>
              <h3 className="text-xl mb-3 text-gray-900">Accommodation Support</h3>
              <p className="text-gray-600">Guidance on applying for student dorms, WG-Gesucht strategies, and recognizing rental scams.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-4xl mb-4">health_and_safety</span>
              <h3 className="text-xl mb-3 text-gray-900">Health Insurance & Admin</h3>
              <p className="text-gray-600">Setup your German health insurance and get a checklist for Anmeldung (city registration) and residence permit applications.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl mb-4 text-gray-900">Pricing</h2>
          <div className="max-w-md mx-auto mt-12 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
            <h3 className="text-2xl mb-2 text-gray-900">Transition Package</h3>
            <div className="text-4xl text-primary mb-6 mt-4">€99 <span className="text-base text-gray-500 font-normal">/ complete</span></div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Accommodation search templates & guides</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Health insurance registration assistance</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> SIM card & forex recommendations</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Complete post-arrival checklist</li>
            </ul>
            <Link to="/contact" className="block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors">
              Get the Package
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
