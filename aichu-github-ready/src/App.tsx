import { useEffect, useState } from "react"
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"

export default function App() {
  const [section, setSection] = useState("about")
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => {
      const about = document.getElementById("about")
      const ids = ["about", "problem", "how", "practice", "products", "templates", "customers", "questions"]
      setVisible(Boolean(about && about.getBoundingClientRect().top < window.innerHeight * 0.5))
      setSection([...ids].reverse().find(id => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < window.innerHeight * 0.5) ?? "about")
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
          {[{id:"about",number:"01",label:"Overview"},{id:"problem",number:"02",label:"The problem"},{id:"how",number:"03",label:"How it fits"},{id:"practice",number:"04",label:"In practice"},{id:"products",number:"05",label:"Products"},{id:"templates",number:"06",label:"Готовые сайты"},{id:"customers",number:"07",label:"Customers"},{id:"questions",number:"08",label:"Questions"}].map(item => (
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
      <section id="problem" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FA347D]">02 / THE PROBLEM</span>
        <h2 className="mt-5 max-w-3xl text-3xl font-medium md:text-5xl">Когда данные разрознены, решения принимаются вслепую.</h2>
        <div className="mt-8 grid gap-px bg-[#F4EAF0]/15 md:grid-cols-2">
          {["Sales Intelligence: сложно увидеть реальную динамику продаж, прибыли и KPI по одной системе показателей.", "CRM Quality Control: задержки обработки заявок, длинный цикл сделки и потери лидов остаются незаметными.", "Price & Margin Intelligence: изменения цен поставщиков влияют на маржу, пока данные собирают вручную.", "AI Conversation Intelligence: качество переписок менеджеров трудно оценивать последовательно."].map(t=><div key={t} className="bg-[#07142D] p-7 text-sm leading-relaxed text-[#F4EAF0]/70">{t}</div>)}
        </div>
      </section>
      <section id="how" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FA347D]">03 / HOW IT FITS</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">От данных к действиям.</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[["01","Определяем данные","Выбираем необходимые показатели продаж, CRM, цен и коммуникаций под задачи компании."],["02","Настраиваем анализ","Формируем метрики прибыли и KPI, цикл сделки, потери лидов, маржу и качество диалогов."],["03","Применяем результаты","Используем выявленные отклонения для контроля процессов и принятия управленческих решений."]].map(([n,t,d])=><div key={n} className="border border-[#F4EAF0]/15 p-7"><span className="text-[#FA347D]">{n}</span><h3 className="mt-8 text-xl">{t}</h3><p className="mt-3 text-sm text-[#F4EAF0]/60">{d}</p></div>)}
        </div>
      </section>
      <section id="practice" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FA347D]">04 / IN PRACTICE</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">Практические сценарии.</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {[["Sales Intelligence Platform","Сопоставляйте продажи, прибыль и KPI. Разграничивайте доступ к показателям для разных ролей."],["CRM Quality Control","Оценивайте юнит-экономику, длительность сделки, скорость обработки заявок и этапы потери лидов."],["Price & Margin Intelligence","Отслеживайте изменения цен и предложения поставщиков, анализируйте влияние на маржинальность."],["AI Conversation Intelligence","Анализируйте клиентские переписки и качество работы менеджеров, находите проблемные диалоги."]].map(([t,d])=><div key={t} className="border-l-2 border-[#FA347D] bg-[#F4EAF0]/5 p-7"><h3 className="text-xl">{t}</h3><p className="mt-3 text-sm text-[#F4EAF0]/60">{d}</p></div>)}
        </div>
      </section>
      <section id="products" className="mx-auto max-w-[1440px] px-6 pb-28 pt-8 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#F4EAF0]/15 pb-7">
          <div>
            <span className="text-[11px] uppercase tracking-[.28em] text-[#FA347D]">05 / НАШИ ПРОДУКТЫ</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Интеллект в каждом решении<span className="text-[#FA347D]">.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#F4EAF0]/60">Четыре B2B SaaS-продукта для решений на основе данных, а не догадок.</p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[#F4EAF0]/15 bg-[#F4EAF0]/15 md:grid-cols-2">
          [
            { number: "01", name: "Sales Intelligence Platform", tag: "SALES / KPI", problem: "Продажи идут, но непонятно, какие направления и показатели действительно формируют прибыль.", description: "Объединяет аналитику продаж, прибыли и KPI с разграничением доступа.", benefit: "Руководитель видит, где бизнес зарабатывает, где теряет эффективность и на что направить внимание.", features: ["Продажи и прибыль", "KPI и динамика", "Разграничение доступа"] },
            { number: "02", name: "CRM Quality Control", tag: "CRM / PERFORMANCE", problem: "Заявки теряются, сделки затягиваются, а причины просадки воронки остаются скрытыми.", description: "Анализирует юнит-экономику, цикл сделки, скорость обработки, воронку и потери лидов.", benefit: "Команда понимает, на каком этапе теряет клиентов и какие процессы нужно исправить, чтобы лучше использовать входящие заявки.", features: ["Юнит-экономика и цикл сделки", "Скорость обработки заявок", "Воронка и потери лидов"] },
            { number: "03", name: "Price & Margin Intelligence", tag: "PRICING / MARGIN", problem: "Изменения цен и условий поставщиков незаметно сокращают маржу.", description: "Помогает отслеживать цены, предложения поставщиков и маржинальность.", benefit: "Коммерческая команда быстрее замечает риски для прибыли и принимает более обоснованные решения о закупках и ценах.", features: ["Мониторинг цен", "Анализ поставщиков", "Контроль маржинальности"] },
            { number: "04", name: "AI Conversation Intelligence", tag: "AI / COMMUNICATION", problem: "Качество общения менеджеров с клиентами сложно контролировать системно.", description: "Анализирует клиентские переписки и качество работы менеджеров.", benefit: "Руководитель видит повторяющиеся ошибки в диалогах и получает основу для улучшения коммуникации и обучения команды.", features: ["Анализ переписок", "Качество работы менеджеров", "Проблемы в коммуникации"] },
          ].map((product) => (
            <article key={product.number} className="group flex min-h-[520px] flex-col justify-between bg-[#07142D] p-7 transition-colors duration-300 hover:bg-[#0B1C3B] md:p-10">
              <div>
                <div className="mb-10 flex items-center justify-between text-xs tracking-[.2em]">
                  <span className="text-[#FA347D]">{product.number} / 04</span>
                  <span className="text-[#F4EAF0]/40">{product.tag}</span>
                </div>
                <h3 className="max-w-md text-2xl font-medium leading-tight tracking-tight md:text-3xl">{product.name}</h3>
                <div className="mt-6 space-y-5">
                  <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#FA347D]">Проблема</p><p className="max-w-md text-sm leading-relaxed text-[#F4EAF0]/70">{product.problem}</p></div>
                  <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#FA347D]">Решение</p><p className="max-w-md text-sm leading-relaxed text-[#F4EAF0]/70">{product.description}</p></div>
                  <div className="border-l-2 border-[#FA347D] bg-[#FA347D]/[.06] px-4 py-3"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#FA347D]">Выгода для заказчика</p><p className="max-w-md text-sm leading-relaxed text-[#F4EAF0]">{product.benefit}</p></div>
                </div>
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
      <section id="templates" className="mx-auto max-w-[1440px] px-6 pb-28 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#F4EAF0]/15 pb-7">
          <div>
            <span className="text-[11px] uppercase tracking-[.28em] text-[#FA347D]">06 / READY-MADE WEBSITES</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Готовые сайты<span className="text-[#FA347D]">.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#F4EAF0]/60">Выберите готовый дизайн или закажите адаптацию под свой бизнес.</p>
        </div>
        <article className="grid overflow-hidden border border-[#F4EAF0]/20 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex min-h-[310px] flex-col justify-between bg-[#F4EAF0] p-8 text-[#07142D] md:p-12">
            <div className="flex items-start justify-between gap-4 text-[11px] uppercase tracking-[.2em]">
              <span>Template 001</span><span className="rounded-full border border-[#07142D]/25 px-3 py-1">Landing page</span>
            </div>
            <div>
              <p className="mb-3 text-sm uppercase tracking-[.2em] text-[#A62D62]">На основе проекта Nurba</p>
              <h3 className="max-w-lg text-4xl font-semibold leading-tight md:text-5xl">Лендинг для услуг и частной практики</h3>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#07142D]/65">Адаптивный сайт с блоками услуг, информацией о специалисте и контактами. Демонстрация показывает дизайн; персональные данные исходного проекта не входят в продаваемый шаблон.</p>
            </div>
            <a href="https://aichurekmilashka-wq.github.io/Nurba-brat/" target="_blank" rel="noopener noreferrer" className="mt-8 w-fit border-b border-[#07142D] pb-1 text-sm font-semibold transition hover:text-[#A62D62]">Посмотреть демоверсию ↗</a>
          </div>
          <div className="flex flex-col justify-between bg-[#0B1C3B] p-8 md:p-12">
            <div>
              <p className="text-[11px] uppercase tracking-[.2em] text-[#FA347D]">Цены / RUB</p>
              <div className="mt-8 flex items-end gap-3"><strong className="text-5xl font-semibold">2 000 ₽</strong><span className="pb-1 text-sm text-[#F4EAF0]/55">готовый шаблон</span></div>
              <div className="mt-8 divide-y divide-[#F4EAF0]/15 border-y border-[#F4EAF0]/15 text-sm">
                <div className="flex justify-between gap-4 py-4"><span>Шаблон (файлы сайта)</span><span className="shrink-0">2 000 ₽</span></div>
                <div className="flex justify-between gap-4 py-4"><span>Замена текста, фото и контактов</span><span className="shrink-0">10 000 ₽</span></div>
                <div className="flex justify-between gap-4 py-4"><span>Под ключ с доменом и настройками</span><span className="shrink-0">20 000 ₽</span></div>
                <div className="flex justify-between gap-4 py-4"><span>Индивидуальные доработки</span><span className="shrink-0">от 30 000 ₽</span></div>
              </div>
            </div>
            <div className="mt-8">
              <a href="https://aichurekmilashka-wq.github.io/Nurba-brat/" target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-[#FA347D] px-6 py-4 text-sm font-semibold text-[#07142D] transition hover:brightness-110">Открыть демонстрацию ↗</a>
              <p className="mt-4 text-xs leading-relaxed text-[#F4EAF0]/45">Оплата и автоматическая выдача файлов пока не подключены. Контакт для приёма заказов будет добавлен после настройки.</p>
            </div>
          </div>
        </article>
      </section>
      <section id="customers" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FA347D]">07 / CUSTOMERS</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">Для команд, которым нужна ясность.</h2>
        <p className="mt-6 max-w-2xl text-[#F4EAF0]/65">Для собственников и руководителей, которым важны прибыль и KPI; для отделов продаж, контролирующих воронку и скорость обработки; для коммерческих команд, управляющих ценами и маржой; для руководителей клиентского сервиса, оценивающих качество переписок.</p>
      </section>
      <section id="questions" className="mx-auto max-w-[1440px] px-6 pb-28 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FA347D]">08 / QUESTIONS</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">Частые вопросы.</h2>
        <div className="mt-8 divide-y divide-[#F4EAF0]/15 border-y border-[#F4EAF0]/15">
          {[["Сколько стоит внедрение?","Стоимость каждого продукта рассчитывается индивидуально и зависит от объёма данных, интеграций и задач."],["Нужно ли подключать все четыре продукта?","Нет. Sales Intelligence, CRM Quality Control, Price & Margin Intelligence и AI Conversation Intelligence представлены как отдельные решения."],["Какие показатели анализирует Sales Intelligence?","Продажи, прибыль, KPI и динамику показателей. Предусмотрено разграничение доступа."],["Что контролирует CRM Quality Control?","Юнит-экономику, цикл сделки, скорость обработки заявок, воронку и потери лидов."],["Что даёт Price & Margin Intelligence?","Мониторинг цен и поставщиков, а также анализ маржинальности."],["Что анализирует AI Conversation Intelligence?","Переписки с клиентами и качество работы менеджеров."],["Можно ли интегрировать решение с нашей CRM?","Совместимость и необходимый состав интеграций определяются при обсуждении конкретного проекта."]].map(([q,a])=><details key={q} className="group py-5"><summary className="cursor-pointer list-none text-lg">{q}<span className="float-right text-[#FA347D]">+</span></summary><p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#F4EAF0]/65">{a}</p></details>)}
        </div>
      </section>
      </div>
    </main>
  )
}
