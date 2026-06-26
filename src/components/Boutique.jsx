import { useState, useRef, useEffect } from "react";
import { useCart, useToast } from "./UI.jsx";
import { ordersService, productsService } from "../lib/supabase.js";
import { notify } from "../lib/notify.js";
import { useTheme } from "../lib/theme.jsx";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  LayoutGroup,
} from "framer-motion";

/* ============================================================
   DESIGN SYSTEM — INFO.TECH
   Partie 4 : "Terminal Commerce"
   Aesthetic : Brutalist data-dense · Industrial precision
   Fonts     : Archivo Black (display) · Azeret Mono (body/code)
   Palette   : Obsidian · Acid-Lime · Raw-Amber
   ============================================================ */
const DARK_B = {
  bg:      "#08090E",
  bg2:     "#0C0D14",
  surface: "#10121A",
  s2:      "#141720",
  s3:      "#191C27",
  border:  "#1F2235",
  b2:      "#282B40",
  lime:    "#CCFF00",
  lime2:   "#A8D400",
  amber:   "#FFB800",
  white:   "#F0F2F8",
  gray:    "#454860",
  gray2:   "#8890AA",
  red:     "#FF3355",
  green:   "#00E87A",
};

const LIGHT_B = {
  bg:      "#F7F9FC",
  bg2:     "#FFFFFF",
  surface: "#FFFFFF",
  s2:      "#F1F4F9",
  s3:      "#E7EBF1",
  border:  "#D7DEE7",
  b2:      "#B7C2D0",
  lime:    "#15803D",
  lime2:   "#166534",
  amber:   "#B45309",
  white:   "#0B1220",
  gray:    "#9AA7B8",
  gray2:   "#54627A",
  red:     "#B91C1C",
  green:   "#15803D",
};

// DS mutable : réécrit par le thème actif (voir BoutiqueSection / CartDrawer).
const DS = { ...DARK_B };

const FONTS = `https://fonts.googleapis.com/css2?family=Archivo+Black&family=Azeret+Mono:wght@300;400;500;600&display=swap`;

/* CartContext is provided globally by UI.jsx via App.jsx */

/* ============================================================
   PRODUCTS DATA
   ============================================================ */
const PRODUCTS = [
  { id:"k1", name:"Laptop Dell XPS 15",      cat:"Ordinateurs",    price:585000, oldPrice:640000, stock:4,  badge:"Promo",   rating:4.8, reviews:24, img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=380&fit=crop&q=80", desc:"Intel Core i7-13700H · 32GB DDR5 · 1TB NVMe SSD · OLED 15.6\" 3.5K · RTX 4060" },
  { id:"k2", name:"Switch HP 1920S 24G",      cat:"Réseau",         price:138000, oldPrice:null,   stock:9,  badge:"Stock",   rating:4.6, reviews:11, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=380&fit=crop&q=80", desc:"24 ports Gigabit manageable · 4 SFP · VLAN 802.1Q · QoS · Rack 1U" },
  { id:"k3", name:"Écran LG UltraWide 34\"",  cat:"Périphériques",  price:215000, oldPrice:248000, stock:3,  badge:"Promo",   rating:4.9, reviews:37, img:"https://images.unsplash.com/photo-1527443224154-c4a573d5f5de?w=500&h=380&fit=crop&q=80", desc:"34\" IPS Nano · 3440×1440 · 144Hz · HDR400 · USB-C 96W · 2× HDMI 2.1" },
  { id:"k4", name:"SSD Samsung 990 Pro 2TB",  cat:"Stockage",       price:88000,  oldPrice:null,   stock:18, badge:null,      rating:5.0, reviews:52, img:"https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&h=380&fit=crop&q=80", desc:"NVMe PCIe 4.0 · 7 450 Mo/s lecture · 6 900 Mo/s écriture · Garantie 5 ans" },
  { id:"k5", name:"Clavier Keychron Q1 Pro",  cat:"Périphériques",  price:62000,  oldPrice:72000,  stock:7,  badge:"Promo",   rating:4.7, reviews:18, img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=380&fit=crop&q=80", desc:"75% layout · Aluminium CNC · Switch Gateron Pro Red · RGB · Bluetooth 5.1" },
  { id:"k6", name:"Routeur Ubiquiti UniFi 6", cat:"Réseau",         price:112000, oldPrice:null,   stock:5,  badge:"Nouveau", rating:4.8, reviews:9,  img:"https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=380&fit=crop&q=80", desc:"Wi-Fi 6 · 4× 4 MIMO · Couverture 300m² · PoE+ · Contrôlé via UniFi App" },
  { id:"k7", name:"Casque Sony XM5",          cat:"Audio",          price:195000, oldPrice:228000, stock:6,  badge:"Promo",   rating:4.9, reviews:61, img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=380&fit=crop&q=80", desc:"ANC multi-points leader · 30h autonomie · Bluetooth 5.2 · LDAC Hi-Res" },
  { id:"k8", name:"Webcam Logitech Brio 4K",  cat:"Périphériques",  price:78000,  oldPrice:null,   stock:11, badge:null,      rating:4.6, reviews:29, img:"https://images.unsplash.com/photo-1551636898-47668aa61de2?w=500&h=380&fit=crop&q=80", desc:"4K 30fps · 1080p 60fps · HDR · Autofocus IA · Micro stéréo · USB-C" },
  { id:"k9", name:"UPS APC 1500VA",           cat:"Électronique",   price:145000, oldPrice:160000, stock:4,  badge:"Promo",   rating:4.7, reviews:15, img:"https://images.unsplash.com/photo-1589792923962-537704632910?w=500&h=380&fit=crop&q=80", desc:"900W · 8 prises · Surge protection · LCD · USB manageable · Run time 12min" },
  { id:"k10",name:"Hub USB-C 12-en-1",        cat:"Câbles",         price:32000,  oldPrice:38000,  stock:25, badge:"Promo",   rating:4.5, reviews:44, img:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=380&fit=crop&q=80", desc:"HDMI 4K · DP 1.4 · 3× USB-A 3.0 · USB-C PD 100W · SD/MicroSD · Ethernet" },
  { id:"k11",name:"Raspberry Pi 5 — 8GB",     cat:"Électronique",   price:48000,  oldPrice:null,   stock:8,  badge:"Nouveau", rating:4.9, reviews:33, img:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=380&fit=crop&q=80", desc:"ARM Cortex-A76 2.4GHz · 8GB LPDDR4X · PCIe 2.0 · USB 3.0 · HDMI 4K×2" },
  { id:"k12",name:"Disque NAS Seagate 8TB",   cat:"Stockage",       price:115000, oldPrice:null,   stock:6,  badge:null,      rating:4.6, reviews:21, img:"https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=500&h=380&fit=crop&q=80", desc:"IronWolf Pro NAS · 7200 RPM · CMR · AgileArray · MTBF 1.2M heures" },
];

const CATS = ["Tous", "Ordinateurs", "Périphériques", "Réseau", "Stockage", "Audio", "Électronique", "Câbles"];

/* ============================================================
   HELPERS
   ============================================================ */
const fmt = (n) => n.toLocaleString("fr-FR") + " FCFA";

function Stars({ rating, size = 11 }) {
  return (
    <span style={{ color: DS.amber, fontSize: size, letterSpacing: 1 }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
    </span>
  );
}

/* ============================================================
   HUD CORNERS
   ============================================================ */
function HudBrackets({ color = DS.lime, size = 10, w = 1.5 }) {
  const b = `${w}px solid ${color}`;
  const s = { position: "absolute", width: size, height: size };
  return (
    <>
      <span style={{ ...s, top: 0,    left: 0,  borderTop: b,    borderLeft: b  }} />
      <span style={{ ...s, top: 0,    right: 0, borderTop: b,    borderRight: b }} />
      <span style={{ ...s, bottom: 0, left: 0,  borderBottom: b, borderLeft: b  }} />
      <span style={{ ...s, bottom: 0, right: 0, borderBottom: b, borderRight: b }} />
    </>
  );
}

/* ToastProvider is provided globally by UI.jsx via App.jsx */

/* ============================================================
   CART DRAWER
   ============================================================ */
export function CartDrawer({ open, onClose }) {
  const { theme: _themeCD } = useTheme();
  Object.assign(DS, _themeCD === "light" ? LIGHT_B : DARK_B);
  const { items, remove, setQty, total, clear } = useCart();
  const toast = useToast();

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 800,
              background: "rgba(8,9,14,.75)",
              backdropFilter: "blur(6px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: 440, maxWidth: "100vw",
          background: DS.bg2,
          borderLeft: `1px solid ${DS.border}`,
          zIndex: 801,
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.5rem",
          borderBottom: `1px solid ${DS.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{
              fontFamily: "'Azeret Mono', monospace",
              fontSize: ".65rem", color: DS.lime,
              letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 4,
            }}>
              // panier.actuel
            </div>
            <h3 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "1.4rem", color: DS.white, letterSpacing: ".02em",
            }}>
              Mon Panier
              {items.length > 0 && (
                <span style={{
                  marginLeft: 10, fontSize: ".75rem",
                  background: DS.lime, color: DS.bg,
                  padding: "2px 8px", borderRadius: 4,
                  fontFamily: "'Azeret Mono', monospace",
                  letterSpacing: ".06em",
                }}>
                  {items.reduce((s,i)=>s+i.qty,0)} article(s)
                </span>
              )}
            </h3>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: `1px solid ${DS.border}`,
              background: "none", color: DS.gray2,
              fontSize: "1rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</motion.button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "4rem 1rem" }}
              >
                <div style={{
                  fontFamily: "'Azeret Mono', monospace",
                  fontSize: ".72rem", color: DS.gray,
                  letterSpacing: ".1em", lineHeight: 2,
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: ".5rem", opacity: .3 }}>[ ]</div>
                  // panier.vide<br/>
                  // ajoutez des articles<br/>
                  // pour commencer
                </div>
              </motion.div>
            ) : (
              <motion.div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {items.map((item, idx) => (
                  <CartItem key={item.id} item={item} onRemove={remove} onQty={setQty} index={idx} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                borderTop: `1px solid ${DS.border}`,
                padding: "1.5rem",
              }}
            >
              {/* Subtotal rows */}
              <div style={{ marginBottom: "1.25rem" }}>
                {[
                  { label: "Sous-total HT", value: fmt(Math.round(total / 1.1925)) },
                  { label: "TVA (19,25%)",  value: fmt(Math.round(total - total / 1.1925)) },
                ].map(r => (
                  <div key={r.label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "6px 0",
                    fontFamily: "'Azeret Mono', monospace",
                    fontSize: ".75rem", color: DS.gray2,
                  }}>
                    <span>{r.label}</span>
                    <span>{r.value}</span>
                  </div>
                ))}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0",
                  borderTop: `1px solid ${DS.border}`,
                  marginTop: 6,
                }}>
                  <span style={{ fontFamily: "'Azeret Mono', monospace", fontSize: ".8rem", color: DS.gray2 }}>
                    Total TTC
                  </span>
                  <span style={{
                    fontFamily: "'Archivo Black', sans-serif",
                    fontSize: "1.4rem", color: DS.lime,
                  }}>
                    {fmt(total)}
                  </span>
                </div>
              </div>

              {/* Checkout btn */}
              <CheckoutBtn />

              {/* Clear */}
              <motion.button
                onClick={() => { clear(); toast("Panier vidé", "warn"); }}
                whileHover={{ color: DS.red }}
                style={{
                  width: "100%", marginTop: 10,
                  background: "none", border: "none",
                  fontFamily: "'Azeret Mono', monospace",
                  fontSize: ".72rem", color: DS.gray,
                  letterSpacing: ".08em", cursor: "pointer",
                  transition: "color .2s",
                }}
              >
                Vider le panier
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}

function CartItem({ item, onRemove, onQty, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22,1,0.36,1] }}
      style={{
        display: "flex", gap: "1rem",
        background: DS.surface,
        borderRadius: 10,
        border: `1px solid ${DS.border}`,
        padding: "1rem",
        marginBottom: 8,
        position: "relative",
      }}
    >
      <img
        src={item.img} alt={item.name}
        style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Azeret Mono', monospace",
          fontSize: ".65rem", color: DS.lime,
          letterSpacing: ".08em", marginBottom: 3,
        }}>{item.cat}</div>
        <div style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: ".85rem", color: DS.white,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          marginBottom: 6,
        }}>{item.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Qty controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[-1, 1].map(delta => (
              <motion.button
                key={delta}
                whileTap={{ scale: 0.85 }}
                onClick={() => onQty(item.id, item.qty + delta)}
                style={{
                  width: 24, height: 24, borderRadius: 4,
                  border: `1px solid ${DS.b2}`,
                  background: DS.s2, color: DS.gray2,
                  fontSize: ".85rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Azeret Mono', monospace",
                  transition: "border-color .15s, color .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = DS.lime; e.currentTarget.style.color = DS.lime; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = DS.b2; e.currentTarget.style.color = DS.gray2; }}
              >
                {delta < 0 ? "−" : "+"}
              </motion.button>
            ))}
            <span style={{
              fontFamily: "'Azeret Mono', monospace",
              fontSize: ".78rem", color: DS.white,
              minWidth: 18, textAlign: "center",
            }}>{item.qty}</span>
          </div>
          <span style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: ".92rem", color: DS.amber,
            marginLeft: "auto",
          }}>
            {fmt(item.price * item.qty)}
          </span>
        </div>
      </div>
      {/* Remove */}
      <motion.button
        onClick={() => onRemove(item.id)}
        whileHover={{ color: DS.red, scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        style={{
          position: "absolute", top: 8, right: 8,
          background: "none", border: "none",
          color: DS.gray, fontSize: ".75rem", cursor: "pointer",
          fontFamily: "'Azeret Mono', monospace",
        }}
      >✕</motion.button>
    </motion.div>
  );
}

function CheckoutBtn() {
  const [hov, setHov] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "" });
  const [payMethod, setPayMethod] = useState("mobile_money");
  const { items, total, clear } = useCart();
  const toast = useToast();
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const inputStyle = {
    width: "100%", padding: "10px 12px", marginBottom: 8,
    background: DS.bg, border: `1px solid ${DS.border}`, borderRadius: 8,
    color: DS.white, fontFamily: "'Azeret Mono', monospace", fontSize: ".82rem", outline: "none",
  };

  const handleConfirm = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast("Nom et téléphone requis pour la commande", "warn");
      return;
    }
    setLoading(true);
    try {
      const [order] = await ordersService.insert({
        client_name: form.name.trim(),
        client_phone: form.phone.trim(),
        client_address: form.address.trim() || null,
        email: form.email.trim() || null,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total,
        payment_method: payMethod,
        payment_status: payMethod === "mobile_money" ? "en_attente" : "non_requis",
      });
      notify("order", { ...order });

      if (payMethod === "mobile_money") {
        const resp = await fetch("/api/monetbil-init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            amount: total,
            phone: form.phone.trim(),
            name: form.name.trim(),
          }),
        });
        const data = await resp.json();
        if (data.success && data.payment_url) {
          clear();
          window.location.href = data.payment_url; // redirige vers la page de paiement Monetbil
          return;
        }
        toast(data.message || "Impossible de lancer le paiement Mobile Money", "warn");
        setLoading(false);
        return;
      }

      // Paiement à la livraison
      toast("Commande envoyée ! Nous vous contactons sous 24h.");
      clear();
      setShowForm(false);
      setForm({ name: "", phone: "", address: "" });
    } catch (e) {
      console.error("Order insert error:", e);
      toast("Erreur lors de l'envoi. Réessayez ou contactez-nous.", "warn");
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <div>
        <input style={inputStyle} placeholder="Nom complet *" value={form.name} onChange={set("name")} />
        <input style={inputStyle} placeholder="Téléphone Mobile Money *" value={form.phone} onChange={set("phone")} />
        <input style={inputStyle} placeholder="Adresse de livraison (Douala, Akwa...)" value={form.address} onChange={set("address")} />
        <input style={inputStyle} placeholder="Email (optionnel, pour la confirmation)" value={form.email} onChange={set("email")} />

        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[
            { id: "mobile_money", label: "📱 Mobile Money" },
            { id: "livraison", label: "💵 À la livraison" },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setPayMethod(opt.id)}
              style={{
                flex: 1, padding: "9px 6px", borderRadius: 8, cursor: "pointer",
                fontFamily: "'Azeret Mono', monospace", fontSize: ".72rem",
                border: `1px solid ${payMethod === opt.id ? DS.lime : DS.border}`,
                background: payMethod === opt.id ? `${DS.lime}1a` : "transparent",
                color: payMethod === opt.id ? DS.lime : DS.gray2,
              }}
            >{opt.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <motion.button
            onClick={handleConfirm}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1, padding: "13px", background: DS.lime, color: DS.bg,
              border: "none", borderRadius: 10, cursor: "pointer",
              fontFamily: "'Archivo Black', sans-serif", fontSize: ".85rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  style={{ display: "block", width: 14, height: 14, border: `2px solid ${DS.bg}`, borderTopColor: "transparent", borderRadius: "50%" }} />
                {payMethod === "mobile_money" ? "Redirection..." : "Envoi..."}
              </>
            ) : (payMethod === "mobile_money" ? "Payer maintenant →" : "Valider la commande")}
          </motion.button>
          <button
            onClick={() => setShowForm(false)}
            disabled={loading}
            style={{ padding: "13px 16px", background: "none", border: `1px solid ${DS.border}`, borderRadius: 10, color: DS.gray2, cursor: "pointer", fontFamily: "'Azeret Mono', monospace", fontSize: ".78rem" }}
          >Annuler</button>
        </div>
        <div style={{ marginTop: 8, fontSize: ".68rem", color: DS.gray2, fontFamily: "'Azeret Mono', monospace" }}>
          {payMethod === "mobile_money"
            ? "Tu seras redirigé vers la page sécurisée Monetbil pour valider le paiement avec ton code Mobile Money."
            : "Paiement en espèces ou Mobile Money à la réception. Nous vous contactons pour confirmer."}
        </div>
      </div>
    );
  }

  return (
    <motion.button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => setShowForm(true)}
      whileTap={{ scale: 0.97 }}
      style={{
        width: "100%", padding: "14px",
        background: hov ? DS.lime2 : DS.lime,
        color: DS.bg, border: "none",
        borderRadius: 10, cursor: "pointer",
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: ".9rem", letterSpacing: ".04em",
        transition: "background .2s, box-shadow .2s",
        boxShadow: hov ? `0 8px 30px ${DS.lime}44` : "none",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        position: "relative", overflow: "hidden",
      }}
    >
      Commander →
      {/* Shimmer */}
      {hov && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent)",
            width: "50%",
          }}
        />
      )}
    </motion.button>
  );
}

/* ============================================================
   SIDEBAR FILTERS
   ============================================================ */
function Sidebar({ activeCat, onCat, priceMax, onPriceMax, maxPossible, inStock, onInStock }) {
  const counts = CATS.reduce((acc, c) => {
    acc[c] = c === "Tous" ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === c).length;
    return acc;
  }, {});

  return (
    <aside style={{
      background: DS.surface,
      border: `1px solid ${DS.border}`,
      borderRadius: 14,
      padding: "1.5rem",
      height: "fit-content",
      position: "sticky",
      top: 90,
    }}>
      {/* Header */}
      <div style={{
        fontFamily: "'Azeret Mono', monospace",
        fontSize: ".65rem", color: DS.lime,
        letterSpacing: ".14em", textTransform: "uppercase",
        marginBottom: "1.25rem",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 16, height: 1, background: DS.lime }} />
        filtres.actifs
      </div>

      {/* Categories */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{
          fontFamily: "'Azeret Mono', monospace",
          fontSize: ".68rem", color: DS.gray2,
          textTransform: "uppercase", letterSpacing: ".1em",
          marginBottom: ".75rem",
        }}>Catégories</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {CATS.map(cat => {
            const active = activeCat === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => onCat(cat)}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 10px", borderRadius: 8,
                  background: active ? `${DS.lime}12` : "transparent",
                  border: `1px solid ${active ? DS.lime + "44" : "transparent"}`,
                  color: active ? DS.lime : DS.gray2,
                  fontFamily: "'Azeret Mono', monospace",
                  fontSize: ".78rem", cursor: "pointer",
                  transition: "all .18s",
                  textAlign: "left",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = DS.s3; e.currentTarget.style.color = DS.white; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = DS.gray2; }}}
              >
                <span>{cat}</span>
                <span style={{
                  fontFamily: "'Azeret Mono', monospace",
                  fontSize: ".62rem",
                  color: active ? DS.lime : DS.gray,
                }}>
                  {counts[cat]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{
          fontFamily: "'Azeret Mono', monospace",
          fontSize: ".68rem", color: DS.gray2,
          textTransform: "uppercase", letterSpacing: ".1em",
          marginBottom: ".75rem",
          display: "flex", justifyContent: "space-between",
        }}>
          <span>Prix max</span>
          <span style={{ color: DS.amber }}>{fmt(priceMax)}</span>
        </div>
        <div style={{ position: "relative", height: 4, background: DS.b2, borderRadius: 2 }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${(priceMax / maxPossible) * 100}%`,
            background: DS.lime, borderRadius: 2,
            transition: "width .1s",
          }} />
          <input
            type="range"
            min={10000}
            max={maxPossible}
            step={5000}
            value={priceMax}
            onChange={e => onPriceMax(+e.target.value)}
            style={{
              position: "absolute", inset: "-8px 0",
              width: "100%", opacity: 0,
              cursor: "pointer", height: 20,
            }}
          />
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: "'Azeret Mono', monospace",
          fontSize: ".62rem", color: DS.gray,
          marginTop: 8,
        }}>
          <span>10 000 FCFA</span>
          <span>{fmt(maxPossible)}</span>
        </div>
      </div>

      {/* In stock toggle */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{
          display: "flex", alignItems: "center", gap: 10,
          cursor: "pointer", userSelect: "none",
        }}>
          <div
            onClick={() => onInStock(!inStock)}
            style={{
              width: 36, height: 20, borderRadius: 10,
              background: inStock ? DS.lime : DS.b2,
              position: "relative", transition: "background .25s",
              flexShrink: 0,
            }}
          >
            <motion.div
              animate={{ x: inStock ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              style={{
                position: "absolute", top: 2,
                width: 16, height: 16, borderRadius: "50%",
                background: inStock ? DS.bg : DS.gray,
              }}
            />
          </div>
          <span style={{
            fontFamily: "'Azeret Mono', monospace",
            fontSize: ".75rem", color: DS.gray2,
          }}>En stock uniquement</span>
        </label>
      </div>

      {/* Reset */}
      <motion.button
        whileHover={{ borderColor: DS.lime, color: DS.lime }}
        whileTap={{ scale: 0.97 }}
        onClick={() => { onCat("Tous"); onPriceMax(maxPossible); onInStock(false); }}
        style={{
          width: "100%", padding: "8px",
          background: "none",
          border: `1px solid ${DS.border}`,
          borderRadius: 8, color: DS.gray,
          fontFamily: "'Azeret Mono', monospace",
          fontSize: ".72rem", letterSpacing: ".08em",
          cursor: "pointer", transition: "all .2s",
        }}
      >
        Réinitialiser les filtres
      </motion.button>
    </aside>
  );
}

/* ============================================================
   PRODUCT CARD
   ============================================================ */
function ProductCard({ product, view, onQuickView }) {
  const { add } = useCart();
  const toast = useToast();
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleAdd = (e) => {
    e.stopPropagation();
    add(product);
    setAdded(true);
    toast(`${product.name} ajouté au panier`);
    setTimeout(() => setAdded(false), 2000);
  };

  if (view === "list") {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        exit={{ opacity: 0, height: 0 }}
        whileHover={{ borderColor: DS.lime + "44" }}
        onClick={() => onQuickView(product)}
        style={{
          display: "flex", gap: "1.25rem", alignItems: "center",
          background: DS.surface,
          border: `1px solid ${DS.border}`,
          borderRadius: 12, padding: "1rem 1.25rem",
          cursor: "pointer", transition: "border-color .2s",
        }}
      >
        <img src={product.img} alt={product.name}
          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Azeret Mono', monospace",
            fontSize: ".62rem", color: DS.lime, letterSpacing: ".08em", marginBottom: 3,
          }}>{product.cat}</div>
          <div style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "1rem", color: DS.white, marginBottom: 4,
          }}>{product.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Stars rating={product.rating} />
            <span style={{ fontFamily: "'Azeret Mono', monospace", fontSize: ".65rem", color: DS.gray }}>
              ({product.reviews})
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "1.15rem", color: DS.amber, marginBottom: 4,
          }}>{fmt(product.price)}</div>
          {product.oldPrice && (
            <div style={{ fontFamily: "'Azeret Mono', monospace", fontSize: ".65rem", color: DS.gray, textDecoration: "line-through", marginBottom: 8 }}>
              {fmt(product.oldPrice)}
            </div>
          )}
          <AddBtn added={added} onAdd={handleAdd} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onQuickView(product)}
      style={{ cursor: "pointer" }}
    >
      <motion.div
        animate={{
          borderColor: hov ? DS.lime + "55" : DS.border,
          y: hov ? -5 : 0,
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: DS.surface,
          border: `1px solid ${DS.border}`,
          borderRadius: 14,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", height: 200 }}>
          <motion.img
            src={product.img} alt={product.name}
            animate={{ scale: hov ? 1.06 : 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, transparent 50%, ${DS.surface} 100%)`,
          }} />
          {/* Badge */}
          {product.badge && (
            <span style={{
              position: "absolute", top: 10, left: 10,
              background: product.badge === "Promo" ? DS.lime : product.badge === "Nouveau" ? DS.amber : DS.green,
              color: DS.bg,
              fontFamily: "'Azeret Mono', monospace",
              fontSize: ".6rem", fontWeight: 600,
              padding: "3px 8px", borderRadius: 4,
              letterSpacing: ".1em", textTransform: "uppercase",
            }}>
              {product.badge}
            </span>
          )}
          {/* Stock indicator */}
          <span style={{
            position: "absolute", top: 10, right: 10,
            fontFamily: "'Azeret Mono', monospace",
            fontSize: ".6rem", color: product.stock < 5 ? DS.amber : DS.green,
            background: "rgba(8,9,14,.85)",
            padding: "3px 8px", borderRadius: 4,
            letterSpacing: ".08em",
          }}>
            {product.stock < 5 ? `${product.stock} restants` : "En stock"}
          </span>
          {/* Quick view on hover */}
          <AnimatePresence>
            {hov && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 8 }}
                  style={{
                    background: "rgba(8,9,14,.88)",
                    border: `1px solid ${DS.lime}55`,
                    borderRadius: 100, padding: "8px 18px",
                    fontFamily: "'Azeret Mono', monospace",
                    fontSize: ".7rem", color: DS.lime,
                    letterSpacing: ".1em",
                  }}
                >
                  Aperçu rapide
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* HUD corners */}
          <AnimatePresence>
            {hov && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <HudBrackets color={DS.lime + "88"} size={12} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
          <div style={{
            fontFamily: "'Azeret Mono', monospace",
            fontSize: ".6rem", color: DS.lime,
            letterSpacing: ".1em", marginBottom: 4,
          }}>{product.cat}</div>
          <h3 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: ".92rem", color: DS.white,
            marginBottom: 6, lineHeight: 1.25,
          }}>{product.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
            <Stars rating={product.rating} />
            <span style={{ fontFamily: "'Azeret Mono', monospace", fontSize: ".62rem", color: DS.gray }}>
              {product.rating} ({product.reviews})
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "1.05rem", color: DS.amber,
              }}>{fmt(product.price)}</div>
              {product.oldPrice && (
                <div style={{
                  fontFamily: "'Azeret Mono', monospace",
                  fontSize: ".62rem", color: DS.gray,
                  textDecoration: "line-through",
                }}>{fmt(product.oldPrice)}</div>
              )}
            </div>
            <div onClick={e => e.stopPropagation()}>
              <AddBtn added={added} onAdd={handleAdd} small />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddBtn({ added, onAdd, small }) {
  return (
    <motion.button
      onClick={onAdd}
      whileTap={{ scale: 0.9 }}
      animate={{
        background: added ? DS.green : DS.lime,
        scale: added ? [1, 1.15, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
      style={{
        padding: small ? "7px 12px" : "9px 16px",
        borderRadius: 8, border: "none",
        fontFamily: "'Azeret Mono', monospace",
        fontSize: ".7rem", fontWeight: 600,
        letterSpacing: ".06em", cursor: "pointer",
        color: DS.bg,
        transition: "box-shadow .2s",
        display: "flex", alignItems: "center", gap: 5,
      }}
    >
      {added ? "✓ Ajouté" : "+ Panier"}
    </motion.button>
  );
}

/* ============================================================
   QUICK VIEW MODAL
   ============================================================ */
function QuickViewModal({ product, onClose, onAdd }) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="qv-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 900,
          background: "rgba(8,9,14,.88)",
          backdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem",
        }}
      >
        <motion.div
          key="qv-box"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="rg-2"
          style={{
            background: DS.surface,
            border: `1px solid ${DS.b2}`,
            borderRadius: 18,
            maxWidth: 780, width: "100%",
            overflow: "hidden",
            display: "grid", gridTemplateColumns: "1fr 1fr",
            position: "relative",
            maxHeight: "90vh", overflowY: "auto",
          }}
        >
          <HudBrackets color={DS.lime + "33"} size={16} />

          {/* Image side */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <motion.img
              src={product.img} alt={product.name}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 340 }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to right, transparent 60%, ${DS.surface} 100%)`,
            }} />
            {product.badge && (
              <span style={{
                position: "absolute", top: 14, left: 14,
                background: product.badge === "Promo" ? DS.lime : DS.amber,
                color: DS.bg, fontFamily: "'Azeret Mono', monospace",
                fontSize: ".62rem", padding: "4px 10px",
                borderRadius: 4, letterSpacing: ".1em",
              }}>{product.badge}</span>
            )}
          </div>

          {/* Info side */}
          <div style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
            <motion.button
              onClick={onClose}
              whileHover={{ rotate: 90 }}
              style={{
                position: "absolute", top: 14, right: 14,
                width: 30, height: 30, borderRadius: "50%",
                background: DS.s2, border: `1px solid ${DS.border}`,
                color: DS.gray, fontSize: ".9rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</motion.button>

            <div style={{
              fontFamily: "'Azeret Mono', monospace",
              fontSize: ".65rem", color: DS.lime,
              letterSpacing: ".12em", marginBottom: 8,
            }}>{product.cat}</div>

            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "1.3rem", color: DS.white,
              lineHeight: 1.2, marginBottom: 10,
            }}>{product.name}</h2>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
              <Stars rating={product.rating} size={13} />
              <span style={{ fontFamily: "'Azeret Mono', monospace", fontSize: ".68rem", color: DS.gray }}>
                {product.rating}/5 · {product.reviews} avis
              </span>
            </div>

            <p style={{
              fontSize: ".85rem", color: DS.gray2,
              lineHeight: 1.75, fontFamily: "'Azeret Mono', monospace",
              fontWeight: 300, marginBottom: "1.5rem", flex: 1,
            }}>{product.desc}</p>

            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem",
              fontFamily: "'Azeret Mono', monospace", fontSize: ".72rem",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: product.stock < 5 ? DS.amber : DS.green,
              }} />
              <span style={{ color: product.stock < 5 ? DS.amber : DS.green }}>
                {product.stock < 5 ? `${product.stock} en stock` : "Disponible immédiatement"}
              </span>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "1.6rem", color: DS.amber,
              }}>{fmt(product.price)}</div>
              {product.oldPrice && (
                <div style={{
                  fontFamily: "'Azeret Mono', monospace",
                  fontSize: ".72rem", color: DS.gray,
                  textDecoration: "line-through",
                }}>
                  {fmt(product.oldPrice)} — Économie : {fmt(product.oldPrice - product.price)}
                </div>
              )}
            </div>

            <QvAddBtn product={product} onClose={onClose} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function QvAddBtn({ product, onClose }) {
  const { add } = useCart();
  const toast = useToast();
  const [done, setDone] = useState(false);
  const handle = () => {
    add(product);
    toast(`${product.name} ajouté au panier`);
    setDone(true);
    setTimeout(() => { setDone(false); onClose(); }, 900);
  };
  return (
    <motion.button
      onClick={handle}
      whileTap={{ scale: 0.97 }}
      animate={{ background: done ? DS.green : DS.lime }}
      style={{
        width: "100%", padding: "13px",
        border: "none", borderRadius: 10,
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: ".88rem", letterSpacing: ".04em",
        cursor: "pointer", color: DS.bg,
        boxShadow: `0 4px 20px ${DS.lime}33`,
      }}
    >
      {done ? "✓ Ajouté !" : "Ajouter au panier"}
    </motion.button>
  );
}

/* ============================================================
   STORE TOOLBAR
   ============================================================ */
function StoreToolbar({ count, view, onView, sort, onSort }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "1.25rem", flexWrap: "wrap", gap: 10,
    }}>
      <span style={{
        fontFamily: "'Azeret Mono', monospace",
        fontSize: ".72rem", color: DS.gray,
        letterSpacing: ".06em",
      }}>
        {count} produit{count !== 1 ? "s" : ""}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Sort */}
        <select
          value={sort}
          onChange={e => onSort(e.target.value)}
          style={{
            background: DS.surface, border: `1px solid ${DS.border}`,
            borderRadius: 8, padding: "6px 10px",
            color: DS.gray2, fontFamily: "'Azeret Mono', monospace",
            fontSize: ".72rem", cursor: "pointer", outline: "none",
          }}
        >
          <option value="">Trier par</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Mieux notés</option>
          <option value="name">Nom A–Z</option>
        </select>

        {/* View toggle */}
        <div style={{
          display: "flex",
          background: DS.surface, border: `1px solid ${DS.border}`,
          borderRadius: 8, overflow: "hidden",
        }}>
          {[
            { v: "grid", icon: "▦" },
            { v: "list", icon: "☰" },
          ].map(({ v, icon }) => (
            <motion.button
              key={v}
              onClick={() => onView(v)}
              whileTap={{ scale: 0.9 }}
              style={{
                padding: "7px 12px",
                background: view === v ? DS.lime : "transparent",
                color: view === v ? DS.bg : DS.gray2,
                border: "none", cursor: "pointer",
                fontFamily: "'Azeret Mono', monospace",
                fontSize: ".85rem", transition: "all .2s",
              }}
            >
              {icon}
            </motion.button>
          ))}
        </div>
      </div>
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
      fontFamily: "'Azeret Mono', monospace",
      fontSize: ".68rem", color: DS.lime,
      letterSpacing: ".14em", textTransform: "uppercase",
      marginBottom: "1rem",
    }}>
      <span style={{ width: 24, height: 1, background: DS.lime }} />
      {text}
    </div>
  );
}

/* ============================================================
   BOUTIQUE SECTION — MAIN EXPORT
   ============================================================ */
export default function BoutiqueSection() {
  const { theme } = useTheme();
  Object.assign(DS, theme === "light" ? LIGHT_B : DARK_B);
  const [cartOpen, setCartOpen]   = useState(false);
  const [activeCat, setActiveCat] = useState("Tous");
  const [priceMax, setPriceMax]   = useState(640000);
  const [inStockOnly, setInStock] = useState(false);
  const [view, setView]           = useState("grid");
  const [sort, setSort]           = useState("");
  const [quickView, setQuickView] = useState(null);
  const [catalog, setCatalog]     = useState(PRODUCTS);

  useEffect(() => {
    productsService.getAll()
      .then(rows => {
        if (rows && rows.length) {
          setCatalog(rows.map(r => ({
            id: r.id,
            name: r.name,
            cat: r.cat,
            price: Number(r.price),
            oldPrice: r.old_price ? Number(r.old_price) : null,
            stock: r.stock ?? 0,
            badge: r.badge,
            rating: r.rating ? Number(r.rating) : 4.7,
            reviews: r.reviews ?? 0,
            img: r.img,
            desc: r.description,
          })));
        }
      })
      .catch(() => { /* table pas encore créée : on garde le catalogue de démo */ });
  }, []);

  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  const maxPossible = 640000;

  /* Filter + sort */
  let visible = catalog.filter(p => {
    const catOk   = activeCat === "Tous" || p.cat === activeCat;
    const priceOk = p.price <= priceMax;
    const stockOk = !inStockOnly || p.stock > 0;
    return catOk && priceOk && stockOk;
  });
  if (sort === "price-asc")  visible = [...visible].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") visible = [...visible].sort((a,b) => b.price - a.price);
  if (sort === "rating")     visible = [...visible].sort((a,b) => b.rating - a.rating);
  if (sort === "name")       visible = [...visible].sort((a,b) => a.name.localeCompare(b.name));

  return (
    <BoutiqueInner
      sectionRef={sectionRef}
      titleRef={titleRef}
      titleInView={titleInView}
      cartOpen={cartOpen}
      setCartOpen={setCartOpen}
      activeCat={activeCat}
      setActiveCat={setActiveCat}
      priceMax={priceMax}
      setPriceMax={setPriceMax}
      maxPossible={maxPossible}
      inStockOnly={inStockOnly}
      setInStock={setInStock}
      view={view}
      setView={setView}
      sort={sort}
      setSort={setSort}
      quickView={quickView}
      setQuickView={setQuickView}
      visible={visible}
    />
  );
}

function BoutiqueInner({
  sectionRef, titleRef, titleInView,
  cartOpen, setCartOpen,
  activeCat, setActiveCat,
  priceMax, setPriceMax, maxPossible,
  inStockOnly, setInStock,
  view, setView,
  sort, setSort,
  quickView, setQuickView,
  visible,
}) {
  const { count } = useCart();
  const toast     = useToast();

  return (
    <section
      id="boutique"
      ref={sectionRef}
      style={{
        background: DS.bg,
        padding: "6rem 0 7rem",
        fontFamily: "'Azeret Mono', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`@import url('${FONTS}');`}</style>

      {/* Background pattern */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          radial-gradient(circle at 1px 1px, ${DS.lime}10 1px, transparent 0)
        `,
        backgroundSize: "32px 32px",
        opacity: .4,
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 50% at 80% 30%, ${DS.lime}07 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: 1680, width: "100%", margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3.5rem)", position: "relative", zIndex: 2, boxSizing: "border-box" }}>

        {/* Header */}
        <div ref={titleRef} style={{ marginBottom: "3.5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}
          >
            <div>
              <Eyebrow text="Boutique" />
              <h2 style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                color: DS.white, lineHeight: 1, letterSpacing: ".02em",
              }}>
                Matériel<br />
                <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: `2px ${DS.lime}` }}>
                  Informatique
                </span>
              </h2>
              <p style={{
                color: DS.gray2, fontSize: ".85rem", lineHeight: 1.8,
                marginTop: "1rem", maxWidth: 420,
              }}>
                Accessoires et équipements informatiques disponibles à Douala. Livraison 24–48h, garantie constructeur.
              </p>
            </div>

            {/* Cart summary card */}
            <CartSummaryCard onOpen={() => setCartOpen(true)} />
          </motion.div>
        </div>

        {/* Layout: sidebar + grid */}
        <div className="rg-sidebar" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem", alignItems: "start" }}>
          <Sidebar
            activeCat={activeCat} onCat={setActiveCat}
            priceMax={priceMax} onPriceMax={setPriceMax}
            maxPossible={maxPossible}
            inStock={inStockOnly} onInStock={setInStock}
          />

          <div>
            <StoreToolbar
              count={visible.length}
              view={view} onView={setView}
              sort={sort} onSort={setSort}
            />

            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`${view}-${activeCat}-${sort}`}
                  layout
                  style={
                    view === "grid"
                      ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }
                      : { display: "flex", flexDirection: "column", gap: "1rem" }
                  }
                >
                  {visible.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      view={view}
                      onQuickView={setQuickView}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </LayoutGroup>

            {visible.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "4rem", color: DS.gray }}
              >
                <div style={{ fontSize: ".72rem", letterSpacing: ".1em" }}>// aucun.produit.trouvé</div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Quick view modal */}
      <AnimatePresence>
        {quickView && (
          <QuickViewModal
            product={quickView}
            onClose={() => setQuickView(null)}
            onAdd={() => {}}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============================================================
   CART SUMMARY CARD (header widget)
   ============================================================ */
function CartSummaryCard({ onOpen }) {
  const { items, count, total } = useCart();
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onOpen}
      whileTap={{ scale: 0.98 }}
      animate={{ borderColor: hov ? DS.lime + "66" : DS.border }}
      style={{
        background: DS.surface,
        border: `1px solid ${DS.border}`,
        borderRadius: 14, padding: "1.25rem 1.5rem",
        cursor: "pointer", minWidth: 220,
        position: "relative", overflow: "hidden",
        transition: "border-color .2s",
      }}
    >
      <HudBrackets color={hov ? DS.lime + "44" : "transparent"} size={8} />
      <div style={{ fontSize: ".62rem", color: DS.lime, letterSpacing: ".12em", marginBottom: 6 }}>
        // panier.résumé
      </div>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: "1.6rem", color: DS.amber, lineHeight: 1, marginBottom: 4,
      }}>
        {count > 0 ? fmt(total) : "0 FCFA"}
      </div>
      <div style={{ fontSize: ".72rem", color: DS.gray2, marginBottom: "1rem" }}>
        {count} article{count !== 1 ? "s" : ""} dans le panier
      </div>
      <motion.div
        animate={{ background: hov ? DS.lime2 : DS.lime }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "7px 14px", borderRadius: 8,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: ".78rem", color: DS.bg,
        }}
      >
        Voir le panier →
      </motion.div>
      {/* Pulse animation when items > 0 */}
      {count > 0 && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute", top: 12, right: 12,
            width: 8, height: 8, borderRadius: "50%",
            background: DS.lime,
          }}
        />
      )}
    </motion.div>
  );
}
