import { readFile, mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const out = path.resolve("dist")
const origin = (process.env.SITE_ORIGIN || "https://aichuuu.com").replace(/\/$/, "")
const verification = (process.env.GOOGLE_SITE_VERIFICATION || "").trim()
const pages = {
  ru: {
    title: "Аналитика продаж и CRM | aichuuu.co",
    description: "aichuuu.co — Digital Intelligence Studio. Исследуем CRM, аналитику продаж, прибыль, воронку и автоматизацию бизнеса. Концепции и прототипы B2B SaaS.",
    ogDescription: "CRM, анализ продаж, прибыль и автоматизация. Некоммерческий технологический проект aichuuu.co.",
    locale: "ru_RU",
  },
  en: {
    title: "Sales Analytics & CRM | aichuuu.co",
    description: "aichuuu.co is a Digital Intelligence Studio exploring CRM, sales analytics, profitability, sales funnels and business automation through B2B SaaS concepts and prototypes.",
    ogDescription: "Exploring sales intelligence, CRM and automation. B2B SaaS concepts and prototypes by aichuuu.co.",
    locale: "en_US",
  },
  ky: {
    title: "Сатууну талдоо жана CRM | aichuuu.co",
    description: "aichuuu.co — Digital Intelligence Studio. CRM, сатуу аналитикасы, пайда, сатуу воронкасы жана бизнести автоматташтыруу боюнча B2B SaaS концепциялары жана прототиптери.",
    ogDescription: "Сатуу аналитикасы, CRM жана автоматташтыруу боюнча изилдөөлөр жана B2B SaaS прототиптери.",
    locale: "ky_KG",
  },
}
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;")
const alternates = Object.keys(pages).map(lang => `<link rel="alternate" hreflang="${lang}" href="${origin}/${lang}/" />`).join("\n    ") +
  `\n    <link rel="alternate" hreflang="x-default" href="${origin}/ru/" />`
const verificationMeta = verification ? `<meta name="google-site-verification" content="${esc(verification)}" />` : ""
const buildHtml = await readFile(path.join(out, "index.html"), "utf8")
function setTag(html, regexp, replacement, label) {
  if (!regexp.test(html)) throw new Error(`Missing ${label} in Vite HTML`)
  return html.replace(regexp, replacement)
}
for (const [lang, meta] of Object.entries(pages)) {
  let html = buildHtml
  html = setTag(html, /<html lang="[^"]*">/, `<html lang="${lang}">`, "lang")
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`, "title")
  html = setTag(html, /<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(meta.description)}" />`, "description")
  html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${origin}/${lang}/" />`, "canonical")
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(meta.title)}" />`, "og:title")
  html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(meta.ogDescription)}" />`, "og:description")
  html = html.replace("</head>", `    <meta property="og:url" content="${origin}/${lang}/" />
    <meta property="og:locale" content="${meta.locale}" />
    ${alternates}
    ${verificationMeta}
  </head>`)
  // Vite uses base "./". Nested pages must refer one directory up for assets.
  html = html.replace(/(src|href)="\.\/(assets\/|favicon\.svg|favicon-32\.png)/g, (_, attr, file) => `${attr}="../${file}`)
  // Asset paths in nested pages must not point at ./assets/.
  if (/\b(?:src|href)="\.\/assets\//.test(html)) throw new Error(`Bad asset path on ${lang}`)
  const localeDir = path.join(out, lang)
  await mkdir(localeDir, { recursive: true })
  await writeFile(path.join(localeDir, "index.html"), html)
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.keys(pages).map(lang => `  <url>
    <loc>${origin}/${lang}/</loc>
${Object.keys(pages).map(alt => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${origin}/${alt}/" />`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/ru/" />
  </url>`).join("\n")}
</urlset>
`
await writeFile(path.join(out, "sitemap.xml"), sitemap)
await writeFile(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`)
// Root is a non-indexable language gateway; /ru/, /en/ and /ky/ are the indexable URLs.
const rootHtml = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; img-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta name="robots" content="noindex,follow" />
  <meta http-equiv="refresh" content="0; url=./ru/" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>aichuuu.co | Digital Intelligence Studio</title>
  <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32.png" />
  <link rel="canonical" href="${origin}/ru/" />
  ${alternates}
  ${verificationMeta}
</head>
<body><p><a href="./ru/">Русский</a> · <a href="./en/">English</a> · <a href="./ky/">Кыргызча</a></p></body>
</html>
`
await writeFile(path.join(out,"index.html"),rootHtml)
console.log("Generated /ru/, /en/, /ky/, localized metadata, sitemap and root redirect")
