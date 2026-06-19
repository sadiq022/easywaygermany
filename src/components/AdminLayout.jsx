import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { to: '/admin',                 label: 'Overview',           icon: 'dashboard' },
  { to: '/admin/products',        label: 'Products',           icon: 'store' },
  { to: '/admin/categories',      label: 'Product Categories', icon: 'category' },
  { to: '/admin/blogs',           label: 'Blogs',              icon: 'article' },
  { to: '/admin/blog-categories', label: 'Blog Categories',    icon: 'bookmarks' },
  { to: '/admin/leads',           label: 'Leads',              icon: 'contact_phone' },
  { to: '/admin/coupons',         label: 'Coupons',            icon: 'local_offer' },
  { to: '/admin/reviews',         label: 'Reviews',            icon: 'star' },
  { to: '/admin/settings',        label: 'Settings',           icon: 'settings' },
]

export default function AdminLayout({ children }) {
  const { pathname } = useLocation()

  function isActive(to) {
    if (to === '/admin') return pathname === '/admin'
    return pathname.startsWith(to)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Red Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-60 bg-primary z-30 flex flex-col shadow-xl">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow">
              <img src="/images/easyway-logo.png" alt="EasyWay Germany" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-none">EasyWay</div>
              <div className="text-xs text-white/60 leading-none mt-1">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {NAV.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(to)
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-icons-round text-[18px] flex-shrink-0">{icon}</span>
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="material-icons-round text-base">arrow_back</span>
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-60 flex-1 min-w-0 min-h-screen">
        {children}
      </div>
    </div>
  )
}
