/**
 * Pages métier — contenu éditorial.
 *
 * Une page par corps de métier, pensée pour la recherche locale (« création
 * site internet couvreur Bordeaux ») et pour être citable par les moteurs
 * génératifs : phrases factuelles, FAQ, entité claire.
 *
 * Règle de fond : n'ajouter un métier ici QUE si on a de la matière propre à
 * lui — ses enjeux, ce que son site doit contenir, ses questions. Trois pages
 * réellement différentes valent mieux que neuf pages interchangeables, que
 * Google traite comme du contenu dupliqué. Les trois métiers présents sont
 * ceux dont une démo existe : la capture sert de preuve visuelle unique.
 */

import type { ImageMetadata } from 'astro';
import couvreurDesktop from '../assets/demos/captures/couvreur-desktop.webp';
import electricienDesktop from '../assets/demos/captures/electricien-desktop.webp';
import menuisierDesktop from '../assets/demos/captures/menuisier-desktop.webp';

export interface Metier {
  /** Segment d'URL : /creation-site-internet-<slug> */
  slug: string;
  /** Nom du métier, au singulier, tel qu'il s'écrit dans une phrase. */
  nom: string;
  /** Article + nom, pour les tournures « le site d'un couvreur ». */
  leNom: string;
  /** Pluriel, pour « les couvreurs de Gironde ». */
  pluriel: string;
  title: string;
  description: string;
  /** Chapô de la page. Doit répondre à la question en une phrase. */
  accroche: string;
  /** Pourquoi ce métier a besoin d'un site : enjeux propres au secteur. */
  enjeux: { titre: string; texte: string }[];
  /** Ce que le site doit contenir, et pourquoi, pour CE métier. */
  contenus: { titre: string; texte: string }[];
  /** Démo associée. */
  demo: {
    href: string;
    nom: string;
    image: ImageMetadata;
    alt: string;
    texte: string;
  };
  /** Questions propres au métier — pas les questions génériques du site. */
  faq: { q: string; a: string }[];
}

export const METIERS: Metier[] = [
  {
    slug: 'couvreur',
    nom: 'couvreur',
    leNom: 'un couvreur',
    pluriel: 'couvreurs',
    title: 'Création de site internet pour couvreur à Bordeaux et en Gironde',
    description:
      'Je crée des sites internet pour les couvreurs et charpentiers de Gironde : chantiers en avant, certifications visibles, demandes de devis. Développeur web à Bordeaux, devis gratuit.',
    accroche:
      "Je suis développeur web indépendant à Bordeaux et je crée des sites internet pour les couvreurs, charpentiers et zingueurs de Gironde. Un site de couvreur a un travail précis à faire : prouver que l'entreprise est sérieuse, locale et assurée, avant même le premier appel.",
    enjeux: [
      {
        titre: 'La toiture est le secteur le plus démarché du bâtiment',
        texte:
          "Les particuliers ont été échaudés par des années de démarchage agressif et de fausses entreprises de rénovation de toiture. Quand quelqu'un cherche un couvreur aujourd'hui, sa première question n'est pas le prix : c'est « à qui j'ai affaire ». Un site qui montre l'adresse, les chantiers réels, les assurances et le nom du dirigeant lève ce doute en trente secondes.",
      },
      {
        titre: 'Votre travail est invisible depuis le sol',
        texte:
          "Personne ne monte vérifier votre ouvrage. C'est le seul métier du bâtiment où le client paie plusieurs milliers d'euros pour quelque chose qu'il ne verra jamais de près. Les photos de chantier ne sont donc pas de la décoration : elles sont votre seule démonstration de savoir-faire.",
      },
      {
        titre: 'Une partie de la demande est urgente',
        texte:
          "Après une tempête ou devant une fuite, on cherche un couvreur sur son téléphone, dans la panique, et on appelle le premier qui inspire confiance et qui semble proche. Si votre site est lent, illisible sur mobile ou muet sur votre zone d'intervention, l'appel part chez un concurrent.",
      },
      {
        titre: 'Les aides à la rénovation orientent vers le RGE',
        texte:
          "L'isolation de toiture ouvre droit à des aides conditionnées à la qualification RGE. Les clients concernés filtrent sur ce critère avant de contacter qui que ce soit. Si votre qualification n'est pas visible dès la page d'accueil, vous êtes écarté d'une demande que vous auriez pu traiter.",
      },
    ],
    contenus: [
      {
        titre: 'Une galerie de chantiers avant / après',
        texte:
          "Le cœur du site. Des photos prises au téléphone suffisent : ce qui compte, c'est de montrer l'état de départ et le résultat. Une dizaine de chantiers variés (rénovation complète, réfection de faîtage, zinguerie, velux) vaut mieux qu'une photo de catalogue.",
      },
      {
        titre: 'Vos certifications, en évidence',
        texte:
          "RGE, Qualibat, assurance décennale, années d'existence : ces éléments se placent en haut de page, pas dans les mentions légales. Ils répondent à la question que le visiteur se pose vraiment.",
      },
      {
        titre: 'Vos savoir-faire séparés',
        texte:
          "Charpente, couverture, zinguerie, isolation, entretien : une page ou une section par prestation. Cela permet d'être trouvé sur des recherches précises (« remplacement gouttière zinc Bordeaux ») que la page d'accueil seule ne capte pas.",
      },
      {
        titre: 'La zone et les délais',
        texte:
          "Les communes couvertes, et le délai sous lequel vous vous déplacez pour une urgence. Deux informations qui décident de l'appel, et que la plupart des sites de couvreurs oublient.",
      },
      {
        titre: 'Un bouton d’appel permanent',
        texte:
          "Sur mobile, le numéro doit rester visible en permanence et déclencher l'appel d'un seul geste. Sur une toiture qui fuit, personne ne remplit un formulaire.",
      },
    ],
    demo: {
      href: '/demos/couvreur',
      nom: 'Toitures Delmas',
      image: couvreurDesktop,
      alt: "Page d'accueil du site de démonstration Toitures Delmas, couvreur zingueur en Gironde",
      texte:
        "Un site de démonstration complet pour une entreprise de couverture fictive. Les chantiers occupent tout l'écran, les certifications sont annoncées dès la première section, et la demande de devis est accessible depuis n'importe quel endroit de la page.",
    },
    faq: [
      {
        q: 'Je travaille surtout par bouche-à-oreille, un site sert à quoi ?',
        a: "À convertir ce bouche-à-oreille. Quand on vous recommande, la personne tape votre nom sur Google avant d'appeler. Sans site, elle tombe sur rien, ou pire sur un avis isolé. Avec un site, elle voit vos chantiers et vos assurances, et elle appelle en confiance. Le site ne remplace pas la recommandation : il évite de la perdre.",
      },
      {
        q: 'Je n’ai pas de belles photos de mes toitures, c’est un problème ?',
        a: 'Non. Les photos prises au téléphone depuis la toiture ou depuis le sol conviennent parfaitement, et elles sont même plus crédibles que des images professionnelles. On les retravaille au recadrage et à la luminosité. Le seul réflexe à prendre : photographier avant de commencer, pas seulement à la fin.',
      },
      {
        q: 'Comment être trouvé après une tempête, quand tout le monde cherche ?',
        a: "Par le référencement local : une fiche Google Business à jour, un site rapide sur mobile, et vos communes d'intervention écrites noir sur blanc. Ces recherches sont géolocalisées et urgentes — Google privilégie les entreprises proches, complètes et bien notées. C'est un travail qui se fait avant la tempête, pas pendant.",
      },
      {
        q: 'Combien coûte un site pour une entreprise de couverture ?',
        a: 'Cela dépend du nombre de prestations à présenter et du fait que vous fournissiez ou non les contenus. Le premier échange et le devis sont gratuits et sans engagement, et le devis est détaillé poste par poste pour que vous sachiez ce que vous achetez.',
      },
    ],
  },
  {
    slug: 'electricien',
    nom: 'électricien',
    leNom: 'un électricien',
    pluriel: 'électriciens',
    title:
      'Création de site internet pour électricien à Bordeaux et en Gironde',
    description:
      'Je crée des sites internet pour les électriciens de Gironde : dépannage, mise aux normes, bornes de recharge. Développeur web à Bordeaux, devis gratuit et sans engagement.',
    accroche:
      "Je suis développeur web indépendant à Bordeaux et je crée des sites internet pour les électriciens de Gironde. La difficulté de ce métier en ligne est particulière : il faut parler à la fois à quelqu'un qui a un tableau qui disjoncte ce soir et à quelqu'un qui prépare la rénovation complète de sa maison.",
    enjeux: [
      {
        titre: 'Deux clients très différents, une seule page d’accueil',
        texte:
          "Le dépannage se cherche dans l'urgence, sur téléphone, et se décide en un appel. La rénovation d'installation se prépare pendant des semaines, se compare, et se décide sur devis. Un site qui ne s'adresse qu'à l'un des deux laisse la moitié de la demande à la concurrence. Les deux parcours doivent être lisibles dès l'arrivée.",
      },
      {
        titre: 'Un métier technique qui doit se rendre compréhensible',
        texte:
          "Vos clients ne savent pas ce qu'est la NF C 15-100, ni pourquoi leur tableau doit être repris. Ils savent qu'ils ont peur d'un court-circuit et qu'ils ne veulent pas se faire avoir. Le site qui explique en français ce qu'il faut faire et pourquoi gagne le devis, avant même le rendez-vous.",
      },
      {
        titre: 'Les bornes de recharge ouvrent un marché neuf',
        texte:
          "L'installation de bornes pour véhicule électrique est une demande en croissance, portée par des aides conditionnées à la qualification IRVE. Ces recherches sont récentes, précises et encore peu disputées localement : c'est aujourd'hui l'un des meilleurs angles pour se positionner en Gironde.",
      },
      {
        titre: 'La qualification rassure et débloque les aides',
        texte:
          "Qualifelec, RGE, IRVE, habilitations : ces mentions ne sont pas décoratives. Elles conditionnent l'accès à certaines aides, et pour un particulier qui hésite entre trois artisans, elles font office de garantie. Elles doivent être visibles sans avoir à chercher.",
      },
    ],
    contenus: [
      {
        titre: 'Le téléphone accessible en permanence',
        texte:
          "Sur mobile, un bouton d'appel qui suit le défilement. C'est la première source de contact pour un électricien, et chaque geste supplémentaire fait perdre des appels.",
      },
      {
        titre: 'Vos prestations expliquées, une par une',
        texte:
          "Dépannage, mise aux normes, rénovation complète, tableau électrique, domotique, borne de recharge, éclairage extérieur. Chaque prestation mérite sa section : c'est ce qui permet d'apparaître sur des recherches précises plutôt que sur le seul mot « électricien ».",
      },
      {
        titre: 'Des chantiers racontés par le problème résolu',
        texte:
          'Une photo de tableau électrique ne dit rien à un particulier. « Tableau des années 70 remplacé en une journée dans une maison de Talence, mise aux normes complète » lui parle immédiatement, et le rassure sur le délai.',
      },
      {
        titre: 'Vos délais d’intervention par secteur',
        texte:
          "Annoncer sous combien de temps vous intervenez, et sur quelles communes. C'est souvent le critère de choix final pour un dépannage, et très peu de sites d'électriciens le précisent.",
      },
      {
        titre: 'Vos qualifications et assurances',
        texte:
          'Qualifelec, IRVE, RGE, décennale : présentées clairement, avec en une phrase ce que chacune signifie pour le client. Une qualification que le visiteur ne comprend pas ne le rassure pas.',
      },
    ],
    demo: {
      href: '/demos/electricien',
      nom: 'Voltek',
      image: electricienDesktop,
      alt: "Page d'accueil du site de démonstration Voltek, électricien à Bordeaux",
      texte:
        "Un site de démonstration pour une entreprise d'électricité fictive. Le numéro reste à portée de main pendant toute la visite, les prestations se déplient une par une, et chaque chantier présenté commence par le problème qu'il a résolu.",
    },
    faq: [
      {
        q: 'Mes clients me trouvent surtout en urgence, un site change quoi ?',
        a: "Il décide de l'appel. En urgence, on ouvre trois résultats, on regarde dix secondes chacun, et on appelle celui qui paraît le plus fiable et le plus proche. Un site rapide, avec vos communes et votre numéro visibles immédiatement, gagne cet arbitrage. Un site absent ou lent le perd systématiquement.",
      },
      {
        q: 'Faut-il une page dédiée aux bornes de recharge ?',
        a: "Oui, si vous êtes qualifié IRVE. C'est une demande en croissance, les gens la cherchent avec des mots précis (« installation borne recharge voiture électrique » suivi du nom de leur commune), et une page dédiée se positionne beaucoup mieux qu'un paragraphe noyé dans une liste de prestations.",
      },
      {
        q: 'Je fais surtout du chantier pour des professionnels, est-ce utile ?',
        a: "Oui, mais le site ne dit alors pas la même chose. En B2B, un donneur d'ordre vérifie vos références, vos qualifications, votre capacité à tenir un planning et la taille de votre équipe. Les chantiers présentés doivent être des chantiers professionnels, et le ton celui d'une entreprise à qui l'on confie un lot, pas d'un dépanneur.",
      },
      {
        q: 'Puis-je mettre mes tarifs de dépannage en ligne ?',
        a: "C'est possible et souvent efficace : annoncer un tarif de déplacement ou une fourchette pour les interventions courantes filtre les appels non qualifiés et rassure sur la transparence. Pour tout ce qui relève du chantier, mieux vaut renvoyer vers un devis, chaque installation étant différente.",
      },
    ],
  },
  {
    slug: 'menuisier',
    nom: 'menuisier',
    leNom: 'un menuisier',
    pluriel: 'menuisiers',
    title: 'Création de site internet pour menuisier à Bordeaux et en Gironde',
    description:
      'Je crée des sites internet pour les menuisiers et agenceurs de Gironde : un site qui met le sur-mesure en valeur et amène des projets. Développeur web à Bordeaux, devis gratuit.',
    accroche:
      "Je suis développeur web indépendant à Bordeaux et je crée des sites internet pour les menuisiers et agenceurs de Gironde. Un menuisier vend quelque chose qui n'existe pas encore au moment où le client décide : tout le travail du site consiste à rendre ce futur ouvrage crédible et désirable.",
    enjeux: [
      {
        titre: 'Vous êtes en concurrence avec des enseignes, pas des artisans',
        texte:
          "Sur une cuisine, un dressing ou des fenêtres, le client compare votre travail à celui d'une grande enseigne qui a des showrooms, des catalogues et un budget publicitaire. Votre avantage est réel — le sur-mesure, l'essence choisie, la pièce unique — mais il est invisible tant qu'il n'est pas montré. Sans site soigné, la comparaison se fait sur le seul prix, et elle est perdue d'avance.",
      },
      {
        titre: 'Votre métier est le plus visuel du bâtiment',
        texte:
          "Un bel escalier, une verrière, une bibliothèque sur mesure : ces ouvrages se vendent en une image. C'est le seul corps de métier où le site peut déclencher le désir avant même la nécessité. Une galerie médiocre gâche cet avantage ; une galerie soignée fait le travail de trois rendez-vous.",
      },
      {
        titre: 'Le projet mûrit pendant des mois',
        texte:
          "Personne ne commande une cuisine sur-mesure le jour où il y pense. Le client revient plusieurs fois, montre le site à son conjoint, compare. Un site qu'on retrouve facilement, qu'on a envie de parcourir à nouveau et qui donne à voir le processus accompagne cette maturation, là où une page de contact seule ne retient personne.",
      },
      {
        titre: 'Le sur-mesure doit se justifier',
        texte:
          "L'écart de prix avec l'industriel se justifie par des choses concrètes : l'essence de bois, l'assemblage, la prise de mesures, l'adaptation à un mur qui n'est pas droit. Montrer l'atelier et les détails de fabrication transforme un prix élevé en prix compris.",
      },
    ],
    contenus: [
      {
        titre: 'Une galerie organisée par type d’ouvrage',
        texte:
          'Cuisines, dressings, escaliers, verrières, bibliothèques, agencement de commerce. Le visiteur arrive avec un projet précis en tête et doit trouver des exemples de son projet en un clic, pas faire défiler cinquante photos mélangées.',
      },
      {
        titre: 'Des photos qui montrent le détail',
        texte:
          "Un plan large pour situer l'ouvrage dans la pièce, et des gros plans sur les assemblages, les finitions, les poignées. C'est le détail qui prouve le savoir-faire et qui distingue votre travail d'un meuble monté en kit.",
      },
      {
        titre: 'Votre atelier et votre façon de travailler',
        texte:
          "Les étapes, de la prise de mesures à la pose. Une ou deux photos d'atelier. C'est ce qui rend le sur-mesure concret et rassure le client sur ce qu'il achète pendant les semaines où il attend.",
      },
      {
        titre: 'Les essences et matériaux que vous travaillez',
        texte:
          "Chêne, frêne, noyer, bois massif ou panneau, mais aussi le métal et le verre pour les verrières. Ce vocabulaire est exactement celui que tapent les clients qui savent ce qu'ils veulent — et ce sont les meilleurs projets.",
      },
      {
        titre: 'Un formulaire qui accepte les pièces jointes',
        texte:
          "Vos clients ont une photo de leur pièce, un croquis, parfois un plan d'architecte. Pouvoir les envoyer directement fait gagner un aller-retour et qualifie la demande dès le premier contact.",
      },
    ],
    demo: {
      href: '/demos/menuisier',
      nom: 'Atelier Lascaze',
      image: menuisierDesktop,
      alt: "Page d'accueil du site de démonstration Atelier Lascaze, menuisier à Bordeaux",
      texte:
        "Un site de démonstration pour un atelier de menuiserie fictif. Les ouvrages sont présentés en grand format et classés par type, l'atelier est montré, et le parcours conduit naturellement vers la description d'un projet.",
    },
    faq: [
      {
        q: 'Mes réalisations sont déjà sur les réseaux sociaux, cela suffit ?',
        a: 'Les réseaux sociaux montrent, mais ils ne se cherchent pas. Personne ne tape « menuisier Bordeaux » sur Instagram, et vos publications disparaissent au fil du temps. Le site est ce qui capte les recherches Google et ce qui organise vos ouvrages durablement, par type de projet. Les deux se complètent : les réseaux entretiennent, le site convertit.',
      },
      {
        q: 'Comment valoriser le sur-mesure face aux prix des grandes enseignes ?',
        a: "En montrant ce que l'enseigne ne peut pas faire : l'adaptation à un mur biscornu, l'essence choisie, l'assemblage traditionnel, la pièce qui tient exactement dans l'espace disponible. Des photos de détail et une explication du processus déplacent la conversation du prix vers la valeur. Le client qui comprend pourquoi c'est plus cher n'est plus dans la comparaison.",
      },
      {
        q: 'Je fais de la pose de menuiseries industrielles, pas que du sur-mesure.',
        a: "C'est très fréquent, et le site doit le refléter honnêtement : les deux activités n'attirent pas les mêmes clients ni les mêmes recherches. On distingue clairement la pose de menuiseries (fenêtres, portes, volets, avec les aides éventuelles) de la création sur-mesure en atelier. Cela évite qu'un visiteur venu pour changer ses fenêtres reparte en pensant que vous ne faites que du meuble.",
      },
      {
        q: 'Faut-il afficher des prix pour du sur-mesure ?',
        a: 'Rarement des prix précis, mais des ordres de grandeur aident. Indiquer un budget de départ pour une cuisine ou un dressing évite les demandes hors sujet et fait gagner du temps à tout le monde. Chaque projet reste chiffré sur devis, après prise de mesures.',
      },
    ],
  },
];
