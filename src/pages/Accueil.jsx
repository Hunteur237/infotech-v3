import { lazy, Suspense } from 'react'
import Hero from '../components/Hero.jsx'

const LogicielsSection = lazy(() => import('../components/Logiciels.jsx'))
const ServicesSection  = lazy(() => import('../components/Services.jsx'))
const PortfolioSection = lazy(() => import('../components/Portfolio.jsx'))
const ReviewsSection   = lazy(() => import('../components/Reviews.jsx'))
const DevisSection     = lazy(() => import('../components/Devis.jsx').then(m => ({ default: m.DevisSection })))
const FAQSection       = lazy(() => import('../components/Devis.jsx').then(m => ({ default: m.FAQSection })))

const Load = () => <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
  <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #1E2136', borderTopColor: '#4ADE80', animation: 'spin .7s linear infinite' }}/>
</div>

export default function PageAccueil({ onRdvOpen }) {
  return (
    <>
      <Hero onRdvOpen={onRdvOpen} />
      <Suspense fallback={<Load />}><LogicielsSection /></Suspense>
      <Suspense fallback={<Load />}><ServicesSection /></Suspense>
      <Suspense fallback={<Load />}><PortfolioSection preview /></Suspense>
      <Suspense fallback={<Load />}><ReviewsSection /></Suspense>
      <Suspense fallback={<Load />}><DevisSection /></Suspense>
      <Suspense fallback={<Load />}><FAQSection /></Suspense>
    </>
  )
}
