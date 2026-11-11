import * as React from "react"
import "./liquid-glass-navbar.css"

/**
 * Nimbus UI · Liquid Navbar / Waterline
 * WebGL water and spring physics, with a CSS fallback for browsers without WebGL.
 * Integrated for aichuuu.co without additional runtime dependencies.
 */
export type NimbusFx = "plane" | "drop" | "spin" | "glow" | "wave" | "pop" | "none"
export type LiquidNavItem = {
  label: string
  iconOnly?: boolean
  href?: string
  icon?: React.ReactNode
  fx?: NimbusFx
}
export type LiquidNavbarProps = {
  items?: LiquidNavItem[]
  defaultActive?: number
  active?: number
  onChange?: (index: number, item: LiquidNavItem) => void
  endContent?: React.ReactNode
  tone?: "light" | "dark"
  compact?: boolean
  sound?: boolean
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
}

const I = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
export const NimbusIcons = {
  home: I(<><path d="M3.5 11.2 12 4l8.5 7.2" /><path d="M6 9.6V20h12V9.6" /><path className="nv-door" d="M10 20v-5h4v5Z" /></>),
  globe: I(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" /></>),
  plane: I(<path d="M21 12.2 3.6 5.4l2.7 6.8-2.7 6.4L21 12.2Zm-14.7 0H13" />),
  drop: I(<path d="M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z" />),
  user: I(<><circle cx="12" cy="8.5" r="3.8" /><path d="M4.8 20c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5" /></>),
}
const DEFAULT_ITEMS: LiquidNavItem[] = [
  { label: "Home", icon: NimbusIcons.home, fx: "glow" },
  { label: "Explore", icon: NimbusIcons.globe, fx: "spin" },
  { label: "Flights", icon: NimbusIcons.plane, fx: "plane" },
  { label: "Weather", icon: NimbusIcons.drop, fx: "drop" },
  { label: "Profile", icon: NimbusIcons.user, fx: "wave" },
]
const PAD = 14
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,uPill.w*.36)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=vec3(253./255.,194./255.,30./255.);
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(vec3(.94,.94,.94),vec3(.78,.78,.78),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.26+.14*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.22;vec3 lc=vec3(253./255.,194./255.,30./255.);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`

type Body = { x: number; v: number }
type Sat = { x: number; y: number; vx: number; vy: number; r: number; k: number }
type Rip = { x: number; y: number; age: number; amp: number }
type FluidState = ReturnType<typeof makeState>

function makeState() {
  return {
    a: { x: 0, v: 0 } as Body,
    b: { x: 0, v: 0 } as Body,
    sy: { s: 1, v: 0 },
    lead: 0 as 0 | 1,
    lagFrom: 0,
    sats: [] as Sat[],
    rips: [] as Rip[],
    t: { x: 0, cy: 0, q: 0, r: 21 },
    q: 0,
    mouse: { x: 0, y: 0, s: 0, on: false },
    moving: false,
    split: false,
    ready: false,
    w: 0,
    h: 0,
    visible: true,
    reduce: false,
    raf: 0,
    last: 0,
    time: 0,
    glc: null as null | { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> },
  }
}

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null
  if (!gl) return null
  const sh = (type: number, source: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, source)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = sh(gl.VERTEX_SHADER, VERT)
  const fs = sh(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const p = gl.createProgram()
  if (!p) return null
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null
  gl.useProgram(p)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(p, "a")
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u: Record<string, WebGLUniformLocation | null> = {}
  for (const name of ["uRes", "uDpr", "uTime", "uPill", "uBlob", "uSy", "uRip", "uMouse", "uDark", "uAmb"]) {
    u[name] = gl.getUniformLocation(p, name)
  }
  return { gl, u }
}

export function LiquidNavbar({
  items = DEFAULT_ITEMS,
  defaultActive = 0,
  active,
  onChange,
  endContent,
  tone = "light",
  compact,
  sound = false,
  ariaLabel = "Main navigation",
  className,
  style,
}: LiquidNavbarProps) {
  const [inner, setInner] = React.useState(defaultActive)
  const current = active ?? inner
  const navRef = React.useRef<HTMLElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const dropRef = React.useRef<HTMLSpanElement>(null)
  const itemRefs = React.useRef<(HTMLElement | null)[]>([])
  const iconRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const audio = React.useRef<AudioContext | null>(null)
  const st = React.useRef<FluidState>(makeState())
  const [gl, setGl] = React.useState<"on" | "off">("on")
  const [fx, setFx] = React.useState({ i: -1, n: 0 })
  const darkRef = React.useRef(tone === "dark" ? 1 : 0)
  darkRef.current = tone === "dark" ? 1 : 0

  const draw = React.useCallback(() => {
    const s = st.current
    const T = s.t
    const sep = Math.abs(s.a.x - s.b.x)
    const thin = Math.min(sep / (2 * (s.q + T.r) || 1), 1)
    const r = T.r * (1 - .3 * thin)
    if (s.glc) {
      const { gl: g, u } = s.glc
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
      g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2)
      g.uniform1f(u.uDpr, dpr)
      g.uniform1f(u.uTime, s.time)
      g.uniform4f(u.uPill, PAD, PAD, s.w, s.h)
      const blobs = new Float32Array(24)
      const sy = new Float32Array(6).fill(1)
      const head = s.lead === 0 ? s.a : s.b
      const tail = s.lead === 0 ? s.b : s.a
      blobs.set([
        head.x, T.cy, s.q * (1 - .25 * thin), T.r * (1 - .12 * thin),
        tail.x, T.cy, s.q * (1 - .8 * thin), T.r * (1 - .5 * thin),
      ], 0)
      sy[0] = sy[1] = s.sy.s
      s.sats.slice(0, 4).forEach((d, i) => blobs.set([d.x, d.y, 0, d.r], 8 + i * 4))
      g.uniform4fv(u.uBlob, blobs)
      g.uniform1fv(u.uSy, sy)
      const rips = new Float32Array(24)
      s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4))
      g.uniform4fv(u.uRip, rips)
      g.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s)
      g.uniform1f(u.uDark, darkRef.current)
      g.uniform1f(u.uAmb, s.reduce ? 0 : 1)
      g.clearColor(0, 0, 0, 0)
      g.clear(g.COLOR_BUFFER_BIT)
      g.drawArrays(g.TRIANGLES, 0, 3)
    } else if (dropRef.current) {
      const left = Math.min(s.a.x, s.b.x) - s.q - r - PAD
      const width = sep + 2 * (s.q + r)
      dropRef.current.style.width = width + "px"
      dropRef.current.style.transform = "translateX(" + left + "px) scaleY(" + s.sy.s + ")"
    }
  }, [])

  const step = React.useCallback((dt: number, now: number) => {
    const s = st.current
    const T = s.t
    s.time += dt
    s.q += (T.q - s.q) * Math.min(1, dt * 12)
    const bodies = [s.a, s.b]
    let still = true
    if (s.reduce) {
      s.a.x = s.b.x = T.x
      s.a.v = s.b.v = 0
      s.sy.s = 1
      s.sats = []
    } else {
      bodies.forEach((B, i) => {
        const lead = i === s.lead
        const k = lead ? 210 : 72
        const c = lead ? 25 : 13
        const f = !lead && now < s.lagFrom ? .08 : 1
        B.v += (k * (T.x - B.x) - c * B.v) * dt * f
        B.x += B.v * dt
        const lo = PAD + 6 + s.q + T.r - 3
        const hi = PAD + s.w - 6 - s.q - T.r + 3
        if (B.x < lo || B.x > hi) {
          s.sy.v -= Math.min(Math.abs(B.v), 900) * .0016
          B.x = Math.max(lo, Math.min(hi, B.x))
          B.v *= -.25
        }
        if (Math.abs(T.x - B.x) > .3 || Math.abs(B.v) > 3) still = false
      })
      const L = bodies[s.lead]
      const syT = 1 - .2 * Math.min(Math.abs(L.v) / 1500, 1)
      s.sy.v += (280 * (syT - s.sy.s) - 9 * s.sy.v) * dt
      s.sy.s += s.sy.v * dt
      if (Math.abs(s.sy.s - 1) > .002 || Math.abs(s.sy.v) > .02) still = false
      const sep = Math.abs(s.a.x - s.b.x)
      const r = T.r * (1 - .3 * Math.min(sep / (2 * (T.q + T.r) || 1), 1))
      if (!s.split && s.moving && sep - 2 * T.q - 2 * r > -6) {
        s.split = true
        const lo = bodies[1 - s.lead]
        const hi = bodies[s.lead]
        ;[.3, .5, .72].forEach((t, j) => s.sats.push({
          x: lo.x + (hi.x - lo.x) * t + (Math.random() - .5) * 6,
          y: T.cy + (Math.random() - .5) * 10,
          vx: (lo.v + hi.v) * .45,
          vy: (Math.random() - .5) * 60,
          r: 5 + Math.random() * 3 - j * .5,
          k: 70 + Math.random() * 90,
        }))
      }
      s.sats = s.sats.filter((d) => {
        d.vx += (d.k * (T.x - d.x) - 9 * d.vx) * dt
        d.vy += (90 * (T.cy - d.y) - 7 * d.vy) * dt
        d.x += d.vx * dt
        d.y += d.vy * dt
        d.x = Math.max(PAD + 8 + d.r, Math.min(PAD + s.w - 8 - d.r, d.x))
        d.y = Math.max(T.cy - T.r + d.r, Math.min(T.cy + T.r - d.r, d.y))
        if (Math.abs(T.x - d.x) < T.q + T.r * .5) d.r -= dt * 26
        return d.r > .6
      })
      if (s.sats.length) still = false
    }
    if (s.moving && still) {
      s.moving = false
      if (s.split || !s.reduce) s.rips.push({ x: T.x, y: T.cy, age: 0, amp: s.split ? 1.2 : .7 })
    }
    s.rips.forEach((p) => (p.age += dt))
    s.rips = s.rips.filter((p) => p.age < 2.4)
    const target = s.mouse.on ? 1 : 0
    s.mouse.s += (target - s.mouse.s) * Math.min(1, dt * 7)
  }, [])

  const loop = React.useCallback(() => {
    const s = st.current
    if (s.raf || !s.visible) return
    s.last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30)
      s.last = now
      step(dt, now)
      draw()
      const mouseTransitioning = Math.abs(s.mouse.s - (s.mouse.on ? 1 : 0)) > .01
      const busy = s.moving || s.rips.length > 0 || s.sats.length > 0 || mouseTransitioning || Math.abs(s.q - s.t.q) > .01
      if (s.visible && busy) s.raf = requestAnimationFrame(tick)
      else s.raf = 0
    }
    s.raf = requestAnimationFrame(tick)
  }, [draw, step])

  const measure = React.useCallback(() => {
    const nav = navRef.current
    const el = itemRefs.current[current]
    if (!nav || !el) return
    const s = st.current
    s.w = nav.offsetWidth
    s.h = nav.offsetHeight
    const T = s.t
    T.r = el.offsetHeight / 2
    T.q = Math.max(0, el.offsetWidth / 2 - T.r)
    T.cy = PAD + el.offsetTop + el.offsetHeight / 2
    const nx = PAD + el.offsetLeft + el.offsetWidth / 2
    if (!s.ready) {
      s.a.x = s.b.x = nx
      s.q = T.q
      s.ready = true
    } else if (Math.abs(nx - T.x) > .5) {
      s.lead = Math.abs(nx - s.a.x) <= Math.abs(nx - s.b.x) ? 0 : 1
      s.lagFrom = performance.now() + 70
      s.moving = true
      s.split = false
    }
    T.x = nx
    const cv = canvasRef.current
    if (cv) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const W = s.w + PAD * 2
      const H = s.h + PAD * 2
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
        cv.width = Math.round(W * dpr)
        cv.height = Math.round(H * dpr)
        cv.style.width = W + "px"
        cv.style.height = H + "px"
      }
    }
    loop()
  }, [current, loop])

  React.useEffect(() => {
    const s = st.current
    s.reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const cv = canvasRef.current
    s.glc = cv ? initGL(cv) : null
    if (!s.glc) setGl("off")
    const lost = (e: Event) => { e.preventDefault(); s.glc = null; setGl("off") }
    cv?.addEventListener("webglcontextlost", lost)
    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting
      if (s.visible) loop()
    })
    if (navRef.current) io.observe(navRef.current)
    const vis = () => {
      s.visible = document.visibilityState === "visible"
      if (s.visible) loop()
    }
    document.addEventListener("visibilitychange", vis)
    return () => {
      cv?.removeEventListener("webglcontextlost", lost)
      io.disconnect()
      document.removeEventListener("visibilitychange", vis)
      cancelAnimationFrame(s.raf)
      s.raf = 0
      void audio.current?.close()
    }
  }, [loop])
  React.useLayoutEffect(() => { measure() }, [measure, items.length, compact])
  const measureRef = React.useRef(measure)
  measureRef.current = measure
  React.useEffect(() => {
    let lastW = -1
    const ro = new ResizeObserver(() => {
      const w = navRef.current?.offsetWidth ?? 0
      if (w !== lastW) {
        lastW = w
        st.current.ready = false
        measureRef.current()
      }
    })
    if (navRef.current) ro.observe(navRef.current)
    return () => ro.disconnect()
  }, [])
  React.useEffect(() => { loop() }, [tone, loop])

  const local = (clientX: number, clientY: number) => {
    const r = navRef.current!.getBoundingClientRect()
    return { x: clientX - r.left + PAD, y: clientY - r.top + PAD }
  }
  const ripple = (x: number, y: number, amp: number) => {
    const s = st.current
    if (s.reduce) return
    s.rips.push({ x, y, age: 0, amp })
    loop()
  }
  const iconCenter = (i: number) => {
    const el = iconRefs.current[i]
    if (!el) return null
    const b = el.getBoundingClientRect()
    return local(b.left + b.width / 2, b.top + b.height / 2)
  }
  const plip = () => {
    if (!sound) return
    try {
      const AC = window.AudioContext
      const ctx = (audio.current ||= new AC())
      const t = ctx.currentTime
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "sine"
      o.frequency.setValueAtTime(420 + Math.random() * 80, t)
      o.frequency.exponentialRampToValueAtTime(1500, t + .07)
      g.gain.setValueAtTime(.0001, t)
      g.gain.exponentialRampToValueAtTime(.16, t + .008)
      g.gain.exponentialRampToValueAtTime(.0001, t + .16)
      o.connect(g).connect(ctx.destination)
      o.start(t)
      o.stop(t + .18)
    } catch { /* autoplay or AudioContext unavailable */ }
  }
  const select = (i: number) => {
    const kind = items[i]?.fx ?? (items[i]?.icon ? "pop" : "none")
    setFx((f) => ({ i, n: f.n + 1 }))
    plip()
    const center = iconCenter(i)
    if (center && kind === "drop") window.setTimeout(() => ripple(center.x, st.current.t.cy, 1.4), 430)
    if (center && kind === "plane") ripple(center.x, center.y, .6)
    if (i !== current) {
      if (active === undefined) setInner(i)
      onChange?.(i, items[i])
    }
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest(".nimbus-actions")) return
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const n = (current + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length
    select(n)
    itemRefs.current[n]?.focus()
  }
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return
    const p = local(e.clientX, e.clientY)
    const s = st.current
    s.mouse.x = p.x
    s.mouse.y = p.y
    s.mouse.on = true
    loop()
  }

  return (
    <nav
      ref={navRef}
      className={["nimbus-nav", className].filter(Boolean).join(" ")}
      data-tone={tone}
      data-gl={gl}
      data-compact={compact === undefined ? undefined : String(compact)}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      onPointerMove={onMove}
      onPointerLeave={() => { st.current.mouse.on = false; loop() }}
      onPointerDown={(e) => { const p = local(e.clientX, e.clientY); ripple(p.x, p.y, .8) }}
      style={style}
    >
      <span className="nimbus-glass" aria-hidden="true" />
      <canvas className="nimbus-water" ref={canvasRef} aria-hidden="true" />
      <span className="nimbus-drop" ref={dropRef} aria-hidden="true" />
      {items.map((item, i) => {
        const kind = item.fx ?? "pop"
        const playing = fx.i === i && kind !== "none"
        const props = {
          ref: (el: HTMLElement | null) => { itemRefs.current[i] = el },
          className: "nimbus-item",
          "aria-current": i === current ? ("page" as const) : undefined,
          onClick: () => select(i),
        }
        const content = (
          <>
            {item.icon && (
              <span className="nv-ico" key={playing ? fx.n : 0}
                data-fx={playing ? kind : undefined}
                ref={(el) => { iconRefs.current[i] = el }}>
                {item.icon}
              </span>
            )}
            {!item.iconOnly && <span className="nimbus-label">{item.label}</span>}
          </>
        )
        return item.href ? (
          <a key={item.label + i} {...props} href={item.href} aria-label={item.label}>{content}</a>
        ) : (
          <button key={item.label + i} {...props} type="button" aria-label={item.label}>{content}</button>
        )
      })}
      {endContent && <div className="nimbus-actions">{endContent}</div>}
    </nav>
  )
}

export { LiquidNavbar as Component }
export default LiquidNavbar
