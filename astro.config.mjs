// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = (process.env.SITE_URL || 'https://manufacturer.chinacharcoalhub.com').replace(/\/$/, '');

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  trailingSlash: 'always',
});
