import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL||'https://VOTRE_PROJECT.supabase.co'
const SUPABASE_KEY=import.meta.env.VITE_SUPABASE_ANON_KEY||'VOTRE_ANON_KEY'
export const supabase=createClient(SUPABASE_URL,SUPABASE_KEY)
const q=(table)=>({
  async getAll(opts={}){const q=supabase.from(table).select('*');if(opts.filter)q.eq(...opts.filter);if(opts.order)q.order(opts.order,{ascending:opts.asc??false});const{data,error}=await q;if(error)throw error;return data},
  async insert(data){const{data:r,error}=await supabase.from(table).insert([data]).select();if(error)throw error;return r},
  async update(id,data){const{error}=await supabase.from(table).update(data).eq('id',id);if(error)throw error},
  async delete(id){const{error}=await supabase.from(table).delete().eq('id',id);if(error)throw error},
})
export const contactsService={insert:d=>q('contacts').insert(d),getAll:()=>q('contacts').getAll({order:'created_at'}),updateStatus:(id,status)=>q('contacts').update(id,{status})}
export const reviewsService={insert:d=>q('reviews').insert(d),getApproved:async()=>{const{data,error}=await supabase.from('reviews').select('*').eq('approved',true).order('created_at',{ascending:false});if(error)throw error;return data},getAll:()=>q('reviews').getAll({order:'created_at'}),approve:(id)=>q('reviews').update(id,{approved:true}),delete:(id)=>q('reviews').delete(id)}
export const appointmentsService={insert:d=>q('appointments').insert(d),getAll:()=>q('appointments').getAll({order:'created_at'}),updateStatus:(id,status)=>q('appointments').update(id,{status})}
export const quotesService={insert:d=>q('quotes').insert(d),getAll:()=>q('quotes').getAll({order:'created_at'}),updateStatus:(id,status)=>q('quotes').update(id,{status})}
export const productsService={getAll:async()=>{const{data,error}=await supabase.from('products').select('*').eq('active',true).order('created_at',{ascending:false});if(error)throw error;return data},getAllAdmin:()=>q('products').getAll({order:'created_at'}),insert:d=>q('products').insert(d),update:(id,d)=>q('products').update(id,d),delete:(id)=>q('products').update(id,{active:false}),async uploadImage(file){const ext=file.name.split('.').pop();const path=`${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;const{error:upErr}=await supabase.storage.from('product-images').upload(path,file,{cacheControl:'3600',upsert:false});if(upErr)throw upErr;const{data}=supabase.storage.from('product-images').getPublicUrl(path);return data.publicUrl}}
export const ordersService={insert:d=>q('orders').insert(d),getAll:()=>q('orders').getAll({order:'created_at'}),updateStatus:(id,status)=>q('orders').update(id,{status})}
export const clientsService={getAll:()=>q('clients').getAll({order:'created_at'}),insert:d=>q('clients').insert(d),update:(id,d)=>q('clients').update(id,d),delete:(id)=>q('clients').delete(id)}
export const interventionsService={getAll:async()=>{const{data,error}=await supabase.from('interventions').select('*').order('date',{ascending:false});if(error)throw error;return data},insert:d=>q('interventions').insert(d),updateStatus:(id,status)=>q('interventions').update(id,{status})}
export const invoicesService={getAll:()=>q('invoices').getAll({order:'created_at'}),insert:d=>q('invoices').insert(d),updateStatus:(id,status)=>q('invoices').update(id,{status})}
export const blogService={getPublished:async()=>{const{data,error}=await supabase.from('blog_posts').select('*').eq('published',true).order('created_at',{ascending:false});if(error)throw error;return data},getAll:()=>q('blog_posts').getAll({order:'created_at'})}
export const statsService={async getDashboard(){const[c,r,a,qu,o,cl,i,inv]=await Promise.all(['contacts','reviews','appointments','quotes','orders','clients','interventions','invoices'].map(t=>supabase.from(t).select('*')));return{contacts:c.data||[],reviews:r.data||[],appointments:a.data||[],quotes:qu.data||[],orders:o.data||[],clients:cl.data||[],interventions:i.data||[],invoices:inv.data||[]}}}

// ───────────────── Espace client (Supabase Auth) ─────────────────
export const authService={
  async signUp(email,password,fullName,phone){const{data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName,phone},emailRedirectTo:`${window.location.origin}/compte`}});if(error)throw error;return data},
  async signIn(email,password){const{data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;return data},
  async signOut(){const{error}=await supabase.auth.signOut();if(error)throw error},
  async getSession(){const{data,error}=await supabase.auth.getSession();if(error)throw error;return data.session},
  onAuthChange(cb){const{data}=supabase.auth.onAuthStateChange((event,session)=>cb(session,event));return data.subscription},
  async resetPassword(email){const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/compte/connexion`});if(error)throw error},
  async updatePassword(newPassword){const{error}=await supabase.auth.updateUser({password:newPassword});if(error)throw error},
  async resendConfirmation(email){const{error}=await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo:`${window.location.origin}/compte`}});if(error)throw error},
}
export const profilesService={
  async get(userId){const{data,error}=await supabase.from('profiles').select('*').eq('id',userId).maybeSingle();if(error)throw error;return data},
  async update(userId,d){const{error}=await supabase.from('profiles').update(d).eq('id',userId);if(error)throw error},
}
export const myAccountService={
  async getOrders(userId){const{data,error}=await supabase.from('orders').select('*').eq('user_id',userId).order('created_at',{ascending:false});if(error)throw error;return data},
  async getQuotes(userId){const{data,error}=await supabase.from('quotes').select('*').eq('user_id',userId).order('created_at',{ascending:false});if(error)throw error;return data},
  async getAppointments(userId){const{data,error}=await supabase.from('appointments').select('*').eq('user_id',userId).order('created_at',{ascending:false});if(error)throw error;return data},
}
