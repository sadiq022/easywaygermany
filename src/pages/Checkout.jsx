import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

function loadRazorpayScript() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function Checkout() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [razorpayKeyId, setRazorpayKeyId] = useState('')

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  useEffect(() => {
    async function load() {
      const [productRes, settingsRes] = await Promise.all([
        supabase.from('products').select('*, categories(name, slug)').eq('id', id).eq('is_active', true).single(),
        supabase.from('site_settings').select('key, value').in('key', ['razorpay_key_id', 'razorpay_mode']),
      ])

      if (!productRes.data) { navigate('/products'); return }

      if (user) {
        const { data: existing } = await supabase.from('purchases').select('id').eq('user_id', user.id).eq('product_id', id).eq('status', 'completed').single()
        if (existing) { toast('You already own this product.'); navigate('/dashboard'); return }
      }

      const settingsMap = Object.fromEntries((settingsRes.data || []).map(r => [r.key, r.value]))
      setRazorpayKeyId(settingsMap.razorpay_key_id || '')
      setProduct(productRes.data)
      setLoading(false)
    }
    load()
  }, [id, user])

  // Computed totals
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.min(Number(product?.price || 0) * appliedCoupon.value / 100, Number(product?.price || 0))
      : Math.min(Number(appliedCoupon.value), Number(product?.price || 0))
    : 0
  const finalAmount = product ? Math.max(0, Number(product.price) - discount) : 0

  async function applyCoupon() {
    if (!couponInput.trim()) return
    setApplyingCoupon(true)
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponInput.trim().toUpperCase())
      .eq('is_active', true)
      .single()

    if (!coupon) { toast.error('Invalid or inactive coupon code.'); setApplyingCoupon(false); return }

    const now = new Date()
    if (coupon.valid_from && new Date(coupon.valid_from) > now) { toast.error('Coupon is not yet active.'); setApplyingCoupon(false); return }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) { toast.error('Coupon has expired.'); setApplyingCoupon(false); return }
    if (coupon.max_uses && coupon.uses >= coupon.max_uses) { toast.error('Coupon usage limit reached.'); setApplyingCoupon(false); return }
    if (coupon.min_amount && Number(product.price) < Number(coupon.min_amount)) {
      toast.error(`Minimum order amount ₹${coupon.min_amount} required for this coupon.`)
      setApplyingCoupon(false)
      return
    }

    setAppliedCoupon(coupon)
    toast.success(`Coupon applied! You save ${coupon.type === 'percent' ? coupon.value + '%' : '₹' + coupon.value}`)
    setApplyingCoupon(false)
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponInput('')
  }

  async function recordPurchase(paymentId) {
    const { error } = await supabase.from('purchases').insert({
      user_id: user.id,
      product_id: product.id,
      amount: finalAmount,
      status: 'completed',
      payment_id: paymentId,
    })
    if (error) {
      toast.error('Purchase recorded but failed to save. Contact support with payment ID: ' + paymentId)
      return false
    }
    // Increment coupon uses
    if (appliedCoupon) {
      await supabase.from('coupons').update({ uses: appliedCoupon.uses + 1 }).eq('id', appliedCoupon.id)
    }
    return true
  }

  async function handleRazorpayPayment() {
    if (!razorpayKeyId) {
      toast.error('Payment gateway is not configured. Please contact support.')
      return
    }
    setProcessing(true)
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      toast.error('Failed to load payment gateway. Check your internet connection.')
      setProcessing(false)
      return
    }

    const options = {
      key: razorpayKeyId,
      amount: Math.round(finalAmount * 100),
      currency: 'INR',
      name: 'EasyWay Germany',
      description: product.title,
      image: product.preview_image || undefined,
      handler: async function(response) {
        const ok = await recordPurchase(response.razorpay_payment_id)
        if (ok) {
          toast.success('Payment successful! Redirecting to your dashboard…')
          navigate('/dashboard')
        }
        setProcessing(false)
      },
      prefill: { email: user?.email },
      theme: { color: '#2563EB' },
      modal: {
        ondismiss: () => setProcessing(false),
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', function(response) {
      toast.error('Payment failed: ' + response.error.description)
      setProcessing(false)
    })
    rzp.open()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) return null

  const discountPct = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-6">
          <Link to={`/products/${product.slug}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
            <span className="material-icons-round text-base">arrow_back</span>
            Back to product
          </Link>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-serif font-bold text-gray-900 text-lg mb-5">Order Summary</h2>
              <div className="flex items-start gap-3 mb-5 pb-5 border-b">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 cat-${product.categories?.slug || 'application-guides'}`}>
                  <span className="material-icons-round text-white text-xl">description</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{product.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.categories?.name}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-5 pb-5 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="text-gray-900">₹{Number(product.price).toFixed(2)}</span>
                </div>
                {product.original_price && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">You save</span>
                    <span className="text-success font-semibold">₹{(Number(product.original_price) - Number(product.price)).toFixed(2)} ({discountPct}%)</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1">
                      <span className="material-icons-round text-xs">local_offer</span>
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span className="font-semibold">–₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary text-xl">₹{finalAmount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                {[
                  { icon: 'lock', label: 'Secure' },
                  { icon: 'download', label: 'Instant Access' },
                  { icon: 'verified', label: 'Genuine' },
                  { icon: 'replay', label: 'Redownload Anytime' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="material-icons-round text-success text-sm">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="md:col-span-3 space-y-4">
            {/* Coupon code */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Have a Coupon?</h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                    <span className="material-icons-round text-base">check_circle</span>
                    <span className="font-mono">{appliedCoupon.code}</span> applied — saving ₹{discount.toFixed(2)}
                  </div>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-gray-700">
                    <span className="material-icons-round text-base">close</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary font-mono uppercase"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50">
                    {applyingCoupon ? '…' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Payment button */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-serif font-bold text-gray-900 text-lg mb-2">Complete Your Purchase</h2>
              <p className="text-gray-500 text-sm mb-6">
                Secure payment powered by Razorpay. You get instant access to download after payment.
              </p>

              {!razorpayKeyId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
                  <div className="flex items-start gap-2">
                    <span className="material-icons-round text-yellow-600 text-base mt-0.5">warning</span>
                    <p className="text-yellow-800 text-sm">Payment gateway not configured. Please contact the site administrator.</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleRazorpayPayment}
                disabled={processing || !razorpayKeyId}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary-dark transition-colors disabled:opacity-60 mb-4">
                {processing ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                ) : (
                  <><span className="material-icons-round">lock</span> Pay ₹{finalAmount.toFixed(2)} with Razorpay</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                <span className="material-icons-round text-sm">security</span>
                Secured by 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
