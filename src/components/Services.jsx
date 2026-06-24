import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

/* ============================================================
   DESIGN SYSTEM — INFO.TECH (ui-ux-pro-max v2 / HUD Sci-Fi FUI)
   Style     : HUD / Sci-Fi FUI + Dark Mode OLED + Motion-Driven
   Palette   : Deep Space · Electric Emerald · Amber Signal
   Typography: Space Grotesk (display) · Geist (body) · JetBrains Mono
   ============================================================ */

const DS = {
  bg:       "#0A0E1A",
  bg2:      "#0D1221",
  surface:  "#111928",
  surface2: "#162033",
  border:   "#1E2D45",
  border2:  "#243857",
  emerald:  "#00FFB2",
  emerald2: "#00CC8E",
  gold:     "#F5C842",
  gold2:    "#D4A830",
  white:    "#E8EDF5",
  gray:     "#4A5878",
  gray2:    "#7A8FAD",
  red:      "#FF4466",
  blue:     "#3D7EFF",
};

/* Font import — add to <head> in production */
const FONTS = `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap`;

/* ============================================================
   SERVICES DATA
   ============================================================ */
const SERVICES = [
  {
    id: "web",
    code: "01",
    title: "Développement Web",
    short: "Sites vitrine · E-commerce · SaaS",
    desc:
      "Création de sites web performants et d'applications web sur mesure. Du design Figma au déploiement en production, nous gérons chaque étape avec rigueur.",
    stack: ["React", "Next.js", "Laravel", "PostgreSQL"],
    metric: { value: "80+", label: "Sites livrés" },
    color: DS.emerald,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <polyline points="8 21 12 17 16 21" />
      </svg>
    ),
  },
  {
    id: "mobile",
    code: "02",
    title: "Applications Mobiles",
    short: "iOS · Android · Cross-platform",
    desc:
      "Applications natives et cross-platform pensées pour l'utilisateur. Géolocalisation, paiement mobile money, notifications push — nous maîtrisons l'écosystème mobile africain.",
    stack: ["React Native", "Flutter", "Firebase", "Node.js"],
    metric: { value: "35+", label: "Apps publiées" },
    color: DS.blue,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "logiciel",
    code: "03",
    title: "Logiciels Métier",
    short: "ERP · CRM · Gestion sur mesure",
    desc:
      "ERP, CRM, logiciels de gestion comptable, RH et production. Des outils qui automatisent vos processus et éliminent les tâches répétitives.",
    stack: ["Python", "Django", "React", "PostgreSQL"],
    metric: { value: "28", label: "Logiciels déployés" },
    color: DS.gold,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      </svg>
    ),
  },
  {
    id: "design",
    code: "04",
    title: "Design UI/UX",
    short: "Identité visuelle · Maquettes · Branding",
    desc:
      "Du logo à la charte graphique complète, en passant par les maquettes interactives et les systèmes de design. Chaque pixel est intentionnel.",
    stack: ["Figma", "Adobe CC", "Webflow", "Framer"],
    metric: { value: "150+", label: "Identités créées" },
    color: "#B06EFF",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
  {
    id: "maintenance",
    code: "05",
    title: "Maintenance IT",
    short: "Préventive · Curative · Télémaintenance",
    desc:
      "Contrats de maintenance, dépannage express et supervision à distance de votre parc informatique. SLA garanti, intervention sous 2h en urgence.",
    stack: ["Windows", "Linux", "Cisco", "VMware"],
    metric: { value: "2h", label: "Délai urgence" },
    color: DS.red,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "assistance",
    code: "06",
    title: "Assistance Informatique",
    short: "Audit SI · Formation · Conseil",
    desc:
      "Audit de votre système d'information, conseil stratégique, installation réseau et formation de vos équipes. Votre DSI externalisé.",
    stack: ["Audit SI", "LAN/WAN", "Cloud", "Formation"],
    metric: { value: "500+", label: "Interventions/an" },
    color: "#00D4FF",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
function useCounter(target, inView, duration = 1.8) {
  const [count, setCount] = useState("0");
  const isNum = !isNaN(parseInt(target));

  useState(() => {
    if (!inView || !isNum) return;
    const num = parseInt(target);
    const suffix = target.replace(/[0-9]/g, "");
    const start = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * num);
      setCount(current + suffix);
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  });

  return isNum ? count : target;
}

/* ============================================================
   HUD CORNER DECORATION
   ============================================================ */
function HudCorners({ color, size = 12, thickness = 1.5 }) {
  const s = { position: "absolute", width: size, height: size };
  const b = `${thickness}px solid ${color}`;
  return (
    <>
      <span style={{ ...s, top: 0, left: 0, borderTop: b, borderLeft: b }} />
      <span style={{ ...s, top: 0, right: 0, borderTop: b, borderRight: b }} />
      <span style={{ ...s, bottom: 0, left: 0, borderBottom: b, borderLeft: b }} />
      <span style={{ ...s, bottom: 0, right: 0, borderBottom: b, borderRight: b }} />
    </>
  );
}

/* ============================================================
   SERVICE CARD — large interactive card
   ============================================================ */
function ServiceCard({ svc, index, isActive, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{ position: "relative", cursor: "pointer" }}
    >
      {/* Card body */}
      <motion.div
        animate={{
          borderColor: isActive
            ? svc.color + "66"
            : hov
            ? DS.border2
            : DS.border,
          background: isActive ? DS.surface2 : hov ? DS.surface2 : DS.surface,
          y: hov && !isActive ? -6 : 0,
        }}
        transition={{ duration: 0.25 }}
        style={{
          borderRadius: 14,
          border: `1px solid ${DS.border}`,
          padding: "1.75rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow on active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${svc.color}12 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        {/* HUD corners */}
        <HudCorners color={isActive ? svc.color : hov ? DS.border2 : "transparent"} size={10} />

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Code */}
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: ".65rem", color: svc.color,
              letterSpacing: ".12em", opacity: .7,
            }}>
              {svc.code}
            </span>
            {/* Icon box */}
            <motion.div
              animate={{ borderColor: isActive || hov ? svc.color + "55" : DS.border }}
              style={{
                width: 48, height: 48,
                borderRadius: 10,
                border: `1px solid ${DS.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: svc.color,
                background: `${svc.color}0D`,
                transition: "border-color .25s",
              }}
            >
              {svc.icon}
            </motion.div>
          </div>

          {/* Metric */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "1.5rem",
              color: svc.color, lineHeight: 1,
            }}>
              {svc.metric.value}
            </div>
            <div style={{ fontSize: ".65rem", color: DS.gray, letterSpacing: ".06em", marginTop: 2 }}>
              {svc.metric.label}
            </div>
          </div>
        </div>

        {/* Title + short */}
        <div style={{ marginBottom: ".75rem" }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: "1.05rem",
            color: DS.white, marginBottom: ".2rem",
          }}>
            {svc.title}
          </h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: ".7rem", color: DS.gray2, letterSpacing: ".04em" }}>
            {svc.short}
          </p>
        </div>

        {/* Expandable desc */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p style={{
                fontSize: ".88rem", color: DS.gray2,
                lineHeight: 1.8, marginBottom: "1.25rem",
                fontWeight: 300,
              }}>
                {svc.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stack chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {svc.stack.map((t) => (
            <span key={t} style={{
              fontSize: ".65rem", fontWeight: 600,
              letterSpacing: ".07em", textTransform: "uppercase",
              padding: "3px 8px", borderRadius: 4,
              background: `${svc.color}0F`,
              border: `1px solid ${svc.color}22`,
              color: svc.color,
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Bottom line indicator */}
        <motion.div
          animate={{ scaleX: isActive || hov ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 2, background: `linear-gradient(90deg, ${svc.color}, transparent)`,
            transformOrigin: "left",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   PROCESS STEP (how we work)
   ============================================================ */
const PROCESS = [
  { num: "01", title: "Analyse",    desc: "Audit de vos besoins, étude de faisabilité et estimation précise." },
  { num: "02", title: "Design",     desc: "Maquettes interactives Figma validées avant tout développement." },
  { num: "03", title: "Livraison",  desc: "Développement agile, tests qualité et déploiement sécurisé." },
  { num: "04", title: "Support",    desc: "Suivi post-livraison, mises à jour et maintenance continue." },
];

function ProcessStep({ step, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}
    >
      {/* Number + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: `${DS.emerald}14`,
          border: `1px solid ${DS.emerald}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: ".72rem", fontWeight: 500, color: DS.emerald,
        }}>
          {step.num}
        </div>
        {index < PROCESS.length - 1 && (
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: 48 } : {}}
            transition={{ delay: index * 0.12 + 0.3, duration: 0.5 }}
            style={{ width: 1, background: `linear-gradient(to bottom, ${DS.emerald}44, transparent)`, marginTop: 4 }}
          />
        )}
      </div>
      {/* Text */}
      <div style={{ paddingTop: 8, paddingBottom: index < PROCESS.length - 1 ? 24 : 0 }}>
        <h4 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: ".95rem", color: DS.white,
          marginBottom: ".3rem",
        }}>
          {step.title}
        </h4>
        <p style={{ fontSize: ".85rem", color: DS.gray2, lineHeight: 1.7, fontWeight: 300 }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ============================================================
   STATS BAND
   ============================================================ */
const STATS = [
  { value: "120+", label: "Projets livrés",      color: DS.emerald },
  { value: "85",   label: "Clients PME actifs",   color: DS.blue    },
  { value: "98%",  label: "Taux de satisfaction", color: DS.gold    },
  { value: "8 ans", label: "D'expérience",        color: "#B06EFF"  },
];

function StatsBand() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="rg-4"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        background: DS.border,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: "5rem",
        border: `1px solid ${DS.border}`,
      }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          style={{
            background: DS.surface,
            padding: "2rem 1.5rem",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "2.2rem",
              color: s.color, lineHeight: 1, marginBottom: ".3rem",
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: ".75rem", color: DS.gray2, letterSpacing: ".06em" }}>
              {s.label}
            </div>
          </motion.div>
        </div>
      ))}
    </motion.div>
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
      <span style={{ width: 28, height: 1, background: DS.emerald, display: "block" }} />
      {text}
    </div>
  );
}

/* ============================================================
   SERVICES SECTION — MAIN EXPORT
   ============================================================ */
export default function ServicesSection() {
  const [activeId, setActiveId] = useState(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  const handleClick = (id) => setActiveId(prev => prev === id ? null : id);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: DS.bg2,
        overflow: "hidden",
        padding: "6rem 0 5rem",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Import fonts */}
      <style>{`@import url('${FONTS}');`}</style>

      {/* Animated background grid */}
      <motion.div
        style={{
          position: "absolute", inset: "-10%",
          backgroundImage: `
            linear-gradient(${DS.emerald}06 1px, transparent 1px),
            linear-gradient(90deg, ${DS.emerald}06 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          y: bgY,
          pointerEvents: "none",
        }}
      />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 100% 60% at 50% 50%, transparent 40%, ${DS.bg2} 85%)`,
      }} />

      <div style={{ maxWidth: 1680, width: "100%", margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3.5rem)", position: "relative", zIndex: 2, boxSizing: "border-box" }}>

        {/* Stats band */}
        <StatsBand />

        {/* Section header */}
        <div ref={titleRef} className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "end", marginBottom: "3.5rem" }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow text="Nos services" />
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                color: DS.white, lineHeight: 1.1,
                letterSpacing: "-.02em",
              }}>
                Ce que nous{" "}
                <span style={{
                  WebkitTextFillColor: "transparent",
                  WebkitTextStroke: `1px ${DS.emerald}`,
                }}>
                  construisons
                </span>
              </h2>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p style={{ color: DS.gray2, fontSize: "1rem", lineHeight: 1.8, fontWeight: 300 }}>
              Des solutions numériques complètes, conçues pour les besoins réels des PME camerounaises et africaines. Cliquez sur un service pour en savoir plus.
            </p>
          </motion.div>
        </div>

        {/* Services grid */}
        <div className="rg-3" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.25rem",
          marginBottom: "5rem",
        }}>
          {SERVICES.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              svc={svc}
              index={i}
              isActive={activeId === svc.id}
              onClick={() => handleClick(svc.id)}
            />
          ))}
        </div>

        {/* How we work — process + CTA */}
        <div className="rg-split" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          gap: "4rem",
          alignItems: "start",
        }}>
          {/* Process */}
          <div>
            <Eyebrow text="Notre méthode" />
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "1.6rem",
              color: DS.white, marginBottom: "2rem",
              letterSpacing: "-.01em",
            }}>
              Comment nous travaillons
            </h3>
            <div>
              {PROCESS.map((step, i) => (
                <ProcessStep key={step.num} step={step} index={i} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="rg-sep" style={{ background: DS.border, height: "100%", minHeight: 300 }} />

          {/* CTA Panel */}
          <CtaPanel />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA PANEL
   ============================================================ */
function CtaPanel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Eyebrow text="Démarrer un projet" />
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: "1.6rem",
        color: DS.white, marginBottom: "1rem",
        letterSpacing: "-.01em", lineHeight: 1.2,
      }}>
        Votre projet mérite une équipe dédiée
      </h3>
      <p style={{ color: DS.gray2, fontSize: ".92rem", lineHeight: 1.8, marginBottom: "2rem", fontWeight: 300 }}>
        Décrivez-nous votre besoin. Nous vous répondons avec un devis détaillé sous 24h, sans engagement.
      </p>

      {/* Guarantee chips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "2rem" }}>
        {[
          { label: "Devis gratuit sous 24h",    color: DS.emerald },
          { label: "Sans engagement",           color: DS.gold    },
          { label: "Garantie satisfaction",     color: DS.blue    },
        ].map((chip) => (
          <div key={chip.label} style={{
            display: "flex", alignItems: "center", gap: 10,
            fontSize: ".85rem", color: DS.white,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: chip.color, flexShrink: 0 }} />
            {chip.label}
          </div>
        ))}
      </div>

      {/* CTA button */}
      <motion.button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        whileTap={{ scale: 0.96 }}
        style={{
          width: "100%",
          background: hov ? DS.emerald2 : DS.emerald,
          color: DS.bg, border: "none",
          borderRadius: 10, padding: "14px 24px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: ".92rem",
          letterSpacing: ".02em",
          transition: "background .2s, transform .2s, box-shadow .2s",
          transform: hov ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hov ? `0 8px 32px ${DS.emerald}44` : "none",
          cursor: "pointer",
        }}
      >
        Demander un devis gratuit
      </motion.button>

      {/* Secondary link */}
      <motion.a
        href="#portfolio"
        whileHover={{ x: 4 }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          marginTop: "1rem", fontSize: ".82rem",
          color: DS.gray2, justifyContent: "center",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        Voir nos réalisations
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </motion.a>

      {/* HUD decorative panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.8 }}
        style={{
          marginTop: "2rem",
          padding: "1rem 1.25rem",
          borderRadius: 10,
          background: DS.surface,
          border: `1px solid ${DS.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <HudCorners color={DS.emerald + "44"} size={8} />
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: ".68rem", color: DS.emerald, marginBottom: ".5rem", letterSpacing: ".08em" }}>
          // disponibilité.actuelle
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }}
          />
          <span style={{ fontSize: ".82rem", color: DS.white }}>
            Acceptons de nouveaux projets — Mai 2025
          </span>
        </div>
        {/* Animated scan line */}
        <motion.div
          animate={{ x: ["0%", "110%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          style={{
            position: "absolute", top: 0, left: "-10%",
            width: "20%", height: "100%",
            background: `linear-gradient(90deg, transparent, ${DS.emerald}10, transparent)`,
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
