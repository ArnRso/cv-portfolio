/**
 * Imprime la page /cv du build en PDF, déposé dans dist/ pour que le bouton
 * « Télécharger le PDF » fonctionne. Sert le dossier dist/ en local plutôt que
 * de lancer un serveur Astro : c'est le rendu réellement déployé qu'on imprime.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const DIST = 'dist';
const OUT = join(DIST, 'adrien-russo-cv.pdf');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(
    new URL(req.url, 'http://localhost').pathname,
  );
  const candidates = [join(DIST, path), join(DIST, path, 'index.html')];

  for (const file of candidates) {
    try {
      if (!(await stat(file)).isFile()) continue;
      res.writeHead(200, {
        'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
      });
      res.end(await readFile(file));
      return;
    } catch {
      // Candidat suivant.
    }
  }

  res.writeHead(404).end('Not found');
});

await new Promise((resolve) => server.listen(0, resolve));
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`http://localhost:${port}/cv`, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: OUT,
  format: 'A4',
  printBackground: true,
  margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
});

await browser.close();
server.close();

console.log(`PDF généré : ${OUT}`);
