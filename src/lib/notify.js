// Envoie une notification email (admin + client) en arrière-plan.
// N'attend jamais et n'interrompt jamais le flux de l'utilisateur si ça échoue.
export function notify(type, data) {
  try {
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    }).catch(() => {});
  } catch (_) { /* silencieux */ }
}
