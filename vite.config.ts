import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "سامانه تحلیل بیماری‌ها",
        short_name: "بیماری‌ها",
        start_url: "/",
        display: "standalone",
        dir: "rtl",
        lang: "fa",
        background_color: "#0f172a",
        theme_color: "#0ea5e9",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,ttf,xlsx}"],
        globIgnores: ["**/node_modules/**/*", "**/sw.js", "**/workbox-*.js"],
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        clientsClaim: true
      }
    })
  ],
  server: { port: 5173 }
})
