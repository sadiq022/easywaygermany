import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import { uploadToCloudinary } from '../../cloudinary'

const SEO_KEYWORD_SUGGESTIONS = [
  'Masters in Germany',
  'Study in Germany for Indian Students',
  'Top Universities in Germany',
  'Computer Science in Germany',
  'Free Tuition Universities Germany',
  'Winter 2026 Admissions Germany',
  'English Taught Masters Germany',
  'APS Certificate Germany',
  'German University Shortlisting',
  'SOP for German Universities',
]

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function parseFaqsFromHtml(html) {
  if (!html) return []
  try {
    const jsonMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
    if (jsonMatch && jsonMatch[1]) {
      const parsed = JSON.parse(jsonMatch[1])
      if (parsed['@type'] === 'FAQPage' && Array.isArray(parsed.mainEntity)) {
        return parsed.mainEntity.map(item => ({
          question: item.name || '',
          answer: item.acceptedAnswer?.text || ''
        }))
      }
    }
  } catch (e) {}

  const list = []
  const faqSectionRegex = /<h2>Frequently Asked Questions<\/h2>([\s\S]*?)(?:<h2>|$)/i
  const sectionMatch = html.match(faqSectionRegex)
  const sourceHtml = sectionMatch ? sectionMatch[1] : html
  const itemRegex = /<h3>([^<]+)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi
  let match
  while ((match = itemRegex.exec(sourceHtml)) !== null) {
    const q = match[1].replace(/<[^>]+>/g, '').trim()
    const a = match[2].trim()
    if (q && a && !q.toLowerCase().includes('what is inside') && !q.toLowerCase().includes('who should')) {
      list.push({ question: q, answer: a })
    }
  }
  return list
}

function syncFaqsToDescription(currentDesc, faqList) {
  if (!faqList || faqList.length === 0) return currentDesc
  const validFaqs = faqList.filter(f => f.question.trim() && f.answer.trim())
  if (validFaqs.length === 0) return currentDesc

  const faqHtml = [
    '<h2>Frequently Asked Questions</h2>',
    ...validFaqs.map(f => `<h3>${f.question.trim()}</h3>\n<p>${f.answer.trim()}</p>`),
  ].join('\n\n')

  const faqRegex = /<h2>Frequently Asked Questions<\/h2>[\s\S]*?(?=(?:<h2>|$))/i
  if (faqRegex.test(currentDesc)) {
    return currentDesc.replace(faqRegex, faqHtml + '\n\n')
  } else {
    return (currentDesc ? currentDesc.trim() + '\n\n' : '') + faqHtml
  }
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

  // SEO & Preview States
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const [showDescPreview, setShowDescPreview] = useState(false)
  const [faqs, setFaqs] = useState([])
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })

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
        setFaqs(parseFaqsFromHtml(prod.description || ''))
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

  function insertSnippet(type) {
    let snippet = ''
    if (type === 'inside') {
      snippet = `\n\n<h2>What is inside this resource</h2>\n<ul>\n  <li>A curated list of top universities in Germany with program specifications</li>\n  <li>Tuition fees and semester contribution breakdowns</li>\n  <li>Language requirements (English IELTS/TOEFL vs German)</li>\n  <li>Application deadlines for Winter & Summer intakes</li>\n  <li>GPA cut-offs and competitive profile assessment criteria</li>\n</ul>\n`
    } else if (type === 'audience') {
      snippet = `\n\n<h2>Who should use this resource?</h2>\n<p>Specially curated for Indian and international students planning to study Masters or Bachelors in Germany. Whether you need ambitious, target, or safe university options, this guide eliminates hours of manual research across university portals.</p>\n`
    } else if (type === 'how') {
      snippet = `\n\n<h2>How to use this resource to build your shortlist</h2>\n<ol>\n  <li>Compare your Bachelor GPA and IELTS score against program cut-offs.</li>\n  <li>Shortlist 8 to 12 universities across ambitious, target, and safe categories.</li>\n  <li>Track application deadlines and start your APS Certificate verification early.</li>\n  <li>Confirm all prerequisites on official faculty portals before submitting applications.</li>\n</ol>\n`
    } else if (type === 'faq') {
      snippet = `\n\n<h3>Is education in Germany free for international students?</h3>\n<p>At most public German universities, there are no tuition fees for Masters programs. Students only pay a semester contribution (€150–€350). Baden-Württemberg charges €1,500/semester for non-EU students.</p>\n`
    } else if (type === 'link_consult') {
      snippet = ` <a href="/contact">book a free consultation with our Germany education experts</a> `
    } else if (type === 'link_shortlist') {
      snippet = ` <a href="/services/university-shortlisting">university shortlisting service</a> `
    }

    setForm(f => ({
      ...f,
      description: (f.description || '').trim() + snippet
    }))
    toast.success('Section template inserted into description!')
  }

  function handleAddFaq() {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error('Both question and answer are required')
      return
    }
    const updated = [...faqs, { question: newFaq.question.trim(), answer: newFaq.answer.trim() }]
    setFaqs(updated)
    setNewFaq({ question: '', answer: '' })
    setForm(f => ({ ...f, description: syncFaqsToDescription(f.description, updated) }))
    toast.success('FAQ added and synced to description!')
  }

  function handleRemoveFaq(idx) {
    const updated = faqs.filter((_, i) => i !== idx)
    setFaqs(updated)
    setForm(f => ({ ...f, description: syncFaqsToDescription(f.description, updated) }))
    toast.success('FAQ removed.')
  }

  function handleAppendKeyword(kw) {
    const current = form.seo_keywords ? form.seo_keywords.split(',').map(s => s.trim()).filter(Boolean) : []
    if (current.includes(kw)) {
      toast('Keyword already included', { icon: 'ℹ️' })
      return
    }
    const next = [...current, kw].join(', ')
    set('seo_keywords', next)
    toast.success(`Added keyword: ${kw}`)
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Description *</label>
                    <p className="text-xs text-gray-500">Supports HTML tags for rich SEO formatting (headings, lists, internal links, FAQs).</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setShowDescPreview(false)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${!showDescPreview ? 'bg-white shadow text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Code / HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDescPreview(true)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${showDescPreview ? 'bg-white shadow text-primary font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {/* 1-Click SEO Section Inserters */}
                <div className="mb-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-2">
                    <span className="material-icons-round text-sm text-primary">auto_fix_high</span>
                    <span>1-Click SEO Section Inserters:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => insertSnippet('inside')}
                      className="px-2.5 py-1 bg-white hover:bg-primary/5 text-gray-700 hover:text-primary text-xs font-medium border border-gray-200 hover:border-primary/40 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>+</span> What's Inside Checklist
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('audience')}
                      className="px-2.5 py-1 bg-white hover:bg-primary/5 text-gray-700 hover:text-primary text-xs font-medium border border-gray-200 hover:border-primary/40 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>+</span> Who This Is For
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('how')}
                      className="px-2.5 py-1 bg-white hover:bg-primary/5 text-gray-700 hover:text-primary text-xs font-medium border border-gray-200 hover:border-primary/40 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>+</span> Shortlisting Steps
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('faq')}
                      className="px-2.5 py-1 bg-white hover:bg-primary/5 text-gray-700 hover:text-primary text-xs font-medium border border-gray-200 hover:border-primary/40 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>+</span> Sample FAQ Item
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('link_consult')}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>🔗</span> Link: Consultation
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('link_shortlist')}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>🔗</span> Link: Shortlisting
                    </button>
                  </div>
                </div>

                {showDescPreview ? (
                  <div className="w-full p-4 border border-gray-200 rounded-xl bg-white min-h-[220px] max-h-[420px] overflow-y-auto blog-content prose prose-sm">
                    {form.description ? (
                      <div dangerouslySetInnerHTML={{ __html: form.description }} />
                    ) : (
                      <p className="text-gray-400 italic text-sm">No description entered yet. Switch to Code / HTML to start writing.</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    required
                    rows={8}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Enter detailed HTML description with headings (<h2>, <h3>), checklists (<ul>), and FAQs..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-primary transition-colors resize-y leading-relaxed"
                  />
                )}
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
          <div className="bg-white rounded-2xl shadow-card p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons-round text-primary text-xl">travel_explore</span>
                <h2 className="font-semibold text-gray-900 text-lg">SEO & Google Search Presence</h2>
              </div>
              <p className="text-sm text-gray-500">Fine-tune Google search rankings, rich snippets, and metadata specifically for Indian and international students searching for Germany studies.</p>
            </div>

            {/* Live Google Search Preview */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/70">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons-round text-primary text-base">preview</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Live Google Search Preview</span>
                </div>
                <div className="flex bg-gray-200/80 rounded-lg p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-white shadow text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-white shadow text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all ${previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-black">
                    EG
                  </div>
                  <div className="leading-tight overflow-hidden">
                    <p className="text-xs font-semibold text-gray-800">EasyWay Germany</p>
                    <p className="text-[11px] text-gray-500 truncate">https://easywaygermany.com › products › {form.slug || 'product-slug'}</p>
                  </div>
                </div>
                <h3 className="text-[#1a0dab] hover:underline cursor-pointer text-base md:text-lg font-medium leading-snug mb-1">
                  {(form.meta_title || form.title || 'Product Title') + ' | EasyWay Germany'}
                </h3>
                <p className="text-xs md:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                  {form.meta_description || form.short_description || 'Ranked list and admission guide for Indian and international students applying for Masters & Bachelors in Germany with tuition fees, GPA cutoffs, and deadlines.'}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Thumbnail Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Alt Text</label>
                <input
                  type="text" value={form.alt_text} onChange={e => set('alt_text', e.target.value)}
                  placeholder="e.g. Top 50 CS universities in Germany ranked list PDF"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">Describe the thumbnail image for Google Images and screen readers.</p>
              </div>

              {/* Meta Title with Gauge */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                  <div className="text-xs font-semibold">
                    <span className={
                      form.meta_title.length === 0 ? 'text-gray-400' :
                      form.meta_title.length >= 50 && form.meta_title.length <= 60 ? 'text-green-600 font-bold' :
                      form.meta_title.length < 50 ? 'text-amber-600' : 'text-red-500'
                    }>
                      {form.meta_title.length}/60 chars
                    </span>
                    <span className="text-gray-400 ml-1.5 font-normal">
                      {form.meta_title.length === 0 ? '(leave blank to use Title)' :
                       form.meta_title.length >= 50 && form.meta_title.length <= 60 ? '• Optimal length' :
                       form.meta_title.length < 50 ? '• A bit short' : '• Over 60 chars (may truncate)'}
                    </span>
                  </div>
                </div>
                <input
                  type="text" value={form.meta_title} onChange={e => set('meta_title', e.target.value)}
                  placeholder="e.g. Top 50 CS Universities in Germany: PDF List & Cutoffs"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">Shown as the blue title in Google results. Ideal length: 50–60 characters.</p>
              </div>

              {/* Meta Description with Gauge */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                  <div className="text-xs font-semibold">
                    <span className={
                      form.meta_description.length === 0 ? 'text-gray-400' :
                      form.meta_description.length >= 120 && form.meta_description.length <= 160 ? 'text-green-600 font-bold' :
                      form.meta_description.length < 120 ? 'text-amber-600' : 'text-red-500'
                    }>
                      {form.meta_description.length}/160 chars
                    </span>
                    <span className="text-gray-400 ml-1.5 font-normal">
                      {form.meta_description.length === 0 ? '(leave blank to use short description)' :
                       form.meta_description.length >= 120 && form.meta_description.length <= 160 ? '• Optimal length' :
                       form.meta_description.length < 120 ? '• Under 120 chars' : '• Over 160 chars (may truncate)'}
                    </span>
                  </div>
                </div>
                <textarea
                  rows={3} value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
                  placeholder="e.g. Ranked list of the top 50 computer science universities in Germany with fees, deadlines, language needs and GPA cut-offs. Instant 35-page PDF download."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Shown below the title in Google results. Target: 120–160 characters with clear call-to-action.</p>
              </div>

              {/* SEO Keywords with Clickable Chips */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
                <input
                  type="text" value={form.seo_keywords} onChange={e => set('seo_keywords', e.target.value)}
                  placeholder="top CS universities in Germany, masters in computer science Germany, study in Germany for Indian students"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1 mb-2">Comma-separated target search queries used in meta tags and structured data.</p>

                {/* Suggested High-Intent Keywords */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <span className="material-icons-round text-sm text-primary">tag</span>
                    <span>Click to add high-intent Germany admission keywords:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SEO_KEYWORD_SUGGESTIONS.map(kw => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleAppendKeyword(kw)}
                        className="px-2.5 py-1 bg-white hover:bg-primary/10 text-gray-700 hover:text-primary text-xs font-medium border border-gray-200 hover:border-primary/30 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span className="text-primary font-bold">+</span> {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive FAQ Builder (Google FAQ Rich Snippet Generator) */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-gray-50/50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons-round text-primary text-lg">quiz</span>
                      <h3 className="font-semibold text-gray-900 text-sm">Product FAQs (Google Schema Ready)</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">FAQs appear directly on Google search results as expandable rich snippets.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(f => ({ ...f, description: syncFaqsToDescription(f.description, faqs) }))
                      toast.success('Synced all FAQs into product description!')
                    }}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-colors flex items-center gap-1 w-fit"
                  >
                    <span className="material-icons-round text-sm">sync</span>
                    Sync FAQs to Description
                  </button>
                </div>

                {/* Current FAQs List */}
                {faqs.length > 0 ? (
                  <div className="space-y-2.5 mb-4">
                    {faqs.map((f, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-start justify-between gap-3">
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">Q</span>
                            {f.question}
                          </p>
                          <p className="text-gray-600 pl-5.5 leading-relaxed">{f.answer}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove FAQ"
                        >
                          <span className="material-icons-round text-base">delete_outline</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic mb-4 bg-white p-3 rounded-xl border border-dashed border-gray-200">
                    No individual FAQs added yet. Add questions below to trigger Google FAQ rich snippets.
                  </p>
                )}

                {/* Add New FAQ Form */}
                <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Add New FAQ</span>
                  <div>
                    <input
                      type="text"
                      value={newFaq.question}
                      onChange={e => setNewFaq({ ...newFaq, question: e.target.value })}
                      placeholder="e.g. Is a Masters in computer science in Germany free?"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={newFaq.answer}
                      onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })}
                      placeholder="e.g. At most public German universities, there are no tuition fees. Students only pay semester contributions (€150–€350)."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="flex items-center gap-1 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    <span className="material-icons-round text-sm">add</span>
                    Add FAQ Item
                  </button>
                </div>
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
