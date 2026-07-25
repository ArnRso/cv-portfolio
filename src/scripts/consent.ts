/**
 * Recueille le consentement à la mesure d'audience et ne charge Google
 * Analytics qu'en cas d'acceptation. Tant que le visiteur n'a pas répondu,
 * aucun cookie n'est déposé et aucun script tiers n'est chargé.
 *
 * L'identifiant de mesure est passé par l'attribut data-ga-id du bandeau.
 */
const KEY = 'consent-audience';
const SIX_MOIS = 1000 * 60 * 60 * 24 * 182;

type Choix = 'accepter' | 'refuser';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const banniere = document.getElementById('consent');
const gaId = banniere?.dataset.gaId;

if (banniere && gaId) {
  const lire = (): Choix | null => {
    try {
      const brut = localStorage.getItem(KEY);
      if (!brut) return null;
      const { choix, date } = JSON.parse(brut);
      // Un consentement expiré est traité comme absent : on redemande.
      if (Date.now() - date > SIX_MOIS) {
        localStorage.removeItem(KEY);
        return null;
      }
      return choix;
    } catch {
      return null;
    }
  };

  const charger = () => {
    if (document.getElementById('ga-src')) return;

    const script = document.createElement('script');
    script.id = 'ga-src';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag lit `arguments` : une fonction fléchée casserait l'API de Google.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { anonymize_ip: true });
  };

  const repondre = (choix: Choix) => {
    localStorage.setItem(KEY, JSON.stringify({ choix, date: Date.now() }));
    banniere.hidden = true;
    if (choix === 'accepter') charger();
  };

  banniere.addEventListener('click', (event) => {
    const cible = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-consent]',
    );
    const choix = cible?.dataset.consent as Choix | undefined;
    if (choix) repondre(choix);
  });

  // Lien « Gérer mes préférences » du pied de page.
  document.addEventListener('click', (event) => {
    if (!(event.target as HTMLElement).closest('[data-consent-reset]')) return;
    event.preventDefault();
    localStorage.removeItem(KEY);
    banniere.hidden = false;
  });

  const choix = lire();
  if (choix === 'accepter') charger();
  else if (choix === null) banniere.hidden = false;
}

export {};
