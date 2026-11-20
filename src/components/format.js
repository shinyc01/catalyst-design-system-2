import { IFS } from './registry.js';
// IFS.format: one way to show money, numbers, percentages, dates, times and fiscal years everywhere.
// Rules and examples: guide/rules.md (section 8). Built on Intl, so it follows the locale; en-US is the default.
//
// IFS.format.money(v, { compact = 'auto', decimals, unit, sign, currency = 'USD', locale })
//   compact 'auto' (default): under $10,000 in full ("$8,450"), then K / M / B with 3 significant digits
//   ("$860K", "$19.4M", "$3.04B"). compact false: "$19,400,000". unit 'K' | 'M' | 'B' fixes the scale for a column
//   ("$0.6M" next to "$12.4M"; up to 1 decimal, decimals: 1 gives "$5.0M" for a table column). Negative: "−$1.8M" (true minus sign).
//   sign 'always' (for changes): "+$1.3M", "−$0.6M", "$0".
// IFS.format.number(v, { compact = false, decimals, unit, sign, locale })      → "1,621", compact "19.4K", unit "5.1 min"
// IFS.format.percent(v, { decimals = 1, ratio = false, sign, locale })        → v is the percent: 4.8 → "4.8%";
//   ratio true takes 0.048. Whole numbers drop the decimal ("48%"). sign 'always' → "+4.8%".
// IFS.format.change(v, kind = 'money' | 'number' | 'percent', opts)          → signed delta: "+$1.3M", "−2.1%", "0%"
// IFS.format.date(d, { style = 'medium', locale })                             → d: Date, 'YYYY-MM-DD' (read as a local
//   date, never UTC) or a timestamp. medium "Nov 12, 2026" · long "November 12, 2026" · short "Nov 12" ·
//   month "Nov 2026" · monthLong "November 2026" · weekday "Thu, Nov 12, 2026" · full "Thursday, November 12, 2026" · iso "2026-11-12" (exports and data only).
// IFS.format.time(d)                                                           → "3:44 AM"
// IFS.format.dateTime(d)                                                       → "Nov 12, 2026, 3:44 AM"
// IFS.format.dateRange(a, b)                                                   → "Nov 12 – 18, 2026", "Nov 28, 2026 – Jan 4, 2027"
// IFS.format.relative(d, { now = new Date() })                                 → "just now", "5 minutes ago", "3 hours ago",
//   "yesterday", "4 days ago"; 7 days or more → the date ("Nov 12, 2026"). Lower case: it usually follows a word
//   ("Edited 3 hours ago"); capitalise it yourself when it starts a line.
// IFS.format.fy(x, { style = 'short', quarter = false, startMonth })           → x: a year (2027 or 27) or a date.
//   "FY27" · long "FY2027" · quarter "Q2 FY27". A fiscal year is named for the calendar year it ends in.
// IFS.format.fyRange(a, b)                                                     → "FY27–FY31"
// IFS.format.fileSize(bytes)                                                   → "860 KB", "4.2 MB"
// IFS.format.parse(s)                                                          → number from a shown value, for sorting:
//   "$3.1M" → 3100000, "−$1.8M" → -1800000, "4.8%" → 4.8, "1,621" → 1621
// IFS.format.weekStart()                                                      → first day of the week for the locale: 0 = Sunday
//   (en-US, en-CA, ja-JP…), 1 = Monday (most of Europe, en-GB…), 6 = Saturday; `weekStartsOn` in configure overrides it.
// IFS.format.weekdays({ style = 'short', weekStartsOn })                       → the seven day names in the user's language and order:
//   en-US "Sun Mon … Sat", en-GB "Mon Tue … Sun", de-DE "Mo. Di. … So.".
// IFS.format.configure({ locale, currency, fyStartMonth, weekStartsOn, empty }) → set the defaults once per app (the user's settings).
//   fyStartMonth is 1–12 (default 1 = January; 10 = an October–September year). empty is what a missing
//   value shows (default "—"). Every function returns `empty` for null, undefined, '' or NaN.

const config = { locale: 'en-US', currency: 'USD', fyStartMonth: 1, empty: '—' };
const MINUS = '−';
const NBSP = ' ';
const SCALE = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };

const missing = v => v == null || v === '' || (typeof v === 'number' && Number.isNaN(v));
const cache = new Map();
const nf = (locale, o) => {
  const k = `${locale}|${JSON.stringify(o)}`;
  if (!cache.has(k)) cache.set(k, new Intl.NumberFormat(locale, o));
  return cache.get(k);
};
const df = (locale, o) => {
  const k = `d|${locale}|${JSON.stringify(o)}`;
  if (!cache.has(k)) cache.set(k, new Intl.DateTimeFormat(locale, o));
  return cache.get(k);
};
// Intl's minus is a hyphen in most locales; UI text uses the true minus sign (it lines up with +, and screen readers say "minus").
const parts = (fmt, v) => fmt.formatToParts(v).map(p => (p.type === 'minusSign' ? MINUS : p.value)).join('');
const signOpt = sign => (sign === 'always' ? 'exceptZero' : 'auto');
const digits = decimals => (decimals == null ? {} : { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// Shared by money and number: full, compact (3 significant digits) or a fixed unit.
function scaled(v, { compact, decimals, unit, sign, locale = config.locale, base }) {
  const n = Number(v);
  if (unit && SCALE[unit]) {
    if (n === 0 && decimals == null) return parts(nf(locale, { ...base, maximumFractionDigits: 0 }), 0); // "$0" on an axis
    const s = parts(nf(locale, { ...base, ...(decimals == null ? { maximumFractionDigits: 1 } : digits(decimals)), signDisplay: signOpt(sign) }), n / SCALE[unit]);
    return s.replace(/(\d)(?!.*\d)/, `$1${unit}`); // unit right after the last digit: "$0.6M", "−$1.2M"
  }
  const auto = compact === 'auto' ? Math.abs(n) >= 1e4 : !!compact;
  const o = auto
    ? { ...base, notation: 'compact', compactDisplay: 'short', ...(decimals == null ? { maximumSignificantDigits: 3 } : digits(decimals)) }
    : { ...base, ...(decimals == null ? { maximumFractionDigits: base.style === 'currency' ? 0 : 2 } : digits(decimals)) };
  return parts(nf(locale, { ...o, signDisplay: signOpt(sign) }), n);
}

function money(v, { compact = 'auto', decimals, unit, sign, currency = config.currency, locale } = {}) {
  if (missing(v)) return config.empty;
  // Cents only when asked for, or when a small amount isn't whole ("$12.50").
  const n = Number(v);
  const d = decimals ?? (!unit && compact !== true && Math.abs(n) < 1e4 && !Number.isInteger(n) ? 2 : undefined);
  return scaled(n, { compact, decimals: d, unit, sign, locale,
    base: { style: 'currency', currency, currencyDisplay: 'narrowSymbol' } });
}

function number(v, { compact = false, decimals, unit, sign, locale } = {}) {
  if (missing(v)) return config.empty;
  // A unit that isn't a scale (min, yr, km) goes after a non-breaking space: "5.1 min".
  if (unit && !SCALE[unit]) return `${scaled(v, { compact, decimals, sign, locale, base: {} })}${NBSP}${unit}`;
  return scaled(v, { compact, decimals, unit, sign, locale, base: {} });
}

function percent(v, { decimals, ratio = false, sign, locale = config.locale } = {}) {
  if (missing(v)) return config.empty;
  const r = ratio ? Number(v) : Number(v) / 100;
  const o = decimals == null ? { maximumFractionDigits: 1 } : digits(decimals);
  return parts(nf(locale, { style: 'percent', ...o, signDisplay: signOpt(sign) }), r);
}

function change(v, kind = 'money', opts = {}) {
  const f = { money, number, percent }[kind] || money;
  return f(v, { ...opts, sign: 'always' });
}

// 'YYYY-MM-DD' is a calendar date: build it in local time (new Date('2026-11-12') is UTC and shows Nov 11 in the Americas).
function toDate(d) {
  if (d instanceof Date) return d;
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) { const [y, m, day] = d.split('-').map(Number); return new Date(y, m - 1, day); }
  return new Date(d);
}
const badDate = d => missing(d) || Number.isNaN(toDate(d).getTime());

const DATE_STYLES = {
  medium: { month: 'short', day: 'numeric', year: 'numeric' },
  long: { month: 'long', day: 'numeric', year: 'numeric' },
  short: { month: 'short', day: 'numeric' },
  month: { month: 'short', year: 'numeric' },
  monthLong: { month: 'long', year: 'numeric' },
  weekday: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
  full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
};

function date(d, { style = 'medium', locale = config.locale } = {}) {
  if (badDate(d)) return config.empty;
  const t = toDate(d);
  if (style === 'iso') return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  return df(locale, DATE_STYLES[style] || DATE_STYLES.medium).format(t);
}

function time(d, { locale = config.locale } = {}) {
  if (badDate(d)) return config.empty;
  return df(locale, { hour: 'numeric', minute: '2-digit' }).format(toDate(d));
}

function dateTime(d, { locale = config.locale } = {}) {
  if (badDate(d)) return config.empty;
  return df(locale, { ...DATE_STYLES.medium, hour: 'numeric', minute: '2-digit' }).format(toDate(d));
}

function dateRange(a, b, { style = 'medium', locale = config.locale } = {}) {
  if (badDate(a)) return config.empty;
  if (badDate(b)) return date(a, { style, locale });
  const f = df(locale, DATE_STYLES[style] || DATE_STYLES.medium);
  return f.formatRange ? f.formatRange(toDate(a), toDate(b)) : `${f.format(toDate(a))} – ${f.format(toDate(b))}`;
}

function relative(d, { now = new Date(), locale = config.locale } = {}) {
  if (badDate(d)) return config.empty;
  const s = (toDate(d).getTime() - toDate(now).getTime()) / 1000;
  const a = Math.abs(s);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (a < 45) return locale.startsWith('en') ? 'just now' : rtf.format(0, 'second');
  if (a >= 604800) return date(d, { locale });
  if (a < 3600) return rtf.format(Math.round(s / 60), 'minute');
  if (a < 86400) return rtf.format(Math.round(s / 3600), 'hour');
  // Days count calendar days, so 10 PM yesterday is "yesterday" at 8 AM.
  const day = x => { const t = toDate(x); return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime(); };
  return rtf.format(Math.round((day(d) - day(now)) / 864e5), 'day');
}

// Fiscal year of a date: named for the calendar year it ends in. With fyStartMonth 10, Oct 1, 2026 starts FY27.
function fyYear(x, startMonth = config.fyStartMonth) {
  if (typeof x === 'number') return x < 100 ? 2000 + x : x;
  const t = toDate(x);
  return startMonth === 1 ? t.getFullYear() : t.getFullYear() + (t.getMonth() + 1 >= startMonth ? 1 : 0);
}
function fy(x, { style = 'short', quarter = false, startMonth = config.fyStartMonth } = {}) {
  if (missing(x) || (typeof x !== 'number' && badDate(x))) return config.empty;
  const y = fyYear(x, startMonth);
  const name = style === 'long' ? `FY${y}` : `FY${String(y % 100).padStart(2, '0')}`;
  if (!quarter || typeof x === 'number') return name;
  const t = toDate(x);
  const q = Math.floor((((t.getMonth() + 1 - startMonth) + 12) % 12) / 3) + 1;
  return `Q${q} ${name}`;
}
function fyRange(a, b, opts = {}) {
  if (missing(b)) return fy(a, opts);
  return `${fy(a, opts)}–${fy(b, opts)}`;
}

function fileSize(bytes, { locale = config.locale } = {}) {
  if (missing(bytes)) return config.empty;
  const b = Number(bytes);
  const [v, u] = b >= 1073741824 ? [b / 1073741824, 'GB'] : b >= 1048576 ? [b / 1048576, 'MB'] : [Math.max(1, b / 1024), 'KB'];
  return `${nf(locale, { maximumFractionDigits: u === 'KB' ? 0 : 1 }).format(v)}${NBSP}${u}`;
}

// Read a shown value back as a number, for sorting columns of preformatted text.
function parse(s) {
  if (typeof s === 'number') return s;
  const str = String(s ?? '').trim();
  const m = str.replace(/,/g, '').match(/[-−−]?\d*\.?\d+/);
  if (!m) return NaN;
  const n = parseFloat(m[0].replace(/[−−]/, '-'));
  const neg = /^[(]|^[+]?\D*?[-−−]/.test(str) && n > 0;
  const unit = (str.match(/\d\s*([KMBT])\b/i) || [])[1];
  return (neg ? -n : n) * (unit ? SCALE[unit.toUpperCase()] : 1);
}

function configure(o = {}) { Object.assign(config, o); cache.clear(); return { ...config }; }

// First day of the week from the locale's region (Intl.Locale week info where the browser has it, else the CLDR regions).
const SUNDAY_REGIONS = ['US', 'CA', 'MX', 'BR', 'JP', 'KR', 'TW', 'HK', 'IL', 'PH', 'IN', 'ZA', 'AU', 'SA', 'PE', 'CO', 'VE', 'GT', 'HN', 'NI', 'PA', 'PR', 'DO', 'SV', 'KE', 'ZW', 'TH', 'ID', 'PK', 'BD'];
const SATURDAY_REGIONS = ['AE', 'AF', 'BH', 'DJ', 'DZ', 'EG', 'IQ', 'IR', 'JO', 'KW', 'LY', 'OM', 'QA', 'SD', 'SY'];
function weekStart() {
  if (config.weekStartsOn != null) return config.weekStartsOn;
  try {
    const loc = new Intl.Locale(config.locale);
    const info = loc.getWeekInfo ? loc.getWeekInfo() : loc.weekInfo;
    if (info && info.firstDay) return info.firstDay % 7; // Intl: 1 = Monday … 7 = Sunday
    const region = (loc.maximize ? loc.maximize() : loc).region;
    if (SUNDAY_REGIONS.includes(region)) return 0;
    if (SATURDAY_REGIONS.includes(region)) return 6;
  } catch (e) { /* unknown locale: fall through */ }
  return 1;
}
function weekdays({ style = 'short', weekStartsOn = weekStart() } = {}) {
  const f = df(config.locale, { weekday: style });
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(2023, 0, 1 + ((i + weekStartsOn) % 7)))); // Jan 1 2023 = Sunday
}

const format = { money, number, percent, change, date, time, dateTime, dateRange, relative, fy, fyRange, fileSize, parse, configure, weekStart, weekdays, toDate,
  get config() { return { ...config }; } };
IFS.format = format;
export { format };
