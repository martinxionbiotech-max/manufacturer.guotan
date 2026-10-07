/* ------------------------------------------------------------------ */
/* CHARCOAL HUB — shared JSON-LD builders.                            */
/* Rules (per requirements doc §20/§34/§37):                          */
/*   - never fabricate ratings, reviews, authors, or data             */
/*   - only emit fields that actually exist in the data               */
/*   - full ISO dates only when a real date is known                  */
/*   - FAQPage only when the page has real FAQ content                */
/* ------------------------------------------------------------------ */

const isoDate = (s?: string | null) =>
  s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : undefined;

export type Faq = { q: string; a: string };

/* ----------------------------- Breadcrumb ------------------------- */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/* ----------------------------- Organization ----------------------- */
export function organizationJsonLd(o: {
  id: string;
  name: string;
  description: string;
  logo?: string;
  sameAs?: string[];
}) {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': o.id,
    name: o.name,
    url: o.id,
    description: o.description,
  };
  if (o.logo) out.logo = o.logo;
  if (o.sameAs && o.sameAs.length) out.sameAs = o.sameAs;
  return out;
}

/* ----------------------------- WebSite ---------------------------- */
export function webSiteJsonLd(o: { id: string; name: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': o.id,
    name: o.name,
    url: o.id,
    description: o.description,
  };
}

/* ----------------------------- Article ---------------------------- */
export function articleJsonLd(o: {
  id: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': o.id,
    headline: o.headline,
    description: o.description,
    url: o.id,
    mainEntityOfPage: o.id,
  };
  const dp = isoDate(o.datePublished);
  const dm = isoDate(o.dateModified);
  if (dp) out.datePublished = dp;
  if (dm) out.dateModified = dm;
  return out;
}

/* ----------------------------- Dataset ---------------------------- */
export function datasetJsonLd(o: {
  id: string;
  name: string;
  description: string;
  dateModified?: string;
}) {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': o.id,
    name: o.name,
    url: o.id,
    description: o.description,
  };
  const dm = isoDate(o.dateModified);
  if (dm) out.dateModified = dm;
  return out;
}

/* ----------------------------- Product ---------------------------- */
/* Only emitted when a product has real verified fields.              */
export function productJsonLd(o: {
  id: string;
  name: string;
  description: string;
  brand?: string;
  category?: string;
  properties?: { name: string; value: string }[];
}) {
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': o.id,
    name: o.name,
    description: o.description,
    url: o.id,
  };
  if (o.brand) out.brand = { '@type': 'Brand', name: o.brand };
  if (o.category) out.category = o.category;
  if (o.properties && o.properties.length) {
    out.additionalProperty = o.properties.map((p) => ({
      '@type': 'PropertyValue',
      name: p.name,
      value: p.value,
    }));
  }
  return out;
}

/* ----------------------------- FAQPage ---------------------------- */
/* Only used when a page genuinely has FAQ content (real Q&A).        */
export function faqPageJsonLd(o: { id: string; faqs: Faq[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': o.id,
    mainEntity: o.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/* ----------------------------- helpers ---------------------------- */
export function isoOrDash(s?: string | null): string {
  return s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '—';
}

export const sentence = (s: string) => {
  const t = s.trim().replace(/[.。]+$/, '');
  return `${t}.`;
};
