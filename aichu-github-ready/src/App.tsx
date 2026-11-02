import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"

export default function App(){
 return <main className="min-h-screen bg-[#07142D] text-[#F4EAF0]">
  <header className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-7 md:px-12">
    <a href="#top" aria-label="aichu.co, наверх" className="inline-flex items-center"><img src={`${import.meta.env.BASE_URL}aichu-logo.png`} alt="aichu.co" className="max-h-12 w-auto max-w-[150px] object-contain" /></a>
    <span className="text-[10px] uppercase tracking-[.2em] text-[#F4EAF0]/65">Digital intelligence studio</span>
  </header>
  <section id="top" className="mx-auto flex min-h-[62vh] max-w-[1440px] flex-col justify-center px-6 pb-16 pt-12 md:min-h-[64vh] md:px-12">
    <span className="mb-7 text-[11px] uppercase tracking-[.28em] text-[#FA347D]">Aichu.co / Preview 001</span>
    <h1 className="max-w-[1000px] text-[clamp(3rem,9vw,9rem)] font-semibold uppercase leading-[.9] tracking-[-.075em]">Данные.<br/>Логика.<br/><em className="font-normal not-italic text-[#FA347D]">Результат.</em></h1>
    <p className="mt-9 max-w-[470px] text-sm leading-relaxed text-[#F4EAF0]/65 md:text-base">Разрабатываем B2B SaaS-продукты для аналитики продаж, контроля CRM и автоматизации бизнеса.</p>
    <p className="mt-9 text-[10px] uppercase tracking-[.18em] text-[#F4EAF0]/40">Прокрутите вниз, чтобы посмотреть оригинальный интерактивный футер ↓</p>
  </section>
  <HalftoneWordmarkFooter wordmark="aichu.co" label="AICHU / TECHNOLOGY STUDIO" meta="© 2026 · B2B SOFTWARE" palette={{background:"#07142D",ink:"#F4EAF0",warm:"#FA347D"}} dotGap={6} radius={80} crop={0.2} grain={0.35} height="min(620px, 85svh)" columns={[
   {title:"Продукты",links:[{label:"Sales Intelligence",href:"#top"},{label:"CRM Quality Control",href:"#top"},{label:"Price & Margin",href:"#top"},{label:"AI Conversation",href:"#top"}]},
   {title:"Студия",links:[{label:"Наш подход",href:"#top"},{label:"О нас",href:"#top"}]},
   {title:"Контакты",links:[{label:"aichu.co",href:"https://aichu.co"}]}
  ]}/>
 </main>
}
