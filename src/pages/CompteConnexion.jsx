import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { DS } from '../lib/design.js'
import { useAuth } from '../lib/auth.jsx'
import { authService } from '../lib/supabase.js'

const inputStyle = {
  width: '100%', padding: '12px 14px', marginBottom: 10,
  background: DS.bg, border: `1px solid ${DS.border}`, borderRadius: 10,
  color: DS.white, fontFamily: "'Azeret Mono', monospace", fontSize: '.85rem', outline: 'none',
  boxSizing: 'border-box',
}

const IconMail = () => <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>

function PasswordField({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input style={inputStyle} type={show ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={onChange} />
      <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 12, top: 11, background: 'none', border: 'none', color: DS.gray2, fontSize: '.65rem', cursor: 'pointer', fontFamily: "'Azeret Mono', monospace" }}>
        {show ? 'MASQUER' : 'VOIR'}
      </button>
    </div>
  )
}

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function CompteConnexion() {
  const { recoveryMode, updatePassword, clearRecoveryMode, signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [awaitingConfirm, setAwaitingConfirm] = useState(false)
  const [newPw, setNewPw] = useState('')
  const navigate = useNavigate()
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  // ─── Écran : lien de réinitialisation cliqué → choisir un nouveau mot de passe ───
  if (recoveryMode) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 420, width: '100%', margin: '0 1.5rem', background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: 18, padding: '2.25rem 2rem' }}>
          <h1 style={{ color: DS.white, fontFamily: "'Archivo Black', sans-serif", fontSize: '1.2rem', marginBottom: 6 }}>Nouveau mot de passe</h1>
          <p style={{ color: DS.gray2, fontSize: '.8rem', marginBottom: '1.25rem', fontFamily: "'Azeret Mono', monospace" }}>Choisis un mot de passe pour ton compte.</p>
          <PasswordField value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Nouveau mot de passe" />
          {error && <div style={{ color: '#F87171', fontSize: '.75rem', margin: '4px 0 10px', fontFamily: "'Azeret Mono', monospace" }}>{error}</div>}
          <motion.button whileTap={{ scale: 0.97 }} disabled={loading}
            onClick={async () => {
              if (newPw.length < 6) { setError('6 caractères minimum.'); return }
              setLoading(true); setError('')
              try { await updatePassword(newPw); clearRecoveryMode(); navigate('/compte') }
              catch (e) { setError(e.message || 'Erreur, réessaie.') }
              finally { setLoading(false) }
            }}
            style={{ width: '100%', padding: '13px', background: DS.lime, color: DS.bg, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: '.85rem', opacity: loading ? .7 : 1 }}
          >{loading ? 'Patience...' : 'Enregistrer →'}</motion.button>
        </motion.div>
      </div>
    )
  }

  // ─── Écran : on attend la confirmation email après inscription ───
  if (awaitingConfirm) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 440, width: '100%', margin: '0 1.5rem', textAlign: 'center', background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: 18, padding: '2.5rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${DS.lime}1a`, color: DS.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <IconMail />
          </div>
          <h1 style={{ color: DS.white, fontFamily: "'Archivo Black', sans-serif", fontSize: '1.2rem', marginBottom: 10 }}>Vérifie ta boîte mail</h1>
          <p style={{ color: DS.gray2, fontSize: '.82rem', marginBottom: '1.5rem', fontFamily: "'Azeret Mono', monospace", lineHeight: 1.6 }}>
            Un email de confirmation a été envoyé à <span style={{ color: DS.white }}>{form.email}</span>.
            Clique sur le lien pour activer ton compte.
          </p>
          {msg && <div style={{ color: DS.lime, fontSize: '.75rem', marginBottom: 14, fontFamily: "'Azeret Mono', monospace" }}>{msg}</div>}
          <button
            onClick={async () => { try { await authService.resendConfirmation(form.email); setMsg("Email renvoyé !") } catch (e) { setMsg(e.message) } }}
            style={{ background: 'none', border: `1px solid ${DS.border}`, borderRadius: 10, padding: '10px 18px', color: DS.gray2, fontSize: '.78rem', cursor: 'pointer', fontFamily: "'Azeret Mono', monospace" }}
          >Renvoyer l'email</button>
          <div style={{ marginTop: 18 }}>
            <button onClick={() => { setAwaitingConfirm(false); setMode('login') }} style={{ background: 'none', border: 'none', color: DS.gray2, fontSize: '.72rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Azeret Mono', monospace" }}>
              ← Retour à la connexion
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const submit = async () => {
    setError(''); setMsg('')
    if (!form.email || (mode !== 'reset' && !form.password)) { setError('Merci de remplir tous les champs obligatoires.'); return }
    if (mode === 'signup') {
      if (!form.name.trim()) { setError('Ton nom est requis.'); return }
      if (!form.phone.trim()) { setError('Ton numéro de téléphone est requis.'); return }
      if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
      if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    }
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password)
        navigate('/compte')
      } else if (mode === 'signup') {
        const data = await signUp(form.email, form.password, form.name.trim(), form.phone.trim())
        if (data?.session) navigate('/compte') // confirmation email désactivée côté Supabase
        else setAwaitingConfirm(true)
      } else {
        await authService.resetPassword(form.email)
        setMsg('Si ce compte existe, un email de réinitialisation a été envoyé.')
      }
    } catch (e) {
      const m = e.message || ''
      if (m.includes('Invalid login')) setError('Email ou mot de passe incorrect.')
      else if (m.includes('already registered') || m.includes('already been registered')) setError('Un compte existe déjà avec cet email.')
      else setError(m || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const pwStrength = strength(form.password)
  const strengthLabel = ['Très faible', 'Faible', 'Correct', 'Bon', 'Excellent'][pwStrength]
  const strengthColor = ['#F87171', '#F87171', '#FBBF24', DS.lime, DS.lime][pwStrength]

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingBottom: 40 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 440, width: '100%', margin: '0 1.5rem', background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: 18, padding: '2.25rem 2rem' }}>

        <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', background: DS.bg, borderRadius: 10, padding: 4 }}>
          {[['login', 'Connexion'], ['signup', 'Créer un compte']].map(([id, label]) => (
            <button key={id} onClick={() => { setMode(id); setError(''); setMsg('') }}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: mode === id ? DS.lime : 'transparent', color: mode === id ? DS.bg : DS.gray2,
                fontFamily: "'Archivo Black', sans-serif", fontSize: '.72rem', letterSpacing: '.02em',
                transition: 'all .2s',
              }}
            >{label}</button>
          ))}
        </div>

        <h1 style={{ color: DS.white, fontFamily: "'Archivo Black', sans-serif", fontSize: '1.3rem', marginBottom: 6 }}>
          {mode === 'login' ? 'Mon espace client' : mode === 'signup' ? 'Créer mon compte' : 'Mot de passe oublié'}
        </h1>
        <p style={{ color: DS.gray2, fontSize: '.8rem', marginBottom: '1.25rem', fontFamily: "'Azeret Mono', monospace" }}>
          {mode === 'login' ? 'Retrouve tes commandes, devis et rendez-vous.' : mode === 'signup' ? 'Suis facilement tes commandes, devis et rendez-vous.' : "On t'envoie un lien pour le réinitialiser."}
        </p>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {mode === 'signup' && (
              <>
                <input style={inputStyle} placeholder="Nom complet *" value={form.name} onChange={set('name')} />
                <input style={inputStyle} type="tel" placeholder="Téléphone (Mobile Money) *" value={form.phone} onChange={set('phone')} />
              </>
            )}
            <input style={inputStyle} type="email" placeholder="Email *" value={form.email} onChange={set('email')} />
            {mode !== 'reset' && (
              <>
                <PasswordField value={form.password} onChange={set('password')} placeholder="Mot de passe *" />
                {mode === 'signup' && form.password && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 10px' }}>
                    <div style={{ flex: 1, height: 4, background: DS.bg, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(pwStrength / 4) * 100}%`, background: strengthColor, transition: 'all .2s' }} />
                    </div>
                    <span style={{ fontSize: '.62rem', color: strengthColor, fontFamily: "'Azeret Mono', monospace", whiteSpace: 'nowrap' }}>{strengthLabel}</span>
                  </div>
                )}
                {mode === 'signup' && (
                  <PasswordField value={form.confirm} onChange={set('confirm')} placeholder="Confirmer le mot de passe *" />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <div style={{ color: '#F87171', fontSize: '.75rem', marginBottom: 10, fontFamily: "'Azeret Mono', monospace" }}>{error}</div>}
        {msg && <div style={{ color: DS.lime, fontSize: '.75rem', marginBottom: 10, fontFamily: "'Azeret Mono', monospace" }}>{msg}</div>}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%', padding: '13px', background: DS.lime, color: DS.bg, border: 'none',
            borderRadius: 10, cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: '.85rem',
            opacity: loading ? .7 : 1, marginTop: 4,
          }}
        >
          {loading ? 'Patience...' : mode === 'login' ? 'Se connecter →' : mode === 'signup' ? 'Créer mon compte →' : 'Envoyer le lien →'}
        </motion.button>

        {mode === 'login' && (
          <button onClick={() => { setMode('reset'); setError(''); setMsg('') }} style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', color: DS.gray2, fontSize: '.72rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Azeret Mono', monospace" }}>
            Mot de passe oublié ?
          </button>
        )}
        {mode === 'reset' && (
          <button onClick={() => { setMode('login'); setError(''); setMsg('') }} style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', color: DS.gray2, fontSize: '.72rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Azeret Mono', monospace" }}>
            ← Retour à la connexion
          </button>
        )}

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/" style={{ color: DS.gray2, fontSize: '.72rem', fontFamily: "'Azeret Mono', monospace", textDecoration: 'underline' }}>← Retour au site</Link>
        </div>
      </motion.div>
    </div>
  )
}
