"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight, ArrowUpRight, BarChart3, Check, ChevronRight, CircleAlert,
  GripVertical, KanbanSquare, Layers3, Plus, RotateCcw, Search, Settings2,
  SlidersHorizontal, TrendingUp, Users, Wallet, X
} from "lucide-react";
import "./adjustable-glass-dashboard.css";

gsap.registerPlugin(useGSAP);

export type GlassSettings = {
  blur: number;
  opacity: number;
  saturation: number;
  tint: string;
  edge: number;
};

type Lang = "ru" | "en" | "ky";
type Stage = "new" | "contact" | "proposal" | "negotiation" | "won" | "lost";
type Lead = {
  id: string;
  company: string;
  manager: string;
  value: number;
  stage: Stage;
  days: number;
};
type View = "dashboard" | "kanban";

export interface RezonGlassDashboardProps {
  language?: Lang;
  theme?: "light" | "dark";
  glass?: Partial<GlassSettings>;
  onGlassChange?: (settings: GlassSettings) => void;
  className?: string;
}

const defaultGlass: GlassSettings = {
  blur: 22, opacity: 0.3, saturation: 1.2, tint: "#ffffff", edge: 0.6
};
const clamp = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
const normalize = (value: Partial<GlassSettings>): GlassSettings => ({
  blur: clamp(value.blur ?? defaultGlass.blur, 0, 40, defaultGlass.blur),
  opacity: clamp(value.opacity ?? defaultGlass.opacity, 0.08, 0.9, defaultGlass.opacity),
  saturation: clamp(value.saturation ?? defaultGlass.saturation, 0.5, 2, defaultGlass.saturation),
  edge: clamp(value.edge ?? defaultGlass.edge, 0, 1, defaultGlass.edge),
  tint: /^#[0-9a-f]{6}$/i.test(value.tint ?? "") ? value.tint! : defaultGlass.tint
});

const stages: Stage[] = ["new", "contact", "proposal", "negotiation", "won", "lost"];
const demoLeads: Lead[] = [
  { id:"L-1041",company:"Orion Logistics",manager:"Айжан",value:185000,stage:"new",days:2 },
  { id:"L-1042",company:"Atlas Retail",manager:"Данияр",value:92000,stage:"new",days:1 },
  { id:"L-1043",company:"Nord Group",manager:"Айжан",value:245000,stage:"contact",days:3 },
  { id:"L-1044",company:"Vector Trade",manager:"Мээрим",value:118000,stage:"contact",days:1 },
  { id:"L-1045",company:"Peak Studio",manager:"Данияр",value:64000,stage:"proposal",days:2 },
  { id:"L-1046",company:"Nomad Supply",manager:"Айжан",value:310000,stage:"proposal",days:1 },
  { id:"L-1047",company:"Terra Market",manager:"Мээрим",value:175000,stage:"negotiation",days:2 },
  { id:"L-1048",company:"Nova Systems",manager:"Данияр",value:225000,stage:"negotiation",days:1 },
  { id:"L-1039",company:"Forma Studio",manager:"Мээрим",value:132000,stage:"won",days:0 },
  { id:"L-1038",company:"Helios Service",manager:"Айжан",value:89000,stage:"won",days:0 },
  { id:"L-1037",company:"Prime Textile",manager:"Данияр",value:77000,stage:"lost",days:0 }
];

const stageNames: Record<Lang, Record<Stage, string>> = {
  ru:{new:"Новые",contact:"Первый контакт",proposal:"Предложение",negotiation:"Переговоры",won:"Успешно",lost:"Потеряны"},
  en:{new:"New",contact:"First contact",proposal:"Proposal",negotiation:"Negotiation",won:"Won",lost:"Lost"},
  ky:{new:"Жаңы",contact:"Алгачкы байланыш",proposal:"Сунуш",negotiation:"Сүйлөшүү",won:"Ийгиликтүү",lost:"Жоголгон"}
};
const stageColors: Record<Stage,string> = {
  new:"#e6c16b", contact:"#8aa4ed", proposal:"#b699d7",
  negotiation:"#e1a275", won:"#7cc4a7", lost:"#c78e98"
};

export default function RezonGlassDashboard({
  language = "ru",
  theme = "dark",
  glass = defaultGlass,
  onGlassChange,
  className = ""
}: RezonGlassDashboardProps) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [view, setView] = useState<View>("dashboard");
  const [leads, setLeads] = useState<Lead[]>(demoLeads);
  const [filter, setFilter] = useState("");
  const [manager, setManager] = useState("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newValue, setNewValue] = useState("");
  const [glassState, setGlassState] = useState<GlassSettings>(() => normalize(glass));
  const nextId = useRef(1050);

  const t = (ru: string, en: string, ky: string) =>
    language === "ru" ? ru : language === "en" ? en : ky;
  const money = (n: number) =>
    new Intl.NumberFormat(language === "en" ? "en-US" : "ru-RU", { maximumFractionDigits:0 }).format(n) +
    (language === "en" ? " KGS" : " сом");

  useEffect(() => {
    setGlassState(normalize(glass));
  }, [glass.blur, glass.opacity, glass.saturation, glass.tint, glass.edge]);
  useEffect(() => {
    if (settingsOpen) root.current?.querySelector<HTMLButtonElement>(".rz-settings button")?.focus();
  }, [settingsOpen]);
  useGSAP(() => {
    const mq = gsap.matchMedia();
    mq.add("(prefers-reduced-motion: no-preference)", () => {
      const nodes = body.current?.querySelectorAll(".rz-reveal");
      if (nodes?.length) {
        gsap.fromTo(nodes, { y: 11, opacity:0.5, filter:"blur(3px)" },
          { y:0, opacity:1, filter:"blur(0px)", duration:0.4, stagger:0.035,
            ease:"power2.out", clearProps:"transform,opacity,filter" });
      }
    });
    return () => mq.revert();
  }, { scope: root, dependencies:[view], revertOnUpdate:true });

  const stats = useMemo(() => {
    const wins = leads.filter(l => l.stage === "won");
    const active = leads.filter(l => !["won","lost"].includes(l.stage));
    const risks = leads.filter(l => (l.stage === "new" && l.days >= 1) || (l.stage === "contact" && l.days >= 3));
    return {
      total:leads.length,
      open:active.length,
      pipeline:active.reduce((sum,l) => sum + l.value,0),
      revenue:wins.reduce((sum,l) => sum + l.value,0),
      conversion:leads.length ? (wins.length / leads.length)*100 : 0,
      risks
    };
  }, [leads]);

  const visible = useMemo(() => leads.filter(l =>
    (manager === "all" || l.manager === manager) &&
    (l.company.toLowerCase().includes(filter.toLowerCase()) ||
     l.id.toLowerCase().includes(filter.toLowerCase()) ||
     l.manager.toLowerCase().includes(filter.toLowerCase()))
  ), [leads, manager, filter]);

  const updateGlass = (patch: Partial<GlassSettings>) => {
    const next = normalize({ ...glassState, ...patch });
    setGlassState(next);
    onGlassChange?.(next);
  };
  const moveLead = (id: string, stage: Stage) => {
    setLeads(prev => prev.map(item => item.id === id ? { ...item, stage, days:0 } : item));
  };
  const addLead = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newCompany.trim();
    const amount = Number(newValue);
    if (!name || !Number.isFinite(amount) || amount < 0) return;
    const newId = "L-" + nextId.current++;
    setLeads(prev => [{id:newId,company:name,manager:"Айжан",value:amount,stage:"new",days:0}, ...prev]);
    setNewCompany(""); setNewValue(""); setAdding(false); setView("kanban");
  };
  const reset = () => { setLeads(demoLeads); setFilter(""); setManager("all"); setAdding(false); };
  const managers = Array.from(new Set(leads.map(l => l.manager)));
  const labelForStage = (stage: Stage) => stageNames[language][stage];

  const kanban = (
    <div className="rz-kanban-scroll rz-reveal" aria-label={t("Доска заявок", "Lead board", "Өтүнмөлөр тактасы")}>
      <div className="rz-kanban">
        {stages.map(stage => {
          const items = visible.filter(item => item.stage === stage);
          return (
            <div className="rz-column" key={stage}
              onDragOver={event => event.preventDefault()}
              onDrop={event => {
                event.preventDefault();
                const id = event.dataTransfer.getData("text/plain");
                if (leads.some(lead => lead.id === id)) moveLead(id,stage);
              }}>
              <div className="rz-column-head">
                <span className="rz-dot" style={{background:stageColors[stage]}} />
                <strong>{labelForStage(stage)}</strong>
                <span className="rz-count">{items.length}</span>
              </div>
              <div className="rz-column-sum">{money(items.reduce((sum,item) => sum + item.value,0))}</div>
              <div className="rz-column-cards">
                {items.map(item => (
                  <div className="rz-lead" key={item.id} draggable
                    onDragStart={event => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain",item.id);
                    }}>
                    <div className="rz-lead-top">
                      <span>{item.id}</span>
                      <GripVertical size={15} aria-hidden="true" />
                    </div>
                    <strong>{item.company}</strong>
                    <div className="rz-lead-bottom"><span>{item.manager}</span><b>{money(item.value)}</b></div>
                    {((stage === "new" && item.days >= 1) || (stage === "contact" && item.days >= 3)) && (
                      <p className="rz-lead-risk"><CircleAlert size={12} /> {t("Требует внимания","Needs attention","Көңүл буруу керек")}</p>
                    )}
                    <label className="rz-move-label">
                      <span>{t("Переместить","Move to","Жылдыруу")}</span>
                      <select value={item.stage} aria-label={t("Изменить этап заявки ","Change stage for ","Өтүнмөнүн этабын өзгөртүү ")+item.id}
                        onChange={event => moveLead(item.id,event.target.value as Stage)}>
                        {stages.map(s => <option key={s} value={s}>{labelForStage(s)}</option>)}
                      </select>
                    </label>
                  </div>
                ))}
                {items.length === 0 && <div className="rz-empty">{t("Нет заявок","No leads","Өтүнмө жок")}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const glassVars = {
    "--rz-blur":glassState.blur+"px",
    "--rz-opacity":glassState.opacity,
    "--rz-saturation":glassState.saturation,
    "--rz-edge":glassState.edge,
    "--rz-tint":glassState.tint
  } as CSSProperties;

  return (
    <div ref={root} className={"rz-root " + className} data-theme={theme} style={glassVars}
      onKeyDown={event => {
        if (event.key === "Escape") { setSettingsOpen(false); setAdding(false); }
      }}>
      <div className="rz-shell">
        <header className="rz-top rz-glass">
          <div className="rz-brand"><span className="rz-brand-mark"><Layers3 size={17} /></span>
            <strong>REZON<span className="rz-accent">.</span></strong>
            <span className="rz-brand-divider"/>
            <small>{t("Демо интерфейса","Interface demo","Интерфейс демосу")}</small>
          </div>
          <div className="rz-top-actions">
            <span className="rz-demo-label">{t("Тестовые данные","Sample data","Тесттик маалыматтар")}</span>
            <button ref={trigger} type="button" className="rz-icon-action"
              aria-label={t("Настроить стекло","Adjust glass","Айнек көрүнүшүн жөндөө")}
              aria-expanded={settingsOpen} onClick={() => setSettingsOpen(!settingsOpen)}>
              <Settings2 size={18} />
            </button>
          </div>
        </header>

        <div className="rz-nav-row">
          <div className="rz-tabs" role="group" aria-label={t("Вид интерфейса","Workspace view","Интерфейс көрүнүшү")}>
            <button type="button" aria-pressed={view === "dashboard"} onClick={() => setView("dashboard")}>
              <BarChart3 size={16}/>{t("Дашборд","Dashboard","Дашборд")}
            </button>
            <button type="button" aria-pressed={view === "kanban"} onClick={() => setView("kanban")}>
              <KanbanSquare size={16}/>{t("Канбан","Kanban","Канбан")}
            </button>
          </div>
          <div className="rz-toolbar">
            <button type="button" className="rz-muted-button" onClick={reset} title={t("Сбросить демо","Reset demo","Демону баштапкы абалга келтирүү")}>
              <RotateCcw size={15}/><span>{t("Сброс","Reset","Баштапкы")}</span>
            </button>
            <button type="button" className="rz-add" onClick={() => setAdding(true)}>
              <Plus size={16}/>{t("Новая заявка","New lead","Жаңы өтүнмө")}
            </button>
          </div>
        </div>

        <div ref={body} className="rz-content">
          <div className="rz-section-heading rz-reveal">
            <div>
              <p>{t("ПРОДАЖИ / АНАЛИТИКА", "SALES / INTELLIGENCE", "САТУУ / АНАЛИТИКА")}</p>
              <h3>{view === "dashboard" ? t("Обзор продаж","Sales overview","Сатуунун сереби") : t("Воронка заявок","Lead pipeline","Өтүнмөлөр воронкасы")}</h3>
            </div>
            <span>{t("Интерактивный прототип","Interactive prototype","Интерактивдүү прототип")}</span>
          </div>

          {view === "dashboard" && (
            <>
              <div className="rz-metrics">
                {[
                  {label:t("Всего заявок","Total leads","Жалпы өтүнмө"),value:String(stats.total),icon:Users},
                  {label:t("Активные сделки","Open deals","Активдүү бүтүмдөр"),value:String(stats.open),icon:Wallet},
                  {label:t("Сумма в работе","Pipeline value","Иштеги сумма"),value:money(stats.pipeline),icon:TrendingUp},
                  {label:t("Конверсия заявок","Lead conversion","Өтүнмөлөр конверсиясы"),value:stats.conversion.toFixed(1)+"%",icon:ArrowUpRight}
                ].map((metric) => (
                  <div key={metric.label} className="rz-metric rz-glass rz-reveal">
                    <div><span>{metric.label}</span><metric.icon size={17} aria-hidden="true"/></div>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>

              <div className="rz-analysis-grid">
                <div className="rz-analysis-panel rz-glass rz-reveal">
                  <div className="rz-panel-heading"><h4>{t("Распределение по этапам","Pipeline by stage","Этаптар боюнча бөлүштүрүү")}</h4><BarChart3 size={17}/></div>
                  <div className="rz-stage-chart">
                    {stages.map(stage => {
                      const count = leads.filter(item=>item.stage===stage).length;
                      return (
                        <div className="rz-stage-row" key={stage}>
                          <span>{labelForStage(stage)}</span>
                          <div className="rz-track"><i style={{
                            width:(stats.total ? (count/stats.total)*100 : 0)+"%",
                            background:stageColors[stage]
                          }}/></div>
                          <b>{count}</b>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rz-analysis-panel rz-glass rz-reveal">
                  <div className="rz-panel-heading"><h4>{t("Что требует внимания","What needs attention","Эмнеге көңүл буруу керек")}</h4><CircleAlert size={17}/></div>
                  <div className="rz-insight-number">{stats.risks.length.toString().padStart(2,"0")}</div>
                  <p>{t("заявок с задержкой обработки на первых этапах","leads delayed in early stages","баштапкы этаптарда кечиккен өтүнмө")}</p>
                  <div className="rz-insight-footer"><span>{t("Успешно закрыто","Won value","Ийгиликтүү жабылган")}</span><strong>{money(stats.revenue)}</strong></div>
                </div>
              </div>
              <div className="rz-board-intro rz-reveal">
                <div><h4>{t("Заявки по стадиям","Leads by stage","Этаптар боюнча өтүнмөлөр")}</h4>
                  <span>{t("Перетаскивайте карточки или меняйте этап в списке","Drag cards or change stages using the selector","Карточкаларды сүйрөңүз же этапты тизмеден өзгөртүңүз")}</span>
                </div>
                <button type="button" onClick={()=>setView("kanban")}>{t("Открыть канбан","Open Kanban","Канбанды ачуу")}<ChevronRight size={16}/></button>
              </div>
              {kanban}
            </>
          )}

          {view === "kanban" && (
            <>
              <div className="rz-board-tools rz-reveal">
                <label className="rz-search"><Search size={16}/>
                  <input type="search" value={filter} onChange={event=>setFilter(event.target.value)}
                    placeholder={t("Поиск заявок","Search leads","Өтүнмөлөрдү издөө")}
                    aria-label={t("Поиск заявок","Search leads","Өтүнмөлөрдү издөө")}/>
                </label>
                <label className="rz-manager"><SlidersHorizontal size={16}/>
                  <select value={manager} onChange={event=>setManager(event.target.value)} aria-label={t("Фильтр менеджеров","Filter managers","Менеджер чыпкасы")}>
                    <option value="all">{t("Все менеджеры","All managers","Бардык менеджерлер")}</option>
                    {managers.map(name=><option key={name} value={name}>{name}</option>)}
                  </select>
                </label>
              </div>
              {kanban}
              <p className="rz-hint">{t("Стадии можно менять перетаскиванием карточки или выпадающим списком. Изменения остаются только в этом демо.", "Drag a card or use its stage dropdown. Changes exist only in this demo.", "Карточканы сүйрөө же тизмеден этапты тандоо мүмкүн. Өзгөрүүлөр бул демодо гана сакталат.")}</p>
            </>
          )}
        </div>

        {settingsOpen && <aside className="rz-settings rz-glass" aria-label={t("Настройки стекла","Glass settings","Айнек жөндөөлөрү")}>
          <div className="rz-settings-head"><strong>{t("Настроить стекло","Adjust glass","Айнекти жөндөө")}</strong>
            <button type="button" onClick={()=>{setSettingsOpen(false);trigger.current?.focus();}} aria-label={t("Закрыть настройки","Close settings","Жабуу")}><X size={17}/></button>
          </div>
          <p>{t("Изменения видны сразу","Live material preview","Өзгөрүүлөр дароо көрүнөт")}</p>
          <div className="rz-presets">
            <button type="button" onClick={()=>updateGlass({blur:8,opacity:0.12,saturation:1.1,edge:0.8})}>{t("Прозрачный","Clear","Тунук")}</button>
            <button type="button" onClick={()=>updateGlass(defaultGlass)}>{t("Матовый","Frosted","Күңүрт")}</button>
            <button type="button" onClick={()=>updateGlass({blur:32,opacity:0.86,saturation:1,edge:0.35})}>{t("Плотный","Solid","Тыгыз")}</button>
          </div>
          {([
            ["blur",t("Размытие","Blur","Бүдөмүк"),0,40,1],
            ["opacity",t("Непрозрачность","Opacity","Тунуктук"),0.08,0.9,0.01],
            ["saturation",t("Насыщенность","Saturation","Каныккандык"),0.5,2,0.05],
            ["edge",t("Свет по краям","Edge light","Чет жарыгы"),0,1,0.05]
          ] as const).map(([key,label,min,max,step])=>
            <label className="rz-range" key={key}><span>{label}<output>{key==="blur" ? Math.round(glassState[key])+"px" : Math.round(glassState[key]*100)+"%"}</output></span>
              <input type="range" min={min} max={max} step={step} value={glassState[key]}
                onChange={event=>updateGlass({[key]:Number(event.target.value)})}/>
            </label>
          )}
          <label className="rz-color">{t("Оттенок","Tint","Түс")}<input type="color" value={glassState.tint} onChange={event=>updateGlass({tint:event.target.value})}/></label>
        </aside>}

        {adding && <div className="rz-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setAdding(false);}}>
          <form className="rz-add-form" onSubmit={addLead} aria-label={t("Новая заявка","New lead","Жаңы өтүнмө")}>
            <div className="rz-form-head"><h4>{t("Новая заявка","New lead","Жаңы өтүнмө")}</h4>
              <button type="button" onClick={()=>setAdding(false)} aria-label={t("Закрыть","Close","Жабуу")}><X size={18}/></button>
            </div>
            <label>{t("Компания","Company","Компания")}<input required maxLength={60} value={newCompany}
              onChange={event=>setNewCompany(event.target.value)} placeholder={t("Название компании","Company name","Компаниянын аталышы")}/></label>
            <label>{t("Сумма, сом","Amount, KGS","Сумма, сом")}<input required type="number" min="0" step="1" value={newValue}
              onChange={event=>setNewValue(event.target.value)} placeholder="125000"/></label>
            <button className="rz-add rz-submit" type="submit"><Plus size={16}/>{t("Добавить в новые","Add as new","Жаңыга кошуу")}</button>
          </form>
        </div>}
      </div>
      <div className="rz-footnote"><Check size={13}/>{t("Демо на вымышленных данных. Без подключения к CRM и сохранения на сервере.", "Fictional demo data. No CRM connection or server storage.", "Ойдон чыгарылган демо маалыматтар. CRM байланышы жана серверге сактоо жок.")}</div>
    </div>
  );
}
