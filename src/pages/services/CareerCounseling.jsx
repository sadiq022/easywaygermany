import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function CareerCounseling() {
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    {
      q: "How does the career counseling process work?",
      a: "Our process begins with an in-depth profile evaluation where we assess your academic background, work experience, and goals. We then provide a personalized roadmap, suggesting the best courses and universities tailored for your success in Germany."
    },
    {
      q: "Do you guarantee admission?",
      a: "While we boast a very high success rate, admission decisions are ultimately up to the universities. We guarantee that your application will be optimized to its highest potential to maximize your chances."
    },
    {
      q: "Is the counseling session online or offline?",
      a: "All our counseling sessions are conducted online via video calls, ensuring flexibility and accessibility no matter where you are located."
    },
    {
      q: "How many sessions are included in the package?",
      a: "Our standard package includes up to 3 comprehensive 1-on-1 sessions. However, we also offer customized packages based on your specific needs."
    },
    {
      q: "Will you help me decide between public and private universities?",
      a: "Absolutely. We provide a clear, unbiased comparison between public (tuition-free) and private universities based on your profile, budget, and career aspirations."
    }
  ]

  return (
    <>
      <Helmet>
        <title>Expert Career Counseling for Studying in Germany | EasyWayGermany</title>
        <meta name="description" content="Get professional career counseling to study in Germany. We evaluate your profile, recommend courses, and guide you to the best universities." />
      </Helmet>

      {/* Hero Section */}
      <div className="page-hero">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Service 01</div>
          <h1 className="text-4xl md:text-5xl text-white mb-6">Expert Career Counseling</h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Stop guessing and start planning. Let our experts analyze your profile and chart the perfect course for your higher education in Germany.
          </p>
          <Link to="/contact" className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
            Book Your Free Initial Consultation
          </Link>
        </div>
      </div>

      {/* Details Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl mb-6 text-gray-900">Why You Need Professional Counseling</h2>
          <p className="text-lg text-gray-700 mb-8">
            Germany offers thousands of degree programs across hundreds of universities. Finding the one that perfectly aligns with your academic background, GPA, language skills, and career goals is overwhelming. Our career counseling service eliminates the confusion. We don't just tell you what's popular; we analyze your unique profile to find what's *right for you*.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-4xl mb-4">analytics</span>
              <h3 className="text-xl mb-3 text-gray-900">Profile Evaluation</h3>
              <p className="text-gray-600">Thorough analysis of your academic transcripts, work experience, and extracurriculars to identify your strengths and weaknesses.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <span className="material-icons-round text-primary text-4xl mb-4">route</span>
              <h3 className="text-xl mb-3 text-gray-900">Path Planning</h3>
              <p className="text-gray-600">Strategic planning for course selection, public vs. private university choices, and timeline management for intakes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl mb-4 text-gray-900">Transparent Pricing</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">High-quality guidance doesn't have to be prohibitively expensive. Choose the plan that fits your needs.</p>
          
          <div className="max-w-md mx-auto bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
            <h3 className="text-2xl mb-2 text-gray-900">Comprehensive Package</h3>
            <div className="text-4xl text-primary mb-6 mt-4">€99 <span className="text-base text-gray-500 font-normal">/ one-time</span></div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Detailed profile evaluation</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> 3 One-on-one video sessions (45 mins each)</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Customized course recommendations</li>
              <li className="flex items-start gap-3 text-gray-700"><span className="material-icons-round text-success text-xl">check_circle</span> Email support for 30 days</li>
            </ul>
            <Link to="/contact" className="block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about our counseling services.</p>
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
