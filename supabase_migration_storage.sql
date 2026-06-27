-- À exécuter dans Supabase SQL Editor
-- Crée le bucket de stockage pour les photos de produits uploadées depuis l'admin.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Lecture publique (pour que les photos s'affichent sur le site)
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Upload / modification / suppression autorisés (admin utilise la clé anon, pas encore d'authentification réelle)
create policy "Anon upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

create policy "Anon update product images"
  on storage.objects for update
  using (bucket_id = 'product-images');

create policy "Anon delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images');
