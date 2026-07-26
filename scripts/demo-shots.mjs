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

const DEMOS = ['couvreur', 'electricien'];

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

    /* Le bandeau « Démonstration » est collant : il resterait incrusté en
       haut de la capture pleine page. Il n'a pas sa place dans un visuel de
       présentation — la page /realisations porte déjà l'avertissement. */
    await page.addStyleTag({ content: '.demo-bandeau { display: none; }' });

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
