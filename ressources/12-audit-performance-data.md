# Audit performance & data — adrienrusso.fr

_Réalisé le 1er août 2026. Lighthouse 13.4.1 (Chromium 151) sur le build `dist/` local, complété par des relevés sur le site en production (headers, réseau, DNS)._

## 1. État des lieux — les chiffres

### Scores Lighthouse

| Catégorie | Mobile | Desktop |
| --- | --- | --- |
| Performance | **78** | **82** |
| Accessibilité | **100** | — |
| Bonnes pratiques | **100** | — |
| SEO | **100** | — |

### Métriques détaillées

| Métrique | Mobile | Desktop | Seuil « bon » |
| --- | --- | --- | --- |
| FCP | 2,4 s | 0,5 s | < 1,8 s |
| LCP | 2,5 s | 0,5 s | < 2,5 s |
| TBT | 0 ms | 0 ms | < 200 ms |
| **CLS** | **0,32** | **0,37** | **< 0,1** |
| Speed Index | 2,4 s | 0,5 s | — |

Lecture : le site est déjà très bien construit (JS quasi nul, TBT parfait, images WebP responsive avec `srcset` et lazy loading, schéma.org, sitemap, a11y irréprochable). **Un seul problème plombe le score : le CLS.** C'est le levier n° 1.

### Relevés production (GitHub Pages)

- TTFB ~30 ms (edge Fastly), HTTP/2, gzip sur HTML/CSS.
- `cache-control: max-age=600` sur **tous** les assets, y compris les fichiers hashés `/_astro/*` qui pourraient être cachés un an. Pas de Brotli, pas de HSTS, pas de headers de sécurité (CSP, X-Content-Type-Options). C'est une limite de GitHub Pages, pas du site.
- **`https://www.adrienrusso.fr` renvoie une page d'erreur** dans le navigateur (le DNS pointe bien vers GitHub Pages, mais le certificat ne semble pas provisionné pour `www`). Quiconque tape `www.` n'arrive pas sur le site.
- La requête GA4 (`G-DGEWFMZL90`) part en **échec (503) sous Brave** : les navigateurs anti-tracking et bloqueurs de pub font sous-compter GA4, en plus des refus de consentement.

## 2. Levier n° 1 — Corriger le CLS (fonts)

Lighthouse identifie la cause : les **5 familles de polices** (Archivo, Inter, Bricolage Grotesque, Caveat, IBM Plex Mono — 5 woff2, **209 Ko**, l'essentiel du poids de la page d'accueil) chargées en `font-display: swap`. Le texte s'affiche en police système puis « saute » quand les woff2 arrivent — avec une typo hero en XXL, le décalage est massif. S'ajoute le portrait (`img.portrait`) signalé « lacking an explicit size » malgré ses attributs (la bordure CSS modifie la taille rendue).

Actions, par ordre d'efficacité :

1. **Précharger les woff2 critiques** dans le `<head>` (`<link rel="preload" as="font" type="font/woff2" crossorigin>`) — au minimum Bricolage (hero) et Inter (corps). Les fonts partent en même temps que le CSS au lieu d'attendre sa lecture.
2. **Neutraliser le saut avec des fallbacks métriques** : `@font-face` de repli avec `size-adjust`, `ascent-override`, `descent-override` calqués sur chaque police (outils : Capsize, fontaine, ou le générateur de Malte Ubl). C'est LA correction du CLS — le texte système occupe exactement la même place que la webfont.
3. **`font-display: optional` pour Caveat** (décorative) : si elle n'arrive pas à temps, pas de swap, pas de saut.
4. **Réduire à 2–3 familles** si possible. Chaque famille = ~30–80 Ko + un swap. IBM Plex Mono ne sert que pour des numéros/labels : remplaçable par `ui-monospace`.
5. Portrait : fixer `width`/`height` en CSS avec `box-sizing: border-box` (ou `aspect-ratio`), pour que la bordure n'ajoute rien.

Gain attendu : CLS < 0,05, score mobile ~95+, et un vrai gain ressenti (plus de flash de mise en page).

## 3. Hébergement — débloquer ce que GitHub Pages ne permet pas

GitHub Pages ne permet ni headers custom, ni Brotli, ni règles de cache. Deux options :

- **Option A (recommandée, 0 €, sans migration) : Cloudflare devant GitHub Pages.** DNS chez Cloudflare, proxy activé. Débloque : Brotli, HTTP/3, `cache-control: immutable` sur `/_astro/*` (cache 1 an), HSTS, headers de sécurité, règle de redirection pour réparer `www`, et **Cloudflare Web Analytics + stats de trafic côté serveur** (non bloquables par les adblockers — voir § 4).
- **Option B : migrer vers Cloudflare Pages ou Netlify.** Fichier `_headers` versionné dans le repo, même workflow GitHub. Plus propre à long terme, mais une migration à gérer.

Dans les deux cas, réparer `www.adrienrusso.fr` immédiatement (vérifier le domaine dans Settings → Pages, ou redirect Cloudflare).

## 4. Collecte de données — l'arsenal complet

C'est ta demande centrale : ne plus piloter à l'aveugle. Voici la pile complète, quasi tout est gratuit.

### Indispensables (à faire cette semaine)

| Outil | Ce que ça t'apporte | Coût |
| --- | --- | --- |
| **Google Search Console** | LA source de vérité SEO : requêtes tapées par les artisans, impressions, CTR, position moyenne, couverture d'indexation, Core Web Vitals terrain. Soumettre `sitemap-index.xml`. | Gratuit |
| **Bing Webmaster Tools** | Idem côté Bing (import direct depuis GSC en 2 clics). ChatGPT/Copilot s'appuient sur l'index Bing — pertinent pour le GEO déjà documenté dans `09-principes-seo-geo.md`. | Gratuit |
| **Google Business Profile** | Pour un positionnement local « Bordeaux/Gironde », c'est potentiellement plus de leads que le site lui-même. Fiche + avis clients + posts. Statistiques de vues/appels/itinéraires incluses. | Gratuit |

### Analytics : régler le double angle mort de GA4

GA4 perd des visites deux fois : refus de consentement + blocage par les adblockers/Brave (constaté en live sur ton site). Sur une cible d'artisans le blocage est plus rare que chez les devs, mais le cumul fausse tout de même les volumes.

La parade : un outil de mesure d'audience **exempté de consentement par la CNIL** (cookieless, first-party). Depuis janvier 2026, la CNIL fonctionne par auto-évaluation des éditeurs selon son référentiel ; Matomo (configuré selon le guide CNIL), Plausible et Umami s'y conforment. Concrètement : **mesure de 100 % des visites, sans bandeau**.

Options classées :

1. **Umami Cloud** (free tier) ou **Plausible** (~9 €/mois) : script léger (< 2 Ko, contre ~100 Ko de JS pour gtag), cookieless, dashboard simple. Servable en first-party via proxy Cloudflare pour échapper aux blocklists.
2. **Cloudflare Web Analytics** (gratuit, si option A du § 3) : en prime, les stats de trafic **côté serveur** — aucun JS, rien à bloquer.
3. **Garder GA4 en parallèle** quelque temps pour comparer les volumes, puis trancher. Le supprimer = supprimer aussi le bandeau = un point de friction en moins.

### Mesurer les conversions (sinon rien ne sert)

Un portfolio de prospection se pilote au **taux de conversion**, pas aux pages vues. Événements à instrumenter (dans GA4 et/ou l'outil exempté) :

- envoi réussi du formulaire EmailJS (l'événement clé) ;
- clics sur « Demander un devis gratuit » (par emplacement : hero, CTA band, ticket) ;
- clics `mailto:` / LinkedIn, téléchargement du CV PDF ;
- affichage des pages `/services`, `/realisations`, `/contact` comme entonnoir.

Avec ça tu sauras : combien de visiteurs → combien voient /contact → combien envoient. Chaque refonte devient mesurable.

### Comportement & UX

- **Microsoft Clarity** (gratuit, illimité) : heatmaps, enregistrements de session, scroll depth, détection de rage clicks. Parfait pour voir où les artisans décrochent sur mobile. RGPD : nécessite le consentement (à coupler au bandeau existant si tu gardes GA4).

### Web Vitals terrain (RUM)

Ton site n'a probablement pas assez de trafic pour figurer dans CrUX (les données « terrain » de PageSpeed Insights). Pour avoir de vraies mesures utilisateurs : la lib **`web-vitals`** (~2 Ko) qui envoie LCP/CLS/INP réels vers GA4 en events, ou le RUM de Cloudflare. C'est le seul moyen de savoir ce que vivent les visiteurs sur leurs vrais téléphones en 4G de chantier.

### Disponibilité

- **UptimeRobot** (gratuit, check 5 min) ou un cron GitHub Actions qui ping le site. GitHub Pages est fiable, mais un domaine mal renouvelé ou un cert expiré, ça arrive.

## 5. Monitoring continu — verrouiller les acquis

Ton repo a déjà une CI propre (`verify.mjs`). À ajouter :

1. **Lighthouse CI** en GitHub Action sur chaque PR, avec **budgets** (`budgets.json`) : perf ≥ 90, CLS ≤ 0,1, poids fonts ≤ 250 Ko… La CI échoue si une PR régresse. C'est l'outil anti-« à l'aveugle » par excellence : chaque changement est mesuré avant merge.
2. Un **cron hebdomadaire** (GitHub Actions) qui lance Lighthouse sur la prod et archive les scores en JSON dans le repo → historique de perf gratuit, graphable.
3. Option payante plus tard si besoin : DebugBear ou SpeedCurve (monitoring synthétique + RUM managé).

## 6. SEO & acquisition — les leviers de croissance

- **Pages métier publiques** : les démos (`/demos/*`) sont noindex à juste titre, mais rien n'existe d'indexable pour « site internet plombier Bordeaux », « site internet menuisier Gironde »… Une page par métier phare, avec la capture de la démo correspondante, ciblerait exactement les recherches de tes prospects. C'est le plus gros levier de trafic qualifié.
- **Backlinks locaux** : annuaires pro (CCI Bordeaux, French Tech), pages partenaires des 3 écoles où tu enseignes (MyDigitalSchool, Campus du Lac, MJM — liens très crédibles), articles invités. Suivi gratuit via **Ahrefs Webmaster Tools**.
- **OG image par page** : actuellement `og.png` global ; une image par page (le script `og-image.mjs` existe déjà) améliore le CTR des partages.
- **UTM systématiques** sur les liens LinkedIn/signatures mail pour attribuer les leads.
- Le maillage `title`/descriptions/FAQPage/ProfessionalService est déjà solide — rien à corriger, juste à étendre.

## 7. Plan d'action priorisé

| # | Action | Impact | Effort |
| --- | --- | --- | --- |
| 1 | Fix CLS fonts (preload + fallbacks métriques + `optional`) | 🔥🔥🔥 | 2–3 h |
| 2 | Google Search Console + sitemap + Bing | 🔥🔥🔥 | 30 min |
| 3 | Réparer `www.adrienrusso.fr` | 🔥🔥 | 15 min |
| 4 | Événements de conversion (formulaire, CTA) | 🔥🔥🔥 | 1–2 h |
| 5 | Google Business Profile | 🔥🔥🔥 | 1 h + avis au fil de l'eau |
| 6 | Analytics exempté CNIL (Umami/Plausible) ± retrait GA4 | 🔥🔥 | 1–2 h |
| 7 | Cloudflare devant GH Pages (cache, Brotli, HSTS, analytics serveur) | 🔥🔥 | 1–2 h |
| 8 | Lighthouse CI + budgets dans la CI | 🔥🔥 | 1–2 h |
| 9 | Microsoft Clarity | 🔥 | 30 min |
| 10 | RUM web-vitals | 🔥 | 1 h |
| 11 | Pages métier indexables | 🔥🔥🔥 (moyen terme) | 1 j+ |
| 12 | UptimeRobot + cron Lighthouse hebdo | 🔥 | 30 min |

## 8. Méthodologie & références

- Lighthouse 13.4.1 sur `dist/` servi en local (émulation mobile Moto G Power, throttling simulé 4G) — les métriques réseau réelles en prod seront légèrement différentes, mais le diagnostic CLS est identique (cause purement front).
- Headers relevés en production via le navigateur (fetch + Resource Timing API).
- Quota de l'API PageSpeed Insights épuisé au moment de l'audit : relancer https://pagespeed.web.dev/ sur `https://adrienrusso.fr/` pour confirmer les chiffres en conditions réelles et vérifier la présence de données CrUX.
- Exemption CNIL mesure d'audience : [référentiel CNIL](https://www.cnil.fr/sites/cnil/files/atoms/files/matomo_analytics_-_exemption_-_guide_de_configuration.pdf) · [Matomo & CNIL 2026](https://matomo.org/blog/2026/01/privacy-regulations-changes-2026-analytics/)
