// Server-side SEO meta injector for the Vite/React SPA.
//
// The app is a pure client-side-rendered SPA (react-helmet-async), so the raw
// HTML Netlify serves for every route is always the same index.html — meaning
// every page was returning the HOMEPAGE's <title>, canonical link and OG tags
// to anything that doesn't execute JS (WhatsApp/Facebook/LinkedIn link-preview
// bots, some crawlers, and the very first HTML paint search engines see).
// This rewrites those tags at the edge, per-route, before the HTML reaches
// the client.
//
// Fails open: any error/timeout just falls back to the untouched origin HTML
// (today's behaviour), so this can never turn into a broken page.

const SITE = 'https://easywaygermany.com'
const SUPABASE_URL = 'https://uhknpxtwgpngdieuvurh.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoa25weHR3Z3BuZ2RpZXV2dXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTc5MDYsImV4cCI6MjA3Nzc3MzkwNn0.65AA1RLHjjzlzi5jXUhbBgZEjEuYUQG8R0zK_b6PJMo'

const OG_IMAGE_FALLBACK = `${SITE}/images/easyway-logo.png`

// Keep title/description in sync with the <Helmet> block of each page — the
// edge value is what crawlers see before JS runs, Helmet takes over after.
// `ogTitle` / `ogDescription` are optional and fall back to title / description.
const STATIC_META = {
  '/': {
    title: 'Masters & Bachelors in Germany Consultancy | EasyWay',
    description:
      'Planning a Masters or Bachelors in Germany? Get expert help from consultants who live there: SOP, APS, shortlisting, blocked account and visa.',
    ogTitle: 'Masters & Bachelors in Germany Consultancy | EasyWay Germany',
    type: 'website',
  },
  '/services': {
    title: 'Study in Germany Services: SOP, APS & Visa | EasyWay',
    description:
      'Study in Germany services for Indian students: SOP and LOR writing, APS guidance, blocked account, university shortlisting and visa SOP.',
    ogTitle: 'Study in Germany Services 2026 — SOP, APS, Visa SOP | EasyWay Germany',
    type: 'website',
  },
  '/contact': {
    title: 'Book a Free Consultation | EasyWay Germany',
    description:
      'Book a free consultation with EasyWay Germany. We review your profile, suggest universities and guide you on the APS, blocked account and student visa.',
    ogTitle: 'Free Consultation – Study in Germany | EasyWay Germany',
    type: 'website',
  },
  '/about': {
    title: 'About EasyWay Germany | Consultants in Dresden',
    description:
      'EasyWay Germany is run by Indian students who moved to Germany. Honest, affordable help with admissions, APS, blocked account and visa.',
    ogTitle: 'About EasyWay Germany – Consultants Who Actually Live in Germany',
    ogDescription:
      'Founded by an Indian student in Dresden — we guide students through German university admissions, APS, blocked account, and visa from firsthand experience.',
    type: 'website',
  },
  '/blog': {
    title: 'Study in Germany Blog 2026 | EasyWay Germany',
    description:
      'Guides for Indian, Bangladeshi and Nepali students: APS certificate, Germany student visa, blocked account, SOP writing, scholarships and life in Germany.',
    ogTitle: 'Study in Germany Blog 2026 – Expert Guides & Tips | EasyWay Germany',
    ogDescription:
      'Comprehensive guides on APS certificate, Germany student visa, blocked account, university admissions and life in Germany — written by consultants who live there.',
    type: 'website',
  },
  '/study-in-germany': {
    title: 'Study in Germany 2026: Complete Guide | EasyWay Germany',
    description:
      'Complete 2026 guide to studying in Germany: APS, blocked account (€11,904), student visa, top universities, scholarships and cost of living.',
    ogTitle: 'Study in Germany 2026: Complete Guide | EasyWay Germany',
    ogDescription:
      'Everything you need to study in Germany — APS certificate, blocked account, student visa, top universities, scholarships, and cost of living. Expert guidance from Dresden.',
    type: 'article',
  },
  '/blocked-account-germany': {
    title: 'Blocked Account Germany 2026: Guide | EasyWay Germany',
    description:
      'Open your German blocked account (Sperrkonto): €11,904 required in 2026, Fintiba vs Expatrio, the process from India and TCS rules explained.',
    ogTitle: 'Blocked Account Germany 2026 — Fintiba vs Expatrio, Exact Amount & Process | EasyWay Germany',
    ogDescription:
      'Complete guide to opening a German blocked account for your student visa. €11,904 required, provider comparison, and hands-on help from EasyWay Germany.',
    type: 'article',
  },
  '/pricing': {
    title: 'Germany University Admission Packages | EasyWay Germany',
    description:
      'Admission packages for Indian students: SOP writing, university shortlisting, LOR, CV and visa guidance. Basic ₹19,999, Standard ₹34,999, Premium ₹44,999.',
    ogTitle: 'Germany University Admission Packages for Indian Students | EasyWay Germany',
    ogDescription:
      'Get expert help applying to German universities. SOP, LOR, CV, shortlisting and visa guidance. Plans from ₹19,999.',
    type: 'website',
  },
  '/visa-package': {
    title: 'Germany Student Visa Package | EasyWay Germany',
    description:
      'Germany student visa help for Indian students: visa SOP, blocked account guidance, APS help, VFS appointment and mock interview. ₹7,999 one-time.',
    ogTitle: 'Germany Student Visa Package for Indian Students | EasyWay Germany',
    ogDescription:
      'Expert visa assistance — Visa SOP, blocked account, APS, VFS appointment and mock interview. ₹7,999 one-time.',
    type: 'website',
  },
  '/products': {
    title: 'Study in Germany Resources & Templates | EasyWay Germany',
    description:
      'Browse EasyWay Germany\'s study in Germany resources: SOP samples, LOR templates, a CV template, university lists and a complete application guide.',
    ogTitle: 'Study in Germany Services & Packages | EasyWay Germany',
    ogDescription:
      'Affordable document services for German university applications. SOP, LOR, CV, Visa SOP and more.',
    type: 'website',
  },
  '/services/sop-writing': {
    title: 'SOP Writing Service for Germany | EasyWay Germany',
    description:
      'Personalised, plagiarism-free Statement of Purpose for German universities, written by students studying in Germany. ₹2,500 with unlimited revisions.',
    type: 'website',
  },
  '/services/lor-writing': {
    title: 'LOR Writing Service for Germany | EasyWay Germany',
    description:
      'Expertly crafted letters of recommendation for German universities and visa applications, written on behalf of your recommender. ₹1,250 per LOR.',
    type: 'website',
  },
  '/services/cv-preparation': {
    title: 'CV Preparation for Germany | EasyWay Germany',
    description:
      'Europass-compliant, ATS-friendly CV for German universities and employers. Expert preparation, editable files and unlimited revisions. ₹1,000.',
    type: 'website',
  },
  '/services/university-shortlisting': {
    title: 'University Shortlisting for Germany | EasyWay Germany',
    description:
      'Personalised university shortlisting for Masters in Germany: data-driven picks, a one-on-one call and a detailed report. Public universities only.',
    type: 'website',
  },
  '/services/visa-sop': {
    title: 'Visa SOP Writing for Germany | EasyWay Germany',
    description:
      'Professional statement of purpose for your German student visa, written by experts who know what embassy officers look for. ₹1,500.',
    type: 'website',
  },
  '/services/visa-cover-letter': {
    title: 'Visa Cover Letter for Germany | EasyWay Germany',
    description:
      'Embassy-compliant visa cover letter for a German student visa, jobs, internships and working student roles. Unlimited revisions. ₹1,500.',
    type: 'website',
  },
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeJson(obj) {
  // Safe to inline inside a <script> tag — escapes </script> breakout.
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

// Replacement callbacks (not strings) so `$` sequences in titles/descriptions
// (e.g. "$&", "$1") are never interpreted as regex back-references.
function applyMeta(html, meta) {
  let out = html
  const swap = (pattern, replacement) => {
    out = out.replace(pattern, () => replacement)
  }

  const ogTitle = meta.ogTitle || meta.title
  const ogDescription = meta.ogDescription || meta.description

  if (meta.title) {
    swap(/<title>.*?<\/title>/s, `<title>${escapeHtml(meta.title)}</title>`)
  }
  if (meta.description) {
    swap(
      /<meta name="description" content=".*?" \/>/s,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    )
  }
  if (meta.canonical) {
    swap(
      /<link rel="canonical" href=".*?" \/>/s,
      `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
    )
    swap(
      /<meta property="og:url" content=".*?" \/>/s,
      `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`
    )
  }
  if (ogTitle) {
    swap(
      /<meta property="og:title" content=".*?" \/>/s,
      `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`
    )
    swap(
      /<meta name="twitter:title" content=".*?" \/>/s,
      `<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`
    )
  }
  if (ogDescription) {
    swap(
      /<meta property="og:description" content=".*?" \/>/s,
      `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`
    )
    swap(
      /<meta name="twitter:description" content=".*?" \/>/s,
      `<meta name="twitter:description" content="${escapeHtml(ogDescription)}" />`
    )
  }
  if (meta.type) {
    swap(
      /<meta property="og:type" content=".*?" \/>/s,
      `<meta property="og:type" content="${escapeHtml(meta.type)}" />`
    )
  }
  if (meta.image) {
    swap(
      /<meta property="og:image" content=".*?" \/>/s,
      `<meta property="og:image" content="${escapeHtml(meta.image)}" />`
    )
    swap(
      /<meta name="twitter:image" content=".*?" \/>/s,
      `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`
    )
  }
  if (meta.noindex) {
    swap(
      /<meta name="robots" content=".*?" \/>/s,
      '<meta name="robots" content="noindex, follow" />'
    )
  }
  if (meta.extraHead) {
    swap(/<\/head>/, `${meta.extraHead}\n  </head>`)
  }
  if (meta.bodyHtml) {
    swap(/<div id="root"><\/div>/, `<div id="root">${meta.bodyHtml}</div>`)
  }

  return out
}

// Article HTML comes from the admin-authored `blogs.content` column. React renders it
// with dangerouslySetInnerHTML (which never runs <script> tags), but when we write it
// into the raw HTML the browser WOULD execute them — so strip anything executable.
// JSON-LD blocks are inert data and are kept (FAQ schema lives inside post content).
function sanitizeArticleHtml(html) {
  return String(html)
    .replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<(iframe|object|embed|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|link|meta|base)\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"')
    // The shell already has the post title as its one <h1>.
    .replace(/<(\/?)h1\b/gi, '<$1h2')
}

// Crawlable copy of the article for clients that don't run JS. React's createRoot()
// replaces everything inside #root on boot, so this never conflicts with hydration.
function buildArticleShell(blog, image) {
  const alt = blog.image_alt || blog.title
  return (
    '<article id="ssr-article" style="max-width:48rem;margin:0 auto;padding:1.5rem 1rem;' +
    'font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.65;color:#111827">' +
    `<h1>${escapeHtml(blog.title)}</h1>` +
    (image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(alt)}" style="max-width:100%;height:auto" />` : '') +
    sanitizeArticleHtml(blog.content || '') +
    '</article>'
  )
}

// Returns { state: 'found', blog } | { state: 'missing' } | { state: 'error' }.
// 'missing' (query succeeded, no row) is the only state that may produce a 404 —
// a Supabase outage must never turn valid blog URLs into 404s.
async function fetchBlog(slug) {
  const url =
    `${SUPABASE_URL}/rest/v1/blogs?slug=eq.${encodeURIComponent(slug)}` +
    `&is_published=eq.true&select=title,seo_title,seo_description,seo_keywords,excerpt,image,image_alt,og_image,date,category,content&limit=1`
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  })
  if (!res.ok) return { state: 'error' }
  const rows = await res.json()
  if (!Array.isArray(rows)) return { state: 'error' }
  return rows[0] ? { state: 'found', blog: rows[0] } : { state: 'missing' }
}

function stripTags(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Same states as fetchBlog: only 'missing' (query ok, no row) may become a 404.
async function fetchProduct(slug) {
  const url =
    `${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}` +
    `&is_active=eq.true&select=title,slug,short_description,description,meta_title,meta_description,preview_image,alt_text,price,original_price,categories(name,slug)&limit=1`
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  })
  if (!res.ok) return { state: 'error' }
  const rows = await res.json()
  if (!Array.isArray(rows)) return { state: 'error' }
  return rows[0] ? { state: 'found', product: rows[0] } : { state: 'missing' }
}

function formatPrice(n) {
  const v = Number(n)
  return Number.isFinite(v) ? `₹${v.toFixed(2)}` : ''
}

// Crawlable copy of the product page for clients that don't run JS (React replaces #root on boot).
function buildProductShell(product) {
  const alt = product.alt_text || product.title
  const price = formatPrice(product.price)
  const was = product.original_price && Number(product.original_price) > Number(product.price) ? formatPrice(product.original_price) : ''
  const summary = product.short_description || ''
  const isHtml = /<[a-z][\s\S]*>/i.test(product.description || '')
  return (
    '<article id="ssr-article" style="max-width:48rem;margin:0 auto;padding:1.5rem 1rem;' +
    'font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.65;color:#111827">' +
    `<h1>${escapeHtml(product.title)}</h1>` +
    (product.preview_image ? `<img src="${escapeHtml(product.preview_image)}" alt="${escapeHtml(alt)}" style="max-width:100%;height:auto" />` : '') +
    (price ? `<p><strong>${escapeHtml(price)}</strong>${was ? ` <s>${escapeHtml(was)}</s>` : ''}</p>` : '') +
    (summary ? `<p>${escapeHtml(summary)}</p>` : '') +
    (isHtml ? sanitizeArticleHtml(product.description) : product.description ? `<p>${escapeHtml(product.description)}</p>` : '') +
    '</article>'
  )
}

// ───────────────────────── Crawlable versions of the static pages ─────────────────────────
// The SPA ships an empty <div id="root"> for every route, so a crawler that does not run JavaScript sees no
// H1, no headings, no text and no internal links. These shells give it a faithful summary of each page
// (same headings and facts as the React page). React replaces #root on boot, so users never see them.
// Keep the facts here in sync with the pages when prices or requirements change.

const NAV_LINKS = [
  ['/', 'Home'],
  ['/study-in-germany', 'Study in Germany'],
  ['/services', 'Services'],
  ['/pricing', 'Admission Packages'],
  ['/visa-package', 'Visa Package'],
  ['/blocked-account-germany', 'Blocked Account Germany'],
  ['/products', 'Products'],
  ['/blog', 'Blog'],
  ['/about', 'About Us'],
  ['/contact', 'Contact'],
]

const SERVICE_LINKS = [
  ['/services/university-shortlisting', 'University Shortlisting for Masters in Germany', 'We shortlist 5–8 universities across ambitious, strong-match and safe tiers, based on your GPA, language scores, work experience and field of study.'],
  ['/services/sop-writing', 'SOP Writing for Germany Universities', 'A tailored, research-focused statement of purpose for each program and university, never a template.'],
  ['/services/lor-writing', 'LOR Writing Support for German University Applications', 'Letters of recommendation drafted in the right format and level of detail for your recommender to review and sign.'],
  ['/services/cv-preparation', 'CV and Resume Preparation for German Universities', 'A Europass or structured academic CV, formatted to German standards and ATS-friendly.'],
  ['/blog/aps-certificate-process-for-indian-students-complete-2025-guide', 'APS Certificate Guidance for Indian Students', 'A document checklist, interview preparation and a review of your documents before submission. APS processing takes 6–8 weeks.'],
  ['/blocked-account-germany', 'Blocked Account Setup Assistance', 'Help choosing between Expatrio and Fintiba. The 2026 requirement is €11,904 per year (€992 per month).'],
  ['/services/visa-sop', 'Germany Student Visa SOP (Letter of Motivation)', 'A visa SOP covering your finances, study plan, ties to your home country and intention to return.'],
  ['/services/visa-cover-letter', 'Visa Cover Letter Writing Service', 'An embassy-compliant cover letter for your German student visa, jobs, internships and working student roles.'],
]

const PILLAR_GUIDES = [
  ['/blog/masters-in-germany-for-indian-students-complete-guide-2026', 'Masters in Germany for Indian Students: Complete Guide 2026'],
  ['/blog/is-masters-in-germany-free-for-international-students-2026', 'Is a Masters in Germany Free for International Students?'],
  ['/blog/masters-in-germany-cost-in-indian-rupees-2026-full-breakdown', 'Masters in Germany Cost in Indian Rupees: Full Breakdown'],
  ['/blog/how-to-study-in-germany-from-india-step-by-step-guide-2026', 'How to Study in Germany from India: Step-by-Step Guide'],
  ['/blog/masters-in-germany-without-ielts-updated-guide-for-2026', 'Masters in Germany Without IELTS: Complete Guide'],
  ['/blog/germany-student-visa-without-blocked-account-alternatives-2026', 'Germany Student Visa Without a Blocked Account: 4 Legal Alternatives'],
  ['/blog/aps-certificate-process-for-indian-students-complete-2025-guide', 'APS Certificate Process for Indian Students'],
]

// Real page text, captured from the rendered React pages by `npm run generate-shells`.
// Do not edit by hand: regenerate after changing a page's content.
// <generated-shells:start>
const GENERATED_SHELLS = {
  "/services": {
    "h1": "Complete Study in Germany Services for Indian Students",
    "body": "<p>End-to-end support from university selection to landing in Germany</p><p>Beyond application documents, our Dresden-based consultants also guide Indian students through the two most common blockers in a Germany application — the mandatory <strong>APS certificate</strong> (document verification for all Indian applicants) and setting up a <strong>blocked account</strong> (Sperrkonto) for the student visa. Ask us about either during your free consultation.</p><p>Not sure how to apply for a Masters in Germany from India, or what documents are required for a Masters in Germany application? Every service below maps to a real step in that process — see our <a href=\"/blog/masters-in-germany-for-indian-students-complete-guide-2026\">complete guide on how to apply for MS in Germany from India</a> for the full checklist, or our <a href=\"/blog/masters-in-germany-cost-in-indian-rupees-2026-full-breakdown\">Masters degree in Germany cost breakdown</a> to budget your application.</p><h2>University Shortlisting for Masters in Germany</h2><p>Selecting the right universities for your Masters application in Germany requires understanding your academic profile, program availability, German university ranking systems (QS, THE, CHE), and admission competitiveness. We shortlist 5–8 universities for each student across three tiers: ambitious targets, strong matches, and safe choices. Our shortlisting process accounts for your GPA, IELTS/TestDaF score, work experience, and target field of study — engineering, computer science, data science, management, or others. We also flag application deadlines and uni-assist requirements for each university, so you know exactly what to submit and when.</p><ul><li>Data-driven university selection</li><li>Deadline tracking</li><li>Admission probability analysis</li></ul><h2>SOP Writing for Germany Universities</h2><p>A Statement of Purpose for German university admission is very different from UK or US SOPs. German professors expect a research-focused, structured motivation letter that clearly explains your academic background, why you chose this specific program, and how it aligns with your career goals in Germany. Our team has written SOPs for students admitted to TU Munich, RWTH Aachen, TU Dresden, KIT, and 40+ other German universities. We tailor every SOP to the specific program and university — never a template.</p><ul><li>Personalized from scratch</li><li>University-specific customization</li><li>Unlimited revisions</li></ul><h2>LOR Writing Support for German University Applications</h2><p>Letters of Recommendation for German universities must come from professors or supervisors who know your academic or professional work. German admissions offices expect LORs to speak specifically to your analytical ability, research potential, and preparedness for postgraduate study in Germany. We help your recommenders draft LORs in the correct format, with the right level of detail — improving your overall application quality without misrepresenting your profile. Every letter is drafted to be specific, credible and consistent with your SOP and CV, so your recommender only needs to review, personalise and sign it.</p><ul><li>Written on behalf of your recommender</li><li>University-specific customization</li><li>Fast turnaround</li></ul><h2>CV / Resume Preparation for German Universities</h2><p>German universities prefer the Europass or a structured academic CV format that is very different from an Indian resume. The German academic CV includes a photo, lists education in reverse chronological order, and highlights thesis topics, publications, and internships relevant to your field. We reformat and rewrite your CV to match German academic standards — ensuring it complements your SOP and LOR. You also receive an editable file, so you can adapt it for each application, internship or job in Germany with the formatting kept consistent and clean.</p><ul><li>European CV standard (not Indian resume)</li><li>ATS-optimized &amp; university-ready</li><li>Highlights academic and professional strengths</li></ul><h2>APS Certificate Guidance for Indian Students</h2><p>The APS certificate (Akademische Prüfstelle) is mandatory for all Indian students applying for Masters or Bachelors programs in Germany. The process involves submitting your academic documents for verification and completing an interview arranged by the APS India centre. APS processing takes 6–8 weeks, so starting early matters. We provide a complete document checklist, sample interview questions and preparation support, and we review your documents before submission to avoid rejection and delays. Because every university application depends on it, we also help you plan the timeline so your APS is ready before your first deadline.</p><ul><li>Complete document checklist</li><li>Interview preparation and sample questions</li><li>Document review before submission</li></ul><h2>Blocked Account Setup Assistance</h2><p>Indian students need a German blocked account (Sperrkonto) to apply for a student visa. In 2026, the required deposit amount is €11,904 per year (€992 per month). We help you choose between Expatrio and Fintiba, complete the application process, and make sure you receive the confirmation letter in time for your visa appointment. We also advise on how to present your blocked account documents correctly at the embassy, and how to avoid the common mistakes that delay visa decisions, so your funding proof is accepted the first time.</p><p>Read our full guide on <a href=\"/blog/germany-student-visa-without-blocked-account-alternatives-2026\">Germany blocked account alternatives</a> if you have a scholarship or special circumstances.</p><ul><li>Expatrio vs Fintiba guidance</li><li>Confirmation letter in time for your visa slot</li><li>Embassy-ready document presentation</li></ul><h2>Germany Student Visa SOP (Letter of Motivation)</h2><p>The SOP for your Germany student visa is a separate document from your university SOP. It must address your financial self-sufficiency, your plan of study in Germany, your ties to your home country, and your intention to return after completing your degree. German embassies use this document as part of their assessment of your visa application — a weak visa SOP is one of the most common reasons for rejection. Our consultants, based in Dresden, Germany, know exactly what each embassy expects.</p><ul><li>Embassy-focused structure &amp; tone</li><li>Covers study plan and finances</li><li>Highlights your ties to India</li></ul><h2>Visa Cover Letter</h2><p>A mandatory document for the German student visa application. Our visa experts craft a personalized letter explaining your financial situation, study plan, and return intent — compliant with the specific requirements of the German embassy or consulate handling your case, so nothing in your file raises unnecessary questions at the visa interview. It works together with your visa SOP and blocked account documents, so your story is consistent across the whole file. We tailor each letter to your university, course, funding plan and the embassy you apply to, and revise it until it is ready to submit.</p><ul><li>Mandatory for student visa</li><li>Crafted by visa experts</li><li>Compliant with embassy requirements</li></ul><h2>Learn More</h2><ul><li><a href=\"/blog/masters-in-germany-without-ielts-updated-guide-for-2026\">Masters in Germany Without IELTS — Full Guide</a></li><li><a href=\"/blog/germany-student-visa-without-blocked-account-alternatives-2026\">Germany Student Visa Without Blocked Account — 4 Legal Alternatives</a></li><li><a href=\"/blog/masters-in-germany-for-indian-students-complete-guide-2026\">Masters in Germany for Indian Students — Complete Guide</a></li><li><a href=\"/blog/masters-in-germany-cost-in-indian-rupees-2026-full-breakdown\">Masters in Germany Cost in Indian Rupees — Full Breakdown</a></li><li><a href=\"/blog/daad-scholarship-for-masters-in-germany-indian-students-guide-2026\">DAAD Scholarship for Masters in Germany — Indian Students Guide</a></li><li><a href=\"/blog/best-consultancy-for-masters-in-germany-easyway-germany\">Best Consultancy for Masters in Germany — Why Students Choose EasyWay Germany</a></li></ul><h2>Frequently Asked Questions</h2><h3>Do I need an APS certificate for Masters in Germany?</h3><p>Yes. The APS (Akademische Prüfstelle) certificate is mandatory for all Indian students applying to German universities. EasyWay Germany guides you through the full APS process including document checklist and interview preparation.</p><h3>What is included in EasyWay Germany's SOP writing service?</h3><p>Our SOP writing service includes a profile review, a tailored motivation letter for each German university, unlimited revisions until you are satisfied, and formatting to match German university requirements.</p><h3>Which blocked account provider do you recommend for Indian students?</h3><p>We recommend Expatrio or Fintiba for Indian students applying for a Germany student visa. Both are recognised by all German embassies. Expatrio charges a one-time €49 fee and provides confirmation within 1–3 business days.</p>"
  },
  "/contact": {
    "h1": "Contact Us",
    "body": "<p>Book your free consultation and start your journey today</p><h2>Let's Talk About Your<br>Germany Dreams</h2><p>Our expert counselors are ready to help you every step of the way. Book a free 30-minute consultation.</p><h3>Book Consultation</h3><h2>What Happens After You Book</h2><p><strong>Send us your details.</strong> Fill in the form on this page or message us on WhatsApp. Tell us your field of interest and what you want to achieve.</p><p><strong>We reply within 24 hours.</strong> A member of our team contacts you and arranges your free 30-minute consultation.</p><p><strong>We review your profile.</strong> We look at your academic background, language scores, work experience and budget.</p><p><strong>You get a clear plan.</strong> You receive honest advice on suitable universities, the APS certificate, the blocked account and the student visa, plus the next step to take.</p><h2>What to Include in Your Message</h2><ul><li>Your Bachelor’s degree and your grades (GPA or percentage)</li><li>Your IELTS, TOEFL or German test scores, if you already have them</li><li>Your field of interest and the intake you are aiming for (winter or summer)</li><li>Your budget and how you plan to fund your living costs</li><li>Any questions about the APS certificate, the blocked account or the visa</li></ul><h2>Frequently Asked Questions</h2><h3>Is the consultation really free?</h3><p>Yes. Your first 30-minute consultation with EasyWay Germany is free.</p><h3>How quickly will you reply?</h3><p>We aim to reply to every message within 24 hours. For a faster answer, message us on WhatsApp at +49 152 3673 8625.</p><h3>Which students do you help?</h3><p>We mainly help students from India, Bangladesh and Nepal who want to study a Masters or Bachelors at a German university. Our team is based in Dresden, Germany.</p><h3>Can you help with the APS certificate and the visa?</h3><p>Yes. We guide you through the APS certificate, the blocked account, your visa SOP and the visa application.</p><p>Want to read more first? See our <a href=\"/services\">services</a>, the <a href=\"/study-in-germany\">complete guide to studying in Germany</a> and our <a href=\"/blog\">study in Germany blog</a>.</p>"
  },
  "/about": {
    "h1": "About EasyWay Germany",
    "body": "<p>Built by a student who made it — so you can too</p><h2>Not an Agency.<br>A Fellow Student Who Made It.</h2><ul><li>Started by a student, not a consultancy.</li><li>Expensive agencies, wrong info, template SOPs everywhere.</li><li>He just wanted to help the way no one helped him.</li><li>EasyWay Germany began in January 2023, from India.</li></ul><h2>A Small Team.<br>A Big Commitment.</h2><p>We're not a faceless consultancy. We're two people who genuinely care about getting you to Germany.</p><h3>Zainab Zamir</h3><ul><li>Moved to Dresden, Germany in October 2023</li><li>Nearly 3 years of on-ground experience in Germany</li><li>Helps students with SOPs, shortlisting &amp; visa docs</li></ul><h3>Sadiq Ali</h3><ul><li>Handles student onboarding &amp; document preparation</li><li>Your first point of contact when you reach out</li></ul><h2>From India to Germany —<br>And We're Still Here for You</h2><h3>The Idea Was Born</h3><p>While preparing his own application to study in Germany, our founder realized how confusing and expensive the process was — wrong information everywhere, agencies charging a fortune for basic help. He decided to do it differently.</p><h3>First Students Helped</h3><p>From his room in India, he started helping fellow students with SOPs, university shortlists, and LORs — for a fraction of what consultancies charged. Word spread fast. Students got admits. Trust grew.</p><h3>Landed in Germany</h3><p>He packed his bags and moved to Germany himself — not just to study, but to understand the system from the inside. Living here means we give real, updated, ground-level advice — not textbook guidance.</p><h3>Still Growing, Still Honest</h3><p>We're now a small but dedicated team operating from Germany and India. No false promises, no inflated numbers — just genuine help from people who've been in your exact shoes.</p><h2>What Makes Us Different</h2><h3>We've Been You</h3><p>Our founder went through the same process. We lived it, so our advice is real.</p><h3>No False Promises</h3><p>If your profile needs work, we tell you. Honest guidance over empty assurances.</p><h3>Fair Pricing</h3><p>Transparent and affordable. Quality help should not cost a fortune.</p><h3>Always Current</h3><p>Living in Germany keeps us updated on intake rules, visa changes, and more.</p><h2>\"Can I really get into a German university?\"</h2>"
  },
  "/study-in-germany": {
    "h1": "Study in Germany<br>Complete Guide 2026",
    "body": "<p>Everything you need to know — APS certificate, blocked account, student visa,<br>top universities &amp; cost of living — from consultants who live in Germany.</p><h2>Why Study in Germany in 2026?</h2><p>Germany offers a unique combination of world-class education, zero tuition fees, and a clear path to European residency — making it the top destination for Indian students.</p><h3>World-Class Universities</h3><p>Germany is home to 400+ public universities including TU Munich, RWTH Aachen, and Heidelberg — globally ranked and recognised by every employer worldwide.</p><h3>Zero Tuition Fees</h3><p>Public universities in Germany charge no tuition for international students — only a semester contribution of €100–€350, which often includes a public transport pass for the entire city.</p><h3>Work While You Study</h3><p>Students can work up to 120 full days per year (20 hrs/week during semester). Average student jobs pay €12–€15/hour — enough to cover most monthly expenses.</p><h3>18-Month Job-Seeker Visa</h3><p>After completing your degree, Germany allows you to stay 18 months to find a job. Most graduates receive EU Blue Cards and eventually permanent residency.</p><h3>Gateway to All of Europe</h3><p>Living in Germany means free movement across 26 Schengen countries. Travel, internships, and weekend trips across Europe become part of student life.</p><h3>Affordable Healthcare</h3><p>Germany's public health insurance costs students just €110–€130/month and covers virtually everything — doctor visits, hospital, prescriptions.</p><h2>Cost of Studying in Germany for Indian Students (2026)</h2><p>Germany is genuinely affordable compared to the UK, USA, or Australia. Your biggest cost is not tuition (€0 at public universities) — it's living expenses, which you can offset with part-time work.</p><p>Semester contribution only at public universities</p><p>Dormitory: €250–350 · Private: €500–700</p><p>Cooking at home keeps costs low</p><p>Often free with semester ticket; €49 Deutschlandticket</p><p>TK, DAK, AOK — mandatory for all students</p><p>Prepaid SIM from Aldi/Lidl or contracts</p><p>Can be offset by part-time work (€12–15/hr)</p><h2>How to Study in Germany: Complete Process</h2><p>From your first consultation to landing in Germany — here's the full 6-step process, with typical timelines and what to expect at each stage.</p><h3>Profile Evaluation</h3><p>We assess your GPA, backlogs, IELTS/TOEFL score, work experience, and preferred field to identify your realistic university options.</p><h3>APS Certificate</h3><p>Indian students must get their academic documents verified by APS India before applying to German universities. We guide you through every step.</p><h3>University Shortlisting &amp; Application</h3><p>We shortlist 8–12 universities matching your profile, write your SOP &amp; LOR, prepare your CV, and file complete applications via uni-assist or direct portals.</p><h3>Blocked Account (Sperrkonto)</h3><p>Open a blocked account with €11,904 (2026 requirement) via Fintiba, Expatrio, or Deutsche Bank. We help you choose the right provider and complete the process.</p><h3>Student Visa Application</h3><p>We prepare your complete visa file — Visa SOP, cover letter, and document checklist — and brief you for the VFS Global visa appointment.</p><h3>Fly to Germany</h3><p>Once your visa is approved, we guide you on pre-departure essentials — health insurance, accommodation, Anmeldung registration, and settling in.</p><h2>Everything You Need to Know</h2><p>Each step of the Germany study process has its own details and requirements. Explore each topic in depth.</p><h3>APS Certificate</h3><p>Mandatory document verification for all Indian students. We explain what it is, how to apply, what documents are needed, and how to prepare for the APS interview.</p><h3>Blocked Account (Sperrkonto)</h3><p>You need €11,904 in a German blocked account for your student visa. We compare providers (Fintiba vs Expatrio vs Deutsche Bank) and guide you through opening one from India.</p><h3>Student Visa</h3><p>Complete guide to the German student visa — document checklist, VFS appointment booking, interview preparation, processing times from India, Bangladesh &amp; Nepal.</p><h3>Top Universities</h3><p>TU Munich, RWTH Aachen, TU Berlin, KIT, Heidelberg — Germany's TU9 and beyond. We help you find the right university for your profile and field of study.</p><h3>SOP &amp; LOR Writing</h3><p>A strong Statement of Purpose and Letters of Recommendation can make or break your application. Our writers — all Germany-based — craft yours from scratch.</p><h3>Scholarships</h3><p>DAAD, Deutschlandstipendium, Erasmus Mundus and more. Germany has generous scholarship options for Indian, Bangladeshi and Nepali students.</p><h2>Germany's World-Renowned Universities</h2><p>Germany is home to 9 TU9 universities — the country's most prestigious technical institutions. Along with the Excellence Initiative universities, they rank among the best in the world for engineering, computer science, natural sciences, and business.</p><h2>Eligibility to Study in Germany</h2><p>Requirements differ between Master's and Bachelor's degrees. Here's a quick comparison.</p><h3>Master's (MS/M.Sc/MEng)</h3><h3>Bachelor's (B.Sc/B.Eng)</h3><h2>Frequently Asked Questions</h2><p>Answers to the questions Indian, Bangladeshi &amp; Nepali students ask most about studying in Germany.</p><h3>Can Indian students study in Germany without IELTS?</h3><p>Yes. Many universities accept TOEFL, Duolingo, or a medium-of-instruction letter from your previous university as proof of English proficiency. However, IELTS (6.0–6.5 band) is most widely accepted and gives you the broadest choice of programs.</p><h3>What is the minimum percentage required for Masters in Germany?</h3><p>Most German public universities require 60–65% (7.0 CGPA) in your bachelor's. Top universities like TU Munich and RWTH Aachen prefer 70–75%+. However, a strong SOP, relevant projects, and work experience can compensate for a slightly lower GPA at many universities.</p><h3>How many backlogs are acceptable for Germany university admission?</h3><p>Most universities accept up to 5–7 cleared backlogs. Backlogs must be cleared by the time you apply. A smaller number of backlogs and a strong overall profile (GPA, SOP, projects) significantly improves your chances.</p><h3>Is APS certificate mandatory? What if I already graduated?</h3><p>APS certificate is mandatory for all Indian students, regardless of when you graduated. It verifies the authenticity of your academic documents (10th, 12th, bachelor's degree and transcripts). You can apply for APS even after completing your degree.</p><h3>What is the blocked account amount required in 2026?</h3><p>The German government requires international students to show €11,904 in a blocked account (Sperrkonto) for 2026. This amount is updated annually (it was €11,208 in 2023 and has increased each year). You can withdraw approximately €992/month after arriving in Germany.</p><h3>How long does the Germany student visa take from India?</h3><p>Visa appointment waiting time at VFS Global can be 4–8 weeks. Processing after submission takes 6–12 weeks. Plan to start your visa process at least 4–5 months before your intended travel date to avoid missing the semester start.</p><h3>Can I work part-time while studying in Germany?</h3><p>Yes. International students can work up to 120 full days or 240 half-days per year. During semester breaks, you can work full-time. Average wages are €12–€15/hour. This can comfortably cover your monthly living expenses once you settle in.</p><h3>Does EasyWay Germany help students from Bangladesh and Nepal?</h3><p>Absolutely. We regularly assist students from India, Bangladesh, and Nepal. The core process (APS, blocked account, visa) is similar, but there are country-specific differences — particularly for the embassy process in Dhaka and Kathmandu, which we'll guide you through specifically.</p>"
  },
  "/blocked-account-germany": {
    "h1": "Blocked Account<br>Germany 2026",
    "body": "<p>Everything you need to open your Sperrkonto — the exact amount,<br>Fintiba vs Expatrio, step-by-step process from India &amp; TCS rules.</p><h2>What Is a Blocked Account and Why Is It Mandatory?</h2><p>A <strong>Sperrkonto</strong> (blocked account) is a special restricted bank account you must open before applying for a German student visa. The German embassy requires proof that you can financially support yourself for one full year without relying on illegal work.</p><p>You deposit €11,904 upfront — the money is \"blocked\" and cannot be accessed until you arrive in Germany.</p><p>After arrival, €992 is automatically released to your German bank account every month for 12 months.</p><p>It is mandatory for all non-EU international students applying for a German student visa — there is no alternative route.</p><p>Even scholarship recipients typically need one, unless their scholarship includes an embassy-accepted proof-of-funds letter.</p><p>Any remaining balance at the end of your study period is fully refunded to you when you close the account.</p><p>The €11,904 amount changes every year</p><p>The German government updates this amount annually based on BAföG (student support) calculations. For 2026 it is <strong>€11,904</strong>. If you opened a blocked account with last year's amount, you may need to top it up. Always verify the current amount before transferring.</p><h2>Exact Amounts for 2026</h2><p>Updated annually — always verify before you transfer</p><p>One-time deposit covering 12 months of living expenses. Must be in the account before your visa appointment.</p><p>Automatically released to your German bank account on the 1st of each month after you register in Germany.</p><p>At ~₹89/€ exchange rate. Exchange rates fluctuate — always check live rates when transferring.</p><p>Amount verified for 2026. Next update expected January 2027. Source: German government BAföG calculation.</p><h2>Fintiba vs Expatrio vs Coracle</h2><p>All three are accepted by German embassies. Here's an honest breakdown of what each actually costs and how long each actually takes — no affiliate bias.</p><h3>Fintiba</h3><p>Fastest &amp; most popular</p><h3>Expatrio</h3><p>Best value + insurance combo</p><h3>Coracle</h3><p>Digital-first alternative</p><h3>Our honest recommendation</h3><p><strong>Go with Fintiba if</strong> you want the fastest, simplest process and English support throughout. The €149 setup fee is worth it for the speed and reliability — especially with tight visa appointment windows. <strong>Choose Expatrio</strong> if you also need health insurance and want to bundle it for a lower combined cost. <strong>Consider Coracle</strong> as a newer digital-first alternative with a competitive €99 fee if the other two are over capacity or unavailable in your region.</p><h2>How to Open a Blocked Account from India</h2><p>The complete process — from choosing a provider to accessing your monthly €992 after you arrive in Germany.</p><h3>Choose Your Provider</h3><p>Decide between Fintiba, Expatrio, and Coracle (we recommend Fintiba for most students — fastest, fully in English). Expatrio and Coracle are solid alternatives depending on your budget.</p><h3>Register &amp; Submit Documents</h3><p>Create your account on the provider's website. Upload your passport, admission letter (or conditional acceptance), and fill in your personal details. No German bank account needed.</p><h3>Transfer €11,904 from India</h3><p>Send the required amount via SWIFT from your Indian bank account. TCS rules apply if total remittance exceeds ₹7 lakh/year — factor this into your timeline (claim it back via ITR).</p><h3>Receive Confirmation Letter</h3><p>Once your funds clear (3–7 business days), the provider sends a blocked account confirmation letter — the official document your embassy needs to issue the student visa.</p><h3>Include in Visa Application</h3><p>Submit the confirmation letter with your visa documents at VFS Global. This single document proves you have sufficient funds for one full year of living in Germany.</p><h3>Access Monthly After Arrival</h3><p>€992 is automatically released to your linked German bank account on the 1st of each month after you arrive. The account is yours — remaining balance is returned when you close it.</p><p>Start at least 3 weeks before your visa appointment</p><p>SWIFT transfers from India take 3–7 days. Processing takes 3–5 days. The confirmation letter takes 1–2 days. Adding buffer for any errors: <strong>3 weeks minimum</strong>, 4 weeks is safe. Do not leave this until the last week before your VFS appointment.</p><h2>Monthly Withdrawal Rules Explained</h2><p>Once you arrive in Germany and register your address (Anmeldung), you begin receiving your monthly releases. Here's exactly how it works.</p><p>Automatically on the 1st of each month after your arrival in Germany.</p><p>You must open a German bank account (N26, Deutsche Bank, Sparkasse) to receive the monthly releases.</p><p>If you don't use a month's release, it carries forward. You can access it the following month.</p><p>You cannot withdraw multiple months at once — the Sperrkonto is designed to release funds gradually.</p><p>When your studies end and you close the account, any remaining balance is refunded to you.</p><p>Fintiba and Expatrio confirmation letters are accepted by all German embassies including New Delhi, Mumbai, Chennai, Dhaka, and Kathmandu.</p><h2>TCS Rules When Sending Money to Germany</h2><p>Tax Collected at Source (TCS) applies to overseas remittances — here is exactly what it means for you</p><h3>Self-funded education abroad</h3><p>If you're sending your own money (not an education loan), TCS is <strong>5%</strong> on the amount above ₹7 lakh per financial year.</p><h3>Funded by education loan</h3><p>If the amount is sent from an education loan account, the TCS rate drops to <strong>0.5%</strong> regardless of the amount.</p><h3>TCS is refundable</h3><p>TCS is NOT a permanent tax. It is credited to your PAN. Claim it back when you or your parents file the Income Tax Return (ITR) for the year.</p><p>Tell your Indian bank it's for education abroad</p><p>At the time of remittance, declare the purpose code as \"S0305 – Studies Abroad\" and carry your admission letter. Some banks may ask for TCS proof of identity. This avoids delays in the transfer and ensures the correct (lower) TCS rate if applicable.</p><h2>Common Reasons Blocked Accounts Get Rejected</h2><p>Every mistake below adds 1–2 weeks to your timeline. Know them before you start.</p><p>The most common reason. Providers require a valid passport, admission letter (or conditional acceptance), and sometimes a bank statement from India. Any mismatch causes rejection.</p><p>Your name on the blocked account application must exactly match your passport. Even minor spelling differences (e.g., \"Mohammed\" vs \"Mohammad\") trigger a rejection.</p><p>Sending €11,800 instead of €11,904 — or the transfer arriving net of bank charges — means the account cannot be activated. Always send slightly more or confirm the net amount.</p><p>SWIFT transfers from Indian banks can take 3–7 business days. If you start too late before your visa appointment, the confirmation letter won't arrive in time.</p><p>One wrong character in the provider's IBAN or BIC/SWIFT code sends the money somewhere else. Always verify the exact transfer details from your account dashboard.</p><p>Some banks hold remittances exceeding ₹7 lakh for TCS verification. Inform your bank in advance and carry a purpose-of-remittance declaration for education.</p><p>Students guided through blocked account opening since 2023</p><h2>How EasyWay Germany Helps You Open Your Blocked Account</h2><p>We've guided 500+ students through the Sperrkonto process — from students who had documents rejected to those who had SWIFT transfers bounce. We know every failure mode and how to avoid it.</p><p>We tell you exactly which provider fits your timeline and budget — no generic advice, specific to your visa appointment date.</p><p>We check your passport, admission letter, and all submission documents before you upload — catching name mismatches and format errors that cause rejections.</p><p>We walk you through the SWIFT transfer setup step by step, including the correct IBAN, BIC, and purpose-of-remittance declaration for your Indian bank.</p><p>Message us at any point in the process. We respond within 2 hours on working days — including when providers ask for additional documents.</p><h2>Blocked Account Germany — FAQs</h2><p>Answers to the questions we get asked every day</p><h3>What is a blocked account (Sperrkonto) in Germany?</h3><p>A Sperrkonto is a special restricted bank account where you deposit the funds required by the German government as proof of financial support for your student visa. The money is \"blocked\" — you cannot freely access it all at once. Instead, €992 is released to you each month after you arrive in Germany. This system ensures international students have enough money to live on without working illegally.</p><h3>How much money is required in the blocked account in 2026?</h3><p>In 2026, you need to deposit €11,904 into your blocked account. This amount is set annually by the German government and represents approximately one year of living expenses (€992 × 12 months). It does not cover tuition (which is free at public universities) or the cost of flights.</p><h3>Which is better — Fintiba or Expatrio?</h3><p>For most Indian, Bangladeshi, and Nepali students, Fintiba is the better choice: it's fully English, faster to set up (3–5 days), and has the clearest process for international applicants. Expatrio is a good second option and is slightly cheaper on the basic plan — some students choose Expatrio if they also want to bundle health insurance. Coracle is a newer digital-first alternative with a competitive fee and English support, worth considering if Fintiba and Expatrio are unavailable or over capacity.</p><h3>Can I open a blocked account without a German bank account?</h3><p>Yes. Both Fintiba and Expatrio can be opened entirely from India — you only need a passport and an admission or conditional admission letter from a German university. You do not need a German bank account to open the Sperrkonto. However, you will need a German bank account after you arrive to receive your monthly €992 releases.</p><h3>How long does it take to open a blocked account?</h3><p>With Fintiba or Expatrio, the account setup itself takes 1–2 business days. After that, you need to transfer €11,904 via SWIFT from India, which takes 3–7 business days. Once the funds are received, the provider sends your confirmation letter within 1–2 business days. Total end-to-end time: typically 7–14 days. Start this process at least 3 weeks before your visa appointment to be safe.</p><h3>Can a sponsor letter replace a blocked account?</h3><p>It depends on the German embassy and your specific situation. Some embassies accept a sponsor letter (Verpflichtungserklärung) from a German resident who commits to covering your expenses. However, this is less reliable and many embassies now specifically require a blocked account. For most Indian, Bangladeshi, and Nepali students, a blocked account is the safest and most accepted route.</p><h3>Is TCS applicable when I send money to Germany for the blocked account?</h3><p>Yes, TCS (Tax Collected at Source) applies to overseas remittances above ₹7 lakh per financial year. For educational remittances financed by an education loan, the TCS rate is 0.5%. For self-financed education abroad, the TCS rate is 5% on the amount exceeding ₹7 lakh. At €11,904 ≈ ₹10.6 lakh, you would pay TCS on roughly ₹3.6 lakh at 5% = ~₹18,000. This is refundable when you file your ITR — it is not a permanent cost.</p><h3>What happens to the blocked account money after I arrive in Germany?</h3><p>€992 is automatically released to your linked German bank account on the 1st of each month after you register your address (Anmeldung) and provide your arrival proof. You continue receiving monthly releases for 12 months. If you have money remaining after 12 months (for example, because you worked part-time and didn't need all of it), you can access the remaining balance freely.</p><h2>Related Guides</h2>"
  },
  "/pricing": {
    "h1": "Admission Packages",
    "body": "<p>Choose the perfect package for your Germany journey. All plans include personalized support and guaranteed quality.</p><h2>Basic</h2><p>For students who need core application support</p><ul><li>University Shortlisting (5 universities)</li><li>SOP Writing Assistance</li><li>1 LOR Preparation</li><li>CV / Resume Editing</li><li>Application Filling Assistance</li></ul><h2>Standard</h2><p>Complete admission package with visa support</p><ul><li>Everything in Basic</li><li>University Shortlisting (10 universities)</li><li>2 LOR Preparations</li><li>Application Filling Assistance</li><li>Visa Documentation Guide</li><li>Blocked Account Assistance</li></ul><h2>Premium</h2><p>End-to-end support with post-admission services</p><ul><li>Everything in Standard</li><li>Unlimited University Applications</li><li>3 LOR Preparations</li><li>Education Loan Guidance</li><li>Pre-Departure Briefing</li><li>Accommodation Assistance</li></ul><h2>Detailed Service Breakdown</h2><p>Category | Service | Basic | Standard | Premium</p><p>Application Services | University Shortlisting | 5 universities | 10 universities | Unlimited</p><p>SOP Writing | Included | Included | Included</p><p>LOR Preparation | 1 LOR | 2 LORs | 3 LORs</p><p>CV / Resume Editing | Included | Included | Included</p><p>Application Form Review | Included | Included | Included</p><p>Application Filling Assistance | Included | Included | Included</p><p>Visa &amp; Financial | Visa SOP | Not included | Included | Included</p><p>Visa Cover Letter | Not included | Included | Included</p><p>Education Loan Guidance | Not included | Not included | Included</p><p>Blocked Account Assistance | Not included | Included | Included</p><p>Post-Admission | Pre-Departure Briefing | Not included | Not included | Included</p><p>Accommodation Assistance | Not included | Not included | Included</p><p>Packing Guidance | Not included | Not included | Included</p><p>German Bank Account Opening | Not included | Not included | Included</p><h3>Need Germany Student Visa Help?</h3><p>Visa SOP, blocked account, APS, VFS appointment &amp; mock interview — ₹7,999 one-time</p><h2>Common Questions About Studying in Germany</h2><p>Everything Indian students ask before starting their Germany application.</p><h3>What is included in the Basic admission package for Germany?</h3><p>The Basic plan (₹19,999) includes shortlisting 5 German universities suited to your profile, SOP writing assistance, 1 LOR preparation, CV/resume editing, and application filling support. It is ideal for students who have a clear idea of their target universities and need core documentation help.</p><h3>How long does the Germany university application process take?</h3><p>The entire process typically takes 3–6 months. Most German universities have application deadlines in January (for summer semester) and July (for winter semester). We recommend starting at least 4–5 months before your target intake to allow time for SOP drafts, APS certification, and document preparation.</p><h3>Is Germany admission really free for Indian students?</h3><p>Public German universities charge little to no tuition fees — typically €0–€500 per semester. However, you still pay semester contribution fees (€100–€350, which often includes public transport), plus living costs of around €800–€1,100/month. Our packages help you get into the best-fit university while managing these costs.</p><h3>What IELTS or GRE score do I need to study in Germany?</h3><p>Most English-taught Master's programs require IELTS 6.5–7.5 (or TOEFL 90–110). GRE is not required by most German universities, though some technical programs at TU Munich and RWTH Aachen may prefer it. German-taught programs require B2/C1 level (TestDaF or DSH). We shortlist universities that match your current test scores.</p><h3>Can I upgrade from Basic to Standard or Premium later?</h3><p>Yes — you can upgrade at any point before applications are submitted. You simply pay the difference between plans. We maintain all your documents, profile notes, and university shortlist so the upgrade is seamless with no duplication of effort.</p><h3>What is an SOP and why is it so important for Germany?</h3><p>SOP stands for Statement of Purpose — a 800–1000 word essay explaining why you want to study a specific program, how it connects to your academic background, and your career goals. German universities take SOPs very seriously, especially for competitive programs. A weak SOP can get you rejected even with a strong GPA. Our team writes SOPs tailored to each specific university and program you apply to.</p><h3>Do I need APS certification for German universities?</h3><p>Yes. APS (Akademische Prüfstelle) certification is mandatory for Indian students applying to German universities. APS verifies your academic documents and issues a certificate that universities and the German embassy require. The process takes 4–8 weeks and costs €75. We guide you through what to submit and when to apply.</p><h3>What is the payment structure — can I pay in installments?</h3><p>All our plans support installment payments split into 2 monthly payments. Basic: ₹11,000 × 2, Standard: ₹17,500 × 2, Premium: ₹22,500 × 2. The first installment is due when you sign up; the second is due after your university applications are submitted. Contact us on WhatsApp to get started.</p><p>Still have questions? Ask us directly on WhatsApp.</p>"
  },
  "/visa-package": {
    "h1": "Germany Student Visa Package",
    "body": "<p>End-to-end support for your German student visa application — from Visa SOP to VFS appointment booking.</p><h2>Visa Support Package</h2><p>Complete support for your student visa application</p><ul><li>Visa-Specific SOP (different from University SOP)</li><li>Document Checklist &amp; Verification</li><li>Blocked Account Guidance (€11,904 proof)</li><li>Health Insurance Setup</li><li>VFS Appointment Booking</li><li>Mock Visa Interview</li></ul><h3>University SOP vs Visa SOP</h3><p>Feature | University SOP | Visa SOP</p><p>Focus | Academic goals | Return intent</p><p>Length | 800–1000 words | 500 words max</p><p>Tone | Academic / research | Embassy-formal</p><h2>How the Visa Process Works</h2><p>A typical German student visa takes 4–5 months from start to finish. Here's what to expect.</p><h2>Germany Student Visa Questions</h2><p>Everything Indian students ask about the German student visa process.</p><h3>What documents do I need for a German student visa from India?</h3><p>You need: valid passport, university admission letter (Zulassungsbescheid), blocked account proof (€11,904), APS certificate, health insurance, Visa SOP, cover letter, biometric photos, and proof of accommodation. We help you prepare and verify all of these.</p><h3>What is a blocked account (Sperrkonto) and how much do I need?</h3><p>A blocked account is a special German bank account that holds your living expenses (€11,904 for 2026) as proof of financial support for your visa. The money is released monthly (€992/month) once you arrive in Germany. We guide you through opening it with providers like Expatrio or Fintiba.</p><h3>What is the difference between a University SOP and a Visa SOP?</h3><p>A University SOP (800–1000 words) focuses on your academic goals, research interests, and career ambitions. A Visa SOP (max 500 words) is written for the German embassy — it emphasises your study plan, financial situation, and clear intent to return to India after graduation. They are two completely different documents.</p><h3>How long does it take to get a German student visa from India?</h3><p>The German student visa typically takes 6–12 weeks after your VFS appointment. Appointment availability varies by city — Mumbai, Delhi, Chennai, and Hyderabad VFS offices can have waiting times of 4–8 weeks. We recommend starting the visa process at least 4–5 months before your course begins.</p><h3>Do I need APS certification for Germany?</h3><p>Yes. Indian students applying to German universities must get their academic documents verified by APS (Akademische Prüfstelle) in New Delhi. This is mandatory for your student visa application. APS processing takes 4–8 weeks and costs €75. We advise you to start APS early in parallel with your university applications.</p><h3>What is a mock visa interview and why do I need it?</h3><p>German embassy officers may ask questions about your study plan, financial situation, choice of university, and return intent. A mock interview prepares you to answer confidently, avoid common mistakes, and understand what the embassy is looking for. Many visa rejections happen because students are unprepared for these questions.</p><h3>Can I work while on a German student visa?</h3><p>Yes — Indian students can work up to 140 full days (or 280 half-days) per year, which is roughly 20 hours/week during the semester. Mandatory internships listed in your degree curriculum are exempt from this limit. You can work full-time during semester breaks within the annual limit.</p><h3>What health insurance do I need for a German student visa?</h3><p>You need travel health insurance covering Germany for the duration of your visa application. Once in Germany, you must enrol in public statutory health insurance (GKV) — the most common options are TK, AOK, and Barmer. We guide you through selecting the right insurance before your VFS appointment.</p><p>Still have questions? Ask us directly on WhatsApp.</p>"
  },
  "/services/sop-writing": {
    "h1": "Professional SOP Writing Service",
    "body": "<p>A Statement of Purpose written by students who got into German universities — not by agencies using templates.</p><h2>Everything in One SOP</h2><p>Delivered in <strong>3–5 working days</strong> &nbsp;·&nbsp;Unlimited Revisions</p><ul><li>Personalized one-on-one consultation</li><li>Unique SOP tailored for each university</li><li>Gap &amp; low-grade explanations if needed</li><li>Compliant with German university requirements</li><li>Flawless formatting &amp; structure</li><li>Plagiarism report on request</li></ul><h2>How It Works</h2><h3>Consultation</h3><p>We start with a one-on-one call to understand your background, goals, and target universities.</p><h3>First Draft</h3><p>Our expert writes a compelling, plagiarism-free SOP tailored to your unique story within 3–5 days.</p><h3>Revisions &amp; Delivery</h3><p>Review the draft, request unlimited changes, and receive your final SOP ready to submit.</p><h2>Students We've Helped Get Into</h2><p>Our SOPs have helped students secure admissions at Germany's most competitive universities.</p><p>TU München</p><p>Munich</p><p>RWTH Aachen</p><p>Aachen</p><p>TU Berlin</p><p>Berlin</p><p>LMU Munich</p><p>Munich</p><p>Heidelberg Uni</p><p>Heidelberg</p><p>KIT</p><p>Karlsruhe</p><p>TU Darmstadt</p><p>Darmstadt</p><p>Uni Stuttgart</p><p>Stuttgart</p><p>Uni Hamburg</p><p>Hamburg</p><p>FAU Erlangen</p><p>Erlangen</p><h2>Why Choose Us?</h2><h3>Student-Led Experts</h3><p>Written by students who succeeded in German admissions — real, practical guidance, not generic advice.</p><h3>Unlimited Edits</h3><p>No hidden charges for revisions. We iterate until you are 100% satisfied with every word.</p><h3>Confidential &amp; Unique</h3><p>Your data is 100% private. Every SOP is written from scratch — zero plagiarism, zero templates.</p><h2>Frequently Asked Questions</h2><h3>How do I start my SOP order?</h3><p>Click the WhatsApp button and message us. We'll share a short questionnaire and kick things off within 24 hours.</p><h3>Can I request changes after the first draft?</h3><p>Yes! We offer unlimited revisions at no extra cost until you are completely satisfied.</p><h3>How long does the SOP writing process take?</h3><p>Generally 3–5 working days after we receive your details. Need it sooner? Let us know — we'll do our best.</p><h3>What information do you need from me?</h3><p>We'll ask about your academic background, work experience, career goals, target universities, and any achievements that set you apart.</p><h3>Is my information kept confidential?</h3><p>Absolutely. We never share your documents or personal story with anyone. Your trust is our highest priority.</p>"
  },
  "/services/lor-writing": {
    "h1": "Professional LOR Writing Service",
    "body": "<p>Expertly crafted Letters of Recommendation that showcase your strengths — tailored for German universities and visa applications, fast and confidential.</p><h2>Everything in One LOR</h2><p>Delivered in <strong>2–3 working days</strong>&nbsp;·&nbsp;Unlimited Revisions</p><ul><li>Customized LORs for professors, supervisors, or employers</li><li>One-on-one consultation to capture your unique achievements</li><li>Highlights skills, projects &amp; qualities relevant to your program</li><li>Suitable for university, visa, or job applications</li><li>Unlimited free edits and formatting for institution guidelines</li><li>Confidential — never reused or shared</li></ul><h2>We Write It. They Sign It.</h2><p>We work with all types of recommenders. Just tell us who is writing your LOR and we will craft a letter that matches their voice and authority.</p><p><strong>Did you know?</strong> Most applicants ask us to ghost-write the LOR for their recommender. It saves the recommender's time, and the letter ends up being stronger because it's crafted specifically for the target program.</p><p>Professor</p><p>From your undergraduate or postgraduate studies</p><p>Thesis Advisor</p><p>Research supervisor or guide</p><p>Employer / Manager</p><p>From a full-time or part-time job</p><p>Internship Mentor</p><p>Technical or corporate internship supervisor</p><p>Company Head / HOD</p><p>Department head or senior authority</p><p>Any Other Authority</p><p>Academic, corporate, or research — we adapt</p><h2>How It Works</h2><h3>Share the Details</h3><p>Tell us about your achievements, relationship with the recommender, and the universities you are applying to.</p><h3>We Write the Draft</h3><p>Our team crafts a compelling, tailored LOR in 2–3 working days — unique every time, never templated.</p><h3>Review &amp; Finalise</h3><p>Request unlimited changes until the LOR perfectly captures your recommender's voice and your strengths.</p><h2>Why Choose Our LOR Service?</h2><h3>Academic &amp; Industry Focused</h3><p>Our LORs meet the standards of both university admissions and professional programs — no one-size-fits-all drafts.</p><h3>Unlimited Edits</h3><p>We refine your LOR until you are 100% satisfied. No extra charges, no revision limits.</p><h3>Strictly Confidential</h3><p>Every LOR is written from scratch and never reused or shared. Your information stays private, always.</p><h2>Frequently Asked Questions</h2><h3>Who should I get my LORs from?</h3><p>Ideally from professors, thesis advisors, or employers who know your academic or professional strengths well. Most German universities ask for 1–2 LORs.</p><h3>What information do you need to write my LOR?</h3><p>We'll ask about your achievements, projects, relevant experiences, your relationship with the recommender, and the programs you're applying to.</p><h3>Can you write LORs for both university and visa applications?</h3><p>Yes! We tailor LORs for university admissions as well as German student visa requirements — just let us know which one you need.</p><h3>How long will it take to get my LOR draft?</h3><p>Usually 2–3 working days. If you have an urgent deadline, let us know and we will do our best to deliver sooner.</p><h3>Can I ask for changes after the first draft?</h3><p>Absolutely — edits are unlimited and free until you are completely happy with the final letter.</p><h3>Is my LOR unique and confidential?</h3><p>100%. Every LOR is written from scratch, personalised to your recommender and your story, and never shared or reused for anyone else.</p>"
  },
  "/services/cv-preparation": {
    "h1": "Professional CV Preparation Service",
    "body": "<p>Impress German universities and employers with a clear, impactful CV — ATS-friendly, Europass-compliant, and tailored to your profile.</p><p>Sample Europass CV layout · Your final CV will be personalised</p><h2>Everything in One CV</h2><p>Delivered in <strong>1–2 working days</strong>&nbsp;·&nbsp;Unlimited Edits</p><ul><li>Formatted to European (Europass) or university-specific standards</li><li>ATS-friendly and visually clean layout</li><li>Academic achievements, skills, experience &amp; projects highlighted</li><li>Personalised review and editing session with our team</li><li>Dos &amp; don'ts tips for maximum impact</li><li>Editable source file + PDF delivery</li></ul><h2>European CV is the Standard in Germany</h2><p>German universities and employers expect a <strong>Europass CV</strong> — the pan-European format recognised across all EU countries. Submitting an Indian-style resume or a US-format CV can create a poor first impression and even lead to rejection. Our team ensures your CV strictly follows Europass guidelines, with the right structure, language, and layout that German admission committees and HR teams expect.</p><h2>What Goes Into Your CV</h2><p>A strong German application CV covers six key areas. We make sure every section is clear, complete, and impactful.</p><p>Education</p><p>Degrees, institutions, grades, years</p><p>Work Experience</p><p>Jobs, internships, part-time roles</p><p>Skills &amp; Tools</p><p>Technical skills, software, frameworks</p><p>Languages</p><p>English, German, mother tongue + levels</p><p>Projects</p><p>Academic and personal projects</p><p>Certifications</p><p>Courses, MOOCs, achievements</p><h2>What We Need From You</h2><p>No complicated forms. Share these details and we will handle the rest.</p><p>Academic Background</p><p>Degrees, institutions, years, GPA/percentage</p><p>Work / Internship Details</p><p>Role, company, duration, responsibilities</p><p>Skills &amp; Tools</p><p>Programming, software, soft skills</p><p>Language Levels</p><p>IELTS/TOEFL score, German level if any</p><p>Projects &amp; Achievements</p><p>Thesis, publications, awards, certifications</p><p>Photo (Optional)</p><p>Professional headshot — some universities require it</p><h2>Why Choose Our CV Service?</h2><h3>Admissions &amp; Job Ready</h3><p>Format, language, and structure optimised for German university admissions and job platforms.</p><h3>Unlimited Edits</h3><p>We update your CV until you are completely satisfied — no hidden costs, no revision limits.</p><h3>Personal Touch</h3><p>Prepared by students currently in Germany who know exactly what universities and employers look for.</p><h2>Frequently Asked Questions</h2><h3>What information do I need to provide?</h3><p>We'll need your academic background, work and internship experiences, skills, projects, certifications, and a recent photo if required by your university.</p><h3>Do you use Europass format only?</h3><p>Europass is the standard in Europe and preferred by German universities, but we also offer other academic CV styles on request — just let us know your preference.</p><h3>How long will it take to get my CV?</h3><p>Usually within 1–2 working days after you provide all your details.</p><h3>Can I request changes after the first draft?</h3><p>Absolutely! Edits are unlimited and free until you are satisfied.</p><h3>Will my CV be ATS-friendly and accepted by universities?</h3><p>Yes — we optimise your CV for both online application systems (ATS) and German university guidelines.</p><h3>Can you help with cover letters too?</h3><p>Definitely! Mention it during your CV order and we will guide you, or check our other document services.</p>"
  },
  "/services/university-shortlisting": {
    "h1": "Expert University Shortlisting Service",
    "body": "<p>Get a personalized list of best-fit German universities for your profile — data-driven recommendations with all the application details you need.</p><h2>Everything in One Report</h2><p>Delivered in <strong>2–3 working days</strong>&nbsp;·&nbsp;One-on-One Consultation</p><ul><li>Profile analysis — academics, work experience &amp; transcripts</li><li>Personalized list of 7–10 universities with high admission chances</li><li>One-on-one call to clarify your goals and preferences</li><li>Detailed report with intakes, documents, and course links</li><li>Ongoing support for follow-up questions about listed universities</li></ul><h2>We Only Shortlist Public Universities</h2><p>Every university on your list is a <strong>tuition-free public university</strong> in Germany — no private colleges, no hidden fees. More importantly, we only include universities where your profile gives you a <strong>genuine, high chance of admission</strong>. We'd rather give you a focused list of 7 real options than 20 unrealistic ones.</p><h2>A List Built to Get You In</h2><p>Applying only to top-tier universities risks rejection. Applying only to safe ones means missing better opportunities. We create a balanced portfolio across three tiers.</p><p>Top-ranked universities where your profile meets the minimum criteria. Highly competitive — but worth trying.</p><p>Universities where your profile aligns well with historical admission trends. Your strongest bets.</p><p>Excellent universities where your profile significantly exceeds the average. High confidence of getting in.</p><h2>Your Shortlist Report Includes</h2><p>Here's a glimpse of what your personalised report looks like. Every row is filled with verified, up-to-date data.</p><p>University | Course | Summer Intake | Winter Intake | Language | Procedure | Key Documents | Remarks</p><p>RWTH Aachen | MSc Computer Science | Apr – Jul | Oct – Jan | IELTS 6.5 / B2 | Uni-Assist | CV, SOP, LOR, Transcript | Highly competitive</p><p>TU Munich | MSc Data Engineering | — | Oct – Mar | IELTS 6.5 | Direct | CV, SOP, LOR, Degree | English-taught</p><p>TU Berlin | MSc Electrical Eng. | Apr – Jun | Oct – Dec | IELTS 6.0 / B1 | Uni-Assist | CV, SOP, Transcript | Good acceptance rate</p><p>* Sample data for illustration only. Your actual report will have course links, official deadlines, and personalised remarks.</p><h2>What We Need From You</h2><p>No lengthy forms. Just share these 6 things and we'll take it from there.</p><p>Academic Transcripts</p><p>All semesters, grade sheet or marksheet</p><p>Language Test Score</p><p>IELTS / TOEFL / Duolingo result</p><p>Work Experience (if any)</p><p>Internships, part-time, or full-time roles</p><p>Updated CV / Resume</p><p>Current version, even a rough draft is fine</p><p>Target Field of Study</p><p>E.g. Computer Science, Mechanical, Finance</p><p>Preferences</p><p>Budget, city, intake, language of instruction</p><h2>Why Choose Us?</h2><h3>Genuine Profiling</h3><p>We don't just match scores — we look at your story and ambitions to find the best real fit.</p><h3>Data-Driven</h3><p>Our lists are based on the latest admission stats and intake trends — no guesswork, just results.</p><h3>Post-Report Support</h3><p>We stay connected for your follow-up questions — beyond just handing over the list.</p><h2>Frequently Asked Questions</h2><h3>What details do you need from me to begin?</h3><p>We'll ask for your academic transcripts, work experience, resume/CV, language test results (IELTS, TOEFL, etc.), and your target subject area. A short call helps us understand your priorities — location, deadlines, and budget.</p><h3>How many universities will you shortlist for me?</h3><p>Typically 7–10 universities best suited to your profile. If you want a larger or more focused list, just let us know.</p><h3>Will I get all application details for each university?</h3><p>Yes! Your report includes university names, courses, both intake windows, language requirements, application procedure, required documents, official course links, and our remarks.</p><h3>What if I have questions after I receive my list?</h3><p>We offer post-report support for all your queries about the universities on your list — by WhatsApp, email, or call.</p><h3>Is this list guaranteed to get me admission?</h3><p>We only suggest universities where you stand a genuine chance based on your profile. The final decision always lies with the university, but our goal is to maximise your chances and save your time, money, and effort.</p><h3>How long will it take to receive my report?</h3><p>You'll receive your shortlist within 2–3 working days of providing all required information.</p>"
  },
  "/services/visa-sop": {
    "h1": "Visa SOP Writing Service",
    "body": "<p>A Statement of Purpose crafted specifically for the German embassy — clear, convincing, and visa-ready.</p><h2>Embassy-Ready Visa SOP</h2><p>Delivered in <strong>2–3 working days</strong> &nbsp;·&nbsp;Unlimited Revisions</p><ul><li>Addressed directly to the German embassy/consulate</li><li>Covers your study plan and chosen program</li><li>Explains your financial situation clearly</li><li>Highlights your ties to India and return intent</li><li>Proper formal tone and embassy-standard structure</li><li>Tailored to your specific university and intake</li></ul><h2>Visa SOP vs University SOP</h2><h3>Visa SOP (This Service)</h3><ul><li>Addressed to the German Embassy</li><li>Focuses on study plan &amp; finances</li><li>Explains intent to return to India</li><li>Formal, concise embassy style</li><li>Required for student visa application</li></ul><h3>University SOP (Separate Service)</h3><ul><li>Addressed to the university / department</li><li>Focuses on academic &amp; research interest</li><li>Highlights your career goals</li><li>Persuasive, storytelling format</li><li>Required for university admission</li></ul><h2>How It Works</h2><h3>Share Your Profile</h3><p>Tell us about your program, university, financial situation, and ties to your home country.</p><h3>We Write Your Visa SOP</h3><p>Our experts draft a visa SOP tailored for the German embassy — covering your study plan, finances, and return intent.</p><h3>Review &amp; Deliver</h3><p>You review, request changes, and receive your final embassy-ready Visa SOP within 2–3 working days.</p><h2>Why Choose Us?</h2><h3>Embassy-Focused Writing</h3><p>We know exactly what German visa officers look for — a convincing study plan and clear return intent.</p><h3>Unlimited Revisions</h3><p>We iterate until your Visa SOP is perfect — no extra charges for revision rounds.</p><h3>100% Confidential</h3><p>Your personal and financial information is handled with complete privacy and never shared.</p><h2>Frequently Asked Questions</h2><h3>What is a Visa SOP and why do I need one?</h3><p>A Visa SOP (Statement of Purpose for Visa) is a letter addressed to the German embassy explaining why you want to study in Germany, your chosen program and university, your financial situation, and your intention to return to India after graduation. It is a required document for the German student visa.</p><h3>Is a Visa SOP different from a university SOP?</h3><p>Yes. A university SOP focuses on your academic background, research interests, and career goals for the university admission committee. A Visa SOP is addressed to the German embassy and focuses on your study plan, financial proof, and ties to India — it has a completely different tone and structure.</p><h3>How long does the Visa SOP process take?</h3><p>Generally 2–3 working days after you share your profile details. If you need it urgently, contact us on WhatsApp and we will do our best.</p><h3>What information do I need to provide?</h3><p>We'll ask for your program and university name, financial documents summary, blocked account status, start date of studies, and any specific instructions from the embassy or consulate you are applying at.</p><h3>Does a good Visa SOP guarantee a visa?</h3><p>While no document guarantees a visa, a well-written Visa SOP significantly strengthens your application by clearly communicating your intentions. Combined with complete documentation, it greatly improves your chances.</p>"
  },
  "/services/visa-cover-letter": {
    "h1": "Visa Cover Letter Writing Service",
    "body": "<p>Embassy-compliant cover letters for your German student visa, job applications, internships, and working student positions — all in one place.</p><h2>Everything in One Letter</h2><p>Delivered in <strong>2–3 working days</strong>&nbsp;·&nbsp;Unlimited Edits</p><ul><li>Embassy-compliant, clear, and concise letter</li><li>Highlights motivation, program choice, and financial proof</li><li>Personalized draft based on your academic and personal profile</li><li>Addresses common concerns — gaps, funding, return intent</li><li>Works for visa, jobs, internships &amp; working student roles</li><li>Unlimited edits until you are completely satisfied</li></ul><h2>We Write Cover Letters for Everything in Germany</h2><p>A cover letter is mandatory — not just for your visa, but also for every job, internship, and working student application in Germany. German employers take it seriously. We cover all of them.</p><p><strong>Did you know?</strong> In Germany, sending a job application without a cover letter (<em>Anschreiben</em>) is considered unprofessional and is often rejected outright — even for student part-time roles and internships.</p><p>Student Visa Cover Letter</p><p>For German consulate / embassy</p><p>Addresses study plan, financial proof, and intent to return — exactly what the visa officer needs.</p><p>Working Student (Werkstudent)</p><p>For part-time jobs while studying</p><p>Tailored cover letter for working student positions — highlights your skills alongside your study schedule.</p><p>Full-Time Job Application</p><p>For jobs after graduation in Germany</p><p>Professional cover letter for full-time roles — structured for German HR standards and Bewerbung format.</p><p>Internship / Praktikum</p><p>For internships during your studies</p><p>Focused cover letter for internship applications — shows motivation and relevant academic background.</p><h2>Sample Visa Cover Letter Structure</h2><p>Here is exactly what a well-structured German visa cover letter looks like. Every section we write covers all of these points.</p><p>Section | What to Include</p><p>Header | Your name, address, contact details, date, and embassy/employer address</p><p>Introduction | Purpose of the letter — visa application, program name, or job title</p><p>Academic Background | Summary of your education and relevant achievements</p><p>Motivation | Why this course/job, why Germany, why this university/company</p><p>Financial Proof | Blocked account, scholarship, or sponsorship details (for visa letters)</p><p>Supporting Documents | List of attached documents — admission letter, transcripts, APS, proof of funds</p><p>Closing | Polite closing statement and signature</p><h2>German Student Visa Checklist</h2><p>Make sure you have all these documents before your visa appointment.</p><ul><li>Valid passport and completed visa application form</li><li>Letter of admission from a German university</li><li>Visa SOP and Cover Letter (well-formatted and concise)</li><li>Proof of funds — blocked account, scholarship, or sponsorship</li><li>Academic certificates and transcripts</li><li>Proof of language proficiency (IELTS / TOEFL / German)</li><li>Health insurance</li><li>APS certificate (mandatory for Indian students)</li><li>CV / Resume</li><li>Other documents required by your consulate</li></ul><h2>Why Choose Our Cover Letter Service?</h2><h3>Perfect Structure</h3><p>All embassy and employer requirements covered — nothing missed, nothing generic.</p><h3>Personal Touch</h3><p>Written by students who have successfully cleared the German visa process and landed jobs here.</p><h3>Unlimited Revisions</h3><p>We keep editing until you're completely satisfied — at no extra cost.</p><h2>Frequently Asked Questions</h2><h3>Is a cover letter mandatory for a German student visa?</h3><p>Yes, most German consulates require a cover letter summarising your study plan, financial situation, and intent to return to your home country.</p><h3>What makes a good visa cover letter?</h3><p>A good visa cover letter is concise, factual, well-formatted, and directly addresses the visa officer's requirements — no vague statements.</p><h3>Can I get help for both SOP and Cover Letter together?</h3><p>Absolutely! We offer combined packages and coordinate the content for both, ensuring they are consistent and compliant.</p><h3>How quickly can I get my cover letter?</h3><p>Usually in 2–3 working days. If you have an urgent visa appointment, just mention your date and we will prioritise.</p><h3>What details do I need to provide?</h3><p>We will ask about your academic history, course details, financial proof, and any other documents required by the embassy or employer.</p>"
  }
}
// <generated-shells:end>

const aLink = (href, text) => `<a href="${href}">${text}</a>`
const ulist = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
const section = (h2, html) => `<h2>${h2}</h2>${html}`
const CTA_LINKS = `<p>${aLink('/contact', 'Book a free consultation')} | ${aLink('/services', 'View all services')} | ${aLink('/study-in-germany', 'Study in Germany guide')}</p>`

function pageShell(h1, bodyHtml) {
  const nav = NAV_LINKS.map(([h, t]) => aLink(h, t)).join(' | ')
  return (
    '<article id="ssr-article" style="max-width:56rem;margin:0 auto;padding:1.5rem 1rem;' +
    'font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.65;color:#111827">' +
    `<nav aria-label="Main">${nav}</nav>` +
    `<h1>${h1}</h1>` +
    bodyHtml +
    `<p>${aLink('/privacy-policy', 'Privacy Policy')} | ${aLink('/terms-conditions', 'Terms &amp; Conditions')} | ${aLink('/refund-policy', 'Refund Policy')}</p>` +
    '</article>'
  )
}

// Fail-soft list fetch (a Supabase hiccup just means a shorter shell, never a broken page).
async function fetchRows(path) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      signal: AbortSignal.timeout(2500),
    })
    if (!res.ok) return []
    const rows = await res.json()
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

const blogLinks = (rows) => rows.map((b) => `<li>${aLink(`/blog/${b.slug}`, escapeHtml(b.title))}</li>`).join('')
const productLinks = (rows) =>
  rows
    .map((p) => `<li>${aLink(`/products/${p.slug}`, escapeHtml(p.title))}${p.short_description ? ` – ${escapeHtml(p.short_description)}` : ''}</li>`)
    .join('')

async function buildStaticShell(path) {
  const snap = GENERATED_SHELLS[path]
  if (snap) return pageShell(snap.h1, snap.body)

  switch (path) {
    case '/': {
      const [blogs, products] = await Promise.all([
        fetchRows('blogs?select=title,slug&is_published=eq.true&order=date.desc&limit=8'),
        fetchRows('products?select=title,slug&is_active=eq.true&order=id'),
      ])
      return pageShell(
        'Masters &amp; Bachelors in Germany — Expert Consultancy from People Who Live Here',
        '<p>EasyWay Germany is a study abroad consultancy run from Dresden by people who actually live in Germany. We help Indian, Bangladeshi and Nepali students plan a Masters or Bachelors in Germany: university shortlisting, SOP and LOR writing, APS certificate guidance, blocked account setup and the student visa. A free consultation is available.</p>' +
          CTA_LINKS +
          section('Our Services', `<ul>${SERVICE_LINKS.map(([h, t, d]) => `<li>${aLink(h, t)}: ${d}</li>`).join('')}</ul>`) +
          section(
            'Why Indian Students Choose Masters in Germany',
            `<p>Public universities in Germany charge no tuition fees for Masters programs, even for international students. You only pay a semester contribution of about €100 to €350. Germany offers over 1,800 English-taught Masters programs, and graduates can stay for 18 months after their degree to look for work. Read our ${aLink('/blog/masters-in-germany-for-indian-students-complete-guide-2026', 'complete Masters in Germany guide for Indian students')}.</p>`
          ) +
          section(
            'How EasyWay Germany Helps You Get Admitted',
            '<h3>SOP Writing for German Universities</h3><p>A statement of purpose that covers academic motivation, research fit and your career goals in Germany.</p>' +
              '<h3>APS Certificate Guidance for Indian Students</h3><p>The APS certificate is mandatory for Indian applicants. We guide you through the document checklist, interview and submission.</p>' +
              '<h3>University Shortlisting for Masters in Germany</h3><p>We analyse your GPA, language scores and experience to shortlist universities across different tiers.</p>' +
              '<h3>Blocked Account Setup</h3><p>The required amount for 2026 is €11,904 per year. We help you choose a provider and set up the account.</p>' +
              '<h3>Germany Student Visa SOP</h3><p>A visa SOP is different from your university SOP. It must address your finances, ties to home and intention to return.</p>' +
              '<h3>LOR Writing Support</h3><p>Letters of recommendation in a format German professors recognise.</p>'
          ) +
          section(
            'Study in Germany Guides',
            `<ul>${blogs.length ? blogLinks(blogs) : PILLAR_GUIDES.map(([h, t]) => `<li>${aLink(h, t)}</li>`).join('')}</ul><p>${aLink('/blog', 'See all guides')}</p>`
          ) +
          (products.length ? section('Study Resources and Templates', `<ul>${productLinks(products)}</ul><p>${aLink('/products', 'Browse all products')}</p>`) : '') +
          section(
            'Frequently Asked Questions',
            '<h3>Can Indian students do Masters in Germany for free?</h3><p>Yes. Public universities charge no tuition fees for Masters programs, only a semester contribution of about €100 to €350.</p>' +
              '<h3>Do I need IELTS for Masters in Germany?</h3><p>Not always. Many English-taught programs accept a Medium of Instruction certificate or another accepted test.</p>' +
              '<h3>Is the APS certificate mandatory for Indian students?</h3><p>Yes. It involves document verification and an interview, and processing typically takes 6–8 weeks.</p>' +
              '<h3>How much does a blocked account cost for Germany?</h3><p>You need to deposit €11,904 for the 2026 student visa, released in monthly instalments of €992.</p>' +
              '<h3>Can I apply for Bachelors in Germany from India?</h3><p>Yes, after Class 12. Most public universities require a German language certificate or a foundation course (Studienkolleg).</p>' +
              '<h3>How much does living in Germany cost for Indian students?</h3><p>Roughly €800 to €1,200 per month, depending on the city.</p>'
          )
      )
    }

    case '/products': {
      const products = await fetchRows('products?select=title,slug,short_description&is_active=eq.true&order=id')
      return pageShell(
        'All Products',
        '<p>Trusted resources for your Study in Germany application: SOP samples, LOR templates, a CV template, university lists and a complete application guide.</p>' +
          (products.length ? `<ul>${productLinks(products)}</ul>` : '') +
          CTA_LINKS
      )
    }

    case '/blog': {
      const blogs = await fetchRows('blogs?select=title,slug&is_published=eq.true&order=date.desc')
      return pageShell(
        'Our Blogs',
        '<p>Expert guides on studying in Germany: APS certificate, Germany student visa, blocked account, university admissions, SOP writing, scholarships and life in Germany.</p>' +
          (blogs.length ? `<ul>${blogLinks(blogs)}</ul>` : `<ul>${PILLAR_GUIDES.map(([h, t]) => `<li>${aLink(h, t)}</li>`).join('')}</ul>`) +
          CTA_LINKS
      )
    }

    default:
      return null
  }
}

export default async (request, context) => {
  const response = await context.next()

  try {
    const url = new URL(request.url)
    // Normalise "/services/" -> "/services" (root stays "/").
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) return response

    let meta = null
    let status = response.status

    if (STATIC_META[path]) {
      const base = STATIC_META[path]
      meta = {
        title: base.title,
        description: base.description,
        canonical: `${SITE}${path}`,
        ogTitle: base.ogTitle,
        ogDescription: base.ogDescription,
        type: base.type,
        image: OG_IMAGE_FALLBACK,
      }
      const shell = await buildStaticShell(path)
      if (shell) meta.bodyHtml = shell
    } else if (path.startsWith('/services/')) {
      // Only the six routes in STATIC_META exist under /services/.
      status = 404
      meta = { noindex: true }
    } else if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '')
      if (slug && !slug.includes('/')) {
        const result = await fetchProduct(slug)
        if (result.state === 'found') {
          const { product } = result
          const canonical = `${SITE}/products/${slug}`
          const title = product.meta_title || product.title
          const description =
            product.meta_description || product.short_description || stripTags(product.description).slice(0, 160)
          const image = product.preview_image || OG_IMAGE_FALLBACK
          const pageTitle = title.includes('EasyWay Germany') ? title : `${title} | EasyWay Germany`
          const catName = product.categories && product.categories.name
          const productSchema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            sku: product.slug,
            ...(catName ? { category: catName } : {}),
            description,
            image,
            brand: { '@type': 'Brand', name: 'EasyWay Germany' },
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: canonical,
            },
          }
          const breadcrumbSchema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
              { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE}/products` },
              { '@type': 'ListItem', position: 3, name: product.title, item: canonical },
            ],
          }
          meta = {
            title: pageTitle,
            description,
            canonical,
            ogTitle: title,
            type: 'product',
            image,
            bodyHtml: buildProductShell(product),
            // data-ssr-schema: ProductDetail.jsx removes this tag on mount (SEOHead renders the same schema).
            extraHead: `<script type="application/ld+json" data-ssr-schema="true">${escapeJson([productSchema, breadcrumbSchema])}</script>`,
          }
        } else if (result.state === 'missing') {
          status = 404
          meta = { noindex: true }
        }
      }
    } else if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '')
      if (slug && !slug.includes('/')) {
        const result = await fetchBlog(slug)
        if (result.state === 'found') {
          const { blog } = result
          const title = blog.seo_title || blog.title
          const description = blog.seo_description || blog.excerpt || blog.title
          const canonical = `${SITE}/blog/${slug}`
          const image = blog.og_image || blog.image || OG_IMAGE_FALLBACK
          const pageTitle = title.includes('EasyWay Germany') ? title : `${title} | EasyWay Germany`
          meta = {
            title: pageTitle,
            description,
            canonical,
            ogTitle: title,
            type: 'article',
            image,
            bodyHtml: buildArticleShell(blog, blog.image || image),
            // data-ssr-schema: BlogDetail.jsx removes this tag on mount because
            // its own <Helmet> BlogPosting schema replaces it — avoids duplicates.
            extraHead: `<script type="application/ld+json" data-ssr-schema="true">${escapeJson({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: title,
              description,
              image,
              keywords: blog.seo_keywords || undefined,
              datePublished: blog.date,
              dateModified: blog.date,
              url: canonical,
              mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
              author: { '@type': 'Organization', name: 'EasyWay Germany', url: SITE },
              publisher: {
                '@type': 'Organization',
                name: 'EasyWay Germany',
                url: SITE,
                logo: { '@type': 'ImageObject', url: `${SITE}/images/easyway-logo.png` },
              },
            })}</script>`,
          }
        } else if (result.state === 'missing') {
          // Unknown / unpublished slug: return a real 404 (the SPA still renders
          // and redirects humans to /blog) instead of a soft-404 200.
          status = 404
          meta = { noindex: true }
        }
      }
    }

    if (!meta) return response

    const html = await response.text()
    const rewritten = applyMeta(html, meta)

    const headers = new Headers(response.headers)
    headers.delete('content-length') // body length changed
    if (status === 404) headers.set('cache-control', 'public, max-age=0, must-revalidate')

    return new Response(rewritten, { status, headers })
  } catch (err) {
    // Never let a bug here break the page — serve the original response.
    console.error('seo-meta edge function error:', err)
    return response
  }
}

export const config = {
  path: [
    '/',
    '/services',
    '/services/*',
    '/contact',
    '/about',
    '/blog',
    '/blog/*',
    '/study-in-germany',
    '/blocked-account-germany',
    '/pricing',
    '/visa-package',
    '/products',
    '/products/*',
  ],
}
