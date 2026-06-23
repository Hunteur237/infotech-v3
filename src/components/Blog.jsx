import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { DS, FONTS } from '../lib/design.js'
import { blogService } from '../lib/supabase.js'
import { Section, Container } from './UI.jsx'

const FALLBACK=[{id:'b1',title:'Pourquoi votre PME a besoin d\'un logiciel de gestion en 2025',excerpt:'Excel c\'est bien. Mais à partir de 5 employés, les erreurs s\'accumulent et le temps perdu devient coûteux.',category:'Guide PME',image_url:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=380&fit=crop&q=80',read_time:'5 min',created_at:'2025-05-02',color:DS.lime},{id:'b2',title:'Intégrer MTN & Orange Money dans votre application web',excerpt:'Le paiement mobile au Cameroun représente 80% des transactions. Voici comment l\'intégrer et les pièges à éviter.',category:'Mobile Money',image_url:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=380&fit=crop&q=80',read_time:'7 min',created_at:'2025-04-25',color:DS.gold},{id:'b3',title:'Les 5 erreurs qui exposent les PME aux hackers',excerpt:'Mots de passe faibles, sauvegardes absentes. Les vulnérabilités les plus communes et comment les corriger.',category:'Cybersécurité',image_url:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=380&fit=crop&q=80',read_time:'6 min',created_at:'2025-04-18',color:DS.red},{id:'b4',title:'Site vitrine vs E-commerce : quelle solution pour votre business ?',excerpt:'Beaucoup de PME ne savent pas si elles ont besoin d\'un site simple ou d\'une boutique en ligne.',category:'Digital',image_url:'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=380&fit=crop&q=80',read_time:'4 min',created_at:'2025-04-10',color:DS.blue}]

function BlogCard({post,featured,index}){
  const[hov,setHov]=useState(false),ref=useRef(null),inView=useInView(ref,{once:true,margin:'-60px'})
  const color=post.color||DS.lime
  if(featured)return <motion.article ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7,delay:.1}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:DS.surface,border:`1px solid ${hov?DS.lime+'44':DS.border}`,borderRadius:DS.r3,overflow:'hidden',cursor:'pointer',transition:'border-color .25s',display:'flex',flexDirection:'column'}}>
    <div style={{position:'relative',height:300,overflow:'hidden'}}><motion.img src={post.image_url} alt={post.title} animate={{scale:hov?1.06:1}} transition={{duration:.5}} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy"/><div style={{position:'absolute',inset:0,background:`linear-gradient(to bottom,transparent 40%,${DS.surface} 100%)`}}/><span style={{position:'absolute',top:16,left:16,background:color,color:DS.bg,fontFamily:FONTS.mono,fontSize:'.62rem',fontWeight:700,padding:'4px 10px',borderRadius:4,letterSpacing:'.08em'}}>{post.category}</span></div>
    <div style={{padding:'1.5rem',flex:1,display:'flex',flexDirection:'column'}}><h3 style={{fontFamily:FONTS.display,fontWeight:700,fontSize:'1.15rem',color:DS.white,lineHeight:1.3,marginBottom:'.75rem',flex:1}}>{post.title}</h3><p style={{fontFamily:FONTS.body,fontSize:'.88rem',color:DS.gray3,lineHeight:1.7,marginBottom:'1rem',fontWeight:300}}>{post.excerpt}</p><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontFamily:FONTS.mono,fontSize:'.62rem',color:DS.gray}}>{new Date(post.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</span><span style={{fontFamily:FONTS.mono,fontSize:'.62rem',color}}>{post.read_time} de lecture</span></div></div>
  </motion.article>
  return <motion.article ref={ref} initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.6,delay:.15+index*.1}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{display:'flex',gap:'1rem',background:DS.surface,border:`1px solid ${hov?color+'44':DS.border}`,borderRadius:DS.r2,overflow:'hidden',cursor:'pointer',transition:'border-color .25s'}}>
    <div style={{width:110,flexShrink:0,overflow:'hidden'}}><motion.img src={post.image_url} alt={post.title} animate={{scale:hov?1.08:1}} transition={{duration:.45}} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} loading="lazy"/></div>
    <div style={{padding:'.9rem 1rem .9rem 0',flex:1,minWidth:0}}><span style={{fontFamily:FONTS.mono,fontSize:'.6rem',color,letterSpacing:'.08em',fontWeight:700}}>{post.category}</span><h4 style={{fontFamily:FONTS.display,fontWeight:700,fontSize:'.88rem',color:DS.white,lineHeight:1.3,margin:'.3rem 0 .5rem',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{post.title}</h4><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontFamily:FONTS.mono,fontSize:'.6rem',color:DS.gray}}>{new Date(post.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</span><span style={{width:3,height:3,borderRadius:'50%',background:DS.gray}}/><span style={{fontFamily:FONTS.mono,fontSize:'.6rem',color:DS.gray}}>{post.read_time}</span></div></div>
  </motion.article>
}

export default function BlogSection(){
  const[posts,setPosts]=useState(FALLBACK),ref=useRef(null),inView=useInView(ref,{once:true,margin:'-60px'})
  useEffect(()=>{blogService.getPublished().then(d=>{if(d?.length)setPosts(d)}).catch(()=>{})},[])
  return <Section id="blog" bg={DS.bg2}>
    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 60% 40% at 10% 60%,${DS.lime}04,transparent)`,pointerEvents:'none'}}/>
    <Container style={{position:'relative',zIndex:2}}>
      <div ref={ref} style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'3rem',flexWrap:'wrap',gap:'1.5rem'}}>
        <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:FONTS.mono,fontSize:'.68rem',color:DS.lime,letterSpacing:'.16em',textTransform:'uppercase',marginBottom:'1rem'}}><span style={{width:28,height:1,background:DS.lime}}/>Blog & Actualités</div>
          <h2 style={{fontFamily:FONTS.display,fontWeight:800,fontSize:'clamp(2rem,4vw,3.5rem)',color:DS.white}}>Conseils <span style={{color:DS.lime}}>tech</span> pour PME</h2>
        </motion.div>
        <motion.a initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:.3}} href="#" whileHover={{x:4}} onMouseEnter={e=>e.currentTarget.style.color=DS.lime} onMouseLeave={e=>e.currentTarget.style.color=DS.gray2} style={{fontFamily:FONTS.mono,fontSize:'.78rem',color:DS.gray2,display:'flex',alignItems:'center',gap:6,transition:'color .2s'}}>Tous les articles →</motion.a>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:'1.5rem'}}>
        <BlogCard post={posts[0]} featured/>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>{posts.slice(1,4).map((p,i)=><BlogCard key={p.id} post={p} index={i}/>)}</div>
      </div>
    </Container>
  </Section>
}
