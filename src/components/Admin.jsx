import { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  clientsService, interventionsService, invoicesService,
  productsService, ordersService, reviewsService,
  contactsService, quotesService, appointmentsService,
} from "../lib/supabase.js";

/* ============================================================
   DESIGN SYSTEM — INFO.TECH · Partie 6 · ADMIN DASHBOARD
   Aesthetic  : Military Operations Room · Bloomberg Terminal
   Fonts      : IBM Plex Mono (mono density) · IBM Plex Sans (labels)
   Palette    : Deep Black · Phosphor Green · Signal Amber · Alert Red
   Philosophy : Every pixel earns its place. Data density over decoration.
   ============================================================ */
const T = {
  bg:       "#030507",
  bg2:      "#060A0E",
  bg3:      "#09101A",
  panel:    "#0C1520",
  panel2:   "#0F1B28",
  border:   "#142030",
  border2:  "#1A2D40",
  phos:     "#00FF88",   // phosphor green
  phos2:    "#00CC66",
  phos3:    "#00994D",
  amber:    "#FFB800",
  amber2:   "#CC9200",
  red:      "#FF2244",
  blue:     "#0088FF",
  white:    "#C8D8E8",
  gray:     "#3A5060",
  gray2:    "#607080",
  gray3:    "#8090A0",
};

const FONTS = `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap`;

/* ============================================================
   GLOBAL ADMIN STYLES
   ============================================================ */
const AdminGlobalStyles = () => (
  <style>{`
    @import url('${FONTS}');
    .admin-root * { box-sizing: border-box; }
    .admin-root { font-family: 'IBM Plex Mono', monospace; }
    .admin-root ::-webkit-scrollbar { width: 3px; height: 3px; }
    .admin-root ::-webkit-scrollbar-track { background: ${T.bg}; }
    .admin-root ::-webkit-scrollbar-thumb { background: ${T.phos3}; border-radius: 2px; }
    .admin-root table { border-collapse: collapse; width: 100%; }
    .admin-root th {
      padding: 8px 14px; text-align: left;
      font-size: .62rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: .14em;
      color: ${T.gray2}; background: ${T.bg2};
      border-bottom: 1px solid ${T.border};
    }
    .admin-root td {
      padding: 10px 14px; font-size: .78rem;
      color: ${T.gray3}; border-bottom: 1px solid ${T.border};
    }
    .admin-root tr:hover td { background: rgba(0,255,136,.025); }
    .admin-root input, .admin-root select, .admin-root textarea {
      font-family: 'IBM Plex Mono', monospace;
      background: ${T.bg2}; border: 1px solid ${T.border2};
      color: ${T.white}; outline: none;
      border-radius: 4px; padding: 8px 12px;
      font-size: .8rem; width: 100%;
      transition: border-color .2s, box-shadow .2s;
    }
    .admin-root input:focus, .admin-root select:focus, .admin-root textarea:focus {
      border-color: ${T.phos3};
      box-shadow: 0 0 0 2px ${T.phos}18;
    }
    .admin-root select option { background: ${T.bg2}; }
    .admin-root textarea { resize: vertical; min-height: 80px; }

    /* Tables défilent horizontalement plutôt que de casser la mise en page */
    .admin-root table { min-width: 640px; }
    .admin-root div:has(> table) { overflow-x: auto; -webkit-overflow-scrolling: touch; }

    /* Sidebar réduite aux icônes sous 860px */
    @media (max-width: 860px) {
      .admin-sidebar { width: 60px !important; }
      .admin-sidebar-label { display: none !important; }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
    @keyframes glitch {
      0%,100% { clip-path: inset(0 0 100% 0); }
      20% { clip-path: inset(33% 0 33% 0); transform: translateX(-2px); }
      40% { clip-path: inset(66% 0 0% 0); transform: translateX(2px); }
      60% { clip-path: inset(10% 0 60% 0); transform: translateX(-1px); }
      80% { clip-path: inset(50% 0 10% 0); transform: translateX(1px); }
    }
  `}</style>
);

/* ============================================================
   DATA STORE
   ============================================================ */
const ORDER_STATUT_FR = { en_attente:"En attente", confirmé:"Confirmé", expédié:"Expédié", livré:"Livré", annulé:"Annulée" };
const ORDER_STATUT_DB = { "En attente":"en_attente", "Confirmé":"confirmé", "Expédié":"expédié", "Livré":"livré", "Annulée":"annulé" };
const fmtDate = d => d ? new Date(d).toLocaleDateString("fr-FR") : "";

const useStore = () => {
  const [loading, setLoading]           = useState(true);
  const [clients, setClients]           = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [factures, setFactures]         = useState([]);
  const [articles, setArticles]         = useState([]);
  const [commandes, setCommandes]       = useState([]);
  const [avis, setAvis]                 = useState([]);
  const [contacts, setContacts]         = useState([]);
  const [devis, setDevis]               = useState([]);
  const [rdv, setRdv]                   = useState([]);

  const mapArticles = rows => rows.map(a => ({
    id: a.id, name: a.name, cat: a.cat, price: Number(a.price), stock: a.stock ?? 0,
    img: a.img, description: a.description,
    statut: (a.stock ?? 0) === 0 ? "Rupture" : (a.active === false ? "Inactif" : "Actif"),
  }));
  const mapCommandes = rows => rows.map(c => ({
    id: c.id, client: c.client_name,
    produits: Array.isArray(c.items) ? c.items.map(i => `${i.name} × ${i.qty}`).join(", ") : "",
    total: Number(c.total), date: fmtDate(c.created_at),
    statut: ORDER_STATUT_FR[c.status] || c.status || "En attente",
    paiement: c.payment_status || "non_requis",
    methode: c.payment_method || "livraison",
  }));
  const mapAvis = rows => rows.map(a => ({
    id: a.id, client: a.name, service: a.service, note: a.note, date: fmtDate(a.created_at),
    statut: a.approved ? "Publié" : "Modéré",
  }));
  const mapInterventions = rows => rows.map(i => ({
    id: i.id, clientId: i.client_id, clientName: i.client_name, type: i.type, date: i.date,
    duree: i.duree, desc: i.description, montant: Number(i.montant || 0),
    statut: i.status || "Planifiée",
  }));
  const mapFactures = rows => rows.map(f => ({
    id: f.id, clientId: f.client_id, clientName: f.client_name, date: f.date, echeance: f.echeance,
    objet: f.objet, lignes: f.lignes || [], ht: Number(f.ht || 0), tva: Number(f.tva || 0), ttc: Number(f.ttc || 0),
    statut: f.status || "En attente",
  }));
  const computeClients = (rawClients, inter, fact) => rawClients.map(c => ({
    id: c.id, name: c.name, contact: c.contact, email: c.email, phone: c.phone,
    secteur: c.secteur, ville: c.ville, status: c.status || "Actif",
    interventions: inter.filter(i => i.clientId === c.id).length,
    ca: fact.filter(f => f.clientId === c.id && f.statut === "Payée").reduce((s,f) => s + f.ttc, 0),
  }));

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cl, it, fa, ar, co, av, ct, dv, rd] = await Promise.all([
        clientsService.getAll().catch(()=>[]),
        interventionsService.getAll().catch(()=>[]),
        invoicesService.getAll().catch(()=>[]),
        productsService.getAllAdmin().catch(()=>[]),
        ordersService.getAll().catch(()=>[]),
        reviewsService.getAll().catch(()=>[]),
        contactsService.getAll().catch(()=>[]),
        quotesService.getAll().catch(()=>[]),
        appointmentsService.getAll().catch(()=>[]),
      ]);
      const mappedInter = mapInterventions(it || []);
      const mappedFact   = mapFactures(fa || []);
      setInterventions(mappedInter);
      setFactures(mappedFact);
      setClients(computeClients(cl || [], mappedInter, mappedFact));
      setArticles(mapArticles(ar || []));
      setCommandes(mapCommandes(co || []));
      setAvis(mapAvis(av || []));
      setContacts(ct || []);
      setDevis(dv || []);
      setRdv(rd || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const addClient = useCallback(async (c) => {
    try {
      const [row] = await clientsService.insert({ name:c.name, contact:c.contact, email:c.email, phone:c.phone, secteur:c.secteur, ville:c.ville, status:c.status });
      setClients(p => [{ ...row, interventions:0, ca:0 }, ...p]);
    } catch (e) { console.error(e); }
  }, []);

  const addIntervention = useCallback(async (i) => {
    try {
      const [row] = await interventionsService.insert({ client_id:i.clientId, client_name:i.clientName, type:i.type, date:i.date, duree:i.duree, description:i.desc, montant:i.montant, status:i.statut || "Planifiée" });
      setInterventions(p => [{ id:row.id, clientId:row.client_id, clientName:row.client_name, type:row.type, date:row.date, duree:row.duree, desc:row.description, montant:Number(row.montant||0), statut:row.status }, ...p]);
      setClients(p => p.map(c => c.id === i.clientId ? { ...c, interventions: c.interventions + 1 } : c));
    } catch (e) { console.error(e); }
  }, []);

  const addFacture = useCallback(async (f) => {
    try {
      const row = { id:f.id, client_id:f.clientId, client_name:f.clientName, date:f.date, echeance:f.echeance, objet:f.objet, lignes:f.lignes, ht:f.ht, tva:f.tva, ttc:f.ttc, status:"En attente" };
      await invoicesService.insert(row);
      setFactures(p => [{ ...f, statut:"En attente" }, ...p]);
    } catch (e) { console.error(e); }
  }, []);

  const addArticle = useCallback(async (a) => {
    try {
      const [row] = await productsService.insert({ name:a.name, cat:a.cat, price:a.price, stock:a.stock, img:a.img, description:a.description||null, active:true });
      setArticles(p => [{ id:row.id, name:row.name, cat:row.cat, price:Number(row.price), stock:row.stock, img:row.img, description:row.description, statut: row.stock>0?"Actif":"Rupture" }, ...p]);
    } catch (e) { console.error(e); throw e; }
  }, []);

  const updateArticle = useCallback(async (id, a) => {
    try {
      await productsService.update(id, { name:a.name, cat:a.cat, price:a.price, stock:a.stock, img:a.img, description:a.description||null });
      setArticles(p => p.map(x => x.id === id ? { ...x, ...a, statut: a.stock>0?"Actif":"Rupture" } : x));
    } catch (e) { console.error(e); throw e; }
  }, []);

  const deleteClient = useCallback(async (id) => {
    try { await clientsService.delete(id); setClients(p => p.filter(c => c.id !== id)); } catch (e) { console.error(e); }
  }, []);
  const deleteArticle = useCallback(async (id) => {
    try { await productsService.delete(id); setArticles(p => p.map(a => a.id === id ? { ...a, statut: "Inactif" } : a)); } catch (e) { console.error(e); }
  }, []);
  const reactivateArticle = useCallback(async (id, stock) => {
    try { await productsService.update(id, { active:true }); setArticles(p => p.map(a => a.id === id ? { ...a, statut: stock > 0 ? "Actif" : "Rupture" } : a)); } catch (e) { console.error(e); }
  }, []);
  const deleteAvis = useCallback(async (id) => {
    try { await reviewsService.delete(id); setAvis(p => p.filter(a => a.id !== id)); } catch (e) { console.error(e); }
  }, []);
  const publishAvis = useCallback(async (id) => {
    try { await reviewsService.approve(id); setAvis(p => p.map(a => a.id === id ? { ...a, statut:"Publié" } : a)); } catch (e) { console.error(e); }
  }, []);
  const markPaid = useCallback(async (id) => {
    try { await invoicesService.updateStatus(id, "Payée"); setFactures(p => p.map(f => f.id === id ? {...f, statut:"Payée"} : f)); } catch (e) { console.error(e); }
  }, []);
  const markLivered = useCallback(async (id) => {
    try { await ordersService.updateStatus(id, "livré"); setCommandes(p => p.map(c => c.id === id ? {...c, statut:"Livré"} : c)); } catch (e) { console.error(e); }
  }, []);
  const markContactTraite = useCallback(async (id) => {
    try { await contactsService.updateStatus(id, "traité"); setContacts(p => p.map(c => c.id === id ? {...c, status:"traité"} : c)); } catch (e) { console.error(e); }
  }, []);
  const markDevisStatus = useCallback(async (id, status) => {
    try { await quotesService.updateStatus(id, status); setDevis(p => p.map(d => d.id === id ? {...d, status} : d)); } catch (e) { console.error(e); }
  }, []);
  const markRdvStatus = useCallback(async (id, status) => {
    try { await appointmentsService.updateStatus(id, status); setRdv(p => p.map(r => r.id === id ? {...r, status} : r)); } catch (e) { console.error(e); }
  }, []);

  return {
    loading, clients, interventions, factures, articles, commandes, avis, contacts, devis, rdv,
    addClient, addIntervention, addFacture, addArticle, updateArticle,
    deleteClient, deleteArticle, reactivateArticle, deleteAvis, publishAvis,
    markPaid, markLivered, markContactTraite, markDevisStatus, markRdvStatus,
    refresh: loadAll,
  };
};

/* ============================================================
   TOAST
   ============================================================ */
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

function ToastSystem({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type="ok") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{ position:"fixed", bottom:"1.5rem", left:"50%", transform:"translateX(-50%)", zIndex:2000, display:"flex", flexDirection:"column", gap:6, alignItems:"center", pointerEvents:"none" }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity:0, y:12, scale:.95 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:12, scale:.95 }}
              transition={{ type:"spring", stiffness:400, damping:28 }}
              style={{
                background: T.panel, border:`1px solid ${t.type==="ok"?T.phos:T.red}44`,
                borderRadius:4, padding:"9px 20px",
                fontFamily:"'IBM Plex Mono',monospace", fontSize:".75rem",
                color: t.type==="ok" ? T.phos : T.red,
                display:"flex", alignItems:"center", gap:10,
                letterSpacing:".06em", whiteSpace:"nowrap",
                boxShadow:`0 4px 20px rgba(0,0,0,.6)`,
              }}
            >
              <span style={{ width:5, height:5, borderRadius:"50%", background: t.type==="ok" ? T.phos : T.red, flexShrink:0 }} />
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */
const fmt = n => n.toLocaleString("fr-FR") + " FCFA";

function Badge({ label, type="ok" }) {
  const colors = {
    ok:       { bg:`${T.phos}14`, border:`${T.phos}33`, text:T.phos   },
    warn:     { bg:`${T.amber}14`,border:`${T.amber}33`,text:T.amber  },
    danger:   { bg:`${T.red}14`,  border:`${T.red}33`,  text:T.red    },
    info:     { bg:`${T.blue}14`, border:`${T.blue}33`, text:T.blue   },
    neutral:  { bg:`${T.gray}14`, border:`${T.gray}33`, text:T.gray3  },
  };
  const c = colors[type] || colors.ok;
  return (
    <span style={{
      display:"inline-block", padding:"2px 8px", borderRadius:3,
      background:c.bg, border:`1px solid ${c.border}`,
      color:c.text, fontSize:".62rem", fontWeight:600,
      letterSpacing:".1em", textTransform:"uppercase",
    }}>{label}</span>
  );
}

function statusType(s) {
  const sl = (s||"").toLowerCase();
  if (["terminée","payée","livré","publié","actif","expédié","confirmé","traité","effectué"].includes(sl)) return "ok";
  if (["en cours","en attente","en_attente","planifiée","nouveau","modéré"].includes(sl)) return "warn";
  if (["retard","rupture","inactif","annulée","annulé","refusé"].includes(sl)) return "danger";
  return "info";
}

function Cmd({ label, onClick, variant="phos", small }) {
  const [hov, setHov] = useState(false);
  const bg = { phos:T.phos, amber:T.amber, red:T.red, ghost:"transparent" }[variant];
  const fg = variant === "ghost" ? T.gray3 : T.bg;
  return (
    <motion.button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      whileTap={{ scale:.95 }}
      style={{
        padding: small ? "5px 10px" : "8px 16px",
        background: variant==="ghost" ? (hov ? T.panel2 : "transparent") : hov ? bg+"CC" : bg,
        border: variant==="ghost" ? `1px solid ${T.border2}` : "none",
        borderRadius:4, cursor:"pointer",
        fontFamily:"'IBM Plex Mono',monospace",
        fontSize: small ? ".65rem" : ".72rem",
        fontWeight:600, letterSpacing:".08em",
        color: variant==="ghost" ? (hov ? T.white : T.gray3) : fg,
        transition:"all .15s",
        display:"inline-flex", alignItems:"center", gap:6,
      }}
    >{label}</motion.button>
  );
}

function FormGroup({ label, children }) {
  return (
    <div>
      <label style={{ display:"block", fontSize:".62rem", color:T.gray2, letterSpacing:".12em", textTransform:"uppercase", marginBottom:5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Section({ title, children, action }) {
  return (
    <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:6, overflow:"hidden", marginBottom:"1.5rem" }}>
      <div style={{
        padding:"10px 16px", borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:T.bg2,
      }}>
        <span style={{ fontSize:".72rem", fontWeight:600, color:T.gray3, letterSpacing:".1em", textTransform:"uppercase" }}>
          {title}
        </span>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ============================================================
   SIDEBAR NAV
   ============================================================ */
const NAV = [
  { id:"dashboard",     label:"DASHBOARD",     icon:"▦" },
  { id:"contacts",      label:"CONTACTS",      icon:"✉" },
  { id:"devis",         label:"DEVIS",         icon:"▣" },
  { id:"rdv",           label:"RENDEZ-VOUS",   icon:"◷" },
  { id:"articles",      label:"ARTICLES",      icon:"◈" },
  { id:"clients",       label:"CLIENTS",       icon:"◎" },
  { id:"interventions", label:"INTERVENTIONS", icon:"◇" },
  { id:"factures",      label:"FACTURES",      icon:"▤" },
  { id:"commandes",     label:"COMMANDES",     icon:"▷" },
  { id:"avis",          label:"AVIS",          icon:"◆" },
];

function Sidebar({ active, onNav }) {
  return (
    <aside className="admin-sidebar" style={{
      width:220, background:T.bg2,
      borderRight:`1px solid ${T.border}`,
      display:"flex", flexDirection:"column",
      height:"100vh", position:"sticky", top:0,
      flexShrink:0,
    }}>
      {/* Logo */}
      <div className="admin-sidebar-label" style={{
        padding:"20px 16px 16px",
        borderBottom:`1px solid ${T.border}`,
      }}>
        <div style={{
          fontFamily:"'IBM Plex Mono',monospace",
          fontWeight:600, fontSize:".88rem",
          color:T.phos, letterSpacing:".12em",
          lineHeight:1,
        }}>
          INFO<span style={{ color:T.amber }}>.</span>TECH
        </div>
        <div style={{
          fontFamily:"'IBM Plex Mono',monospace",
          fontSize:".58rem", color:T.gray,
          letterSpacing:".18em", marginTop:3,
        }}>
          ADMIN_CONSOLE_v2
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10 }}>
          <motion.span
            animate={{ opacity:[1,.2,1] }}
            transition={{ duration:1.6, repeat:Infinity }}
            style={{ width:5, height:5, borderRadius:"50%", background:T.phos }}
          />
          <span style={{ fontSize:".6rem", color:T.phos3, letterSpacing:".1em" }}>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:"8px 0", overflowY:"auto" }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <motion.div
              key={item.id}
              onClick={() => onNav(item.id)}
              whileHover={{ x:2 }}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 16px", cursor:"pointer",
                background: isActive ? `${T.phos}10` : "transparent",
                borderLeft: isActive ? `2px solid ${T.phos}` : "2px solid transparent",
                transition:"background .15s",
              }}
            >
              <span style={{ fontSize:".7rem", color: isActive ? T.phos : T.gray, lineHeight:1 }}>{item.icon}</span>
              <span className="admin-sidebar-label" style={{
                fontFamily:"'IBM Plex Mono',monospace",
                fontSize:".68rem", fontWeight:600,
                letterSpacing:".1em",
                color: isActive ? T.phos : T.gray2,
              }}>
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-label" style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ fontSize:".58rem", color:T.gray, letterSpacing:".1em", lineHeight:1.8 }}>
          <div style={{ color:T.gray2 }}>{new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})}</div>
          <div>{new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
          <div style={{ marginTop:4, color:T.phos3 }}>SESSION: ADMIN_01</div>
        </div>
      </div>
    </aside>
  );
}

/* ============================================================
   TOPBAR
   ============================================================ */
function Topbar({ view, store }) {
  const totalCA = store.clients.reduce((s,c)=>s+c.ca,0);
  const pending = store.factures.filter(f=>f.statut==="En attente").length;
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); },[]);

  return (
    <div style={{
      background:T.bg2, borderBottom:`1px solid ${T.border}`,
      padding:"0 1.5rem", height:48,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      flexShrink:0,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:24 }}>
        <span style={{ fontSize:".68rem", color:T.gray2, letterSpacing:".08em" }}>
          {view.toUpperCase()}
        </span>
        <div style={{ display:"flex", gap:16 }}>
          {[
            { label:"CA TOTAL", value:fmt(totalCA), color:T.phos },
            { label:"FACTURES EN ATTENTE", value:pending, color:T.amber },
            { label:"CLIENTS ACTIFS", value:store.clients.filter(c=>c.status==="Actif").length, color:T.blue },
          ].map(m => (
            <div key={m.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:".58rem", color:T.gray, letterSpacing:".1em" }}>{m.label}:</span>
              <span style={{ fontSize:".72rem", fontWeight:600, color:m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:".68rem", color:T.gray2, letterSpacing:".08em" }}>
        {time.toLocaleTimeString("fr-FR")}
      </div>
    </div>
  );
}

/* ============================================================
   SPARKLINE (mini chart)
   ============================================================ */
function Sparkline({ data, color, width=80, height=28 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v,i) => {
    const x = (i/(data.length-1))*width;
    const y = height - ((v-min)/(max-min||1))*(height-4)-2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ display:"block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(" ").pop().split(",")[0]} cy={pts.split(" ").pop().split(",")[1]} r="2.5" fill={color} />
    </svg>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */
function StatCard({ label, value, sub, color, spark, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:16 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ delay:index*.08, duration:.5 }}
      style={{
        background:T.panel, border:`1px solid ${T.border}`,
        borderRadius:6, padding:"16px",
        borderTop:`2px solid ${color}`,
        position:"relative", overflow:"hidden",
      }}
    >
      {/* Scan line animation */}
      <motion.div
        animate={{ y:["-100%","200%"] }}
        transition={{ duration:4, repeat:Infinity, ease:"linear", delay:index*0.5 }}
        style={{
          position:"absolute", left:0, right:0, height:"30%",
          background:`linear-gradient(to bottom, transparent, ${color}08, transparent)`,
          pointerEvents:"none",
        }}
      />
      <div style={{ fontSize:".6rem", color:T.gray2, letterSpacing:".14em", textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:600, fontSize:"1.5rem", color, lineHeight:1, marginBottom:4 }}>{value}</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <span style={{ fontSize:".65rem", color:T.gray3 }}>{sub}</span>
        {spark && <Sparkline data={spark} color={color} />}
      </div>
    </motion.div>
  );
}

/* ============================================================
   DASHBOARD VIEW
   ============================================================ */
function DashboardView({ store }) {
  const totalCA = store.clients.reduce((s,c)=>s+c.ca,0);
  const totalInter = store.interventions.length;
  const pendingFac = store.factures.filter(f=>f.statut==="En attente");
  const pendingCmd = store.commandes.filter(c=>c.statut==="En attente");

  const sparkCA  = [1.2,1.5,1.1,1.8,2.0,1.7,2.4].map(v=>v*1000000);
  const sparkInt = [8,12,9,15,11,14,totalInter];
  const sparkCli = [22,28,31,35,38,42,store.clients.length];

  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
        <StatCard label="Chiffre d'affaires" value={fmt(totalCA)} sub="+18% vs mois dernier" color={T.phos} spark={sparkCA} index={0} />
        <StatCard label="Clients actifs" value={store.clients.filter(c=>c.status==="Actif").length} sub={`${store.clients.length} total`} color={T.blue} spark={sparkCli} index={1} />
        <StatCard label="Interventions" value={totalInter} sub={`${store.interventions.filter(i=>i.statut==="En cours").length} en cours`} color={T.amber} spark={sparkInt} index={2} />
        <StatCard label="En attente paiement" value={pendingFac.reduce((s,f)=>s+f.ttc,0) > 0 ? fmt(pendingFac.reduce((s,f)=>s+f.ttc,0)) : "0"} sub={`${pendingFac.length} facture(s)`} color={T.red} spark={[4,2,6,3,5,pendingFac.length,pendingFac.length]} index={3} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:"1rem" }}>
        {/* Recent interventions */}
        <Section title="INTERVENTIONS RÉCENTES">
          <table>
            <thead><tr><th>CLIENT</th><th>TYPE</th><th>DATE</th><th>MONTANT</th><th>STATUT</th></tr></thead>
            <tbody>
              {store.interventions.slice(0,5).map(i => (
                <tr key={i.id}>
                  <td style={{ color:T.white, fontWeight:500 }}>{i.clientName.split(" ").slice(0,2).join(" ")}</td>
                  <td>{i.type}</td>
                  <td style={{ color:T.gray2 }}>{i.date}</td>
                  <td style={{ color:T.amber }}>{i.montant.toLocaleString("fr-FR")}</td>
                  <td><Badge label={i.statut} type={statusType(i.statut)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Alerts */}
        <div>
          <Section title="ALERTES SYSTÈME">
            <div style={{ padding:"12px" }}>
              {[
                { msg:`${pendingFac.length} facture(s) en attente`, type:"warn", val:fmt(pendingFac.reduce((s,f)=>s+f.ttc,0)) },
                { msg:`${pendingCmd.length} commande(s) à traiter`, type:"warn", val:`${pendingCmd.length} cde` },
                { msg:`${store.articles.filter(a=>a.stock===0).length} article(s) en rupture`, type:"danger", val:"Stock 0" },
                { msg:`${store.clients.filter(c=>c.status==="Inactif").length} client(s) inactif(s)`, type:"neutral", val:"Suivi" },
              ].map((a,i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:-10 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*.06 }}
                  style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"8px 10px", marginBottom:4,
                    background: a.type==="danger" ? `${T.red}08` : a.type==="warn" ? `${T.amber}08` : T.bg2,
                    border:`1px solid ${a.type==="danger" ? T.red+"22" : a.type==="warn" ? T.amber+"22" : T.border}`,
                    borderRadius:4,
                  }}
                >
                  <span style={{ fontSize:".72rem", color:a.type==="danger"?T.red:a.type==="warn"?T.amber:T.gray3 }}>{a.msg}</span>
                  <Badge label={a.val} type={a.type} />
                </motion.div>
              ))}
            </div>
          </Section>
          <Section title="COMMANDES EN ATTENTE">
            <div style={{ padding:"12px" }}>
              {store.commandes.filter(c=>c.statut==="En attente").map(c => (
                <div key={c.id} style={{ padding:"7px 0", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:".72rem", color:T.white }}>{c.client}</div>
                    <div style={{ fontSize:".62rem", color:T.gray2, marginTop:2 }}>{c.produits.substring(0,30)}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:".72rem", color:T.amber }}>{c.total.toLocaleString("fr-FR")}</div>
                    <Badge label={c.statut} type={statusType(c.statut)} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ARTICLES VIEW
   ============================================================ */
function ArticlesView({ store }) {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const blank = { name:"", cat:"Ordinateurs", price:"", stock:"", img:"", description:"" };
  const [form, setForm] = useState(blank);
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const fileInputRef = useRef(null);

  const openNew = () => { setEditingId(null); setForm(blank); setShowForm(true); };
  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({ name:a.name||"", cat:a.cat||"Ordinateurs", price:String(a.price??""), stock:String(a.stock??""), img:a.img||"", description:a.description||"" });
    setShowForm(true);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast("Choisissez un fichier image (jpg, png, webp...)", "err"); return; }
    if (file.size > 5 * 1024 * 1024) { toast("Image trop lourde (max 5 Mo)", "err"); return; }
    setUploading(true);
    try {
      const url = await productsService.uploadImage(file);
      setForm(p => ({ ...p, img: url }));
      toast("Photo envoyée");
    } catch (err) {
      console.error(err);
      toast("Échec de l'envoi de la photo — vérifiez que le bucket 'product-images' existe sur Supabase", "err");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.name || !form.price) { toast("Nom et prix requis", "err"); return; }
    setSaving(true);
    const payload = { name:form.name, cat:form.cat, price:+form.price, stock:+form.stock||0, img:form.img||null, description:form.description };
    try {
      if (editingId) {
        await store.updateArticle(editingId, payload);
        toast("Article mis à jour");
      } else {
        await store.addArticle(payload);
        toast("Article ajouté au catalogue");
      }
      setForm(blank);
      setEditingId(null);
      setShowForm(false);
    } catch (e) {
      toast("Erreur lors de l'enregistrement. Réessayez.", "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      <Section title={`CATALOGUE — ${store.articles.length} ARTICLE(S)`} action={<Cmd label={showForm ? "FERMER" : "+ NOUVEL ARTICLE"} onClick={()=> showForm ? setShowForm(false) : openNew()} />}>
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
              style={{ overflow:"hidden", borderBottom:`1px solid ${T.border}`, background:T.bg3 }}>
              <div style={{ padding:"16px", display:"grid", gridTemplateColumns:"160px 1fr", gap:"1.25rem" }}>
                {/* Photo */}
                <div>
                  <div style={{ fontSize:".6rem", color:T.gray2, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>Photo</div>
                  <div
                    onClick={()=>fileInputRef.current?.click()}
                    style={{
                      width:140, height:140, borderRadius:8, border:`1px dashed ${T.border2}`,
                      background:T.bg2, display:"flex", alignItems:"center", justifyContent:"center",
                      cursor:"pointer", overflow:"hidden", position:"relative",
                    }}
                  >
                    {uploading ? (
                      <span style={{ fontSize:".65rem", color:T.gray2 }}>Envoi...</span>
                    ) : form.img ? (
                      <img src={form.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    ) : (
                      <span style={{ fontSize:".62rem", color:T.gray2, textAlign:"center", padding:8 }}>Cliquer pour choisir une photo</span>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
                  {form.img && (
                    <button onClick={()=>setForm(p=>({...p,img:""}))} style={{ marginTop:6, background:"none", border:"none", color:T.red, fontSize:".62rem", cursor:"pointer", textDecoration:"underline" }}>
                      Retirer la photo
                    </button>
                  )}
                </div>

                {/* Champs */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", alignContent:"start" }}>
                  <FormGroup label="Nom produit *"><input value={form.name} onChange={set("name")} placeholder="Nom du produit" /></FormGroup>
                  <FormGroup label="Catégorie">
                    <select value={form.cat} onChange={set("cat")}>
                      {["Ordinateurs","Périphériques","Réseau","Stockage","Audio","Électronique","Câbles"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </FormGroup>
                  <FormGroup label="Prix (FCFA) *"><input type="number" value={form.price} onChange={set("price")} placeholder="0" /></FormGroup>
                  <FormGroup label="Stock"><input type="number" value={form.stock} onChange={set("stock")} placeholder="0" /></FormGroup>
                  <FormGroup label="Description" ><textarea value={form.description} onChange={set("description")} placeholder="Description courte du produit..." /></FormGroup>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                    <Cmd label={saving ? "ENREGISTREMENT..." : editingId ? "METTRE À JOUR" : "SAUVEGARDER"} onClick={save} />
                    <Cmd label="ANNULER" onClick={()=>{ setShowForm(false); setEditingId(null); }} variant="ghost" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <table>
          <thead><tr><th>PHOTO</th><th>NOM</th><th>CATÉGORIE</th><th>PRIX</th><th>STOCK</th><th>STATUT</th><th>ACTION</th></tr></thead>
          <tbody>
            {store.articles.map(a => (
              <tr key={a.id}>
                <td>
                  <div style={{ width:40, height:40, borderRadius:6, overflow:"hidden", background:T.bg2, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {a.img ? <img src={a.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:".6rem", color:T.gray }}>—</span>}
                  </div>
                </td>
                <td style={{ color:T.white, fontWeight:500 }}>{a.name}</td>
                <td style={{ color:T.gray3 }}>{a.cat}</td>
                <td style={{ color:T.amber }}>{a.price.toLocaleString("fr-FR")} FCFA</td>
                <td style={{ color: a.stock===0 ? T.red : a.stock<5 ? T.amber : T.phos }}>{a.stock}</td>
                <td><Badge label={a.statut} type={statusType(a.statut)} /></td>
                <td style={{ display:"flex", gap:6 }}>
                  <Cmd small label="MODIFIER" onClick={()=>openEdit(a)} />
                  {a.statut === "Inactif"
                    ? <Cmd small label="RÉACTIVER" variant="phos" onClick={()=>{ store.reactivateArticle(a.id, a.stock); toast("Article réactivé"); }} />
                    : <Cmd small label="SUPPR" variant="ghost" onClick={()=>{ store.deleteArticle(a.id); toast("Article désactivé","err"); }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   CLIENTS VIEW
   ============================================================ */
function ClientsView({ store }) {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", contact:"", email:"", phone:"", secteur:"Commerce", ville:"Douala", status:"Actif" });
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const save = () => {
    if (!form.name) { toast("Nom requis","err"); return; }
    store.addClient(form);
    setShowForm(false);
    setForm({ name:"", contact:"", email:"", phone:"", secteur:"Commerce", ville:"Douala", status:"Actif" });
    toast("Client enregistré");
  };

  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      <Section title={`BASE CLIENTS — ${store.clients.length} CLIENT(S)`} action={<Cmd label="+ NOUVEAU CLIENT" onClick={()=>setShowForm(v=>!v)} />}>
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
              style={{ overflow:"hidden", borderBottom:`1px solid ${T.border}`, background:T.bg3 }}>
              <div style={{ padding:"16px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }}>
                <FormGroup label="Entreprise *"><input value={form.name} onChange={set("name")} placeholder="Nom de la PME" /></FormGroup>
                <FormGroup label="Contact"><input value={form.contact} onChange={set("contact")} placeholder="Nom du responsable" /></FormGroup>
                <FormGroup label="Email"><input type="email" value={form.email} onChange={set("email")} placeholder="email@pme.cm" /></FormGroup>
                <FormGroup label="Téléphone"><input value={form.phone} onChange={set("phone")} placeholder="+237 6XX XXX XXX" /></FormGroup>
                <FormGroup label="Secteur">
                  <select value={form.secteur} onChange={set("secteur")}>
                    {["Commerce","Services","Industrie","Santé","Education","Tech","Autre"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Ville"><input value={form.ville} onChange={set("ville")} placeholder="Douala" /></FormGroup>
                <div style={{ display:"flex", alignItems:"flex-end", gap:8, gridColumn:"span 3" }}>
                  <Cmd label="ENREGISTRER" onClick={save} />
                  <Cmd label="ANNULER" onClick={()=>setShowForm(false)} variant="ghost" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <table>
          <thead><tr><th>ENTREPRISE</th><th>CONTACT</th><th>SECTEUR</th><th>VILLE</th><th>INTERVENTIONS</th><th>CA TOTAL</th><th>STATUT</th><th>ACTION</th></tr></thead>
          <tbody>
            {store.clients.map(c => (
              <tr key={c.id}>
                <td style={{ color:T.white, fontWeight:500 }}>{c.name}</td>
                <td>{c.contact}<br/><span style={{ fontSize:".65rem", color:T.gray }}>{c.email}</span></td>
                <td>{c.secteur}</td>
                <td>{c.ville}</td>
                <td style={{ color:T.blue }}>{c.interventions}</td>
                <td style={{ color:T.amber }}>{c.ca.toLocaleString("fr-FR")}</td>
                <td><Badge label={c.status} type={statusType(c.status)} /></td>
                <td><Cmd small label="SUPPR" variant="ghost" onClick={()=>{ store.deleteClient(c.id); toast("Client supprimé","err"); }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   INTERVENTIONS VIEW
   ============================================================ */
function InterventionsView({ store }) {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientId:"", type:"Maintenance préventive", date:"", duree:"", desc:"", montant:"", statut:"Planifiée" });
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const save = () => {
    if (!form.clientId || !form.date) { toast("Client et date requis","err"); return; }
    const client = store.clients.find(c=>c.id===form.clientId);
    store.addIntervention({ ...form, clientName:client?.name||"", duree:+form.duree, montant:+form.montant });
    setShowForm(false);
    setForm({ clientId:"", type:"Maintenance préventive", date:"", duree:"", desc:"", montant:"", statut:"Planifiée" });
    toast("Intervention enregistrée");
  };

  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      <Section title={`INTERVENTIONS — ${store.interventions.length} ENREGISTRÉE(S)`} action={<Cmd label="+ NOUVELLE INTERVENTION" onClick={()=>setShowForm(v=>!v)} />}>
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
              style={{ overflow:"hidden", borderBottom:`1px solid ${T.border}`, background:T.bg3 }}>
              <div style={{ padding:"16px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }}>
                <FormGroup label="Client *">
                  <select value={form.clientId} onChange={set("clientId")}>
                    <option value="">Choisir...</option>
                    {store.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Type">
                  <select value={form.type} onChange={set("type")}>
                    {["Maintenance préventive","Dépannage","Installation","Développement","Conseil","Formation"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Date *"><input type="date" value={form.date} onChange={set("date")} /></FormGroup>
                <FormGroup label="Durée (h)"><input type="number" value={form.duree} onChange={set("duree")} placeholder="0" /></FormGroup>
                <FormGroup label="Montant (FCFA)"><input type="number" value={form.montant} onChange={set("montant")} placeholder="0" /></FormGroup>
                <FormGroup label="Statut">
                  <select value={form.statut} onChange={set("statut")}>
                    {["Planifiée","En cours","Terminée","Annulée"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Description" ><textarea value={form.desc} onChange={set("desc")} placeholder="Détail de l'intervention..." /></FormGroup>
                <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                  <Cmd label="ENREGISTRER" onClick={save} />
                  <Cmd label="ANNULER" onClick={()=>setShowForm(false)} variant="ghost" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <table>
          <thead><tr><th>CLIENT</th><th>TYPE</th><th>DATE</th><th>DURÉE</th><th>MONTANT</th><th>STATUT</th></tr></thead>
          <tbody>
            {store.interventions.map(i => (
              <tr key={i.id}>
                <td style={{ color:T.white, fontWeight:500 }}>{i.clientName}</td>
                <td>{i.type}</td>
                <td style={{ color:T.gray2 }}>{i.date}</td>
                <td style={{ color:T.blue }}>{i.duree}h</td>
                <td style={{ color:T.amber }}>{i.montant.toLocaleString("fr-FR")} FCFA</td>
                <td><Badge label={i.statut} type={statusType(i.statut)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   FACTURES VIEW — with invoice generator
   ============================================================ */
function FacturesView({ store }) {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(null);
  const [lignes, setLignes] = useState([{ desc:"", qty:1, pu:0 }]);
  const [form, setForm] = useState({ clientId:"", date:"", echeance:"", objet:"" });
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const addLigne = () => setLignes(p=>[...p,{desc:"",qty:1,pu:0}]);
  const setLigne = (i,k,v) => setLignes(p=>p.map((l,idx)=>idx===i?{...l,[k]:v}:l));
  const rmLigne  = (i) => setLignes(p=>p.filter((_,idx)=>idx!==i));

  const ht  = lignes.reduce((s,l)=>s+l.qty*l.pu,0);
  const tva = Math.round(ht*0.1925);
  const ttc = ht+tva;

  const save = () => {
    const client = store.clients.find(c=>c.id===form.clientId);
    if (!client || lignes[0].desc==="") { toast("Client et lignes requis","err"); return; }
    const fac = {
      id:`F-${new Date().getFullYear()}-${String(store.factures.length+1).padStart(3,"0")}-${Date.now().toString().slice(-4)}`,
      clientId:form.clientId, clientName:client.name,
      date:form.date, echeance:form.echeance, objet:form.objet,
      ht, tva, ttc, statut:"En attente", lignes:[...lignes],
    };
    store.addFacture(fac);
    setPreview(fac);
    setShowForm(false);
    setLignes([{desc:"",qty:1,pu:0}]);
    toast(`Facture ${fac.id} générée`);
  };

  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      {/* Invoice preview */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
            style={{ background:T.panel, border:`1px solid ${T.phos}33`, borderRadius:6, padding:"1.5rem", marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <div>
                <div style={{ fontSize:".62rem", color:T.phos, letterSpacing:".14em" }}>{preview.id}</div>
                <div style={{ fontSize:"1.2rem", fontWeight:600, color:T.white, letterSpacing:".08em" }}>FACTURE</div>
              </div>
              <div style={{ textAlign:"right", fontSize:".72rem", color:T.gray3 }}>
                <div style={{ color:T.white, fontWeight:600 }}>INFO-TECH</div>
                <div>Douala, Cameroun</div>
                <div>contact@infotech.cm</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
              <div style={{ fontSize:".72rem", color:T.gray3 }}>
                <div style={{ color:T.gray2, marginBottom:3, letterSpacing:".1em", textTransform:"uppercase", fontSize:".6rem" }}>FACTURÉ À</div>
                <div style={{ color:T.white, fontWeight:500 }}>{preview.clientName}</div>
                <div>Objet: {preview.objet}</div>
              </div>
              <div style={{ textAlign:"right", fontSize:".72rem", color:T.gray3 }}>
                <div>Émission: {preview.date}</div>
                <div>Échéance: {preview.echeance}</div>
              </div>
            </div>
            <table style={{ marginBottom:"1rem" }}>
              <thead><tr><th>DÉSIGNATION</th><th>QTÉ</th><th>PU (FCFA)</th><th>TOTAL HT</th></tr></thead>
              <tbody>
                {preview.lignes.map((l,i)=>(
                  <tr key={i}>
                    <td style={{ color:T.white }}>{l.desc}</td>
                    <td>{l.qty}</td>
                    <td style={{ color:T.amber }}>{l.pu.toLocaleString("fr-FR")}</td>
                    <td style={{ color:T.phos }}>{(l.qty*l.pu).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <div style={{ minWidth:260, fontSize:".75rem" }}>
                {[["Montant HT",preview.ht],["TVA 19,25%",preview.tva]].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", color:T.gray3, borderBottom:`1px solid ${T.border}` }}>
                    <span>{l}</span><span>{v.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", color:T.white, fontWeight:600, fontSize:".9rem" }}>
                  <span>TOTAL TTC</span><span style={{ color:T.phos }}>{preview.ttc.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
              <Cmd label="IMPRIMER / PDF" onClick={()=>window.print()} />
              <Cmd label="FERMER" onClick={()=>setPreview(null)} variant="ghost" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Section title={`FACTURES — ${store.factures.length}`} action={<Cmd label="+ CRÉER FACTURE" onClick={()=>setShowForm(v=>!v)} />}>
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
              style={{ overflow:"hidden", borderBottom:`1px solid ${T.border}`, background:T.bg3 }}>
              <div style={{ padding:"16px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1rem" }}>
                  <FormGroup label="Client *">
                    <select value={form.clientId} onChange={set("clientId")}>
                      <option value="">Choisir...</option>
                      {store.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </FormGroup>
                  <FormGroup label="Objet"><input value={form.objet} onChange={set("objet")} placeholder="Objet de la facture" /></FormGroup>
                  <FormGroup label="Date d'émission"><input type="date" value={form.date} onChange={set("date")} /></FormGroup>
                  <FormGroup label="Date d'échéance"><input type="date" value={form.echeance} onChange={set("echeance")} /></FormGroup>
                </div>
                {/* Lignes */}
                <div style={{ marginBottom:"1rem" }}>
                  <div style={{ fontSize:".6rem", color:T.gray2, letterSpacing:".12em", textTransform:"uppercase", marginBottom:8 }}>LIGNES DE FACTURATION</div>
                  {lignes.map((l,i)=>(
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"3fr 1fr 2fr auto", gap:8, marginBottom:6, alignItems:"center" }}>
                      <input value={l.desc} onChange={e=>setLigne(i,"desc",e.target.value)} placeholder="Description" />
                      <input type="number" value={l.qty} onChange={e=>setLigne(i,"qty",+e.target.value)} placeholder="Qté" />
                      <input type="number" value={l.pu} onChange={e=>setLigne(i,"pu",+e.target.value)} placeholder="Prix unitaire" />
                      <Cmd small label="✕" variant="ghost" onClick={()=>rmLigne(i)} />
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <Cmd small label="+ LIGNE" variant="ghost" onClick={addLigne} />
                    <div style={{ fontSize:".72rem", color:T.phos }}>TOTAL TTC: {ttc.toLocaleString("fr-FR")} FCFA</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Cmd label="GÉNÉRER LA FACTURE" onClick={save} />
                  <Cmd label="ANNULER" onClick={()=>setShowForm(false)} variant="ghost" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <table>
          <thead><tr><th>N° FACTURE</th><th>CLIENT</th><th>DATE</th><th>OBJET</th><th>MONTANT TTC</th><th>STATUT</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {store.factures.map(f=>(
              <tr key={f.id}>
                <td style={{ color:T.phos, fontFamily:"'IBM Plex Mono',monospace", fontSize:".7rem" }}>{f.id}</td>
                <td style={{ color:T.white }}>{f.clientName}</td>
                <td style={{ color:T.gray2 }}>{f.date}</td>
                <td style={{ color:T.gray3, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.objet}</td>
                <td style={{ color:T.amber, fontWeight:600 }}>{f.ttc.toLocaleString("fr-FR")} FCFA</td>
                <td><Badge label={f.statut} type={statusType(f.statut)} /></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <Cmd small label="VOIR" onClick={()=>setPreview(f)} />
                    {f.statut!=="Payée" && <Cmd small label="PAYÉE" variant="phos" onClick={()=>{ store.markPaid(f.id); toast(`Facture ${f.id} marquée payée`); }} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   COMMANDES VIEW
   ============================================================ */
function CommandesView({ store }) {
  const toast = useToast();
  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      <Section title={`COMMANDES BOUTIQUE — ${store.commandes.length}`}>
        <table>
          <thead><tr><th>N° CMD</th><th>CLIENT</th><th>PRODUITS</th><th>TOTAL</th><th>PAIEMENT</th><th>DATE</th><th>STATUT</th><th>ACTION</th></tr></thead>
          <tbody>
            {store.commandes.map(c=>(
              <tr key={c.id}>
                <td style={{ color:T.phos, fontSize:".68rem" }}>{c.id}</td>
                <td style={{ color:T.white }}>{c.client}</td>
                <td style={{ color:T.gray3, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.produits}</td>
                <td style={{ color:T.amber }}>{c.total.toLocaleString("fr-FR")} FCFA</td>
                <td>
                  {c.methode === "mobile_money"
                    ? <Badge label={c.paiement === "payé" ? "Payé" : c.paiement === "échoué" ? "Échoué" : "En attente"} type={statusType(c.paiement === "payé" ? "Payé" : c.paiement === "échoué" ? "Annulée" : "En attente")} />
                    : <span style={{ color:T.gray2, fontSize:".68rem" }}>À la livraison</span>}
                </td>
                <td style={{ color:T.gray2 }}>{c.date}</td>
                <td><Badge label={c.statut} type={statusType(c.statut)} /></td>
                <td>
                  {c.statut!=="Livré" && (
                    <Cmd small label="MARQUER LIVRÉ" variant="phos" onClick={()=>{ store.markLivered(c.id); toast(`Commande ${c.id} livrée`); }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   CONTACTS VIEW (formulaire de contact du site)
   ============================================================ */
function ContactsView({ store }) {
  const toast = useToast();
  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      <Section title={`MESSAGES DE CONTACT — ${store.contacts.length}`}>
        <table>
          <thead><tr><th>NOM</th><th>CONTACT</th><th>SERVICE</th><th>MESSAGE</th><th>DATE</th><th>STATUT</th><th>ACTION</th></tr></thead>
          <tbody>
            {store.contacts.map(c=>(
              <tr key={c.id}>
                <td style={{ color:T.white, fontWeight:500 }}>{c.name}{c.company && <><br/><span style={{ color:T.gray2, fontWeight:400, fontSize:".65rem" }}>{c.company}</span></>}</td>
                <td style={{ color:T.gray3 }}>{c.email}<br/><span style={{ fontSize:".65rem" }}>{c.phone}</span></td>
                <td>{c.service||"—"}</td>
                <td style={{ color:T.gray3, maxWidth:260, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.message}</td>
                <td style={{ color:T.gray2 }}>{fmtDate(c.created_at)}</td>
                <td><Badge label={c.status||"nouveau"} type={statusType(c.status||"nouveau")} /></td>
                <td>{c.status!=="traité" && <Cmd small label="MARQUER TRAITÉ" onClick={()=>{ store.markContactTraite(c.id); toast("Message marqué traité"); }} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   DEVIS VIEW (demandes de devis en ligne)
   ============================================================ */
function DevisView({ store }) {
  const toast = useToast();
  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      <Section title={`DEMANDES DE DEVIS — ${store.devis.length}`}>
        <table>
          <thead><tr><th>NOM</th><th>CONTACT</th><th>PROJET</th><th>ESTIMATION</th><th>URGENCE</th><th>DATE</th><th>STATUT</th><th>ACTION</th></tr></thead>
          <tbody>
            {store.devis.map(d=>(
              <tr key={d.id}>
                <td style={{ color:T.white, fontWeight:500 }}>{d.name}</td>
                <td style={{ color:T.gray3 }}>{d.email}<br/><span style={{ fontSize:".65rem" }}>{d.phone}</span></td>
                <td>{d.project_type}</td>
                <td style={{ color:T.amber }}>{Number(d.estimated_total||0).toLocaleString("fr-FR")} FCFA</td>
                <td>{d.urgence||"—"}</td>
                <td style={{ color:T.gray2 }}>{fmtDate(d.created_at)}</td>
                <td><Badge label={d.status||"nouveau"} type={statusType(d.status||"nouveau")} /></td>
                <td style={{ display:"flex", gap:6 }}>
                  {d.status!=="confirmé" && <Cmd small label="CONFIRMER" variant="phos" onClick={()=>{ store.markDevisStatus(d.id,"confirmé"); toast("Devis confirmé"); }} />}
                  {d.status!=="annulé" && <Cmd small label="ANNULER" variant="ghost" onClick={()=>{ store.markDevisStatus(d.id,"annulé"); toast("Devis annulé","err"); }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   RDV VIEW (rendez-vous pris en ligne)
   ============================================================ */
function RdvView({ store }) {
  const toast = useToast();
  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      <Section title={`RENDEZ-VOUS — ${store.rdv.length}`}>
        <table>
          <thead><tr><th>NOM</th><th>TÉLÉPHONE</th><th>SUJET</th><th>JOUR</th><th>CRÉNEAU</th><th>STATUT</th><th>ACTION</th></tr></thead>
          <tbody>
            {store.rdv.map(r=>(
              <tr key={r.id}>
                <td style={{ color:T.white, fontWeight:500 }}>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.subject||"—"}</td>
                <td style={{ color:T.gray2 }}>{r.day}</td>
                <td style={{ color:T.phos }}>{r.slot}</td>
                <td><Badge label={r.status||"en_attente"} type={statusType(r.status||"en_attente")} /></td>
                <td style={{ display:"flex", gap:6 }}>
                  {r.status!=="confirmé" && <Cmd small label="CONFIRMER" variant="phos" onClick={()=>{ store.markRdvStatus(r.id,"confirmé"); toast("RDV confirmé"); }} />}
                  {r.status!=="annulé" && <Cmd small label="ANNULER" variant="ghost" onClick={()=>{ store.markRdvStatus(r.id,"annulé"); toast("RDV annulé","err"); }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   AVIS VIEW
   ============================================================ */
function AvisView({ store }) {
  const toast = useToast();
  return (
    <div style={{ padding:"1.5rem", overflowY:"auto" }}>
      <Section title={`AVIS & NOTATIONS — ${store.avis.length}`}>
        <table>
          <thead><tr><th>CLIENT</th><th>SERVICE</th><th>NOTE</th><th>DATE</th><th>STATUT</th><th>ACTION</th></tr></thead>
          <tbody>
            {store.avis.map(a=>(
              <tr key={a.id}>
                <td style={{ color:T.white, fontWeight:500 }}>{a.client}</td>
                <td>{a.service}</td>
                <td>
                  <span style={{ color:T.amber, letterSpacing:2 }}>{"★".repeat(a.note)}{"☆".repeat(5-a.note)}</span>
                  <span style={{ color:T.gray2, fontSize:".65rem", marginLeft:6 }}>{a.note}/5</span>
                </td>
                <td style={{ color:T.gray2 }}>{a.date}</td>
                <td><Badge label={a.statut} type={statusType(a.statut)} /></td>
                <td style={{ display:"flex", gap:6 }}>
                  {a.statut!=="Publié" && <Cmd small label="PUBLIER" variant="phos" onClick={()=>{ store.publishAvis(a.id); toast("Avis publié"); }} />}
                  <Cmd small label="SUPPR" variant="ghost" onClick={()=>{ store.deleteAvis(a.id); toast("Avis supprimé","err"); }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   MAIN ADMIN EXPORT
   ============================================================ */
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "infotech2024";

export default function AdminDashboard({ onClose }) {
  const [auth, setAuth] = useState(()=>sessionStorage.getItem('it_admin')==='1');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);
  const [view, setView] = useState("dashboard");
  const store = useStore();

  if (!auth) {
    return (
      <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(5,7,15,.97)',backdropFilter:'blur(20px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:'#0F1225',border:'1px solid #1C2040',borderRadius:16,padding:'2.5rem',width:360,textAlign:'center'}}>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',color:'#B8FF00',letterSpacing:'.16em',marginBottom:'1rem'}}>// ACCÈS RESTREINT</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.5rem',color:'#F0F4FF',marginBottom:'2rem'}}>Espace Admin</div>
          <input
            type="password"
            value={pwd}
            onChange={e=>{setPwd(e.target.value);setErr(false)}}
            onKeyDown={e=>{if(e.key==='Enter'){if(pwd===ADMIN_PASSWORD){sessionStorage.setItem('it_admin','1');setAuth(true)}else setErr(true)}}}
            placeholder="Mot de passe"
            autoFocus
            style={{width:'100%',padding:'10px 14px',background:'#08091A',border:`1px solid ${err?'#FF3355':'#1C2040'}`,borderRadius:8,color:'#F0F4FF',fontFamily:"'IBM Plex Mono',monospace",fontSize:'.9rem',outline:'none',marginBottom:err?'.5rem':'1.25rem',textAlign:'center'}}
          />
          {err && <div style={{color:'#FF3355',fontFamily:"'IBM Plex Mono',monospace",fontSize:'.72rem',marginBottom:'1rem'}}>Mot de passe incorrect</div>}
          <button
            onClick={()=>{if(pwd===ADMIN_PASSWORD){sessionStorage.setItem('it_admin','1');setAuth(true)}else setErr(true)}}
            style={{width:'100%',padding:'11px',background:'#B8FF00',color:'#05070F',border:'none',borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'.9rem',cursor:'pointer'}}
          >Connexion</button>
        </div>
      </div>
    );
  }

  const VIEWS = {
    dashboard:     <DashboardView     store={store} />,
    contacts:      <ContactsView      store={store} />,
    devis:         <DevisView         store={store} />,
    rdv:           <RdvView           store={store} />,
    articles:      <ArticlesView      store={store} />,
    clients:       <ClientsView       store={store} />,
    interventions: <InterventionsView store={store} />,
    factures:      <FacturesView      store={store} />,
    commandes:     <CommandesView     store={store} />,
    avis:          <AvisView          store={store} />,
  };

  return (
    <ToastSystem>
      <AdminGlobalStyles />
      <div style={{position:'fixed',inset:0,zIndex:900,display:'flex',flexDirection:'column'}}>
        {onClose && (
          <button
            onClick={()=>{sessionStorage.removeItem('it_admin');setAuth(false);onClose()}}
            style={{position:'absolute',top:12,right:16,zIndex:10,background:'rgba(255,51,85,.12)',border:'1px solid rgba(255,51,85,.3)',color:'#FF3355',fontFamily:"'IBM Plex Mono',monospace",fontSize:'.72rem',padding:'5px 12px',borderRadius:6,cursor:'pointer',letterSpacing:'.08em'}}
          >✕ FERMER</button>
        )}
        <div className="admin-root" style={{
          display:"flex", height:"100vh",
          background:T.bg, color:T.white,
          fontFamily:"'IBM Plex Mono',monospace",
          overflow:"hidden",
        }}>
          <Sidebar active={view} onNav={setView} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <Topbar view={view} store={store} />
            <div style={{ flex:1, overflowY:"auto", position:"relative" }}>
              {store.loading && (
                <div style={{ position:"absolute", inset:0, background:T.bg, zIndex:5, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                  <motion.span animate={{ rotate:360 }} transition={{ duration:.8, repeat:Infinity, ease:"linear" }}
                    style={{ width:20, height:20, border:`2px solid ${T.border2}`, borderTopColor:T.phos, borderRadius:"50%" }} />
                  <span style={{ fontSize:".75rem", color:T.gray2, letterSpacing:".08em" }}>CHARGEMENT DES DONNÉES SUPABASE...</span>
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity:0, x:10 }}
                  animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:-10 }}
                  transition={{ duration:.2 }}
                  style={{ minHeight:"100%" }}
                >
                  {VIEWS[view]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ToastSystem>
  );
}
