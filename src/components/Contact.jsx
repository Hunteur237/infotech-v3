import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { DS, FONTS } from '../lib/design.js'
import { contactsService } from '../lib/supabase.js'
import { notify } from '../lib/notify.js'
import { Section, Container, Spinner, useToast } from './UI.jsx'

// Icônes SVG
const IconPhone   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.2C.01.68.42.05.97.01A2 2 0 013 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
const IconMail    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IconMapPin  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconClock   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconCheck   = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconSend    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
const IconWa      = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>

const CONTACT_ITEMS = [
  { icon: <IconPhone />,  label: 'Téléphone',  value: '+237 683 421 271',    href: 'tel:+237683421271' },
  { icon: <IconWa />,     label: 'WhatsApp',   value: '+237 683 421 271',    href: 'https://wa.me/237683421271?text=Bonjour%20INFO-TECH' },
  { icon: <IconMail />,   label: 'Email',      value: 'contact@infotech.cm', href: 'mailto:contact@infotech.cm' },
  { icon: <IconMapPin />, label: 'Adresse',    value: 'Douala, Cameroun' },
  { icon: <IconClock />,  label: 'Horaires',   value: 'Lun – Sam · 8h – 18h' },
]

const METRICS = [
  { value: '2h',    label: 'Urgence',     color: DS.red   },
  { value: '24h',   label: 'Devis',       color: DS.lime  },
  { value: '3 mois',label: 'Garantie',    color: DS.gold  },
  { value: '4.9/5', label: 'Satisfaction',color: DS.green },
]

const SERVICES_OPTS = ['','Développement Web','Application Mobile','Logiciel Métier','Design UI/UX','Maintenance IT','Assistance Informatique','Achat matériel']
const BUDGET_OPTS   = ['','Moins de 200K FCFA','200K – 500K FCFA','500K – 1 500K FCFA','Plus de 1 500K FCFA']

const inp = {
  width: '100%', padding: '10px 14px',
  background: DS.bg2, border: `1px solid ${DS.border}`,
  borderRadius: DS.r, color: DS.white,
  fontFamily: FONTS.body, fontSize: '.9rem',
  outline: 'none', transition: 'border-color .2s, box-shadow .2s'
}
const onFocus = e => { e.target.style.borderColor = DS.lime; e.target.style.boxShadow = `0 0 0 3px ${DS.lime}12` }
const onBlur  = e => { e.target.style.borderColor = DS.border; e.target.style.boxShadow = 'none' }

export default function ContactSection() {
  const [form, setForm]     = useState({ name: '', company: '', email: '', phone: '', service: '', budget: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const ref   = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handle = async () => {
    if (!form.name || !form.email || !form.service || !form.message) {
      toast('Remplissez les champs obligatoires (*)', 'warn'); return
    }
    setLoading(true)
    let ok = true
    try { await contactsService.insert(form); notify('contact', form) }
    catch (e) { console.error(e); ok = false }
    setLoading(false)
    if (ok) { setSent(true); toast('Message envoyé ! Réponse sous 24h.') }
    else toast('Erreur envoi — écrivez-nous directement.', 'warn')
  }

  const label = (text, required) => (
    <label style={{ display: 'block', fontFamily: FONTS.mono, fontSize: '.6rem', fontWeight: 500, color: DS.gray3, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.4rem' }}>
      {text}{required && <span style={{ color: DS.lime, marginLeft: 4 }}>*</span>}
    </label>
  )

  return (
    <Section id="contact" bg={DS.bg}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 55% 45% at 8% 60%, ${DS.lime}06, transparent)`, pointerEvents: 'none' }} />
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .6 }}
            style={{ marginBottom: '3.5rem' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: FONTS.mono, fontSize: '.65rem', color: DS.lime, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: '.85rem' }}>
              <span style={{ width: 24, height: 1, background: DS.lime }} />
              Démarrer un projet
            </div>
            <h2 style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', color: DS.white, lineHeight: 1.08, marginBottom: '.75rem' }}>
              Parlons de votre <span style={{ color: DS.lime }}>projet</span>
            </h2>
            <p style={{ fontFamily: FONTS.body, color: DS.gray3, fontSize: '.95rem', lineHeight: 1.75, maxWidth: 540, fontWeight: 400 }}>
              Devis gratuit sous 24h, sans engagement. Nous intervenons à Douala et à distance sur tout le Cameroun.
            </p>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.55fr', gap: '4rem', alignItems: 'start' }} className="contact-grid">

          {/* Colonne info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .6 }}
          >
            {/* Métriques */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: DS.border, borderRadius: DS.r2, overflow: 'hidden', border: `1px solid ${DS.border}`, marginBottom: '2rem' }}>
              {METRICS.map(m => (
                <div key={m.label} style={{ background: DS.surface, padding: '1.1rem .85rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: '1.45rem', color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: '.58rem', color: DS.gray2, textTransform: 'uppercase', letterSpacing: '.08em' }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Coordonnées */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CONTACT_ITEMS.map(c => (
                <div key={c.label} style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  background: DS.surface, border: `1px solid ${DS.border}`,
                  borderRadius: DS.r2, padding: '1rem 1.15rem'
                }}>
                  <span style={{
                    width: 38, height: 38, borderRadius: DS.r,
                    background: `${DS.lime}0C`, border: `1px solid ${DS.lime}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: DS.lime
                  }}>
                    {c.icon}
                  </span>
                  <div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: '.58rem', textTransform: 'uppercase', letterSpacing: '.1em', color: DS.gray, marginBottom: '.2rem' }}>{c.label}</div>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                        style={{ fontFamily: FONTS.body, fontSize: '.88rem', fontWeight: 600, color: DS.lime, textDecoration: 'none' }}>
                        {c.value}
                      </a>
                    ) : (
                      <div style={{ fontFamily: FONTS.body, fontSize: '.88rem', fontWeight: 500, color: DS.white }}>{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .6, delay: .12 }}
            style={{ background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: DS.r4, padding: '2.5rem' }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: '3.5rem 2rem' }}
              >
                <div style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: `${DS.lime}10`, border: `2px solid ${DS.lime}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', color: DS.lime
                }}>
                  <IconCheck />
                </div>
                <h3 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: '1.6rem', color: DS.white, marginBottom: '.6rem' }}>Message envoyé</h3>
                <p style={{ fontFamily: FONTS.body, color: DS.gray3, fontSize: '.9rem', lineHeight: 1.7 }}>Nous vous répondrons sous 24h ouvrées. À bientôt !</p>
              </motion.div>
            ) : (
              <>
                <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: '1.2rem', color: DS.white, marginBottom: '1.75rem', paddingBottom: '.75rem', borderBottom: `1px solid ${DS.border}` }}>
                  Envoyez votre message
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { l: 'Nom complet',  k: 'name',    ph: 'Votre nom',      req: true  },
                    { l: 'Entreprise',   k: 'company',  ph: 'Votre PME',      req: false },
                    { l: 'Email',        k: 'email',    ph: 'email@pme.cm',   req: true, type: 'email' },
                    { l: 'Téléphone',    k: 'phone',    ph: '+237 6XX XXX XXX', req: false },
                  ].map(f => (
                    <div key={f.k}>
                      {label(f.l, f.req)}
                      <input type={f.type||'text'} value={form[f.k]} onChange={set(f.k)} placeholder={f.ph} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    {label('Service souhaité', true)}
                    <select value={form.service} onChange={set('service')} style={{ ...inp, cursor: 'pointer', appearance: 'none' }} onFocus={onFocus} onBlur={onBlur}>
                      {SERVICES_OPTS.map(o => <option key={o} value={o}>{o || '— Choisir —'}</option>)}
                    </select>
                  </div>
                  <div>
                    {label('Budget estimé', false)}
                    <select value={form.budget} onChange={set('budget')} style={{ ...inp, cursor: 'pointer', appearance: 'none' }} onFocus={onFocus} onBlur={onBlur}>
                      {BUDGET_OPTS.map(o => <option key={o} value={o}>{o || '— Choisir —'}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  {label('Votre message', true)}
                  <textarea value={form.message} onChange={set('message')} rows={5} placeholder="Décrivez votre projet, vos besoins, vos délais..." style={{ ...inp, resize: 'vertical', minHeight: 120 }} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <button
                  onClick={handle}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px',
                    background: DS.lime, color: DS.bg,
                    border: 'none', borderRadius: DS.r2,
                    fontFamily: FONTS.body, fontWeight: 600, fontSize: '.92rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background .2s, transform .15s',
                    opacity: loading ? .7 : 1
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = DS.lime2; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = DS.lime; e.currentTarget.style.transform = 'none' }}
                >
                  {loading ? <><Spinner size={14} color={DS.bg} />Envoi en cours...</> : <><IconSend /> Envoyer le message</>}
                </button>
              </>
            )}
          </motion.div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </Section>
  )
}
