// /api/monetbil-notify.js
// Monetbil appelle cette URL côté serveur après une tentative de paiement.
// On revérifie le statut auprès de Monetbil (checkPayment) avant de mettre à jour la commande,
// pour ne jamais faire confiance à une notification non vérifiée.

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const body = { ...(req.query || {}), ...(req.body || {}) };
    const paymentId = body.paymentId || body.transaction_id || body.payment_ref;
    const orderId = body.item_ref;

    if (!orderId) {
      return res.status(200).json({ received: true, note: "item_ref manquant, rien à mettre à jour" });
    }

    let isPaid = false;

    // Revérification du statut auprès de Monetbil (sécurité anti-spoof)
    if (paymentId) {
      try {
        const checkResp = await fetch("https://api.monetbil.com/payment/v1/checkPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });
        const checkData = await checkResp.json();
        const status = checkData?.transaction?.status;
        isPaid = Number(status) === 1;
      } catch (e) {
        console.error("monetbil checkPayment error:", e);
      }
    }

    // Si la vérification API n'a pas pu confirmer, on retombe sur le statut direct envoyé par Monetbil
    if (!isPaid && (body.status === "1" || body.status === 1)) {
      isPaid = true;
    }

    await supabase
      .from("orders")
      .update({
        payment_status: isPaid ? "payé" : "échoué",
        transaction_id: paymentId || null,
        status: isPaid ? "confirmé" : "en_attente",
      })
      .eq("id", orderId);

    return res.status(200).json({ received: true, paid: isPaid });
  } catch (e) {
    console.error("monetbil-notify error:", e);
    // On répond 200 quand même pour éviter que Monetbil ne réessaie en boucle sur une erreur de notre côté
    return res.status(200).json({ received: true, error: true });
  }
}
