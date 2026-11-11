// Public anon credential: permits invoking the receiver, never reading lead records.
const LEAD_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtibmh3aXR3dHRjZW12eXNiZWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzOTM4MzgsImV4cCI6MjEwOTk2OTgzOH0.SJ2ZML7BLSH5f2MPpJNoci3IDERopvoh4hLD1corviw"

export type ApplicationDetails = {
  name: string
  phone: string
  teamSize: number
}

// Accept readable international numbers, but send a single canonical format.
export function normalizeApplicationPhone(value: string): string | null {
  const input = value.trim()
  if (!/^\+[\d\s().-]+$/.test(input)) return null
  const normalized = input.replace(/[\s().-]/g, "")
  return /^\+[1-9]\d{6,14}$/.test(normalized) ? normalized : null
}

export function createApplicationEmail(details: ApplicationDetails) {
  const message = `Имя: ${details.name}\nТелефон: ${details.phone}\nКоличество человек в организации: ${details.teamSize}\n\nИсточник: aichuuu.co`
  const subject = encodeURIComponent("Заявка с сайта aichuuu.co")
  return {
    message,
    mailto: `mailto:aichurekmilashka@icloud.com?subject=${subject}&body=${encodeURIComponent(message)}`,
  }
}

export async function sendApplicationRequest(formData: FormData, fetchRequest: typeof fetch = fetch) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)
  try {
    const response = await fetchRequest("https://kbnhwitwttcemvysbeco.supabase.co/functions/v1/submit-lead", {
      method: "POST",
      body: JSON.stringify({ id: formData.get("id"), name: formData.get("name"), phone: formData.get("phone"), teamSize: Number(formData.get("team_size")), language: formData.get("language"), consent: formData.get("consent") === "true", botcheck: formData.has("botcheck") }),
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${LEAD_ANON_KEY}`, apikey: LEAD_ANON_KEY },
      signal: controller.signal,
    })
    const result: unknown = await response.json()
    if (!response.ok || !result || typeof result !== "object" || !("success" in result) || result.success !== true) {
      throw new Error("Application submission failed")
    }
  } finally {
    clearTimeout(timeout)
  }
}
