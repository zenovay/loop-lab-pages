import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// BASE_PATH is the path GitHub Pages serves the project site under (/loop-lab-pages/).
// RELEASE is the deployed commit SHA; SENTRY_ENVIRONMENT is `production` only in the deploy workflow.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  define: {
    __RELEASE__: JSON.stringify(process.env.RELEASE ?? 'local'),
    __SENTRY_ENVIRONMENT__: JSON.stringify(process.env.SENTRY_ENVIRONMENT ?? 'development'),
    __SENTRY_DSN__: JSON.stringify(process.env.SENTRY_DSN ?? ''),
  },
  build: {
    // Unminified, with source maps, so a stack frame names the repository file and line.
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        pricing: resolve(import.meta.dirname, 'pricing/index.html'),
        about: resolve(import.meta.dirname, 'about/index.html'),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['tests/**', 'node_modules/**'],
  },
})
