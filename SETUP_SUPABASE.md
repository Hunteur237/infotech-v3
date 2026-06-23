# INFO-TECH — Guide de mise en service

## 1. Créer le projet Supabase
1. Va sur https://supabase.com → New project.
2. Une fois créé, ouvre **SQL Editor** → New query.
3. Colle tout le contenu du fichier `supabase_schema.sql` (à la racine du projet) et exécute (Run).
   → Cela crée toutes les tables (contacts, reviews, appointments, quotes, products, orders,
   clients, interventions, invoices, blog_posts), active la sécurité (RLS) et insère 5 produits
   de démonstration dans la boutique.

## 2. Récupérer les clés API
Dans Supabase : **Project Settings → API**
- `Project URL` → à coller dans `VITE_SUPABASE_URL`
- `anon public` key → à coller dans `VITE_SUPABASE_ANON_KEY`

## 3. Configurer le projet
```bash
cp .env.example .env
```
Puis édite `.env` :
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_PASSWORD=choisis-un-mot-de-passe-fort
```

## 4. Lancer en local
```bash
npm install
npm run dev
```

## 5. Déployer (Netlify ou Vercel)
Le projet contient déjà `netlify.toml` et `vercel.json`. Il suffit de :
- connecter le repo Git à Netlify/Vercel,
- renseigner les 3 variables d'environnement ci-dessus dans les réglages du site,
- déployer (`npm run build`, dossier `dist`).

## Ce qui est maintenant fonctionnel de bout en bout
- **Formulaire de contact** → enregistré dans `contacts`, visible dans Admin → onglet CONTACTS.
- **Avis clients** → enregistrés dans `reviews`, visibles sur le site une fois publiés depuis
  Admin → onglet AVIS (bouton "Publier").
- **Prise de RDV** → enregistrée dans `appointments`, gérable dans Admin → onglet RENDEZ-VOUS.
- **Demandes de devis** → enregistrées dans `quotes`, gérables dans Admin → onglet DEVIS.
- **Boutique** → les produits viennent de la table `products` (modifiables depuis Admin →
  ARTICLES). La commande demande maintenant nom/téléphone/adresse et enregistre une vraie
  commande dans `orders`, visible dans Admin → COMMANDES.
- **Admin** → toutes les vues (Clients, Interventions, Factures, Articles, Commandes, Avis,
  Contacts, Devis, RDV) lisent et écrivent réellement dans Supabase.

## Recommandations Phase 2 (sécurité & extensions)
- L'accès admin utilise actuellement un mot de passe simple côté navigateur
  (`VITE_ADMIN_PASSWORD`). Les policies Supabase autorisent donc la clé "anon" à tout
  lire/écrire pour que l'admin fonctionne. C'est correct pour démarrer, mais **avant un usage
  intensif en production**, il est recommandé de brancher Supabase Auth (vrai compte admin) et
  de restreindre les policies du fichier `supabase_schema.sql` aux utilisateurs authentifiés.
- Paiement Mobile Money réel, espace client avec login, notifications SMS/email automatiques :
  prêts à être ajoutés une fois ce socle validé — dis-moi quand tu veux qu'on les attaque.
