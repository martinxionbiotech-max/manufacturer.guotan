import type { APIRoute } from 'astro';
import { SITES, BRAND } from '../lib/sites';

/* llms.txt — a short, factual map of this sub-site for LLM crawlers.
 * It states plainly how manufacturer profiles are published. */
export const GET: APIRoute = () => {
  const origin = SITES.manufacturer;

  const body = `# ${BRAND} — Manufacturers (${origin})

> Manufacturer intelligence and supplier qualification for coconut shell and biomass charcoal. Manufacturer profiles are published only once they carry a real source and a verification status. Nine profiles are published today — mostly supplier-reported, with every claim labelled by status.

## How to read this site
- No manufacturer name, location, capacity, certification, export market or establishment year is fabricated.
- Every profile field carries a verification status, and self-reported data is labelled as such.
- If a value is unknown, the field is left empty rather than guessed.

## Verification statuses
- Verified: reliable source, or on-site / document verification.
- Supplier Reported: provided by the supplier themselves; explicitly NOT presented as fact.
- Third-Party Verified: supported by independent third-party testing or certification.
- Unverified: not yet checked against any source.

## Key pages
- Home: ${origin}/
- Verification model: ${origin}/verification/
- How we qualify suppliers: ${origin}/how-we-qualify/
- Manufacturer directory (data pending): ${origin}/manufacturers/

## Related Charcoal Hub sites
- Main site: ${SITES.main}/
- Product database: ${SITES.data}/products/
- Testing & verification: ${SITES.testing}/

## Data status
- Manufacturers published: 0
- State: data pending — supplier verification in progress.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
