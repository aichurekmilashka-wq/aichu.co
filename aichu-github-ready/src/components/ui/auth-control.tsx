import { useEffect, useRef, useState, type FormEvent } from "react"
import { createPortal } from "react-dom"
import { Eye, EyeOff, LogOut, UserRound, X } from "lucide-react"
import { createClient, type User } from "@supabase/supabase-js"

type Language = "ru" | "en" | "ky"
type Mode = "login" | "signup" | "forgot" | "update"

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

// A publishable/anon key is safe in frontend code. Never use a service_role or secret key here.
const auth = url && publishableKey
  ? createClient(url, publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null

const messages = {
  ru: {
    account: "Личный кабинет", login: "Войти", signup: "Создать аккаунт",
    forgot: "Восстановить пароль", update: "Новый пароль", email: "Электронная почта",
    password: "Пароль", repeat: "Повторите пароль", logout: "Выйти",
    close: "Закрыть", showPassword: "Показать пароль", hidePassword: "Скрыть пароль",
    noAccount: "Нет аккаунта?", haveAccount: "Уже зарегистрированы?",
    forgotLink: "Забыли пароль?", back: "Вернуться ко входу",
    sendLink: "Отправить ссылку", savePassword: "Сохранить пароль",
    profile: "Вы вошли в аккаунт aichuuu.co.", noWorkspace: "Рабочий кабинет REZON пока разрабатывается.",
    confirm: "Проверьте почту: отправлена ссылка для подтверждения регистрации.",
    resetSent: "Если адрес зарегистрирован, на него придёт письмо для восстановления пароля.",
    passwordChanged: "Пароль обновлён.", passwordMismatch: "Пароли не совпадают.",
    passwordShort: "Пароль должен содержать не менее 8 символов.",
    genericError: "Не удалось выполнить действие. Попробуйте ещё раз.",
    wrongCredentials: "Неверная почта или пароль.",
    unconfigured: "Регистрация пока недоступна: сервис учётных записей ещё не подключён.",
    busy: "Обработка...", legal: "Для входа используется защищённый сервис учётных записей.",
  },
  en: {
    account: "My account", login: "Sign in", signup: "Create account",
    forgot: "Reset password", update: "New password", email: "Email address",
    password: "Password", repeat: "Repeat password", logout: "Sign out",
    close: "Close", showPassword: "Show password", hidePassword: "Hide password",
    noAccount: "New here?", haveAccount: "Already registered?",
    forgotLink: "Forgot password?", back: "Back to sign in",
    sendLink: "Send reset link", savePassword: "Save password",
    profile: "You are signed in to aichuuu.co.", noWorkspace: "The REZON workspace is still in development.",
    confirm: "Check your email for a registration confirmation link.",
    resetSent: "If this address is registered, a reset email will be sent.",
    passwordChanged: "Password updated.", passwordMismatch: "Passwords do not match.",
    passwordShort: "Your password must contain at least 8 characters.",
    genericError: "Something went wrong. Please try again.",
    wrongCredentials: "Incorrect email or password.",
    unconfigured: "Registration is not yet available: the account service has not been connected.",
    busy: "Working...", legal: "Sign-in is handled by a secure account service.",
  },
  ky: {
    account: "Жеке кабинет", login: "Кирүү", signup: "Катталуу",
    forgot: "Сырсөздү калыбына келтирүү", update: "Жаңы сырсөз", email: "Электрондук почта",
    password: "Сырсөз", repeat: "Сырсөздү кайталаңыз", logout: "Чыгуу",
    close: "Жабуу", showPassword: "Сырсөздү көрсөтүү", hidePassword: "Сырсөздү жашыруу",
    noAccount: "Аккаунтуңуз жокпу?", haveAccount: "Катталгансызбы?",
    forgotLink: "Сырсөздү унуттуңузбу?", back: "Кирүүгө кайтуу",
    sendLink: "Шилтеме жөнөтүү", savePassword: "Сырсөздү сактоо",
    profile: "aichuuu.co аккаунтуңузга кирдиңиз.", noWorkspace: "REZON жеке кабинети азыр иштелип жатат.",
    confirm: "Почтаңызды текшериңиз: каттоону ырастоо шилтемеси жөнөтүлдү.",
    resetSent: "Эгер дарек катталган болсо, калыбына келтирүү каты жөнөтүлөт.",
    passwordChanged: "Сырсөз жаңыртылды.", passwordMismatch: "Сырсөздөр дал келбейт.",
    passwordShort: "Сырсөз кеминде 8 белгиден турушу керек.",
    genericError: "Аракет ишке ашкан жок. Кайра аракет кылыңыз.",
    wrongCredentials: "Почта же сырсөз туура эмес.",
    unconfigured: "Каттоо азырынча жеткиликсиз: аккаунт кызматы туташа элек.",
    busy: "Иштелүүдө...", legal: "Кирүү корголгон аккаунт кызматы аркылуу аткарылат.",
  },
} as const

export default function AuthControl({ language, theme }: { language: Language; theme: "dark" | "light" }) {
  const t = messages[language]
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>("login")
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const firstField = useRef<HTMLInputElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!auth) return
    const { data: { subscription } } = auth.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === "PASSWORD_RECOVERY") {
        setMode("update")
        setOpen(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    const focusTimer = window.setTimeout(() => firstField.current?.focus(), 0)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      trigger.current?.focus()
    }
  }, [open])

  const switchMode = (next: Mode) => {
    setMode(next)
    setError("")
    setNotice("")
    setPassword("")
    setRepeatPassword("")
    setShowPassword(false)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!auth || busy) return
    setError("")
    setNotice("")

    if ((mode === "signup" || mode === "update") && password !== repeatPassword) {
      setError(t.passwordMismatch)
      return
    }
    if ((mode === "signup" || mode === "update") && password.length < 8) {
      setError(t.passwordShort)
      return
    }

    setBusy(true)
    try {
      if (mode === "login") {
        const { error: authError } = await auth.auth.signInWithPassword({ email: email.trim(), password })
        if (authError) throw authError
        setOpen(false)
        setPassword("")
      } else if (mode === "signup") {
        const { data, error: authError } = await auth.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + window.location.pathname },
        })
        if (authError) throw authError
        setPassword("")
        setRepeatPassword("")
        if (data.session) {
          setOpen(false)
        } else {
          setNotice(t.confirm)
        }
      } else if (mode === "forgot") {
        const { error: authError } = await auth.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + window.location.pathname,
        })
        if (authError) throw authError
        setNotice(t.resetSent)
      } else {
        const { error: authError } = await auth.auth.updateUser({ password })
        if (authError) throw authError
        setPassword("")
        setRepeatPassword("")
        setNotice(t.passwordChanged)
        setMode("login")
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : ""
      setError(/invalid login credentials/i.test(message) ? t.wrongCredentials : message || t.genericError)
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    if (!auth || busy) return
    setBusy(true)
    setError("")
    const { error: authError } = await auth.auth.signOut()
    if (authError) setError(authError.message)
    else { setOpen(false); switchMode("login"); setUser(null) }
    setBusy(false)
  }

  const light = theme === "light"
  const surface = light
    ? "border-[#07142D]/15 bg-white text-[#07142D]"
    : "border-[#F4EAF0]/20 bg-[#07142D] text-[#F4EAF0]"
  const inputStyle = light
    ? "border-[#07142D]/20 bg-[#07142D]/[.04] text-[#07142D] placeholder:text-[#07142D]/40"
    : "border-[#F4EAF0]/20 bg-white/[.06] text-[#F4EAF0] placeholder:text-[#F4EAF0]/40"
  const muted = light ? "text-[#07142D]/65" : "text-[#F4EAF0]/65"

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="nimbus-action relative"
        onClick={() => { setOpen(true); setError(""); setNotice("") }}
        aria-label={t.account}
        aria-haspopup="dialog"
        title={t.account}
      >
        <UserRound size={19} strokeWidth={1.8} aria-hidden="true" />
        {user && <span aria-hidden="true" className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-[#FDC21E]" />}
      </button>
      {open && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#010712]/80 p-4 backdrop-blur-md"
          onMouseDown={event => { if (event.target === event.currentTarget && !busy) setOpen(false) }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="aichu-auth-title"
            className={"relative w-full max-w-md overflow-y-auto rounded-2xl border p-6 shadow-2xl sm:p-9 " + surface}
            style={{ maxHeight: "calc(100dvh - 2rem)" }}
          >
            <div className="mb-8 flex items-start justify-between gap-5">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.23em] text-[#C79400]">AICHUUU.CO / ACCOUNT</p>
                <h2 id="aichu-auth-title" className="text-3xl font-semibold tracking-tight">
                  {user && mode !== "update" ? t.account : mode === "login" ? t.login : mode === "signup" ? t.signup : mode === "forgot" ? t.forgot : t.update}
                </h2>
              </div>
              <button type="button" disabled={busy} onClick={() => setOpen(false)} aria-label={t.close} className={"rounded-lg p-2 transition-colors hover:bg-[#FDC21E]/15 " + muted}>
                <X size={20} />
              </button>
            </div>
            {!auth ? (
              <p className={"text-sm leading-relaxed " + muted}>{t.unconfigured}</p>
            ) : user && mode !== "update" ? (
              <div className="space-y-6">
                <p className={"text-sm " + muted}>{t.profile}</p>
                <p className={"break-all rounded-xl border p-4 text-sm " + (light ? "border-[#07142D]/15" : "border-[#F4EAF0]/15")}>{user.email}</p>
                <p className={"text-sm leading-relaxed " + muted}>{t.noWorkspace}</p>
                {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
                <button type="button" disabled={busy} onClick={signOut} className={"flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-colors hover:border-[#FDC21E] disabled:opacity-50 " + (light ? "border-[#07142D]/20" : "border-[#F4EAF0]/20")}>
                  <LogOut size={17} />{t.logout}
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={submit} className="space-y-5">
                  {mode !== "update" && (
                    <label className="block">
                      <span className={"mb-2 block text-xs font-medium " + muted}>{t.email}</span>
                      <input ref={firstField} type="email" name="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)}
                        className={"w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:border-[#FDC21E] " + inputStyle} placeholder="you@company.com" />
                    </label>
                  )}
                  {mode !== "forgot" && (
                    <label className="block">
                      <span className={"mb-2 block text-xs font-medium " + muted}>{t.password}</span>
                      <span className="relative block">
                        <input ref={mode === "update" ? firstField : undefined} type={showPassword ? "text" : "password"} name="password"
                          autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 8} maxLength={256}
                          value={password} onChange={event => setPassword(event.target.value)}
                          className={"w-full rounded-xl border px-4 py-3 pr-12 text-base outline-none transition-colors focus:border-[#FDC21E] " + inputStyle} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? t.hidePassword : t.showPassword}
                          className={"absolute right-3 top-1/2 -translate-y-1/2 p-1 " + muted}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </span>
                    </label>
                  )}
                  {(mode === "signup" || mode === "update") && (
                    <label className="block">
                      <span className={"mb-2 block text-xs font-medium " + muted}>{t.repeat}</span>
                      <input type={showPassword ? "text" : "password"} name="confirm-password" autoComplete="new-password" required minLength={8} maxLength={256}
                        value={repeatPassword} onChange={event => setRepeatPassword(event.target.value)}
                        className={"w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors focus:border-[#FDC21E] " + inputStyle} />
                    </label>
                  )}
                  {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
                  {notice && <p role="status" className={"rounded-lg border border-[#FDC21E]/30 p-3 text-sm " + muted}>{notice}</p>}
                  <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#FDC21E] px-5 py-3.5 text-sm font-semibold text-[#07142D] transition-colors hover:bg-[#FFDC6C] disabled:opacity-60">
                    {busy ? t.busy : mode === "login" ? t.login : mode === "signup" ? t.signup : mode === "forgot" ? t.sendLink : t.savePassword}
                  </button>
                </form>
                <div className={"mt-6 space-y-4 text-center text-sm " + muted}>
                  {mode === "login" && (
                    <>
                      <button type="button" onClick={() => switchMode("forgot")} className="underline decoration-[#FDC21E] underline-offset-4">{t.forgotLink}</button>
                      <p>{t.noAccount} <button type="button" onClick={() => switchMode("signup")} className="font-semibold text-[#C79400] hover:underline">{t.signup}</button></p>
                    </>
                  )}
                  {mode === "signup" && <p>{t.haveAccount} <button type="button" onClick={() => switchMode("login")} className="font-semibold text-[#C79400] hover:underline">{t.login}</button></p>}
                  {mode === "forgot" && <button type="button" onClick={() => switchMode("login")} className="underline decoration-[#FDC21E] underline-offset-4">{t.back}</button>}
                </div>
                <p className={"mt-8 text-center text-xs leading-relaxed " + muted}>{t.legal}</p>
              </>
            )}
          </section>
        </div>,
        document.body
      )}
    </>
  )
}
