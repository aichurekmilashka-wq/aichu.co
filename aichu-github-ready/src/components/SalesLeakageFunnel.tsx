import { useEffect, useState } from "react"
import "./sales-leakage-funnel.css"

type Language = "ru" | "en" | "ky"
type Stage = {
  title: string
  shortLines: string[]
  task: string
  risk: string
  metric: string
}
type Content = {
  eyebrow: string
  headline: string
  emphasis: string
  introduction: string
  incoming: string
  result: string
  overview: string
  stageLabel: string
  taskLabel: string
  riskLabel: string
  metricLabel: string
  next: string
  previous: string
  restart: string
  legend: string
  leakHints: string[]
  stages: Stage[]
}
const text: Record<Language, Content> = {
  ru: {
    eyebrow: "02 / SALES LEAKAGE",
    headline: "Куда утекает",
    emphasis: "ваша прибыль?",
    introduction: "Потери возникают на каждом этапе взаимодействия с покупателем. Важно видеть не только итог сделки, но и причины, по которым клиент не дошёл до покупки или не вернулся.",
    incoming: "ПОТОК ОБРАЩЕНИЙ",
    result: "ПОКУПКА И ВОЗВРАТ",
    overview: "Пять точек контроля",
    stageLabel: "ЭТАП СДЕЛКИ",
    taskLabel: "ЗАДАЧА",
    riskLabel: "ГДЕ ВОЗНИКАЕТ УТЕЧКА",
    metricLabel: "ЧТО КОНТРОЛИРОВАТЬ",
    next: "Следующий этап",
    previous: "Назад",
    restart: "Новый цикл",
    legend: "Розовые потоки обозначают возможные потери, а не реальные показатели компании.",
    leakHints: ["Долгий ответ менеджера", "Скрытые мотивы не выявлены", "Не предложены нужные услуги", "Неудобный способ оплаты", "Покупатель не вернулся"],
    stages: [
      { title: "Первый контакт", shortLines: ["Первый контакт"], task: "Принять обращение, понять первоначальный запрос и ответить на вопросы покупателя.", risk: "Запрос обработан неправильно. Открытые вопросы остаются без ответа.", metric: "Скорость и качество обработки обращения, полнота ответов." },
      { title: "Выявление потребностей", shortLines: ["Выявление", "потребностей"], task: "Выявить скрытые потребности, мотивы и реальные критерии выбора покупателя.", risk: "Менеджер ограничился поверхностным запросом и не понял, что действительно важно покупателю.", metric: "Качество выявления потребностей и мотивов." },
      { title: "Персональное предложение", shortLines: ["Персональное", "предложение"], task: "Предложить дополнительные услуги под скрытые потребности, удобный способ оплаты и максимально лёгкий путь к покупке.", risk: "Предложение не учитывает мотивы клиента, дополнительные услуги не предложены или путь к покупке сложен.", metric: "Релевантность предложения, дополнительные услуги, переход к оплате." },
      { title: "Оплата", shortLines: ["Оплата"], task: "Помочь покупателю завершить оплату и подтвердить успешное закрытие сделки.", risk: "Клиент готов купить, но сталкивается с трудностями при оплате или оформлении.", metric: "Конверсия в оплату, отказы на финальном этапе." },
      { title: "Повторная покупка", shortLines: ["Повторная", "покупка"], task: "Понять, вернулся ли покупатель после завершения сделки и что влияет на его возвращение.", risk: "Связь с клиентом обрывается после оплаты и возможность повторной продажи теряется.", metric: "Доля повторных покупателей, возврат и удержание клиентов." },
    ],
  },
  en: {
    eyebrow: "02 / SALES LEAKAGE",
    headline: "Where does your",
    emphasis: "profit leak?",
    introduction: "Losses occur at every stage of the buyer journey. The goal is to understand not just the final outcome, but why people fail to purchase or return.",
    incoming: "INCOMING ENQUIRIES",
    result: "PURCHASE & RETURN",
    overview: "Five control points",
    stageLabel: "SALES STAGE",
    taskLabel: "OBJECTIVE",
    riskLabel: "WHERE VALUE IS LOST",
    metricLabel: "WHAT TO MONITOR",
    next: "Next stage",
    previous: "Back",
    restart: "New cycle",
    legend: "Pink streams illustrate potential leakage, not actual company performance.",
    leakHints: ["Manager responds too slowly", "Underlying motivations missed", "Relevant services not offered", "Inconvenient payment options", "Customer does not return"],
    stages: [
      { title: "First contact", shortLines: ["First contact"], task: "Handle the enquiry, understand the initial request and answer the buyer's questions.", risk: "The request is handled poorly and questions remain unanswered.", metric: "Response speed, handling quality and completeness of answers." },
      { title: "Needs discovery", shortLines: ["Needs", "discovery"], task: "Uncover underlying needs, motivations and the buyer's real decision criteria.", risk: "The manager only addresses the surface request and misses what matters most.", metric: "Quality of needs and motivation discovery." },
      { title: "Personalised offer", shortLines: ["Personalised", "offer"], task: "Offer relevant additional services, convenient payment options and an easy path to purchase.", risk: "The offer misses the buyer's motives, relevant extras or a convenient buying path.", metric: "Offer relevance, additional services and progress to payment." },
      { title: "Payment", shortLines: ["Payment"], task: "Help the buyer complete payment and confirm the deal is closed.", risk: "A ready buyer encounters payment or checkout friction.", metric: "Payment conversion and drop-off at checkout." },
      { title: "Repeat purchase", shortLines: ["Repeat", "purchase"], task: "Find out whether buyers return and what influences repeat business.", risk: "The relationship ends after payment and repeat sales are missed.", metric: "Repeat purchase rate and customer retention." },
    ],
  },
  ky: {
    eyebrow: "02 / САТУУДАГЫ ЖОГОТУУЛАР",
    headline: "Пайдаңыз",
    emphasis: "кайда жоголууда?",
    introduction: "Жоготуулар сатып алуучу менен иштөөнүн ар бир этабында пайда болушу мүмкүн. Бүтүмдүн жыйынтыгын гана эмес, кардар эмне үчүн сатып албаганын же кайтып келбегенин да түшүнүү маанилүү.",
    incoming: "КЕЛГЕН КАЙРЫЛУУЛАР",
    result: "САТЫП АЛУУ ЖАНА КАЙТУУ",
    overview: "Беш көзөмөл чекити",
    stageLabel: "БҮТҮМ ЭТАБЫ",
    taskLabel: "МИЛДЕТ",
    riskLabel: "ЖОГОТУУ КАЙДА ПАЙДА БОЛОТ",
    metricLabel: "ЭМНЕНИ КӨЗӨМӨЛДӨӨ КЕРЕК",
    next: "Кийинки этап",
    previous: "Артка",
    restart: "Жаңы цикл",
    legend: "Кызгылт агымдар компаниянын чыныгы көрсөткүчтөрүн эмес, мүмкүн болгон жоготууларды билдирет.",
    leakHints: ["Менеджер кеч жооп берет", "Жашыруун мотивдер аныкталган эмес", "Керектүү кызматтар сунушталбайт", "Төлөм ыкмасы ыңгайсыз", "Кардар кайра келген жок"],
    stages: [
      { title: "Биринчи байланыш", shortLines: ["Биринчи", "байланыш"], task: "Кайрылууну туура кабыл алып, алгачкы суроо-талапты түшүнүп, сатып алуучунун суроолоруна жооп берүү.", risk: "Суроо-талап туура иштелбейт, кардардын суроолору жоопсуз калат.", metric: "Жооп берүү ылдамдыгы, кайрылууну иштетүү сапаты жана жооптордун толуктугу." },
      { title: "Муктаждыктарды аныктоо", shortLines: ["Муктаждыктарды", "аныктоо"], task: "Сатып алуучунун жашыруун муктаждыктарын, мотивдерин жана тандоо критерийлерин аныктоо.", risk: "Менеджер үстүртөн айтылган суроо-талап менен чектелип, кардар үчүн маанилүү нерсени түшүнбөйт.", metric: "Муктаждыктарды жана мотивдерди аныктоо сапаты." },
      { title: "Жекече сунуш", shortLines: ["Жекече", "сунуш"], task: "Жашыруун муктаждыктарга ылайык кошумча кызматтарды, ыңгайлуу төлөмдү жана сатып алуунун жөнөкөй жолун сунуштоо.", risk: "Сунуш кардардын мотивдерин эске албайт, кошумча кызматтар сунушталбайт же сатып алуу татаал.", metric: "Сунуштун ылайыктуулугу, кошумча кызматтар жана төлөмгө өтүү." },
      { title: "Төлөм", shortLines: ["Төлөм"], task: "Кардарга төлөмдү бүтүрүүгө жардам берип, бүтүмдүн аяктаганын ырастоо.", risk: "Сатып алууга даяр кардар төлөм же тариздөө учурунда тоскоолдукка туш болот.", metric: "Төлөмгө конверсия жана акыркы этаптагы баш тартуулар." },
      { title: "Кайра сатып алуу", shortLines: ["Кайра сатып", "алуу"], task: "Кардар кайра келдиби жана ага эмне таасир бергенин аныктоо.", risk: "Төлөмдөн кийин кардар менен байланыш үзүлүп, кайра сатуу мүмкүнчүлүгү жоголот.", metric: "Кайра сатып алуучулардын үлүшү жана кардарларды кармап калуу." },
    ],
  },
}

const tiers = [
  { d: "M100 150 Q350 128 600 150 L552 252 Q350 269 148 252 Z", top: 150, rx: 250, holeX: 151, holeY: 214, holeSide: -1, leak: "M151 214 C111 202 101 247 34 253", labelY: 203 },
  { d: "M164 272 Q350 255 536 272 L502 367 Q350 381 198 367 Z", top: 272, rx: 186, holeX: 521, holeY: 323, holeSide: 1, leak: "M521 323 C571 325 594 354 665 366", labelY: 321 },
  { d: "M206 386 Q350 375 494 386 L465 477 Q350 490 235 477 Z", top: 386, rx: 144, holeX: 238, holeY: 436, holeSide: -1, leak: "M238 436 C190 427 166 475 76 493", labelY: 433 },
  { d: "M242 497 Q350 490 458 497 L437 585 Q350 597 263 585 Z", top: 497, rx: 108, holeX: 440, holeY: 540, holeSide: 1, leak: "M440 540 C496 530 546 577 646 591", labelY: 548 },
  { d: "M272 603 Q350 595 428 603 L408 681 Q350 694 292 681 Z", top: 603, rx: 78, holeX: 292, holeY: 650, holeSide: -1, leak: "M292 650 C250 635 213 695 145 707", labelY: 650 },
]

export default function SalesLeakageFunnel({ language, theme }: { language: Language; theme: "dark" | "light" }) {
  const [active, setActive] = useState(0)
  const [hoveredLeak, setHoveredLeak] = useState<number | null>(null)
  const [manual, setManual] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const copy = text[language]

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (manual || reducedMotion) return
    const id = window.setInterval(() => setActive(current => (current + 1) % 5), 6000)
    return () => window.clearInterval(id)
  }, [manual, reducedMotion])

  function choose(index: number) {
    setActive((index + 5) % 5)
    setManual(true)
    setHoveredLeak(null)
  }

  function showLeak(index: number) {
    setActive(index)
    setManual(true)
    setHoveredLeak(index)
  }

  return (
    <section id="problem" aria-labelledby="sales-leakage-title" className={"sl-root " + (theme === "light" ? "sl-light" : "sl-dark")}>
      <div className="sl-shell">
        <div className="sl-eyebrow"><span>{copy.eyebrow}</span><span className="sl-eyebrow-end">CRM / REVENUE OPERATIONS</span></div>
        <div className="sl-heading-row">
          <h2 id="sales-leakage-title" className="sl-headline">{copy.headline}<br /><strong>{copy.emphasis}</strong></h2>
          <p className="sl-introduction">{copy.introduction}</p>
        </div>
        <div className="sl-stage-layout">
          <div className="sl-visual-column">
            <div className="sl-visual">
              <svg viewBox="0 0 700 790" role="group" aria-label={copy.overview} className="sl-funnel-svg">
                <defs>
                  <linearGradient id="sl-tier-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1F3658" stopOpacity=".82" />
                    <stop offset="46%" stopColor="#0A1A34" stopOpacity=".95" />
                    <stop offset="100%" stopColor="#253C60" stopOpacity=".86" />
                  </linearGradient>
                  <linearGradient id="sl-rim-gradient">
                    <stop offset="0" stopColor="#526988" stopOpacity=".35"/>
                    <stop offset=".5" stopColor="#E9E4F0" stopOpacity=".75"/>
                    <stop offset="1" stopColor="#516B92" stopOpacity=".3"/>
                  </linearGradient>
                  <linearGradient id="sl-flow-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#D6E9FF" stopOpacity="0" />
                    <stop offset=".35" stopColor="#AFC5EA" stopOpacity=".75" />
                    <stop offset="1" stopColor="#FA347D" stopOpacity=".3" />
                  </linearGradient>
                  <radialGradient id="sl-hole-gradient">
                    <stop offset="0" stopColor="#050C1D"/>
                    <stop offset=".68" stopColor="#070D1F"/>
                    <stop offset="1" stopColor="#FA347D" stopOpacity=".8"/>
                  </radialGradient>
                </defs>
                <text x="350" y="37" className="sl-svg-overline" textAnchor="middle">{copy.incoming}</text>
                <g className="sl-incoming" aria-hidden="true">
                  {[-46, -24, 0, 24, 46].map((delta, i) => (
                    <line key={delta} x1={350 + delta} y1="48" x2={350 + delta * .55} y2="134" stroke={i === 2 ? "#FA347D" : "#AFC9F2"} strokeWidth={i === 2 ? 2 : 1} strokeDasharray="7 13" opacity=".7"/>
                  ))}
                </g>
                <path d="M350 135 C350 300 350 520 350 710" className="sl-inner-flow" stroke="url(#sl-flow-gradient)" fill="none" strokeWidth="2" strokeDasharray="7 15" aria-hidden="true"/>
                {tiers.map((tier, i) => {
                  const selected = active === i
                  const stage = copy.stages[i]
                  return (
                    <g
                      key={i}
                      role="button"
                      tabIndex={0}
                      aria-label={(i + 1) + ". " + stage.title}
                      aria-pressed={selected}
                      className={"sl-tier " + (selected ? "sl-tier-active" : "")}
                      onClick={() => choose(i)}
                      onMouseEnter={() => { if (window.matchMedia("(hover: hover)").matches) choose(i) }}
                      onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(i) } }}
                    >
                      <path d={tier.d} fill="url(#sl-tier-gradient)" stroke={selected ? "#EBA1C9" : "#5A7191"} strokeWidth={selected ? 2 : 1.2} className="sl-tier-face"/>
                      <ellipse cx="350" cy={tier.top} rx={tier.rx} ry={i === 0 ? 20 : 13} fill="#0B1A33" fillOpacity=".92" stroke="url(#sl-rim-gradient)" strokeWidth="1.8"/>
                      <path d={tier.d} fill="none" stroke={selected ? "#FA347D" : "#B2C9ED"} strokeOpacity={selected ? ".38" : ".13"} strokeWidth="5" className="sl-tier-glow"/>
                      <text x="350" y={tier.labelY - (stage.shortLines.length > 1 ? 15 : 12)} textAnchor="middle" className="sl-tier-number">0{i + 1}</text>
                      <text x="350" y={tier.labelY + (stage.shortLines.length > 1 ? 6 : 12)} className="sl-svg-stage" textAnchor="middle">
                        {stage.shortLines.map((line, j) => <tspan key={j} x="350" dy={j === 0 ? 0 : 20}>{line}</tspan>)}
                      </text>
                      <path d={tier.leak} fill="none" stroke="#FA347D" strokeWidth={selected ? 3 : 1.6} strokeOpacity={selected ? ".92" : ".4"} strokeLinecap="round" className="sl-leak-line"/>
                      <g
                        className={"sl-hole " + (hoveredLeak === i ? "sl-hole-hovered" : "")}
                        role="button"
                        tabIndex={0}
                        aria-label={stage.title + ": " + copy.leakHints[i]}
                        aria-expanded={hoveredLeak === i}
                        onMouseEnter={() => showLeak(i)}
                        onMouseLeave={() => setHoveredLeak(null)}
                        onFocus={() => showLeak(i)}
                        onBlur={() => setHoveredLeak(null)}
                        onClick={event => { event.stopPropagation(); if (hoveredLeak === i) setHoveredLeak(null); else showLeak(i) }}
                        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); showLeak(i) } }}
                      >
                        <ellipse cx={tier.holeX} cy={tier.holeY} rx="10" ry="15" transform={"rotate(" + (tier.holeSide * 18) + " " + tier.holeX + " " + tier.holeY + ")"} fill="url(#sl-hole-gradient)" stroke={hoveredLeak === i ? "#FFC0D8" : selected ? "#FA347D" : "#A43C70"} strokeWidth={hoveredLeak === i ? 3 : selected ? 2.5 : 1.5} className="sl-hole-visual"/>
                        <ellipse cx={tier.holeX} cy={tier.holeY} rx="32" ry="34" fill="transparent" className="sl-hole-target"/>
                      </g>
                    </g>
                  )
                })}
                <g aria-hidden="true">
                  {!reducedMotion && tiers.flatMap((tier, i) => Array.from({ length: 4 }, (_, j) => (
                    <circle key={i + "-" + j} r={j % 2 ? 2 : 1.45} fill={i === active ? "#FF8CB7" : "#FA347D"} opacity={i === active ? ".95" : ".58"}>
                      <animateMotion path={tier.leak} dur={(2.5 + j * .42).toFixed(2) + "s"} begin={(-j * .66).toFixed(2) + "s"} repeatCount="indefinite" />
                    </circle>
                  )))}
                </g>
                <path d="M350 697 L350 721" stroke="#FA347D" strokeOpacity=".6" strokeWidth="1.5" strokeDasharray="3 5"/>
                <circle cx="350" cy="723" r="4" fill="#FA347D" className="sl-exit-dot"/>
                <text x="350" y="752" textAnchor="middle" className="sl-svg-overline">{copy.result}</text>
              </svg>
              {hoveredLeak !== null && (
                <div
                  className={"sl-hole-tooltip " + (tiers[hoveredLeak].holeSide < 0 ? "sl-hole-tooltip--left" : "sl-hole-tooltip--right")}
                  style={{
                    left: (tiers[hoveredLeak].holeX / 700 * 100) + "%",
                    top: (tiers[hoveredLeak].holeY / 790 * 100) + "%",
                  }}
                  role="status"
                >
                  <span className="sl-hole-tooltip-label">{String(hoveredLeak + 1).padStart(2, "0")} / {copy.stages[hoveredLeak].title}</span>
                  <strong>{copy.leakHints[hoveredLeak]}</strong>
                </div>
              )}
            </div>
            <div className="sl-stage-tabs" aria-label={copy.overview}>
              {copy.stages.map((stage, i) => <button key={i} type="button" aria-pressed={active === i} onClick={() => choose(i)}>{String(i + 1).padStart(2, "0")}</button>)}
            </div>
          </div>
          <div className="sl-card" aria-live={manual ? "polite" : "off"}>
            <div className="sl-card-top"><span>{copy.stageLabel}</span><span>{String(active + 1).padStart(2, "0")} / 05</span></div>
            <div className="sl-progress"><span style={{ width: ((active + 1) * 20) + "%" }} /></div>
            <div className="sl-card-body">
              <h3>{copy.stages[active].title}</h3>
              <div className="sl-detail"><span className="sl-detail-label">{copy.taskLabel}</span><p>{copy.stages[active].task}</p></div>
              <div className="sl-detail sl-detail-risk"><span className="sl-detail-label">{copy.riskLabel}</span><p>{copy.stages[active].risk}</p></div>
              <div className="sl-detail"><span className="sl-detail-label">{copy.metricLabel}</span><p>{copy.stages[active].metric}</p></div>
            </div>
            <div className="sl-controls">
              <button type="button" onClick={() => choose(active - 1)} aria-label={copy.previous} className="sl-prev"><span aria-hidden="true">←</span> {copy.previous}</button>
              <button type="button" onClick={() => choose(active + 1)} className="sl-next">{active === 4 ? copy.restart : copy.next} <span aria-hidden="true">{active === 4 ? "↻" : "→"}</span></button>
            </div>
          </div>
        </div>
        <div className="sl-footer"><span className="sl-legend-mark" /><span>{copy.legend}</span></div>
      </div>
    </section>
  )
}
