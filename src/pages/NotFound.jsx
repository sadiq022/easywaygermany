import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

export default function NotFound() {
  return (
    <>
      <SEOHead title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-8xl font-black text-primary/20 font-serif mb-4">404</div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
              <span className="material-icons-round text-base">home</span>
              Go Home
            </Link>
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              <span className="material-icons-round text-base">store</span>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
