/**
 * Événements de conversion — mesure ce qui compte : les demandes de devis.
 *
 * Tout passe par gtag si (et seulement si) le visiteur a accepté la mesure
 * d'audience (voir consent.ts). Sans consentement, window.gtag n'existe pas
 * et chaque appel est un no-op silencieux : aucune donnée ne part.
 *
 * Événements émis :
 * - cta_devis      clic vers /contact — param `emplacement` (hero, ticket…)
 * - generate_lead  envoi réussi du formulaire (nom recommandé par GA4)
 * - form_error     échec d'envoi du formulaire (à surveiller : leads perdus)
 * - contact_email  clic sur un lien mailto
 * - cv_download    téléchargement du CV PDF
 * - linkedin       clic sortant vers LinkedIn
 */

type Params = Record<string, string | number | undefined>;

export const track = (event: string, params: Params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
};

/* L'emplacement du clic : attribut data-track-loc s'il est posé, sinon
   déduit du conteneur (header/footer) ou de la section à ancre la plus
   proche. Permet de comparer le rendement des CTA entre eux. */
const emplacement = (a: HTMLAnchorElement): string =>
  a.dataset.trackLoc ??
  (a.closest('header')
    ? 'header'
    : a.closest('footer')
      ? 'footer'
      : (a.closest('[id]')?.id ?? 'page'));

/* Un seul écouteur délégué : les liens ajoutés plus tard sont couverts, et
   aucun composant n'a besoin de câblage individuel. */
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const a = target?.closest('a');
  if (!(a instanceof HTMLAnchorElement)) return;

  const href = a.getAttribute('href') ?? '';

  if (href === '/contact' || href.startsWith('/contact#')) {
    track('cta_devis', { emplacement: emplacement(a) });
  } else if (href.startsWith('mailto:')) {
    track('contact_email', { emplacement: emplacement(a) });
  } else if (href.endsWith('.pdf')) {
    track('cv_download');
  } else if (href.includes('linkedin.com')) {
    track('linkedin');
  }
});
