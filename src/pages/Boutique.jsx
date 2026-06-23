import { lazy, Suspense } from 'react'
const BoutiqueSection = lazy(() => import('../components/Boutique.jsx'))
const Load = () => <div style={{ padding: '4rem', minHeight: '60vh' }}/>
export default function PageBoutique() {
  return <div style={{ paddingTop: 66 }}><Suspense fallback={<Load />}><BoutiqueSection /></Suspense></div>
}
