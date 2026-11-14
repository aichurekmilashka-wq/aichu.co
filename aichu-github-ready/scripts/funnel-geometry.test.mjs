import test from "node:test"
import assert from "node:assert/strict"
import { funnelRibbon, ribbonPoint } from "../src/lib/sales-funnel-geometry.ts"

test("five spiral turns meet exactly at both ribbon edges", () => {
  assert.equal(funnelRibbon.length, 5)
  for (let i = 0; i < 5; i++) {
    const { front, back } = funnelRibbon[i]
    assert.deepEqual(front.end, back.start)
    if (i < 4) assert.deepEqual(back.end, funnelRibbon[i + 1].front.start)
    for (const section of [front, back]) {
      assert.ok(section.face.endsWith(" Z"))
      assert.ok(!section.upper.includes("Z"), "upper edge must not add a vertical closing seam")
      assert.ok(!section.lower.includes("Z"), "lower edge must not add a vertical closing seam")
    }
  }
})

test("entire tapered ribbon and leak targets stay inside the SVG viewport", () => {
  for (let i = 0; i <= 1000; i++) {
    const point = ribbonPoint(i / 200)
    assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y))
    assert.ok(point.halfWidth > 0)
    assert.ok(point.x > 0 && point.x < 700)
    assert.ok(point.y - point.halfWidth > 0 && point.y + point.halfWidth < 790)
  }
  for (const tier of funnelRibbon) {
    assert.ok(tier.holeX - 32 > 0 && tier.holeX + 32 < 700)
    assert.ok(tier.holeY - 34 > 0 && tier.holeY + 34 < 790)
  }
  assert.ok(ribbonPoint(5).x - 350 < ribbonPoint(0).x - 350)
})
