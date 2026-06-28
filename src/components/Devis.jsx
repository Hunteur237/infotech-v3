import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView, LayoutGroup } from 'framer-motion'
import { DS, FONTS } from '../lib/design.js'
import { DEVIS_TYPES, DEVIS_OPTIONS, FAQ_DATA, PROJECTS } from '../lib/data.js'
import { Section, Container, Reveal, BtnPrimary, BtnGhost, useToast, Spinner } from './UI.jsx'
import { quotesService } from '../lib/supabase.js'
import { notify } from '../lib/notify.js'
import { useAuth } from '../lib/auth.jsx'

// Icônes SVG inline (remplace les emojis) pour les types de projet du devis
const TYPE_ICONS = {
  globe:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  cart:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  gear:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  phone:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  factory: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20V9l5 4V9l5 4V9l5 4V4h5v16H2z"/></svg>,
  wrench:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
}

// ── CALCULATEUR DE DEVIS ──────────────────────────────────
export function DevisSection(){
  const { user } = useAuth()
  const[type,setType]=useState(null),[users,setUsers]=useState(5),[opts,setOpts]=useState([]),[urgence,setUrgence]=useState(false),[form,setForm]=useState({name:'',email:'',phone:''}),[sent,setSent]=useState(false),[loading,setLoading]=useState(false)
  const toast=useToast(),ref=useRef(null),inView=useInView(ref,{once:true,margin:'-60px'})
  const set=k=>e=>setForm(p=>({...p,[k]:e.target.value}))
  const toggleOpt=id=>setOpts(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
  const base=DEVIS_TYPES.find(t=>t.id===type)?.base||0
  const userMult=users<=5?1:users<=20?1.3:users<=50?1.6:2
  const optTotal=opts.reduce((s,id)=>s+(DEVIS_OPTIONS.find(o=>o.id===id)?.cost||0),0)
  const urgMult=urgence?1.25:1
  const total=Math.round(base*userMult*urgMult+optTotal)
  const typeData=DEVIS_TYPES.find(t=>t.id===type)
  const delai=typeData?(urgence?Math.ceil(typeData.delai*.7):typeData.delai+4):0
  const handleSend=async()=>{if(!type){toast('Sélectionnez un type de projet','warn');return};setLoading(true);try{await quotesService.insert({name:form.name,email:form.email,phone:form.phone,project_type:type,users_count:users,options:opts,urgence,estimated_total:total,user_id:user?.id||null});notify('devis',{name:form.name,email:form.email,phone:form.phone,project_type:type,estimated_total:total})}catch{};setSent(true);setLoading(false);toast('Devis envoyé ! Réponse sous 24h.')}
  const inp={width:'100%',padding:'9px 13px',background:DS.bg2,border:`1px solid ${DS.border}`,borderRadius:DS.r,color:DS.white,fontFamily:FONTS.body,fontSize:'.85rem',outline:'none'}
  const focus=e=>e.target.style.borderColor=DS.lime,blur=e=>e.target.style.borderColor=DS.border
  return <Section id="devis" bg={DS.bg2}>
    <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${DS.lime}05 1px,transparent 1px),linear-gradient(90deg,${DS.lime}05 1px,transparent 1px)`,backgroundSize:'60px 60px',pointerEvents:'none'}}/>
    <Container>
      <div ref={ref}><motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7}} style={{textAlign:'center',marginBottom:'3rem'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:FONTS.mono,fontSize:'.68rem',color:DS.lime,letterSpacing:'.16em',textTransform:'uppercase',marginBottom:'1rem'}}><span style={{width:28,height:1,background:DS.lime}}/>Calculateur de devis</div>
        <h2 style={{fontFamily:FONTS.display,fontWeight:800,fontSize:'clamp(2rem,4vw,3.5rem)',color:DS.white,marginBottom:'.75rem'}}>Estimez votre <span style={{color:DS.lime}}>budget</span> en temps réel</h2>
        <p style={{fontFamily:FONTS.body,color:DS.gray3,fontSize:'.95rem',maxWidth:480,margin:'0 auto'}}>Configurez votre projet et obtenez une estimation instantanée. Sans engagement.</p>
      </motion.div></div>
      <div className="rg-sidebar" style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:'2rem',alignItems:'start'}}>
        <div style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:DS.r3,padding:'2rem'}}>
          <Step num={1} label="Type de projet"/>
          <div className="rg-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.75rem',marginBottom:'2rem'}}>
            {DEVIS_TYPES.map(t=><motion.button key={t.id} onClick={()=>setType(t.id)} whileTap={{scale:.97}} style={{padding:'.85rem 1rem',borderRadius:DS.r2,border:`1px solid ${type===t.id?DS.lime+'55':DS.border}`,background:type===t.id?`${DS.lime}0E`:'transparent',cursor:'pointer',textAlign:'left',transition:'all .2s'}}>
              <div style={{fontSize:'1.2rem',marginBottom:'.35rem',color:type===t.id?DS.lime:DS.gray2}}>{TYPE_ICONS[t.icon]}</div>
              <div style={{fontFamily:FONTS.body,fontSize:'.82rem',fontWeight:600,color:type===t.id?DS.white:DS.gray3}}>{t.label}</div>
              <div style={{fontFamily:FONTS.mono,fontSize:'.62rem',color:type===t.id?DS.lime:DS.gray,marginTop:2}}>{(t.base/1000).toFixed(0)}K FCFA</div>
            </motion.button>)}
          </div>
          <Step num={2} label={`Utilisateurs : ${users}`}/>
          <div style={{position:'relative',height:4,background:DS.border,borderRadius:2,margin:'1rem 0 .5rem'}}><div style={{position:'absolute',left:0,top:0,bottom:0,width:`${Math.min(users/100*100,100)}%`,background:DS.lime,borderRadius:2,transition:'width .1s'}}/><input type="range" min={1} max={100} value={users} onChange={e=>setUsers(+e.target.value)} style={{position:'absolute',inset:'-8px 0',width:'100%',opacity:0,cursor:'pointer',height:20}}/></div>
          <div style={{display:'flex',justifyContent:'space-between',fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray,marginBottom:'2rem'}}><span>1</span><span>50</span><span>100+</span></div>
          <Step num={3} label="Options"/>
          <div style={{display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'2rem'}}>
            {DEVIS_OPTIONS.map(o=>{const on=opts.includes(o.id);return <motion.label key={o.id} whileTap={{scale:.99}} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'.72rem 1rem',borderRadius:DS.r2,border:`1px solid ${on?DS.lime+'44':DS.border}`,background:on?`${DS.lime}08`:'transparent',cursor:'pointer',transition:'all .18s'}}>
              <div onClick={()=>toggleOpt(o.id)} style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${on?DS.lime:DS.border}`,background:on?DS.lime:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .18s'}}>{on&&<svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke={DS.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
              <span style={{fontFamily:FONTS.body,fontSize:'.85rem',color:on?DS.white:DS.gray3,flex:1}}>{o.label}</span>
              <span style={{fontFamily:FONTS.mono,fontSize:'.7rem',color:on?DS.lime:DS.gray}}>+{(o.cost/1000).toFixed(0)}K</span>
            </motion.label>})}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem',borderRadius:DS.r2,border:`1px solid ${urgence?DS.gold+'44':DS.border}`,background:urgence?`${DS.gold}08`:'transparent',transition:'all .2s'}}>
            <div><div style={{fontFamily:FONTS.body,fontSize:'.88rem',fontWeight:600,color:urgence?DS.gold:DS.gray3}}>Mode Urgence (+25%)</div><div style={{fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray,marginTop:2}}>Livraison prioritaire accélérée</div></div>
            <div onClick={()=>setUrgence(v=>!v)} style={{width:42,height:22,borderRadius:11,background:urgence?DS.gold:DS.border,position:'relative',cursor:'pointer',transition:'background .25s',flexShrink:0}}><motion.div animate={{x:urgence?22:2}} transition={{type:'spring',stiffness:500,damping:32}} style={{position:'absolute',top:2,width:18,height:18,borderRadius:'50%',background:urgence?DS.bg:DS.gray3}}/></div>
          </div>
        </div>
        <div style={{position:'sticky',top:90}}>
          <motion.div animate={{borderColor:type?DS.lime+'44':DS.border}} style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:DS.r3,overflow:'hidden',transition:'border-color .3s'}}>
            <div style={{background:DS.bg2,padding:'1.25rem 1.5rem',borderBottom:`1px solid ${DS.border}`}}><div style={{fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.lime,letterSpacing:'.12em',marginBottom:'.4rem'}}>// estimation.devis</div><div style={{fontFamily:FONTS.display,fontWeight:800,fontSize:'1.05rem',color:DS.white}}>Votre devis estimatif</div></div>
            <div style={{padding:'2rem 1.5rem',borderBottom:`1px solid ${DS.border}`,textAlign:'center'}}>
              {type?<motion.div key={total} initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:400,damping:20}}>
                <div style={{fontFamily:FONTS.mono,fontSize:'.65rem',color:DS.gray,marginBottom:'.5rem',letterSpacing:'.1em'}}>ESTIMATION TOTALE</div>
                <div style={{fontFamily:FONTS.display,fontWeight:800,fontSize:'2.4rem',color:DS.lime,lineHeight:1}}>{total.toLocaleString('fr-FR')}</div>
                <div style={{fontFamily:FONTS.mono,fontSize:'.72rem',color:DS.gold,marginTop:'.2rem'}}>FCFA</div>
                {delai>0&&<div style={{fontFamily:FONTS.body,fontSize:'.78rem',color:DS.gray3,marginTop:'.75rem'}}>Délai estimé : <strong style={{color:DS.white}}>{delai} semaines</strong></div>}
              </motion.div>:<div style={{fontFamily:FONTS.mono,fontSize:'.72rem',color:DS.gray,letterSpacing:'.08em',lineHeight:2}}>// sélectionnez<br/>// un type de projet</div>}
            </div>
            <div style={{padding:'1.5rem'}}>
              {!sent?<><div style={{fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray2,letterSpacing:'.08em',marginBottom:'1rem'}}>Recevoir ce devis par email</div>
              <div style={{display:'flex',flexDirection:'column',gap:'.75rem',marginBottom:'1rem'}}>
                {[{k:'name',ph:'Votre nom'},{k:'email',ph:'Email',type:'email'},{k:'phone',ph:'+237 6XX XXX XXX'}].map(f=><input key={f.k} type={f.type||'text'} value={form[f.k]} onChange={set(f.k)} placeholder={f.ph} style={inp} onFocus={focus} onBlur={blur}/>)}
              </div>
              <motion.button onClick={handleSend} disabled={loading||!type} whileTap={{scale:.97}} style={{width:'100%',padding:'13px',borderRadius:DS.r2,background:type?DS.lime:DS.border,color:type?DS.bg:DS.gray,fontFamily:FONTS.display,fontWeight:700,fontSize:'.9rem',border:'none',cursor:'pointer',transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                {loading?<><Spinner size={14} color={DS.bg}/>Envoi...</>:type?'Envoyer ce devis →':'Sélectionnez un projet'}
              </motion.button></>
              :<motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} style={{textAlign:'center',padding:'1.5rem 0'}}>
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:300,damping:20}} style={{width:52,height:52,borderRadius:'50%',background:`${DS.lime}15`,border:`2px solid ${DS.lime}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',fontSize:'1.3rem',color:DS.lime}}>✓</motion.div>
                <div style={{fontFamily:FONTS.display,fontWeight:700,fontSize:'1.1rem',color:DS.white,marginBottom:'.4rem'}}>Devis envoyé !</div>
                <div style={{fontFamily:FONTS.mono,fontSize:'.7rem',color:DS.gray3}}>Réponse garantie sous 24h</div>
              </motion.div>}
              <div style={{fontFamily:FONTS.mono,fontSize:'.6rem',color:DS.gray,textAlign:'center',marginTop:'.75rem'}}>Devis officiel · Sans engagement · Gratuit</div>
            </div>
          </motion.div>
        </div>
      </div>
    </Container>
  </Section>
}

function Step({num,label}){return <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}><span style={{width:22,height:22,borderRadius:'50%',background:`${DS.lime}14`,border:`1px solid ${DS.lime}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.mono,fontSize:'.65rem',color:DS.lime,flexShrink:0}}>{num}</span><span style={{fontFamily:FONTS.mono,fontSize:'.68rem',color:DS.lime,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>{label}</span></div>}

// ── COMPARATEUR ──────────────────────────────────────────
export function ComparateurSection(){
  const[sel,setSel]=useState([null,null]),ref=useRef(null),inView=useInView(ref,{once:true,margin:'-60px'})
  const pick=(slot,id)=>{const n=[...sel];n[slot]=id;setSel(n)}
  const getP=id=>PROJECTS.find(p=>p.id===id)
  const A=sel[0]?getP(sel[0]):null,B=sel[1]?getP(sel[1]):null
  const ROWS=[{label:'Secteur cible',key:'secteur'},{label:'Délai livraison',key:'delai'},{label:'Budget estimé',key:'budget'}]
  return <Section bg={DS.bg}>
    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 60% 50% at 80% 50%,${DS.blue}05,transparent)`,pointerEvents:'none'}}/>
    <Container>
      <div ref={ref}><motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7}} style={{textAlign:'center',marginBottom:'3rem'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:FONTS.mono,fontSize:'.68rem',color:DS.lime,letterSpacing:'.16em',textTransform:'uppercase',marginBottom:'1rem'}}><span style={{width:28,height:1,background:DS.lime}}/>Comparer</div>
        <h2 style={{fontFamily:FONTS.display,fontWeight:800,fontSize:'clamp(2rem,4vw,3.5rem)',color:DS.white,marginBottom:'.75rem'}}>Comparez <span style={{color:DS.lime}}>2 logiciels</span> côte à côte</h2>
        <p style={{fontFamily:FONTS.body,color:DS.gray3,fontSize:'.95rem',maxWidth:480,margin:'0 auto'}}>Sélectionnez deux solutions pour les comparer instantanément.</p>
      </motion.div></div>
      <div className="rg-stack" style={{display:'grid',gridTemplateColumns:'1fr 60px 1fr',gap:'1rem',alignItems:'center',marginBottom:'2rem'}}>
        {[0,1].map(slot=><div key={slot}><div style={{fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray2,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.5rem'}}>Solution {slot===0?'A':'B'}</div><select value={sel[slot]||''} onChange={e=>pick(slot,e.target.value)} style={{width:'100%',padding:'12px 16px',background:DS.surface,border:`1px solid ${sel[slot]?DS.lime+'44':DS.border}`,borderRadius:DS.r2,color:sel[slot]?DS.white:DS.gray2,fontFamily:FONTS.body,fontSize:'.9rem',outline:'none',cursor:'pointer',transition:'border-color .2s'}}><option value=''>-- Choisir un logiciel --</option>{PROJECTS.map(p=><option key={p.id} value={p.id}>{p.title.replace('\n',' — ')}</option>)}</select></div>)}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'1.5rem'}}><div style={{width:44,height:44,borderRadius:'50%',background:DS.s2,border:`1px solid ${DS.b2}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.display,fontWeight:800,fontSize:'.8rem',color:DS.lime}}>VS</div></div>
      </div>
      <AnimatePresence>{(A||B)&&<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.5}}>
        <div className="rg-compare-wrap"><div>
        <div className="rg-compare-table" style={{display:'grid',gridTemplateColumns:'180px 1fr 1fr',gap:'1px',background:DS.border,borderRadius:`${DS.r2} ${DS.r2} 0 0`,overflow:'hidden'}}>
          <div style={{background:DS.bg2,padding:'1rem'}}/>
          {[A,B].map((p,i)=><div key={i} style={{background:p?DS.s2:DS.bg2,padding:'1.25rem',borderTop:`3px solid ${p?p.color:DS.border}`}}>{p?<><div style={{fontFamily:FONTS.mono,fontSize:'.62rem',color:p.color,letterSpacing:'.1em',marginBottom:'.3rem'}}>{p.catLabel}</div><div style={{fontFamily:FONTS.display,fontWeight:700,color:DS.white,fontSize:'.95rem',lineHeight:1.2}}>{p.title.replace('\n',' — ')}</div></>:<div style={{color:DS.gray,fontSize:'.82rem',fontStyle:'italic'}}>Non sélectionné</div>}</div>)}
        </div>
        {ROWS.map((row,ri)=><div key={row.key} className="rg-compare-table" style={{display:'grid',gridTemplateColumns:'180px 1fr 1fr',gap:'1px',background:DS.border}}><div style={{background:DS.bg2,padding:'.9rem 1rem',display:'flex',alignItems:'center'}}><span style={{fontFamily:FONTS.mono,fontSize:'.65rem',color:DS.gray2,letterSpacing:'.08em',textTransform:'uppercase'}}>{row.label}</span></div>{[A,B].map((p,i)=><div key={i} style={{background:ri%2===0?DS.surface:DS.s2,padding:'.9rem 1rem'}}><span style={{fontFamily:FONTS.body,fontSize:'.85rem',color:p?DS.white:DS.gray,fontWeight:p?500:300}}>{p?p[row.key]:'—'}</span></div>)}</div>)}
        <div className="rg-compare-table" style={{display:'grid',gridTemplateColumns:'180px 1fr 1fr',gap:'1px',background:DS.border}}>
          <div style={{background:DS.bg2,padding:'1rem',display:'flex',alignItems:'flex-start'}}><span style={{fontFamily:FONTS.mono,fontSize:'.65rem',color:DS.gray2,letterSpacing:'.08em',textTransform:'uppercase'}}>Modules</span></div>
          {[A,B].map((p,i)=><div key={i} style={{background:DS.surface,padding:'1rem'}}>{p?p.modules.map((m,mi)=><div key={mi} style={{display:'flex',alignItems:'center',gap:7,padding:'4px 0',borderBottom:`1px solid ${DS.border}`}}><span style={{width:5,height:5,borderRadius:'50%',background:p.color,flexShrink:0}}/><span style={{fontFamily:FONTS.body,fontSize:'.78rem',color:DS.gray2}}>{m}</span></div>):<span style={{color:DS.gray,fontSize:'.82rem'}}>—</span>}</div>)}
        </div>
        <div className="rg-compare-table" style={{display:'grid',gridTemplateColumns:'180px 1fr 1fr',gap:'1px',background:DS.border,borderRadius:`0 0 ${DS.r2} ${DS.r2}`,overflow:'hidden'}}>
          <div style={{background:DS.bg2,padding:'1rem'}}/>
          {[A,B].map((p,i)=><div key={i} style={{background:DS.s2,padding:'1rem'}}>{p?<motion.a href="#contact" whileHover={{y:-2}} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'9px 18px',borderRadius:DS.r2,background:p.color,color:DS.bg,fontFamily:FONTS.body,fontWeight:700,fontSize:'.8rem'}}>Demander →</motion.a>:<span style={{color:DS.gray,fontSize:'.8rem'}}>Sélectionnez</span>}</div>)}
        </div>
        </div></div>
      </motion.div>}</AnimatePresence>
      {!A&&!B&&<div style={{textAlign:'center',padding:'3rem',color:DS.gray,fontFamily:FONTS.mono,fontSize:'.75rem',letterSpacing:'.08em'}}>// sélectionnez deux logiciels pour démarrer</div>}
    </Container>
  </Section>
}

// ── FAQ ──────────────────────────────────────────────────
export function FAQSection(){
  const[open,setOpen]=useState(null),ref=useRef(null),inView=useInView(ref,{once:true,margin:'-60px'})
  return <Section bg={DS.bg2}>
    <Container style={{maxWidth:900}}>
      <div ref={ref}><motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7}} style={{textAlign:'center',marginBottom:'3.5rem'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:FONTS.mono,fontSize:'.68rem',color:DS.lime,letterSpacing:'.16em',textTransform:'uppercase',marginBottom:'1rem'}}><span style={{width:28,height:1,background:DS.lime}}/>FAQ</div>
        <h2 style={{fontFamily:FONTS.display,fontWeight:800,fontSize:'clamp(2rem,4vw,3.5rem)',color:DS.white}}>Questions <span style={{color:DS.lime}}>fréquentes</span></h2>
      </motion.div></div>
      <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
        {FAQ_DATA.map((item,i)=>{const isOpen=open===i;return <motion.div key={i} initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*.06,duration:.5}} style={{background:isOpen?DS.surface:'transparent',border:`1px solid ${isOpen?DS.lime+'33':DS.border}`,borderRadius:DS.r2,overflow:'hidden',transition:'border-color .25s,background .25s'}}>
          <button onClick={()=>setOpen(isOpen?null:i)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',padding:'1.2rem 1.5rem',background:'none',border:'none',cursor:'pointer',textAlign:'left'}}>
            <span style={{fontFamily:FONTS.body,fontSize:'.95rem',fontWeight:600,color:isOpen?DS.white:DS.gray3,flex:1,lineHeight:1.4}}>{item.q}</span>
            <motion.div animate={{rotate:isOpen?45:0}} transition={{duration:.25}} style={{width:28,height:28,borderRadius:'50%',border:`1px solid ${isOpen?DS.lime:DS.border}`,display:'flex',alignItems:'center',justifyContent:'center',color:isOpen?DS.lime:DS.gray,fontSize:'1.1rem',flexShrink:0,transition:'border-color .2s,color .2s'}}>+</motion.div>
          </button>
          <AnimatePresence>{isOpen&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.35,ease:[.22,1,.36,1]}} style={{overflow:'hidden'}}><div style={{padding:'0 1.5rem 1.5rem'}}><div style={{width:'100%',height:1,background:DS.border,marginBottom:'1rem'}}/><p style={{fontFamily:FONTS.body,fontSize:'.9rem',color:DS.gray3,lineHeight:1.8,fontWeight:300}}>{item.a}</p></div></motion.div>}</AnimatePresence>
        </motion.div>})}
      </div>
      <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:.3}} style={{textAlign:'center',marginTop:'2.5rem'}}>
        <p style={{fontFamily:FONTS.body,color:DS.gray3,fontSize:'.9rem',marginBottom:'1rem'}}>Vous ne trouvez pas votre réponse ?</p>
        <BtnGhost label="Posez-nous directement →" href="#contact"/>
      </motion.div>
    </Container>
  </Section>
}
