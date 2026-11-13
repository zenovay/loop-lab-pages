import { mountFooter, readFooterConfig } from './components/footer-widget'
import { startMonitoring } from './sentry'
import './styles/site.css'

/** What every page does first: start monitoring, then draw the shared footer. */
export const startPage = (): void => {
  startMonitoring()
  const footer = document.getElementById('footer')
  if (footer !== null) mountFooter(footer, readFooterConfig(document))
}
