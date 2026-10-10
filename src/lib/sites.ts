/* ------------------------------------------------------------------ */
/* CHARCOAL HUB — cross-site URL registry.                            */
/* Domain not yet finalized (see DOMAIN_STRATEGY.md). SITE_URL env    */
/* overrides the primary origin at build time. Sub-site origins are   */
/* derived from the primary origin's subdomains unless overridden.    */
/* ------------------------------------------------------------------ */

const main = (process.env.SITE_URL || 'https://chinacharcoalhub.com').replace(/\/$/, '');

function sub(name: string, def: string): string {
  const key = `SITE_${name.toUpperCase()}_URL`;
  return (process.env[key] || def).replace(/\/$/, '');
}

export const SITES = {
  main,
  data: sub('data', 'https://data.chinacharcoalhub.com'),
  manufacturer: sub('manufacturer', 'https://manufacturer.chinacharcoalhub.com'),
  testing: sub('testing', 'https://testing.chinacharcoalhub.com'),
  knowledge: sub('knowledge', 'https://knowledge.chinacharcoalhub.com'),
} as const;

export type SiteKey = keyof typeof SITES;

/* Canonical site name for JSON-LD / llms.txt / robots. */
export const BRAND = 'Charcoal Hub';
export const BRAND_TAGLINE = 'Coconut Shell Charcoal Supplier for Global B2B Buyers';
