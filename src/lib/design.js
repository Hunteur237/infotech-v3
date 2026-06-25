// ─── DESIGN SYSTEM INFO-TECH v3 ─────────────────────────────────────────────
// Palette : fond anthracite profond, accent vert tech maîtrisé, accents chauds
// Typographie : Inter (corps), Outfit (display), JetBrains Mono (data/code)
//
// Thème : DS est un objet MUTABLE. applyTheme() réécrit ses propriétés en place
// (Object.assign) au lieu de remplacer l'objet — ainsi tous les composants qui
// font `DS.bg`, `${DS.lime}33` etc. continuent de fonctionner sans modification,
// ils relisent juste de nouvelles valeurs au prochain rendu déclenché par
// ThemeProvider (voir ./theme.jsx).

const DARK = {
  // Fonds
  bg:      '#0A0B10',
  bg2:     '#0D0F16',
  bg3:     '#10121A',
  surface: '#13151F',
  s2:      '#171A27',
  s3:      '#1C1F30',

  // Bordures
  border:  '#1E2136',
  b2:      '#252840',
  b3:      '#2D3052',

  // Accent principal — vert tech (moins agressif que #B8FF00)
  lime:    '#4ADE80',   // vert doux, pro
  lime2:   '#22C55E',
  lime3:   '#86EFAC',
  limeGlow: 'rgba(74,222,128,.12)',

  // Accents secondaires
  gold:    '#F59E0B',
  gold2:   '#D97706',
  blue:    '#3B82F6',
  blue2:   '#2563EB',
  violet:  '#8B5CF6',
  cyan:    '#06B6D4',
  red:     '#EF4444',
  green:   '#22C55E',
  orange:  '#F97316',

  // Texte
  white:   '#F1F5F9',
  gray:    '#374151',
  gray2:   '#6B7280',
  gray3:   '#9CA3AF',

  // Ombres
  shadow:     '0 2px 16px rgba(0,0,0,.35)',
  shadow2:    '0 8px 40px rgba(0,0,0,.5)',
  shadowGreen:'0 6px 28px rgba(74,222,128,.2)',
}

const LIGHT = {
  // Fonds
  bg:      '#F7F9FC',
  bg2:     '#FFFFFF',
  bg3:     '#EEF2F7',
  surface: '#FFFFFF',
  s2:      '#F3F5F9',
  s3:      '#E8EBF1',

  // Bordures
  border:  '#E2E8F0',
  b2:      '#CBD5E1',
  b3:      '#94A3B8',

  // Accent principal
  lime:    '#16A34A',
  lime2:   '#15803D',
  lime3:   '#22C55E',
  limeGlow: 'rgba(22,163,74,.10)',

  // Accents secondaires
  gold:    '#D97706',
  gold2:   '#B45309',
  blue:    '#2563EB',
  blue2:   '#1D4ED8',
  violet:  '#7C3AED',
  cyan:    '#0891B2',
  red:     '#DC2626',
  green:   '#16A34A',
  orange:  '#EA580C',

  // Texte
  white:   '#0F172A',
  gray:    '#CBD5E1',
  gray2:   '#64748B',
  gray3:   '#3F4A5A',

  // Ombres
  shadow:     '0 2px 16px rgba(15,23,42,.08)',
  shadow2:    '0 8px 40px rgba(15,23,42,.12)',
  shadowGreen:'0 6px 28px rgba(22,163,74,.18)',
}

export const DS = {
  ...DARK,
  // Rayons (identiques dans les deux thèmes)
  r:   '6px',
  r2:  '10px',
  r3:  '14px',
  r4:  '20px',
}

export function applyTheme(theme) {
  Object.assign(DS, theme === 'light' ? LIGHT : DARK)
}

export const FONTS = {
  display: "'Outfit', sans-serif",
  body:    "'Inter', sans-serif",
  mono:    "'JetBrains Mono', monospace",
}

export const FONTS_URL = `https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap`

// Animations standard
export const VARIANTS = {
  fadeUp:    { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  fadeIn:    { hidden: { opacity: 0 },         visible: { opacity: 1 } },
  slideRight:{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
  slideLeft: { hidden: { opacity: 0, x: 20 },  visible: { opacity: 1, x: 0 } },
  scale:     { hidden: { opacity: 0, scale: .92 }, visible: { opacity: 1, scale: 1 } },
}

export const TRANSITION = {
  spring: { type: 'spring', stiffness: 280, damping: 26 },
  smooth: { duration: .55, ease: [.22, 1, .36, 1] },
  fast:   { duration: .22, ease: [.22, 1, .36, 1] },
  slow:   { duration: .85, ease: [.22, 1, .36, 1] },
  stagger: i => ({ delay: i * .07 }),
}

// Utilitaires
export const fmt     = n  => n?.toLocaleString('fr-FR') + ' FCFA'
export const fmtDate = d  => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
export const statusType = s => {
  const ok     = ['terminée','payée','livré','publié','actif','expédié','confirmé','accepté','effectué']
  const warn   = ['en cours','en_attente','en attente','planifiée','nouveau','envoyé','modéré']
  const danger = ['retard','rupture','inactif','annulée','annulé','refusé']
  const sl = s?.toLowerCase()
  if (ok.includes(sl))     return 'ok'
  if (warn.includes(sl))   return 'warn'
  if (danger.includes(sl)) return 'danger'
  return 'info'
}
