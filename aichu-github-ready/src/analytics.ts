// Analytics providers are disabled until the visitor explicitly consents.
const measurementId = (import.meta.env.VITE_GA4_MEASUREMENT_ID || "").trim()
const yandexCounter = (import.meta.env.VITE_YANDEX_METRIKA_ID || "").trim()
const metrikaId = /^\d{5,12}$/.test(yandexCounter) ? Number(yandexCounter) : null
let googleInitialized = false
let metrikaInitialized = false
let active = false

type YmFn = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number }

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
    ym?: YmFn
  }
}

export function isYandexMetricaConfigured(): boolean {
  return metrikaId !== null
}

export function isGoogleAnalyticsConfigured(): boolean {
  return /^G-[A-Z0-9]+$/.test(measurementId)
}

export function isAnalyticsConfigured(): boolean {
  return isGoogleAnalyticsConfigured() || isYandexMetricaConfigured()
}

export function initAnalytics(): void {
  if (!isAnalyticsConfigured() || localStorage.getItem("aichu-analytics-consent") !== "accepted") return
  active = true

  if (isGoogleAnalyticsConfigured()) {
    Object.assign(window, { ["ga-disable-" + measurementId]: false })
    if (!googleInitialized) {
      googleInitialized = true
      window.dataLayer = window.dataLayer || []
      window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args) }
      window.gtag("js", new Date())
      window.gtag("config", measurementId, { send_page_view: true })
      const script = document.createElement("script")
      script.async = true
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId)
      document.head.appendChild(script)
    } else {
      window.gtag?.("consent", "update", { analytics_storage: "granted" })
    }
  }

  if (metrikaId !== null && !metrikaInitialized) {
    metrikaInitialized = true
    // The official Metrica API queues commands until tag.js has loaded.
    const ymQueue = ((...args: unknown[]) => { (ymQueue.a ??= []).push(args) }) as YmFn
    ymQueue.l = Date.now()
    window.ym = ymQueue

    const script = document.createElement("script")
    script.async = true
    script.src = "https://mc.yandex.ru/metrika/tag.js"
    document.head.appendChild(script)
    // Webvisor and click maps are intentionally off: we only need visits and named goals.
    window.ym(metrikaId, "init", {
      clickmap: false,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
    })
  }
}

export function pauseAnalytics(): void {
  active = false
  if (googleInitialized) {
    Object.assign(window, { ["ga-disable-" + measurementId]: true })
    window.gtag?.("consent", "update", { analytics_storage: "denied" })
  }
  // Metrica has no guaranteed client-side teardown. The consent UI reloads
  // the document after revocation to ensure the script stops running.
}

export function trackEvent(eventName: string, parameters: Record<string, string>): void {
  if (!active) return
  if (googleInitialized) window.gtag?.("event", eventName, parameters)

  if (metrikaInitialized && metrikaId !== null) {
    const goal = eventName === "contact_click" && /^(phone|email|telegram)$/.test(parameters.contact_method || "")
      ? "contact_" + parameters.contact_method
      : eventName === "product_navigation" ? "product_navigation" : null
    if (goal) window.ym?.(metrikaId, "reachGoal", goal, parameters)
  }
}
