/**
 * Sert le dossier dist/ sur un port libre. Partagé par les scripts qui
 * pilotent un navigateur (PDF du CV, captures des démos) : c'est le rendu
 * réellement déployé qu'on veut ouvrir, pas le serveur de développement.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = 'dist';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/** Démarre le serveur et renvoie `{ port, close }`. */
export async function serveDist() {
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
  return { port: server.address().port, close: () => server.close() };
}
