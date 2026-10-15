import { useEffect, useMemo, useRef, useState } from 'react'
import { BY_ISO, COUNTRIES, buildFullNumber, detectCountry, flagEmoji, matchDialPrefix } from '../data/countries'

// "+44 7700 900123" + dial "44" -> "7700 900123" (keeps the user's own grouping).
function stripDialPrefix(str, dial) {
  let i = 0
  let consumed = 0
  while (i < str.length && consumed < dial.length) {
    if (/\d/.test(str[i])) consumed++
    i++
  }
  return str.slice(i).replace(/^[\s\-()]+/, '')
}

/**
 * Phone field with a country-code picker.
 *
 * - The country is auto-detected from the visitor's timezone / browser language (no network request).
 * - Typing or pasting a number that starts with "+" switches the country to match (e.g. +49 -> Germany).
 * - `onChange` receives the full international number ("+91 98765 43210"), or '' while the field is empty.
 */
export default function PhoneInput({ value, onChange, id = 'phone', placeholder = 'Phone number' }) {
  const [iso, setIso] = useState(detectCountry)
  const [national, setNational] = useState('')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  const country = BY_ISO[iso]

  // Parent cleared the form after a successful submit -> clear the number, keep the detected country.
  useEffect(() => {
    if (value === '') setNational('')
  }, [value])

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return
    function onDown(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    function onKey(e) { if (e.key === 'Escape') { setOpen(false); inputRef.current?.focus() } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    searchRef.current?.focus()
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, '')
    if (!q) return COUNTRIES
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.iso.toLowerCase() === q || c.dial.startsWith(q))
  }, [query])

  function selectCountry(nextIso) {
    setIso(nextIso)
    setOpen(false)
    setQuery('')
    onChange(buildFullNumber(nextIso, national))
    inputRef.current?.focus()
  }

  function handleNumber(e) {
    let v = e.target.value
    let nextIso = iso
    if (v.trim().startsWith('+')) {
      // Pasted / typed an international number: let the dial code pick the country.
      const digits = v.replace(/\D/g, '')
      const hit = matchDialPrefix(digits, iso)
      if (hit) {
        nextIso = hit.iso
        v = stripDialPrefix(v, hit.dial)
      } else {
        v = digits
      }
      setIso(nextIso)
    }
    v = v.replace(/[^\d\s\-()]/g, '')
    setNational(v)
    onChange(buildFullNumber(nextIso, v))
  }

  return (
    <div ref={wrapRef} className="relative flex gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${country.name} +${country.dial}. Click to change`}
        className="flex items-center gap-1.5 px-3 py-3 border border-gray-200 rounded-xl text-sm bg-white hover:border-primary focus:outline-none focus:border-primary transition-colors flex-shrink-0">
        <span className="text-base leading-none" aria-hidden="true">{flagEmoji(iso)}</span>
        <span className="font-medium text-gray-800">+{country.dial}</span>
        <span className="material-icons-round text-gray-400" style={{ fontSize: 16 }} aria-hidden="true">expand_more</span>
      </button>

      <input
        ref={inputRef}
        id={id}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={national}
        onChange={handleNumber}
        className="flex-1 w-0 min-w-0 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
      />

      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 w-[min(20rem,calc(100vw-3rem))] bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (filtered[0]) selectCountry(filtered[0].iso) } }}
              placeholder="Search country or code"
              aria-label="Search country or dial code"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <ul role="listbox" aria-label="Country codes" className="max-h-64 overflow-y-auto py-1 list-none m-0 p-0">
            {filtered.length === 0 && <li className="px-4 py-3 text-sm text-gray-500">No country found</li>}
            {filtered.map((c) => (
              <li key={c.iso} role="option" aria-selected={c.iso === iso}>
                <button
                  type="button"
                  onClick={() => selectCountry(c.iso)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-primary/5 transition-colors ${c.iso === iso ? 'bg-primary/10 font-semibold' : ''}`}>
                  <span className="text-base leading-none w-6" aria-hidden="true">{flagEmoji(c.iso)}</span>
                  <span className="flex-1 text-gray-800 truncate">{c.name}</span>
                  <span className="text-gray-500">+{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
