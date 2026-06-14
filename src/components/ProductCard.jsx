import { Link } from 'react-router-dom'

const CAT_CLASSES = {
  'university-lists': 'cat-university-lists',
  'sop-samples': 'cat-sop-samples',
  'lor-templates': 'cat-lor-templates',
  'cv-resume': 'cat-cv-resume',
  'application-guides': 'cat-application-guides',
}

const CAT_ICONS = {
  'university-lists': 'account_balance',
  'sop-samples': 'description',
  'lor-templates': 'recommend',
  'cv-resume': 'badge',
  'application-guides': 'menu_book',
}

export default function ProductCard({ product }) {
  const catSlug = product.categories?.slug || product.category_slug || ''
  const catName = product.categories?.name || product.category_name || ''
  const catClass = CAT_CLASSES[catSlug] || 'cat-application-guides'
  const catIcon = CAT_ICONS[catSlug] || 'menu_book'

  const discountPct = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  return (
    <Link to={`/products/${product.slug}`}
      className="group flex flex-col h-full bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden no-underline">
      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
        {product.preview_image ? (
          <img 
            src={product.preview_image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none" 
          />
        ) : (
          <div className={`cat-placeholder ${catClass} absolute inset-0 w-full h-full`}>
            <span className={`material-icons-round cat-icon`}>{catIcon}</span>
          </div>
        )}
        {discountPct > 0 && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {discountPct}% OFF
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
          <span className="bg-white text-primary text-sm font-bold px-4 py-2 rounded-lg shadow-sm">View Details</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{catName}</div>
        <h3 className="font-serif text-gray-900 font-semibold text-base leading-snug mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{product.short_description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          {product.pages && (
            <span className="flex items-center gap-1">
              <span className="material-icons-round text-sm">description</span>
              {product.pages} pages
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="material-icons-round text-sm">picture_as_pdf</span>
            {product.format || 'PDF'}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through">₹{Number(product.original_price).toFixed(2)}</span>
            )}
          </div>
          <span className="bg-primary text-white text-sm font-semibold px-8 py-2 rounded-lg transition-colors group-hover:bg-primary-dark">
            Buy Now
          </span>
        </div>
      </div>
    </Link>
  )
}
