import { useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { FONTS_URL } from './lib/design.js'
import { ToastProvider, CartProvider } from './components/UI.jsx'
import { ThemeProvider } from './lib/theme.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Pages principales (routes séparées)
const PageAccueil   = lazy(() => import('./pages/Accueil.jsx'))
const PageServices  = lazy(() => import('./pages/Services.jsx'))
const PagePortfolio = lazy(() => import('./pages/Portfolio.jsx'))
const PageBoutique  = lazy(() => import('./pages/Boutique.jsx'))
const PageBlog      = lazy(() => import('./pages/Blog.jsx'))
const PageContact   = lazy(() => import('./pages/Contact.jsx'))
const PagePaiementRetour = lazy(() => import('./pages/PaiementRetour.jsx'))

// Modaux globaux
const RDVModal        = lazy(() => import('./components/RDV.jsx'))
const AdminDashboard  = lazy(() => import('./components/Admin.jsx'))
const CartDrawerComp  = lazy(() => import('./components/Boutique.jsx').then(m => ({ default: m.CartDrawer })))

function Loader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #1E2136', borderTopColor: '#4ADE80', animation: 'spin .7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function App() {
  const [cartOpen,  setCartOpen]  = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [rdvOpen,   setRdvOpen]   = useState(false)

  return (
    <ThemeProvider>
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <style>{`@import url('${FONTS_URL}');`}</style>

          <Navbar
            onCartOpen={()  => setCartOpen(true)}
            onAdminOpen={() => setAdminOpen(true)}
            onRdvOpen={()   => setRdvOpen(true)}
          />

          <main>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/"           element={<PageAccueil  onRdvOpen={() => setRdvOpen(true)} />} />
                <Route path="/services"   element={<PageServices />} />
                <Route path="/portfolio"  element={<PagePortfolio />} />
                <Route path="/boutique"   element={<PageBoutique />} />
                <Route path="/blog"       element={<PageBlog />} />
                <Route path="/contact"    element={<PageContact />} />
                <Route path="/paiement-retour" element={<PagePaiementRetour />} />
                <Route path="/admin"      element={
                  <Suspense fallback={<Loader />}>
                    <AdminDashboard onClose={() => { window.location.href = '/' }} />
                  </Suspense>
                } />
                {/* Fallback */}
                <Route path="*"           element={<PageAccueil onRdvOpen={() => setRdvOpen(true)} />} />
              </Routes>
            </Suspense>
          </main>

          <Suspense fallback={null}>
            <Footer onAdminOpen={() => setAdminOpen(true)} />
          </Suspense>

          {/* Modaux globaux */}
          <Suspense fallback={null}>
            <CartDrawerComp open={cartOpen} onClose={() => setCartOpen(false)} />
          </Suspense>
          <Suspense fallback={null}>
            <RDVModal open={rdvOpen} onClose={() => setRdvOpen(false)} />
          </Suspense>
          <AnimatePresence>
            {adminOpen && (
              <Suspense fallback={null}>
                <AdminDashboard onClose={() => setAdminOpen(false)} />
              </Suspense>
            )}
          </AnimatePresence>

          {/* WhatsApp flottant */}
          <WhatsAppFloat />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}

// Bouton WhatsApp avec bon numéro
function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  const [hov, setHov] = useState(false)
  if (typeof window !== 'undefined') {
    setTimeout(() => setVisible(true), 2000)
  }
  if (!visible) return null
  return (
    <div style={{ position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 800, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
      {hov && (
        <div style={{ background: '#13151F', border: '1px solid #1E2136', borderRadius: 8, padding: '.55rem 1rem', fontSize: '.82rem', fontFamily: "'Inter',sans-serif", color: '#F1F5F9', whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}>
          Discuter sur WhatsApp
        </div>
      )}
      <a
        href="https://wa.me/237683421271?text=Bonjour%20INFO-TECH%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services."
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ width: 52, height: 52, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,.35)', transition: 'transform .2s', transform: hov ? 'scale(1.08)' : 'scale(1)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  )
}
