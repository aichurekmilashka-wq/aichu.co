import assert from "node:assert/strict"
import fs from "node:fs/promises"
import { chromium } from "playwright"

const output = new URL("../browser-results/", import.meta.url)
await fs.mkdir(output, { recursive: true })
const results = { viewports: [], forms: [], languages: [], errors: [], failedRequests: [] }
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
  await page.screenshot({ path: new URL(name + ".png", output).pathname })
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
        await page.getByLabel("Номер телефона", { exact: true }).fill("abcdefg")
        await page.getByRole("button", { name: "Подготовить письмо", exact: true }).click()
        assert.equal(await page.locator('input[type="tel"]').evaluate(e => e.validity.valid), false)
        await page.getByLabel("Номер телефона", { exact: true }).fill("+996 (503) 030-997")
        assert.equal(await page.locator('input[type="tel"]').evaluate(e => e.validity.valid), true)
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
    { code: "en", open: "Open request form", phone: "Phone number", prepare: "Prepare email", close: "Close" },
    { code: "ky", open: "Өтүнмө формасын ачуу", phone: "Телефон номери", prepare: "Кат даярдоо", close: "Жабуу" },
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
  for (const success of [false, true]) {
    const context = await browser.newContext()
    const page = await context.newPage()
    let intercepted = 0
    await page.route("https://api.web3forms.com/submit", route => {
      intercepted++
      return route.fulfill({ status: success ? 200 : 503, contentType: "application/json", body: JSON.stringify({ success }) })
    })
    await page.goto("http://127.0.0.1:4174/", { waitUntil: "networkidle" })
    const decline = page.getByRole("button", { name: "Отклонить", exact: true })
    if (await decline.isVisible()) await decline.click()
    await page.getByRole("button", { name: "Открыть анкету", exact: true }).click()
    await page.getByLabel("Ваше имя", { exact: true }).fill("QA demo")
    await page.getByLabel("Номер телефона", { exact: true }).fill("+996 (503) 030-997")
    await page.getByLabel("Количество человек в организации", { exact: true }).fill("10")
    await page.getByRole("button", { name: "Отправить", exact: true }).click()
    if (success) {
      await page.getByRole("status").filter({ hasText: "Заявка отправлена" }).waitFor()
    } else {
      await page.getByRole("alert").filter({ hasText: "Не удалось подтвердить" }).waitFor()
      assert.equal(await page.getByLabel("Ваше имя", { exact: true }).inputValue(), "QA demo")
      await page.getByRole("button", { name: "Скопировать текст", exact: true }).click()
      await page.getByRole("status").waitFor()
    }
    assert.equal(intercepted, 1)
    results.forms.push({ successResponse: success, intercepted })
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
