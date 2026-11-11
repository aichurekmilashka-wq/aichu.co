import test from "node:test"
import assert from "node:assert/strict"
import { createApplicationEmail, normalizeApplicationPhone, sendApplicationRequest } from "../src/lib/application.ts"

test("normalizes international numbers without changing country codes", () => {
  assert.equal(normalizeApplicationPhone(" +996 (503) 030-997 "), "+996503030997")
  assert.equal(normalizeApplicationPhone("+7 999 123-45-67"), "+79991234567")
  assert.equal(normalizeApplicationPhone("+44 20 7946 0958"), "+442079460958")
})

test("rejects letters, missing country prefix and numbers outside 7–15 digits", () => {
  for (const value of ["abcdefg", "+996abc503030997", "", "503030997", "+012345678", "+123456", "+1234567890123456", "++996503030997", "+996503030997 ext 1"]) {
    assert.equal(normalizeApplicationPhone(value), null, value)
  }
  assert.equal(normalizeApplicationPhone("+1234567"), "+1234567")
  assert.equal(normalizeApplicationPhone("+123456789012345"), "+123456789012345")
})

test("email fallback encodes the draft instead of treating names as URL parameters", () => {
  const draft = createApplicationEmail({ name: "Анна & Co\nТест", phone: "+996503030997", teamSize: 10 })
  const url = new URL(draft.mailto)
  assert.equal(url.pathname, "aichurekmilashka@icloud.com")
  assert.equal(url.searchParams.get("body"), draft.message)
  assert.equal(url.searchParams.get("subject"), "Заявка с сайта aichuuu.co")
  assert.equal(url.searchParams.size, 2)
})

test("accepts only an explicit successful response; no real request is sent", async () => {
  const form = new FormData()
  form.set("phone", "+996503030997")
  await sendApplicationRequest(form, async (url, options) => {
    assert.equal(url, "https://api.web3forms.com/submit")
    assert.equal(options.method, "POST")
    assert.equal(options.body, form)
    assert.ok(options.signal instanceof AbortSignal)
    return Response.json({ success: true })
  })
  for (const response of [
    Response.json({ success: false }),
    Response.json({ success: true }, { status: 500 }),
    Response.json({}),
    Response.json(null),
    new Response("not json"),
  ]) {
    await assert.rejects(sendApplicationRequest(form, async () => response))
  }
  await assert.rejects(sendApplicationRequest(form, async () => { throw new Error("offline") }))
})

test("aborts an unresponsive request after 20 seconds", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] })
  const request = sendApplicationRequest(new FormData(), async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true })
  }))
  const rejection = assert.rejects(request, /aborted/)
  t.mock.timers.tick(20_000)
  await rejection
})
