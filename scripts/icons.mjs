/**
 * Génère toutes les déclinaisons de l'icône depuis public/favicon.svg :
 *
 *   favicon.svg          onglet des navigateurs modernes (vectoriel)
 *   favicon.ico          vieux navigateurs et favoris Windows
 *   apple-touch-icon.png écran d'accueil iOS (180×180, sans coins arrondis :
 *                        iOS applique son propre masque)
 *   icon-192.png         Android / PWA
 *   icon-512.png         Android / PWA, écran de démarrage
 *
 * À relancer après modification de la favicon : npm run icons
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'public/favicon.svg';
const svg = readFileSync(SRC, 'utf8');

/* iOS ne respecte pas la transparence des coins et applique son propre
   masque : on lui fournit une version à bords carrés. */
const svgCarre = svg.replace(/ rx="12"/, '');

const browser = await chromium.launch();

const rendre = async (source, taille, sortie) => {
  const page = await browser.newPage({
    viewport: { width: taille, height: taille },
  });
  await page.setContent(
    `<body style="margin:0">${source
      .replace(/width="\d+"/, `width="${taille}"`)
      .replace(/height="\d+"/, `height="${taille}"`)}</body>`,
  );
  await page.waitForTimeout(120);
  await page.screenshot({ path: sortie, omitBackground: true });
  await page.close();
  console.log(`  ${sortie} (${taille}×${taille})`);
};

console.log('Génération des icônes :');
await rendre(svgCarre, 180, 'public/apple-touch-icon.png');
await rendre(svg, 192, 'public/icon-192.png');
await rendre(svg, 512, 'public/icon-512.png');

/* favicon.ico : un PNG 32×32 encapsulé dans un conteneur ICO. Les
   navigateurs acceptent le PNG dans un ICO depuis Vista. */
await rendre(svg, 32, 'public/.ico-tmp.png');
const png = readFileSync('public/.ico-tmp.png');

const ico = Buffer.alloc(22 + png.length);
ico.writeUInt16LE(0, 0); // réservé
ico.writeUInt16LE(1, 2); // type : icône
ico.writeUInt16LE(1, 4); // nombre d'images
ico.writeUInt8(32, 6); // largeur
ico.writeUInt8(32, 7); // hauteur
ico.writeUInt8(0, 8); // palette
ico.writeUInt8(0, 9); // réservé
ico.writeUInt16LE(1, 10); // plans
ico.writeUInt16LE(32, 12); // bits par pixel
ico.writeUInt32LE(png.length, 14);
ico.writeUInt32LE(22, 18); // décalage des données
png.copy(ico, 22);
writeFileSync('public/favicon.ico', ico);
console.log(`  public/favicon.ico (32×32, ${ico.length} octets)`);

await browser.close();
