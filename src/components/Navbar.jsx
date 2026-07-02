import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { DS, FONTS } from '../lib/design.js'
import { useCart } from './UI.jsx'
import { useTheme } from '../lib/theme.jsx'
import { useAuth } from '../lib/auth.jsx'

// Icônes SVG inline (pas d'emojis)
const IconSun  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>
const IconMoon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
const IconMenu    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const IconX       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconCart    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
const IconCalendar= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconUser    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

const NAV_LINKS = [
  { label: 'Services',   to: '/services' },
  { label: 'Logiciels',  to: '/portfolio' },
  { label: 'Boutique',   to: '/boutique' },
  { label: 'Blog',       to: '/blog' },
  { label: 'Contact',    to: '/contact' },
]

export default function Navbar({ onCartOpen, onAdminOpen, onRdvOpen }) {
  const { count } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { scrollY } = useScroll()
  const bgOp = useTransform(scrollY, [0, 80], [0, 1])
  const [mob, setMob] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMob(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    const h = () => { if (window.innerWidth > 768) setMob(false) }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const isActive = to => location.pathname === to

  return (
    <>
      <motion.header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500 }}>
        {/* Fond avec blur au scroll */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: DS.bg2,
          backdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${DS.border}`,
          opacity: bgOp
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 1680, width: '100%', margin: '0 auto',
          padding: '0 1.5rem', height: 66,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>

          {/* Logo officiel */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: DS.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="200 380 850 560" xmlns="http://www.w3.org/2000/svg">
                {/* Lettre I */}
                <rect x="253" y="390" width="19" height="95" fill="#0A0B10"/>
                {/* Lettre N */}
                <path d="M144 390 L144 485 L163 485 L163 420 L253 485 L272 485 L272 390 L253 390 L253 455 L163 390 Z" fill="#0A0B10"/>
                {/* Lettre F */}
                <path d="M584 390 L584 485 L603 485 L603 445 L674 445 L674 427 L603 427 L603 408 L674 408 L674 390 Z" fill="#0A0B10"/>
                {/* Lettre O */}
                <path d="M840 390 Q880 390 900 415 Q920 440 920 437 Q920 460 900 475 Q880 490 840 490 Q800 490 780 475 Q760 460 760 437 Q760 414 780 402 Q800 390 840 390 Z M840 408 Q810 408 797 420 Q784 432 784 437 Q784 460 797 470 Q810 480 840 480 Q870 480 883 470 Q896 460 896 437 Q896 432 883 420 Q870 408 840 408 Z" fill="#0A0B10"/>
                {/* Barre INFO → TECH séparateur */}
                <rect x="144" y="510" width="870" height="5" fill="#0A0B10" opacity="0.3"/>
                {/* Lettre T */}
                <path d="M144 530 L144 548 L257 548 L257 625 L276 625 L276 548 L390 548 L390 530 Z" fill="#0A0B10"/>
                {/* Lettre E */}
                <path d="M410 530 L410 625 L600 625 L600 607 L429 607 L429 585 L580 585 L580 567 L429 567 L429 548 L600 548 L600 530 Z" fill="#0A0B10"/>
                {/* Lettre C */}
                <path d="M860 530 Q820 530 798 550 Q776 570 776 577 Q776 605 798 615 Q820 625 860 625 Q900 625 920 610 L920 592 Q900 607 860 607 Q832 607 818 598 Q804 589 804 577 Q804 565 818 556 Q832 547 860 547 Q900 547 920 562 L920 544 Q900 530 860 530 Z" fill="#0A0B10"/>
                {/* Lettre H */}
                <path d="M640 530 L640 625 L659 625 L659 585 L760 585 L760 625 L779 625 L779 530 L760 530 L760 567 L659 567 L659 530 Z" fill="#0A0B10"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: '1.1rem', letterSpacing: '.04em', color: DS.white, lineHeight: 1 }}>
                INFO<span style={{ color: DS.lime }}>.</span>TECH
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: '.55rem', color: DS.gray2, letterSpacing: '.16em', textTransform: 'uppercase', marginTop: 2 }}>Solutions Numériques</div>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="it-desk-nav">
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  position: 'relative', padding: '6px 14px',
                  fontFamily: FONTS.body, fontSize: '.875rem', fontWeight: 500,
                  color: isActive(l.to) ? DS.white : DS.gray3,
                  textDecoration: 'none', transition: 'color .2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = DS.white}
                onMouseLeave={e => e.currentTarget.style.color = isActive(l.to) ? DS.white : DS.gray3}
              >
                {l.label}
                {isActive(l.to) && (
                  <motion.span
                    layoutId="nav-indicator"
                    style={{ position: 'absolute', bottom: -1, left: 14, right: 14, height: 2, background: DS.lime, borderRadius: 1 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="it-desk-actions">

            {/* Thème clair/sombre */}
            <button
              onClick={toggleTheme}
              aria-label="Changer de thème"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: DS.r2,
                background: 'transparent', border: `1px solid ${DS.border}`,
                color: DS.gray3, cursor: 'pointer', transition: 'all .2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${DS.lime}44`; e.currentTarget.style.color = DS.white }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.gray3 }}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>

            {/* Compte client */}
            <Link
              to={user ? '/compte' : '/compte/connexion'}
              aria-label="Mon compte"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: DS.r2,
                background: 'transparent', border: `1px solid ${DS.border}`,
                color: DS.gray3, cursor: 'pointer', transition: 'all .2s', textDecoration: 'none'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${DS.lime}44`; e.currentTarget.style.color = DS.white }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.gray3 }}
            >
              <IconUser />
            </Link>

            {/* RDV */}
            <button
              onClick={onRdvOpen}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 13px', borderRadius: DS.r2,
                background: 'transparent', border: `1px solid ${DS.border}`,
                color: DS.gray3, fontFamily: FONTS.body, fontSize: '.82rem',
                cursor: 'pointer', transition: 'all .2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${DS.lime}44`; e.currentTarget.style.color = DS.white }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.gray3 }}
            >
              <IconCalendar /> Prendre RDV
            </button>

            {/* Panier */}
            <button
              onClick={onCartOpen}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: DS.r2,
                border: `1px solid ${DS.border}`, background: 'transparent',
                color: DS.gray3, fontFamily: FONTS.body, fontSize: '.82rem',
                cursor: 'pointer', transition: 'all .2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${DS.lime}44`; e.currentTarget.style.color = DS.white }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.gray3 }}
            >
              <IconCart /> Panier
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: DS.lime, color: DS.bg, fontSize: '.62rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.mono }}
                  >{count}</motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* CTA */}
            <Link
              to="/contact"
              style={{
                padding: '8px 20px', borderRadius: DS.r2,
                background: DS.lime, color: DS.bg,
                fontFamily: FONTS.body, fontWeight: 600, fontSize: '.85rem',
                transition: 'all .2s', textDecoration: 'none', display: 'inline-block'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = DS.lime2; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = DS.lime; e.currentTarget.style.transform = 'none' }}
            >
              Devis gratuit
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            onClick={() => setMob(v => !v)}
            className="it-burger"
            style={{ display: 'none', padding: 8, background: 'none', border: 'none', color: DS.white, cursor: 'pointer' }}
          >
            {mob ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </motion.header>

      {/* Menu mobile */}
      <AnimatePresence>
        {mob && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: .36, ease: [.22, 1, .36, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 490,
              background: DS.bg2,
              padding: '5rem 2rem 2rem',
              display: 'flex', flexDirection: 'column'
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * .06 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setMob(false)}
                    style={{
                      display: 'block', padding: '1rem 0',
                      borderBottom: `1px solid ${DS.border}`,
                      fontFamily: FONTS.display, fontWeight: 700, fontSize: '1.6rem',
                      color: isActive(l.to) ? DS.lime : DS.gray3,
                      textDecoration: 'none', transition: 'color .2s, padding-left .2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = DS.lime; e.currentTarget.style.paddingLeft = '8px' }}
                    onMouseLeave={e => { e.currentTarget.style.color = isActive(l.to) ? DS.lime : DS.gray3; e.currentTarget.style.paddingLeft = '0' }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '2rem' }}>
              <button
                onClick={toggleTheme}
                style={{ width: '100%', padding: '12px', background: DS.s2, border: `1px solid ${DS.border}`, borderRadius: DS.r2, color: DS.white, fontFamily: FONTS.body, fontSize: '.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {theme === 'dark' ? <IconSun /> : <IconMoon />} {theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
              </button>
              <Link
                to={user ? '/compte' : '/compte/connexion'}
                onClick={() => setMob(false)}
                style={{ width: '100%', padding: '12px', background: DS.s2, border: `1px solid ${DS.border}`, borderRadius: DS.r2, color: DS.white, fontFamily: FONTS.body, fontSize: '.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', boxSizing: 'border-box' }}
              >
                <IconUser /> {user ? 'Mon compte' : 'Connexion / Inscription'}
              </Link>
              <button
                onClick={() => { setMob(false); onRdvOpen() }}
                style={{ width: '100%', padding: '12px', background: DS.s2, border: `1px solid ${DS.border}`, borderRadius: DS.r2, color: DS.white, fontFamily: FONTS.body, fontSize: '.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <IconCalendar /> Prendre RDV
              </button>
              <button
                onClick={() => { setMob(false); onCartOpen() }}
                style={{ width: '100%', padding: '12px', background: DS.s2, border: `1px solid ${DS.border}`, borderRadius: DS.r2, color: DS.white, fontFamily: FONTS.body, fontSize: '.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <IconCart /> Panier ({count})
              </button>
              <Link
                to="/contact"
                onClick={() => setMob(false)}
                style={{ display: 'block', textAlign: 'center', padding: '13px', background: DS.lime, borderRadius: DS.r2, color: DS.bg, fontFamily: FONTS.body, fontWeight: 600, fontSize: '.92rem', textDecoration: 'none' }}
              >
                Devis gratuit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1024px) { .it-desk-nav { display: none !important } }
        @media (max-width: 768px)  { .it-desk-actions { display: none !important }; .it-burger { display: flex !important } }
        @media (min-width: 769px)  { .it-burger { display: none !important } }
      `}</style>
    </>
  )
}
