/**
 * Reproduit en local ce que la CI exécute sur GitHub, pour attraper les
 * échecs avant de pousser.
 *
 *   npm run verify        toutes les étapes
 *   npm run verify --fix  corrige le formatage au lieu d'échouer
 *
 * Les étapes et leur ordre sont volontairement alignés sur
 * .github/workflows/ci.yml et deploy.yml.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const fix = process.argv.includes('--fix');

const run = (label, cmd, args) => ({
  label,
  exec: () => spawnSync(cmd, args, { stdio: 'inherit', shell: false }).status,
});

const check = (label, fn) => ({
  label,
  exec: () => {
    const problem = fn();
    if (problem) {
      console.error(`  ✗ ${problem}`);
      return 1;
    }
    return 0;
  },
});

const STEPS = [
  run('Contrôle des types', 'npx', ['astro', 'check']),
  fix
    ? run('Formatage (correction)', 'npx', ['prettier', '--write', '.'])
    : run('Formatage', 'npx', ['prettier', '--check', '.']),
  run('Build', 'npm', ['run', 'build']),

  check('Présence du CNAME', () => {
    if (!existsSync('dist/CNAME')) return 'dist/CNAME absent';
    const domain = readFileSync('dist/CNAME', 'utf8').trim();
    return domain === 'adrienrusso.fr' ? null : `CNAME inattendu : ${domain}`;
  }),

  check('Pages attendues', () => {
    const missing = [
      'dist/index.html',
      'dist/services/index.html',
      'dist/realisations/index.html',
      'dist/demos/couvreur/index.html',
      'dist/demos/electricien/index.html',
      'dist/cv/index.html',
      'dist/contact/index.html',
      'dist/mentions-legales/index.html',
      'dist/confidentialite/index.html',
      'dist/404.html',
      'dist/robots.txt',
      'dist/sitemap-index.xml',
      'dist/og.png',
      'dist/favicon.svg',
      'dist/favicon.ico',
      'dist/apple-touch-icon.png',
      'dist/icon-192.png',
      'dist/icon-512.png',
      'dist/site.webmanifest',
    ].filter((f) => !existsSync(f));
    return missing.length ? `manquant : ${missing.join(', ')}` : null;
  }),

  check('Aucun numéro de téléphone publié', () => {
    const { stdout } = spawnSync(
      'grep',
      ['-rl', '-e', '0643834695', '-e', '06 43 83 46 95', 'dist'],
      { encoding: 'utf8' },
    );
    return stdout.trim() ? `trouvé dans : ${stdout.trim()}` : null;
  }),

  check('Aucune valeur en dur hors tokens.css', () => {
    const { stdout } = spawnSync(
      'grep',
      [
        '-rnE',
        '#[0-9a-fA-F]{3,8}\\b|[^-a-z(]([0-9]+\\.?[0-9]*)(px|rem)',
        '--include=*.astro',
        'src',
      ],
      { encoding: 'utf8' },
    );
    // Exceptions assumées : cv-print.astro compose en points pour le papier,
    // et les démos ont chacune leur identité propre, sans lien avec tokens.css.
    const exempts = [
      'src/pages/cv-print.astro',
      'src/pages/demos/',
      'src/layouts/DemoLayout.astro',
    ];
    /* Les points de rupture (@media, attribut sizes) décrivent la fenêtre du
       visiteur, pas une décision de design : ils n'ont rien à faire dans
       tokens.css et n'ont donc pas à être signalés ici. */
    const breakpoint = /@media|(\s|")sizes=/;
    const hits = stdout
      .split('\n')
      .filter(
        (l) =>
          l && !exempts.some((e) => l.startsWith(e)) && !breakpoint.test(l),
      );
    return hits.length ? `\n${hits.slice(0, 5).join('\n')}` : null;
  }),

  run('PDF du CV', 'node', ['scripts/cv-pdf.mjs']),

  check('PDF sur une seule page', () => {
    const pdf = readFileSync('dist/adrien-russo-cv.pdf');
    const pages =
      pdf.toString('latin1').split('/Type /Page').length -
      pdf.toString('latin1').split('/Type /Pages').length;
    return pages === 1 ? null : `${pages} pages au lieu d'une`;
  }),
];

let failed = 0;

for (const [i, step] of STEPS.entries()) {
  console.log(`\n[${i + 1}/${STEPS.length}] ${step.label}`);
  if (step.exec() !== 0) {
    failed += 1;
    console.error(`❌ ${step.label}`);
  } else {
    console.log(`✓ ${step.label}`);
  }
}

console.log(
  failed
    ? `\n❌ ${failed} étape(s) en échec — la CI échouerait aussi.`
    : '\n✅ Tout passe. La CI devrait être verte.',
);

process.exit(failed ? 1 : 0);
