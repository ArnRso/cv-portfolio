/**
 * Capture les sites de démonstration et dépose les images dans
 * src/assets/demos/captures/. Ces fichiers sont versionnés : la page
 * /realisations les importe comme n'importe quel asset, et Astro s'occupe de
 * la conversion WebP. Le build n'a donc pas besoin d'un navigateur.
 *
 * À rejouer à la main après une modification visuelle d'une démo :
 *   npm run shots
 *
 * Le script travaille sur dist/ : lancer `npm run build` avant.
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { serveDist } from './serve-dist.mjs';

const OUT = 'src/assets/demos/captures';

const DEMOS = ['couvreur', 'electricien', 'menuisier'];

/* Deux formats par démo : le desktop sert de visuel principal, le mobile
   montre que le site suit sur téléphone — l'argument compte pour un artisan. */
const FORMATS = [
  { nom: 'desktop', viewport: { width: 1440, height: 900 }, pleinePage: true },
  {
    nom: 'mobile',
    viewport: { width: 390, height: 844 },
    pleinePage: false,
    deviceScaleFactor: 2,
  },
];

/** Descend toute la page pour déclencher le chargement paresseux des images. */
async function chargerImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
}

await mkdir(OUT, { recursive: true });

const { port, close } = await serveDist();
const browser = await chromium.launch();

for (const demo of DEMOS) {
  for (const format of FORMATS) {
    const page = await browser.newPage({
      viewport: format.viewport,
      deviceScaleFactor: format.deviceScaleFactor ?? 1,
    });

    await page.goto(`http://localhost:${port}/demos/${demo}`, {
      waitUntil: 'networkidle',
    });

    /* Le bandeau collant resterait incrusté en haut du visuel, et il n'a pas
       sa place dans une capture de présentation. */
    await page.addStyleTag({ content: '.demo-bandeau { display: none; }' });

    /* Un élément `sticky` reste figé à sa position initiale dans une capture
       pleine page : le rail de Voltek flotterait au milieu du vide au lieu de
       longer toute la hauteur. On le désolidarise le temps du cliché. */

    await page.evaluate(() => {
      for (const el of document.querySelectorAll('*')) {
        if (getComputedStyle(el).position !== 'sticky') continue;
        el.style.position = 'static';
        /* Le rail tire sa hauteur de la fenêtre : sans cela il resterait
           court, et ne longerait pas la page une fois désolidarisé. */
        el.style.height = 'auto';
        el.style.alignSelf = 'stretch';
        /* Étiré sur toute la page, un `space-between` éparpillerait le menu
           et les coordonnées aux deux extrémités. On les regroupe en haut. */
        el.style.justifyContent = 'flex-start';
        el.style.gap = '40px';
      }
    });

    await chargerImages(page);

    /* Playwright ne sait capturer qu'en PNG ou JPEG. On repasse en WebP :
       ces fichiers sont versionnés, et un PNG pèse ici cinq fois plus.
       Qualité 88 — les captures contiennent du texte fin. */
    const fichier = join(OUT, `${demo}-${format.nom}.webp`);
    const png = await page.screenshot({ fullPage: format.pleinePage });
    await page.close();
    await sharp(png).webp({ quality: 88 }).toFile(fichier);

    console.log(`✓ ${fichier}`);
  }
}

await browser.close();
close();
