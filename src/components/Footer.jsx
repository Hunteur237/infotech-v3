import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DS, FONTS } from '../lib/design.js'

// Icônes SVG
const IconPhone   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.2C.01.68.42.05.97.01A2 2 0 013 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
const IconMail    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IconMapPin  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconClock   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconFb      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
const IconLinkedin= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
const IconWa      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>

const NAV_LINKS = [
  { label: 'Accueil',      to: '/' },
  { label: 'Services',     to: '/services' },
  { label: 'Logiciels PME',to: '/portfolio' },
  { label: 'Boutique IT',  to: '/boutique' },
  { label: 'Blog',         to: '/blog' },
  { label: 'Contact',      to: '/contact' },
]

const SERVICES_LINKS = [
  'Développement Web', 'Applications Mobiles', 'Logiciels Métier',
  'Design UI/UX', 'Maintenance IT', 'Assistance Informatique',
]

const CONTACTS = [
  { icon: <IconPhone />,  label: 'Téléphone',  value: '+237 683 421 271', href: 'tel:+237683421271' },
  { icon: <IconWa />,     label: 'WhatsApp',   value: '+237 683 421 271', href: 'https://wa.me/237683421271' },
  { icon: <IconMail />,   label: 'Email',      value: 'contact@infotech.cm', href: 'mailto:contact@infotech.cm' },
  { icon: <IconMapPin />, label: 'Adresse',    value: 'Douala, Cameroun' },
  { icon: <IconClock />,  label: 'Horaires',   value: 'Lun – Sam · 8h – 18h' },
]

const SOCIALS = [
  { icon: <IconFb />,       href: '#',                               label: 'Facebook' },
  { icon: <IconLinkedin />, href: '#',                               label: 'LinkedIn' },
  { icon: <IconWa />,       href: 'https://wa.me/237683421271',     label: 'WhatsApp' },
]

export default function Footer({ onAdminOpen }) {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: DS.bg2, borderTop: `1px solid ${DS.border}` }}>

      {/* Bande principale */}
      <div style={{ maxWidth: 1680, width: '100%', margin: '0 auto', padding: '4rem clamp(1.25rem,4vw,3.5rem) 3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr 1.1fr',
          gap: '3rem', marginBottom: '3.5rem',
          paddingBottom: '3.5rem', borderBottom: `1px solid ${DS.border}`
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem', textDecoration: 'none' }}>
              <img
                src="/logo.svg"
                alt="INFO-TECH logo"
                width={38}
                height={38}
                style={{ borderRadius: 8, display: 'block', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: '1.05rem', letterSpacing: '.04em', color: DS.white, lineHeight: 1 }}>
                  INFO<span style={{ color: DS.lime }}>.</span>TECH
                </div>
                <div style={{ fontFamily: FONTS.mono, fontSize: '.55rem', color: DS.gray2, letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 2 }}>Solutions Numériques</div>
              </div>
            </Link>

            <p style={{ fontFamily: FONTS.body, fontSize: '.875rem', color: DS.gray2, lineHeight: 1.8, maxWidth: 290, fontWeight: 300, marginBottom: '1.5rem' }}>
              Partenaire tech des PME camerounaises depuis 2016. Développement, design, maintenance et vente de matériel informatique à Douala.
            </p>

            {/* Réseaux sociaux */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: DS.r,
                    border: `1px solid ${DS.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: DS.gray2, transition: 'all .2s', textDecoration: 'none'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${DS.lime}44`; e.currentTarget.style.color = DS.lime; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.gray2; e.currentTarget.style.transform = 'none' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Statut serveur */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <motion.span
                animate={{ opacity: [1, .2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: DS.green, flexShrink: 0 }}
              />
              <span style={{ fontFamily: FONTS.mono, fontSize: '.65rem', color: DS.gray2 }}>Serveur opérationnel</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: '.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.14em', color: DS.gray3, marginBottom: '1.1rem' }}>
              Navigation
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {NAV_LINKS.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{ fontFamily: FONTS.body, fontSize: '.875rem', color: DS.gray2, textDecoration: 'none', transition: 'color .2s, padding-left .2s', display: 'block', fontWeight: 300 }}
                    onMouseEnter={e => { e.currentTarget.style.color = DS.lime; e.currentTarget.style.paddingLeft = '4px' }}
                    onMouseLeave={e => { e.currentTarget.style.color = DS.gray2; e.currentTarget.style.paddingLeft = '0' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: '.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.14em', color: DS.gray3, marginBottom: '1.1rem' }}>
              Services
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SERVICES_LINKS.map(l => (
                <li key={l}>
                  <Link
                    to="/services"
                    style={{ fontFamily: FONTS.body, fontSize: '.875rem', color: DS.gray2, textDecoration: 'none', transition: 'color .2s', display: 'block', fontWeight: 300 }}
                    onMouseEnter={e => e.currentTarget.style.color = DS.lime}
                    onMouseLeave={e => e.currentTarget.style.color = DS.gray2}
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: '.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.14em', color: DS.gray3, marginBottom: '1.1rem' }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CONTACTS.map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <span style={{ color: DS.lime, marginTop: 2, flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: '.58rem', color: DS.gray, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 1 }}>{c.label}</div>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{ fontFamily: FONTS.body, fontSize: '.82rem', color: DS.gray3, textDecoration: 'none', fontWeight: 500, transition: 'color .2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = DS.lime}
                        onMouseLeave={e => e.currentTarget.style.color = DS.gray3}
                      >{c.value}</a>
                    ) : (
                      <span style={{ fontFamily: FONTS.body, fontSize: '.82rem', color: DS.gray3, fontWeight: 500 }}>{c.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bas de footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: '.7rem', color: DS.gray, letterSpacing: '.04em' }}>
            © {year} INFO-TECH SARL. Tous droits réservés. Douala, Cameroun.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Mentions légales', 'CGV', 'Confidentialité'].map(l => (
              <a key={l} href="#" style={{ fontFamily: FONTS.mono, fontSize: '.68rem', color: DS.gray, textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = DS.gray3}
                onMouseLeave={e => e.currentTarget.style.color = DS.gray}
              >{l}</a>
            ))}
            <button
              onClick={onAdminOpen}
              style={{ fontFamily: FONTS.mono, fontSize: '.65rem', color: DS.gray, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.06em', transition: 'color .2s', padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = DS.gray3}
              onMouseLeave={e => e.currentTarget.style.color = DS.gray}
            >
              [ADMIN]
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
