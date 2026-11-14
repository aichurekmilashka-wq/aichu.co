import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  base: "./",
  // Preserve Vite 6's browser targets during the bundler migration.
  build: { target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"] },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
})
