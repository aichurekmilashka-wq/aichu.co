export type RibbonPoint = { x: number; y: number; halfWidth: number }

// One projected helix shared by all five stages, rather than five closed cups.
export function ribbonPoint(turn: number): RibbonPoint {
  const angle = turn * Math.PI * 2
  const radius = 260 - 36 * turn
  return {
    x: 350 + radius * Math.cos(angle),
    y: 140 + 108 * turn + (40 - 4 * turn) * Math.sin(angle),
    halfWidth: 40 - 1.8 * turn,
  }
}

export function ribbonSection(start: number, end: number) {
  const points = Array.from({ length: 65 }, (_, i) => ribbonPoint(start + (end - start) * i / 64))
  const edge = (side: number) => points.map(p => `${p.x.toFixed(3)} ${(p.y + side * p.halfWidth).toFixed(3)}`)
  const upper = edge(-1)
  const lower = edge(1)
  return {
    face: `M${upper.join(" L")} L${[...lower].reverse().join(" L")} Z`,
    // Separate edges deliberately omit closing strokes at stage boundaries.
    upper: `M${upper.join(" L")}`,
    lower: `M${lower.join(" L")}`,
    start: points[0],
    end: points[points.length - 1],
  }
}

export const funnelRibbon = Array.from({ length: 5 }, (_, i) => {
  const front = ribbonSection(i, i + .5)
  const back = ribbonSection(i + .5, i + 1)
  const holeSide = i % 2 === 0 ? -1 : 1
  const hole = ribbonPoint(i + (holeSide < 0 ? .41 : .09))
  const labelY = ribbonPoint(i + .25).y
  const endX = holeSide < 0 ? 35 + i * 20 : 665 - i * 10
  const leak = `M${hole.x} ${hole.y} C${hole.x + holeSide * 42} ${hole.y - 12} ${endX - holeSide * 44} ${hole.y + 32} ${endX} ${hole.y + 40}`
  return { front, back, holeX: hole.x, holeY: hole.y, holeSide, labelY, leak }
})
