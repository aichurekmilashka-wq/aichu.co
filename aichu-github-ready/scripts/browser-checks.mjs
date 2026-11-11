import assert from "node:assert/strict"
import fs from "node:fs/promises"
import { chromium } from "playwright"

const output = new URL("../browser-results/", import.meta.url)
await fs.mkdir(output, { recursive: true })
const results = { viewports: [], forms: [], languages: [], screenshots: [], errors: [], failedRequests: [] }
// Observe the public response from the CI runner as well as the development
// environment, whose network proxy may alter HTTP headers. No visitor data.
results.publishedSecurity = []
for (const url of ["https://aichuuu.com/ru/", "https://aichuuu.com/.env", "https://aichuuu.com/.git/HEAD"]) {
  try {
    const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15_000), redirect: "follow" })
    const headers = Object.fromEntries(["strict-transport-security", "content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"].map(name => [name, response.headers.get(name)]))
    results.publishedSecurity.push({ url, status: response.status, headers })
  } catch (error) {
    results.publishedSecurity.push({ url, error: String(error) })
  }
}
for (const port of [4173, 4174]) {
  let ready = false
  for (let attempt = 0; attempt < 50; attempt++) {
    try { ready = (await fetch(`http://127.0.0.1:${port}/`)).ok } catch { /* preview is starting */ }
    if (ready) break
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  assert.ok(ready, `Preview server ${port} did not start`)
}
const browser = await chromium.launch()
const sizes = [[320, 568], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]
const failure = []

async function save(page, name) {
  // Let native smooth scrolling settle before judging clipped/sticky elements.
  await page.evaluate(async () => {
    let last = scrollY, stable = 0
    for (let frame = 0; frame < 120 && stable < 4; frame++) {
      await new Promise(resolve => requestAnimationFrame(resolve))
      stable = scrollY === last ? stable + 1 : 0
      last = scrollY
    }
  })
  await page.screenshot({ path: new URL(name + ".png", output).pathname, animations: "disabled" })
  const snapshot = await page.evaluate(name => {
    const nav = document.querySelector(".nimbus-nav").getBoundingClientRect()
    const header = document.querySelector("header").getBoundingClientRect()
    return { name, scrollY, nav: { top: nav.top, bottom: nav.bottom }, header: { top: header.top, bottom: header.bottom }, viewportOffset: visualViewport?.offsetTop }
  }, name)
  results.screenshots.push(snapshot)
  assert.ok(snapshot.nav.top - (snapshot.viewportOffset || 0) >= -1, `Navigation is clipped in ${name}: ${JSON.stringify(snapshot)}`)
}
async function noOverflow(page) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }))
  assert.ok(dimensions.content <= dimensions.width, JSON.stringify(dimensions))
}
try {
  for (const [width, height] of sizes) {
    const touch = width <= 1024
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, isMobile: touch })
    const page = await context.newPage()
    page.setDefaultTimeout(10_000)
    const record = { width, height, touch, states: [] }
    results.viewports.push(record)
    page.on("pageerror", error => results.errors.push({ width, message: error.message }))
    page.on("requestfailed", request => results.failedRequests.push({ width, url: request.url(), error: request.failure()?.errorText }))
    try {
      await page.goto("http://127.0.0.1:4173/ru/", { waitUntil: "networkidle" })
      const decline = page.getByRole("button", { name: "Отклонить", exact: true })
      if (await decline.isVisible()) await decline.click()
      for (const theme of ["dark", "light"]) {
        if (theme === "light") await page.getByRole("button", { name: "Включить светлую тему" }).click()
        assert.equal(await page.locator(".sl-headline strong").evaluate(e => getComputedStyle(e).color), theme === "light" ? "rgb(138, 96, 0)" : "rgb(253, 194, 30)")
        await noOverflow(page)
        await save(page, `${width}-${theme}-hero`)
        await page.locator('#problem').scrollIntoViewIfNeeded()
        await noOverflow(page)
        await save(page, `${width}-${theme}-funnel`)
        // Actual touch events on mobile contexts, separate from desktop hover.
        const stage = page.locator(".sl-stage-tabs button").nth(2)
        if (await stage.isVisible()) {
          if (touch) await stage.tap(); else await stage.click()
        } else {
          const face = page.locator(".sl-tier").nth(2)
          if (touch) await face.tap(); else await face.click()
        }
        await assert.equal(await page.locator(".sl-card h3").innerText(), "Персональное предложение")
        const visual = page.locator(".sl-visual")
        if (!touch) {
          await visual.hover()
          assert.equal(await page.locator("#problem").evaluate(e => e.classList.contains("sl-paused")), false)
          await page.mouse.move(width - 1, 1)
          await page.waitForTimeout(100)
          assert.equal(await page.locator("#problem").evaluate(e => e.classList.contains("sl-paused")), true)
        }
        await page.getByRole("button", { name: "Открыть анкету", exact: true }).click()
        await page.getByLabel("Ваше имя", { exact: true }).fill("QA demo")
        await page.getByLabel("Количество человек в организации", { exact: true }).fill("10")
        await page.getByLabel("Номер телефона", { exact: true }).fill("abcdefg")
        await page.getByRole("button", { name: "Отправить", exact: true }).click()
        assert.equal(await page.locator('input[type="tel"]').evaluate(e => e.validity.valid), false)
        await page.getByLabel("Номер телефона", { exact: true }).fill("+996 (503) 030-997")
        assert.equal(await page.locator('input[type="tel"]').evaluate(e => e.validity.valid), true)
        assert.equal(await page.locator('input[name="consent"]').isChecked(), false)
        assert.equal(await page.locator('input[name="consent"]').evaluate(e => e.validity.valid), false)
        await save(page, `${width}-${theme}-form`)
        await page.getByRole("button", { name: "Закрыть", exact: true }).click()
        await page.locator("#products").scrollIntoViewIfNeeded()
        await page.locator(".rz-root").waitFor()
        await noOverflow(page)
        await save(page, `${width}-${theme}-rezon`)
        await page.evaluate(() => window.scrollTo(0, 0))
        record.states.push(theme)
      }
    } catch (error) {
      record.failure = String(error)
      failure.push(`${width}×${height}: ${error}`)
      await save(page, `${width}-failure`)
    } finally { await context.close() }
  }
  for (const locale of [
    { code: "en", open: "Open request form", phone: "Phone number", prepare: "Send request", close: "Close" },
    { code: "ky", open: "Өтүнмө формасын ачуу", phone: "Телефон номери", prepare: "Жөнөтүү", close: "Жабуу" },
  ]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
    const page = await context.newPage()
    await page.goto(`http://127.0.0.1:4173/${locale.code}/`, { waitUntil: "networkidle" })
    await page.getByRole("button", { name: locale.open, exact: true }).tap()
    await page.getByLabel(locale.phone, { exact: true }).fill("abcdefg")
    await page.getByRole("button", { name: locale.prepare, exact: true }).click()
    assert.equal(await page.locator('input[type="tel"]').evaluate(e => e.validity.valid), false)
    await save(page, `390-${locale.code}-validation`)
    await page.getByRole("button", { name: locale.close, exact: true }).click()
    results.languages.push(locale.code)
    await context.close()
  }
  // Connected path: every outbound delivery request is intercepted locally.
  for (const responseStatus of [503, 200, 429]) {
    const success = responseStatus === 200
    const context = await browser.newContext()
    const page = await context.newPage()
    let intercepted = 0
    await page.route("https://kbnhwitwttcemvysbeco.supabase.co/functions/v1/submit-lead", route => {
      intercepted++
      return route.fulfill({ status: responseStatus, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ success }) })
    })
    await page.goto("http://127.0.0.1:4174/", { waitUntil: "networkidle" })
    const decline = page.getByRole("button", { name: "Отклонить", exact: true })
    if (await decline.isVisible()) await decline.click()
    await page.getByRole("button", { name: "Открыть анкету", exact: true }).click()
    const testName = success ? "QA demo" : '<img src=x onerror="window.__aichuSecurityProbe=1">'
    await page.getByLabel("Ваше имя", { exact: true }).fill(testName)
    await page.getByLabel("Номер телефона", { exact: true }).fill("+996 (503) 030-997")
    await page.getByLabel("Количество человек в организации", { exact: true }).fill("10")
    await page.locator('input[name="consent"]').check()
    await page.getByRole("button", { name: "Отправить", exact: true }).click()
    if (success) {
      await page.getByRole("status").filter({ hasText: "Заявка отправлена" }).waitFor()
      assert.equal(await page.locator("#application-phone-error").count(), 0)
      assert.equal(await page.getByRole("button", { name: "Отправлено", exact: true }).isDisabled(), true)
    } else {
      await page.getByRole("alert").filter({ hasText: responseStatus === 429 ? "Достигнут лимит" : "Не удалось подтвердить" }).waitFor()
      assert.equal(await page.getByLabel("Ваше имя", { exact: true }).inputValue(), testName)
      assert.ok((await page.getByLabel("Текст письма", { exact: true }).inputValue()).includes(testName))
      assert.equal(await page.locator("dialog img").count(), 0)
      assert.equal(await page.evaluate(() => window.__aichuSecurityProbe), undefined)
      await page.getByRole("button", { name: "Скопировать текст", exact: true }).click()
      await page.getByRole("status").waitFor()
    }
    assert.equal(intercepted, 1)
    results.forms.push({ successResponse: success, responseStatus, intercepted })
    await save(page, `delivery-${success ? "success" : "error"}`)
    await context.close()
  }
  assert.equal(results.errors.length, 0, JSON.stringify(results.errors))
  assert.equal(failure.length, 0, failure.join("\n"))
} catch (error) {
  failure.push(String(error))
} finally {
  results.failures = failure
  await fs.writeFile(new URL("results.json", output), JSON.stringify(results, null, 2))
  await browser.close()
}
console.log(JSON.stringify(results, null, 2))
if (failure.length) process.exitCode = 1
