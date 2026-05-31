import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Checkout from './pages/Checkout'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminAddProduct from './pages/admin/AdminAddProduct'
import AdminCategories from './pages/admin/AdminCategories'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminAddBlog from './pages/admin/AdminAddBlog'
import AdminBlogCategories from './pages/admin/AdminBlogCategories'
import AdminSettings from './pages/admin/AdminSettings'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminReviews from './pages/admin/AdminReviews'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
          }}
        />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/checkout/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
            <Route path="/admin/blogs/add" element={<AdminRoute><AdminAddBlog /></AdminRoute>} />
            <Route path="/admin/blogs/edit/:id" element={<AdminRoute><AdminAddBlog /></AdminRoute>} />
            <Route path="/admin/blog-categories" element={<AdminRoute><AdminBlogCategories /></AdminRoute>} />
            <Route path="/admin/settings"        element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/coupons"          element={<AdminRoute><AdminCoupons /></AdminRoute>} />
            <Route path="/admin/reviews"          element={<AdminRoute><AdminReviews /></AdminRoute>} />
            <Route path="/profile"               element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*"                      element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
