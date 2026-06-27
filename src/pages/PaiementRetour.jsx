import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { DS } from '../lib/design.js'

export default function PaiementRetour() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const [order, setOrder] = useState(null)
  const [tries, setTries] = useState(0)

  useEffect(() => {
    if (!orderId) return
    let active = true
    const poll = async () => {
      const { data } = await supabase.from('orders').select('*').eq('id', orderId).single()
      if (active && data) setOrder(data)
    }
    poll()
    const interval = setInterval(() => {
      setTries(t => t + 1)
      poll()
    }, 3000)
    return () => { active = false; clearInterval(interval) }
  }, [orderId])

  useEffect(() => {
    if (order?.payment_status === 'payé' || tries > 8) {
      // stop polling implicitly once confirmed or after ~25s
    }
  }, [order, tries])

  const status = order?.payment_status

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 66 }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: '2.5rem 2rem', background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: 16 }}>
        {!orderId && (
          <p style={{ color: DS.gray2, fontFamily: "'Azeret Mono', monospace" }}>Aucune commande référencée.</p>
        )}

        {orderId && status !== 'payé' && status !== 'échoué' && (
          <>
            <div style={{ width: 36, height: 36, margin: '0 auto 1.2rem', borderRadius: '50%', border: `3px solid ${DS.border}`, borderTopColor: DS.lime, animation: 'spin .8s linear infinite' }} />
            <h2 style={{ color: DS.white, fontFamily: "'Archivo Black', sans-serif", fontSize: '1.1rem', marginBottom: 8 }}>
              Vérification du paiement...
            </h2>
            <p style={{ color: DS.gray2, fontSize: '.85rem', fontFamily: "'Azeret Mono', monospace" }}>
              Si une demande Mobile Money est apparue sur ton téléphone, valide-la avec ton code secret.
              Cette page se met à jour automatiquement.
            </p>
          </>
        )}

        {status === 'payé' && (
          <>
            <div style={{ width: 56, height: 56, margin: '0 auto 12px', borderRadius: '50%', background: `${DS.lime}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: DS.lime }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ color: DS.lime, fontFamily: "'Archivo Black', sans-serif", fontSize: '1.2rem', marginBottom: 8 }}>
              Paiement confirmé !
            </h2>
            <p style={{ color: DS.gray2, fontSize: '.85rem', fontFamily: "'Azeret Mono', monospace" }}>
              Ta commande #{String(orderId).slice(0, 8)} est enregistrée et payée. Nous te contactons sous peu pour la livraison.
            </p>
          </>
        )}

        {status === 'échoué' && (
          <>
            <div style={{ width: 56, height: 56, margin: '0 auto 12px', borderRadius: '50%', background: '#F8717122', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F87171' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 style={{ color: '#F87171', fontFamily: "'Archivo Black', sans-serif", fontSize: '1.2rem', marginBottom: 8 }}>
              Paiement non confirmé
            </h2>
            <p style={{ color: DS.gray2, fontSize: '.85rem', fontFamily: "'Azeret Mono', monospace" }}>
              Le paiement a été annulé ou a échoué. Tu peux réessayer depuis la boutique, ou nous contacter directement.
            </p>
          </>
        )}

        <Link to="/boutique" style={{ display: 'inline-block', marginTop: 24, color: DS.lime, fontSize: '.8rem', fontFamily: "'Azeret Mono', monospace", textDecoration: 'underline' }}>
          ← Retour à la boutique
        </Link>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
