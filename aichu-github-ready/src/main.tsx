import React from "react"
import {createRoot} from "react-dom/client"
import App from "./App"
import "./index.css"
const FunnelAdvisor = React.lazy(() => import("./components/FunnelAdvisor"))
const isFunnelAdvisor = /^\/ru\/funnel\/?$/.test(window.location.pathname)

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isFunnelAdvisor ? (
      <React.Suspense fallback={<div style={{ minHeight: "100vh", background: "#07142d", color: "#f4eaf0", padding: 40 }}>Загружаем REZON…</div>}>
        <FunnelAdvisor />
      </React.Suspense>
    ) : <App />}
  </React.StrictMode>
)
