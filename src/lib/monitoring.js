import * as Sentry from '@sentry/react'

export function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return // pas configuré : on ne casse rien, juste pas de remontée d'erreurs

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.2, // 20% des navigations suivies en performance, économise le quota gratuit
    integrations: [Sentry.browserTracingIntegration()],
    beforeSend(event) {
      // Ignore le bruit des extensions de navigateur et des erreurs réseau tierces
      const msg = event.exception?.values?.[0]?.value || ''
      if (/extension:\/\//.test(msg) || /ResizeObserver loop/.test(msg)) return null
      return event
    },
  })
}

export { Sentry }
