# 00 — INSTRUCTIONS D'EXÉCUTION (fichier d'entrée)

> **Tu es une instance locale qui travaille dans le dépôt `~/Developer/cv-portfolio`.**
> Ce fichier est le point d'entrée unique. Il contient la mission complète et référence tous les autres documents du dossier `ressources/`.
> Rédigé le 2026-07-25. Auteur du projet : **Adrien Russo**, développeur full stack à Bordeaux.

---

## 0. Comment lire ce dossier

Lis les fichiers **dans cet ordre** avant d'écrire une seule ligne de code :

| Fichier | Ce qu'il contient | Statut |
|---|---|---|
| `00-INSTRUCTIONS.md` | **Ce fichier.** Mission, contraintes dures, plan d'exécution, critères d'acceptation. | ⭐ Autorité finale |
| `01-brief-site.md` | Objectif du site, positionnement, cible, décisions éditoriales, points de vigilance. | Validé |
| `02-contenu-accueil.md` | Texte complet de la page Accueil (hero, 4 cartes, méthode, zone, FAQ, CTA). | Validé — à reprendre **tel quel** |
| `03-contenu-services.md` | Texte complet de la page Services (4 prestations). | Validé — à reprendre **tel quel** |
| `04-contenu-cv.md` | Texte éditorialisé de la page CV (version à publier). | Validé — à reprendre **tel quel** |
| `05-contenu-contact.md` | Texte + champs du formulaire de la page Contact. | Validé — à reprendre **tel quel** |
| `06-cv-adrien-source.md` | CV source brut, plus détaillé. Sert de référence si un détail manque. | Source |
| `07-design-pistes.md` | Direction artistique retenue (hero concept 46 + ticket concept 55), palette, typos. | Validé |
| `08-stack-technique.md` | Stack, hébergement, CI/CD, EmailJS, règles de style. | Validé |
| `09-principes-seo-geo.md` | Règles SEO local + GEO à appliquer sur toutes les pages. | Validé |
| `10-plan-integration.md` | Historique du plan et raisons pour lesquelles il n'a pas été exécuté avant. | Historique |
| `data/cv.json`, `data/cv-reac.json`, `data/cv-merged.json` | Données CV structurées (format **JSON Resume**) récupérées de l'ancien projet. | À réutiliser |
| `assets/CNAME` | Contient `adrienrusso.fr`. **À remettre dans `public/`** sinon le domaine custom casse. | Critique |
| `assets/adrien_russo_avatar.jpg`, `assets/me_avatar.jpg` | Photos d'Adrien. | Réutilisables |
| `assets/favicon.svg` | Favicon de l'ancien template. À remplacer ou conserver. | Optionnel |
| `assets/deploy.yml.ancien` | Ancien workflow GitHub Actions. À lire pour s'en inspirer, **pas** à réutiliser tel quel. | Référence |

En cas de contradiction : **ce fichier > les docs validés > l'historique**.

---

## 1. Mission

Repartir de zéro sur une nouvelle branche et intégrer le site **adrienrusso.fr** : un site vitrine + CV, statique, multipage, en **Astro**, déployé sur **GitHub Pages** via **GitHub Actions**.

Les 4 étapes demandées par Adrien, mot pour mot :

1. **Créer une nouvelle branche** → nom retenu : **`refonte-2026`** (depuis `main`, qui doit rester intacte).
2. **Supprimer tous les dossiers et fichiers contenus sur la branche** — repartir d'une base vierge.
3. **Installer proprement toutes les dépendances nécessaires et intégrer le portfolio.**
4. **Vérifier avec la CLI GitHub (`gh`) que tout est bon et opérationnel pour le build.**

---

## 2. Contraintes DURES (non négociables)

Ce sont les demandes explicites d'Adrien. Ne les contourne pas, ne propose pas d'alternative.

### 2.1 Tout ce qui peut changer doit être une variable CSS
> « utilise bien des variables pour tout ce qui est susceptible de changer, car on va itérer pas mal de fois »

- **CSS natif**, piloté par **custom properties**.
- Un **fichier de tokens unique** (ex. `src/styles/tokens.css`) doit suffire à faire évoluer toute l'identité visuelle **sans toucher à un seul composant**.
- Sont concernés, au minimum : couleurs (fond, encre, primaire, accent, papier, bordures, états), espacements (échelle complète), rayons, familles typographiques, tailles de police (échelle fluide), graisses, hauteurs de ligne, interlettrage, épaisseurs de trait, largeurs de conteneur, ombres, durées et courbes d'animation, points de rupture (via variables là où c'est possible), z-index.
- **Aucune valeur en dur** dans un composant : ni `#0f2747`, ni `24px`, ni `1.5rem`, ni `700`. Si une valeur apparaît dans un composant, c'est un bug.
- Nommage sémantique plutôt que littéral : `--color-surface-raised`, pas `--bleu-clair-2`.

### 2.2 Pas de Tailwind
- ❌ Aucune dépendance Tailwind, ni PostCSS-Tailwind, ni preset. Cette décision **annule** toute mention de Tailwind dans les docs plus anciens.
- ⚠️ Attention : « Tailwind » apparaît comme **compétence** dans le CV (`data/*.json`, `04-contenu-cv.md`) — c'est du contenu, ça reste. Ce n'est pas une instruction technique.
- L'ancien projet utilisait Tailwind : `tailwind.config.mjs` et `@astrojs/tailwind` doivent disparaître complètement.

### 2.3 Pas de CDN, tant que possible
- ❌ Aucun `<link>` ou `<script>` pointant vers un domaine externe : pas de Google Fonts, pas de jsDelivr, pas d'unpkg, pas de CDN d'icônes.
- ✅ **Polices auto-hébergées** via les paquets npm `@fontsource` / `@fontsource-variable`, servies depuis le site.
- ✅ Icônes en SVG inline ou fichiers locaux.
- ✅ Si un service tiers est indispensable (EmailJS, reCAPTCHA), passe par le paquet npm plutôt que par un script CDN, et documente l'exception.

### 2.4 Un seul thème
- Pas de bascule clair/sombre, pas de double jeu de tokens, pas de `prefers-color-scheme`. Un seul thème clair.
- (La structure en variables rend un thème sombre trivial à ajouter plus tard — ne l'implémente pas maintenant.)

---

## 3. Stack imposée

| Élément | Choix | Détail |
|---|---|---|
| Framework | **Astro** (dernière version stable) | Site statique multipage. Pas de framework UI (ni React, ni Vue) sauf nécessité réelle. |
| Style | **CSS natif + custom properties** | Voir §2.1. |
| Polices | `@fontsource` / `@fontsource-variable` | Voir §4.3. |
| Hébergement | **GitHub Pages** | Domaine custom `adrienrusso.fr` via `public/CNAME`. |
| CI/CD | **GitHub Actions** | Build Astro + génération du PDF du CV + déploiement Pages. |
| Sitemap | `@astrojs/sitemap` | Avec `site` configuré sur `https://adrienrusso.fr`. |
| Formulaire | **EmailJS** | Voir §4.6. |
| Gestionnaire de paquets | **npm** | ⚠️ L'ancien projet avait DEUX lockfiles (`package-lock.json` + `pnpm-lock.yaml`). N'en garde qu'**un seul**. |
| Dépôt | `git@github.com:ArnRso/cv-portfolio.git` | Local : `~/Developer/cv-portfolio`. |

---

## 4. Ce qu'il faut construire

### 4.1 Arborescence des pages (4 pages)

| Route | Page | Source du contenu |
|---|---|---|
| `/` | Accueil | `02-contenu-accueil.md` |
| `/services` | Services | `03-contenu-services.md` |
| `/cv` | CV | `04-contenu-cv.md` + `data/cv-merged.json` |
| `/contact` | Contact | `05-contenu-contact.md` |

Plus : `404`, `robots.txt`, `sitemap.xml`. Les mentions légales et la politique de confidentialité sont **hors périmètre pour l'instant** (Adrien les rédigera « au dernier moment ») — prévois juste les liens en pied de page, désactivés ou pointant vers une page à venir.

### 4.2 Design retenu — à implémenter, pas à réinventer

⚠️ **Les maquettes HTML d'origine n'existent plus** (elles vivaient dans une conversation Claude). `07-design-pistes.md` en est la seule trace écrite. Tu dois donc **réimplémenter la direction depuis sa description**, avec soin.

**Hero (concept 46 « Typo XXL + marquee ») — page d'accueil :**
- Trois lignes de typographie énorme, en capitales serrées :
  - ligne 1 : `DES SITES`
  - ligne 2 : `QUI RAMÈNENT` — **en contour** (texte évidé, `-webkit-text-stroke`, épaisseur pilotée par variable)
  - ligne 3 : `DES CHANTIERS.` — **surlignée** (bloc de couleur derrière le texte)
- Sous le titre : le sous-titre de `02-contenu-accueil.md`, puis CTA principal « Demander un devis gratuit » + CTA secondaire « Voir mon parcours ».
- **Bandeau défilant (marquee)** des métiers du BTP en séparateur sous le hero : maçons · plombiers · électriciens · menuisiers · couvreurs · plaquistes · peintres · carreleurs · chauffagistes…
  - Vitesse, hauteur, sens et espacement pilotés par variables.
  - **Accessibilité : respecte `prefers-reduced-motion`** (animation coupée).
- ⚠️ Le titre hero « Votre entreprise mérite un site à la hauteur. Je m'en occupe. » de `02-contenu-accueil.md` reste le **H1 sémantique** de la page (SEO). La typo XXL est le traitement visuel de l'accroche — arbitre proprement : soit le H1 est la phrase longue et le XXL est un élément décoratif au-dessus, soit l'inverse avec la phrase longue en sous-titre. **Un seul H1 par page.** Documente ton choix.

**CTA de contact (concept 55 « Carnet à souche ») — bas de page, sur toutes les pages :**
- Un **bon détachable** « Bon pour un devis gratuit », en deux parties séparées par une ligne de **pointillés** verticale (perforation) :
  - la **souche** (à gauche) : coordonnées d'Adrien + numéro de bon en police mono ;
  - le **corps du bon** (à droite) : champs façon manuscrite + bouton « Utiliser mon bon » (renvoie vers `/contact`).
- ⚠️ Le ticket reste **crème/papier** quelle que soit la palette — c'est son charme. Ses couleurs sont des variables **dédiées** (`--paper-*`), indépendantes des couleurs du site.

**Palette retenue — D « Bleu Confiance » :**
- fond clair, encre profonde `#0f2747`, bleu principal `#1d4ed8`, accent orange.
- Le fichier de tokens doit rendre le changement de palette trivial : les 7 autres palettes explorées sont listées dans `07-design-pistes.md` — mets-les en commentaire dans le fichier de tokens pour les itérations futures.

### 4.3 Typographie (auto-hébergée, via npm)

| Usage | Police | Paquet |
|---|---|---|
| Titres / typo XXL | **Archivo** graisse 900 | `@fontsource/archivo` ou `@fontsource-variable/archivo` |
| Texte courant | **Inter** | `@fontsource-variable/inter` |
| Ticket « carnet à souche » | **Bricolage Grotesque** | `@fontsource-variable/bricolage-grotesque` |
| Champs manuscrits du ticket | **Caveat** | `@fontsource-variable/caveat` |
| Numéro de bon | **IBM Plex Mono** | `@fontsource/ibm-plex-mono` |

N'importe que les graisses et sous-ensembles réellement utilisés (`latin`), et vérifie le poids final. `font-display: swap`.

### 4.4 Page CV — données

- Utilise **`data/cv-merged.json`** comme source principale : c'est la plus complète (5 expériences, 26 compétences, 6 projets). Format **JSON Resume**.
- Place-la dans `src/data/cv.json` (ou une content collection typée) et **type-la** en TypeScript.
- Le rendu doit suivre l'éditorialisation de **`04-contenu-cv.md`** (regroupement des compétences par domaine, section Enseignement dédiée, formulations retenues), pas la structure brute du JSON.
- ⚠️ **Corrections obligatoires par rapport au JSON brut :**
  - **Ne PAS afficher le téléphone.** Le JSON contient `0643834695` — décision d'Adrien : aucun numéro affiché sur le site. Retire-le du JSON ou ne le rends jamais. Attention aussi à ne pas le laisser fuiter dans le PDF ou dans le JSON-LD.
  - Le JSON mentionne « migration legacy CodeIgniter → **Symfony 6** ». La version à jour est **Symfony 7 et 8** (`01-brief-site.md`). Corrige.
  - `basics.theme: "blue"` est un reste de l'ancien template — sans objet, à supprimer.
  - **Aucun projet ne doit être attribué explicitement à un employeur** (règle de `04-contenu-cv.md`, en particulier pour LCPO). Ajoute la ligne « Une partie de ces projets inclut des outils internes non accessibles au public. »
  - Ne mentionne **pas** l'agence « idéveloppement » en lien avec un projet nommé. Elle reste listée comme employeur, sans attribution.
- Bouton « **Télécharger mon CV (PDF)** » : pointe vers le PDF généré par la CI (voir §4.7). En local, prévois un fallback qui ne casse pas la page si le PDF n'existe pas encore.

### 4.5 SEO / GEO — voir `09-principes-seo-geo.md`

À livrer :
- `title` + `meta description` **propres à chaque page**, via un composant de layout paramétré.
- **1 seul H1 par page**, hiérarchie H2/H3 cohérente.
- **JSON-LD schema.org** : `ProfessionalService` / `LocalBusiness` (nom, zone desservie = Gironde, Bordeaux) + `FAQPage` sur l'accueil (les 6 questions de `02-contenu-accueil.md`) + `Person` sur la page CV. **Sans téléphone.**
- `sitemap.xml` (via `@astrojs/sitemap`) + `robots.txt`.
- Balises Open Graph + Twitter Card, avec une image OG générée ou statique.
- `lang="fr"`, `hreflang` inutile (site monolingue).
- Images optimisées (`astro:assets`), `alt` descriptifs, `width`/`height` pour éviter le CLS.
- Mobile-first, contrastes WCAG AA, navigation clavier, focus visible.
- **Ton naturel** : pas de bourrage de mots-clés. « Sans en faire des caisses. »

### 4.6 Formulaire de contact — EmailJS

- **Adrien n'a pas fourni les identifiants.** Il a demandé explicitement : **mets des placeholders.**
- Utilise des variables d'environnement Astro publiques et livre un **`.env.example`** :
  ```
  PUBLIC_EMAILJS_PUBLIC_KEY=
  PUBLIC_EMAILJS_SERVICE_ID=
  PUBLIC_EMAILJS_TEMPLATE_ID=
  ```
- `.env` dans `.gitignore`. Le code doit **dégrader proprement** si les variables sont vides (message clair, pas de crash au build).
- Champs (cf. `05-contenu-contact.md`) : Nom/entreprise · Email · Métier (optionnel) · Type de projet (liste : Nouveau site vitrine / Refonte de mon site / Référencement & visibilité / Outil sur-mesure / Autre) · Message · bouton « Envoyer ma demande ».
- **Mention RGPD** sous le formulaire (consentement au traitement des données).
- Validation côté client, états de chargement / succès / erreur, labels correctement associés, `aria-live` pour le retour.
- Paquet npm `@emailjs/browser` (pas de script CDN).
- À noter dans le README pour Adrien : activer dans EmailJS la **liste blanche de domaine** (`adrienrusso.fr` uniquement) + **reCAPTCHA**.

### 4.7 CI/CD — GitHub Actions

Un workflow qui, sur push de la branche de déploiement :
1. `npm ci`
2. `npm run build`
3. **Génère le PDF du CV** — la page `/cv` imprimée en PDF (Playwright headless via `npx playwright`, avec une feuille de style `@media print` dédiée), déposée dans la sortie du build (ex. `dist/adrien-russo-cv.pdf`) pour que le bouton de téléchargement fonctionne.
4. Déploie sur **GitHub Pages** (`actions/upload-pages-artifact` + `actions/deploy-pages`).
- Vérifie que **`public/CNAME`** (contenu : `adrienrusso.fr`) est bien présent dans `dist/`, sinon le domaine custom casse à chaque déploiement.
- Les secrets EmailJS passent par les **secrets/variables du dépôt**, injectés à l'étape de build.
- Lis `assets/deploy.yml.ancien` pour t'en inspirer, mais écris un workflow neuf.
- Ajoute un job de **vérification sur pull request** (build seul, sans déploiement) — c'est ce que `gh run watch` observera.

---

## 5. Plan d'exécution

### Étape 1 — Sécuriser l'existant
- `main` doit rester **intacte** : ne la modifie pas, ne la force-push pas.
- Vérifie que l'arbre est propre : `git status`.
- Le dossier `ressources/` (celui-ci) contient déjà la sauvegarde de tout ce qui valait la peine d'être conservé : les 3 `cv*.json`, le `CNAME`, les avatars, le favicon, l'ancien workflow. **Rien d'autre n'est à sauver.**

### Étape 2 — Créer la branche et la vider
```bash
cd ~/Developer/cv-portfolio
git switch main && git pull
git switch -c refonte-2026
```
Puis supprimer **tout** sauf `.git/` et `ressources/` :
```bash
git rm -r --cached . -q
# supprime les fichiers suivis et non suivis, hors .git et ressources
find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' ! -name 'ressources' \
  -exec rm -rf {} +
```
- ⚠️ **Conserve `ressources/`** — c'est ta documentation de travail. Décide avec Adrien si elle est committée dans le dépôt ou ignorée via `.gitignore` ; par défaut, **committe-la**, c'est de la documentation projet utile.
- Disparaissent donc : `astro.config.mjs`, `tailwind.config.mjs`, `src/`, `public/`, `node_modules/`, `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `.prettierrc`, `.vscode/`, `.idea/`, `.github/`, `LICENSE.txt`, `README.md`, `tsconfig.json`, `cv.json`, `cv-reac.json`, `cv-merged.json`.
- Fais un commit intermédiaire (`chore: repart de zéro`) pour que la suppression soit lisible dans l'historique.

### Étape 3 — Échafauder et installer
- `npm create astro@latest` (template vide, TypeScript strict), puis `@astrojs/sitemap`, les paquets `@fontsource`, `@emailjs/browser`, Prettier + `prettier-plugin-astro`.
- Un seul lockfile. `node_modules/`, `dist/`, `.astro/`, `.env` dans `.gitignore`.
- **Ne réinstalle pas Tailwind.**
- Remets `assets/CNAME` dans `public/CNAME` et les images utiles dans `src/assets/`.

### Étape 4 — Écrire les tokens AVANT les composants
Commence par `src/styles/tokens.css` (§2.1), puis un reset et les styles de base, **ensuite** seulement les composants. C'est l'ordre qui garantit qu'aucune valeur ne finit en dur.

### Étape 5 — Intégrer
Layout + en-tête + pied de page (avec le ticket) → page d'accueil → Services → CV → Contact. Contenu **repris tel quel** des docs, pas de reformulation créative.

### Étape 6 — Vérifier
```bash
npm run build          # doit passer sans erreur ni warning
npm run preview        # contrôle visuel des 4 pages
npx astro check        # types
```
Puis pousser et vérifier la CI **avec la CLI GitHub** :
```bash
git push -u origin refonte-2026
gh run list --branch refonte-2026
gh run watch
gh run view --log-failed   # en cas d'échec
```
- ⚠️ **`gh` n'était pas installé sur le Mac au 2026-07-25.** Si `gh: command not found` : `brew install gh` (installer Homebrew d'abord si absent), puis `gh auth login`.
- Vérifie aussi la config Pages : `gh api repos/ArnRso/cv-portfolio/pages` (source = GitHub Actions, domaine custom = `adrienrusso.fr`).

---

## 6. Critères d'acceptation

- [ ] Branche `refonte-2026` créée, `main` inchangée.
- [ ] Aucun fichier de l'ancien projet ne subsiste (hors `ressources/`).
- [ ] `npm run build` et `npx astro check` passent proprement.
- [ ] **`grep` dans `src/` : aucune couleur hexadécimale ni valeur `px`/`rem` en dur dans un composant.** Tout vient de `tokens.css`.
- [ ] Changer la palette = éditer **un seul** fichier. Testé en basculant sur une autre palette de `07-design-pistes.md`, puis retour sur D.
- [ ] Zéro requête réseau vers un domaine tiers au chargement (vérifie l'onglet Réseau : aucune police Google, aucun CDN).
- [ ] Zéro trace de Tailwind dans `package.json` et la config.
- [ ] Les 4 pages sont remplies avec le contenu réel des docs, sans lorem ipsum.
- [ ] Hero XXL trois lignes + marquee des métiers fonctionnels, `prefers-reduced-motion` respecté.
- [ ] Ticket « carnet à souche » présent en pied de page, en crème/papier.
- [ ] `title`/`meta` uniques par page, un seul H1 par page, JSON-LD valide (teste dans le validateur de résultats enrichis Google).
- [ ] `sitemap.xml` + `robots.txt` générés, `site` = `https://adrienrusso.fr`.
- [ ] **Aucun numéro de téléphone** nulle part : ni HTML, ni JSON-LD, ni PDF.
- [ ] **Aucune formulation du type « je cherche un poste »** — Adrien est en CDI, le site est public (voir §7).
- [ ] Formulaire complet avec placeholders EmailJS + `.env.example` + mention RGPD ; le build ne casse pas sans clés.
- [ ] Workflow GitHub Actions vert, PDF du CV généré, `CNAME` présent dans `dist/`.
- [ ] Responsive et accessible (mobile-first, contrastes AA, focus visible, navigation clavier).
- [ ] README à jour : commandes, structure, où éditer les tokens, comment changer la palette, ce qu'il reste à faire côté Adrien (EmailJS, Google Business Profile, mentions légales).

---

## 7. Points de vigilance — à ne pas rater

1. **Adrien est en CDI.** Le site est un CV public que son employeur actuel (Appro Automobiles) peut voir. Ton factuel. **Ne JAMAIS écrire « je cherche un poste »**, « ouvert aux opportunités » ou équivalent.
2. **Pas de téléphone affiché**, alors que le JSON en contient un. Voir §4.4.
3. **Pas de prix affiché.** On reste sur « devis gratuit et sans engagement ».
4. **E-commerce retiré du périmètre** — ne le réintroduis pas dans les services, même si ça paraît logique pour un dev web.
5. **Références nommées uniquement sur la page CV** (AD Occasion, Appro Auto, LCPO). L'accueil utilise à la place la section « Une expérience solide, mise à votre service ». Ne remonte pas les références sur l'accueil.
6. **WordPress** : mention discrète dans l'encart « Côté technique » de la page Services, jamais un argument phare.
7. **Aucun avis client** pour l'instant — prévois l'emplacement, ne fabrique pas de faux témoignages.
8. **Cible = artisans du BTP en Gironde**, pas « les PME » ni « les startups ». Le vocabulaire doit rester celui du bâtiment.
9. **Les maquettes HTML d'origine sont perdues.** Si un détail de design est ambigu, tranche et documente ton arbitrage dans le README plutôt que de bloquer.
10. Un futur **blog** est envisagé (content collections Astro) — structure le projet pour que ce soit facile à ajouter, mais ne le construis pas.

---

## 8. Reste à faire côté Adrien (à rappeler dans le README)

- Fournir les identifiants EmailJS + connecter le service email vers `hello@adrienrusso.fr`.
- Activer dans EmailJS la liste blanche de domaine + reCAPTCHA.
- Vérifier que la boîte `hello@adrienrusso.fr` est opérationnelle.
- Rédiger mentions légales + politique de confidentialité (obligatoire avant mise en ligne).
- Créer la fiche Google Business Profile.
- Installer `gh` si absent (`brew install gh` puis `gh auth login`).
- Optionnel plus tard : 2-3 sites démo BTP pour remplacer la section « expérience » de l'accueil.
