export async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'p1y2txhc'
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', preset)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.error?.message || 'Cloudinary upload failed')
  }

  const data = await res.json()
  return data.secure_url
}
