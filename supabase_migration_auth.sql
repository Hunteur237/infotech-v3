-- À exécuter dans Supabase SQL Editor
-- Ajoute l'espace client : chaque commande / devis / RDV peut être lié à un compte utilisateur.

alter table orders       add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table quotes       add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table appointments add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists orders_user_id_idx       on orders(user_id);
create index if not exists quotes_user_id_idx       on quotes(user_id);
create index if not exists appointments_user_id_idx on appointments(user_id);

-- Un client connecté peut voir SES PROPRES commandes / devis / RDV (en plus des policies
-- "anon manage" déjà en place pour l'admin). Ne touche à rien d'existant, ajoute juste l'accès.
create policy "users select own orders"       on orders       for select using (auth.uid() = user_id);
create policy "users select own quotes"       on quotes       for select using (auth.uid() = user_id);
create policy "users select own appointments" on appointments for select using (auth.uid() = user_id);

-- Table légère de profil (nom affiché, téléphone) liée au compte Supabase Auth
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "users manage own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- Crée automatiquement un profil vide à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
