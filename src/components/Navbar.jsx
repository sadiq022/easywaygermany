import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
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
          <span className="text-yellow-400 font-medium flex items-center gap-1">
            <span className="material-icons-round text-sm">school</span>
            Free Consultation Available
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-serif text-base">EW</div>
            <div className="leading-tight">
              <div className="font-bold text-gray-900 font-serif text-lg">EasyWay</div>
              <div className="text-xs text-gray-500 -mt-0.5">Germany</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
            <li><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>
            <li><NavLink to="/products" className={navLinkClass}>Products</NavLink></li>
            <li><NavLink to="/services" className={navLinkClass}>Services</NavLink></li>
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
          <span className="font-bold font-serif text-gray-900">EasyWay Germany</span>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-900">
            <span className="material-icons-round">close</span>
          </button>
        </div>
        <nav className="p-5">
          <ul className="space-y-2 list-none m-0 p-0">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/products', label: 'Products' },
              { to: '/services', label: 'Services' },
              {to: '/blog', label: 'Blogs'},
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `block py-2.5 px-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
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
