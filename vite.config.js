import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.webp'],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'FIFA WC 2026 | Schedule & Live Scores',
        short_name: 'FWC 2026',
        description: 'FIFA World Cup 2026 schedule, live scores, standings, and bracket predictor.',
        theme_color: '#08121f',
        background_color: '#08121f',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/logo-192.webp', sizes: '192x192', type: 'image/webp' },
          { src: '/logo-512.webp', sizes: '512x512', type: 'image/webp' },
          { src: '/logo-512.webp', sizes: '512x512', type: 'image/webp', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache only the app shell - JS/CSS/HTML/fonts/icons.
        globPatterns: ['**/*.{js,css,html,svg,webp,woff2}'],
        // CRITICAL:
        // All data fetching stays governed by the app's own tiered cache
        // (AppContext.jsx) - the service worker must not interfere with
        // live-score freshness.
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('worldcup26.ir') ||
              url.hostname.includes('thesportsdb.com') ||
              url.hostname.includes('wikipedia.org'),
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@views': resolve(__dirname, 'src/components/views'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@context': resolve(__dirname, 'src/context'),
      '@data': resolve(__dirname, 'src/data'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/live': {
        target: 'https://worldcup26.ir',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/live/, ''),
      },
      '/apifootball': {
        target: 'https://v3.football.api-sports.io',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/apifootball/, ''),
      },
    },
  },
})