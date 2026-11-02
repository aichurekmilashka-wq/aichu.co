import { useEffect, useState } from "react"
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"

export default function App() {
  const [section, setSection] = useState("about")
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => {
      const about = document.getElementById("about")
      const products = document.getElementById("products")
      setVisible(Boolean(about && about.getBoundingClientRect().top < window.innerHeight * 0.5))
      setSection(products && products.getBoundingClientRect().top < window.innerHeight * 0.5 ? "products" : "about")
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update) }
  }, [])
  return (
    <main id="top" className="min-h-screen bg-[#07142D] text-[#F4EAF0]">
      <aside aria-label="Навигация" className={`fixed left-0 top-0 z-40 hidden h-screen w-56 border-r border-[#F4EAF0]/10 bg-[#07142D]/95 px-5 py-10 backdrop-blur-xl transition-transform duration-500 lg:flex lg:flex-col ${visible ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-12 text-xl font-semibold tracking-tight">aichu<span className="text-[#FA347D]">.co</span></div>
        <p className="mb-10 text-xs leading-relaxed text-[#F4EAF0]/45">DIGITAL INTELLIGENCE STUDIO</p>
        <nav className="flex flex-col gap-2">
          {[{id:"about",number:"01",label:"Студия"},{id:"products",number:"02",label:"Продукты"}].map(item => (
            <a key={item.id} href={`#${item.id}`} aria-current={section === item.id ? "location" : undefined}
              className={`flex items-center gap-4 rounded-lg px-3 py-4 text-sm transition-colors ${section === item.id ? "bg-[#F4EAF0]/10 text-[#F4EAF0]" : "text-[#F4EAF0]/50 hover:bg-[#F4EAF0]/5 hover:text-[#F4EAF0]"}`}>
              <span className="text-xs text-[#FA347D]">{item.number}</span>{item.label}
            </a>
          ))}
        </nav>
        <a href="#products" className="mt-auto rounded-full bg-[#FA347D] px-4 py-3 text-center text-sm font-semibold text-[#07142D] transition hover:brightness-110">Наши решения</a>
      </aside>
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

      <div className="relative lg:pl-56">
      <section id="about" className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 pb-14 pt-12 md:px-12">
        <span className="text-[11px] uppercase tracking-[.28em] text-[#FA347D]">AICHU.CO / DIGITAL INTELLIGENCE</span>
        <p className="max-w-2xl text-xl leading-relaxed md:text-3xl">
          Разрабатываем B2B SaaS-продукты для аналитики продаж, контроля CRM и автоматизации бизнеса.
        </p>
        <span className="text-xs uppercase tracking-[.18em] text-[#F4EAF0]/45">4 SaaS-продукта · Индивидуальные решения</span>
      </section>

      <section aria-label="Схема цифровой аналитики" className="mx-auto max-w-[1440px] px-6 pb-16 md:px-12">
        <div className="relative overflow-hidden rounded-2xl border border-[#F4EAF0]/15 bg-[#091932] p-5 md:p-10" style={{backgroundImage:"linear-gradient(#F4EAF009 1px, transparent 1px), linear-gradient(90deg, #F4EAF009 1px, transparent 1px)",backgroundSize:"32px 32px"}}>
          <div className="mb-12 flex items-center justify-between gap-3 text-[10px] tracking-[.2em] text-[#FA347D]"><span>INTELLIGENCE / SYSTEM MAP</span><span className="border border-[#FA347D]/50 px-3 py-2">4 MODULES</span></div>
          <svg viewBox="0 0 900 330" role="img" aria-label="Четыре аналитических модуля соединены потоками данных" className="h-auto w-full">
            <defs><pattern id="dots" width="13" height="13" patternUnits="userSpaceOnUse"><rect x="3" y="3" width="4" height="8" fill="#FA347D" opacity=".85"/></pattern></defs>
            <g stroke="#FA347D" strokeWidth="1.5" fill="none" opacity=".7"><path d="M160 90 L450 165 L740 90 M160 240 L450 165 L740 240" strokeDasharray="5 8"/><rect x="340" y="105" width="220" height="120" rx="3"/><path d="M160 90 V240 M740 90 V240"/></g>
            {[{x:95,y:35,t:"SALES"},{x:675,y:35,t:"CRM"},{x:95,y:215,t:"MARGIN"},{x:675,y:215,t:"AI"}].map(n=><g key={n.t}><rect x={n.x} y={n.y} width="125" height="80" fill="url(#dots)"/><text x={n.x} y={n.y-10} fill="#F4EAF0" fontSize="13" fontFamily="monospace">{n.t}</text></g>)}
            <text x="450" y="155" textAnchor="middle" fill="#FA347D" fontSize="14" fontFamily="monospace">AICHU.CO</text><text x="450" y="181" textAnchor="middle" fill="#F4EAF0" fontSize="12" fontFamily="monospace">DATA → DECISIONS</text>
            <circle cx="450" cy="105" r="4" fill="#FA347D"/><circle cx="450" cy="225" r="4" fill="#FA347D"/>
          </svg>
          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[#F4EAF0]/15 pt-5 text-[10px] tracking-[.14em] text-[#F4EAF0]/50"><span>01 / COLLECT</span><span>02 / ANALYZE</span><span>03 / OPTIMIZE</span><span>04 / ACT</span></div>
        </div>
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
      </div>
    </main>
  )
}
