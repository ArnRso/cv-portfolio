# Plan d'intégration — historique

_Rédigé le 2026-07-25 pendant une session cloud qui n'a PAS pu exécuter le travail (voir « Pourquoi » en bas). Conservé pour l'historique ; les consignes opérationnelles à jour sont dans `00-INSTRUCTIONS.md`._

## Dépôt cible
- Chemin local : `~/Developer/cv-portfolio`
- Remote : `git@github.com:ArnRso/cv-portfolio.git`
- État au 2026-07-25 : branche `main`, arbre propre, à jour avec origin.
- Contenu existant : ancien projet Astro (2024) — `astro.config.mjs`, `tailwind.config.mjs`, `src/`, `public/`, `node_modules/`, DEUX lockfiles (`package-lock.json` ET `pnpm-lock.yaml`), `.prettierrc`, `.idea/`, `.vscode/`, `.github/`, `LICENSE.txt`, `README.md`, et trois fichiers de données CV : `cv.json`, `cv-reac.json`, `cv-merged.json`.
- ⚠️ **À sauvegarder avant de vider** : les trois `cv*.json` valent probablement le coup d'être relus (données CV structurées) avant suppression, et `.github/` peut contenir un workflow réutilisable.
  → **Fait** : copiés dans `ressources/data/` et `ressources/assets/`.

## Tâche demandée
1. Créer une nouvelle branche.
2. Supprimer tous les dossiers et fichiers de la branche (repartir d'une base vierge).
3. Installer proprement les dépendances nécessaires et intégrer le portfolio.
4. Vérifier avec la **CLI GitHub** (`gh`) que le build passe et que tout est opérationnel. NB : `gh` n'était pas installé sur le Mac au 2026-07-25 (`gh: command not found`, pas de Homebrew détecté via le pont) — prévoir l'installation.

## Décisions techniques prises le 2026-07-25
- ❌ **Pas de Tailwind.** Décision explicite d'Adrien, elle annule la piste « Tailwind probable » de `08-stack-technique.md`.
- ✅ **CSS natif piloté par variables.** Tout ce qui est susceptible de changer doit être une variable CSS (couleurs, espacements, rayons, typographies, tailles, épaisseurs de trait…). Objectif annoncé : « on va itérer pas mal de fois » — il faut pouvoir changer l'identité visuelle en éditant un seul fichier de tokens, sans toucher aux composants.
- ❌ **Pas de CDN** tant que possible. Les polices (Archivo 900, Inter, Bricolage Grotesque, Caveat, IBM Plex Mono) doivent être auto-hébergées, par exemple via les paquets `@fontsource` / `@fontsource-variable`, pas via Google Fonts en `<link>`.
- ✅ **Palette D — Bleu Confiance** : fond clair, `#0f2747` (encre profonde), `#1d4ed8` (bleu principal), accent orange. Le ticket « carnet à souche » reste crème/papier quelle que soit la palette (c'est son charme, cf. `07-design-pistes.md`).
- ✅ **Un seul thème.** Pas de bascule clair/sombre, pas de double jeu de tokens.
- ✅ **Périmètre de l'intégration** : ossature Astro complète **avec le design retenu** — les 4 pages (accueil, services, CV, contact) remplies avec le contenu réel des docs `contenu-*.md`, le hero « typo XXL + marquee » (concept 46) et le CTA « carnet à souche » en bas de page (concept 55).

## Rappel des éléments de design retenus
Voir `07-design-pistes.md` pour le détail. En résumé : hero trois lignes « DES SITES / QUI RAMÈNENT / DES CHANTIERS. » (ligne 2 en contour, ligne 3 surlignée) + bandeau défilant des métiers ; bon détachable « Bon pour un devis gratuit » avec souche en pied de page. Typos : titres Archivo 900, texte Inter, ticket Bricolage Grotesque + champs manuscrits Caveat, n° de bon IBM Plex Mono.

## Contenu des pages
Déjà rédigé et validé, à reprendre tel quel : `02-contenu-accueil.md`, `03-contenu-services.md`, `04-contenu-cv.md`, `05-contenu-contact.md`. Contraintes SEO/GEO dans `09-principes-seo-geo.md`.

## Pourquoi ce plan n'a pas été exécuté le 2026-07-25
La session tournait en mode « Dans le cloud ». Le pont vers le Mac donnait bien accès au dossier `cv-portfolio`, mais sans réseau (`npm ping` → 403, `git ls-remote` → connexion refusée sur le port 22) et sans droit de suppression de fichiers. Impossible donc d'y installer des dépendances, d'y pousser une branche, ni de « vider » la branche proprement. Adrien a choisi de relancer la tâche en mode « Sur votre ordinateur ».

## Pourquoi il n'a pas non plus été exécuté par la session Cowork du 2026-07-25
Le dossier était bien accessible en lecture/écriture, mais le shell tourne dans un **sandbox Linux isolé**, pas dans le Terminal macOS : pas de clé SSH (`ssh git@github.com` → `Permission denied (publickey)`), pas de `gh` authentifié, et `node_modules` installé depuis Linux produirait des binaires natifs incompatibles avec le Mac. Adrien a donc choisi de confier l'exécution à une **instance locale**, et cette session a servi à produire ce dossier `ressources/`.
