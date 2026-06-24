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
            <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
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
            <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
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
