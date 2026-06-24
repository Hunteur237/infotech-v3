// /api/monetbil-init.js
// Initialise un paiement Mobile Money via Monetbil. Appelé depuis le front (Boutique.jsx).
// La clé de service Monetbil reste ici, côté serveur — jamais exposée au navigateur.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  const SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY;
  if (!SERVICE_KEY) {
    return res.status(500).json({ success: false, message: "MONETBIL_SERVICE_KEY manquant dans les variables d'environnement Vercel" });
  }

  try {
    const { orderId, amount, phone, name, email } = req.body || {};
    if (!orderId || !amount || !phone) {
      return res.status(400).json({ success: false, message: "orderId, amount et phone sont requis" });
    }

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const baseUrl = `${proto}://${host}`;

    const [first_name, ...rest] = (name || "Client").trim().split(" ");
    const last_name = rest.join(" ") || "Infotech";

    const params = {
      amount: Math.round(Number(amount)),
      phone: String(phone).replace(/\s+/g, ""),
      locale: "fr",
      country: "CM",
      currency: "XAF",
      item_ref: String(orderId),
      payment_ref: `${orderId}-${Date.now()}`,
      first_name,
      last_name,
      email: email || "",
      return_url: `${baseUrl}/paiement-retour?order=${orderId}`,
      notify_url: `${baseUrl}/api/monetbil-notify`,
    };

    const resp = await fetch(`https://api.monetbil.com/widget/v2.1/${SERVICE_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params).toString(),
    });

    const data = await resp.json();

    if (data && data.success && data.payment_url) {
      return res.status(200).json({ success: true, payment_url: data.payment_url });
    }
    return res.status(400).json({ success: false, message: data?.message || "Échec de l'initialisation du paiement" });
  } catch (e) {
    console.error("monetbil-init error:", e);
    return res.status(500).json({ success: false, message: "Erreur serveur lors de l'initialisation du paiement" });
  }
}
