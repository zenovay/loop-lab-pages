import { defineConfig } from '@playwright/test'

// Screenshots are compared only inside the Playwright container image (see .github/workflows),
// so fonts and rendering are the same on every run. Baselines are written by the
// `visual-baselines` workflow, never on a laptop.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4173' },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
})
