-- À exécuter dans Supabase SQL Editor
-- Corrige le formulaire de contact qui envoie aussi "entreprise" et "budget".

alter table contacts add column if not exists company text;
alter table contacts add column if not exists budget text;
