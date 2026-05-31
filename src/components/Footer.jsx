import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Banner */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-1">Ready to Start Your Journey to Germany?</h2>
            <p className="text-white/80">Join 1000+ students who trusted EasyWay Germany</p>
          </div>
          <Link to="/contact"
            className="flex items-center justify-center bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
            Book Free Consultation
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 no-underline">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-primary font-bold font-serif text-sm">EW</div>
              <div className="leading-tight">
                <div className="font-bold text-white font-serif">EasyWay</div>
                <div className="text-xs text-gray-400">Germany</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your trusted partner to Study in Germany. We make it simple, transparent and successful.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Instagram', icon: 'photo_camera' },
                { label: 'Facebook', icon: 'facebook' },
                { label: 'YouTube', icon: 'play_circle' },
                { label: 'WhatsApp', icon: 'chat' },
              ].map(({ label, icon }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-primary hover:text-white transition-colors">
                  <span className="material-icons-round text-base">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 list-none m-0 p-0">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/services', label: 'Services' },
                { to: '/products', label: 'Products' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-2 list-none m-0 p-0">
              {[
                { slug: 'university-lists', label: 'University Lists' },
                { slug: 'sop-samples', label: 'SOP Samples' },
                { slug: 'lor-templates', label: 'LOR Templates' },
                { slug: 'cv-resume', label: 'CV & Resume' },
                { slug: 'application-guides', label: 'Application Guides' },
              ].map(({ slug, label }) => (
                <li key={slug}>
                  <Link to={`/products?category=${slug}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 list-none m-0 p-0">
              {[
                { icon: 'mail', text: 'info@easywaygermany.com' },
                { icon: 'phone', text: '+49 1521 1234567' },
                { icon: 'location_on', text: 'Berlin, Germany' },
                { icon: 'schedule', text: 'Mon–Sat: 9:00 AM – 6:00 PM' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2 text-gray-400 text-sm">
                  <span className="material-icons-round text-base text-gray-500 mt-0.5">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© 2025 EasyWay Germany. All Rights Reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms & Conditions', 'Refund Policy'].map((link) => (
              <a key={link} href="#" className="text-gray-500 text-sm hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
