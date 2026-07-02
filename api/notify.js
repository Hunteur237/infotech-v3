// /api/notify.js
// Reçoit { type: 'contact'|'rdv'|'devis'|'order', data: {...} } et envoie les emails
// admin + client correspondants via Resend. Conçu pour être appelé en "fire and forget"
// depuis le front juste après un insert Supabase réussi — n'importe jamais bloquer l'UX.

import { sendEmail, templates } from "./_lib/email.js";
import { sendSMS } from "./sms.js";
import { smsTemplates } from "./_lib/sms-templates.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PHONE = process.env.ADMIN_PHONE; // ex: +237683421271
  const { type, data } = req.body || {};

  const tpl    = templates[type];
  const smsTpl = smsTemplates[type];
  if (!tpl || !data) return res.status(200).json({ skipped: true, reason: "type ou data manquant" });

  try {
    const jobs = [];

    // ── Emails ──
    if (ADMIN_EMAIL) {
      const adminTpl = tpl.admin(data);
      if (adminTpl) jobs.push(sendEmail({ to: ADMIN_EMAIL, ...adminTpl }));
    }
    const clientEmailTpl = tpl.client ? tpl.client(data) : null;
    if (clientEmailTpl) jobs.push(sendEmail({ to: data.email, ...clientEmailTpl }));

    // ── SMS ──
    if (smsTpl) {
      if (ADMIN_PHONE) {
        const adminSms = smsTpl.admin(data);
        if (adminSms) jobs.push(sendSMS(ADMIN_PHONE, adminSms));
      }
      const clientPhone = data.phone || data.client_phone;
      const clientSms   = smsTpl.client(data);
      if (clientPhone && clientSms) jobs.push(sendSMS(clientPhone, clientSms));
    }

    await Promise.allSettled(jobs);
    return res.status(200).json({ sent: true });
  } catch (e) {
    console.error("notify error:", e);
    return res.status(200).json({ sent: false });
  }
}
