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
    const response = await fetchRequest("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
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
