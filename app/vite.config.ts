import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    cssTarget: 'es2022',
  },
  plugins: [
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      injectRegister: null,
      manifest: false,
      filename: 'sw.js',
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,woff,mp3,ogg,png,svg,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: true,
  },
})
