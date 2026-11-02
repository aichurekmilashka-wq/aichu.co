import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"

export default function App() {
  return (
    <main id="top" className="min-h-screen bg-[#07142D] text-[#F4EAF0]">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-7 md:px-12">
        <span className="text-[10px] uppercase tracking-[.2em] text-[#F4EAF0]/65">Digital intelligence studio</span>
      </header>

      {/* The original interactive halftone wordmark now IS the hero, not a footer below it. */}
      <section aria-label="Интерактивный логотип aichu.co" className="w-full">
        <HalftoneWordmarkFooter
          wordmark="aichu.co"
          label="AICHU / TECHNOLOGY STUDIO"
          meta="B2B SOFTWARE · AI & ANALYTICS"
          backToTop={false}
          palette={{ background: "#07142D", ink: "#F4EAF0", warm: "#FA347D" }}
          dotGap={6}
          radius={80}
          crop={0.05}
          grain={0.25}
          height="clamp(460px, 74svh, 850px)"
          columns={[
            { title: "Продукты", links: [{ label: "Sales Intelligence", href: "#products" }, { label: "CRM Quality Control", href: "#products" }] },
            { title: "Решения", links: [{ label: "Price & Margin", href: "#products" }, { label: "AI Conversation", href: "#products" }] },
            { title: "Студия", links: [{ label: "Наш подход", href: "#about" }, { label: "Контакты", href: "#about" }] },
          ]}
        />
      </section>

      <section id="about" className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 pb-14 pt-12 md:px-12">
        <span className="text-[11px] uppercase tracking-[.28em] text-[#FA347D]">AICHU.CO / DIGITAL INTELLIGENCE</span>
        <p className="max-w-2xl text-xl leading-relaxed md:text-3xl">
          Разрабатываем B2B SaaS-продукты для аналитики продаж, контроля CRM и автоматизации бизнеса.
        </p>
        <span id="products" className="text-xs uppercase tracking-[.18em] text-[#F4EAF0]/45">4 SaaS-продукта · Индивидуальные решения</span>
      </section>
    </main>
  )
}
