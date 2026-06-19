import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../supabase'

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobilePackagesOpen, setMobilePackagesOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    
    if (isSupabaseConfigured) {
      supabase.from('categories').select('*').then(({ data }) => {
        if (data) setCategories(data)
      })
    }
    
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('drawer-open', drawerOpen)
    return () => document.body.classList.remove('drawer-open')
  }, [drawerOpen])

  async function handleLogout() {
    await signOut()
    toast.success('You have been logged out.')
    navigate('/')
    setDrawerOpen(false)
  }

  const firstName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'

  const navLinkClass = ({ isActive }) =>
    `text-base font-semibold transition-colors ${isActive
      ? 'text-primary'
      : 'text-gray-700 hover:text-primary'}`

  return (
    <>
      {/* Topbar */}
      <div className="bg-gray-900 text-gray-300 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <span className="material-icons-round text-sm">mail</span>
              info@easywaygermany.com
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons-round text-sm">phone</span>
              +49 1521 1234567
            </span>
          </div>
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a href="https://www.instagram.com/deutschlandgenics/" target="_blank" rel="noopener noreferrer"
               className="text-pink-500 hover:text-pink-400 transition-colors" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://www.youtube.com/@deutschlandgenics436" target="_blank" rel="noopener noreferrer"
               className="text-red-500 hover:text-red-400 transition-colors" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/919119740154" target="_blank" rel="noopener noreferrer"
               className="text-green-500 hover:text-green-400 transition-colors" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 no-underline">
            <img src="/images/easyway-logo.png" alt="EasyWay Germany" className="h-10 w-auto object-contain" />
            <div className="leading-tight">
              <div className="font-bold text-gray-900 font-serif text-lg">EasyWay</div>
              <div className="text-xs text-primary -mt-0.5 font-semibold">Germany</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
            <li><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>

            {/* Packages Dropdown */}
            <li className="relative group py-2">
              <span className={`${navLinkClass({ isActive: false })} cursor-default select-none`}>Packages <span className="material-icons-round text-sm align-middle">expand_more</span></span>
              <div className="absolute left-0 top-full mt-0 w-64 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 space-y-1">
                  <Link to="/pricing" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">
                    <span className="material-icons-round text-base text-primary">school</span>
                    <div>
                      <div className="font-semibold">Admission Packages</div>
                      <div className="text-xs text-gray-400 font-normal">SOP, LOR, university applications</div>
                    </div>
                  </Link>
                  <Link to="/visa-package" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">
                    <span className="material-icons-round text-base text-primary">flight_takeoff</span>
                    <div>
                      <div className="font-semibold">Visa Package</div>
                      <div className="text-xs text-gray-400 font-normal">Visa SOP, blocked account, VFS</div>
                    </div>
                  </Link>
                </div>
              </div>
            </li>

            {/* Products Dropdown */}
            <li className="relative group py-2">
              <NavLink to="/products" className={navLinkClass}>Products <span className="material-icons-round text-sm align-middle">expand_more</span></NavLink>
              <div className="absolute left-0 top-full mt-0 w-96 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {categories.map(cat => (
                      <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link to="/products" className="block px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors rounded-lg text-center">
                    View All Products
                  </Link>
                </div>
              </div>
            </li>

            {/* Services Dropdown */}
            <li className="relative group py-2">
              <NavLink to="/services" className={navLinkClass}>Services <span className="material-icons-round text-sm align-middle">expand_more</span></NavLink>
              <div className="absolute left-0 top-full mt-0 w-[420px] bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <Link to="/services/university-shortlisting" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">University Shortlisting</Link>
                    <Link to="/services/sop-writing" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">SOP Writing</Link>
                    <Link to="/services/lor-writing" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">LOR Writing</Link>
                    <Link to="/services/cv-preparation" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">CV Preparation</Link>
                    <Link to="/services/visa-sop" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">Visa SOP</Link>
                    <Link to="/services/visa-cover-letter" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg">Visa Cover Letter</Link>
                  </div>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link to="/services" className="block px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors rounded-lg text-center">
                    View All Services
                  </Link>
                </div>
              </div>
            </li>

            <li><NavLink to="/blog" className={navLinkClass}>Blogs</NavLink></li>
            <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
            <li><NavLink to="/contact" className={navLinkClass}>Contact</NavLink></li>
            {isAdmin && (
              <li>
                <NavLink to="/admin" className={({ isActive }) =>
                  `text-sm font-medium px-2 py-1 rounded ${isActive ? 'bg-primary text-white' : 'text-primary border border-primary hover:bg-primary hover:text-white transition-colors'}`}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-1 text-base text-gray-700 hover:text-primary font-semibold transition-colors">
                  <span className="material-icons-round text-lg">person</span>
                  {firstName}
                </Link>
                <Link to="/profile" className="text-base text-gray-500 hover:text-primary font-medium transition-colors" title="Account Settings">
                  <span className="material-icons-round text-lg">manage_accounts</span>
                </Link>
                <button onClick={handleLogout} className="text-base border border-primary text-primary px-5 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-base text-gray-700 hover:text-primary font-semibold transition-colors">Login</Link>
                <Link to="/register" className="text-base bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-gray-700"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b">
          <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2 no-underline">
            <img src="/images/easyway-logo.png" alt="EasyWay Germany" className="h-8 w-auto object-contain" />
            <div className="leading-tight">
              <div className="font-bold text-gray-900 font-serif text-base">EasyWay</div>
              <div className="text-xs font-semibold text-primary -mt-0.5">Germany</div>
            </div>
          </Link>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-900">
            <span className="material-icons-round">close</span>
          </button>
        </div>
        <nav className="p-5 h-[calc(100vh-70px)] overflow-y-auto">
          <ul className="space-y-1 list-none m-0 p-0">
            <li>
              <NavLink to="/" end onClick={() => setDrawerOpen(false)} className={({ isActive }) => `block py-2.5 px-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>Home</NavLink>
            </li>

            {/* Mobile Packages Dropdown */}
            <li>
              <div className="flex items-center justify-between">
                <span className="flex-1 py-2.5 px-3 rounded-lg font-medium text-gray-700">Packages</span>
                <button onClick={() => setMobilePackagesOpen(!mobilePackagesOpen)} className="p-2 text-gray-500">
                  <span className={`material-icons-round transition-transform ${mobilePackagesOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
              </div>
              {mobilePackagesOpen && (
                <ul className="pl-6 mt-1 space-y-1 mb-2">
                  <li><Link to="/pricing" onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">Admission Packages</Link></li>
                  <li><Link to="/visa-package" onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">Visa Package</Link></li>
                </ul>
              )}
            </li>

            {/* Mobile Products Dropdown */}
            <li>
              <div className="flex items-center justify-between">
                <NavLink to="/products" onClick={() => setDrawerOpen(false)} className={({ isActive }) => `flex-1 py-2.5 px-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>Products</NavLink>
                <button onClick={() => setMobileProductsOpen(!mobileProductsOpen)} className="p-2 text-gray-500">
                  <span className={`material-icons-round transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
              </div>
              {mobileProductsOpen && (
                <ul className="pl-6 mt-1 space-y-1 mb-2">
                  {categories.map(cat => (
                    <li key={cat.slug}>
                      <Link to={`/products?category=${cat.slug}`} onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">{cat.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Mobile Services Dropdown */}
            <li>
              <div className="flex items-center justify-between">
                <NavLink to="/services" onClick={() => setDrawerOpen(false)} className={({ isActive }) => `flex-1 py-2.5 px-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>Services</NavLink>
                <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)} className="p-2 text-gray-500">
                  <span className={`material-icons-round transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
              </div>
              {mobileServicesOpen && (
                <ul className="pl-6 mt-1 space-y-1 mb-2">
                  <li><Link to="/services/university-shortlisting" onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">University Shortlisting</Link></li>
                  <li><Link to="/services/sop-writing" onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">SOP Writing</Link></li>
                  <li><Link to="/services/lor-writing" onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">LOR Writing</Link></li>
                  <li><Link to="/services/cv-preparation" onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">CV Preparation</Link></li>
                  <li><Link to="/services/visa-sop" onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">Visa SOP</Link></li>
                  <li><Link to="/services/visa-cover-letter" onClick={() => setDrawerOpen(false)} className="block py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary">Visa Cover Letter</Link></li>
                </ul>
              )}
            </li>
            <li><NavLink to="/blog" onClick={() => setDrawerOpen(false)} className={({ isActive }) => `block py-2.5 px-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>Blogs</NavLink></li>
            <li><NavLink to="/about" onClick={() => setDrawerOpen(false)} className={({ isActive }) => `block py-2.5 px-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>About</NavLink></li>
            <li><NavLink to="/contact" onClick={() => setDrawerOpen(false)} className={({ isActive }) => `block py-2.5 px-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>Contact</NavLink></li>
            {isAdmin && (
              <li>
                <NavLink to="/admin" onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `block py-2.5 px-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}`}>
                  Admin Panel
                </NavLink>
              </li>
            )}
          </ul>
          <div className="mt-6 pt-6 border-t space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setDrawerOpen(false)}
                  className="block w-full text-center py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                  My Dashboard
                </Link>
                <Link to="/profile" onClick={() => setDrawerOpen(false)}
                  className="block w-full text-center py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                  Account Settings
                </Link>
                <button onClick={handleLogout}
                  className="block w-full text-center py-2.5 px-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setDrawerOpen(false)}
                  className="block w-full text-center py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                  Login
                </Link>
                <Link to="/register" onClick={() => setDrawerOpen(false)}
                  className="block w-full text-center py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
