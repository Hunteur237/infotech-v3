import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DS } from '../lib/design.js'
import { useAuth } from '../lib/auth.jsx'
import { myAccountService } from '../lib/supabase.js'

const TABS = [
  { id: 'orders', label: 'Mes commandes' },
  { id: 'quotes', label: 'Mes devis' },
  { id: 'rdv', label: 'Mes rendez-vous' },
]

const fmtDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
const fmtFCFA = n => Number(n || 0).toLocaleString('fr-FR') + ' FCFA'

function Badge({ label, tone = 'info' }) {
  const colors = {
    ok: { c: DS.lime, bg: `${DS.lime}1a` },
    warn: { c: '#FBBF24', bg: '#FBBF2422' },
    danger: { c: '#F87171', bg: '#F8717122' },
    info: { c: DS.gray2, bg: `${DS.gray2}22` },
  }[tone]
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.65rem', fontFamily: "'Azeret Mono', monospace", color: colors.c, background: colors.bg, whiteSpace: 'nowrap' }}>{label}</span>
}

const orderTone = s => ({ 'livré': 'ok', 'confirmé': 'ok', 'expédié': 'info', 'annulé': 'danger' }[s] || 'warn')
const quoteTone = s => ({ 'confirmé': 'ok', 'annulé': 'danger' }[s] || 'warn')
const rdvTone = s => ({ 'confirmé': 'ok', 'annulé': 'danger', 'effectué': 'ok' }[s] || 'warn')

export default function Compte() {
  const { user, profile, signOut } = useAuth()
  const [tab, setTab] = useState('orders')
  const [data, setData] = useState({ orders: [], quotes: [], rdv: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    Promise.all([
      myAccountService.getOrders(user.id).catch(() => []),
      myAccountService.getQuotes(user.id).catch(() => []),
      myAccountService.getAppointments(user.id).catch(() => []),
    ]).then(([orders, quotes, rdv]) => setData({ orders, quotes, rdv })).finally(() => setLoading(false))
  }, [user])

  const cardStyle = { background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: 14, padding: '1.25rem 1.4rem', marginBottom: 12 }

  return (
    <div style={{ minHeight: '80vh', paddingTop: 96, paddingBottom: 60, maxWidth: 900, margin: '0 auto', padding: '96px 1.5rem 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: DS.white, fontFamily: "'Archivo Black', sans-serif", fontSize: '1.6rem', marginBottom: 4 }}>
            Bonjour {profile?.full_name?.split(' ')[0] || ''} 👋
          </h1>
          <p style={{ color: DS.gray2, fontSize: '.82rem', fontFamily: "'Azeret Mono', monospace" }}>{user?.email}</p>
        </div>
        <button onClick={signOut} style={{ padding: '9px 16px', background: 'none', border: `1px solid ${DS.border}`, borderRadius: 10, color: DS.gray2, cursor: 'pointer', fontFamily: "'Azeret Mono', monospace", fontSize: '.78rem' }}>
          Se déconnecter
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', background: DS.bg2, borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t.id ? DS.lime : 'transparent', color: tab === t.id ? DS.bg : DS.gray2,
              fontFamily: "'Archivo Black', sans-serif", fontSize: '.72rem', whiteSpace: 'nowrap',
            }}
          >{t.label} {data[t.id === 'rdv' ? 'rdv' : t.id]?.length > 0 && `(${data[t.id === 'rdv' ? 'rdv' : t.id].length})`}</button>
        ))}
      </div>

      {loading && <p style={{ color: DS.gray2, fontFamily: "'Azeret Mono', monospace", fontSize: '.85rem' }}>Chargement...</p>}

      {!loading && tab === 'orders' && (
        data.orders.length === 0
          ? <Empty text="Aucune commande pour le moment." cta="Voir la boutique" href="/boutique" />
          : data.orders.map(o => (
            <motion.div key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: DS.gray2, fontSize: '.7rem', fontFamily: "'Azeret Mono', monospace" }}>Commande #{o.id.slice(0, 8)} · {fmtDate(o.created_at)}</span>
                <Badge label={o.status} tone={orderTone(o.status)} />
              </div>
              <div style={{ color: DS.white, fontSize: '.85rem', marginBottom: 6 }}>
                {Array.isArray(o.items) ? o.items.map(i => `${i.name} × ${i.qty}`).join(', ') : ''}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: DS.lime, fontWeight: 700 }}>{fmtFCFA(o.total)}</span>
                {o.payment_method === 'mobile_money' && <Badge label={o.payment_status === 'payé' ? 'Payé' : 'Paiement en attente'} tone={o.payment_status === 'payé' ? 'ok' : 'warn'} />}
              </div>
            </motion.div>
          ))
      )}

      {!loading && tab === 'quotes' && (
        data.quotes.length === 0
          ? <Empty text="Aucune demande de devis pour le moment." cta="Demander un devis" href="/devis" />
          : data.quotes.map(q => (
            <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: DS.gray2, fontSize: '.7rem', fontFamily: "'Azeret Mono', monospace" }}>{fmtDate(q.created_at)}</span>
                <Badge label={q.status || 'nouveau'} tone={quoteTone(q.status)} />
              </div>
              <div style={{ color: DS.white, fontSize: '.95rem', fontWeight: 600, marginBottom: 4 }}>{q.project_type}</div>
              <div style={{ color: DS.lime, fontWeight: 700 }}>{fmtFCFA(q.estimated_total)} <span style={{ color: DS.gray2, fontWeight: 400, fontSize: '.75rem' }}>estimation</span></div>
            </motion.div>
          ))
      )}

      {!loading && tab === 'rdv' && (
        data.rdv.length === 0
          ? <Empty text="Aucun rendez-vous pour le moment." cta="Prendre un RDV" href="/" />
          : data.rdv.map(r => (
            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: DS.gray2, fontSize: '.7rem', fontFamily: "'Azeret Mono', monospace" }}>{fmtDate(r.created_at)}</span>
                <Badge label={r.status || 'en_attente'} tone={rdvTone(r.status)} />
              </div>
              <div style={{ color: DS.white, fontSize: '.95rem', fontWeight: 600, marginBottom: 4 }}>{r.subject || 'Rendez-vous'}</div>
              <div style={{ color: DS.lime, fontSize: '.82rem' }}>{r.day} à {r.slot}</div>
            </motion.div>
          ))
      )}
    </div>
  )
}

function Empty({ text, cta, href }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: DS.gray2 }}>
      <p style={{ fontSize: '.85rem', marginBottom: 16, fontFamily: "'Azeret Mono', monospace" }}>{text}</p>
      <a href={href} style={{ color: DS.lime, fontSize: '.85rem', fontFamily: "'Archivo Black', sans-serif", textDecoration: 'none' }}>{cta} →</a>
    </div>
  )
}
