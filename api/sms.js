// /api/sms.js
// Envoie un SMS via TechSoft SMS (plateforme camerounaise, paiement en FCFA).
// Documentation : https://techsoft-sms.com/api
// Les clés restent côté serveur, jamais exposées au navigateur.

const SMS_API_KEY  = process.env.SMS_API_KEY;
const SMS_SENDER   = process.env.SMS_SENDER_ID || 'INFOTECH'; // max 11 caractères
const SMS_API_URL  = 'https://app.techsoft-web-agency.com/sms/api';

export async function sendSMS(to, message) {
  if (!SMS_API_KEY) {
    console.log('SMS: variable SMS_API_KEY manquante, SMS ignoré');
    return { skipped: true };
  }
  if (!to) return { skipped: true, reason: 'no phone' };

  const phone = normalizePhone(to);
  if (!phone) { console.warn('SMS: numéro invalide', to); return { skipped: true }; }

  try {
    const body = new URLSearchParams({
      action:   'send-sms',
      api_key:  SMS_API_KEY,
      to:       phone,
      from:     SMS_SENDER,
      sms:      message.slice(0, 160),
    });

    const resp = await fetch(SMS_API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    });

    const data = await resp.json();
    if (data?.responsecode !== '01' && data?.responsecode !== 1) {
      console.warn('TechSoft SMS error:', data);
    }
    return data;
  } catch (e) {
    console.error('sendSMS error:', e);
    return { error: true };
  }
}

function normalizePhone(raw) {
  if (!raw) return null;
  let n = raw.replace(/[\s\-().+]/g, '');
  if (n.startsWith('00'))  n = n.slice(2);
  if (n.startsWith('237') && n.length === 12) return n;
  if (n.startsWith('6')   && n.length === 9)  return '237' + n;
  if (n.startsWith('2')   && n.length === 9)  return '237' + n;
  return /^\d{9,12}$/.test(n) ? n : null;
}
