import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { DS, FONTS } from '../lib/design.js'
import { STATS } from '../lib/data.js'
import { Counter, Reveal } from './UI.jsx'

// Icônes SVG inline
const IconArrow   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const IconPhone   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.2C.01.68.42.05.97.01A2 2 0 013 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
const IconCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconClock   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconStar    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconCode    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
const IconMonitor = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
const IconSmartphone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const IconTool    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>

const SERVICES_HIGHLIGHTS = [
  { icon: <IconMonitor />,    label: 'Logiciels de gestion pour PME' },
  { icon: <IconCode />,       label: 'Développement Web' },
  { icon: <IconTool />,       label: 'Maintenance & Assistance IT' },
  { icon: <IconSmartphone />, label: 'Applications Mobiles' },
]

const HIGHLIGHTS = [
  'Réponse sous 24h garantie',
  'Démonstration gratuite avant tout engagement',
  'Essai gratuit de 14 jours sur les logiciels de gestion',
]

export default function Hero({ onRdvOpen }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y  = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const op = useTransform(scrollYProgress, [0, .7], [1, 0])

  return (
    <section ref={ref} style={{
      position: 'relative', minHeight: '100vh',
      background: DS.bg, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', overflow: 'hidden', paddingTop: 66
    }}>
      {/* Fond géométrique discret */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${DS.border} 1px, transparent 1px), linear-gradient(90deg, ${DS.border} 1px, transparent 1px)`,
        backgroundSize: '60px 60px', opacity: .4, pointerEvents: 'none'
      }} />
      {/* Gradient radial pour lisibilité */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, ${DS.bg} 85%)`,
        pointerEvents: 'none'
      }} />
      {/* Halo vert subtil */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [.25, .4, .25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-15%', right: '0%',
          width: 700, height: 700, borderRadius: '50%',
          background: `radial-gradient(circle, ${DS.lime}0D 0%, transparent 65%)`,
          pointerEvents: 'none'
        }}
      />

      <motion.div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1680, width: '100%', margin: '0 auto',
        padding: '5rem 1.5rem 6rem',
        display: 'grid', gridTemplateColumns: '1fr 420px',
        gap: '4rem', alignItems: 'center',
        y, opacity: op
      }} className="hero-grid">

        {/* Colonne gauche */}
        <div>
          {/* Badge disponibilité */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: .1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${DS.lime}10`, border: `1px solid ${DS.lime}28`,
              borderRadius: 100, padding: '5px 14px', marginBottom: '1.75rem'
            }}
          >
            <motion.span
              animate={{ opacity: [1, .3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: DS.lime, flexShrink: 0 }}
            />
            <span style={{ fontFamily: FONTS.mono, fontSize: '.7rem', color: DS.lime, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              Disponible · Douala, Cameroun
            </span>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .65, delay: .2, ease: [.22, 1, .36, 1] }}
            style={{
              fontFamily: FONTS.display, fontWeight: 800,
              fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)',
              lineHeight: 1.08, letterSpacing: '-.02em',
              color: DS.white, marginBottom: '1.5rem'
            }}
          >
            Votre partenaire{' '}
            <span style={{ color: DS.lime }}>tech</span>
            <br />pour les{' '}
            <span style={{ color: DS.lime }}>PME</span>
            {' '}camerounaises
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6, delay: .35 }}
            style={{
              fontFamily: FONTS.body, color: DS.gray3,
              fontSize: '1.05rem', lineHeight: 1.75, fontWeight: 400,
              maxWidth: 520, marginBottom: '2rem'
            }}
          >
            Développement de logiciels de gestion pour PME, sites web et solutions numériques sur mesure pour les commerçants et entreprises de Douala. Basé localement, réactif, disponible.
          </motion.p>

          {/* Points clés */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .5 }}
            style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '2.5rem' }}
          >
            {HIGHLIGHTS.map((h, i) => (
              <motion.li
                key={h}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: .5 + i * .08 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONTS.body, fontSize: '.9rem', color: DS.gray3 }}
              >
                <span style={{ color: DS.lime, flexShrink: 0 }}><IconCheck /></span>
                {h}
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .65 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '3.5rem' }}
          >
            <Link
              to="/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px', borderRadius: DS.r2,
                background: DS.lime, color: DS.bg,
                fontFamily: FONTS.body, fontWeight: 600, fontSize: '.92rem',
                textDecoration: 'none', transition: 'all .22s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = DS.lime2; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = DS.lime; e.currentTarget.style.transform = 'none' }}
            >
              Demander un devis gratuit <IconArrow />
            </Link>
            <button
              onClick={onRdvOpen}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 24px', borderRadius: DS.r2,
                background: 'transparent', border: `1px solid ${DS.border}`,
                color: DS.gray3, fontFamily: FONTS.body, fontSize: '.92rem',
                cursor: 'pointer', transition: 'all .22s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${DS.lime}44`; e.currentTarget.style.color = DS.white }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.gray3 }}
            >
              <IconPhone /> Prendre un RDV
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .8 }}
            style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .85 + i * .08 }}
              >
                <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: '2rem', color: DS.lime, lineHeight: 1 }}>
                  <Counter target={s.value} />
                </div>
                <div style={{ fontFamily: FONTS.mono, fontSize: '.65rem', color: DS.gray2, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Colonne droite — cartes info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Services highlights */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: .4, duration: .65, ease: [.22, 1, .36, 1] }}
            style={{
              background: DS.surface, border: `1px solid ${DS.border}`,
              borderRadius: DS.r3, padding: '1.5rem', overflow: 'hidden'
            }}
          >
            <div style={{ fontFamily: FONTS.mono, fontSize: '.62rem', color: DS.gray2, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
              Nos domaines
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SERVICES_HIGHLIGHTS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: .5 + i * .08 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: DS.r2,
                    background: DS.s2, border: `1px solid ${DS.border}`
                  }}
                >
                  <span style={{ color: DS.lime, flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontFamily: FONTS.body, fontSize: '.85rem', color: DS.gray3 }}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Carte projet récent */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: .55, duration: .65, ease: [.22, 1, .36, 1] }}
            style={{
              background: DS.surface, border: `1px solid ${DS.border}`,
              borderRadius: DS.r3, padding: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.85rem' }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: '.62rem', color: DS.gray2, letterSpacing: '.12em', textTransform: 'uppercase' }}>3 logiciels opérationnels</div>
              <div style={{ padding: '2px 8px', borderRadius: 4, background: `${DS.lime}18`, border: `1px solid ${DS.lime}33`, fontFamily: FONTS.mono, fontSize: '.58rem', color: DS.lime, letterSpacing: '.08em' }}>DISPONIBLES</div>
            </div>
            {[
              { nom: 'ElectroShop Pro v2.6', desc: 'Boutique · Caisse · Stock', color: '#FF8C00' },
              { nom: 'GestLoc v4', desc: 'Locatif · Contrats · Relances', color: '#00C896' },
              { nom: 'GestMag v3.0.0', desc: 'Équipements · QR Code · Emprunts', color: '#3D7EFF' },
            ].map((soft, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 2 ? `1px solid ${DS.border}` : 'none' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: soft.color, flexShrink: 0, boxShadow: `0 0 6px ${soft.color}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: '.82rem', color: DS.white }}>{soft.nom}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: '.62rem', color: DS.gray2 }}>{soft.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Carte disponibilité */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: .65, duration: .65 }}
            style={{
              background: DS.surface, border: `1px solid ${DS.border}`,
              borderRadius: DS.r3, padding: '1.1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.span
                animate={{ opacity: [1, .3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: DS.green, flexShrink: 0 }}
              />
              <span style={{ fontFamily: FONTS.mono, fontSize: '.7rem', color: DS.gray3 }}>Disponible pour nouveaux projets</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, color: DS.gray2 }}>
              <IconClock />
              <span style={{ fontFamily: FONTS.mono, fontSize: '.65rem' }}>Réponse &lt; 24h</span>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: 'absolute', bottom: '2.5rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 3
        }}
      >
        <span style={{ fontFamily: FONTS.mono, fontSize: '.6rem', color: DS.gray, letterSpacing: '.14em', textTransform: 'uppercase' }}>Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${DS.lime}, transparent)` }}
        />
      </motion.div>

      {/* Ticker de services */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
        overflow: 'hidden', borderTop: `1px solid ${DS.border}`,
        padding: '11px 0', background: DS.bg2
      }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', whiteSpace: 'nowrap' }}
        >
          {[...Array(4)].flatMap(() => [
            'Développement Web', 'Applications Mobiles', 'Logiciels Métier',
            'Design UI/UX', 'Maintenance IT', 'Solutions PME', 'Applications Mobiles', 'Développement Web'
          ]).map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '0 1.75rem' }}>
              <span style={{ fontFamily: FONTS.body, fontSize: '.78rem', fontWeight: 500, letterSpacing: '.06em', color: DS.gray }}>{item}</span>
              <span style={{ color: `${DS.lime}40`, fontSize: '.5rem' }}>◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; padding-top: 3rem !important; }
          .hero-grid > div:last-child { display: none; }
        }
      `}</style>
    </section>
  )
}
