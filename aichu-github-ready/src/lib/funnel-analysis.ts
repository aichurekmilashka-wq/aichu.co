export const FUNNEL_STAGES = [
  "Обращения",
  "Контакт установлен",
  "Потребность выявлена",
  "Предложение отправлено",
  "Оплачено",
] as const

export type FunnelTransition = {
  from: number
  to: number
  lost: number
  conversion: number | null
  lossRate: number | null
}

export type FunnelAnalysis = {
  total: number
  paid: number
  conversion: number | null
  lostTotal: number
  transitions: FunnelTransition[]
  mainLeakIndex: number | null
  weakestRateIndex: number | null
}

export function validateFunnel(values: readonly string[]): string | null {
  if (values.length !== FUNNEL_STAGES.length) return "Требуется пять этапов."
  if (values.some(value => value.trim() === "")) return "Заполните численность каждого этапа."
  if (values.some(value => !/^\d{1,8}$/.test(value.trim()))) {
    return "Вводите целое неотрицательное число до 99 999 999."
  }
  const counts = values.map(Number)
  for (let i = 1; i < counts.length; i++) {
    if (counts[i] > counts[i - 1]) {
      return "Число на этапе «" + FUNNEL_STAGES[i] + "» не может превышать предыдущий этап. Используйте одну когорту заявок."
    }
  }
  return null
}

export function analyzeFunnel(counts: readonly number[]): FunnelAnalysis {
  if (counts.length !== FUNNEL_STAGES.length ||
      counts.some(count => !Number.isSafeInteger(count) || count < 0 || count > 99_999_999) ||
      counts.some((count, i) => i > 0 && count > counts[i - 1])) {
    throw new Error("Invalid funnel cohort")
  }
  const transitions: FunnelTransition[] = counts.slice(1).map((to, i) => {
    const from = counts[i]
    return {
      from,
      to,
      lost: from - to,
      conversion: from > 0 ? (to / from) * 100 : null,
      lossRate: from > 0 ? ((from - to) / from) * 100 : null,
    }
  })
  const ranked = transitions.map((item, i) => ({ ...item, i }))
    .filter(item => item.from > 0 && item.lost > 0)
  const biggest = ranked.length ? [...ranked].sort((a, b) => b.lost - a.lost || a.i - b.i)[0].i : null
  const weakest = ranked.length ? [...ranked].sort((a, b) => (b.lossRate || 0) - (a.lossRate || 0) || a.i - b.i)[0].i : null
  return {
    total: counts[0],
    paid: counts[4],
    conversion: counts[0] > 0 ? counts[4] / counts[0] * 100 : null,
    lostTotal: counts[0] - counts[4],
    transitions,
    mainLeakIndex: biggest,
    weakestRateIndex: weakest,
  }
}
