/**
 * Imprime la page /cv du build en PDF, déposé dans dist/ pour que le bouton
 * « Télécharger le PDF » fonctionne.
 */
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve-dist.mjs';

const OUT = join('dist', 'adrien-russo-cv.pdf');

const { port, close } = await serveDist();

const browser = await chromium.launch();
const page = await browser.newPage();

/* /cv-print est un gabarit dédié, composé pour tenir sur un A4. La page /cv
   publique reste optimisée pour l'écran. */
await page.goto(`http://localhost:${port}/cv-print`, {
  waitUntil: 'networkidle',
});
await page.pdf({
  path: OUT,
  format: 'A4',
  printBackground: true,
  margin: { top: '11mm', bottom: '11mm', left: '12mm', right: '12mm' },
});

await browser.close();
close();

const { size } = await stat(OUT);
console.log(`PDF généré : ${OUT} (${Math.round(size / 1024)} Ko)`);
