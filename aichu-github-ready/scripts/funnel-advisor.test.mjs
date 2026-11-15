import test from "node:test"
import assert from "node:assert/strict"
import { FUNNEL_STAGES, analyzeFunnel, validateFunnel } from "../src/lib/funnel-analysis.ts"

test("requires all five stages", () => {
  assert.equal(FUNNEL_STAGES.length, 5)
  assert.match(validateFunnel(["100", "80", "", "40", "10"]), /Заполните/)
  assert.equal(validateFunnel(["100", "80", "60", "40", "10"]), null)
})

test("blocks invalid and increasing stage values", () => {
  assert.match(validateFunnel(["10", "11", "8", "5", "3"]), /не может превышать/)
  assert.match(validateFunnel(["10", "-1", "0", "0", "0"]), /неотрицательное/)
  assert.match(validateFunnel(["10", "5.5", "0", "0", "0"]), /целое/)
  assert.match(validateFunnel(["100000000", "10", "5", "3", "1"]), /99 999 999/)
  assert.throws(() => analyzeFunnel([2, 5, 1, 0, 0]), /Invalid/)
})

test("computes cohort conversion and identifies largest loss", () => {
  const result = analyzeFunnel([120, 82, 61, 35, 19])
  assert.equal(result.total, 120)
  assert.equal(result.paid, 19)
  assert.equal(result.conversion, 19 / 120 * 100)
  assert.equal(result.lostTotal, 101)
  assert.deepEqual(result.transitions.map(t => t.lost), [38, 21, 26, 16])
  assert.equal(result.mainLeakIndex, 0)
  assert.equal(result.weakestRateIndex, 3)
})

test("handles empty and complete cohorts without fabricated conversion", () => {
  const empty = analyzeFunnel([0, 0, 0, 0, 0])
  assert.equal(empty.conversion, null)
  assert.equal(empty.mainLeakIndex, null)
  assert.equal(empty.weakestRateIndex, null)
  assert.equal(empty.transitions[0].conversion, null)
  const full = analyzeFunnel([5, 5, 5, 5, 5])
  assert.equal(full.conversion, 100)
  assert.equal(full.mainLeakIndex, null)
})
