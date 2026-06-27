// /api/_lib/email.js
// Envoie un email via l'API Resend. Utilisé par /api/notify.js et /api/monetbil-notify.js.

const FROM = process.env.MAIL_FROM || "INFO-TECH <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, replyTo }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY || !to) return { skipped: true };

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    const data = await resp.json();
    if (!resp.ok) console.error("Resend error:", data);
    return data;
  } catch (e) {
    console.error("sendEmail error:", e);
    return { error: true };
  }
}

const wrap = (title, bodyHtml) => `
<div style="font-family:Arial,sans-serif;background:#0A0B10;padding:32px;">
  <div style="max-width:520px;margin:0 auto;background:#13151F;border:1px solid #1E2136;border-radius:14px;padding:28px;">
    <div style="color:#4ADE80;font-size:13px;letter-spacing:.08em;font-weight:bold;margin-bottom:14px;">INFO-TECH</div>
    <h2 style="color:#fff;font-size:18px;margin:0 0 16px;">${title}</h2>
    <div style="color:#9CA3AF;font-size:14px;line-height:1.6;">${bodyHtml}</div>
  </div>
</div>`;

export const templates = {
  contact: {
    admin: (d) => ({
      subject: `📩 Nouveau message de ${d.name}`,
      html: wrap("Nouveau message de contact", `
        <p><b>Nom :</b> ${d.name}</p>
        <p><b>Entreprise :</b> ${d.company || "—"}</p>
        <p><b>Email :</b> ${d.email || "—"}</p>
        <p><b>Téléphone :</b> ${d.phone || "—"}</p>
        <p><b>Service :</b> ${d.service || "—"}</p>
        <p><b>Budget :</b> ${d.budget || "—"}</p>
        <p><b>Message :</b><br/>${(d.message || "").replace(/\n/g, "<br/>")}</p>
      `),
    }),
    client: (d) => d.email ? ({
      subject: `Nous avons reçu votre message — INFO-TECH`,
      html: wrap(`Merci ${d.name?.split(" ")[0] || ""} !`, `
        <p>Votre message a bien été reçu. Notre équipe vous répond généralement sous 24h ouvrées.</p>
        <p>— L'équipe INFO-TECH</p>
      `),
    }) : null,
  },
  rdv: {
    admin: (d) => ({
      subject: `📅 Nouveau RDV — ${d.name}`,
      html: wrap("Nouvelle demande de rendez-vous", `
        <p><b>Nom :</b> ${d.name}</p>
        <p><b>Téléphone :</b> ${d.phone}</p>
        <p><b>Sujet :</b> ${d.subject || "—"}</p>
        <p><b>Jour souhaité :</b> ${d.day || "—"}</p>
        <p><b>Créneau :</b> ${d.slot || "—"}</p>
      `),
    }),
    client: (d) => d.email ? ({
      subject: `Votre demande de rendez-vous — INFO-TECH`,
      html: wrap("Demande reçue", `
        <p>Votre demande de rendez-vous pour le <b>${d.day}</b> à <b>${d.slot}</b> a bien été reçue.</p>
        <p>Nous vous confirmons par téléphone très prochainement.</p>
      `),
    }) : null,
  },
  devis: {
    admin: (d) => ({
      subject: `📝 Nouvelle demande de devis — ${d.name}`,
      html: wrap("Nouvelle demande de devis", `
        <p><b>Nom :</b> ${d.name}</p>
        <p><b>Email :</b> ${d.email || "—"}</p>
        <p><b>Téléphone :</b> ${d.phone || "—"}</p>
        <p><b>Projet :</b> ${d.project_type || "—"}</p>
        <p><b>Estimation :</b> ${Number(d.estimated_total || 0).toLocaleString("fr-FR")} FCFA</p>
      `),
    }),
    client: (d) => d.email ? ({
      subject: `Votre devis estimatif — INFO-TECH`,
      html: wrap("Devis reçu", `
        <p>Votre demande de devis (${d.project_type || "projet"}) a bien été reçue.</p>
        <p><b>Estimation indicative :</b> ${Number(d.estimated_total || 0).toLocaleString("fr-FR")} FCFA</p>
        <p>Un membre de notre équipe vous contacte sous 24h pour affiner ce devis.</p>
      `),
    }) : null,
  },
  order: {
    admin: (d) => ({
      subject: `🛒 Nouvelle commande — ${d.client_name}`,
      html: wrap("Nouvelle commande boutique", `
        <p><b>Client :</b> ${d.client_name}</p>
        <p><b>Téléphone :</b> ${d.client_phone}</p>
        <p><b>Adresse :</b> ${d.client_address || "—"}</p>
        <p><b>Produits :</b><br/>${(d.items || []).map(i => `${i.name} × ${i.qty}`).join("<br/>")}</p>
        <p><b>Total :</b> ${Number(d.total).toLocaleString("fr-FR")} FCFA</p>
        <p><b>Paiement :</b> ${d.payment_method === "mobile_money" ? "Mobile Money" : "À la livraison"}</p>
      `),
    }),
    client: (d) => d.email ? ({
      subject: `Confirmation de votre commande — INFO-TECH`,
      html: wrap("Commande enregistrée", `
        <p>Merci ${d.client_name} ! Votre commande de <b>${Number(d.total).toLocaleString("fr-FR")} FCFA</b> a bien été enregistrée.</p>
        <p>Nous vous contactons sous peu pour la livraison.</p>
      `),
    }) : null,
  },
  order_paid: {
    admin: (d) => ({
      subject: `✅ Paiement confirmé — commande #${String(d.id).slice(0, 8)}`,
      html: wrap("Paiement Mobile Money reçu", `
        <p><b>Client :</b> ${d.client_name}</p>
        <p><b>Montant :</b> ${Number(d.total).toLocaleString("fr-FR")} FCFA</p>
        <p>Le paiement a été confirmé automatiquement par Monetbil.</p>
      `),
    }),
    client: (d) => d.email ? ({
      subject: `Paiement confirmé — INFO-TECH`,
      html: wrap("Paiement reçu", `
        <p>Nous confirmons la réception de votre paiement de <b>${Number(d.total).toLocaleString("fr-FR")} FCFA</b>.</p>
        <p>Votre commande est en préparation.</p>
      `),
    }) : null,
  },
};
