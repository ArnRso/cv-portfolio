# adrienrusso.fr

Site vitrine + CV d'Adrien Russo, développeur web à Bordeaux, au service des
artisans du bâtiment en Gironde.

Site statique **Astro**, CSS natif piloté par variables, sans Tailwind et sans
CDN. Déploiement prévu sur GitHub Pages.

## Commandes

```bash
npm install      # installer les dépendances
npm run dev      # serveur de dev sur http://localhost:4321
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
npm run check    # contrôle des types Astro/TypeScript
npm run format   # Prettier
npm run verify   # toute la pipeline, comme la CI
npm run cv:pdf   # regénérer le PDF du CV
npm run og       # regénérer l'image de partage
npm run icons    # regénérer les icônes depuis favicon.svg
```

### Icônes

`public/favicon.svg` est la **source unique** : monogramme AR en Archivo Black,
converti en tracés (aucune dépendance à une police installée).

`npm run icons` en dérive toutes les déclinaisons :

| Fichier                         | Usage                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `favicon.svg`                   | onglet des navigateurs modernes                                              |
| `favicon.ico`                   | anciens navigateurs, favoris Windows                                         |
| `apple-touch-icon.png`          | écran d'accueil iOS (180×180, bords carrés : iOS applique son propre masque) |
| `icon-192.png` / `icon-512.png` | Android et PWA                                                               |
| `site.webmanifest`              | déclaration PWA, couleur de thème                                            |

Après avoir modifié `favicon.svg`, relancez `npm run icons` — la pipeline
vérifie que les six fichiers sont présents dans le build.

### Vérifier avant de pousser

`npm run verify` exécute **exactement** ce que la CI exécute sur GitHub :
types, formatage, build, présence du CNAME et des pages attendues, absence de
numéro de téléphone, absence de valeur en dur hors `tokens.css`, génération du
PDF et contrôle qu'il tient sur une page.

Si le formatage bloque, `node scripts/verify.mjs --fix` corrige au lieu
d'échouer.

Les deux workflows GitHub appellent ce même script : les vérifications sont
définies une seule fois, dans `scripts/verify.mjs`.

## Structure

```
src/
  components/    Header, Footer, Hero, Marquee, Ticket, Section, CtaBand, ContactForm
  data/          cv.json (données du CV) + cv.ts (types)
  layouts/       Layout.astro — meta, Open Graph, JSON-LD
  pages/         index, services, cv, contact, 404, mentions-legales,
                 confidentialite, cv-print (gabarit d'impression, non listé)
  styles/
    tokens.css   ← LE fichier à éditer pour le design
    base.css     reset, utilitaires, styles d'impression du CV
public/          CNAME, robots.txt, favicon
ressources/      documentation projet (briefs, contenus, maquettes d'origine)
```

## Design : où éditer

**Tout ce qui est visuel vit dans `src/styles/tokens.css`.** Aucun composant ne
contient de couleur, de taille ou de durée en dur — si une valeur apparaît dans
un composant, c'est un bug : ajoutez plutôt le token.

### Changer la palette

Le fichier contient un bloc « PALETTE ACTIVE » (actuellement **D — Bleu
Confiance**) et, en fin de fichier, les 7 autres palettes explorées, en
commentaire. Pour en essayer une : copier ses valeurs par-dessus celles du bloc
actif. Rien d'autre à toucher.

Les palettes sombres (B « Nuit de chantier », H « Sombre Ambre ») demandent en
plus d'ajuster `--color-surface`, `--color-surface-raised` et `--color-border`,
qui sont calculés pour un fond clair.

Le ticket « carnet à souche » du pied de page a ses propres variables
(`--paper-*`) : il reste crème quelle que soit la palette du site. C'est
volontaire.

## Choix d'implémentation

- **PDF du CV** : imprimé depuis `/cv-print`, un gabarit dédié composé en points
  pour tenir sur un A4 en deux colonnes. La page `/cv` publique reste pensée
  pour l'écran — imprimer celle-ci donnait quatre pages avec des aplats coupés.
  `/cv-print` est absente de la navigation et du sitemap, et interdite aux
  robots ; c'est le PDF qui est servi aux visiteurs.
- **H1 de l'accueil** : le bloc typographique XXL (« Des sites qui ramènent des
  chantiers ») porte le H1 — il contient les mots-clés métier et domine la page.
  La phrase « Votre entreprise mérite un site à la hauteur » est le sous-titre
  juste en dessous. Un seul H1 par page sur tout le site.
- **Marquee** : la liste des métiers est dupliquée dans le DOM pour boucler sans
  saut (translation de -50 %). Sous `prefers-reduced-motion`, l'animation est
  coupée et la copie masquée.
- **Données du CV** : `src/data/cv.json` suit l'éditorialisation de
  `ressources/04-contenu-cv.md`, pas la structure brute des anciens JSON. Le
  téléphone et le champ `theme` ont été retirés, Symfony 6 corrigé en 7 et 8, et
  les entrées inventées par l'ancien template (bénévolat, allemand, projets
  génériques) écartées. Aucun projet n'est attribué à un employeur.
- **Polices** : auto-hébergées via `@fontsource`, aucun appel à Google Fonts.

## Formulaire de contact (EmailJS)

Le formulaire attend trois variables d'environnement. Copiez `.env.example` en
`.env` et renseignez-les :

```
PUBLIC_EMAILJS_PUBLIC_KEY=
PUBLIC_EMAILJS_SERVICE_ID=
PUBLIC_EMAILJS_TEMPLATE_ID=
```

Sans ces variables, le formulaire s'affiche mais reste désactivé, avec un lien
`mailto:` en repli — le build ne casse pas.

Le `.env` local est déjà renseigné (service `service_sowckle`, template
`template_5v8we2i`). Ces trois valeurs sont publiques par nature : elles partent
dans le JS du navigateur. La sécurité repose sur la liste blanche de domaine et
le reCAPTCHA à activer côté EmailJS — voir ci-dessous.

### Variables du template

Le template « Contact Us » attend `{{name}}`, `{{email}}`, `{{message}}`,
`{{title}}` et `{{time}}`. Le formulaire du site a cinq champs : le métier et le
type de projet n'ayant pas de variable dédiée dans le template, ils sont repliés
en tête du corps du message. Pour les recevoir dans des champs séparés, ajoutez
`{{metier}}` et `{{projet}}` au template et adaptez l'appel `emailjs.send()`
dans [ContactForm.astro](src/components/ContactForm.astro).

Le template envoie vers `adrien.russo@gmail.com` et positionne `Reply To` sur
l'email du visiteur.

## Mesure d'audience

Google Analytics 4, **chargé uniquement après consentement** : tant que le
visiteur n'a pas cliqué « Accepter », aucun cookie n'est déposé et le script de
Google n'est pas chargé. C'est ce qu'exige la CNIL.

Le bandeau ([Analytics.astro](src/components/Analytics.astro), logique dans
[consent.ts](src/scripts/consent.ts)) présente « Refuser » et « Accepter » avec
le même poids visuel, mémorise le choix six mois, et reste révocable via
« Gérer mes préférences » en pied de page.

Sans `PUBLIC_GA_ID`, ni le script ni le bandeau ne sont rendus — le site
fonctionne alors sans aucun traceur.

Comptez 40 à 60 % de visites non mesurées : c'est la part de visiteurs qui
refusent, inhérente à tout outil déposant des cookies.

## Reste à faire côté Adrien

- [x] Fournir les identifiants EmailJS.
- [ ] Activer dans EmailJS la **liste blanche de domaine** (`adrienrusso.fr`
      uniquement) et le **reCAPTCHA** — à faire avant la mise en ligne, sinon
      n'importe qui peut consommer le quota depuis un autre site.
- [ ] Décider si les demandes doivent arriver sur `hello@adrienrusso.fr` plutôt
      que sur l'adresse Gmail actuellement configurée dans le template, et
      vérifier que cette boîte est opérationnelle.
- [ ] Tester un envoi réel depuis `/contact` (quota : 200 requêtes/mois).
- [ ] Rédiger les mentions légales et la politique de confidentialité
      (obligatoire avant mise en ligne — les liens du pied de page sont en place,
      désactivés).
- [ ] Créer la fiche Google Business Profile.
- [ ] Optionnel plus tard : 2-3 sites démo BTP pour remplacer la section
      « expérience » de l'accueil.

## Reste à faire côté dev

- [ ] Image Open Graph (`public/og.png`) — référencée dans le layout, pas encore
      produite.
- [ ] CI GitHub Actions : build, génération du PDF du CV (`/cv` imprimée via
      Playwright, la feuille `@media print` est déjà écrite) et déploiement Pages.
      Le bouton « Télécharger mon CV (PDF) » pointe vers `/adrien-russo-cv.pdf`,
      produit par cette CI.
