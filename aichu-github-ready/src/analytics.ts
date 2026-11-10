// GA4 loads only after an explicit analytics consent.
const measurementId = (import.meta.env.VITE_GA4_MEASUREMENT_ID || "").trim()
let initialized = false
let active = false

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
  }
}

export function isAnalyticsConfigured(): boolean {
  return /^G-[A-Z0-9]+$/.test(measurementId)
}

export function initAnalytics(): void {
  if (!isAnalyticsConfigured() || localStorage.getItem("aichu-analytics-consent") !== "accepted") return
  active = true
  // Re-enabling consent should resume tracking without loading the library twice.
  Object.assign(window, { ["ga-disable-" + measurementId]: false })
  if (initialized) {
    window.gtag?.("consent", "update", { analytics_storage: "granted" })
    return
  }
  initialized = true
  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args) }
  window.gtag("js", new Date())
  window.gtag("config", measurementId, { send_page_view: true })
  const script = document.createElement("script")
  script.async = true
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId)
  document.head.appendChild(script)
}

export function pauseAnalytics(): void {
  active = false
  if (!initialized) return
  Object.assign(window, { ["ga-disable-" + measurementId]: true })
  window.gtag?.("consent", "update", { analytics_storage: "denied" })
}

export function trackEvent(eventName: string, parameters: Record<string, string>): void {
  if (initialized && active) window.gtag?.("event", eventName, parameters)
}
