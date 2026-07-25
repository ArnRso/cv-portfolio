// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://adrienrusso.fr',
  integrations: [
    sitemap({
      // /cv-print est un gabarit d'impression, pas une page du site.
      filter: (page) => !page.includes('/cv-print'),
    }),
  ],
});
