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

export default function CompteConnexion() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setError(''); setMsg('')
    if (!form.email || (mode !== 'reset' && !form.password)) { setError('Merci de remplir tous les champs.'); return }
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password)
        navigate('/compte')
      } else if (mode === 'signup') {
        if (!form.name.trim()) { setError('Ton nom est requis.'); setLoading(false); return }
        await signUp(form.email, form.password, form.name.trim())
        navigate('/compte')
      } else {
        await authService.resetPassword(form.email)
        setMsg('Un email de réinitialisation a été envoyé si ce compte existe.')
      }
    } catch (e) {
      setError(e.message?.includes('Invalid login') ? 'Email ou mot de passe incorrect.' : (e.message || 'Une erreur est survenue.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingBottom: 40 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 420, width: '100%', margin: '0 1.5rem', background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: 18, padding: '2.25rem 2rem' }}>

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
          {mode === 'login' ? 'Retrouve tes commandes, devis et rendez-vous.' : mode === 'signup' ? 'Suis facilement tes commandes, devis et rendez-vous.' : 'On t\'envoie un lien pour le réinitialiser.'}
        </p>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {mode === 'signup' && (
              <input style={inputStyle} placeholder="Nom complet" value={form.name} onChange={set('name')} />
            )}
            <input style={inputStyle} type="email" placeholder="Email" value={form.email} onChange={set('email')} />
            {mode !== 'reset' && (
              <input style={inputStyle} type="password" placeholder="Mot de passe" value={form.password} onChange={set('password')} />
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
