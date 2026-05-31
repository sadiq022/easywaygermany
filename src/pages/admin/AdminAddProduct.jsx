import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import { uploadToCloudinary } from '../../cloudinary'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminAddProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const fileRef = useRef(null)
  const thumbnailRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [fileUploading, setFileUploading] = useState(false)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  const [form, setForm] = useState({
    title: '', slug: '', description: '', short_description: '',
    price: '', original_price: '', category_id: '',
    is_featured: false, tags: '', pages: '', format: 'PDF',
    alt_text: '', meta_title: '', meta_description: '', seo_keywords: '',
  })
  const [productFile, setProductFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [existingFilePath, setExistingFilePath] = useState(null)
  const [existingPreviewImage, setExistingPreviewImage] = useState(null)

  useEffect(() => {
    async function load() {
      // 1. Fetch categories
      const { data: cats } = await supabase.from('categories').select('*')
      setCategories(cats || [])

      // 2. Fetch product if editing
      if (isEdit) {
        const { data: prod, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id, 10))
          .single()

        if (error || !prod) {
          toast.error('Product not found.')
          navigate('/admin/products')
          return
        }

        setForm({
          title: prod.title || '',
          slug: prod.slug || '',
          description: prod.description || '',
          short_description: prod.short_description || '',
          price: prod.price ? String(prod.price) : '',
          original_price: prod.original_price ? String(prod.original_price) : '',
          category_id: prod.category_id ? String(prod.category_id) : '',
          is_featured: !!prod.is_featured,
          tags: prod.tags || '',
          pages: prod.pages ? String(prod.pages) : '',
          format: prod.format || 'PDF',
          alt_text: prod.alt_text || '',
          meta_title: prod.meta_title || '',
          meta_description: prod.meta_description || '',
          seo_keywords: prod.seo_keywords || '',
        })
        setIsSlugManuallyEdited(true)
        setExistingFilePath(prod.file_path)
        setExistingPreviewImage(prod.preview_image)
        if (prod.preview_image) {
          setThumbnailPreview(prod.preview_image)
        }
        setLoadingData(false)
      }
    }
    load()
  }, [id, isEdit, navigate])

  function set(key, val) {
    setForm(f => {
      const next = { ...f, [key]: val }
      if (key === 'title' && !isSlugManuallyEdited) {
        next.slug = toSlug(val)
      }
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.price || !form.category_id) {
      toast.error('Title, price, and category are required.')
      return
    }

    setLoading(true)
    let file_path = existingFilePath
    let preview_image = existingPreviewImage

    if (productFile) {
      setFileUploading(true)
      const ext = productFile.name.split('.').pop()
      const fileName = `${Date.now()}_${toSlug(form.title)}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, productFile, { upsert: false })

      if (uploadError) {
        toast.error('File upload failed: ' + uploadError.message)
        setLoading(false)
        setFileUploading(false)
        return
      }
      file_path = uploadData.path
      setFileUploading(false)
    }

    if (thumbnailFile) {
      setThumbnailUploading(true)
      try {
        const secureUrl = await uploadToCloudinary(thumbnailFile)
        preview_image = secureUrl
      } catch (uploadError) {
        toast.error('Thumbnail upload failed: ' + uploadError.message)
        setLoading(false)
        setThumbnailUploading(false)
        return
      }
      setThumbnailUploading(false)
    }

    const productPayload = {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      description: form.description,
      short_description: form.short_description || null,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      category_id: parseInt(form.category_id),
      is_featured: form.is_featured,
      tags: form.tags || null,
      pages: form.pages ? parseInt(form.pages) : null,
      format: form.format,
      file_path,
      preview_image,
      alt_text: form.alt_text || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      seo_keywords: form.seo_keywords || null,
    }

    const { error } = isEdit 
      ? await supabase.from('products').update(productPayload).eq('id', parseInt(id, 10))
      : await supabase.from('products').insert(productPayload)

    if (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} product: ` + error.message)
    } else {
      toast.success(`Product ${isEdit ? 'updated' : 'added'} successfully!`)
      navigate('/admin/products')
    }
    setLoading(false)
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="page-hero !py-12 border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-4">
          <Link to="/admin/products" className="text-white/80 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2.5 rounded-2xl flex items-center justify-center w-fit border border-white/15">
            <span className="material-icons-round text-2xl">arrow_back</span>
          </Link>
          <div>
            <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Administrative Center</div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <p className="text-white/75 text-sm max-w-xl mx-auto">{isEdit ? 'Modify product details and updates' : 'Create a new digital product'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text" required value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Top 50 CS Universities in Germany"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text" value={form.slug} onChange={e => {
                    set('slug', e.target.value)
                    setIsSlugManuallyEdited(true)
                  }}
                  placeholder="auto-generated from title"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text" value={form.short_description} onChange={e => set('short_description', e.target.value)}
                  placeholder="One-line summary shown in product cards"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea
                  required rows={5} value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Detailed description of the product"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Pricing & Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number" required step="0.01" min="0" value={form.price}
                  onChange={e => set('price', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                <input
                  type="number" step="0.01" min="0" value={form.original_price}
                  onChange={e => set('original_price', e.target.value)}
                  placeholder="For discount display"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required value={form.category_id} onChange={e => set('category_id', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select
                  value={form.format} onChange={e => set('format', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white">
                  <option>PDF</option>
                  <option>DOCX</option>
                  <option>ZIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                <input
                  type="number" min="1" value={form.pages}
                  onChange={e => set('pages', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text" value={form.tags}
                  onChange={e => set('tags', e.target.value)}
                  placeholder="CS, SOP, Germany"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox" id="is_featured" checked={form.is_featured}
                  onChange={e => set('is_featured', e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured product</label>
              </div>
            </div>
          </div>

          {/* Product Thumbnail Section */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Product Thumbnail</h2>
            <p className="text-sm text-gray-500 mb-4">Upload a cover image or thumbnail that will be shown on product pages and listings.</p>
            <div 
              onClick={() => thumbnailRef.current?.click()}
              className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-gray-50/50 transition-all flex flex-col items-center justify-center min-h-[160px] overflow-hidden group"
            >
              {thumbnailPreview ? (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-950/40 group-hover:bg-gray-950/60 transition-colors z-10 text-white">
                  <span className="material-icons-round text-2xl mb-1 opacity-90">photo_camera</span>
                  <span className="text-xs font-semibold tracking-wide uppercase opacity-90">Change Thumbnail</span>
                </div>
              ) : null}

              {thumbnailPreview ? (
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail Preview" 
                  className="absolute inset-0 w-full h-full object-cover z-0" 
                />
              ) : (
                <div className="flex flex-col items-center py-2">
                  <span className="material-icons-round text-3xl text-gray-300 mb-2 block">cloud_upload</span>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Upload a product thumbnail</p>
                  <p className="text-xs text-gray-400">JPEG, PNG, WebP – max 5MB</p>
                </div>
              )}
              
              <input
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setThumbnailFile(file)
                    setThumbnailPreview(URL.createObjectURL(file))
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Product File</h2>
            <p className="text-sm text-gray-500 mb-4">Upload the PDF/file that users will download after purchase. Stored in a private Supabase Storage bucket.</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
              {productFile ? (
                <div>
                  <span className="material-icons-round text-3xl text-primary mb-2 block">description</span>
                  <p className="font-medium text-gray-900 text-sm">{productFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{(productFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : existingFilePath ? (
                <div>
                  <span className="material-icons-round text-3xl text-success mb-2 block">task</span>
                  <p className="font-medium text-gray-900 text-sm">File already uploaded</p>
                  <p className="text-xs text-gray-400 mt-1">Path: {existingFilePath.split('/').pop()} (Click to upload a different file)</p>
                </div>
              ) : (
                <div>
                  <span className="material-icons-round text-3xl text-gray-300 mb-2 block">cloud_upload</span>
                  <p className="text-sm text-gray-500">Click to upload file (PDF, DOCX – max 50MB)</p>
                </div>
              )}
              <input
                ref={fileRef} type="file" accept=".pdf,.docx,.zip"
                className="hidden"
                onChange={e => setProductFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* SEO & Metadata */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-1">SEO & Metadata</h2>
            <p className="text-sm text-gray-500 mb-4">Controls how this product appears in Google, AI search engines, and social media previews. Leave blank to auto-use the product title and description.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Alt Text</label>
                <input
                  type="text" value={form.alt_text} onChange={e => set('alt_text', e.target.value)}
                  placeholder="e.g. Top 50 CS universities in Germany ranked list PDF"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">Describe the thumbnail image for screen readers and image search.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text" value={form.meta_title} onChange={e => set('meta_title', e.target.value)}
                  placeholder="Leave blank to use product title"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">Shown in Google search results. Ideal length: 50–60 characters.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  rows={3} value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
                  placeholder="Leave blank to use short description. Shown below the title in Google results."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Ideal length: 120–160 characters.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
                <input
                  type="text" value={form.seo_keywords} onChange={e => set('seo_keywords', e.target.value)}
                  placeholder="study in Germany, CS universities, German universities ranking"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">Comma-separated keywords. Used in the meta keywords tag and structured data.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit" disabled={loading}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-60">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{fileUploading ? 'Uploading file…' : (thumbnailUploading ? 'Uploading thumbnail…' : 'Saving…')}</span>
                </>
              ) : (
                <><span className="material-icons-round text-base">save</span> {isEdit ? 'Save Changes' : 'Add Product'}</>
              )}
            </button>
            <Link to="/admin/products" className="px-8 py-3 rounded-xl font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
