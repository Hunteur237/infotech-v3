import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DS, FONTS } from '../lib/design.js'
import { RDV_SLOTS } from '../lib/data.js'
import { appointmentsService } from '../lib/supabase.js'
import { notify } from '../lib/notify.js'
import { useToast, Spinner } from './UI.jsx'

const IconCalendar = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>

export default function RDVModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [day, setDay] = useState(null)
  const [slot, setSlot] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', subject: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const toast = useToast()
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    if (!open) setTimeout(() => {
      setStep(1); setDay(null); setSlot(null); setDone(false)
      setForm({ name: '', phone: '', subject: '' })
    }, 400)
  }, [open])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const confirm = async () => {
    if (!form.name || !form.phone) { toast('Nom et téléphone requis', 'warn'); return }
    setLoading(true)
    try { await appointmentsService.insert({ name: form.name, phone: form.phone, subject: form.subject, day, slot }); notify('rdv', { name: form.name, phone: form.phone, subject: form.subject, day, slot, email: form.email }) }
    catch (e) { console.error('RDV insert error:', e) }
    setLoading(false); setDone(true); toast('RDV confirmé !')
    setTimeout(() => onClose(), 3500)
  }

  const inp = {
    width: '100%', padding: '10px 14px', background: DS.bg2,
    border: `1px solid ${DS.border}`, borderRadius: DS.r, color: DS.white,
    fontFamily: FONTS.body, fontSize: '.88rem', outline: 'none', transition: 'border-color .2s'
  }
  const focus = e => e.target.style.borderColor = DS.lime
  const blur = e => e.target.style.borderColor = DS.border

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 950,
            background: 'rgba(5,7,15,.92)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: .95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: .97 }}
            transition={{ duration: .45, ease: [.22, 1, .36, 1] }}
            style={{
              background: DS.surface, border: `1px solid ${DS.border}`,
              borderRadius: DS.r4, width: '100%', maxWidth: 560,
              position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: `1px solid ${DS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: FONTS.mono, fontSize: '.62rem', color: DS.lime, letterSpacing: '.12em', marginBottom: '.25rem' }}>// rendez-vous.en-ligne</div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: '1.15rem', color: DS.white }}>Réservez un appel découverte</div>
              </div>
              <motion.button onClick={onClose} whileHover={{ rotate: 90, scale: 1.1 }} style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${DS.border}`, background: 'none', color: DS.gray2, cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</motion.button>
            </div>

            {/* Progress bar */}
            <div style={{ padding: '1rem 2rem', borderBottom: `1px solid ${DS.border}`, display: 'flex', gap: '.5rem' }}>
              {[1, 2, 3].map(s => (
                <motion.div key={s} animate={{ background: step >= s ? DS.lime : DS.border }} transition={{ duration: .3 }} style={{ flex: 1, height: 3, borderRadius: 2 }} />
              ))}
            </div>

            {/* Content */}
            {done ? (
              <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={{ width: 68, height: 68, borderRadius: '50%', background: `${DS.lime}15`, border: `2px solid ${DS.lime}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.6rem', color: DS.lime }}>✓</motion.div>
                <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: '1.4rem', color: DS.white, marginBottom: '.5rem' }}>RDV Confirmé !</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: '.78rem', color: DS.lime, marginBottom: '.75rem' }}>{day} à {slot}</div>
                <p style={{ fontFamily: FONTS.body, color: DS.gray3, fontSize: '.88rem', lineHeight: 1.7 }}>Appel de 30 minutes. Confirmation sur WhatsApp.</p>
              </motion.div>
            ) : (
              <div style={{ padding: '1.5rem 2rem 2rem' }}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
                      <div style={{ fontFamily: FONTS.body, fontWeight: 600, color: DS.white, marginBottom: '1rem' }}>Choisissez une date</div>
                      <div className="rg-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.6rem', marginBottom: '1.5rem' }}>
                        {Object.keys(RDV_SLOTS).map(d => (
                          <motion.button key={d} onClick={() => setDay(d)} whileTap={{ scale: .96 }} style={{ padding: '.85rem .6rem', borderRadius: DS.r2, border: `1px solid ${day === d ? DS.lime + '66' : DS.border}`, background: day === d ? `${DS.lime}12` : DS.bg2, color: day === d ? DS.white : DS.gray2, fontFamily: FONTS.body, fontSize: '.82rem', fontWeight: 600, cursor: 'none', transition: 'all .18s' }}>{d}</motion.button>
                        ))}
                      </div>
                      <motion.button onClick={() => day && setStep(2)} whileTap={{ scale: .97 }} style={{ width: '100%', padding: '12px', borderRadius: DS.r2, background: day ? DS.lime : DS.border, color: day ? DS.bg : DS.gray, fontFamily: FONTS.display, fontWeight: 700, fontSize: '.9rem', border: 'none', cursor: 'none', transition: 'all .2s' }}>Continuer →</motion.button>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
                      <div style={{ fontFamily: FONTS.body, fontWeight: 600, color: DS.white, marginBottom: '1rem' }}>Horaire — <span style={{ color: DS.lime }}>{day}</span></div>
                      <div className="rg-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem', marginBottom: '1.5rem' }}>
                        {RDV_SLOTS[day]?.map(t => (
                          <motion.button key={t} onClick={() => setSlot(t)} whileTap={{ scale: .94 }} style={{ padding: '.7rem .5rem', borderRadius: DS.r, border: `1px solid ${slot === t ? DS.lime + '66' : DS.border}`, background: slot === t ? `${DS.lime}12` : DS.bg2, color: slot === t ? DS.lime : DS.gray2, fontFamily: FONTS.mono, fontSize: '.82rem', cursor: 'none', transition: 'all .18s' }}>{t}</motion.button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '.75rem' }}>
                        <motion.button onClick={() => setStep(1)} whileTap={{ scale: .97 }} style={{ padding: '12px 20px', borderRadius: DS.r2, background: 'transparent', border: `1px solid ${DS.border}`, color: DS.gray2, fontFamily: FONTS.body, fontSize: '.88rem', cursor: 'none' }}>← Retour</motion.button>
                        <motion.button onClick={() => slot && setStep(3)} whileTap={{ scale: .97 }} style={{ flex: 1, padding: '12px', borderRadius: DS.r2, background: slot ? DS.lime : DS.border, color: slot ? DS.bg : DS.gray, fontFamily: FONTS.display, fontWeight: 700, fontSize: '.9rem', border: 'none', cursor: 'none', transition: 'all .2s' }}>Continuer →</motion.button>
                      </div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
                      <div style={{ fontFamily: FONTS.body, fontWeight: 600, color: DS.white, marginBottom: '1rem' }}>Vos informations</div>
                      <div style={{ background: `${DS.lime}08`, border: `1px solid ${DS.lime}22`, borderRadius: DS.r2, padding: '.8rem 1rem', marginBottom: '1.25rem', fontFamily: FONTS.mono, fontSize: '.72rem', color: DS.lime }}><IconCalendar />{day} à {slot} · Appel découverte 30 min · Gratuit</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '1.25rem' }}>
                        {[
                          { l: 'Nom complet *', k: 'name', ph: 'Votre nom' },
                          { l: 'Téléphone / WhatsApp *', k: 'phone', ph: '+237 6XX XXX XXX' },
                          { l: "Sujet de l'appel", k: 'subject', ph: 'Ex: Logiciel de caisse pour boutique' }
                        ].map(f => (
                          <div key={f.k}>
                            <label style={{ display: 'block', fontFamily: FONTS.mono, fontSize: '.6rem', color: DS.gray2, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.4rem' }}>{f.l}</label>
                            <input value={form[f.k]} onChange={set(f.k)} placeholder={f.ph} style={inp} onFocus={focus} onBlur={blur} />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '.75rem' }}>
                        <motion.button onClick={() => setStep(2)} whileTap={{ scale: .97 }} style={{ padding: '12px 20px', borderRadius: DS.r2, background: 'transparent', border: `1px solid ${DS.border}`, color: DS.gray2, fontFamily: FONTS.body, fontSize: '.88rem', cursor: 'none' }}>← Retour</motion.button>
                        <motion.button onClick={confirm} disabled={loading} whileTap={{ scale: .97 }} style={{ flex: 1, padding: '12px', borderRadius: DS.r2, background: DS.lime, color: DS.bg, fontFamily: FONTS.display, fontWeight: 700, fontSize: '.9rem', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          {loading ? <><Spinner size={14} color={DS.bg} />Confirmation...</> : 'Confirmer le RDV'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
