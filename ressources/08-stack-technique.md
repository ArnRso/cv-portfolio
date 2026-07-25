# Stack technique — Site adrienrusso.fr

_Décidé le 2026-07-16. Section Style mise à jour le 2026-07-25._

## Vue d'ensemble
Site multipage statique, tout dans l'écosystème GitHub. Aucun backend à maintenir.

## Choix retenus
- **Framework :** Astro (générateur de site statique, multipage). Adapté à un site vitrine + CV majoritairement figé ; base idéale pour un futur blog (content collections). Adrien a déjà un peu pratiqué.
- **Hébergement :** GitHub Pages (statique, gratuit). Redevenu viable car EmailJS supprime le besoin de fonction serverless. → tout reste chez GitHub. (Cloudflare Pages / Netlify / Vercel restent des alternatives si besoin d'un CDN ou de fonctions plus tard.)
- **CI/CD :** GitHub Actions. Rôle : build Astro + génération automatique du PDF du CV + déploiement sur GitHub Pages.
- **Formulaire de contact :** EmailJS (compte créé par Adrien). Envoi d'email 100% côté client, sans backend.
  - Service email à connecter dans EmailJS (pour recevoir sur hello@adrienrusso.fr).
  - **Sécurité à activer :** liste blanche de domaines (adrienrusso.fr uniquement) + reCAPTCHA. Rate limiting par IP automatique.
  - Identifiants email NON exposés (stockés côté EmailJS) ; seule la clé publique est côté client (prévu pour).
- **PDF du CV :** généré automatiquement par la CI/CD au build (bouton « Télécharger mon CV »).
- **Domaine :** adrienrusso.fr (branché sur GitHub Pages via enregistrement DNS + custom domain).
- **Dépôt :** `git@github.com:ArnRso/cv-portfolio.git`, local `~/Developer/cv-portfolio`.

## SEO / GEO (voir 09-principes-seo-geo.md)
- Balises title/meta par page, données structurées schema.org (ProfessionalService/LocalBusiness + FAQPage + Person), sitemap.xml, robots.txt, images optimisées.
- Fiche Google Business Profile à créer côté Adrien.

## Style — ✅ TRANCHÉ le 2026-07-25
- ❌ **Pas de Tailwind** (annule la piste « Tailwind probable » initialement envisagée).
- ✅ **CSS natif piloté par variables.** Tout ce qui est susceptible de changer est une variable CSS : couleurs, espacements, rayons, familles et tailles typographiques, épaisseurs de trait. Un seul fichier de tokens doit suffire à faire évoluer l'identité visuelle sans toucher aux composants — le projet est explicitement pensé pour beaucoup d'itérations de design.
- ❌ **Pas de CDN** tant que possible : polices auto-hébergées (paquets `@fontsource` plutôt que `<link>` Google Fonts), aucune librairie chargée depuis un CDN externe.
- ✅ **Palette D « Bleu Confiance »** : fond clair, `#0f2747`, `#1d4ed8`, accent orange. Le ticket « carnet à souche » reste crème/papier.
- ✅ **Un seul thème** — pas de bascule clair/sombre (point ouvert désormais fermé).

## Points à confirmer au dev
- Boîte mail réceptrice hello@adrienrusso.fr opérationnelle (via le service connecté à EmailJS).
- Quota gratuit EmailJS (quelques centaines d'emails/mois — largement suffisant ; vérifier le chiffre à jour).
- Mentions légales + politique de confidentialité (obligatoire, à rédiger « au dernier moment » selon Adrien).
- `gh` (CLI GitHub) n'était pas installé sur le Mac au 2026-07-25 — à installer pour la vérification des builds.
