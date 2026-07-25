/**
 * Rend scripts/og-template.html en public/og.png (1200×630), l'image d'aperçu
 * affichée quand un lien du site est partagé sur les réseaux et messageries.
 *
 * À relancer si le gabarit ou la palette changent : node scripts/og-image.mjs
 */
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const TEMPLATE = resolve('scripts/og-template.html');
const OUT = 'public/og.png';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
});

await page.goto(pathToFileURL(TEMPLATE).href, { waitUntil: 'networkidle' });
await page.screenshot({ path: OUT });

await browser.close();
console.log(`Image générée : ${OUT}`);
