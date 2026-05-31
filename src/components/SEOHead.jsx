import { useEffect } from 'react'

const SITE_NAME = 'EasyWay Germany'
const DEFAULT_DESC = 'Your one-stop platform for Study in Germany resources – university lists, SOP samples, LOR templates, CV guides, and expert consulting.'

export default function SEOHead({ title, description, keywords, image, type = 'website', structuredData }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Study in Germany Resources`
    document.title = fullTitle

    function setMeta(nameOrProp, content, attr = 'name') {
      if (!content) return
      let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, nameOrProp)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const desc = description || DEFAULT_DESC

    setMeta('description', desc)
    if (keywords) setMeta('keywords', keywords)
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', desc, 'property')
    setMeta('og:type', type, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    if (image) setMeta('og:image', image, 'property')
    setMeta('twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', desc)
    if (image) setMeta('twitter:image', image)

    let sdEl = document.getElementById('__sd')
    if (structuredData) {
      if (!sdEl) {
        sdEl = document.createElement('script')
        sdEl.id = '__sd'
        sdEl.type = 'application/ld+json'
        document.head.appendChild(sdEl)
      }
      sdEl.textContent = JSON.stringify(structuredData)
    } else {
      sdEl?.remove()
    }

    return () => { document.getElementById('__sd')?.remove() }
  }, [title, description, keywords, image, type, structuredData])

  return null
}
