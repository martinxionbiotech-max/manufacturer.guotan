/* ------------------------------------------------------------------ */
/* CHARCOAL HUB — per-site config: name, nav, footer, description.     */
/* Each repo has its own copy with its own nav/footer.                 */
/* ------------------------------------------------------------------ */
import { SITES } from '../lib/sites';

export type NavItem = { label: string; href: string; external?: boolean };

export type SiteConfig = {
  siteKey: 'main' | 'data' | 'manufacturer' | 'testing' | 'knowledge';
  name: string;
  shortName: string;
  description: string;
  nav: NavItem[];
  footerCols: { title: string; links: NavItem[] }[];
};

export const site: SiteConfig = {
  siteKey: 'manufacturer',
  name: 'Charcoal Hub Manufacturers',
  shortName: 'Manufacturers',
  description:
    'Manufacturer intelligence and supplier qualification for coconut shell and biomass charcoal — profiles are published only with a source and a verification status.',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Verification', href: '/verification/' },
    { label: 'How We Qualify', href: '/how-we-qualify/' },
    { label: 'Request a Quote', href: `${SITES.main}/contact/`, external: true },
    { label: '← Main Site', href: `${SITES.main}/`, external: true },
  ],
  footerCols: [
    {
      title: 'This Site',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Verification Model', href: '/verification/' },
        { label: 'How We Qualify', href: '/how-we-qualify/' },
        { label: 'Manufacturer Directory', href: '/manufacturers/' },
      ],
    },
    {
      title: 'Charcoal Hub',
      links: [
        { label: 'Main Site', href: SITES.main, external: true },
        { label: 'Request a Quote', href: `${SITES.main}/contact/`, external: true },
        { label: 'Knowledge Hub', href: SITES.knowledge, external: true },
        { label: 'Privacy & Data Policy', href: '/privacy/' },

      ],
    },
    {
      title: 'Ecosystem',
      links: [
        { label: 'Product Database', href: `${SITES.data}/products/`, external: true },
        { label: 'Testing & Verification', href: SITES.testing, external: true },
      ],
    },
  ],
};

export default site;
