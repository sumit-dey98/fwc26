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
        globPatterns: ['**/*.{js,css,html,svg,webp,woff2}'],
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('worldcup26.ir') ||
              url.hostname.includes('thesportsdb.com') ||
              url.hostname.includes('wikipedia.org'),
            handler: 'NetworkOnly',
          },
          {
            // Cache flags
            // once a user has seen them at least once while online.
            urlPattern: ({ url }) => url.hostname === 'flagcdn.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'flag-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 90 * 24 * 60 * 60, // Cache for 90 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Google Fonts stylesheet (the CSS that declares @font-face rules)
            urlPattern: ({ url }) => url.hostname === 'fonts.googleapis.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60, // Cache for a year
              },
            },
          },
          {
            // The actual font files (woff2) the stylesheet above points to
            urlPattern: ({ url }) => url.hostname === 'fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
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