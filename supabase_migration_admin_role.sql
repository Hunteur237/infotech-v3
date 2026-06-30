-- À exécuter dans Supabase SQL Editor
-- Remplace le mot de passe admin codé en JS (visible dans le navigateur) par un vrai
-- statut "administrateur" lié à un compte Supabase Auth — bien plus sûr.

-- 1) Ajoute le statut admin au profil
alter table profiles add column if not exists is_admin boolean default false;

-- 2) Fonction utilitaire : l'utilisateur connecté est-il admin ?
create or replace function public.is_admin()
returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$ language sql stable security definer;

-- ============================================================
-- 3) Resserre les permissions : seul un admin peut gérer ces données.
--    Les policies "publiques" (insertion de formulaires, lecture des
--    produits actifs, etc.) restent intactes — on retire seulement
--    l'accès "anon" généralisé qui servait à l'admin par mot de passe.
-- ============================================================

drop policy if exists "anon manage contacts"      on contacts;
drop policy if exists "anon manage reviews"       on reviews;
drop policy if exists "anon manage appointments"  on appointments;
drop policy if exists "anon manage quotes"        on quotes;
drop policy if exists "anon manage products"      on products;
drop policy if exists "anon manage orders"        on orders;
drop policy if exists "anon manage clients"       on clients;
drop policy if exists "anon manage interventions" on interventions;
drop policy if exists "anon manage invoices"      on invoices;
drop policy if exists "anon manage blog_posts"    on blog_posts;

create policy "admin manage contacts"      on contacts      for all using (is_admin()) with check (is_admin());
create policy "admin manage reviews"       on reviews       for all using (is_admin()) with check (is_admin());
create policy "admin manage appointments"  on appointments  for all using (is_admin()) with check (is_admin());
create policy "admin manage quotes"        on quotes        for all using (is_admin()) with check (is_admin());
create policy "admin manage products"      on products      for all using (is_admin()) with check (is_admin());
create policy "admin manage orders"        on orders        for all using (is_admin()) with check (is_admin());
create policy "admin manage clients"       on clients       for all using (is_admin()) with check (is_admin());
create policy "admin manage interventions" on interventions for all using (is_admin()) with check (is_admin());
create policy "admin manage invoices"      on invoices      for all using (is_admin()) with check (is_admin());
create policy "admin manage blog_posts"    on blog_posts    for all using (is_admin()) with check (is_admin());

-- 4) Stockage des photos produits : upload réservé aux admins
drop policy if exists "Anon upload product images" on storage.objects;
drop policy if exists "Anon update product images" on storage.objects;
drop policy if exists "Anon delete product images" on storage.objects;

create policy "Admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and is_admin());
create policy "Admin update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and is_admin());
create policy "Admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and is_admin());

-- ============================================================
-- 5) ⚠️ DERNIÈRE ÉTAPE MANUELLE — à faire toi-même :
--    Connecte-toi une fois sur ton site via /compte/connexion avec
--    l'email que tu veux utiliser comme admin, PUIS exécute la ligne
--    ci-dessous en remplaçant l'email par le tien :
-- ============================================================

-- update profiles set is_admin = true where id = (select id from auth.users where email = 'TON_EMAIL_ICI');
