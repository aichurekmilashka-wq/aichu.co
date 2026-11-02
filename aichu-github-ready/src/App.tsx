import { useEffect, useState } from "react"
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"

const translations: Record<string, [string, string]> = {"Наши решения":["Solutions","Чечимдер"],"Готовые сайты":["Ready-made websites","Даяр сайттар"],"Продукты":["Products","Продукттар"],"Решения":["Solutions","Чечимдер"],"Студия":["Studio","Студия"],"Наш подход":["Our approach","Биздин ыкма"],"Контакты":["Contacts","Байланыш"],"Разрабатываем B2B SaaS-продукты для аналитики продаж, контроля CRM и автоматизации бизнеса.":["We develop B2B SaaS products for sales analytics, CRM quality control and business automation.","Биз сатууну талдоо, CRM сапатын көзөмөлдөө жана бизнести автоматташтыруу үчүн B2B SaaS продукттарын иштеп чыгабыз."],"4 SaaS-продукта · Индивидуальные решения":["4 SaaS products · Tailored solutions","4 SaaS продукт · Жекече чечимдер"],"Когда данные разрознены, решения принимаются вслепую.":["Fragmented data leads to decisions without visibility.","Маалыматтар чачыранды болгондо, чечимдер толук көрүнүшсүз кабыл алынат."],"От данных к действиям.":["From data to action.","Маалыматтан иш-аракетке."],"Практические сценарии.":["Business use cases.","Практикалык сценарийлер."],"Интеллект в каждом решении":["Intelligence in every decision","Ар бир чечимдеги интеллект"],"Четыре B2B SaaS-продукта для решений на основе данных, а не догадок.":["Four B2B SaaS products for evidence-based decisions.","Божомолдорго эмес, маалыматтарга негизделген чечимдер үчүн төрт B2B SaaS продукт."],"Стоимость рассчитывается индивидуально под объём данных, интеграции и задачи.":["Pricing is tailored to data volume, integrations and business requirements.","Баасы маалымат көлөмүнө, интеграцияларга жана милдеттерге жараша жекече эсептелет."],"Для команд, которым нужна ясность.":["For teams that demand clarity.","Так маалыматты талап кылган командалар үчүн."],"Частые вопросы.":["Frequently asked questions.","Көп берилүүчү суроолор."],"Бизнес-контекст":["Business context","Бизнес контекст"],"Аналитическая модель":["Analytical model","Аналитикалык модель"],"Применение":["Application","Колдонуу"],"Управленческая ценность":["Management value","Башкаруудагы баалуулук"],"Выручка растёт, но её динамика сама по себе не объясняет изменение прибыли и результативность коммерческой команды.":["Revenue growth alone does not explain profitability or commercial team performance.","Кирешенин өсүшү өзү эле пайданын өзгөрүшүн жана коммерциялык команданын натыйжалуулугун түшүндүрбөйт."],"Единая система показателей продаж, прибыли и KPI с разграничением доступа к управленческой информации.":["Unified sales, profit and KPI reporting with role-based access to management data.","Сатуу, пайда жана KPI көрсөткүчтөрүнүн бирдиктүү системасы, башкаруу маалыматына ролдор боюнча жеткиликтүүлүк."],"Сопоставление коммерческих результатов и ключевых метрик по доступным срезам данных; выявление отклонений для управленческого разбора.":["Compare commercial results and key metrics across available dimensions; identify variances for management review.","Коммерциялык натыйжаларды жана негизги көрсөткүчтөрдү салыштырып, башкаруу үчүн четтөөлөрдү аныктоо."],"Прозрачность финансово-коммерческой результативности и более обоснованная приоритизация решений.":["Clearer commercial performance and better-informed management priorities.","Коммерциялык натыйжалардын ачыктыгы жана негиздүү башкаруу артыкчылыктары."],"Формальное ведение CRM не гарантирует контроля над потерями лидов, скоростью реакции и экономикой сделки.":["Using a CRM does not guarantee visibility into lost leads, response times or deal economics.","CRM колдонуу лиддердин жоголушун, жооп берүү ылдамдыгын жана бүтүмдүн экономикасын көзөмөлдөөгө кепилдик бербейт."],"Аналитика юнит-экономики, длительности цикла сделки, скорости обработки обращений и конверсии по этапам воронки.":["Analysis of unit economics, sales cycle duration, response speed and funnel-stage conversion.","Юнит-экономиканы, бүтүм циклин, кайрылууларды иштетүү ылдамдыгын жана воронкадагы конверсияны талдоо."],"Локализация этапов потери лидов, анализ задержек и сопоставление операционных показателей с экономикой продаж.":["Identify lead-loss stages, analyze delays and connect operational metrics to sales economics.","Лиддер жоголгон этаптарды жана кечигүүлөрдү аныктап, операциялык көрсөткүчтөрдү сатуу экономикасы менен салыштыруу."],"Основа для точечных изменений в процессе продаж вместо решений на уровне субъективных оценок.":["Evidence for targeted sales-process improvements instead of subjective judgments.","Субъективдүү баалардын ордуна сатуу процессин так жакшыртууга негиз."],"Изменения закупочных и рыночных цен могут ухудшать маржинальность раньше, чем это отражается в итоговой отчётности.":["Supplier and market price shifts can erode margins before the impact appears in financial reports.","Сатып алуу жана рыноктук баалардын өзгөрүшү отчетто көрүнгөнгө чейин маржаны азайтышы мүмкүн."],"Мониторинг цен, анализ поставщиков и контроль показателей маржинальности.":["Price monitoring, supplier analysis and margin tracking.","Бааларды мониторингдөө, жеткирүүчүлөрдү талдоо жана маржаны көзөмөлдөө."],"Сопоставление ценовых изменений и условий поставщиков с маржинальностью для оценки необходимости пересмотра закупок или ценовой политики.":["Assess price and supplier changes against margins to inform purchasing and pricing decisions.","Баалардын жана жеткирүүчүлөрдүн шарттарынын өзгөрүшүн маржа менен салыштырып, сатып алуу жана баа саясатын баалоо."],"Более оперативный контроль факторов, влияющих на валовую доходность, и аргументированная работа с ценами.":["Faster visibility into gross-margin drivers and more defensible pricing decisions.","Дүң кирешелүүлүккө таасир эткен факторлорду тезирээк көзөмөлдөө жана негиздүү баа чечимдери."],"Оценка качества клиентских коммуникаций зависит от выборочных проверок и не даёт системной картины работы команды.":["Sample-based conversation reviews fail to provide a consistent view of team performance.","Кардарлар менен сүйлөшүүлөрдү тандалма текшерүү команданын иши жөнүндө системалуу көрүнүш бербейт."],"Анализ переписок с клиентами и качества коммуникации менеджеров.":["Analysis of customer conversations and manager communication quality.","Кардарлар менен кат алышууну жана менеджерлердин баарлашуу сапатын талдоо."],"Выявление повторяющихся проблем в диалогах и формирование предметной базы для обратной связи, контроля стандартов и обучения.":["Detect recurring issues in conversations to support coaching, quality standards and training.","Диалогдордогу кайталанган көйгөйлөрдү аныктап, окутууга жана сапатты көзөмөлдөөгө негиз түзүү."],"Более последовательная оценка клиентского взаимодействия и управляемое повышение качества работы команды.":["More consistent customer-interaction reviews and structured quality improvement.","Кардарлар менен иштөөнү ырааттуу баалоо жана команданын сапатын системалуу жакшыртуу."],"Продажи и прибыль":["Sales and profit","Сатуу жана пайда"],"KPI и динамика":["KPI and trends","KPI жана динамика"],"Разграничение доступа":["Access controls","Жеткиликтүүлүктү чектөө"],"Юнит-экономика":["Unit economics","Юнит-экономика"],"Цикл сделки и скорость реакции":["Sales cycle and response speed","Бүтүм цикли жана жооп ылдамдыгы"],"Воронка и потери лидов":["Funnel and lead loss","Воронка жана лид жоготуулар"],"Мониторинг цен":["Price monitoring","Баалар мониторинги"],"Анализ поставщиков":["Supplier analysis","Жеткирүүчүлөрдү талдоо"],"Маржинальность":["Margins","Маржа"],"Анализ переписок":["Conversation analysis","Кат алышууну талдоо"],"Оценка качества диалогов":["Conversation quality review","Диалог сапатын баалоо"],"Повторяющиеся ошибки":["Recurring issues","Кайталанган каталар"]}

export default function App() {
  const [language, setLanguage] = useState<"ru" | "en" | "ky">(() => { const saved = localStorage.getItem("aichu-language"); return saved === "en" || saved === "ky" ? saved : "ru" })
  const [theme, setTheme] = useState<"dark" | "light">(() => localStorage.getItem("aichu-theme") === "light" ? "light" : "dark")
  const tr = (text: string) => language === "ru" ? text : (translations[text]?.[language === "en" ? 0 : 1] || text)
  useEffect(() => { localStorage.setItem("aichu-language", language); document.documentElement.lang = language === "ky" ? "ky" : language }, [language])
  useEffect(() => { localStorage.setItem("aichu-theme", theme) }, [theme])
  const [mobileOpen, setMobileOpen] = useState(false)
  const navSections = [{id:"about",number:"01",label:language==="ru"?"Обзор":language==="ky"?"Сереп":"Overview"},{id:"problem",number:"02",label:language==="ru"?"Проблемы":language==="ky"?"Көйгөйлөр":"Challenges"},{id:"how",number:"03",label:language==="ru"?"Подход":language==="ky"?"Ыкма":"Approach"},{id:"practice",number:"04",label:language==="ru"?"Применение":language==="ky"?"Колдонуу":"Use cases"},{id:"products",number:"05",label:language==="ru"?"Продукты":language==="ky"?"Продукттар":"Products"},{id:"templates",number:"06",label:language==="ru"?"Готовые сайты":language==="ky"?"Даяр сайттар":"Templates"},{id:"customers",number:"07",label:language==="ru"?"Клиенты":language==="ky"?"Кардарлар":"Customers"},{id:"questions",number:"08",label:language==="ru"?"Вопросы":language==="ky"?"Суроолор":"FAQ"}]
  const productsMenu = [{id:"products",name:"Sales Intelligence Platform",ru:"Продажи, прибыль, KPI",en:"Sales, profit and KPIs",ky:"Сатуу, пайда жана KPI"},{id:"products",name:"CRM Quality Control",ru:"Контроль воронки и потерь лидов",en:"Funnel and lead-loss control",ky:"Воронка жана лид жоготуулары"},{id:"products",name:"Price & Margin Intelligence",ru:"Цены и маржинальность",en:"Pricing and margins",ky:"Баалар жана маржа"},{id:"products",name:"AI Conversation Intelligence",ru:"Аналитика клиентских диалогов",en:"Customer conversation analytics",ky:"Кардарлар менен диалогдорду талдоо"}]
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
    <main id="top" className={`min-h-screen bg-[#07142D] text-[#F4EAF0] ${theme === "light" ? "aichu-light" : ""}`}>
      <style>{`
        .aichu-light { background:#f6f3f5 !important; color:#07142D !important; }
        .aichu-light .bg-\\[\\#07142D\\], .aichu-light .bg-\\[\\#091932\\], .aichu-light .bg-\\[\\#0B1C3B\\] { background-color:#fff !important; }
        .aichu-light .text-\\[\\#F4EAF0\\], .aichu-light [class*="text-[#F4EAF0]"] { color:#07142D !important; }
        .aichu-light [class*="border-[#F4EAF0]"] { border-color:rgba(7,20,45,.16) !important; }
        .aichu-light [class*="bg-[#F4EAF0]/"] { background-color:rgba(7,20,45,.06) !important; }
        .aichu-light .bg-\\[\\#F4EAF0\\] { background-color:#e9e3e8 !important; }
        .aichu-light .text-\\[\\#07142D\\] { color:#07142D !important; }
        .aichu-light .hwf-root { color:#07142D !important; }
        .aichu-light article:not([class*="bg-[#F4EAF0]"]) { background-color:#fff !important; }
        .aichu-light [class*="text-[#F4EAF0]/"] { color:rgba(7,20,45,.72) !important; }
      `}</style>
      <header className="sticky top-0 z-40 border-b border-[#FA347D]/20 bg-[#07142D]/95 px-4 py-3 text-[#F4EAF0] backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <a href="#top" className="shrink-0 text-xl font-semibold tracking-tight">aichu<span className="text-[#FA347D]">.co</span></a>
          <nav aria-label="Main navigation" className="hidden items-center gap-2 lg:flex">
            <a href="#about" className="px-3 py-2 text-sm hover:text-[#FA347D]">{language === "ru" ? "Главная" : language === "ky" ? "Башкы бет" : "Home"}</a>
            <div className="group relative">
              <button type="button" className="px-3 py-2 text-sm hover:text-[#FA347D]" aria-haspopup="true">{language === "ru" ? "Решения" : language === "ky" ? "Чечимдер" : "Solutions"} ▾</button>
              <div className="invisible absolute left-0 top-full w-[340px] translate-y-2 border border-[#FA347D]/25 bg-[#07142D] p-3 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {productsMenu.map(item => <a key={item.id} href={`#${item.id}`} className="block border-b border-white/10 px-3 py-3 last:border-0 hover:bg-white/10"><span className="block text-sm font-medium">{item.name}</span><span className="mt-1 block text-xs text-white/55">{language === "ru" ? item.ru : language === "ky" ? item.ky : item.en}</span></a>)}
              </div>
            </div>
            <div className="group relative">
              <button type="button" className="px-3 py-2 text-sm hover:text-[#FA347D]" aria-haspopup="true">{language === "ru" ? "О студии" : language === "ky" ? "Студия жөнүндө" : "Studio"} ▾</button>
              <div className="invisible absolute left-0 top-full w-56 translate-y-2 border border-[#FA347D]/25 bg-[#07142D] p-2 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {navSections.filter(item => !["products","templates"].includes(item.id)).map(item => <a key={item.id} href={`#${item.id}`} className="block px-3 py-2 text-sm hover:bg-white/10">{item.number} / {item.label}</a>)}
              </div>
            </div>
            <a href="#templates" className="px-3 py-2 text-sm hover:text-[#FA347D]">{language === "ru" ? "Готовые сайты" : language === "ky" ? "Даяр сайттар" : "Website templates"}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Light mode" : "Dark mode"} className="rounded-full border border-white/20 px-3 py-2 text-sm">{theme === "dark" ? "☀" : "☾"}</button>
            <select aria-label="Language" value={language} onChange={e => setLanguage(e.target.value as "ru" | "en" | "ky")} className="rounded border border-white/20 bg-[#07142D] px-2 py-2 text-xs text-[#F4EAF0]"><option value="ru">RU</option><option value="en">EN</option><option value="ky">KY</option></select>
            <button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen} className="rounded border border-white/20 px-3 py-2 text-sm lg:hidden">{mobileOpen ? "✕" : "☰"}</button>
          </div>
        </div>
        {mobileOpen && <nav aria-label="Mobile navigation" className="mt-3 grid gap-1 border-t border-white/15 pt-3 lg:hidden">{navSections.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setMobileOpen(false)} className="px-3 py-3 text-sm hover:bg-white/10">{item.number} / {item.label}</a>)}</nav>}
      </header>
      {/* The original interactive halftone wordmark now IS the hero, not a footer below it. */}
      <section aria-label="Интерактивный логотип aichu.co" className="w-full">
        <HalftoneWordmarkFooter
          wordmark="aichu.co"
          label="DIGITAL INTELLIGENCE STUDIO"
          meta="B2B SOFTWARE · AI & ANALYTICS"
          backToTop={false}
          palette={theme === "dark" ? { background: "#07142D", ink: "#F4EAF0", warm: "#FA347D" } : { background: "#F6F3F5", ink: "#07142D", warm: "#FA347D" }}
          dotGap={6}
          radius={80}
          crop={0.05}
          grain={0.25}
          height="clamp(460px, 74svh, 850px)"
          columns={[]}
        />
      </section>

      <div className="relative">
      <section id="about" className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 pb-14 pt-12 md:px-12">
        <span className="text-[11px] uppercase tracking-[.28em] text-[#FA347D]">AICHU.CO / DIGITAL INTELLIGENCE</span>
        <p className="max-w-2xl text-xl leading-relaxed md:text-3xl">
          Разрабатываем B2B SaaS-продукты для аналитики продаж, контроля CRM и автоматизации бизнеса.
        </p>
        <span className="text-xs uppercase tracking-[.18em] text-[#F4EAF0]/45">{tr("4 SaaS-продукта · Индивидуальные решения")}</span>
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
        <h2 className="mt-5 max-w-3xl text-3xl font-medium md:text-5xl">{tr("Когда данные разрознены, решения принимаются вслепую.")}</h2>
        <div className="mt-8 grid gap-px bg-[#F4EAF0]/15 md:grid-cols-2">
          {["Sales Intelligence: сложно увидеть реальную динамику продаж, прибыли и KPI по одной системе показателей.", "CRM Quality Control: задержки обработки заявок, длинный цикл сделки и потери лидов остаются незаметными.", "Price & Margin Intelligence: изменения цен поставщиков влияют на маржу, пока данные собирают вручную.", "AI Conversation Intelligence: качество переписок менеджеров трудно оценивать последовательно."].map(t=><div key={t} className="bg-[#07142D] p-7 text-sm leading-relaxed text-[#F4EAF0]/70">{t}</div>)}
        </div>
      </section>
      <section id="how" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FA347D]">03 / HOW IT FITS</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">{tr("От данных к действиям.")}</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[["01","Определяем данные","Выбираем необходимые показатели продаж, CRM, цен и коммуникаций под задачи компании."],["02","Настраиваем анализ","Формируем метрики прибыли и KPI, цикл сделки, потери лидов, маржу и качество диалогов."],["03","Применяем результаты","Используем выявленные отклонения для контроля процессов и принятия управленческих решений."]].map(([n,t,d])=><div key={n} className="border border-[#F4EAF0]/15 p-7"><span className="text-[#FA347D]">{n}</span><h3 className="mt-8 text-xl">{t}</h3><p className="mt-3 text-sm text-[#F4EAF0]/60">{d}</p></div>)}
        </div>
      </section>
      <section id="practice" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FA347D]">04 / IN PRACTICE</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">{tr("Практические сценарии.")}</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {[["Sales Intelligence Platform","Сопоставляйте продажи, прибыль и KPI. Разграничивайте доступ к показателям для разных ролей."],["CRM Quality Control","Оценивайте юнит-экономику, длительность сделки, скорость обработки заявок и этапы потери лидов."],["Price & Margin Intelligence","Отслеживайте изменения цен и предложения поставщиков, анализируйте влияние на маржинальность."],["AI Conversation Intelligence","Анализируйте клиентские переписки и качество работы менеджеров, находите проблемные диалоги."]].map(([t,d])=><div key={t} className="border-l-2 border-[#FA347D] bg-[#F4EAF0]/5 p-7"><h3 className="text-xl">{t}</h3><p className="mt-3 text-sm text-[#F4EAF0]/60">{d}</p></div>)}
        </div>
      </section>
      <section id="products" className="mx-auto max-w-[1440px] px-6 pb-28 pt-8 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#F4EAF0]/15 pb-7">
          <div>
            <span className="text-[11px] uppercase tracking-[.28em] text-[#FA347D]">05 / НАШИ ПРОДУКТЫ</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{tr("Интеллект в каждом решении")}<span className="text-[#FA347D]">.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#F4EAF0]/60">{tr("Четыре B2B SaaS-продукта для решений на основе данных, а не догадок.")}</p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[#F4EAF0]/15 bg-[#F4EAF0]/15 md:grid-cols-2">
          {[
            { number: "01", name: "Sales Intelligence Platform", tag: "SALES / PROFITABILITY", challenge: tr("Выручка растёт, но её динамика сама по себе не объясняет изменение прибыли и результативность коммерческой команды."), model: tr("Единая система показателей продаж, прибыли и KPI с разграничением доступа к управленческой информации."), application: tr("Сопоставление коммерческих результатов и ключевых метрик по доступным срезам данных; выявление отклонений для управленческого разбора."), value: tr("Прозрачность финансово-коммерческой результативности и более обоснованная приоритизация решений."), features: [tr("Продажи и прибыль"), tr("KPI и динамика"), tr("Разграничение доступа")] },
            { number: "02", name: "CRM Quality Control", tag: "REVENUE OPERATIONS", challenge: tr("Формальное ведение CRM не гарантирует контроля над потерями лидов, скоростью реакции и экономикой сделки."), model: tr("Аналитика юнит-экономики, длительности цикла сделки, скорости обработки обращений и конверсии по этапам воронки."), application: tr("Локализация этапов потери лидов, анализ задержек и сопоставление операционных показателей с экономикой продаж."), value: tr("Основа для точечных изменений в процессе продаж вместо решений на уровне субъективных оценок."), features: [tr("Юнит-экономика"), tr("Цикл сделки и скорость реакции"), tr("Воронка и потери лидов")] },
            { number: "03", name: "Price & Margin Intelligence", tag: "PRICING / PROCUREMENT", challenge: tr("Изменения закупочных и рыночных цен могут ухудшать маржинальность раньше, чем это отражается в итоговой отчётности."), model: tr("Мониторинг цен, анализ поставщиков и контроль показателей маржинальности."), application: tr("Сопоставление ценовых изменений и условий поставщиков с маржинальностью для оценки необходимости пересмотра закупок или ценовой политики."), value: tr("Более оперативный контроль факторов, влияющих на валовую доходность, и аргументированная работа с ценами."), features: [tr("Мониторинг цен"), tr("Анализ поставщиков"), tr("Маржинальность")] },
            { number: "04", name: "AI Conversation Intelligence", tag: "AI / CUSTOMER COMMUNICATION", challenge: tr("Оценка качества клиентских коммуникаций зависит от выборочных проверок и не даёт системной картины работы команды."), model: tr("Анализ переписок с клиентами и качества коммуникации менеджеров."), application: tr("Выявление повторяющихся проблем в диалогах и формирование предметной базы для обратной связи, контроля стандартов и обучения."), value: tr("Более последовательная оценка клиентского взаимодействия и управляемое повышение качества работы команды."), features: [tr("Анализ переписок"), tr("Оценка качества диалогов"), tr("Повторяющиеся ошибки")] },
          ].map((product) => (
            <article key={product.number} className="group flex min-h-[610px] flex-col justify-between bg-[#07142D] p-7 transition-colors duration-300 hover:bg-[#0B1C3B] md:p-10">
              <div>
                <div className="mb-10 flex items-center justify-between text-xs tracking-[.2em]">
                  <span className="text-[#FA347D]">{product.number} / 04</span>
                  <span className="text-[#F4EAF0]/40">{product.tag}</span>
                </div>
                <h3 className="max-w-md text-2xl font-medium leading-tight tracking-tight md:text-3xl">{product.name}</h3>
                <div className="mt-7 space-y-6">
                  {[[ tr("Бизнес-контекст"), product.challenge ], [ tr("Аналитическая модель"), product.model ], [ tr("Применение"), product.application ]].map(([label, copy]) => (
                    <div key={label}><p className="mb-2 text-[10px] font-medium uppercase tracking-[.18em] text-[#F4EAF0]/40">{label}</p><p className="max-w-lg text-sm leading-relaxed text-[#F4EAF0]/75">{copy}</p></div>
                  ))}
                  <div className="border-t border-[#FA347D]/50 pt-5"><p className="mb-2 text-[10px] font-medium uppercase tracking-[.18em] text-[#FA347D]">{tr("Управленческая ценность")}</p><p className="max-w-lg text-base leading-relaxed text-[#F4EAF0]">{product.value}</p></div>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap gap-2">
                {product.features.map((feature) => <span key={feature} className="border border-[#F4EAF0]/20 px-3 py-2 text-[11px] text-[#F4EAF0]/75">{feature}</span>)}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm text-[#F4EAF0]/60">
          <p>{tr("Стоимость рассчитывается индивидуально под объём данных, интеграции и задачи.")}</p>
          <span className="text-[#FA347D]">AICHU.CO / B2B SOFTWARE</span>
        </div>
      </section>
      <section id="templates" className="mx-auto max-w-[1440px] px-6 pb-28 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#F4EAF0]/15 pb-7">
          <div>
            <span className="text-[11px] uppercase tracking-[.28em] text-[#FA347D]">06 / READY-MADE WEBSITES</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{tr("Готовые сайты")}<span className="text-[#FA347D]">.</span></h2>
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
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">{tr("Для команд, которым нужна ясность.")}</h2>
        <p className="mt-6 max-w-2xl text-[#F4EAF0]/65">Для собственников и руководителей, которым важны прибыль и KPI; для отделов продаж, контролирующих воронку и скорость обработки; для коммерческих команд, управляющих ценами и маржой; для руководителей клиентского сервиса, оценивающих качество переписок.</p>
      </section>
      <section id="questions" className="mx-auto max-w-[1440px] px-6 pb-28 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FA347D]">08 / QUESTIONS</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">{tr("Частые вопросы.")}</h2>
        <div className="mt-8 divide-y divide-[#F4EAF0]/15 border-y border-[#F4EAF0]/15">
          {[["Сколько стоит внедрение?","Стоимость каждого продукта рассчитывается индивидуально и зависит от объёма данных, интеграций и задач."],["Нужно ли подключать все четыре продукта?","Нет. Sales Intelligence, CRM Quality Control, Price & Margin Intelligence и AI Conversation Intelligence представлены как отдельные решения."],["Какие показатели анализирует Sales Intelligence?","Продажи, прибыль, KPI и динамику показателей. Предусмотрено разграничение доступа."],["Что контролирует CRM Quality Control?","Юнит-экономику, цикл сделки, скорость обработки заявок, воронку и потери лидов."],["Что даёт Price & Margin Intelligence?","Мониторинг цен и поставщиков, а также анализ маржинальности."],["Что анализирует AI Conversation Intelligence?","Переписки с клиентами и качество работы менеджеров."],["Можно ли интегрировать решение с нашей CRM?","Совместимость и необходимый состав интеграций определяются при обсуждении конкретного проекта."]].map(([q,a])=><details key={q} className="group py-5"><summary className="cursor-pointer list-none text-lg">{q}<span className="float-right text-[#FA347D]">+</span></summary><p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#F4EAF0]/65">{a}</p></details>)}
        </div>
      </section>
      </div>
    </main>
  )
}
