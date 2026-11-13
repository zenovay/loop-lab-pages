import { expect, test } from '@playwright/test'

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'about', path: '/about/' },
]
const WIDTHS = [375, 1440]

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`${route.name} looks the same at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(route.path, { waitUntil: 'networkidle' })
      await expect(page).toHaveScreenshot(`${route.name}-${width}.png`, { fullPage: true })
    })
  }
}
