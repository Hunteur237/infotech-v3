// /api/notify.js
// Reçoit { type: 'contact'|'rdv'|'devis'|'order', data: {...} } et envoie les emails
// admin + client correspondants via Resend. Conçu pour être appelé en "fire and forget"
// depuis le front juste après un insert Supabase réussi — n'importe jamais bloquer l'UX.

import { sendEmail, templates } from "./_lib/email.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const { type, data } = req.body || {};

  const tpl = templates[type];
  if (!tpl || !data) return res.status(200).json({ skipped: true, reason: "type ou data manquant" });

  try {
    const jobs = [];

    if (ADMIN_EMAIL) {
      const adminTpl = tpl.admin(data);
      if (adminTpl) jobs.push(sendEmail({ to: ADMIN_EMAIL, ...adminTpl }));
    }

    const clientTpl = tpl.client ? tpl.client(data) : null;
    if (clientTpl) jobs.push(sendEmail({ to: data.email, ...clientTpl }));

    await Promise.allSettled(jobs);
    return res.status(200).json({ sent: true });
  } catch (e) {
    console.error("notify error:", e);
    // On répond 200 quand même : un échec d'email ne doit jamais faire échouer le formulaire côté client
    return res.status(200).json({ sent: false });
  }
}
