-- À exécuter dans Supabase SQL Editor (en plus du schéma déjà créé)
-- Ajoute le suivi du paiement Mobile Money sur les commandes existantes.

alter table orders add column if not exists payment_method text default 'mobile_money';
alter table orders add column if not exists payment_status text default 'non_requis'; -- non_requis | en_attente | payé | échoué
alter table orders add column if not exists transaction_id text;
alter table orders add column if not exists email text;
