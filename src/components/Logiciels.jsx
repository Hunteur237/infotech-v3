import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { DS, FONTS } from "../lib/design.js";
import { Container } from "./UI.jsx";

// ─── Données réelles des 3 logiciels ───────────────────────────────────────
const SOFTS = [
  {
    id: "electroshop",
    nom: "ElectroShop Pro",
    version: "v2.6",
    tagline: "Gestion complète pour boutiques d'électronique",
    desc: "Du point de vente à la comptabilité, en passant par les stocks et les fournisseurs — ElectroShop Pro couvre tous les besoins d'une boutique électronique ou électroménager. Fonctionne sans internet, avec sauvegarde automatique.",
    color: "#FF8C00",
    color2: "#FF6600",
    secteur: "Boutiques & commerce",
    tech: ["Python", "PyQt6", "SQLite", "ReportLab", "Matplotlib"],
    modules: [
      { icon: "🛒", label: "Caisse & ventes" },
      { icon: "📦", label: "Stocks & inventaire" },
      { icon: "🤝", label: "Gestion fournisseurs" },
      { icon: "👥", label: "Fichier clients" },
      { icon: "↩️", label: "Retours & remboursements" },
      { icon: "🚚", label: "Suivi livraisons" },
      { icon: "📊", label: "Analytics & tableaux de bord" },
      { icon: "📋", label: "Comptabilité intégrée" },
      { icon: "📄", label: "Rapports PDF auto" },
    ],
    points: [
      "Mode hors-ligne complet — pas besoin d'internet",
      "Rapports de caisse journaliers en 1 clic",
      "Gestion multi-utilisateurs avec droits d'accès",
      "Sauvegarde automatique des données",
      "Interface simple, formation en moins d'une journée",
    ],
  },
  {
    id: "gestloc",
    nom: "GestLoc",
    version: "v4",
    tagline: "Logiciel de gestion locative immobilière",
    desc: "Gérez vos biens immobiliers, locataires et contrats depuis un seul logiciel. Génération automatique des quittances et contrats PDF, suivi des paiements, relances d'impayés et comptabilité locative intégrée.",
    color: "#00C896",
    color2: "#00A07A",
    secteur: "Immobilier & gestion locative",
    tech: ["Python", "PyQt6", "SQLite", "ReportLab", "Matplotlib"],
    modules: [
      { icon: "🏠", label: "Biens immobiliers" },
      { icon: "👤", label: "Propriétaires & locataires" },
      { icon: "📑", label: "Contrats PDF automatiques" },
      { icon: "🧾", label: "Quittances de loyer" },
      { icon: "💳", label: "Suivi des paiements" },
      { icon: "⚠️", label: "Relances impayés" },
      { icon: "🏗️", label: "Charges & dépenses" },
      { icon: "📒", label: "Comptabilité locative" },
      { icon: "🔔", label: "Alertes d'échéances" },
    ],
    points: [
      "Génération PDF des contrats et quittances en 1 clic",
      "Alertes automatiques de fin de bail et d'impayés",
      "Gestion en mode agence (multi-propriétaires)",
      "Historique complet des transactions",
      "Export des données comptables",
    ],
  },
  {
    id: "gestmag",
    nom: "GestMag",
    version: "v3.0.0",
    tagline: "Gestion d'équipements et de magasin",
    desc: "Suivi précis de chaque équipement avec QR codes, gestion des emprunts et retours, planning de maintenance préventive, fournisseurs et rapports PDF. Idéal pour écoles, cliniques, entreprises et associations.",
    color: "#3D7EFF",
    color2: "#1D4ED8",
    secteur: "Équipements & stock",
    tech: ["Python", "PyQt6", "SQLite", "QR Code", "ReportLab"],
    modules: [
      { icon: "🖥️", label: "Gestion équipements" },
      { icon: "📱", label: "QR codes intégrés" },
      { icon: "📦", label: "Stock & mouvements" },
      { icon: "🔄", label: "Emprunts & retours" },
      { icon: "🔧", label: "Maintenance planifiée" },
      { icon: "🤝", label: "Gestion fournisseurs" },
      { icon: "📅", label: "Calendrier maintenance" },
      { icon: "📥", label: "Import CSV" },
      { icon: "📄", label: "Rapports PDF" },
    ],
    points: [
      "QR code unique pour chaque équipement",
      "Historique complet : entrées, sorties, emprunts",
      "Alertes de maintenance préventive",
      "Import de catalogues via CSV",
      "Rapports détaillés exportables",
    ],
  },
];

// ─── Mockups SVG animés ──────────────────────────────────────────────────────

function MockupElectroShop({ color }) {
  const rows = [
    { nom: "Samsung TV 65\"", qty: 3, px: "285 000" },
    { nom: "iPhone 15 Pro", qty: 8, px: "420 000" },
    { nom: "Laptop Dell XPS", qty: 2, px: "585 000" },
    { nom: "Airpods Pro 2", qty: 12, px: "68 000" },
  ];
  return (
    <svg viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Window */}
      <rect width="520" height="340" rx="12" fill="#0D0F16" />
      {/* Titlebar */}
      <rect width="520" height="38" rx="12" fill="#0A0B10" />
      <rect y="26" width="520" height="12" fill="#0A0B10" />
      <circle cx="18" cy="19" r="6" fill="#FF5F57" />
      <circle cx="38" cy="19" r="6" fill="#FEBC2E" />
      <circle cx="58" cy="19" r="6" fill="#28C840" />
      <text x="200" y="24" fontSize="11" fill="#9CA3AF" fontFamily="monospace">ElectroShop Pro v2.6</text>

      {/* Sidebar */}
      <rect x="0" y="38" width="120" height="302" fill="#080911" />
      <rect x="0" y="38" width="120" height="302" rx="0" fill="#080911" />
      {[
        ["🛒", "Ventes", true], ["📦", "Stock", false], ["🤝", "Fournisseurs", false],
        ["👥", "Clients", false], ["📊", "Analytics", false], ["📋", "Comptabilité", false],
      ].map(([ico, label, active], i) => (
        <g key={i}>
          <rect x="4" y={52 + i * 38} width="112" height="32" rx="6" fill={active ? color + "22" : "transparent"} />
          {active && <rect x="4" y={52 + i * 38} width="3" height="32" rx="1.5" fill={color} />}
          <text x="22" y={72 + i * 38} fontSize="13">{ico}</text>
          <text x="40" y={73 + i * 38} fontSize="11" fill={active ? color : "#6B7280"} fontFamily="sans-serif" fontWeight={active ? "600" : "400"}>{label}</text>
        </g>
      ))}

      {/* Main content */}
      {/* Header */}
      <rect x="128" y="48" width="380" height="36" rx="6" fill="#13151F" />
      <text x="142" y="71" fontSize="13" fill="#F1F5F9" fontFamily="sans-serif" fontWeight="700">Ventes du jour</text>
      <rect x="440" y="54" width="60" height="24" rx="5" fill={color} />
      <text x="453" y="71" fontSize="11" fill="#080911" fontFamily="sans-serif" fontWeight="700">+ Vente</text>

      {/* Stats cards */}
      {[
        ["CA Aujourd'hui", "1 245 000 F", color],
        ["Ventes", "14", "#9CA3AF"],
        ["Stock alerte", "3", "#FF4444"],
      ].map(([label, val, c], i) => (
        <g key={i}>
          <rect x={128 + i * 128} y="92" width="118" height="52" rx="6" fill="#13151F" />
          <text x={138 + i * 128} y="112" fontSize="9.5" fill="#6B7280" fontFamily="sans-serif">{label}</text>
          <text x={138 + i * 128} y="132" fontSize="13" fill={c} fontFamily="sans-serif" fontWeight="700">{val}</text>
        </g>
      ))}

      {/* Table */}
      <rect x="128" y="152" width="380" height="26" rx="4" fill="#0D0F16" />
      <text x="140" y="169" fontSize="9.5" fill="#4B5563" fontFamily="monospace">ARTICLE</text>
      <text x="310" y="169" fontSize="9.5" fill="#4B5563" fontFamily="monospace">QTÉ</text>
      <text x="380" y="169" fontSize="9.5" fill="#4B5563" fontFamily="monospace">PRIX</text>
      <text x="448" y="169" fontSize="9.5" fill="#4B5563" fontFamily="monospace">STATUT</text>

      {rows.map((r, i) => (
        <g key={i}>
          <rect x="128" y={180 + i * 34} width="380" height="30" rx="4" fill={i % 2 === 0 ? "#0F1119" : "transparent"} />
          <circle cx="140" cy={195 + i * 34} r="5" fill={color + "44"} />
          <text x="152" y={199 + i * 34} fontSize="10.5" fill="#E5E7EB" fontFamily="sans-serif">{r.nom}</text>
          <text x="315" y={199 + i * 34} fontSize="10.5" fill="#9CA3AF" fontFamily="monospace">{r.qty}</text>
          <text x="370" y={199 + i * 34} fontSize="10.5" fill={color} fontFamily="monospace">{r.px} F</text>
          <rect x="448" y={185 + i * 34} width="46" height="16" rx="8" fill="#22C55E22" />
          <text x="455" y={197 + i * 34} fontSize="8.5" fill="#22C55E" fontFamily="sans-serif">Vendu</text>
        </g>
      ))}

      {/* Bottom bar */}
      <rect x="128" y="312" width="380" height="28" rx="4" fill="#13151F" />
      <text x="140" y="330" fontSize="10" fill="#6B7280" fontFamily="sans-serif">Total du jour :</text>
      <text x="240" y="330" fontSize="11" fill={color} fontFamily="monospace" fontWeight="700">1 245 000 FCFA</text>
      <rect x="424" y="316" width="76" height="20" rx="4" fill={color + "22"} />
      <text x="438" y="330" fontSize="9.5" fill={color} fontFamily="sans-serif">Rapport PDF</text>
    </svg>
  );
}

function MockupGestLoc({ color }) {
  const biens = [
    { ref: "BN-001", type: "Appart. 3P", loyer: "85 000", statut: "Payé", locataire: "M. Mbella" },
    { ref: "BN-002", type: "Studio", loyer: "45 000", statut: "Retard", locataire: "Mme Nguemo" },
    { ref: "BN-003", type: "Villa 5P", loyer: "220 000", statut: "Payé", locataire: "M. Kamga" },
    { ref: "BN-004", type: "Boutique", loyer: "130 000", statut: "Vacant", locataire: "—" },
  ];
  return (
    <svg viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="520" height="340" rx="12" fill="#0D0F16" />
      <rect width="520" height="38" rx="12" fill="#0A0B10" />
      <rect y="26" width="520" height="12" fill="#0A0B10" />
      <circle cx="18" cy="19" r="6" fill="#FF5F57" />
      <circle cx="38" cy="19" r="6" fill="#FEBC2E" />
      <circle cx="58" cy="19" r="6" fill="#28C840" />
      <text x="210" y="24" fontSize="11" fill="#9CA3AF" fontFamily="monospace">GestLoc v4</text>

      <rect x="0" y="38" width="120" height="302" fill="#080911" />
      {[
        ["🏠", "Biens", true], ["👤", "Locataires", false], ["📑", "Contrats", false],
        ["💳", "Paiements", false], ["⚠️", "Relances", false], ["📒", "Comptabilité", false],
      ].map(([ico, label, active], i) => (
        <g key={i}>
          <rect x="4" y={52 + i * 38} width="112" height="32" rx="6" fill={active ? color + "22" : "transparent"} />
          {active && <rect x="4" y={52 + i * 38} width="3" height="32" rx="1.5" fill={color} />}
          <text x="22" y={72 + i * 38} fontSize="13">{ico}</text>
          <text x="40" y={73 + i * 38} fontSize="11" fill={active ? color : "#6B7280"} fontFamily="sans-serif" fontWeight={active ? "600" : "400"}>{label}</text>
        </g>
      ))}

      {/* Summary cards */}
      {[
        ["Loyers perçus/mois", "435 000 F", color],
        ["Biens gérés", "8", "#9CA3AF"],
        ["Impayés", "1", "#FF4444"],
      ].map(([label, val, c], i) => (
        <g key={i}>
          <rect x={128 + i * 128} y="48" width="118" height="52" rx="6" fill="#13151F" />
          <text x={138 + i * 128} y="68" fontSize="9.5" fill="#6B7280" fontFamily="sans-serif">{label}</text>
          <text x={138 + i * 128} y="88" fontSize="13" fill={c} fontFamily="sans-serif" fontWeight="700">{val}</text>
        </g>
      ))}

      {/* Section title */}
      <text x="140" y="122" fontSize="12" fill="#F1F5F9" fontFamily="sans-serif" fontWeight="700">Mes biens immobiliers</text>
      <rect x="440" y="106" width="60" height="22" rx="5" fill={color} />
      <text x="450" y="121" fontSize="10" fill="#080911" fontFamily="sans-serif" fontWeight="700">+ Bien</text>

      {/* Table header */}
      <rect x="128" y="130" width="380" height="24" rx="4" fill="#0D0F16" />
      {["RÉF", "TYPE", "LOYER", "LOCATAIRE", "STATUT"].map((h, i) => (
        <text key={i} x={[140, 185, 265, 330, 430][i]} y="146" fontSize="9" fill="#4B5563" fontFamily="monospace">{h}</text>
      ))}

      {biens.map((b, i) => (
        <g key={i}>
          <rect x="128" y={156 + i * 36} width="380" height="32" rx="4" fill={i % 2 === 0 ? "#0F1119" : "transparent"} />
          <text x="140" y={176 + i * 36} fontSize="9.5" fill={color} fontFamily="monospace">{b.ref}</text>
          <text x="185" y={176 + i * 36} fontSize="10" fill="#E5E7EB" fontFamily="sans-serif">{b.type}</text>
          <text x="265" y={176 + i * 36} fontSize="10" fill="#9CA3AF" fontFamily="monospace">{b.loyer} F</text>
          <text x="330" y={176 + i * 36} fontSize="10" fill="#D1D5DB" fontFamily="sans-serif">{b.locataire}</text>
          <rect x="418" y={162 + i * 36} width="56" height="18" rx="9"
            fill={b.statut === "Payé" ? "#22C55E22" : b.statut === "Retard" ? "#FF444422" : "#9CA3AF22"} />
          <text x="430" y={175 + i * 36} fontSize="9" fontFamily="sans-serif"
            fill={b.statut === "Payé" ? "#22C55E" : b.statut === "Retard" ? "#FF4444" : "#9CA3AF"}>{b.statut}</text>
        </g>
      ))}

      {/* Bottom actions */}
      <rect x="128" y="302" width="380" height="28" rx="4" fill="#13151F" />
      <rect x="136" y="308" width="100" height="16" rx="4" fill={color + "22"} />
      <text x="148" y="320" fontSize="9.5" fill={color} fontFamily="sans-serif">📑 Générer quittance</text>
      <rect x="244" y="308" width="100" height="16" rx="4" fill="#FF444422" />
      <text x="256" y="320" fontSize="9.5" fill="#FF4444" fontFamily="sans-serif">⚠️ Envoyer relance</text>
      <rect x="352" y="308" width="80" height="16" rx="4" fill="#6B728022" />
      <text x="362" y="320" fontSize="9.5" fill="#9CA3AF" fontFamily="sans-serif">📊 Rapport PDF</text>
    </svg>
  );
}

function MockupGestMag({ color }) {
  const equips = [
    { code: "EQ-2401", nom: "Projecteur Epson", cat: "Audiovisuel", statut: "Disponible" },
    { code: "EQ-2402", nom: "Laptop Dell", cat: "Informatique", statut: "Emprunté" },
    { code: "EQ-2403", nom: "Taille-haie", cat: "Outillage", statut: "Maintenance" },
    { code: "EQ-2404", nom: "Imprimante HP", cat: "Bureau", statut: "Disponible" },
  ];
  return (
    <svg viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="520" height="340" rx="12" fill="#0D0F16" />
      <rect width="520" height="38" rx="12" fill="#0A0B10" />
      <rect y="26" width="520" height="12" fill="#0A0B10" />
      <circle cx="18" cy="19" r="6" fill="#FF5F57" />
      <circle cx="38" cy="19" r="6" fill="#FEBC2E" />
      <circle cx="58" cy="19" r="6" fill="#28C840" />
      <text x="208" y="24" fontSize="11" fill="#9CA3AF" fontFamily="monospace">GestMag v3.0.0</text>

      <rect x="0" y="38" width="120" height="302" fill="#080911" />
      {[
        ["🖥️", "Équipements", true], ["📦", "Stock", false], ["🔄", "Emprunts", false],
        ["🔧", "Maintenance", false], ["📅", "Calendrier", false], ["📄", "Rapports", false],
      ].map(([ico, label, active], i) => (
        <g key={i}>
          <rect x="4" y={52 + i * 38} width="112" height="32" rx="6" fill={active ? color + "22" : "transparent"} />
          {active && <rect x="4" y={52 + i * 38} width="3" height="32" rx="1.5" fill={color} />}
          <text x="22" y={72 + i * 38} fontSize="13">{ico}</text>
          <text x="40" y={73 + i * 38} fontSize="11" fill={active ? color : "#6B7280"} fontFamily="sans-serif" fontWeight={active ? "600" : "400"}>{label}</text>
        </g>
      ))}

      {/* Stats */}
      {[
        ["Équipements", "47", color],
        ["Emprunts actifs", "8", "#FBBF24"],
        ["En maintenance", "3", "#FF4444"],
      ].map(([label, val, c], i) => (
        <g key={i}>
          <rect x={128 + i * 128} y="48" width="118" height="52" rx="6" fill="#13151F" />
          <text x={138 + i * 128} y="68" fontSize="9.5" fill="#6B7280" fontFamily="sans-serif">{label}</text>
          <text x={138 + i * 128} y="88" fontSize="13" fill={c} fontFamily="sans-serif" fontWeight="700">{val}</text>
        </g>
      ))}

      {/* QR preview panel */}
      <rect x="388" y="108" width="120" height="106" rx="6" fill="#13151F" />
      <text x="400" y="124" fontSize="9" fill="#6B7280" fontFamily="sans-serif">QR Code</text>
      {/* QR code mockup */}
      {[0,1,2,3,4].map(row => [0,1,2,3,4].map(col => (
        <rect key={`${row}-${col}`} x={400 + col * 13} y={130 + row * 13} width="11" height="11" rx="1"
          fill={Math.random() > 0.5 ? color : "transparent"} opacity="0.8" />
      )))}
      <rect x="400" y="130" width="11" height="11" rx="1" fill={color} />
      <rect x="400" y="156" width="11" height="11" rx="1" fill={color} />
      <rect x="452" y="130" width="11" height="11" rx="1" fill={color} />
      <text x="400" y="200" fontSize="8" fill="#6B7280" fontFamily="monospace">EQ-2401</text>
      <text x="400" y="210" fontSize="8" fill="#9CA3AF" fontFamily="sans-serif">Epson Projecteur</text>

      {/* Table */}
      <rect x="128" y="130" width="252" height="24" rx="4" fill="#0D0F16" />
      <text x="138" y="146" fontSize="9" fill="#4B5563" fontFamily="monospace">CODE</text>
      <text x="192" y="146" fontSize="9" fill="#4B5563" fontFamily="monospace">ÉQUIPEMENT</text>
      <text x="300" y="146" fontSize="9" fill="#4B5563" fontFamily="monospace">STATUT</text>

      {equips.map((e, i) => (
        <g key={i}>
          <rect x="128" y={156 + i * 34} width="252" height="30" rx="4" fill={i % 2 === 0 ? "#0F1119" : "transparent"} />
          <text x="138" y={175 + i * 34} fontSize="9.5" fill={color} fontFamily="monospace">{e.code}</text>
          <text x="192" y={175 + i * 34} fontSize="10" fill="#E5E7EB" fontFamily="sans-serif">{e.nom}</text>
          <rect x="296" y={161 + i * 34} width="70" height="16" rx="8"
            fill={e.statut === "Disponible" ? "#22C55E22" : e.statut === "Emprunté" ? "#FBBF2422" : "#FF444422"} />
          <text x="308" y={173 + i * 34} fontSize="8.5" fontFamily="sans-serif"
            fill={e.statut === "Disponible" ? "#22C55E" : e.statut === "Emprunté" ? "#FBBF24" : "#FF4444"}>{e.statut}</text>
        </g>
      ))}

      {/* Bottom */}
      <rect x="128" y="302" width="252" height="28" rx="4" fill="#13151F" />
      <rect x="136" y="308" width="86" height="16" rx="4" fill={color + "22"} />
      <text x="146" y="320" fontSize="9.5" fill={color} fontFamily="sans-serif">📱 Scanner QR</text>
      <rect x="230" y="308" width="80" height="16" rx="4" fill="#FBBF2422" />
      <text x="240" y="320" fontSize="9.5" fill="#FBBF24" fontFamily="sans-serif">🔄 Nouvel emprunt</text>
    </svg>
  );
}

const MOCKUPS = {
  electroshop: MockupElectroShop,
  gestloc: MockupGestLoc,
  gestmag: MockupGestMag,
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LogicielsSection() {
  const [active, setActive] = useState(0);
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true, margin: "-80px" });
  const s = SOFTS[active];
  const Mockup = MOCKUPS[s.id];

  return (
    <section id="logiciels" style={{ padding: "7rem 0", background: DS.bg, position: "relative", overflow: "hidden" }}>
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${s.color}08, transparent)`, transition: "background .6s", pointerEvents: "none" }} />

      <Container>
        {/* Header */}
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: FONTS.mono, fontSize: ".68rem", color: DS.lime, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: "1rem" }}>
            <span style={{ width: 28, height: 1, background: DS.lime }} />Nos logiciels opérationnels
          </div>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: "clamp(2.2rem,4.5vw,3.8rem)", color: DS.white, marginBottom: "1rem", lineHeight: 1.1 }}>
            3 logiciels <span style={{ color: DS.lime }}>prêts à déployer</span>
          </h2>
          <p style={{ fontFamily: FONTS.body, fontSize: "1.05rem", color: DS.gray2, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            Développés et testés à Douala. Disponibles immédiatement, sans abonnement cloud, sans connexion internet requise.
          </p>
        </motion.div>

        {/* Tab selector */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2, duration: .6 }}
          style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: "3rem", flexWrap: "wrap" }}>
          {SOFTS.map((soft, i) => (
            <motion.button
              key={soft.id}
              onClick={() => setActive(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: .97 }}
              style={{
                padding: "10px 24px", borderRadius: 100, border: `1px solid ${active === i ? soft.color : DS.border}`,
                background: active === i ? soft.color + "18" : "transparent",
                color: active === i ? soft.color : DS.gray2,
                fontFamily: FONTS.mono, fontSize: ".8rem", letterSpacing: ".06em",
                cursor: "pointer", transition: "all .25s",
              }}
            >
              {soft.nom} <span style={{ opacity: .6, fontSize: ".7rem" }}>{soft.version}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Main showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: .4 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3.5rem", alignItems: "start" }}
            className="rg-sidebar"
          >
            {/* Left — Info */}
            <div>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: s.color + "18", border: `1px solid ${s.color}40`, marginBottom: "1.5rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                <span style={{ fontFamily: FONTS.mono, fontSize: ".72rem", color: s.color, letterSpacing: ".1em", textTransform: "uppercase" }}>Disponible maintenant · {s.secteur}</span>
              </div>

              <h3 style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: "2.2rem", color: DS.white, marginBottom: ".5rem", lineHeight: 1.15 }}>
                {s.nom} <span style={{ fontWeight: 400, fontSize: "1.1rem", color: DS.gray2 }}>{s.version}</span>
              </h3>
              <p style={{ fontFamily: FONTS.mono, fontSize: ".82rem", color: s.color, marginBottom: "1.25rem", letterSpacing: ".04em" }}>{s.tagline}</p>
              <p style={{ fontFamily: FONTS.body, fontSize: ".95rem", color: DS.gray3, lineHeight: 1.75, marginBottom: "2rem", maxWidth: 520 }}>{s.desc}</p>

              {/* Key points */}
              <div style={{ marginBottom: "2rem" }}>
                {s.points.map((pt, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .08 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: ".75rem" }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: s.color + "22", border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span style={{ fontFamily: FONTS.body, fontSize: ".9rem", color: DS.gray3 }}>{pt}</span>
                  </motion.div>
                ))}
              </div>

              {/* Tech stack */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "2rem" }}>
                {s.tech.map(t => (
                  <span key={t} style={{ fontFamily: FONTS.mono, fontSize: ".7rem", padding: "4px 12px", borderRadius: 6, background: DS.s2, border: `1px solid ${DS.border}`, color: DS.gray2 }}>{t}</span>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <motion.a href="/contact" whileHover={{ y: -2, boxShadow: `0 8px 28px ${s.color}44` }} whileTap={{ scale: .97 }}
                  style={{ padding: "13px 28px", background: s.color, color: "#fff", border: "none", borderRadius: 100, fontFamily: FONTS.display, fontWeight: 700, fontSize: ".88rem", cursor: "pointer", textDecoration: "none", display: "inline-block", transition: "box-shadow .2s" }}>
                  Demander une démo →
                </motion.a>
                <motion.a href="/devis" whileHover={{ y: -2 }} whileTap={{ scale: .97 }}
                  style={{ padding: "13px 28px", background: "transparent", border: `1px solid ${DS.border}`, color: DS.gray3, borderRadius: 100, fontFamily: FONTS.mono, fontSize: ".8rem", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
                  Obtenir un devis
                </motion.a>
              </div>
            </div>

            {/* Right — Mockup */}
            <div>
              {/* Modules grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: "1.5rem" }}>
                {s.modules.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .04 }}
                    style={{ padding: "8px 6px", background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: ".95rem", marginBottom: 4 }}>{m.icon}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: ".6rem", color: DS.gray2, lineHeight: 1.3, letterSpacing: ".02em" }}>{m.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* App mockup */}
              <motion.div
                initial={{ opacity: 0, scale: .96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: .15, duration: .5 }}
                style={{
                  borderRadius: 14, overflow: "hidden",
                  border: `1px solid ${s.color}33`,
                  boxShadow: `0 24px 60px rgba(0,0,0,.5), 0 0 0 1px ${s.color}15`,
                  background: "#0D0F16",
                }}
              >
                <Mockup color={s.color} />
              </motion.div>
              <p style={{ fontFamily: FONTS.mono, fontSize: ".65rem", color: DS.gray, textAlign: "center", marginTop: ".75rem", letterSpacing: ".08em" }}>
                Interface réelle du logiciel
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
