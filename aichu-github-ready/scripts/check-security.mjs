import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import assert from "node:assert/strict"

const out = path.resolve("dist")
const patterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["GitHub credential", /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})/],
  ["Supabase secret key", /sb_secret_[A-Za-z0-9_-]{20,}/],
  ["AWS access key ID", /(?:AKIA|ASIA)[A-Z0-9]{16}/],
]

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    assert.ok(!/^\.env(?:\.|$)/.test(entry.name) && entry.name !== ".git", `Private file in output: ${file}`)
    if (entry.isDirectory()) { await scan(file); continue }
    if (!/\.(?:html|js|css|json|txt|xml|svg|map)$/.test(entry.name)) continue
    const text = await readFile(file, "utf8")
    for (const [kind, pattern] of patterns) {
      // Report the type and path only; never echo a credential into CI logs.
      assert.ok(!pattern.test(text), `Possible ${kind} in ${file}`)
    }
    for (const token of text.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) || []) {
      let role
      try { role = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()).role } catch { continue }
      assert.notEqual(role, "service_role", `Privileged JWT in ${file}`)
    }
  }
}

for (const page of ["index.html", "ru/index.html", "en/index.html", "ky/index.html"]) {
  const html = await readFile(path.join(out, page), "utf8")
  const policy = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1]
  assert.ok(policy, `Missing script policy on ${page}`)
  const directives = new Map(policy.split(";").map(value => value.trim().split(/\s+/)).filter(([name]) => name).map(([name, ...values]) => [name, values]))
  const scripts = directives.get("script-src")
  assert.ok(scripts?.length, `Missing script-src on ${page}`)
  for (const unsafe of ["'unsafe-inline'", "'unsafe-eval'", "*", "https:", "data:", "blob:"]) {
    assert.ok(!scripts.includes(unsafe), `Unsafe script source on ${page}: ${unsafe}`)
  }
  assert.deepEqual(directives.get("object-src"), ["'none'"], `Plugins must be blocked on ${page}`)
  assert.deepEqual(directives.get("frame-src"), ["'none'"], `Frames must be blocked on ${page}`)
  for (const tag of html.match(/<script\b[^>]*>[\s\S]*?<\/script>/g) || []) {
    assert.ok(/\bsrc="[^"<>]+"/.test(tag) && />\s*<\/script>$/.test(tag), `Inline script found on ${page}`)
  }
}
await scan(out)
console.log("Published assets: script policy and known credential patterns checked; no matches.")
