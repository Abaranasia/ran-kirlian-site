// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  // The home page already lists every release.
  redirects: {
    '/releases': '/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
