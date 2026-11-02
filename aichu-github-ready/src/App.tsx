import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"

export default function App() {
  return (
    <main id="top" className="min-h-screen bg-[#07142D] text-[#F4EAF0]">
      {/* The original interactive halftone wordmark now IS the hero, not a footer below it. */}
      <section aria-label="Интерактивный логотип aichu.co" className="w-full">
        <HalftoneWordmarkFooter
          wordmark="aichu.co"
          label="DIGITAL INTELLIGENCE STUDIO"
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
        <span className="text-xs uppercase tracking-[.18em] text-[#F4EAF0]/45">4 SaaS-продукта · Индивидуальные решения</span>
      </section>

      <section id="products" className="mx-auto max-w-[1440px] px-6 pb-28 pt-8 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#F4EAF0]/15 pb-7">
          <div>
            <span className="text-[11px] uppercase tracking-[.28em] text-[#FA347D]">01 / НАШИ ПРОДУКТЫ</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Интеллект в каждом решении<span className="text-[#FA347D]">.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#F4EAF0]/60">Четыре B2B SaaS-продукта для решений на основе данных, а не догадок.</p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[#F4EAF0]/15 bg-[#F4EAF0]/15 md:grid-cols-2">
          {[
            { number: "01", name: "Sales Intelligence Platform", tag: "SALES / KPI", description: "Аналитика продаж, прибыли и ключевых показателей в единой системе.", features: ["Продажи и прибыль", "KPI и динамика", "Разграничение доступа"] },
            { number: "02", name: "CRM Quality Control", tag: "CRM / PERFORMANCE", description: "Контроль качества работы с клиентами и эффективности воронки продаж.", features: ["Юнит-экономика и цикл сделки", "Скорость обработки заявок", "Воронка и потери лидов"] },
            { number: "03", name: "Price & Margin Intelligence", tag: "PRICING / MARGIN", description: "Инструменты контроля цен и защиты маржинальности бизнеса.", features: ["Мониторинг цен", "Анализ поставщиков", "Контроль маржинальности"] },
            { number: "04", name: "AI Conversation Intelligence", tag: "AI / COMMUNICATION", description: "Анализ клиентских переписок для оценки качества коммуникации менеджеров.", features: ["Анализ переписок", "Качество работы менеджеров", "Выявление проблем в коммуникации"] },
          ].map((product) => (
            <article key={product.number} className="group flex min-h-[370px] flex-col justify-between bg-[#07142D] p-7 transition-colors duration-300 hover:bg-[#0B1C3B] md:p-10">
              <div>
                <div className="mb-10 flex items-center justify-between text-xs tracking-[.2em]">
                  <span className="text-[#FA347D]">{product.number} / 04</span>
                  <span className="text-[#F4EAF0]/40">{product.tag}</span>
                </div>
                <h3 className="max-w-md text-2xl font-medium leading-tight tracking-tight md:text-3xl">{product.name}</h3>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[#F4EAF0]/65">{product.description}</p>
              </div>
              <div className="mt-10 flex flex-wrap gap-2">
                {product.features.map((feature) => <span key={feature} className="border border-[#F4EAF0]/20 px-3 py-2 text-[11px] text-[#F4EAF0]/75">{feature}</span>)}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm text-[#F4EAF0]/60">
          <p>Стоимость рассчитывается индивидуально под объём данных, интеграции и задачи.</p>
          <span className="text-[#FA347D]">AICHU.CO / B2B SOFTWARE</span>
        </div>
      </section>
    </main>
  )
}
