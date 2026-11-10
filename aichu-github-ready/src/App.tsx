import { useEffect, useRef, useState } from "react"
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"
import SalesLeakageFunnel from "./components/SalesLeakageFunnel"
import { initAnalytics, pauseAnalytics, isAnalyticsConfigured, isYandexMetricaConfigured, isGoogleAnalyticsConfigured, trackEvent } from "./analytics"
import { IllosShaderFeatureBento } from "@/components/ui/illos-shader-feature-bento"
import RezonGlassDashboard from "@/components/ui/adjustable-glass-dashboard"
import LiquidNavbar from "@/components/ui/liquid-glass-navbar"
import AuthControl from "@/components/ui/auth-control"
import { Home, ChartNoAxesCombined, Workflow, Layers, Mail, Sun, Moon } from "lucide-react"

const translations: Record<string, [string, string]> = {"Наши решения":["Solutions","Чечимдер"],"Готовые сайты":["Ready-made websites","Даяр сайттар"],"Продукты":["Products","Продукттар"],"Решения":["Solutions","Чечимдер"],"Студия":["Studio","Студия"],"Наш подход":["Our approach","Биздин ыкма"],"Контакты":["Contacts","Байланыш"],"Разрабатываем B2B SaaS-продукты для аналитики продаж, контроля CRM и автоматизации бизнеса.":["We develop B2B SaaS products for sales analytics, CRM quality control and business automation.","Биз сатууну талдоо, CRM сапатын көзөмөлдөө жана бизнести автоматташтыруу үчүн B2B SaaS продукттарын иштеп чыгабыз."],"4 SaaS-продукта · Индивидуальные решения":["4 SaaS products · Tailored solutions","4 SaaS продукт · Жекече чечимдер"],"Когда данные разрознены, решения принимаются вслепую.":["Fragmented data leads to decisions without visibility.","Маалыматтар чачыранды болгондо, чечимдер толук көрүнүшсүз кабыл алынат."],"От данных к действиям.":["From data to action.","Маалыматтан иш-аракетке."],"Практические сценарии.":["Business use cases.","Практикалык сценарийлер."],"Интеллект в каждом решении":["Intelligence in every decision","Ар бир чечимдеги интеллект"],"Четыре B2B SaaS-продукта для решений на основе данных, а не догадок.":["Four B2B SaaS products for evidence-based decisions.","Божомолдорго эмес, маалыматтарга негизделген чечимдер үчүн төрт B2B SaaS продукт."],"Для команд, которым нужна ясность.":["For teams that demand clarity.","Так маалыматты талап кылган командалар үчүн."],"Частые вопросы.":["Frequently asked questions.","Көп берилүүчү суроолор."],"Бизнес-контекст":["Business context","Бизнес контекст"],"Аналитическая модель":["Analytical model","Аналитикалык модель"],"Применение":["Application","Колдонуу"],"Управленческая ценность":["Management value","Башкаруудагы баалуулук"],"Выручка растёт, но её динамика сама по себе не объясняет изменение прибыли и результативность коммерческой команды.":["Revenue growth alone does not explain profitability or commercial team performance.","Кирешенин өсүшү өзү эле пайданын өзгөрүшүн жана коммерциялык команданын натыйжалуулугун түшүндүрбөйт."],"Единая система показателей продаж, прибыли и KPI с разграничением доступа к управленческой информации.":["Unified sales, profit and KPI reporting with role-based access to management data.","Сатуу, пайда жана KPI көрсөткүчтөрүнүн бирдиктүү системасы, башкаруу маалыматына ролдор боюнча жеткиликтүүлүк."],"Сопоставление коммерческих результатов и ключевых метрик по доступным срезам данных; выявление отклонений для управленческого разбора.":["Compare commercial results and key metrics across available dimensions; identify variances for management review.","Коммерциялык натыйжаларды жана негизги көрсөткүчтөрдү салыштырып, башкаруу үчүн четтөөлөрдү аныктоо."],"Прозрачность финансово-коммерческой результативности и более обоснованная приоритизация решений.":["Clearer commercial performance and better-informed management priorities.","Коммерциялык натыйжалардын ачыктыгы жана негиздүү башкаруу артыкчылыктары."],"Формальное ведение CRM не гарантирует контроля над потерями лидов, скоростью реакции и экономикой сделки.":["Using a CRM does not guarantee visibility into lost leads, response times or deal economics.","CRM колдонуу лиддердин жоголушун, жооп берүү ылдамдыгын жана бүтүмдүн экономикасын көзөмөлдөөгө кепилдик бербейт."],"Аналитика юнит-экономики, длительности цикла сделки, скорости обработки обращений и конверсии по этапам воронки.":["Analysis of unit economics, sales cycle duration, response speed and funnel-stage conversion.","Юнит-экономиканы, бүтүм циклин, кайрылууларды иштетүү ылдамдыгын жана воронкадагы конверсияны талдоо."],"Локализация этапов потери лидов, анализ задержек и сопоставление операционных показателей с экономикой продаж.":["Identify lead-loss stages, analyze delays and connect operational metrics to sales economics.","Лиддер жоголгон этаптарды жана кечигүүлөрдү аныктап, операциялык көрсөткүчтөрдү сатуу экономикасы менен салыштыруу."],"Основа для точечных изменений в процессе продаж вместо решений на уровне субъективных оценок.":["Evidence for targeted sales-process improvements instead of subjective judgments.","Субъективдүү баалардын ордуна сатуу процессин так жакшыртууга негиз."],"Изменения закупочных и рыночных цен могут ухудшать маржинальность раньше, чем это отражается в итоговой отчётности.":["Supplier and market price shifts can erode margins before the impact appears in financial reports.","Сатып алуу жана рыноктук баалардын өзгөрүшү отчетто көрүнгөнгө чейин маржаны азайтышы мүмкүн."],"Мониторинг цен, анализ поставщиков и контроль показателей маржинальности.":["Price monitoring, supplier analysis and margin tracking.","Бааларды мониторингдөө, жеткирүүчүлөрдү талдоо жана маржаны көзөмөлдөө."],"Сопоставление ценовых изменений и условий поставщиков с маржинальностью для оценки необходимости пересмотра закупок или ценовой политики.":["Assess price and supplier changes against margins to inform purchasing and pricing decisions.","Баалардын жана жеткирүүчүлөрдүн шарттарынын өзгөрүшүн маржа менен салыштырып, сатып алуу жана баа саясатын баалоо."],"Более оперативный контроль факторов, влияющих на валовую доходность, и аргументированная работа с ценами.":["Faster visibility into gross-margin drivers and more defensible pricing decisions.","Дүң кирешелүүлүккө таасир эткен факторлорду тезирээк көзөмөлдөө жана негиздүү баа чечимдери."],"Оценка качества клиентских коммуникаций зависит от выборочных проверок и не даёт системной картины работы команды.":["Sample-based conversation reviews fail to provide a consistent view of team performance.","Кардарлар менен сүйлөшүүлөрдү тандалма текшерүү команданын иши жөнүндө системалуу көрүнүш бербейт."],"Анализ переписок с клиентами и качества коммуникации менеджеров.":["Analysis of customer conversations and manager communication quality.","Кардарлар менен кат алышууну жана менеджерлердин баарлашуу сапатын талдоо."],"Выявление повторяющихся проблем в диалогах и формирование предметной базы для обратной связи, контроля стандартов и обучения.":["Detect recurring issues in conversations to support coaching, quality standards and training.","Диалогдордогу кайталанган көйгөйлөрдү аныктап, окутууга жана сапатты көзөмөлдөөгө негиз түзүү."],"Более последовательная оценка клиентского взаимодействия и управляемое повышение качества работы команды.":["More consistent customer-interaction reviews and structured quality improvement.","Кардарлар менен иштөөнү ырааттуу баалоо жана команданын сапатын системалуу жакшыртуу."],"Продажи и прибыль":["Sales and profit","Сатуу жана пайда"],"KPI и динамика":["KPI and trends","KPI жана динамика"],"Разграничение доступа":["Access controls","Жеткиликтүүлүктү чектөө"],"Юнит-экономика":["Unit economics","Юнит-экономика"],"Цикл сделки и скорость реакции":["Sales cycle and response speed","Бүтүм цикли жана жооп ылдамдыгы"],"Воронка и потери лидов":["Funnel and lead loss","Воронка жана лид жоготуулар"],"Мониторинг цен":["Price monitoring","Баалар мониторинги"],"Анализ поставщиков":["Supplier analysis","Жеткирүүчүлөрдү талдоо"],"Маржинальность":["Margins","Маржа"],"Анализ переписок":["Conversation analysis","Кат алышууну талдоо"],"Оценка качества диалогов":["Conversation quality review","Диалог сапатын баалоо"],"Повторяющиеся ошибки":["Recurring issues","Кайталанган каталар"],"Sales Intelligence: сложно увидеть реальную динамику продаж, прибыли и KPI по одной системе показателей.":["Sales Intelligence: without a unified view, actual sales, profit and KPI trends are difficult to assess.","Sales Intelligence: бирдиктүү көрсөткүчтөр системасы болбосо, сатуунун, пайданын жана KPIнин динамикасын баалоо кыйын."],"CRM Quality Control: задержки обработки заявок, длинный цикл сделки и потери лидов остаются незаметными.":["CRM Quality Control: slow response times, lengthy sales cycles and lost leads can go unnoticed.","CRM Quality Control: кайрылууларды иштетүүдөгү кечигүүлөр, узак бүтүм цикли жана жоголгон лиддер байкалбай калат."],"Price & Margin Intelligence: изменения цен поставщиков влияют на маржу, пока данные собирают вручную.":["Price & Margin Intelligence: supplier price changes affect margins while teams still consolidate data manually.","Price & Margin Intelligence: маалымат кол менен чогултулуп жатканда, жеткирүүчүлөрдүн баа өзгөрүүлөрү маржага таасир этет."],"AI Conversation Intelligence: качество переписок менеджеров трудно оценивать последовательно.":["AI Conversation Intelligence: consistent assessment of managers' customer conversations is difficult.","AI Conversation Intelligence: менеджерлердин кардарлар менен кат алышуусунун сапатын туруктуу баалоо кыйын."],"Определяем данные":["Define the data","Маалыматтарды аныктайбыз"],"Выбираем необходимые показатели продаж, CRM, цен и коммуникаций под задачи компании.":["Select the sales, CRM, pricing and communication metrics relevant to the business.","Компаниянын максатына жараша сатуу, CRM, баа жана байланыш көрсөткүчтөрүн тандайбыз."],"Настраиваем анализ":["Configure analytics","Аналитиканы жөндөйбүз"],"Формируем метрики прибыли и KPI, цикл сделки, потери лидов, маржу и качество диалогов.":["Structure profit and KPI metrics, sales cycles, lead losses, margins and conversation quality.","Пайда, KPI, бүтүм цикли, жоголгон лиддер, маржа жана диалог сапаты боюнча көрсөткүчтөрдү түзөбүз."],"Применяем результаты":["Put insights to work","Натыйжаларды колдонобуз"],"Используем выявленные отклонения для контроля процессов и принятия управленческих решений.":["Use identified deviations to monitor processes and support management decisions.","Аныкталган четтөөлөрдү процесстерди көзөмөлдөө жана башкаруу чечимдерин кабыл алуу үчүн колдонобуз."],"Сопоставляйте продажи, прибыль и KPI. Разграничивайте доступ к показателям для разных ролей.":["Compare sales, profit and KPIs, with role-based access to each set of metrics.","Сатуу, пайда жана KPIни салыштырып, ролдор боюнча көрсөткүчтөргө жетүүнү чектеңиз."],"Оценивайте юнит-экономику, длительность сделки, скорость обработки заявок и этапы потери лидов.":["Assess unit economics, sales cycle duration, response speed and where leads are lost.","Юнит-экономиканы, бүтүмдүн узактыгын, кайрылууларга жооп берүү ылдамдыгын жана лид жоготууларын баалаңыз."],"Отслеживайте изменения цен и предложения поставщиков, анализируйте влияние на маржинальность.":["Track price changes and supplier offers, and assess their impact on margins.","Баалардагы өзгөрүүлөрдү жана жеткирүүчүлөрдүн сунуштарын көзөмөлдөп, маржага таасирин талдаңыз."],"Анализируйте клиентские переписки и качество работы менеджеров, находите проблемные диалоги.":["Analyze customer conversations and managers' communication quality to uncover problematic interactions.","Кардарлар менен кат алышууну жана менеджерлердин иш сапатын талдап, көйгөйлүү диалогдорду аныктаңыз."],"05 / НАШИ ПРОДУКТЫ":["05 / OUR PRODUCTS","05 / БИЗДИН ПРОДУКТТАР"],"Выберите готовый дизайн или закажите адаптацию под свой бизнес.":["Choose a ready-made design or commission a tailored version for your business.","Даяр дизайнды тандаңыз же бизнесиңизге ылайыкташтырууга заказ бериңиз."],"На основе проекта Nurba":["Based on the Nurba project","Nurba долбоорунун негизинде"],"Лендинг для услуг и частной практики":["Landing page for services and independent professionals","Кызматтар жана жеке практика үчүн лендинг"],"Посмотреть демоверсию ↗":["View live demo ↗","Демону көрүү ↗"],"Открыть демонстрацию ↗":["Open demo ↗","Демону ачуу ↗"],"Для собственников и руководителей, которым важны прибыль и KPI; для отделов продаж, контролирующих воронку и скорость обработки; для коммерческих команд, управляющих ценами и маржой; для руководителей клиентского сервиса, оценивающих качество переписок.":["For founders and executives focused on profit and KPIs; sales teams managing funnel performance and response time; commercial teams responsible for pricing and margins; and customer service leaders assessing conversation quality.","Пайдага жана KPIге көңүл бурган компания ээлери жана жетекчилер; сатуу воронкасын жана жооп ылдамдыгын көзөмөлдөгөн командалар; бааларды жана маржаны башкарган коммерциялык командалар; диалогдордун сапатын баалаган кардарларды тейлөө жетекчилери үчүн."],"Нужно ли подключать все четыре продукта?":["Do we need all four products?","Төрт продуктту тең туташтыруу керекпи?"],"Нет. Sales Intelligence, CRM Quality Control, Price & Margin Intelligence и AI Conversation Intelligence представлены как отдельные решения.":["No. Sales Intelligence, CRM Quality Control, Price & Margin Intelligence and AI Conversation Intelligence are independent solutions.","Жок. Sales Intelligence, CRM Quality Control, Price & Margin Intelligence жана AI Conversation Intelligence өз алдынча чечимдер."],"Какие показатели анализирует Sales Intelligence?":["Which metrics does Sales Intelligence analyze?","Sales Intelligence кайсы көрсөткүчтөрдү талдайт?"],"Продажи, прибыль, KPI и динамику показателей. Предусмотрено разграничение доступа.":["Sales, profit, KPIs and performance trends, with role-based access controls.","Сатууну, пайданы, KPIни жана көрсөткүчтөрдүн динамикасын. Ролдор боюнча жетүү чектелет."],"Что контролирует CRM Quality Control?":["What does CRM Quality Control monitor?","CRM Quality Control эмнени көзөмөлдөйт?"],"Юнит-экономику, цикл сделки, скорость обработки заявок, воронку и потери лидов.":["Unit economics, the sales cycle, response times, the sales funnel and lead losses.","Юнит-экономиканы, бүтүм циклин, кайрылууларды иштетүү ылдамдыгын, воронканы жана жоголгон лиддерди."],"Что даёт Price & Margin Intelligence?":["What does Price & Margin Intelligence provide?","Price & Margin Intelligence эмне берет?"],"Мониторинг цен и поставщиков, а также анализ маржинальности.":["Price and supplier monitoring, plus margin analysis.","Бааларды жана жеткирүүчүлөрдү мониторингдөө, ошондой эле маржаны талдоо."],"Что анализирует AI Conversation Intelligence?":["What does AI Conversation Intelligence analyze?","AI Conversation Intelligence эмнени талдайт?"],"Переписки с клиентами и качество работы менеджеров.":["Customer conversations and managers' communication quality.","Кардарлар менен кат алышууну жана менеджерлердин ишинин сапатын."],"Можно ли интегрировать решение с нашей CRM?":["Can it integrate with our CRM?","Биздин CRM менен интеграциялоого болобу?"],"Совместимость и необходимый состав интеграций определяются при обсуждении конкретного проекта.":["Compatibility and integration requirements are assessed for each project.","Шайкештик жана интеграция талаптары ар бир долбоор үчүн өзүнчө аныкталат."]}

export default function App() {
  // The URL is the source of truth: every language has a permanent, shareable page.
  const language = (window.location.pathname.match(/\/(ru|en|ky)\/?$/)?.[1] || "ru") as "ru" | "en" | "ky"
  const changeLanguage = (next: "ru" | "en" | "ky") => {
    const prefix = window.location.pathname.replace(/(?:ru|en|ky)\/?$/, "").replace(/\/?$/, "/")
    window.location.assign(prefix + next + "/" + window.location.search + window.location.hash)
  }
  const [theme, setTheme] = useState<"dark" | "light">(() => localStorage.getItem("aichu-theme") === "light" ? "light" : "dark")
  const tr = (text: string) => language === "ru" ? text : (translations[text]?.[language === "en" ? 0 : 1] || text)
  useEffect(() => { document.documentElement.lang = language }, [language])
  const [analyticsConsent, setAnalyticsConsent] = useState<"accepted" | "rejected" | null>(() => {
    const stored = localStorage.getItem("aichu-analytics-consent")
    return stored === "accepted" || stored === "rejected" ? stored : null
  })
  useEffect(() => { if (analyticsConsent === "accepted") initAnalytics() }, [analyticsConsent])
  const chooseAnalytics = (choice: "accepted" | "rejected") => {
    const wasAccepted = localStorage.getItem("aichu-analytics-consent") === "accepted"
    localStorage.setItem("aichu-analytics-consent", choice)
    if (choice === "rejected") {
      pauseAnalytics()
      // Reload to fully stop Yandex's script after revoking consent.
      if (wasAccepted && isYandexMetricaConfigured()) { window.location.reload(); return }
    }
    setAnalyticsConsent(choice)
    cookiePolicyRef.current?.close()
  }
  const cookiePolicyRef = useRef<HTMLDialogElement>(null)
  const openCookieSettings = () => cookiePolicyRef.current?.showModal()
  const analyticsServices = [
    isYandexMetricaConfigured() ? "Яндекс.Метрика" : null,
    isGoogleAnalyticsConfigured() ? "Google Analytics" : null
  ].filter(Boolean).join(" + ")
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]")
      if (!anchor) return
      const href = anchor.getAttribute("href") || ""
      const contactMethod = href.startsWith("tel:") ? "phone"
        : href.startsWith("mailto:") ? "email"
        : href.startsWith("https://t.me/") ? "telegram" : null
      if (contactMethod) trackEvent("contact_click", { contact_method: contactMethod, page_language: language })
      if (href === "#products") trackEvent("product_navigation", { product_id: "all", page_language: language })
      if (/^#product-0[1-4]$/.test(href)) trackEvent("product_navigation", { product_id: href.slice(1), page_language: language })
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [language])
  useEffect(() => { localStorage.setItem("aichu-theme", theme) }, [theme])
  const languageMenuRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) languageMenuRef.current?.removeAttribute("open")
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") languageMenuRef.current?.removeAttribute("open")
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])
  const rezText = (ru: string, en: string, ky: string) => language === "ru" ? ru : language === "en" ? en : ky
  const [section, setSection] = useState("about")
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => {
      const about = document.getElementById("about")
      const ids = ["about", "problem", "how", "practice", "products", "contacts", "customers", "questions"]
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
      <h1 className="sr-only">{language === "en" ? "aichuuu.co — Digital Intelligence Studio. B2B SaaS products in development." : language === "ky" ? "aichuuu.co — Digital Intelligence Studio. B2B SaaS продукттар иштелип чыгууда." : "aichuuu.co — Digital Intelligence Studio. Разрабатываем B2B SaaS-продукты для аналитики и автоматизации бизнеса."}</h1>
      <style>{`
        .aichu-light { background:#FFFFFF !important; color:#07142D !important; }
        .aichu-light .bg-\\[\\#07142D\\] { background-color:#FFFFFF !important; }
        .aichu-light .bg-\\[\\#091932\\], .aichu-light .bg-\\[\\#0B1C3B\\] { background-color:#fff !important; }
        .aichu-light .text-\\[\\#F4EAF0\\], .aichu-light [class*="text-[#F4EAF0]"] { color:#07142D !important; }
        .aichu-light [class*="border-[#F4EAF0]"] { border-color:rgba(7,20,45,.16) !important; }
        .aichu-light [class*="bg-[#F4EAF0]/"] { background-color:rgba(7,20,45,.06) !important; }
        .aichu-light .bg-\\[\\#F4EAF0\\] { background-color:#FFFFFF !important; }
        .aichu-light .text-\\[\\#07142D\\] { color:#07142D !important; }
        .aichu-light .hwf-root { color:#07142D !important; }
        .aichu-light .text-\\[\\#FDC21E\\] { color:#9A6B00 !important; }
        .aichu-light .hover\\:text-\\[\\#FDC21E\\]:hover { color:#9A6B00 !important; }
        .aichu-light .group:hover .group-hover\\:text-\\[\\#FDC21E\\] { color:#9A6B00 !important; }
        .aichu-light article:not([class*="bg-[#F4EAF0]"]) { background-color:#fff !important; }
        .aichu-light [class*="text-[#F4EAF0]/"] { color:rgba(7,20,45,.72) !important; }
      `}</style>
      <header className="sticky top-0 z-40 bg-[#07142D] px-2 py-2 text-[#F4EAF0] sm:px-4 md:px-8 lg:py-3">
        <div className="mx-auto flex max-w-[1440px] items-center justify-center">
          <LiquidNavbar
            tone={theme}
            sound={false}
            active={!visible ? 0 : section === "about" || section === "problem" ? 1 : section === "how" || section === "practice" ? 2 : section === "products" ? 3 : 4}
            onChange={(index) => setSection(["about", "problem", "how", "products", "contacts"][index])}
            items={[
              { label: language === "ru" ? "Главная" : language === "ky" ? "Башкы бет" : "Home", href: "#top", icon: <Home size={18} strokeWidth={1.8} />, fx: "glow" },
              { label: language === "ru" ? "Воронка" : language === "ky" ? "Воронка" : "Funnel", href: "#problem", icon: <ChartNoAxesCombined size={18} strokeWidth={1.8} />, fx: "drop" },
              { label: language === "ru" ? "Подход" : language === "ky" ? "Ыкма" : "Approach", href: "#how", icon: <Workflow size={18} strokeWidth={1.8} />, fx: "spin" },
              { label: "REZON", href: "#products", icon: <Layers size={18} strokeWidth={1.8} />, fx: "plane" },
              { label: language === "ru" ? "Контакты" : language === "ky" ? "Байланыш" : "Contacts", href: "#contacts", icon: <Mail size={18} strokeWidth={1.8} />, fx: "wave" },
            ]}
            endContent={
              <>
                <button
                  type="button"
                  className="nimbus-action"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label={language === "ru" ? (theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему") : language === "ky" ? (theme === "dark" ? "Ачык теманы күйгүзүү" : "Караңгы теманы күйгүзүү") : (theme === "dark" ? "Switch to light theme" : "Switch to dark theme")}
                  title={language === "ru" ? "Тема" : language === "ky" ? "Тема" : "Theme"}
                >
                  {theme === "dark" ? <Sun size={19} strokeWidth={1.8} /> : <Moon size={19} strokeWidth={1.8} />}
                </button>
                <details ref={languageMenuRef} className="nimbus-language relative">
                  <summary
                    className="nimbus-action nimbus-language-summary"
                    aria-label={language === "ru" ? "Выбрать язык" : language === "ky" ? "Тилди тандоо" : "Choose language"}
                    title={language === "ru" ? "Язык" : language === "ky" ? "Тил" : "Language"}
                  >
                    <span>{language.toUpperCase()}</span>
                  </summary>
                  <div className={`absolute right-0 top-full z-50 mt-3 w-44 overflow-hidden rounded-xl border p-1 shadow-2xl ${theme === "light" ? "border-[#07142D]/15 bg-white text-[#07142D]" : "border-[#F4EAF0]/20 bg-[#07142D] text-[#F4EAF0]"}`}>
                    {([["ru", "Русский"], ["en", "English"], ["ky", "Кыргызча"]] as const).map(([code, label]) => (
                      <button
                        type="button"
                        key={code}
                        lang={code}
                        onClick={() => { languageMenuRef.current?.removeAttribute("open"); if (code !== language) changeLanguage(code) }}
                        aria-current={language === code ? "true" : undefined}
                        className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[#FDC21E]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FDC21E]"
                      >
                        <span>{label}</span>
                        {language === code && <span aria-hidden="true" className="text-[#C79400]">✓</span>}
                      </button>
                    ))}
                  </div>
                </details>
                <AuthControl language={language} theme={theme} />
              </>
            }
          />
        </div>
      </header>
      {/* The original interactive halftone wordmark now IS the hero, not a footer below it. */}
      <section aria-label="Интерактивный логотип aichuuu.co" className="w-full">
        <HalftoneWordmarkFooter
          wordmark="aichuuu.co"
          label=""
          meta=""
          backToTop={false}
          palette={theme === "dark" ? { background: "#07142D", ink: "#F4EAF0", warm: "#FDC21E" } : { background: "#FFFFFF", ink: "#07142D", warm: "#FDC21E" }}
          dotGap={6}
          radius={80}
          crop={0.05}
          grain={0.25}
          height="clamp(320px, 58svh, 620px)"
          columns={[]}
        />
      </section>

      <div id="about" className="relative">
      <SalesLeakageFunnel language={language} theme={theme} />
      <section id="how" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12">
        <h2 className="text-3xl font-medium md:text-5xl">{tr("От данных к действиям.")}</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[["01",tr("Определяем данные"),tr("Выбираем необходимые показатели продаж, CRM, цен и коммуникаций под задачи компании.")],["02",tr("Настраиваем анализ"),tr("Формируем метрики прибыли и KPI, цикл сделки, потери лидов, маржу и качество диалогов.")],["03",tr("Применяем результаты"),tr("Используем выявленные отклонения для контроля процессов и принятия управленческих решений.")]].map(([n,t,d])=><div key={n} className="rounded-xl border border-[#F4EAF0]/15 p-7"><span className="text-[#FDC21E]">{n}</span><h3 className="mt-8 text-xl">{t}</h3><p className="mt-3 text-sm text-[#F4EAF0]/60">{d}</p></div>)}
        </div>
      </section>
      <IllosShaderFeatureBento
        eyebrow=""
        title={tr("Практические сценарии.")}
        items={[
          {
            title: tr("Продажи и прибыль"),
            description: tr("Сопоставляйте продажи, прибыль и KPI. Разграничивайте доступ к показателям для разных ролей."),
            illustration: "vector-search",
          },
          {
            title: language === "ru" ? "CRM и коммуникации" : language === "en" ? "CRM and communications" : "CRM жана коммуникациялар",
            description: language === "ru"
              ? "Контролируйте скорость обработки заявок, потери лидов и качество переписок с клиентами."
              : language === "en"
                ? "Monitor enquiry response times, lost leads and the quality of customer conversations."
                : "Кайрылууларды иштетүү ылдамдыгын, жоголгон лиддерди жана кардарлар менен кат алышуунун сапатын көзөмөлдөңүз.",
            illustration: "cache-layer",
          },
          {
            title: tr("Маржинальность"),
            description: tr("Отслеживайте изменения цен и предложения поставщиков, анализируйте влияние на маржинальность."),
            illustration: "rate-limit",
          },
        ]}
      />
      <section id="products" className="mx-auto max-w-[1440px] scroll-mt-28 px-6 pb-28 pt-8 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#F4EAF0]/15 pb-7">
          <div>
            <h2 className="text-5xl font-semibold tracking-[-.04em] md:text-7xl">REZON<span className="text-[#FDC21E]">.</span></h2>
            <p className="mt-4 text-base font-medium tracking-wide md:text-xl">CRM &amp; Business Intelligence</p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#F4EAF0]/65">{rezText("Система управления и интеллектуальной аналитики бизнеса. Два равнозначных направления в одной платформе.", "Business management and intelligence in one platform. Two equally important capabilities.", "Бир платформада бизнести башкаруу жана интеллектуалдык талдоо. Эки тең маанилүү багыт.")}</p>
        </div>
        <div id="product-01" className="scroll-mt-28" />
        <div id="product-02" className="scroll-mt-28" />
        <RezonGlassDashboard language={language} theme={theme} />
        <div className="mt-8 border-l-2 border-[#FDC21E] pl-5 md:pl-7">
          <p className="max-w-4xl text-xl font-medium leading-relaxed tracking-tight md:text-3xl">{rezText("Не просто показываем, что происходит в продажах. Помогаем понять почему и что нужно улучшить.", "Not just what is happening in sales, but why and what needs improving.", "Сатууда эмне болуп жатканын гана эмес, анын себептерин жана эмнени жакшыртуу керектигин түшүнүүгө жардам беребиз.")}</p>
        </div>
        <p className="mt-7 text-xs leading-relaxed text-[#F4EAF0]/50">{rezText("REZON разрабатывается как концепция и прототип. Описанные функции пока не являются доступным коммерческим сервисом.", "REZON is in concept and prototype development. These planned features are not yet a commercially available service.", "REZON азыр концепция жана прототип баскычында. Бул пландалган функциялар азырынча коммерциялык сервис эмес.")}</p>
      </section>
      <section id="contacts" className="mx-auto max-w-[1440px] scroll-mt-28 px-6 pb-28 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#F4EAF0]/15 pb-7">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">{language === "ru" ? "Контакты" : language === "en" ? "Contacts" : "Байланыш"}<span className="text-[#FDC21E]">.</span></h2>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#F4EAF0]/20">
          <div className="bg-[#0B1C3B] p-8 md:p-12">
            <div className="divide-y divide-[#F4EAF0]/15 border-y border-[#F4EAF0]/15">
              {[
                { name: "Instagram", address: "@aichuuu.co", href: "https://www.instagram.com/aichuuu.co/" },
                { name: "Threads", address: "@aichuuu.co", href: "https://www.threads.net/@aichuuu.co" },
                { name: "Telegram", address: "@Aichuuuco", href: "https://t.me/Aichuuuco" },
                { name: "Email", address: "aichurekmilashka@icloud.com", href: "mailto:aichurekmilashka@icloud.com" },
                { name: "Телефон", address: "+996 503 030 997", href: "tel:+996503030997" },
              ].map(channel => channel.href ? (
                <a key={channel.name} href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex min-h-[70px] items-center justify-between gap-4 py-5 transition-colors hover:text-[#FDC21E]">
                  <span className="text-lg font-medium">{channel.name}</span>
                  <span className="min-w-0 break-all text-right text-sm text-[#F4EAF0]/60 group-hover:text-[#FDC21E] sm:break-normal">{channel.address} ↗</span>
                </a>
              ) : (
                <div key={channel.name} className="flex min-h-[70px] items-center justify-between gap-4 py-5">
                  <span className="text-lg font-medium">{channel.name}</span>
                  <span className="text-sm text-[#F4EAF0]/60">{channel.address || (language === "ru" ? "Адрес уточняется" : language === "en" ? "Link pending" : "Дарек такталууда")}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-[#F4EAF0]/50">{language === "ru" ? "Публикуем только подтверждённые контакты проекта." : language === "en" ? "Only verified project contact details are published." : "Долбоордун ырасталган байланыш даректери гана жарыяланат."}</p>
          </div>
        </div>
      </section>
      <section id="customers" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FDC21E]">07 / WHO IT IS FOR</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">{tr("Для команд, которым нужна ясность.")}</h2>
        <p className="mt-6 max-w-2xl text-[#F4EAF0]/65">{tr("Для собственников и руководителей, которым важны прибыль и KPI; для отделов продаж, контролирующих воронку и скорость обработки; для коммерческих команд, управляющих ценами и маржой; для руководителей клиентского сервиса, оценивающих качество переписок.")}</p>
      </section>
      <section id="questions" className="mx-auto max-w-[1440px] px-6 pb-28 md:px-12">
        <span className="text-xs tracking-[.2em] text-[#FDC21E]">08 / QUESTIONS</span>
        <h2 className="mt-5 text-3xl font-medium md:text-5xl">{tr("Частые вопросы.")}</h2>
        <div className="mt-8 divide-y divide-[#F4EAF0]/15 rounded-xl border border-[#F4EAF0]/15 px-5">
          {[
            [rezText("На какой стадии REZON?", "What stage is REZON at?", "REZON кайсы этапта?"), rezText("Разрабатываем концепцию и прототипы. Продажи и платные внедрения через сайт пока не осуществляются.", "The concept and prototypes are in development. No paid services are sold through this site.", "Азыр концепция жана прототиптер иштелүүдө. Сайт аркылуу азырынча акы төлөнүүчү кызматтар көрсөтүлбөйт.")],
            [rezText("Чем REZON отличается от обычной CRM?", "How is REZON different from a typical CRM?", "REZON кадимки CRMден эмнеси менен айырмаланат?"), rezText("REZON объединяет управление продажами с аналитикой конверсии, прибыли и причин потерь, чтобы находить конкретные возможности улучшения.", "REZON combines sales management with analytics for conversions, profit and reasons for losses to identify improvements.", "REZON сатууну башкарууну конверсияны, пайданы жана жоготуулардын себептерин талдоо менен айкалыштырат.")],
            [rezText("Что входит в CRM?", "What is included in CRM?", "CRM эмнелерди камтыйт?"), rezText("Клиенты, сделки, этапы продаж, задачи, менеджеры и автоматизация процессов.", "Customers, deals, pipeline stages, tasks, sales teams and automation.", "Кардарлар, бүтүмдөр, сатуу этаптары, тапшырмалар, менеджерлер жана автоматташтыруу.")],
            [rezText("Что анализирует Intelligence?", "What does Intelligence analyze?", "Intelligence эмнени талдайт?"), rezText("Воронку, конверсию, прибыль, эффективность сотрудников, потери и причины отклонений.", "Funnels, conversions, profit, team performance, losses and reasons for variance.", "Воронканы, конверсияны, пайданы, кызматкерлердин натыйжалуулугун, жоготууларды жана четтөөлөрдүн себептерин.")],
            [rezText("Нужна ли отдельная CRM?", "Is a separate CRM required?", "Өзүнчө CRM керекпи?"), rezText("REZON задуман как единая CRM и аналитическая система. Возможность интеграции с другими платформами уточняется отдельно.", "REZON is designed as a unified CRM and analytics platform. Integrations with other systems will be evaluated separately.", "REZON бирдиктүү CRM жана аналитика платформасы катары пландалган. Башка системалар менен интеграция өзүнчө каралат.")]
          ].map(([q,a])=><details key={q} className="group py-5"><summary className="cursor-pointer list-none text-lg">{q}<span className="float-right text-[#FDC21E]">+</span></summary><p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#F4EAF0]/65">{a}</p></details>)}
        </div>
      </section>
      </div>
      <footer className="border-t border-[#F4EAF0]/15 px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 text-sm md:flex-row md:items-center">
          <div><p className="font-medium">aichuuu.co <span className="text-[#FDC21E]">/</span> Digital Intelligence Studio</p><p className="mt-2 text-[#F4EAF0]/55">© {new Date().getFullYear()} aichuuu.co</p>{isAnalyticsConfigured() && <button type="button" onClick={openCookieSettings} className="mt-2 text-xs text-[#F4EAF0]/60 underline underline-offset-4 hover:text-[#FDC21E]">{language === "ru" ? "Настройки cookie" : language === "ky" ? "Cookie жөндөөлөрү" : "Cookie preferences"}</button>}</div>
          <nav aria-label={language === "ru" ? "Навигация по странице" : language === "ky" ? "Барактын навигациясы" : "Page navigation"} className="flex flex-wrap gap-x-6 gap-y-3 text-[#F4EAF0]/70">
            <a href="#contacts" className="transition-colors hover:text-[#FDC21E]">{language === "ru" ? "Контакты" : language === "ky" ? "Байланыш" : "Contacts"}</a>
            <a href="#products" className="transition-colors hover:text-[#FDC21E]">{language === "ru" ? "Продукты" : language === "ky" ? "Продукттар" : "Products"}</a>
            <a href="#questions" className="transition-colors hover:text-[#FDC21E]">{language === "ru" ? "Вопросы" : language === "ky" ? "Суроолор" : "FAQ"}</a>
            <a href="#top" className="transition-colors hover:text-[#FDC21E]">{language === "ru" ? "Наверх ↑" : language === "ky" ? "Жогору ↑" : "Back to top ↑"}</a>
          </nav>
        </div>
      </footer>
      {isAnalyticsConfigured() && analyticsConsent === null && (
        <aside role="region" aria-label={rezText("Настройки cookie", "Cookie preferences", "Cookie жөндөөлөрү")} className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-[640px] rounded-2xl border border-[#FDC21E]/35 bg-[#07142D] p-5 text-[#F4EAF0] shadow-2xl sm:bottom-6 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#FDC21E]">COOKIE &amp; PRIVACY</p>
          <p className="mt-3 text-sm leading-relaxed text-[#F4EAF0]/85">
            {rezText(
              "Мы используем необходимые cookie для работы сайта. С вашего согласия также включаем аналитику посещений, чтобы улучшать сайт. Вы можете принять или отклонить необязательные cookie.",
              "We use essential cookies to run this website. With your consent, we also use visit analytics to improve it. You can accept or decline optional cookies.",
              "Сайттын иштеши үчүн зарыл cookie файлдары колдонулат. Макулдугуңуз болсо гана сайтты жакшыртуу үчүн кирүүлөрдү талдайбыз. Кошумча cookie файлдарына макул болууга же баш тартууга болот."
            )}
          </p>
          <div className="mt-4 flex flex-col gap-2 min-[380px]:flex-row">
            <button type="button" onClick={() => chooseAnalytics("accepted")} className="min-h-11 flex-1 rounded-lg border border-[#FDC21E]/80 px-4 py-2 text-sm font-medium text-[#F4EAF0] transition-colors hover:bg-[#FDC21E]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDC21E]">
              {rezText("Принять", "Accept", "Макул болуу")}
            </button>
            <button type="button" onClick={() => chooseAnalytics("rejected")} className="min-h-11 flex-1 rounded-lg border border-[#FDC21E]/80 px-4 py-2 text-sm font-medium text-[#F4EAF0] transition-colors hover:bg-[#FDC21E]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDC21E]">
              {rezText("Отклонить", "Decline", "Баш тартуу")}
            </button>
          </div>
          <button type="button" onClick={openCookieSettings} className="mt-3 min-h-9 text-left text-xs text-[#F4EAF0]/70 underline decoration-[#F4EAF0]/40 underline-offset-4 transition-colors hover:text-[#FDC21E]">
            {rezText("Подробнее о cookie и данных", "How cookies and data are used", "Cookie жана маалыматтар тууралуу")}
          </button>
        </aside>
      )}
      {isAnalyticsConfigured() && (
        <dialog ref={cookiePolicyRef} aria-labelledby="cookie-policy-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[min(94vw,680px)] overflow-y-auto rounded-2xl border border-[#FDC21E]/40 bg-[#07142D] p-0 text-[#F4EAF0] shadow-2xl backdrop:bg-[#07142D]/80">
          <div className="p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#FDC21E]">AICHUUU.CO / PRIVACY</p>
                <h2 id="cookie-policy-title" className="mt-2 text-xl font-semibold">
                  {rezText("Cookie и обработка данных", "Cookies and data processing", "Cookie жана маалыматтарды иштетүү")}
                </h2>
              </div>
              <button type="button" onClick={() => cookiePolicyRef.current?.close()} aria-label={rezText("Закрыть", "Close", "Жабуу")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#F4EAF0]/25 text-xl hover:border-[#FDC21E]">×</button>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#F4EAF0]/80">
              <p>{rezText(
                "На сайте используются необходимые технологии хранения настроек (например, выбора темы и решения о cookie). Они нужны для работы интерфейса и не используются для рекламы.",
                "The website uses essential storage for preferences, such as your theme and cookie choice. These are used to operate the interface, not for advertising.",
                "Сайт интерфейстин иштеши үчүн зарыл болгон жөндөөлөрдү (мисалы, теманы жана cookie тандоосун) сактайт. Алар жарнама үчүн колдонулбайт."
              )}</p>
              <p>{rezText(
                "Только с вашего согласия мы подключаем аналитику. Она может обрабатывать сведения о просмотренных страницах, действиях на сайте, параметрах устройства и браузера, IP-адресе и идентификаторах cookie. Цель — статистика посещений и улучшение сайта.",
                "Only with your consent do we enable analytics. It may process visited pages, on-site actions, device and browser details, IP addresses and cookie identifiers. The purpose is visitor statistics and website improvement.",
                "Макулдугуңуз менен гана аналитика иштетилет. Ал ачылган барактар, сайттагы аракеттер, түзмөк жана браузер, IP дарек жана cookie идентификаторлору тууралуу маалыматтарды иштете алат. Максат — кирүүлөрдү талдоо жана сайтты жакшыртуу."
              )}</p>
              <p>{rezText(
                "Поставщики аналитики:", "Analytics providers:", "Аналитика кызматтары:"
              )} <span className="font-medium text-[#F4EAF0]">{analyticsServices}</span>. {rezText(
                "Данные могут передаваться этим поставщикам, в том числе для обработки за пределами вашей страны. Сроки хранения аналитических cookie зависят от настроек и политик поставщиков.",
                "Data may be shared with these providers, including processing outside your country. Analytics cookie retention depends on provider settings and policies.",
                "Маалыматтар бул кызматтарга, анын ичинде өлкөңүздөн тышкары иштетүү үчүн берилиши мүмкүн. Аналитикалык cookie файлдарын сактоо мөөнөтү кызматтын жөндөөлөрүнө жана саясатына жараша болот."
              )}</p>
              <p>{rezText(
                "Условия обработки данных поставщиками:",
                "Providers’ data processing policies:",
                "Кызматтардын маалыматтарды иштетүү эрежелери:"
              )}{" "}
                {isYandexMetricaConfigured() && <a className="underline underline-offset-4 hover:text-[#FDC21E]" href="https://yandex.com/legal/confidential/" target="_blank" rel="noopener noreferrer">Yandex Privacy</a>}
                {isYandexMetricaConfigured() && isGoogleAnalyticsConfigured() && " · "}
                {isGoogleAnalyticsConfigured() && <a className="underline underline-offset-4 hover:text-[#FDC21E]" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy</a>}
              </p>
              <p>{rezText(
                "Ваш выбор сохраняется в браузере до его изменения или удаления данных сайта. Аналитика не загружается до согласия. Согласие можно изменить или отозвать в любой момент через «Настройки cookie» внизу сайта; при отзыве аналитика отключается после перезагрузки страницы. Отказ не ограничивает доступ к сайту.",
                "Your choice is saved in the browser until you change it or clear site data. Analytics will not load before consent. You can change or withdraw consent any time using “Cookie preferences” in the footer; analytics stops after a page reload when withdrawn. Declining does not restrict access to this website.",
                "Тандооңуз өзгөртүлмөйүнчө же сайттын маалыматы өчүрүлмөйүнчө браузерде сакталат. Макулдук берилмейинче аналитика жүктөлбөйт. Макулдукту каалаган убакта барактын аягындагы «Cookie жөндөөлөрү» аркылуу өзгөртсөңүз болот; баш тартканда аналитика барак жаңыртылгандан кийин токтойт. Баш тартуу сайтты колдонууга тоскоол болбойт."
              )}</p>
              <p>{rezText(
                "По вопросам обработки данных: ", "For privacy inquiries: ", "Маалыматтарды иштетүү боюнча суроолор: "
              )}<a className="underline underline-offset-4 hover:text-[#FDC21E]" href="mailto:aichurekmilashka@icloud.com">aichurekmilashka@icloud.com</a></p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => chooseAnalytics("accepted")} className="min-h-11 flex-1 rounded-lg border border-[#FDC21E]/80 px-4 py-2 text-sm font-medium hover:bg-[#FDC21E]/15">{rezText("Принять аналитику", "Accept analytics", "Аналитикага макул болуу")}</button>
              <button type="button" onClick={() => chooseAnalytics("rejected")} className="min-h-11 flex-1 rounded-lg border border-[#FDC21E]/80 px-4 py-2 text-sm font-medium hover:bg-[#FDC21E]/15">{rezText("Отклонить аналитику", "Decline analytics", "Аналитикадан баш тартуу")}</button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  )
}
