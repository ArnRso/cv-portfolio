export const SITE = {
  url: 'https://adrienrusso.fr',
  name: 'Adrien Russo',
  title: 'Adrien Russo — Développeur web pour artisans du BTP en Gironde',
  email: 'hello@adrienrusso.fr',
  linkedin: 'https://www.linkedin.com/in/russoad/',
  city: 'Bordeaux',
  area: 'Gironde',
  /* Couleur de la barre du navigateur sur mobile. Doit rester alignée sur
     --color-inverse de tokens.css : une balise <meta> ne peut pas lire une
     variable CSS. */
  themeColor: '#0f2747',
} as const;

export const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/cv', label: 'CV' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Métiers du bandeau défilant. Dupliqués à l'affichage pour la boucle. */
export const TRADES = [
  'Maçons',
  'Plombiers',
  'Électriciens',
  'Menuisiers',
  'Couvreurs',
  'Plaquistes',
  'Peintres',
  'Carreleurs',
  'Chauffagistes',
] as const;
