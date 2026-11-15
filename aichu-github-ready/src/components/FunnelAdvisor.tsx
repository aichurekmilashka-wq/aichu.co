import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, BarChart3, Check, Copy, RotateCcw, ShieldCheck, Sparkles, Target, AlertTriangle } from "lucide-react"
import { FUNNEL_STAGES, analyzeFunnel, validateFunnel } from "../lib/funnel-analysis"
import "./funnel-advisor.css"

const STORAGE_KEY = "aichu-rezon-funnel-draft-v1"
const EMPTY = ["", "", "", "", ""]
const EXAMPLE = ["120", "82", "61", "35", "19"]

const advice = [
  {
    title: "Не все обращения доходят до первого контакта",
    hypothesis: "Возможны задержки ответа, пропущенные звонки, неправильная маршрутизация или нерабочие каналы связи. По одним числам причину установить нельзя.",
    steps: [
      "Сверьте входящие заявки с CRM: каждое обращение должно иметь ответственного и время получения.",
      "Измерьте медианное время первого ответа отдельно по каждому источнику.",
      "Проверьте пропущенные звонки и обращения без первого касания; распределите их по причинам.",
    ],
    metric: "Доля обращений с контактом и время первого ответа",
  },
  {
    title: "После контакта не удаётся выявить потребность",
    hypothesis: "Проблема может быть в качестве диалога, квалификации или нерелевантных заявках. Нужна проверка выборки, а не оценка менеджера на глаз.",
    steps: [
      "Проверьте 10–20 диалогов, где контакт был, но потребность не зафиксирована.",
      "Добавьте короткий чек-лист: задача клиента, критерии выбора, сроки и бюджет, если уместно.",
      "Отделите нецелевые обращения от ошибок квалификации, чтобы не наказывать команду за состав трафика.",
    ],
    metric: "Доля квалифицированных контактов и причины неквалификации",
  },
  {
    title: "Потребность выявлена, но предложение не отправлено",
    hypothesis: "Возможны задержка расчёта, неполные данные, отсутствие товара или неясные правила подготовки предложения.",
    steps: [
      "Разберите заявки без предложения: что помешало его подготовить и сколько времени прошло.",
      "Установите срок отправки предложения для типовых запросов и назначьте ответственного.",
      "Подготовьте шаблоны КП, но оставьте персонализацию под реальные потребности клиента.",
    ],
    metric: "Доля отправленных КП и время от квалификации до предложения",
  },
  {
    title: "Предложение не превращается в оплату",
    hypothesis: "Возможны цена, сроки, условия, конкуренты, неудобная оплата или отсутствие следующего контакта. Конверсия сама по себе не раскрывает причину.",
    steps: [
      "Записывайте причину проигрыша только после подтверждения, а неизвестные причины оставляйте неизвестными.",
      "Проверьте доступность способов оплаты и понятность оформления заказа.",
      "Введите дату следующего контакта после отправки КП и сравните результаты по сегментам, а не по общей средней.",
    ],
    metric: "Конверсия КП в оплату, причины отказа и доля КП без следующего шага",
  },
] as const

function readDraft(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...EMPTY]
    const saved: unknown = JSON.parse(raw)
    if (!Array.isArray(saved) || saved.length !== 5 ||
        saved.some(item => typeof item !== "string" || item.length > 15)) return [...EMPTY]
    return saved as string[]
  } catch {
    return [...EMPTY]
  }
}

const number = (n: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n)
const pct = (n: number | null) => n === null ? "н/д" : new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(n) + "%"

export default function FunnelAdvisor() {
  const [manual, setManual] = useState<string[]>(readDraft)
  const [sample, setSample] = useState(false)
  const [selected, setSelected] = useState(0)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")

  useEffect(() => {
    document.title = "Воронка продаж с рекомендациями | REZON by AICHU"
    document.documentElement.lang = "ru"
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(manual)) } catch { /* Storage can be disabled. */ }
  }, [manual])

  const values = sample ? EXAMPLE : manual
  const error = validateFunnel(values)
  const analysis = useMemo(() => error ? null : analyzeFunnel(values.map(Number)), [error, values])
  const hasInput = values.some(v => v !== "")
  const baseCount = analysis?.total || 0
  const currentAdvice = advice[selected]
  const currentTransition = analysis?.transitions[selected]

  function changeStage(index: number, value: string) {
    if (value.length > 12) return
    setManual(previous => previous.map((item, i) => i === index ? value : item))
    setCopyState("idle")
  }

  function clear() {
    if (!window.confirm("Очистить пять значений воронки на этом устройстве?")) return
    setSample(false)
    setManual([...EMPTY])
    setSelected(0)
    setCopyState("idle")
  }

  async function copyReport() {
    if (!analysis) return
    const rows = FUNNEL_STAGES.map((label, index) => label + ": " + number(Number(values[index])))
    const steps = advice.map((item, i) => {
      const t = analysis.transitions[i]
      return FUNNEL_STAGES[i] + " → " + FUNNEL_STAGES[i + 1] + ": " + pct(t.conversion) + ", потеряно " + number(t.lost)
    })
    const report = [
      "REZON / Воронка продаж",
      sample ? "УЧЕБНЫЕ ДАННЫЕ. Не отчёт компании." : "Данные внесены вручную, без проверки по CRM.",
      "Важно: одна когорта обращений, каждый следующий этап — подмножество предыдущего.",
      ...rows,
      "Конверсия обращение → оплата: " + pct(analysis.conversion),
      ...steps,
      analysis.mainLeakIndex === null ? "Потерь между этапами не выявлено." :
        "Крупнейшая потеря по количеству: " + FUNNEL_STAGES[analysis.mainLeakIndex] + " → " + FUNNEL_STAGES[analysis.mainLeakIndex + 1] + ".",
      "Гипотезы для проверки, не установленные причины:",
      ...advice.flatMap((item, i) => ["[" + FUNNEL_STAGES[i] + " → " + FUNNEL_STAGES[i + 1] + "]", item.hypothesis, ...item.steps.map(x => "- " + x)]),
    ].join("\n")
    try {
      await navigator.clipboard.writeText(report)
      setCopyState("copied")
    } catch {
      setCopyState("error")
    }
  }

  return (
    <main className="fa-page">
      <div className="fa-glow" aria-hidden="true" />
      <header className="fa-topbar">
        <a href="/ru/" className="fa-back"><ArrowLeft size={17} /> На сайт AICHU</a>
        <div className="fa-brand">REZON<span>.</span><small> / INTELLIGENCE</small></div>
        <div className="fa-beta">ПРОТОТИП 01</div>
      </header>
      <div className="fa-container">
        <section className="fa-intro">
          <div className="fa-kicker"><Sparkles size={15} /> SALES INTELLIGENCE / 01</div>
          <h1>Воронка продаж.<br /><em>От потерь к решениям.</em></h1>
          <p>Введите реальные количества заявок по пяти этапам. REZON посчитает конверсию, покажет место самой большой потери и предложит, что проверить в первую очередь.</p>
          <div className="fa-intro-note"><ShieldCheck size={17} /><span>Без доступа к CRM. Введённые числа сохраняются только в этом браузере на этом устройстве. Общего кабинета пока нет.</span></div>
        </section>

        <section className="fa-section" aria-labelledby="fa-data-title">
          <div className="fa-section-head">
            <div><span className="fa-overline">01 / ИСХОДНЫЕ ДАННЫЕ</span><h2 id="fa-data-title">Путь заявки</h2></div>
            <div className="fa-tools">
              <button className={!sample ? "fa-switch fa-switch-active" : "fa-switch"} type="button" onClick={() => setSample(false)} aria-pressed={!sample}>Мои данные</button>
              <button className={sample ? "fa-switch fa-switch-active" : "fa-switch"} type="button" onClick={() => { setSample(true); setCopyState("idle") }} aria-pressed={sample}>Учебный пример</button>
              <button className="fa-clear" type="button" onClick={clear} disabled={!manual.some(v => v !== "")}><RotateCcw size={14} /> Сброс</button>
            </div>
          </div>
          <p className="fa-helper">Указывайте число <strong>уникальных обращений одной когорты</strong>, дошедших до этапа. Не смешивайте новые заявки этого месяца с оплатами старых сделок. Считаете этап только после его фактического завершения.</p>
          {sample && <p role="status" className="fa-sample-alert"><AlertTriangle size={15} /> Сейчас показан вымышленный пример. Он не относится к Aichu.co или другой компании.</p>}
          <div className="fa-input-grid">
            {FUNNEL_STAGES.map((label, index) => (
              <label className="fa-input-card" key={label}>
                <span className="fa-index">0{index + 1}</span>
                <span className="fa-input-label">{label}</span>
                <input
                  inputMode="numeric" type="number" min="0" max="99999999" step="1"
                  value={values[index]} disabled={sample}
                  onChange={event => changeStage(index, event.target.value)}
                  placeholder="0"
                  aria-label={label + ", количество заявок"}
                />
              </label>
            ))}
          </div>
          {!analysis && <p className={hasInput ? "fa-validation" : "fa-empty-note"} role={hasInput ? "alert" : "status"}>{hasInput ? error : "Начните с первого этапа или переключитесь на учебный пример, чтобы увидеть механику анализа."}</p>}
        </section>

        <section className="fa-section" aria-labelledby="fa-results-title">
          <div className="fa-section-head">
            <div><span className="fa-overline">02 / ДИАГНОСТИКА</span><h2 id="fa-results-title">Где теряем клиентов</h2></div>
            <div className="fa-source">{sample ? "УЧЕБНЫЕ ДАННЫЕ" : "РУЧНОЙ ВВОД"}</div>
          </div>
          {!analysis ? (
            <div className="fa-blank">Расчёты появятся, когда все пять значений будут заполнены корректно.</div>
          ) : (
            <>
              <div className="fa-stats">
                <div className="fa-stat"><span>Поступило обращений</span><strong>{number(analysis.total)}</strong><small>Начало когорты</small></div>
                <div className="fa-stat"><span>Завершили оплату</span><strong>{number(analysis.paid)}</strong><small>Платящих клиентов</small></div>
                <div className="fa-stat fa-stat-accent"><span>Конверсия в оплату</span><strong>{pct(analysis.conversion)}</strong><small>От всех обращений</small></div>
                <div className="fa-stat"><span>Не дошли до оплаты</span><strong>{number(analysis.lostTotal)}</strong><small>Не равно подтверждённым отказам</small></div>
              </div>
              <div className="fa-analysis-layout">
                <div className="fa-funnel-chart" aria-label="Этапы воронки продаж">
                  {FUNNEL_STAGES.map((label, index) => {
                    const count = Number(values[index])
                    const percent = baseCount > 0 ? count / baseCount * 100 : 0
                    const transition = index > 0 ? analysis.transitions[index - 1] : null
                    return (
                      <div key={label} className="fa-chart-item">
                        <div className="fa-chart-meta"><span>{label}</span><strong>{number(count)}</strong></div>
                        <div className="fa-track"><div className={"fa-bar " + (index === 4 ? "fa-bar-finish" : "")} style={{ width: percent + "%" }} /></div>
                        {transition && <div className="fa-conversion">{pct(transition.conversion)} от предыдущего этапа · <span>минус {number(transition.lost)}</span></div>}
                      </div>
                    )
                  })}
                </div>
                <aside className="fa-insight" aria-label="Основной вывод">
                  <div className="fa-insight-icon"><Target size={22} /></div>
                  <span className="fa-overline">ГЛАВНЫЙ ПРИОРИТЕТ</span>
                  {analysis.mainLeakIndex === null ? (
                    <><h3>Потерь по переходам нет</h3><p>На введённых данных ни одна заявка не исчезла между этапами. Это не доказывает отсутствие проблем с качеством данных и сроками обработки.</p></>
                  ) : (
                    <>
                      <h3>{FUNNEL_STAGES[analysis.mainLeakIndex]} → {FUNNEL_STAGES[analysis.mainLeakIndex + 1]}</h3>
                      <strong className="fa-loss-number">{number(analysis.transitions[analysis.mainLeakIndex].lost)} заявок</strong>
                      <p>Самая большая потеря в абсолютном количестве. Это приоритет для проверки, <b>не доказанная причина</b> падения продаж.</p>
                      <button className="fa-primary" type="button" onClick={() => { setSelected(analysis.mainLeakIndex!); document.getElementById("fa-advice-title")?.scrollIntoView({ behavior: "smooth", block: "start" }) }}>Показать рекомендации <ArrowRight size={16} /></button>
                    </>
                  )}
                  {analysis.weakestRateIndex !== null && <p className="fa-secondary-insight">Максимальная доля потерь: {FUNNEL_STAGES[analysis.weakestRateIndex]} → {FUNNEL_STAGES[analysis.weakestRateIndex + 1]} ({pct(analysis.transitions[analysis.weakestRateIndex].lossRate)}).</p>}
                </aside>
              </div>
            </>
          )}
        </section>

        <section className="fa-section fa-advice-section" aria-labelledby="fa-advice-title">
          <div className="fa-section-head">
            <div><span className="fa-overline">03 / СЛЕДУЮЩИЕ ШАГИ</span><h2 id="fa-advice-title">Что делать дальше</h2></div>
            <span className="fa-source">ГИПОТЕЗЫ, НЕ ДИАГНОЗ</span>
          </div>
          <p className="fa-helper">Выберите переход, который хотите разобрать. Рекомендации основаны на типовых причинах потерь и требуют проверки в CRM и разговорах с клиентами.</p>
          <div className="fa-step-tabs" role="group" aria-label="Выбрать переход воронки">
            {advice.map((item, i) => (
              <button type="button" key={item.title} className={selected === i ? "fa-step fa-step-active" : "fa-step"} aria-pressed={selected === i} onClick={() => setSelected(i)}>
                <span>0{i + 1} → 0{i + 2}</span>
                <small>{analysis ? (number(analysis.transitions[i].lost) + " потеряно") : "Советы"}</small>
              </button>
            ))}
          </div>
          <div className="fa-recommendation">
            <div className="fa-rec-main">
              <div className="fa-kicker"><BarChart3 size={16} /> УЧАСТОК 0{selected + 1} / 0{selected + 2}</div>
              <h3>{currentAdvice.title}</h3>
              <p>{currentAdvice.hypothesis}</p>
              <div className="fa-watch"><span>МЕТРИКА ДЛЯ КОНТРОЛЯ</span><strong>{currentAdvice.metric}</strong></div>
            </div>
            <div className="fa-rec-steps">
              <h4>Три действия для проверки</h4>
              <ol>{currentAdvice.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
              {analysis && currentTransition && <p className="fa-step-fact">По введённым данным: {number(currentTransition.from)} → {number(currentTransition.to)} · конверсия {pct(currentTransition.conversion)} · потеряно {number(currentTransition.lost)}</p>}
            </div>
          </div>
          <div className="fa-bottom">
            <p>Это первая версия аналитики REZON. Данные не сверяются с CRM, а рекомендации пока формируются по проверяемым правилам, без выдуманного «AI-анализа».</p>
            <button type="button" className="fa-copy" disabled={!analysis} onClick={copyReport}><Copy size={16} /> Скопировать отчёт</button>
          </div>
          {copyState !== "idle" && <p className="fa-copy-status" role="status">{copyState === "copied" ? <><Check size={15} /> Отчёт скопирован. Указание на учебные данные включено.</> : "Браузер запретил копирование. Попробуйте другой браузер или защищённое соединение."}</p>}
        </section>
      </div>
      <footer className="fa-footer"><span>AICHU.CO © {new Date().getFullYear()}</span><span>REZON / SALES INTELLIGENCE</span><a href="/ru/">Вернуться на сайт <ArrowRight size={14} /></a></footer>
    </main>
  )
}
