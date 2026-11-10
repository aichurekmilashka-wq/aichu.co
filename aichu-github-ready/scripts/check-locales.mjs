import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"

const root = path.resolve(".")
const dist = path.join(root, "dist")
const langs = ["ru", "en", "ky"]
const titles = new Set()
const descriptions = new Set()
const generated = readFileSync(path.join(root, "scripts", "postbuild-locales.mjs"), "utf8")
const origin = process.env.SITE_ORIGIN?.replace(/\/$/, "") || "https://aichuuu.co"

for (const lang of langs) {
  const html = readFileSync(path.join(dist, lang, "index.html"), "utf8")
  assert.ok(html.includes('<html lang="' + lang + '"'), "Wrong html lang for " + lang)
  assert.ok(html.includes('<link rel="canonical" href="' + origin + "/" + lang + '/"'), "Bad canonical for " + lang)
  for (const alternate of langs) {
    assert.ok(html.includes('hreflang="' + alternate + '" href="' + origin + "/" + alternate + '/"'), "Missing alternate " + lang + "/" + alternate)
  }
  assert.ok(html.includes('hreflang="x-default" href="' + origin + '/ru/"'), "Missing x-default for " + lang)
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
  assert.ok(title && description, "Missing metadata in " + lang)
  titles.add(title)
  descriptions.add(description)
  assert.ok(/(?:src|href)="\.\.\/assets\//.test(html), "Missing parent-relative Vite asset for " + lang)
  assert.ok(!/(?:src|href)="\.\/assets\//.test(html), "Wrong asset path for " + lang)
}
assert.equal(titles.size, langs.length, "Duplicate localized titles")
assert.equal(descriptions.size, langs.length, "Duplicate localized descriptions")

const sitemap = readFileSync(path.join(dist, "sitemap.xml"), "utf8")
for (const lang of langs) assert.ok(sitemap.includes("<loc>" + origin + "/" + lang + "/</loc>"))
const rootIndex = readFileSync(path.join(dist, "index.html"), "utf8")
assert.ok(rootIndex.includes('content="0; url=./ru/"'), "Missing root language redirect")
assert.ok(generated.includes("GOOGLE_SITE_VERIFICATION"), "Verification token support removed")

// Validate active translation dictionary coverage, not just whether both locales are present in navigation.
const app = readFileSync(path.join(root, "src", "App.tsx"), "utf8")
const dictionaryLine = app.split("\n").find(line => line.startsWith("const translations:"))
assert.ok(dictionaryLine, "Translation dictionary missing")
const dictionary = JSON.parse(dictionaryLine.replace(/^const translations: Record<string, \[string, string\]> = /, ""))
for (const [key, pair] of Object.entries(dictionary)) {
  assert.ok(Array.isArray(pair) && pair.length === 2 && pair.every(s => typeof s === "string" && s.trim()), "Incomplete EN/KY translation: " + key)
}
for (const [, key] of app.matchAll(/\btr\("([^"]+)"\)/g)) {
  assert.ok(dictionary[key], "Untranslated active string: " + key)
}
console.log("Locale SEO, static asset paths, metadata, sitemap and translation coverage: OK")
