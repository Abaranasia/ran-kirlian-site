// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.rankirlian.com',
  // Pages build to `<path>/index.html`, which static hosts serve at `<path>/`.
  // Canonical URLs, the sitemap and internal links all use the trailing slash.
  trailingSlash: 'always',
  // Self-hosted fonts: Astro downloads the latin woff2 files at build time and serves them from
  // /_astro/fonts/, with metric-adjusted fallbacks to limit layout shift while they load.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 500'],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      weights: ['300 500'],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Astro inlines small scripts below this limit. Emitting every script as a file keeps the
      // Content-Security-Policy in public/_headers free of 'unsafe-inline' for scripts.
      assetsInlineLimit: 0,
    },
  },
});
