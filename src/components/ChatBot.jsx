import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const WHATSAPP = 'https://wa.me/919119740154'

// Each entry: { id, keywords[], answer (string or JSX fn), followUp[] }
const FAQ = [
  {
    id: 'services',
    keywords: ['service', 'offer', 'help', 'what do', 'what can'],
    answer: `We offer 6 services:\n\n• University Shortlisting – ₹2,500\n• SOP Writing – ₹2,500\n• LOR Writing – ₹1,250/letter\n• CV Preparation – ₹1,000\n• Visa SOP – ₹1,500\n• Visa Cover Letter – ₹1,500\n\nWhich one would you like to know more about?`,
    followUp: ['SOP Writing', 'LOR Writing', 'University Shortlisting', 'Visa SOP', 'CV Preparation'],
  },
  {
    id: 'sop',
    keywords: ['sop writing', 'statement of purpose', 'university sop'],
    answer: `Our SOP Writing service costs ₹2,500.\n\nWe craft a custom Statement of Purpose tailored to your academic profile, goals, and target universities — written by students who actually got into German universities. Unlimited revisions included.`,
    followUp: ['Visa SOP', 'What other services do you offer?', 'Talk to an expert'],
  },
  {
    id: 'lor',
    keywords: ['lor', 'letter of recommendation', 'recommendation letter'],
    answer: `Our LOR Writing service costs ₹1,250 per letter.\n\nWe write professional Letters of Recommendation on behalf of your professors, supervisors, or company managers — tailored to each university's requirements.`,
    followUp: ['What other services do you offer?', 'Talk to an expert'],
  },
  {
    id: 'university',
    keywords: ['university', 'shortlist', 'college', 'which university', 'universities'],
    answer: `Our University Shortlisting service costs ₹2,500.\n\nWe handpick 8–12 universities that match your profile, sorted by admit probability. We include public universities (tuition-free in Germany!) and private options.`,
    followUp: ['SOP Writing', 'What other services do you offer?', 'Talk to an expert'],
  },
  {
    id: 'cv',
    keywords: ['cv', 'resume', 'curriculum vitae'],
    answer: `Our CV Preparation service costs ₹1,000.\n\nWe prepare a European-standard CV (very different from an Indian resume!) that is ATS-optimized and ready for German university applications.`,
    followUp: ['What other services do you offer?', 'Talk to an expert'],
  },
  {
    id: 'visa-sop',
    keywords: ['visa sop', 'sop for visa', 'embassy sop', 'visa statement'],
    answer: `Our Visa SOP service costs ₹1,500.\n\nA Visa SOP is written specifically for the German embassy — it covers your study plan, financial situation, and your intent to return to India after graduation. It is different from your university SOP.`,
    followUp: ['Visa Cover Letter', 'SOP Writing', 'Talk to an expert'],
  },
  {
    id: 'visa-cover',
    keywords: ['visa cover letter', 'cover letter', 'visa letter'],
    answer: `Our Visa Cover Letter service costs ₹1,500.\n\nA cover letter is a mandatory document for the German student visa. Our visa experts craft a personalized letter explaining your financial situation, study plan, and intent to return.`,
    followUp: ['Visa SOP', 'What other services do you offer?', 'Talk to an expert'],
  },
  {
    id: 'visa-diff',
    keywords: ['difference', 'visa sop vs', 'sop vs cover', 'which one'],
    answer: `Great question!\n\n• Visa SOP — A statement addressed to the German embassy explaining WHY you want to study in Germany and your return intent.\n\n• Visa Cover Letter — A formal letter covering your financial proof, blocked account, and supporting your visa documents.\n\nMany students need both. Contact us and we can guide you!`,
    followUp: ['Visa SOP', 'Visa Cover Letter', 'Talk to an expert'],
  },
  {
    id: 'products',
    keywords: ['product', 'buy', 'purchase', 'download', 'template', 'sample', 'guide'],
    answer: `We have a range of digital products including SOP samples, LOR templates, university lists, CV templates, and application guides — available at affordable prices in our store.`,
    followUp: ['View Products', 'Talk to an expert'],
  },
  {
    id: 'cost',
    keywords: ['price', 'cost', 'fee', 'charge', 'how much', 'pricing', 'rate'],
    answer: `Here's a full price summary:\n\n• University Shortlisting – ₹2,500\n• SOP Writing – ₹2,500\n• LOR Writing – ₹1,250/letter\n• CV Preparation – ₹1,000\n• Visa SOP – ₹1,500\n• Visa Cover Letter – ₹1,500`,
    followUp: ['Talk to an expert', 'Book Consultation', 'What other services do you offer?'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'reach', 'email', 'phone', 'whatsapp', 'call'],
    answer: `You can reach us at:\n\n📧 info@easywaygermany.com\n📞 +49 1521 1234567\n💬 WhatsApp: +91 9119740154\n🕐 Mon–Sat: 9 AM – 6 PM CET`,
    followUp: ['Talk to an expert', 'Book Consultation'],
  },
  {
    id: 'germany',
    keywords: ['germany', 'study in germany', 'german', 'deutsch', 'berlin'],
    answer: `Germany is one of the best destinations for Indian students — most public universities charge zero tuition fees, degrees are globally recognized, and there are excellent post-study work opportunities.\n\nWe help you with all the documents you need for admission and visa.`,
    followUp: ['What services do you offer?', 'Book Consultation', 'Talk to an expert'],
  },
  {
    id: 'started',
    keywords: ['get started', 'start', 'begin', 'how to', 'process', 'steps'],
    answer: `Getting started is simple:\n\n1. Tell us about your profile and target universities\n2. Choose the services you need\n3. We deliver within 2–5 working days\n\nJust message us on WhatsApp to begin!`,
    followUp: ['Talk to an expert', 'Book Consultation'],
  },
]

const QUICK_ACTIONS = [
  'What services do you offer?',
  'SOP Writing price',
  'University Shortlisting',
  'Visa SOP vs university SOP',
  'Prices & fees',
]

const WELCOME = "Hi! I'm the EasyWay Germany assistant. Ask me anything about our services, pricing, or studying in Germany."

function findAnswer(text) {
  const lower = text.toLowerCase()
  return FAQ.find(f => f.keywords.some(kw => lower.includes(kw))) || null
}

function BotMessage({ content, followUp, onFollowUp, onClose }) {
  return (
    <div className="flex justify-start items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="material-icons-round text-primary" style={{ fontSize: 14 }}>support_agent</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 text-gray-800 px-3 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed whitespace-pre-line max-w-[85%]">
          {content}
        </div>
        {followUp && followUp.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {followUp.map(q => {
              if (q === 'Talk to an expert') {
                return (
                  <a key={q} href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1">
                    <span className="material-icons-round" style={{ fontSize: 11 }}>chat</span>
                    WhatsApp
                  </a>
                )
              }
              if (q === 'Book Consultation' || q === 'Contact us') {
                return (
                  <Link key={q} to="/contact" onClick={onClose}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors">
                    {q}
                  </Link>
                )
              }
              if (q === 'View Products') {
                return (
                  <Link key={q} to="/products" onClick={onClose}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors">
                    View Products
                  </Link>
                )
              }
              return (
                <button key={q} onClick={() => onFollowUp(q)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors bg-white">
                  {q}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'bot', content: WELCOME, followUp: null }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function addBotReply(text) {
    const match = findAnswer(text)
    if (match) {
      setMessages(prev => [...prev, { role: 'bot', content: match.answer, followUp: match.followUp }])
    } else {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "I'm not sure about that, but our team can help you directly!",
        followUp: ['Talk to an expert', 'Book Consultation'],
      }])
    }
  }

  function handleSend(text) {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setTimeout(() => addBotReply(msg), 300)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showQuickActions = messages.length === 1

  return (
    <>
      {/* Nudge tooltip */}
      {!open && nudge && (
        <div className="fixed bottom-24 right-6 z-50 flex items-end justify-end">
          <div className="bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-100 px-4 py-3 max-w-[220px] relative">
            <button
              onClick={() => setNudge(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              aria-label="Dismiss"
            >
              <span className="material-icons-round text-gray-600" style={{ fontSize: 12 }}>close</span>
            </button>
            <p className="text-gray-800 text-sm font-medium leading-snug">
              Have questions about studying in Germany?
            </p>
            <p className="text-gray-400 text-xs mt-1">Tap to explore our services →</p>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => { setOpen(o => !o); setNudge(false) }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
        aria-label="Chat with us"
      >
        <span className="material-icons-round text-2xl">{open ? 'close' : 'chat'}</span>
        {!open && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          style={{ height: '530px' }}>

          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-icons-round text-white text-base">support_agent</span>
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">EasyWay Assistant</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-white/70 text-xs">Always here to help</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <span className="material-icons-round text-lg">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            {messages.map((msg, i) => (
              msg.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-primary text-white px-3 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[80%] leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <BotMessage
                  key={i}
                  content={msg.content}
                  followUp={msg.followUp}
                  onFollowUp={handleSend}
                  onClose={() => setOpen(false)}
                />
              )
            ))}

            {/* Quick actions after welcome */}
            {showQuickActions && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 pl-9">Common questions:</p>
                {QUICK_ACTIONS.map(q => (
                  <button key={q} onClick={() => handleSend(q)}
                    className="w-full text-left text-sm px-3 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors bg-white">
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 flex items-end gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your question…"
              className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-colors bg-white placeholder-gray-400"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-icons-round text-base">send</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pb-2.5 flex-shrink-0">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-green-600 transition-colors inline-flex items-center gap-1">
              <span className="material-icons-round" style={{ fontSize: 12 }}>chat</span>
              Chat directly on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  )
}
