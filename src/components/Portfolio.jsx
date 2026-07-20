import { useTheme } from "../lib/theme.jsx";
import { useState, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  LayoutGroup,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ============================================================
   DESIGN SYSTEM — INFO.TECH (ui-ux-pro-max · HUD Sci-Fi FUI)
   Extending Part 1 & 2 tokens
   ============================================================ */
const DARK_P = {
  bg:      "#0A0E1A",
  bg2:     "#0D1221",
  surface: "#111928",
  s2:      "#162033",
  border:  "#1E2D45",
  b2:      "#243857",
  emerald: "#00FFB2",
  em2:     "#00CC8E",
  gold:    "#F5C842",
  white:   "#E8EDF5",
  gray:    "#4A5878",
  gray2:   "#7A8FAD",
};

const LIGHT_P = {
  bg:      "#F7F9FC",
  bg2:     "#FFFFFF",
  surface: "#FFFFFF",
  s2:      "#F1F4F9",
  border:  "#D7DEE7",
  b2:      "#B7C2D0",
  emerald: "#059669",
  em2:     "#047857",
  gold:    "#B45309",
  white:   "#0B1220",
  gray:    "#9AA7B8",
  gray2:   "#54627A",
};

// DS mutable : réécrit par le thème actif (voir PortfolioSection ci-dessous).
const DS = { ...DARK_P };

const FONTS = `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap`;

/* ============================================================
   PORTFOLIO DATA
   ============================================================ */
const PROJECTS = [
  {
    id: "p1",
    slug: "electroshop-pro",
    cat: "logiciel",
    catLabel: "Logiciel Métier",
    title: "ElectroShop Pro\nv2.6",
    year: "2024",
    client: "Disponible maintenant",
    duration: "Déploiement immédiat",
    budget: "Sur devis",
    role: "Logiciel desktop PME",
    stack: ["Python", "PyQt6", "SQLite", "ReportLab", "Matplotlib"],
    desc: "Logiciel complet de gestion pour boutiques d'électronique et d'électroménager. Caisse, stocks, fournisseurs, clients, commandes, retours, livraisons, comptabilité et tableaux de bord analytiques — tout en un.",
    challenge: "Fonctionner sans connexion internet avec sauvegarde locale automatique, gestion multi-caisses et rapports PDF en un clic.",
    result: "Logiciel opérationnel disponible dès aujourd'hui. Modules : Ventes · Stocks · Fournisseurs · Clients · Comptabilité · Analytics.",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=700&fit=crop&q=80",
    thumb: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&q=80",
    color: "#FF8C00",
    size: "large",
    status: "livré",
    badge: "OPÉRATIONNEL",
  },
  {
    id: "p2",
    slug: "gestloc",
    cat: "logiciel",
    catLabel: "Logiciel Métier",
    title: "GestLoc\nv4",
    year: "2024",
    client: "Disponible maintenant",
    duration: "Déploiement immédiat",
    budget: "Sur devis",
    role: "Logiciel desktop PME",
    stack: ["Python", "PyQt6", "SQLite", "ReportLab", "Matplotlib"],
    desc: "Logiciel complet de gestion locative immobilière. Biens, propriétaires, locataires, contrats PDF, quittances, relances automatiques, charges, comptabilité et suivi d'échéances.",
    challenge: "Gérer automatiquement les relances de loyers en retard et générer les documents légaux (contrats, quittances) en quelques clics.",
    result: "Logiciel opérationnel disponible dès aujourd'hui. Modules : Biens · Contrats PDF · Paiements · Relances · Comptabilité.",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=700&fit=crop&q=80",
    thumb: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&q=80",
    color: "#00C896",
    size: "medium",
    status: "livré",
    badge: "OPÉRATIONNEL",
  },
  {
    id: "p3",
    slug: "gestmag",
    cat: "logiciel",
    catLabel: "Logiciel Métier",
    title: "GestMag\nv3.0.0",
    year: "2024",
    client: "Disponible maintenant",
    duration: "Déploiement immédiat",
    budget: "Sur devis",
    role: "Logiciel desktop PME",
    stack: ["Python", "PyQt6", "SQLite", "QR Code", "ReportLab"],
    desc: "Logiciel de gestion d'équipements et de stock avec génération de QR codes, suivi des emprunts, planning de maintenance, gestion fournisseurs, import CSV et rapports PDF automatisés.",
    challenge: "Permettre le suivi précis de chaque équipement (entrées/sorties, emprunts, maintenance) avec un système QR code intégré.",
    result: "Logiciel opérationnel disponible dès aujourd'hui. Modules : Équipements · QR Codes · Stock · Emprunts · Maintenance · Rapports PDF.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=700&fit=crop&q=80",
    thumb: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&q=80",
    color: "#3D7EFF",
    size: "small",
    status: "livré",
    badge: "OPÉRATIONNEL",
  },
  {
    id: "p4",
    slug: "alpha-brand",
    cat: "design",
    catLabel: "Design UI/UX",
    title: "Cabinet Alpha\nIdentité Visuelle",
    year: "Sur devis",
    client: "Développé sur devis",
    duration: "3 semaines",
    budget: "Sur devis",
    role: "Brand + UI Design",
    stack: ["Figma", "Adobe CC", "Webflow", "Lottie"],
    desc: "Refonte complète d'identité pour un cabinet d'avocats : logo, charte graphique, site web animé, supports print (cartes, en-têtes, plaquettes) et templates réseaux sociaux.",
    challenge: "Allier le sérieux de la profession juridique avec une identité moderne qui se démarque des concurrents traditionnels.",
    result: "Développement web sur mesure : sites vitrine, e-commerce, SaaS. Livraison en 2 à 4 semaines.",
    img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=700&fit=crop&q=80",
    thumb: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop&q=80",
    color: "#B06EFF",
    size: "medium",
  },
  {
    id: "p5",
    slug: "sante-plus",
    cat: "mobile",
    catLabel: "App Mobile",
    title: "SantéPlus\nTélémédecine",
    year: "Sur devis",
    client: "Développé sur devis",
    duration: "5 mois",
    budget: "Sur devis",
    role: "Fullstack + UX",
    stack: ["Flutter", "Firebase", "Django REST", "Stripe", "WebRTC"],
    desc: "Application de téléconsultation médicale avec prise de RDV, dossiers patients sécurisés (HIPAA-compliant), ordonnances numériques signées et appels vidéo intégrés.",
    challenge: "Sécuriser les données médicales sensibles selon les normes internationales sur une infrastructure cloud africaine.",
    result: "Gestion centralisée dossiers patients. RDV en ligne. Facturation automatisée.",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=700&fit=crop&q=80",
    thumb: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&q=80",
    color: "#00D4FF",
    size: "large",
  },
  {
    id: "p6",
    slug: "caisse-fashion",
    cat: "logiciel",
    catLabel: "Logiciel Métier",
    title: "SmartCaisse\nMulti-sites",
    year: "Sur devis",
    client: "Développé sur devis",
    duration: "5 semaines",
    budget: "Sur devis",
    role: "Dev + Déploiement",
    stack: ["Electron.js", "SQLite", "Node.js", "React", "Socket.io"],
    desc: "Logiciel de caisse enregistreuse multi-sites avec synchronisation temps réel, gestion des stocks, rapports journaliers automatiques et mode hors-ligne.",
    challenge: "Fonctionner parfaitement sans internet (mode hors-ligne) et synchroniser les données dès la reconnexion.",
    result: "SmartCaisse : logiciel POS opérationnel, mode hors-ligne complet, gestion multi-caisses.",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=700&fit=crop&q=80",
    thumb: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80",
    color: DS.emerald,
    size: "small",
  },
  {
    id: "p7",
    slug: "portail-rh",
    cat: "web",
    catLabel: "Développement Web",
    title: "PortailRH\nSelf-Service",
    year: "Sur devis",
    client: "Développé sur devis",
    duration: "2 mois",
    budget: "Sur devis",
    role: "Fullstack",
    stack: ["Vue.js", "Laravel", "MySQL", "Redis", "PDF.js"],
    desc: "Portail RH self-service pour 200 employés : demandes de congés, fiches de paie numériques, évaluations annuelles, recrutement et organigramme dynamique.",
    challenge: "Former 200 employés avec des niveaux d'alphabétisation numérique très variés — UX simplifiée au maximum.",
    result: "Concept : logiciel RH pour gérer employés, congés et paies. Développement sur devis.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=700&fit=crop&q=80",
    thumb: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&q=80",
    color: "#3D7EFF",
    size: "medium",
  },
  {
    id: "p8",
    slug: "datacam",
    cat: "design",
    catLabel: "Design UI/UX",
    title: "DataCam\nDashboard SaaS",
    year: "Sur devis",
    client: "Développé sur devis",
    duration: "6 semaines",
    budget: "Sur devis",
    role: "UI/UX Design",
    stack: ["Figma", "D3.js", "Tailwind CSS", "Framer"],
    desc: "Système de design complet pour une plateforme analytics SaaS : composants Figma, design tokens, thème sombre/clair, visualisations de données et documentation.",
    challenge: "Créer un système de design évolutif utilisable par une équipe dev sans designer permanent.",
    result: "Design UI/UX : identité visuelle, maquettes Figma, systèmes de design. Sur devis.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop&q=80",
    thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80",
    color: "#B06EFF",
    size: "small",
  },
];

const FILTERS = [
  { id: "all",      label: "Tous les projets" },
  { id: "web",      label: "Web"              },
  { id: "mobile",   label: "Mobile"           },
  { id: "logiciel", label: "Logiciel"         },
  { id: "design",   label: "Design"           },
];

/* ============================================================
   HUD CORNER BRACKETS
   ============================================================ */
function Brackets({ color = DS.emerald, size = 10, w = 1.5 }) {
  const b = `${w}px solid ${color}`;
  const s = { position: "absolute", width: size, height: size };
  return (
    <>
      <span style={{ ...s, top: 0,  left: 0,  borderTop: b, borderLeft: b  }} />
      <span style={{ ...s, top: 0,  right: 0, borderTop: b, borderRight: b }} />
      <span style={{ ...s, bottom: 0, left: 0,  borderBottom: b, borderLeft: b  }} />
      <span style={{ ...s, bottom: 0, right: 0, borderBottom: b, borderRight: b }} />
    </>
  );
}

/* ============================================================
   FILTER BAR — morphing pill
   ============================================================ */
function FilterBar({ active, onChange }) {
  const ref = useRef(null);
  return (
    <div
      ref={ref}
      style={{
        display: "flex", gap: 6, flexWrap: "wrap",
        marginBottom: "3.5rem",
      }}
    >
      <LayoutGroup>
        {FILTERS.map((f) => {
          const isActive = active === f.id;
          return (
            <motion.button
              key={f.id}
              onClick={() => onChange(f.id)}
              layout
              style={{
                position: "relative",
                padding: "8px 20px",
                borderRadius: 100,
                border: `1px solid ${isActive ? "transparent" : DS.border}`,
                background: "transparent",
                color: isActive ? DS.bg : DS.gray2,
                fontSize: ".82rem",
                fontWeight: 600,
                letterSpacing: ".04em",
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
                transition: "color .2s",
                zIndex: 1,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="filter-pill"
                  style={{
                    position: "absolute", inset: 0,
                    borderRadius: 100,
                    background: DS.emerald,
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {f.label}
            </motion.button>
          );
        })}
      </LayoutGroup>

      {/* Project count */}
      <motion.span
        key={active}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginLeft: "auto",
          fontFamily: "'DM Mono', monospace",
          fontSize: ".72rem", color: DS.gray,
          alignSelf: "center", letterSpacing: ".08em",
        }}
      >
        {active === "all" ? PROJECTS.length : PROJECTS.filter(p => p.cat === active).length} projets
      </motion.span>
    </div>
  );
}

/* ============================================================
   MAGNETIC HOVER EFFECT on card
   ============================================================ */
function useMagnet(strength = 0.25) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, []);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, []);

  return { sx, sy, onMove, onLeave };
}

/* ============================================================
   PROJECT CARD — 3 sizes with layout animation
   ============================================================ */
function ProjectCard({ project, index, onClick }) {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { sx, sy, onMove, onLeave } = useMagnet(0.18);

  const imgScale = hov ? 1.07 : 1;

  /* Height per size */
  const heights = { large: 440, medium: 340, small: 260 };
  const h = heights[project.size] ?? 300;

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      exit={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { delay: index * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        y:       { delay: index * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        filter:  { delay: index * 0.07, duration: 0.5 },
      }}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => { onLeave(); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      onClick={() => onClick(project)}
    >
      <motion.div
        animate={{
          borderColor: hov ? project.color + "55" : DS.border,
          boxShadow: hov
            ? `0 24px 60px rgba(0,0,0,.6), 0 0 0 1px ${project.color}22`
            : "none",
        }}
        transition={{ duration: 0.25 }}
        style={{
          borderRadius: 16,
          border: `1px solid ${DS.border}`,
          overflow: "hidden",
          background: DS.surface,
          cursor: "pointer",
          position: "relative",
          height: h,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <motion.img
            src={project.thumb}
            alt={project.title}
            animate={{ scale: imgScale }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", display: "block",
            }}
            loading="lazy"
          />
          {/* dark overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, transparent 30%, ${DS.bg} 100%)`,
          }} />

          {/* Badge concept */}
          {project.status === 'concept' && (
            <div style={{
              position: "absolute", top: 12, left: 12,
              background: "rgba(10,12,20,.82)", backdropFilter: "blur(6px)",
              border: `1px solid ${DS.gray}44`, borderRadius: 6,
              padding: "4px 10px",
              fontFamily: "'DM Mono', monospace", fontSize: ".6rem",
              color: DS.gray2, letterSpacing: ".1em", textTransform: "uppercase",
            }}>
              Concept · Sur devis
            </div>
          )}
          {project.status === 'livré' && (
            <div style={{
              position: "absolute", top: 12, left: 12,
              background: `${DS.emerald}22`, backdropFilter: "blur(6px)",
              border: `1px solid ${DS.emerald}44`, borderRadius: 6,
              padding: "4px 10px",
              fontFamily: "'DM Mono', monospace", fontSize: ".6rem",
              color: DS.emerald, letterSpacing: ".1em", textTransform: "uppercase",
            }}>
              ✓ Opérationnel
            </div>
          )}

          {/* Hover reveal: view label */}
          <AnimatePresence>
            {hov && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  background: project.color,
                  color: DS.bg,
                  padding: "10px 22px",
                  borderRadius: 100,
                  fontSize: ".78rem",
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 600,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Voir le projet →
              </motion.div>
            )}
          </AnimatePresence>

          {/* HUD corners on hover */}
          <AnimatePresence>
            {hov && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              >
                <Brackets color={project.color} size={14} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div style={{ padding: "1rem 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".4rem" }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: ".65rem", color: project.color,
              letterSpacing: ".1em", textTransform: "uppercase",
            }}>
              {project.catLabel}
            </span>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: ".62rem",
              letterSpacing: ".06em",
              padding: "2px 8px", borderRadius: 4,
              background: project.status === 'livré' ? `${DS.emerald}18` : `${DS.gray}12`,
              border: `1px solid ${project.status === 'livré' ? DS.emerald + '44' : DS.gray + '33'}`,
              color: project.status === 'livré' ? DS.emerald : DS.gray2,
            }}>
              {project.badge || project.year}
            </span>
          </div>
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: project.size === "large" ? "1.5rem" : "1.2rem",
            color: DS.white, lineHeight: 1.1,
            letterSpacing: ".03em",
            whiteSpace: "pre-line",
          }}>
            {project.title}
          </h3>

          {/* Stack pills — show on large only */}
          {project.size === "large" && (
            <div style={{ display: "flex", gap: 5, marginTop: ".6rem", flexWrap: "wrap" }}>
              {project.stack.slice(0, 4).map((t) => (
                <span key={t} style={{
                  fontSize: ".6rem", fontWeight: 600,
                  letterSpacing: ".07em", textTransform: "uppercase",
                  padding: "2px 7px", borderRadius: 3,
                  background: `${project.color}0F`,
                  border: `1px solid ${project.color}22`,
                  color: project.color,
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

/* ============================================================
   PROJECT MODAL — full cinematic overlay
   ============================================================ */
function ProjectModal({ project, onClose }) {
  const { scrollYProgress } = useScroll();
  const prog = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  /* Close on Escape */
  useState(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 900,
        background: "rgba(10,14,26,.85)",
        backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem",
        overflowY: "auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: DS.surface,
          border: `1px solid ${DS.b2}`,
          borderRadius: 20,
          width: "100%", maxWidth: 900,
          overflow: "hidden",
          position: "relative",
          margin: "auto",
        }}
      >
        {/* Close */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(10,14,26,.8)",
            border: `1px solid ${DS.border}`,
            color: DS.white, fontSize: "1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: "background .2s",
          }}
        >
          ✕
        </motion.button>

        {/* Hero image */}
        <div style={{ position: "relative", height: 340, overflow: "hidden" }}>
          <motion.img
            src={project.img}
            alt={project.title}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, transparent 40%, ${DS.surface} 100%)`,
          }} />
          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              position: "absolute", top: 16, left: 16,
              background: project.color,
              color: DS.bg,
              padding: "5px 14px", borderRadius: 100,
              fontSize: ".68rem", fontFamily: "'DM Mono', monospace",
              fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase",
            }}
          >
            {project.catLabel}
          </motion.div>

          {/* Title overlay */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "1.5rem 2rem",
          }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                color: DS.white, lineHeight: 1.05,
                letterSpacing: ".04em",
                whiteSpace: "pre-line",
              }}
            >
              {project.title}
            </motion.h2>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "2rem" }}>
          {/* Meta grid */}
          <motion.div
            className="rg-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1px",
              background: DS.border,
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: "2rem",
              border: `1px solid ${DS.border}`,
            }}
          >
            {[
              { label: "Client",   value: project.client   },
              { label: "Durée",    value: project.duration  },
              { label: "Budget",   value: project.budget    },
              { label: "Rôle",     value: project.role      },
            ].map((m) => (
              <div key={m.label} style={{ background: DS.s2, padding: "1rem" }}>
                <div style={{
                  fontSize: ".65rem", color: DS.gray,
                  textTransform: "uppercase", letterSpacing: ".1em",
                  fontFamily: "'DM Mono', monospace", marginBottom: ".25rem",
                }}>
                  {m.label}
                </div>
                <div style={{ fontSize: ".88rem", color: DS.white, fontWeight: 600 }}>
                  {m.value}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Content columns */}
          <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            {/* Left: desc + challenge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionBlock title="À propos du projet" color={project.color}>
                <p style={{ fontSize: ".9rem", color: DS.gray2, lineHeight: 1.8, fontWeight: 300 }}>
                  {project.desc}
                </p>
              </SectionBlock>
              <SectionBlock title="Défi technique" color={project.color} mt>
                <p style={{ fontSize: ".9rem", color: DS.gray2, lineHeight: 1.8, fontWeight: 300 }}>
                  {project.challenge}
                </p>
              </SectionBlock>
            </motion.div>

            {/* Right: result + stack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Result panel */}
              <div style={{
                background: `${project.color}0C`,
                border: `1px solid ${project.color}33`,
                borderRadius: 12, padding: "1.25rem",
                marginBottom: "1.5rem",
                position: "relative", overflow: "hidden",
              }}>
                <Brackets color={project.color + "55"} size={8} />
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: ".65rem", color: project.color,
                  letterSpacing: ".1em", marginBottom: ".75rem",
                }}>
                  // résultats.mesurés
                </div>
                <p style={{ fontSize: ".88rem", color: DS.white, lineHeight: 1.8, fontWeight: 400 }}>
                  {project.result}
                </p>
                {/* Scan line */}
                <motion.div
                  animate={{ x: ["0%", "120%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                  style={{
                    position: "absolute", top: 0, left: "-15%",
                    width: "15%", height: "100%",
                    background: `linear-gradient(90deg, transparent, ${project.color}18, transparent)`,
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Stack */}
              <SectionBlock title="Stack technique" color={project.color}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {project.stack.map((t) => (
                    <span key={t} style={{
                      fontSize: ".72rem", fontWeight: 600,
                      letterSpacing: ".07em", textTransform: "uppercase",
                      padding: "5px 12px", borderRadius: 6,
                      background: `${project.color}10`,
                      border: `1px solid ${project.color}30`,
                      color: project.color,
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </SectionBlock>
            </motion.div>
          </div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            style={{ display: "flex", gap: 12 }}
          >
            <ModalCta label="Projet similaire →" color={project.color} primary />
            <ModalCta label="Fermer" color={project.color} onClick={onClose} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SectionBlock({ title, color, children, mt }) {
  return (
    <div style={{ marginTop: mt ? "1.25rem" : 0 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginBottom: ".6rem",
      }}>
        <span style={{ width: 16, height: 1, background: color }} />
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: ".65rem", color: color,
          letterSpacing: ".1em", textTransform: "uppercase",
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function ModalCta({ label, color, primary, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      style={{
        padding: "12px 24px", borderRadius: 10,
        fontFamily: "'DM Mono', monospace",
        fontSize: ".8rem", fontWeight: 600,
        letterSpacing: ".06em", cursor: "pointer",
        border: primary ? "none" : `1px solid ${DS.border}`,
        background: primary ? (hov ? color + "CC" : color) : "transparent",
        color: primary ? DS.bg : (hov ? DS.white : DS.gray2),
        transition: "all .2s",
        transform: hov && primary ? "translateY(-2px)" : "none",
        boxShadow: hov && primary ? `0 8px 28px ${color}44` : "none",
      }}
    >
      {label}
    </motion.button>
  );
}

/* ============================================================
   MASONRY-STYLE GRID LAYOUT
   Columns: [large, medium] [small, medium] [small, large]
   ============================================================ */
function PortfolioGrid({ projects, onOpen }) {
  /* We split into 3 columns with size-aware distribution */
  const cols = [[], [], []];
  projects.forEach((p, i) => {
    cols[i % 3].push({ ...p, colIndex: i });
  });

  return (
    <div className="rg-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
      {cols.map((col, ci) => (
        <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {col.map((p, pi) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={p.colIndex}
              onClick={onOpen}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   FEATURED ROW — 2 large hero cards side by side
   ============================================================ */
function FeaturedRow({ projects, onOpen }) {
  const featured = projects.filter(p => p.size === "large").slice(0, 2);
  if (!featured.length) return null;
  return (
    <div className="rg-2" style={{
      display: "grid",
      gridTemplateColumns: featured.length > 1 ? "1fr 1fr" : "1fr",
      gap: "1.25rem",
      marginBottom: "1.25rem",
    }}>
      {featured.map((p, i) => (
        <ProjectCard key={p.id} project={p} index={i} onClick={onOpen} />
      ))}
    </div>
  );
}

/* ============================================================
   SECTION EYEBROW
   ============================================================ */
function Eyebrow({ text }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      fontFamily: "'DM Mono', monospace",
      fontSize: ".7rem", color: DS.emerald,
      letterSpacing: ".14em", textTransform: "uppercase",
      marginBottom: "1rem",
    }}>
      <span style={{ width: 28, height: 1, background: DS.emerald }} />
      {text}
    </div>
  );
}

/* ============================================================
   PORTFOLIO SECTION — MAIN EXPORT
   ============================================================ */
export default function PortfolioSection() {
  const { theme } = useTheme();
  Object.assign(DS, theme === "light" ? LIGHT_P : DARK_P);
  const [filter, setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);

  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const visible = filter === "all"
    ? PROJECTS
    : PROJECTS.filter(p => p.cat === filter);

  const featured = filter === "all" ? visible.filter(p => p.size === "large") : [];
  const rest      = filter === "all" ? visible.filter(p => p.size !== "large") : visible;

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={{
        position: "relative",
        background: DS.bg,
        padding: "6rem 0 7rem",
        overflow: "hidden",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <style>{`@import url('${FONTS}');`}</style>

      {/* Parallax grain bg */}
      <motion.div
        style={{
          position: "absolute", inset: "-10%",
          backgroundImage: `
            linear-gradient(${DS.emerald}04 1px, transparent 1px),
            linear-gradient(90deg, ${DS.emerald}04 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          y: bgY, pointerEvents: "none",
        }}
      />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 60% at 20% 50%, ${DS.emerald}06 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: 1680, width: "100%", margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3.5rem)", position: "relative", zIndex: 2, boxSizing: "border-box" }}>

        {/* Header */}
        <div
          ref={titleRef}
          className="rg-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "end",
            marginBottom: "2.5rem",
            gap: "2rem",
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow text="Portfolio" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                color: DS.white, lineHeight: 1,
                letterSpacing: ".04em",
              }}
            >
              Nos{" "}
              <motion.span
                initial={{ WebkitTextFillColor: DS.white }}
                animate={titleInView ? { WebkitTextFillColor: "transparent" } : {}}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{
                  WebkitTextStroke: `1.5px ${DS.emerald}`,
                }}
              >
                réalisations
              </motion.span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={titleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              color: DS.gray2, fontSize: ".92rem",
              lineHeight: 1.7, maxWidth: 320,
              fontWeight: 300,
            }}
          >
            2 logiciels de gestion PME opérationnels + 8 concepts sectoriels en cours de développement. Chaque projet est construit sur mesure, avec les technologies adaptées à votre métier.
          </motion.p>
        </div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FilterBar active={filter} onChange={setFilter} />
        </motion.div>

        {/* Grid */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {/* Featured row (only when "all") */}
            {featured.length > 0 && (
              <motion.div
                key="featured"
                layout
                className="rg-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                {featured.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} onClick={setSelected} />
                ))}
              </motion.div>
            )}

            {/* Rest in 3-col masonry */}
            <motion.div
              key={`grid-${filter}`}
              layout
              className="rg-3"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
            >
              <AnimatePresence mode="popLayout">
                {rest.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} onClick={setSelected} />
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>

        {/* Empty state */}
        <AnimatePresence>
          {visible.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "5rem 0", color: DS.gray }}
            >
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: ".75rem", letterSpacing: ".1em" }}>
                // aucun.projet.trouvé
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA → Devis */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: "center", marginTop: "3rem" }}
        >
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: ".78rem", color: DS.gray2, marginBottom: "1.25rem", letterSpacing: ".04em" }}>
            Vous avez un projet en tête ? Obtenez une estimation en 2 minutes.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a
              href="/devis"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "13px 32px",
                background: DS.emerald,
                color: DS.bg,
                border: "none",
                borderRadius: 100,
                fontFamily: "'DM Mono', monospace",
                fontSize: ".82rem",
                letterSpacing: ".08em",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
                fontWeight: 700,
              }}
            >
              Demander un devis gratuit →
            </motion.a>
            <motion.a
              href="/contact"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "13px 32px",
                background: "transparent",
                border: `1px solid ${DS.border}`,
                borderRadius: 100,
                color: DS.gray2,
                fontSize: ".82rem",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: ".08em",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Nous contacter
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
