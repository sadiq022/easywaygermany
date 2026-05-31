export default function About() {
  const stats = [
    { num: '1000+', label: 'Students Placed' },
    { num: '95%+', label: 'Visa Success Rate' },
    { num: '200+', label: 'Partner Universities' },
    { num: '10+', label: 'Years of Experience' },
    { num: '50+', label: 'Fields Covered' },
  ]

  return (
    <>
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Our Story</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">About EasyWay Germany</h1>
          <p className="text-white/75">10+ years of turning German university dreams into reality</p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-card-hover">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80"
                alt="Students studying"
                className="w-full h-80 object-cover"
              />
            </div>
            <div>
              <div className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-4">Who We Are</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                We Don't Just Make Promises,<br />
                <span className="text-primary">We Deliver Results!</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                EasyWay Germany was founded with a simple mission: to make the Study in Germany application process transparent, simple, and accessible for every student—regardless of their background or budget.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                With over a decade of experience and 1000+ students successfully placed at top German universities, we know exactly what it takes to get you there.
              </p>

              <div className="space-y-4">
                {[
                  { icon: 'verified', title: 'Transparency', desc: 'Honest guidance, no false promises' },
                  { icon: 'support_agent', title: 'Personalized Support', desc: 'Every student is unique to us' },
                  { icon: 'emoji_events', title: 'Results-Driven', desc: 'We measure success by yours' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-round text-primary text-base">{icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{title}</div>
                      <div className="text-gray-500 text-sm">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-white">Our Numbers Speak for Themselves</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {stats.map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-4xl font-black text-yellow-400 mb-1">{num}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
