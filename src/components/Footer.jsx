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
              <div style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', background: DS.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="200 380 850 560" xmlns="http://www.w3.org/2000/svg">
                  <rect x="253" y="390" width="19" height="95" fill="#0A0B10"/>
                  <path d="M144 390 L144 485 L163 485 L163 420 L253 485 L272 485 L272 390 L253 390 L253 455 L163 390 Z" fill="#0A0B10"/>
                  <path d="M584 390 L584 485 L603 485 L603 445 L674 445 L674 427 L603 427 L603 408 L674 408 L674 390 Z" fill="#0A0B10"/>
                  <path d="M840 390 Q880 390 900 415 Q920 440 920 437 Q920 460 900 475 Q880 490 840 490 Q800 490 780 475 Q760 460 760 437 Q760 414 780 402 Q800 390 840 390 Z M840 408 Q810 408 797 420 Q784 432 784 437 Q784 460 797 470 Q810 480 840 480 Q870 480 883 470 Q896 460 896 437 Q896 432 883 420 Q870 408 840 408 Z" fill="#0A0B10"/>
                  <rect x="144" y="510" width="870" height="5" fill="#0A0B10" opacity="0.3"/>
                  <path d="M144 530 L144 548 L257 548 L257 625 L276 625 L276 548 L390 548 L390 530 Z" fill="#0A0B10"/>
                  <path d="M410 530 L410 625 L600 625 L600 607 L429 607 L429 585 L580 585 L580 567 L429 567 L429 548 L600 548 L600 530 Z" fill="#0A0B10"/>
                  <path d="M860 530 Q820 530 798 550 Q776 570 776 577 Q776 605 798 615 Q820 625 860 625 Q900 625 920 610 L920 592 Q900 607 860 607 Q832 607 818 598 Q804 589 804 577 Q804 565 818 556 Q832 547 860 547 Q900 547 920 562 L920 544 Q900 530 860 530 Z" fill="#0A0B10"/>
                  <path d="M640 530 L640 625 L659 625 L659 585 L760 585 L760 625 L779 625 L779 530 L760 530 L760 567 L659 567 L659 530 Z" fill="#0A0B10"/>
                </svg>
              </div>
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
