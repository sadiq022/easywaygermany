// Captures the real, rendered text of the static pages and writes it into the seo-meta edge function
// (netlify/edge-functions/seo-meta.js, between the <generated-shells> markers).
//
// Why: the site is a client-rendered SPA, so crawlers that do not run JavaScript see an empty page. The edge
// function injects this text into the raw HTML (React replaces it on boot). Capturing it from the real pages
// keeps the crawlable text identical to what visitors read.
//
// Usage (needs Chrome or Edge, and the dev server running):
//   npm run dev                                   # in one terminal (default http://localhost:5173)
//   npm run generate-shells                       # in another  (or: node scripts/generate-shells.mjs http://localhost:5199)
// Re-run it after changing the content of any page listed in PATHS, then commit the edge function.
//
// Not covered on purpose: "/", "/blog" and "/products" (they add live lists from the database in the edge function).

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EDGE_FILE = path.join(ROOT, 'netlify/edge-functions/seo-meta.js')
const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '')

const PATHS = [
  '/services', '/contact', '/about', '/study-in-germany', '/blocked-account-germany', '/pricing', '/visa-package',
  '/services/sop-writing', '/services/lor-writing', '/services/cv-preparation',
  '/services/university-shortlisting', '/services/visa-sop', '/services/visa-cover-letter',
]

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const chromePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p))
if (!chromePath) throw new Error('Chrome/Edge not found. Set CHROME_PATH to its executable.')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ew-shells-'))
const PORT = 9400 + Math.floor(Math.random() * 400)
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', 'about:blank'], { stdio: 'ignore' })

async function main() {
  let targets
  for (let i = 0; i < 60; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (targets.length) break } catch { /* wait */ }
    await sleep(250)
  }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  let id = 0
  const pending = new Map()
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } }
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
    if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400))
    return r.result.result.value
  }
  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false })

  // Runs inside the page: returns the ordered content blocks of the main content area.
  const EXTRACT = `(() => {
    const root = document.getElementById('root')
    const BLOCK = 'h1,h2,h3,h4,p,li,summary,tr,blockquote,[hidden]'
    const unwanted = (el) => el.closest('header, nav, footer, [aria-hidden="true"], [class*="fixed"]')
    // visible, or part of an FAQ that is collapsed (details / [hidden] panels still count as page content)
    const shown = (el) => !!el.closest('[hidden], details') || el.getClientRects().length > 0
    const leaves = [...root.querySelectorAll(BLOCK)].filter((el) => !unwanted(el) && shown(el)).filter((el) => !el.querySelector(BLOCK))
    const ALLOWED = new Set(['A', 'STRONG', 'EM', 'B', 'I', 'BR'])
    const sanitize = (node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType !== 1) continue
        sanitize(child)
        if (!ALLOWED.has(child.tagName)) { child.replaceWith(...child.childNodes); continue }
        const href = child.tagName === 'A' ? child.getAttribute('href') || '' : null
        for (const a of [...child.attributes]) child.removeAttribute(a.name)
        if (child.tagName === 'A') {
          if (/^(\\/|https?:|mailto:|tel:)/.test(href)) child.setAttribute('href', href)
          else child.replaceWith(...child.childNodes)
        }
      }
    }
    const parentIds = new Map()
    return leaves.map((el) => {
      if (el.tagName === 'TR') {
        // comparison tables: icon cells become words (check_circle -> Included, cancel -> Not included)
        const cells = [...el.children].map((c) => {
          const cc = c.cloneNode(true)
          cc.querySelectorAll('.material-icons-round').forEach((i) => {
            const n = i.textContent.trim()
            i.replaceWith(n === 'check_circle' || n === 'check' ? 'Included' : n === 'cancel' || n === 'close' ? 'Not included' : '')
          })
          return cc.textContent.replace(/\\s+/g, ' ').trim()
        }).filter(Boolean)
        return { t: 'p', h: cells.join(' | ').replace(/&/g, '&amp;').replace(/</g, '&lt;') }
      }
      const c = el.cloneNode(true)
      c.querySelectorAll('.material-icons-round, svg, img, input, textarea, select, script, style, [aria-hidden="true"]').forEach((x) => x.remove())
      sanitize(c)
      let pid = null, pt = null
      if (el.tagName === 'LI') { const p = el.parentElement; if (!parentIds.has(p)) parentIds.set(p, parentIds.size + 1); pid = parentIds.get(p); pt = p.tagName.toLowerCase() === 'ol' ? 'ol' : 'ul' }
      return { t: el.tagName.toLowerCase(), h: c.innerHTML.replace(/\\p{Extended_Pictographic}️?/gu, '').replace(/\\s+/g, ' ').trim(), pid, pt }
    })
  })()`

  const stripTags = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
  const out = {}

  for (const p of PATHS) {
    await send('Page.navigate', { url: BASE + p })
    await sleep(3200)
    const blocks = await evaluate(EXTRACT)
    let h1 = ''
    let prevLevel = 1
    const html = []
    let openList = null // { pid, tag }
    const seen = new Set()
    let lastText = ''
    const closeList = () => { if (openList) { html.push(`</${openList.tag}>`); openList = null } }

    for (const b of blocks) {
      const text = stripTags(b.h)
      if (!text || text === lastText) continue
      if (text.length > 40 && seen.has(text)) continue
      seen.add(text)
      lastText = text

      if (b.t === 'h1' && !h1) { h1 = b.h; continue }
      if (/^h[1-4]$/.test(b.t) || b.t === 'summary') {
        closeList()
        const orig = b.t === 'summary' ? 3 : Number(b.t[1])
        const level = Math.max(2, Math.min(orig, prevLevel + 1))
        prevLevel = level
        html.push(`<h${level}>${b.h}</h${level}>`)
      } else if (b.t === 'li') {
        if (!openList || openList.pid !== b.pid) { closeList(); openList = { pid: b.pid, tag: b.pt }; html.push(`<${b.pt}>`) }
        html.push(`<li>${b.h}</li>`)
      } else {
        closeList()
        html.push(`<p>${b.h}</p>`)
      }
    }
    closeList()
    if (!h1) throw new Error(`${p}: no <h1> found on the page`)
    const body = html.join('')
    const words = stripTags(h1 + ' ' + body).split(' ').filter(Boolean).length
    out[p] = { h1, body }
    console.log(`${p.padEnd(36)} ${String(words).padStart(5)} words, ${(body.match(/<p>/g) || []).length} paragraphs, ${(body.match(/<a /g) || []).length} links`)
  }

  ws.close()

  const literal = 'const GENERATED_SHELLS = ' + JSON.stringify(out, null, 2)
  let src = fs.readFileSync(EDGE_FILE, 'utf8')
  const crlf = src.includes('\r\n')
  src = src.replace(/\r\n/g, '\n')
  const start = src.indexOf('// <generated-shells:start>')
  const end = src.indexOf('// <generated-shells:end>')
  if (start < 0 || end < 0 || end < start) throw new Error('generated-shells markers not found in the edge function')
  src = src.slice(0, start) + '// <generated-shells:start>\n' + literal + '\n' + src.slice(end)
  fs.writeFileSync(EDGE_FILE, crlf ? src.replace(/\n/g, '\r\n') : src)
  console.log(`\nWrote ${PATHS.length} page snapshots into netlify/edge-functions/seo-meta.js`)
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(() => {
    chrome.kill()
    try { fs.rmSync(profile, { recursive: true, force: true }) } catch { /* ignore */ }
    process.exit(process.exitCode || 0)
  })
