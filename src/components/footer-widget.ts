/**
 * The footer on every page: a newsletter sign-up and a line about the latest release.
 *
 * Each page carries its own settings as JSON in <script type="application/json" id="footer-config">.
 */

export type Campaign = { readonly id: string; readonly source: string }

export type FooterConfig = {
  readonly page: string
  readonly headline: string
  readonly cta: string
  /** The marketing campaign this page's sign-ups are counted under. */
  readonly campaign: Campaign
}

export const readFooterConfig = (doc: Document): FooterConfig => {
  const raw = doc.getElementById('footer-config')?.textContent ?? '{}'
  return JSON.parse(raw) as FooterConfig
}

/** The text on the sign-up button. */
export const buttonLabel = (config: Pick<FooterConfig, 'cta'>): string => config.cta.trim() || 'Subscribe'

/** The analytics key an impression is counted under: `<page>:<campaign>:<source>`. */
export const impressionKey = (config: FooterConfig): string =>
  `${config.page}:${config.campaign.id}:${config.campaign.source}`

const impressions: string[] = []

/** Counts that the footer was seen, once the page has painted. */
export const trackImpression = (config: FooterConfig): void => {
  impressions.push(impressionKey(config))
}

export const mountFooter = (root: HTMLElement, config: FooterConfig): void => {
  root.innerHTML = `
    <div class="footer-widget">
      <div>
        <p class="footer-headline"></p>
        <p class="footer-note">One email a month. No tracking pixels.</p>
      </div>
      <form class="footer-form" novalidate>
        <label class="sr-only" for="footer-email">Email address</label>
        <input id="footer-email" name="email" type="text" inputmode="email" placeholder="you@example.com" autocomplete="email" />
        <button type="submit"></button>
      </form>
    </div>`
  root.querySelector('.footer-headline')!.textContent = config.headline
  root.querySelector('button')!.textContent = buttonLabel(config)
  root.querySelector('form')!.addEventListener('submit', (event) => {
    event.preventDefault()
    root.querySelector('.footer-note')!.textContent = 'Thanks. This is a test site, so nothing was sent.'
  })
  // After the first paint, so counting never delays the page.
  setTimeout(() => trackImpression(config), 0)
}
