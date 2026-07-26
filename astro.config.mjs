// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://adrienrusso.fr',
  integrations: [
    sitemap({
      // /cv-print est un gabarit d'impression ; /demos présente des
      // entreprises fictives. Ni l'un ni l'autre ne doit être indexé.
      filter: (page) => !page.includes('/cv-print') && !page.includes('/demos'),
    }),
  ],
});
