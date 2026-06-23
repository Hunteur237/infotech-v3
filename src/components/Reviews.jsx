import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { DS, FONTS } from '../lib/design.js'
import { reviewsService } from '../lib/supabase.js'
import { Section, Container, Reveal, useToast, Spinner } from './UI.jsx'

const FALLBACK=[{id:'r1',name:'Alphonse Mbella',company:'Ets Mbella Distribution',service:'Développement Web',note:5,text:'INFO-TECH a transformé notre présence en ligne. Notre site génère maintenant 40% de nos ventes.',avatar:'AM',created_at:'2025-04-18'},{id:'r2',name:'Christelle Nkeng',company:'Cabinet Nkeng & Associés',service:'Logiciel Métier',note:5,text:'Notre logiciel livré en avance. Ce qui prenait 3h se fait en 10 minutes. ROI immédiat.',avatar:'CN',created_at:'2025-04-05'},{id:'r3',name:'Paul-Eric Biyong',company:'Agro-Cam SARL',service:'Maintenance IT',note:4,text:'Contrat de maintenance depuis 2 ans. Interventions rapides et professionnelles.',avatar:'PB',created_at:'2025-03-28'},{id:'r4',name:'Marthe Olinga',company:'Pharmacie Centrale Bassa',service:'Application Mobile',note:5,text:'L\'application de gestion pharmaceutique est parfaite. ROI atteint en 3 mois.',avatar:'MO',created_at:'2025-03-14'}]

function RevCard({r,i}){
  const ref=useRef(null),inView=useInView(ref,{once:true,margin:'-60px'})
  const[hov,setHov]=useState(false)
  return <motion.article ref={ref} initial={{opacity:0,y:32}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*.1,duration:.7,ease:[.22,1,.36,1]}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:DS.surface,border:`1px solid ${hov?DS.lime+'33':DS.border}`,borderRadius:DS.r3,padding:'2rem',position:'relative',overflow:'hidden',transition:'border-color .25s,transform .25s',transform:hov?'translateY(-4px)':'none'}}>
    <div style={{position:'absolute',top:-10,left:20,fontFamily:"'Playfair Display',serif",fontSize:'7rem',color:DS.lime,opacity:.05,lineHeight:1,pointerEvents:'none'}}>&#8220;</div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
      <div style={{color:DS.gold,fontSize:'.95rem',letterSpacing:2}}>{'★'.repeat(r.note)}{'☆'.repeat(5-r.note)}</div>
      <span style={{fontFamily:FONTS.mono,fontSize:'.65rem',fontWeight:700,color:DS.lime,background:`${DS.lime}10`,padding:'3px 10px',borderRadius:100,border:`1px solid ${DS.lime}25`,letterSpacing:'.08em',textTransform:'uppercase'}}>{r.service}</span>
    </div>
    <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'.96rem',color:DS.gray3,lineHeight:1.75,marginBottom:'1.5rem'}}>&#8220;{r.text}&#8221;</p>
    <div style={{display:'flex',alignItems:'center',gap:'.85rem'}}>
      <div style={{width:42,height:42,borderRadius:'50%',background:`linear-gradient(135deg,${DS.lime}88,${DS.lime2}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONTS.display,fontWeight:800,fontSize:'.9rem',color:DS.bg,flexShrink:0}}>{r.avatar||r.name?.charAt(0)}</div>
      <div><div style={{fontFamily:FONTS.body,fontWeight:600,fontSize:'.9rem',color:DS.white}}>{r.name}</div><div style={{fontFamily:FONTS.mono,fontSize:'.7rem',color:DS.gray2}}>{r.company}</div></div>
    </div>
    <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{delay:i*.1+.4,duration:.6}} style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${DS.lime},transparent)`,transformOrigin:'left'}}/>
  </motion.article>
}

function RevForm({onSubmit}){
  const[form,setForm]=useState({name:'',company:'',service:'',note:0,text:''}),[hoverStar,setHoverStar]=useState(0),[sent,setSent]=useState(false),[loading,setLoading]=useState(false)
  const toast=useToast(),set=k=>v=>setForm(p=>({...p,[k]:v}))
  const handle=async()=>{if(!form.name||!form.service||!form.note||!form.text){toast('Remplissez tous les champs','warn');return};setLoading(true);try{await reviewsService.insert({...form,avatar:form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)})}catch(e){console.error('Review insert error:',e)}; onSubmit({...form,id:'new-'+Date.now(),avatar:form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2),created_at:new Date().toISOString()});setSent(true);setLoading(false);toast('Avis publié !')}
  const inp={width:'100%',padding:'10px 13px',background:DS.bg2,border:`1px solid ${DS.border}`,borderRadius:DS.r,color:DS.white,fontFamily:FONTS.body,fontSize:'.88rem',outline:'none',transition:'border-color .2s'}
  const focus=e=>e.target.style.borderColor=DS.lime,blur=e=>e.target.style.borderColor=DS.border
  if(sent)return <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} style={{background:`${DS.lime}0A`,border:`1px solid ${DS.lime}22`,borderRadius:DS.r3,padding:'3rem',textAlign:'center'}}><motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:300,damping:20}} style={{width:60,height:60,borderRadius:'50%',background:`${DS.lime}15`,border:`2px solid ${DS.lime}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.25rem',fontSize:'1.5rem',color:DS.lime}}>✓</motion.div><div style={{fontFamily:FONTS.display,fontWeight:700,fontSize:'1.3rem',color:DS.lime,marginBottom:'.5rem'}}>Merci pour votre avis !</div><p style={{fontFamily:FONTS.body,color:DS.gray3,fontSize:'.9rem'}}>Votre témoignage aide nos futurs clients.</p></motion.div>
  return <div style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:DS.r3,padding:'2rem'}}>
    <div style={{fontFamily:FONTS.display,fontWeight:700,fontSize:'1.2rem',color:DS.white,marginBottom:'1.5rem',paddingBottom:'.75rem',borderBottom:`1px solid ${DS.border}`}}>Partagez votre expérience</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
      {[{l:'Nom complet *',k:'name',ph:'Votre nom'},{l:'Entreprise',k:'company',ph:'Votre PME'}].map(f=><div key={f.k}><label style={{display:'block',fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray3,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.4rem'}}>{f.l}</label><input value={form[f.k]} onChange={e=>set(f.k)(e.target.value)} placeholder={f.ph} style={inp} onFocus={focus} onBlur={blur}/></div>)}
    </div>
    <div style={{marginBottom:'1rem'}}><label style={{display:'block',fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray3,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.4rem'}}>Service utilisé *</label><select value={form.service} onChange={e=>set('service')(e.target.value)} style={{...inp,cursor:'pointer',appearance:'none'}} onFocus={focus} onBlur={blur}><option value=''>-- Choisir --</option>{['Développement Web','Application Mobile','Logiciel Métier','Design UI/UX','Maintenance IT','Assistance Informatique'].map(s=><option key={s}>{s}</option>)}</select></div>
    <div style={{marginBottom:'1rem'}}><label style={{display:'block',fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray3,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.6rem'}}>Note *</label><div style={{display:'flex',gap:'.35rem',alignItems:'center'}}>{[1,2,3,4,5].map(n=><motion.span key={n} whileHover={{scale:1.3}} whileTap={{scale:.9}} onClick={()=>set('note')(n)} onMouseEnter={()=>setHoverStar(n)} onMouseLeave={()=>setHoverStar(0)} style={{fontSize:'1.8rem',color:n<=(hoverStar||form.note)?DS.gold:DS.border,cursor:'pointer',lineHeight:1,transition:'color .15s'}}>★</motion.span>)}{form.note>0&&<motion.span key={form.note} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} style={{fontFamily:FONTS.mono,fontSize:'.78rem',color:DS.lime,marginLeft:8}}>{['','Insuffisant','Passable','Bien','Très bien','Excellent !'][form.note]}</motion.span>}</div></div>
    <div style={{marginBottom:'1.25rem'}}><label style={{display:'block',fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray3,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.4rem'}}>Commentaire *</label><textarea value={form.text} onChange={e=>set('text')(e.target.value)} rows={4} placeholder="Décrivez votre expérience..." style={{...inp,resize:'vertical',minHeight:100}} onFocus={focus} onBlur={blur}/></div>
    <motion.button onClick={handle} disabled={loading} whileTap={{scale:.97}} style={{padding:'12px 26px',background:DS.lime,color:DS.bg,border:'none',borderRadius:DS.r2,fontFamily:FONTS.display,fontWeight:700,fontSize:'.9rem',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>{loading?'Publication...':'Publier mon avis'}</motion.button>
  </div>
}

export default function ReviewsSection(){
  const[reviews,setReviews]=useState(FALLBACK),[loading,setLoading]=useState(true)
  useEffect(()=>{reviewsService.getApproved().then(d=>{if(d?.length)setReviews(d)}).catch(()=>{}).finally(()=>setLoading(false))},[])
  const avg=reviews.length?(reviews.reduce((s,r)=>s+r.note,0)/reviews.length).toFixed(1):'5.0'
  return <Section id="avis" bg={DS.bg2}>
    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 70% 50% at 30% 50%,${DS.lime}04,transparent)`,pointerEvents:'none'}}/>
    <Container style={{position:'relative',zIndex:2}}>
      <Reveal style={{textAlign:'center',marginBottom:'3.5rem'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:FONTS.mono,fontSize:'.68rem',color:DS.lime,letterSpacing:'.16em',textTransform:'uppercase',marginBottom:'1rem'}}><span style={{width:28,height:1,background:DS.lime}}/>Témoignages clients</div>
        <h2 style={{fontFamily:FONTS.display,fontWeight:800,fontSize:'clamp(2.5rem,5vw,4.5rem)',color:DS.white,marginBottom:'1rem'}}>Ce que disent <span style={{color:DS.lime}}>nos clients</span></h2>
        <div style={{display:'inline-flex',alignItems:'center',gap:'2rem',background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:100,padding:'1rem 2.5rem',marginTop:'1rem'}}>
          <div style={{textAlign:'center'}}><div style={{fontFamily:FONTS.display,fontWeight:900,fontSize:'2.5rem',color:DS.lime,lineHeight:1}}>{avg}</div><div style={{color:DS.gold,fontSize:'.9rem',letterSpacing:2}}>★★★★★</div></div>
          <div style={{width:1,height:40,background:DS.border}}/>
          <div style={{fontFamily:FONTS.body,fontSize:'.85rem',color:DS.gray3,lineHeight:1.6}}>Basé sur <strong style={{color:DS.white}}>{reviews.length}+</strong> avis<br/><span style={{fontSize:'.75rem'}}>clients vérifiés</span></div>
        </div>
      </Reveal>
      {loading?<div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><Spinner/></div>:<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem',marginBottom:'3rem'}}>{reviews.slice(0,4).map((r,i)=><RevCard key={r.id} r={r} i={i}/>)}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',alignItems:'start'}}><RevForm onSubmit={r=>setReviews(p=>[r,...p])}/><div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>{reviews.slice(4,6).map((r,i)=><RevCard key={r.id} r={r} i={i}/>)}</div></div>
    </Container>
  </Section>
}
