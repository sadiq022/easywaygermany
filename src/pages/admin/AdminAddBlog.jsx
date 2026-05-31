import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../supabase'
import { uploadToCloudinary } from '../../cloudinary'

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminAddBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [readTime, setReadTime] = useState('5 min read')
  const [excerpt, setExcerpt] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  // Cover image states
  const fileInputRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [fileUploading, setFileUploading] = useState(false)

  // Quill dynamic states
  const [quillLoaded, setQuillLoaded] = useState(false)
  const quillRef = useRef(null)
  const [initialContent, setInitialContent] = useState('')

  // Load Quill via CDN dynamically
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js'
    script.async = true
    script.onload = () => {
      setQuillLoaded(true)
    }
    document.body.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [])

  // Initialize Quill instance
  useEffect(() => {
    if (!quillLoaded || loadingData) return
    const container = document.getElementById('editor-container')
    if (!container) return

    container.innerHTML = '' // Clear
    const editor = new window.Quill(container, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    })

    quillRef.current = editor

    if (initialContent) {
      editor.root.innerHTML = initialContent
    }
  }, [quillLoaded, loadingData, initialContent])

  // Load Categories & Blog Data
  useEffect(() => {
    async function load() {
      // 1. Fetch categories
      const { data: cats } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')
      setCategories(cats || [])
      setLoadingCategories(false)

      // 2. Fetch blog details if in edit mode
      if (isEdit) {
        const { data: blog, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !blog) {
          toast.error('Blog post not found.')
          navigate('/admin/blogs')
          return
        }

        setTitle(blog.title || '')
        setSlug(blog.slug || '')
        setIsSlugManuallyEdited(true)
        setCategory(blog.category || '')
        setImage(blog.image || '')
        setImagePreview(blog.image || '')
        setReadTime(blog.read_time || '5 min read')
        setExcerpt(blog.excerpt || '')
        setDate(blog.date || new Date().toISOString().split('T')[0])
        setInitialContent(blog.content || '')
        setLoadingData(false)
      }
    }
    load()
  }, [id, isEdit])

  // Real-time slug generation from title
  function handleTitleChange(val) {
    setTitle(val)
    if (!isSlugManuallyEdited) {
      setSlug(toSlug(val))
    }
  }

  function handleSlugChange(val) {
    setSlug(val)
    setIsSlugManuallyEdited(true)
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function handleRemoveImage() {
    setImageFile(null)
    setImagePreview('')
    setImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !category) {
      toast.error('Title, slug, and category are required.')
      return
    }

    const editorContent = quillRef.current ? quillRef.current.root.innerHTML : ''
    if (!editorContent || editorContent === '<p><br></p>') {
      toast.error('Blog content is required.')
      return
    }

    setSaving(true)

    let finalImageUrl = image

    if (imageFile) {
      setFileUploading(true)
      try {
        const secureUrl = await uploadToCloudinary(imageFile)
        finalImageUrl = secureUrl
      } catch (uploadError) {
        toast.error('Image upload failed: ' + uploadError.message)
        setSaving(false)
        setFileUploading(false)
        return
      }
      setFileUploading(false)
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      image: finalImageUrl || null,
      read_time: readTime.trim(),
      excerpt: excerpt.trim() || null,
      content: editorContent,
      date,
    }

    let error
    if (isEdit) {
      const { error: err } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', id)
      error = err
    } else {
      // Find maximum ID to autoincrement integer ID in legacy DB schema
      const { data: maxIdData } = await supabase
        .from('blogs')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)

      const nextId = maxIdData && maxIdData.length > 0 ? Number(maxIdData[0].id) + 1 : 1
      const { error: err } = await supabase
        .from('blogs')
        .insert({ id: nextId, ...payload })
      error = err
    }

    if (error) {
      toast.error(error.message.includes('unique') ? 'A blog post with this slug already exists.' : 'Failed to save blog post.')
    } else {
      toast.success(isEdit ? 'Blog post updated successfully!' : 'Blog post created successfully!')
      navigate('/admin/blogs')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="page-hero !py-12 mb-8 border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-4">
          <Link to="/admin/blogs" className="text-white/80 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2.5 rounded-2xl flex items-center justify-center w-fit border border-white/15">
            <span className="material-icons-round text-2xl">arrow_back</span>
          </Link>
          <div>
            <div className="inline-block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Administrative Center</div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">{isEdit ? 'Edit Blog' : 'Create Blog'}</h1>
            <p className="text-white/75 text-sm max-w-xl mx-auto">{isEdit ? 'Modify existing article details' : 'Publish a new article to the site'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {loadingData ? (
          <div className="bg-white rounded-2xl shadow-card p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Form Fields */}
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Blog Title *</label>
                  <input
                    type="text" required value={title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="e.g. Complete SOP Writing Guide"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-gray-55"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug *</label>
                  <input
                    type="text" required value={slug}
                    onChange={e => handleSlugChange(e.target.value)}
                    placeholder="e.g. complete-sop-writing-guide"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-gray-55"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={category} required
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white">
                    <option value="">Select blog category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Read Time</label>
                  <input
                    type="text" required value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-gray-55"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date" required value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-gray-55"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt (Short Preview) *</label>
                <textarea
                  rows={5} required value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Enter a short excerpt (1-2 sentences) to appear in listings and search results..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-y min-h-[140px]"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-gray-50/50 transition-all flex flex-col items-center justify-center min-h-[200px] overflow-hidden group"
                >
                  {imagePreview ? (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-950/40 group-hover:bg-gray-950/60 transition-colors z-10 text-white">
                      <span className="material-icons-round text-3xl mb-1 opacity-90">photo_camera</span>
                      <span className="text-xs font-semibold tracking-wide uppercase opacity-90">Change Cover Image</span>
                    </div>
                  ) : null}

                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Cover Preview" 
                      className="absolute inset-0 w-full h-full object-cover z-0" 
                    />
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <span className="material-icons-round text-4xl text-gray-300 mb-3">cloud_upload</span>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Upload a cover image</p>
                      <p className="text-xs text-gray-400">Drag & drop or click to browse files (JPEG, PNG, WebP)</p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                {imagePreview && (
                  <div className="mt-3 flex items-center justify-between bg-gray-50 border border-gray-150 rounded-xl p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-icons-round text-gray-400 text-xl flex-shrink-0">image</span>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Current Cover Image</p>
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {imageFile ? imageFile.name : (image ? image.split('/').pop() : 'Uploaded Image')}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove image"
                    >
                      <span className="material-icons-round text-lg">delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quill.js Rich Text Content */}
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Rich Text Blog Content *</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden min-h-[300px] flex flex-col">
                <div id="editor-container" className="flex-1 min-h-[260px] text-sm" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit" disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-60 text-base shadow-sm">
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{fileUploading ? 'Uploading Image...' : 'Saving Post...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons-round text-base">save</span>
                    <span>{isEdit ? 'Update Post' : 'Publish Post'}</span>
                  </>
                )}
              </button>
              <Link
                to="/admin/blogs"
                className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors text-base">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
