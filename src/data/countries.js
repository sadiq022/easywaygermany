// Country list for the phone-number field: [ISO 3166-1 alpha-2 | name | dial code].
const RAW =
  'AF|Afghanistan|93;AL|Albania|355;DZ|Algeria|213;AD|Andorra|376;AO|Angola|244;AR|Argentina|54;AM|Armenia|374;' +
  'AU|Australia|61;AT|Austria|43;AZ|Azerbaijan|994;BS|Bahamas|1;BH|Bahrain|973;BD|Bangladesh|880;BB|Barbados|1;' +
  'BY|Belarus|375;BE|Belgium|32;BZ|Belize|501;BJ|Benin|229;BT|Bhutan|975;BO|Bolivia|591;BA|Bosnia & Herzegovina|387;' +
  'BW|Botswana|267;BR|Brazil|55;BN|Brunei|673;BG|Bulgaria|359;BF|Burkina Faso|226;BI|Burundi|257;KH|Cambodia|855;' +
  'CM|Cameroon|237;CA|Canada|1;CV|Cape Verde|238;CF|Central African Republic|236;TD|Chad|235;CL|Chile|56;CN|China|86;' +
  'CO|Colombia|57;KM|Comoros|269;CG|Congo|242;CD|Congo (DRC)|243;CR|Costa Rica|506;CI|Côte d’Ivoire|225;HR|Croatia|385;' +
  'CU|Cuba|53;CY|Cyprus|357;CZ|Czechia|420;DK|Denmark|45;DJ|Djibouti|253;DO|Dominican Republic|1;EC|Ecuador|593;' +
  'EG|Egypt|20;SV|El Salvador|503;GQ|Equatorial Guinea|240;ER|Eritrea|291;EE|Estonia|372;SZ|Eswatini|268;ET|Ethiopia|251;' +
  'FJ|Fiji|679;FI|Finland|358;FR|France|33;GA|Gabon|241;GM|Gambia|220;GE|Georgia|995;DE|Germany|49;GH|Ghana|233;' +
  'GR|Greece|30;GT|Guatemala|502;GN|Guinea|224;GW|Guinea-Bissau|245;GY|Guyana|592;HT|Haiti|509;HN|Honduras|504;' +
  'HK|Hong Kong|852;HU|Hungary|36;IS|Iceland|354;IN|India|91;ID|Indonesia|62;IR|Iran|98;IQ|Iraq|964;IE|Ireland|353;' +
  'IL|Israel|972;IT|Italy|39;JM|Jamaica|1;JP|Japan|81;JO|Jordan|962;KZ|Kazakhstan|7;KE|Kenya|254;KW|Kuwait|965;' +
  'KG|Kyrgyzstan|996;LA|Laos|856;LV|Latvia|371;LB|Lebanon|961;LS|Lesotho|266;LR|Liberia|231;LY|Libya|218;' +
  'LI|Liechtenstein|423;LT|Lithuania|370;LU|Luxembourg|352;MO|Macao|853;MG|Madagascar|261;MW|Malawi|265;MY|Malaysia|60;' +
  'MV|Maldives|960;ML|Mali|223;MT|Malta|356;MR|Mauritania|222;MU|Mauritius|230;MX|Mexico|52;MD|Moldova|373;' +
  'MC|Monaco|377;MN|Mongolia|976;ME|Montenegro|382;MA|Morocco|212;MZ|Mozambique|258;MM|Myanmar|95;NA|Namibia|264;' +
  'NP|Nepal|977;NL|Netherlands|31;NZ|New Zealand|64;NI|Nicaragua|505;NE|Niger|227;NG|Nigeria|234;KP|North Korea|850;' +
  'MK|North Macedonia|389;NO|Norway|47;OM|Oman|968;PK|Pakistan|92;PS|Palestine|970;PA|Panama|507;PG|Papua New Guinea|675;' +
  'PY|Paraguay|595;PE|Peru|51;PH|Philippines|63;PL|Poland|48;PT|Portugal|351;PR|Puerto Rico|1;QA|Qatar|974;RO|Romania|40;' +
  'RU|Russia|7;RW|Rwanda|250;SA|Saudi Arabia|966;SN|Senegal|221;RS|Serbia|381;SC|Seychelles|248;SL|Sierra Leone|232;' +
  'SG|Singapore|65;SK|Slovakia|421;SI|Slovenia|386;SO|Somalia|252;ZA|South Africa|27;KR|South Korea|82;SS|South Sudan|211;' +
  'ES|Spain|34;LK|Sri Lanka|94;SD|Sudan|249;SR|Suriname|597;SE|Sweden|46;CH|Switzerland|41;SY|Syria|963;TW|Taiwan|886;' +
  'TJ|Tajikistan|992;TZ|Tanzania|255;TH|Thailand|66;TL|Timor-Leste|670;TG|Togo|228;TT|Trinidad & Tobago|1;TN|Tunisia|216;' +
  'TR|Türkiye|90;TM|Turkmenistan|993;UG|Uganda|256;UA|Ukraine|380;AE|United Arab Emirates|971;GB|United Kingdom|44;' +
  'US|United States|1;UY|Uruguay|598;UZ|Uzbekistan|998;VE|Venezuela|58;VN|Vietnam|84;YE|Yemen|967;ZM|Zambia|260;ZW|Zimbabwe|263'

// Countries EasyWay Germany's students mostly come from (and Germany) are listed first.
const POPULAR = ['IN', 'BD', 'NP', 'PK', 'LK', 'DE', 'AE', 'SA', 'US', 'GB', 'CA', 'AU', 'NG', 'GH', 'KE', 'EG']

const ALL = RAW.split(';').map((row) => {
  const [iso, name, dial] = row.split('|')
  return { iso, name, dial }
})
export const BY_ISO = Object.fromEntries(ALL.map((c) => [c.iso, c]))
export const COUNTRIES = [
  ...POPULAR.map((iso) => BY_ISO[iso]),
  ...ALL.filter((c) => !POPULAR.includes(c.iso)).sort((a, b) => a.name.localeCompare(b.name)),
]

// Regional-indicator flag emoji (some Windows browsers show the two letters instead — that is fine).
export function flagEmoji(iso) {
  return String.fromCodePoint(...[...iso].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65))
}

// Browser timezone -> country. The timezone is a stronger location signal than the browser language
// (many users in India run an en-US browser), and needs no network request or IP lookup.
const TIMEZONE_COUNTRY = {
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Dhaka': 'BD', 'Asia/Kathmandu': 'NP', 'Asia/Katmandu': 'NP',
  'Asia/Karachi': 'PK', 'Asia/Colombo': 'LK', 'Asia/Thimphu': 'BT', 'Indian/Maldives': 'MV', 'Asia/Kabul': 'AF',
  'Europe/Berlin': 'DE', 'Europe/Busingen': 'DE', 'Europe/Vienna': 'AT', 'Europe/Zurich': 'CH', 'Europe/Paris': 'FR',
  'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Lisbon': 'PT', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE',
  'Europe/Luxembourg': 'LU', 'Europe/Copenhagen': 'DK', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO',
  'Europe/Helsinki': 'FI', 'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ', 'Europe/Budapest': 'HU',
  'Europe/Bucharest': 'RO', 'Europe/Sofia': 'BG', 'Europe/Athens': 'GR', 'Europe/Dublin': 'IE', 'Europe/London': 'GB',
  'Europe/Istanbul': 'TR', 'Europe/Kyiv': 'UA', 'Europe/Kiev': 'UA', 'Europe/Moscow': 'RU', 'Europe/Minsk': 'BY',
  'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW', 'Asia/Muscat': 'OM',
  'Asia/Bahrain': 'BH', 'Asia/Baghdad': 'IQ', 'Asia/Tehran': 'IR', 'Asia/Jerusalem': 'IL', 'Asia/Amman': 'JO',
  'Asia/Beirut': 'LB', 'Asia/Tashkent': 'UZ', 'Asia/Almaty': 'KZ', 'Asia/Singapore': 'SG', 'Asia/Kuala_Lumpur': 'MY',
  'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH', 'Asia/Bangkok': 'TH', 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN',
  'Asia/Yangon': 'MM', 'Asia/Rangoon': 'MM', 'Asia/Phnom_Penh': 'KH', 'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'HK',
  'Asia/Taipei': 'TW', 'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Asia/Ulaanbaatar': 'MN',
  'Africa/Lagos': 'NG', 'Africa/Accra': 'GH', 'Africa/Nairobi': 'KE', 'Africa/Cairo': 'EG', 'Africa/Johannesburg': 'ZA',
  'Africa/Addis_Ababa': 'ET', 'Africa/Dar_es_Salaam': 'TZ', 'Africa/Kampala': 'UG', 'Africa/Casablanca': 'MA',
  'Africa/Algiers': 'DZ', 'Africa/Tunis': 'TN', 'Africa/Harare': 'ZW', 'Africa/Lusaka': 'ZM', 'Africa/Dakar': 'SN',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU', 'Australia/Perth': 'AU',
  'Australia/Adelaide': 'AU', 'Australia/Darwin': 'AU', 'Australia/Hobart': 'AU', 'Pacific/Auckland': 'NZ',
  'Pacific/Fiji': 'FJ', 'Indian/Mauritius': 'MU',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
  'America/Phoenix': 'US', 'America/Anchorage': 'US', 'America/Detroit': 'US', 'Pacific/Honolulu': 'US',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA',
  'America/Halifax': 'CA', 'America/Mexico_City': 'MX', 'America/Sao_Paulo': 'BR', 'America/Argentina/Buenos_Aires': 'AR',
  'America/Bogota': 'CO', 'America/Lima': 'PE', 'America/Santiago': 'CL', 'America/Caracas': 'VE',
}

export function detectCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz && TIMEZONE_COUNTRY[tz] && BY_ISO[TIMEZONE_COUNTRY[tz]]) return TIMEZONE_COUNTRY[tz]
  } catch { /* fall through */ }
  try {
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]
    for (const l of langs) {
      const m = /[-_]([A-Za-z]{2})\b/.exec(l || '')
      if (m && BY_ISO[m[1].toUpperCase()]) return m[1].toUpperCase()
    }
  } catch { /* fall through */ }
  return 'IN' // most of our students are in India
}

// Shared dial codes: pick a sensible default (+1 = US, +7 = Russia).
const SHARED_DEFAULT = { 1: 'US', 7: 'RU' }

// Given only digits that started with "+", find the country by longest dial-code prefix.
// `currentIso` wins when it already uses the matched code (e.g. stay on Canada for +1).
export function matchDialPrefix(digits, currentIso) {
  for (let len = 4; len >= 1; len--) {
    const dial = digits.slice(0, len)
    const matches = COUNTRIES.filter((c) => c.dial === dial)
    if (!matches.length) continue
    const pick =
      matches.find((c) => c.iso === currentIso) ||
      matches.find((c) => c.iso === SHARED_DEFAULT[dial]) ||
      matches[0]
    return pick
  }
  return null
}

// Countries whose national numbers keep a leading 0 even in international format.
const KEEPS_LEADING_ZERO = new Set(['IT', 'SM', 'VA'])

// "0152 3673 8625" typed with +49 selected -> "152 3673 8625".
export function normalizeNational(iso, national) {
  const n = national.trim()
  return KEEPS_LEADING_ZERO.has(iso) ? n : n.replace(/^0+[\s-]*/, '')
}

// "+49 152 3673 8625", or '' when no number has been typed.
export function buildFullNumber(iso, national) {
  if (!national.replace(/\D/g, '')) return ''
  const n = normalizeNational(iso, national)
  return n.replace(/\D/g, '') ? `+${BY_ISO[iso].dial} ${n}` : ''
}

// E.164 allows at most 15 digits in total; anything under 8 cannot be a real international number.
export function isPlausiblePhone(full) {
  const digits = String(full).replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 15
}
