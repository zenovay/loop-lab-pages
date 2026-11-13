import * as Sentry from '@sentry/browser'

const VISITOR_KEY = 'loop-lab-visitor'

/** An anonymous id kept in this browser, so Sentry can count affected visitors. Never an email. */
const visitorId = (): string => {
  try {
    const known = localStorage.getItem(VISITOR_KEY)
    if (known) return known
    const made = `visitor-${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(VISITOR_KEY, made)
    return made
  } catch {
    return 'visitor-unknown'
  }
}

export const startMonitoring = (): void => {
  if (__SENTRY_DSN__ === '') return
  Sentry.init({
    dsn: __SENTRY_DSN__,
    release: __RELEASE__,
    environment: __SENTRY_ENVIRONMENT__,
    // Release health is on by default (browserSessionIntegration): one session per page load,
    // so errors can be read as a rate per session.
    sendDefaultPii: false,
  })
  Sentry.setUser({ id: visitorId() })
}

export { Sentry }
