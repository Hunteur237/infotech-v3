-- ============================================================
-- INFO-TECH — SCHÉMA SUPABASE COMPLET
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- Extension pour générer des UUID
create extension if not exists "uuid-ossp";

-- ───────────────────────── CONTACTS (formulaire de contact) ─────────────────────────
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  company text,
  email text,
  phone text,
  service text,
  subject text,
  budget text,
  message text,
  status text default 'nouveau', -- nouveau | en_cours | traité
  created_at timestamptz default now()
);

-- ───────────────────────── AVIS CLIENTS ─────────────────────────
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  company text,
  service text,
  note int not null check (note between 1 and 5),
  text text not null,
  avatar text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- ───────────────────────── RENDEZ-VOUS ─────────────────────────
create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  subject text,
  day text,
  slot text,
  status text default 'en_attente', -- en_attente | confirmé | annulé | effectué
  created_at timestamptz default now()
);

-- ───────────────────────── DEVIS ─────────────────────────
create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  phone text,
  project_type text,
  users_count int,
  options jsonb,
  urgence text,
  estimated_total numeric,
  status text default 'nouveau',
  created_at timestamptz default now()
);

-- ───────────────────────── PRODUITS (boutique) ─────────────────────────
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  cat text,
  price numeric not null,
  old_price numeric,
  stock int default 0,
  badge text,
  rating numeric default 5,
  reviews int default 0,
  img text,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

-- ───────────────────────── COMMANDES (boutique) ─────────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_phone text,
  client_address text,
  items jsonb not null,       -- snapshot du panier [{id,name,price,qty}, ...]
  total numeric not null,
  status text default 'en_attente', -- en_attente | confirmé | expédié | livré | annulé
  payment_method text default 'mobile_money',
  payment_status text default 'non_requis', -- non_requis | en_attente | payé | échoué
  transaction_id text,
  email text,
  created_at timestamptz default now()
);

-- ───────────────────────── CLIENTS (CRM admin) ─────────────────────────
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact text,
  email text,
  phone text,
  secteur text,
  ville text,
  status text default 'Actif',
  created_at timestamptz default now()
);

-- ───────────────────────── INTERVENTIONS (CRM admin) ─────────────────────────
create table if not exists interventions (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete set null,
  client_name text,
  type text,
  date date,
  duree numeric,
  description text,
  montant numeric,
  status text default 'Planifiée',
  created_at timestamptz default now()
);

-- ───────────────────────── FACTURES (CRM admin) ─────────────────────────
create table if not exists invoices (
  id text primary key, -- ex: F-2025-001
  client_id uuid references clients(id) on delete set null,
  client_name text,
  date date,
  echeance date,
  objet text,
  lignes jsonb,
  ht numeric,
  tva numeric,
  ttc numeric,
  status text default 'En attente',
  created_at timestamptz default now()
);

-- ───────────────────────── ARTICLES DE BLOG ─────────────────────────
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  excerpt text,
  content text,
  cover text,
  category text,
  published boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- L'admin de ce site utilise un mot de passe simple côté front
-- (pas de Supabase Auth pour l'instant). Les politiques ci-dessous
-- autorisent donc la clé "anon" à lire/écrire largement, afin que
-- l'admin et les formulaires publics fonctionnent dès aujourd'hui.
-- ⚠️ Recommandé en Phase 2 : brancher Supabase Auth + restreindre
-- ces policies aux utilisateurs authentifiés "admin" uniquement.
-- ============================================================

alter table contacts       enable row level security;
alter table reviews        enable row level security;
alter table appointments   enable row level security;
alter table quotes         enable row level security;
alter table products       enable row level security;
alter table orders         enable row level security;
alter table clients        enable row level security;
alter table interventions  enable row level security;
alter table invoices       enable row level security;
alter table blog_posts     enable row level security;

-- Tout le monde (visiteur) peut créer une demande
create policy "public insert contacts"     on contacts     for insert with check (true);
create policy "public insert reviews"      on reviews      for insert with check (true);
create policy "public insert appointments" on appointments for insert with check (true);
create policy "public insert quotes"       on quotes       for insert with check (true);
create policy "public insert orders"       on orders       for insert with check (true);

-- Lecture publique : uniquement le contenu déjà validé
create policy "public select approved reviews"  on reviews     for select using (approved = true);
create policy "public select active products"   on products    for select using (active = true);
create policy "public select published blog"    on blog_posts  for select using (published = true);

-- Accès large (clé anon) pour le panneau admin — à restreindre quand l'auth admin sera en place
create policy "anon manage contacts"      on contacts      for all using (true) with check (true);
create policy "anon manage reviews"       on reviews       for all using (true) with check (true);
create policy "anon manage appointments"  on appointments  for all using (true) with check (true);
create policy "anon manage quotes"        on quotes        for all using (true) with check (true);
create policy "anon manage products"      on products      for all using (true) with check (true);
create policy "anon manage orders"        on orders        for all using (true) with check (true);
create policy "anon manage clients"       on clients       for all using (true) with check (true);
create policy "anon manage interventions" on interventions for all using (true) with check (true);
create policy "anon manage invoices"      on invoices      for all using (true) with check (true);
create policy "anon manage blog_posts"    on blog_posts    for all using (true) with check (true);

-- ============================================================
-- QUELQUES PRODUITS DE DÉPART (modifiable ensuite depuis l'admin)
-- ============================================================
insert into products (name, cat, price, old_price, stock, badge, rating, reviews, img, description, active) values
('Laptop Dell XPS 15',      'Ordinateurs',   585000, 640000, 4,  'Promo',   4.8, 24, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=380&fit=crop&q=80', 'Intel Core i7-13700H · 32GB DDR5 · 1TB NVMe SSD · OLED 15.6" 3.5K · RTX 4060', true),
('Switch HP 1920S 24G',      'Réseau',        138000, null,   9,  'Stock',   4.6, 11, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=380&fit=crop&q=80', '24 ports Gigabit manageable · 4 SFP · VLAN 802.1Q · QoS · Rack 1U', true),
('Écran LG UltraWide 34"',   'Périphériques', 215000, 248000, 3,  'Promo',   4.9, 37, 'https://images.unsplash.com/photo-1527443224154-c4a573d5f5de?w=500&h=380&fit=crop&q=80', '34" IPS Nano · 3440×1440 · 144Hz · HDR400 · USB-C 96W · 2× HDMI 2.1', true),
('SSD Samsung 990 Pro 2TB',  'Stockage',      88000,  null,   18, null,      5.0, 52, 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&h=380&fit=crop&q=80', 'NVMe PCIe 4.0 · 7450 Mo/s lecture · 6900 Mo/s écriture · Garantie 5 ans', true),
('Clavier Keychron Q1 Pro',  'Périphériques', 62000,  72000,  7,  'Promo',   4.7, 18, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=380&fit=crop&q=80', '75% layout · Aluminium CNC · Switch Gateron Pro Red · RGB · Bluetooth 5.1', true)
on conflict do nothing;
