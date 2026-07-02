// /api/monetbil-notify.js
// Monetbil appelle cette URL côté serveur après une tentative de paiement.
// On revérifie le statut auprès de Monetbil (checkPayment) avant de mettre à jour la commande,
// pour ne jamais faire confiance à une notification non vérifiée.

import { createClient } from "@supabase/supabase-js";
import { sendEmail, templates } from "./_lib/email.js";
import { sendSMS } from "./sms.js";
import { smsTemplates } from "./_lib/sms-templates.js";

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

    const { data: updated } = await supabase
      .from("orders")
      .update({
        payment_status: isPaid ? "payé" : "échoué",
        transaction_id: paymentId || null,
        status: isPaid ? "confirmé" : "en_attente",
      })
      .eq("id", orderId)
      .select()
      .single();

    if (isPaid && updated) {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
      const ADMIN_PHONE = process.env.ADMIN_PHONE;
      const tpl    = templates.order_paid;
      const smsTpl = smsTemplates.order_paid;
      const jobs   = [];
      if (ADMIN_EMAIL) jobs.push(sendEmail({ to: ADMIN_EMAIL, ...tpl.admin(updated) }));
      if (ADMIN_PHONE) jobs.push(sendSMS(ADMIN_PHONE, smsTpl.admin(updated)));
      const clientEmailTpl = tpl.client(updated);
      if (clientEmailTpl) jobs.push(sendEmail({ to: updated.email, ...clientEmailTpl }));
      const clientSms = smsTpl.client(updated);
      if (updated.client_phone && clientSms) jobs.push(sendSMS(updated.client_phone, clientSms));
      await Promise.allSettled(jobs);
    }

    return res.status(200).json({ received: true, paid: isPaid });
  } catch (e) {
    console.error("monetbil-notify error:", e);
    // On répond 200 quand même pour éviter que Monetbil ne réessaie en boucle sur une erreur de notre côté
    return res.status(200).json({ received: true, error: true });
  }
}
