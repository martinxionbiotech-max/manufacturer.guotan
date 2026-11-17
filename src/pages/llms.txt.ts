import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITES, BRAND } from '../lib/sites';
import { statusMeta, compareByStatus } from '../lib/evidence';

/* llms.txt — a short, factual map of this sub-site for LLM crawlers.
 * Counts and profile links are derived from the collection so this file
 * cannot drift from the directory. */
export const GET: APIRoute = async () => {
  const origin = SITES.manufacturer;
  const manufacturers = (await getCollection('manufacturers')).sort((a, b) =>
    compareByStatus(a.data, b.data),
  );
  const supplierProfiles = manufacturers.filter((m) => m.data.profile_role !== 'Operator entity');
  const operatorProfiles = manufacturers.filter((m) => m.data.profile_role === 'Operator entity');
  const count = (status: string) =>
    supplierProfiles.filter((m) => m.data.verification_status === status).length;
  const withDocument = supplierProfiles.filter((m) =>
    (m.data.documents ?? []).some((d) => d.type !== 'Public listing'),
  ).length;

  const profiles = manufacturers
    .map(
      (m) =>
        `- ${m.data.name ?? m.id} — ${statusMeta(m.data.verification_status).label} — ${origin}/manufacturers/${m.id}/`,
    )
    .join('\n');

  const body = `# ${BRAND} — Manufacturers (${origin})

> Manufacturer intelligence and supplier qualification for coconut shell and biomass charcoal. Manufacturer profiles are published only once they carry a real source and a verification status. ${supplierProfiles.length} supplier profiles are published today; ${count('Unverified')} are unverified lead records and are labelled as such. One operator-entity record is excluded from supplier counts.

## How to read this site
- No manufacturer name, location, capacity, certification, export market or establishment year is fabricated.
- Every profile carries one verification status covering its published fields; where a field rests on a different basis, that basis is noted beside it.
- If a value is unknown, the field reads "Not recorded" rather than being guessed.
- A profile is not a recommendation. Directory order is status, then alphabetical — never a ranking.

## Verification statuses
- Third-Party Verified: supported by independent third-party testing or certification.
- Verified: identity and company documents reviewed against a source.
- Supplier Reported: provided by the supplier themselves; explicitly NOT presented as fact.
- Unverified: not checked against any source; a lead record, not a qualified supplier.

## Published records (${manufacturers.length})
${profiles}

## Status counts
- Third-Party Verified: ${count('Third-Party Verified')}
- Verified: ${count('Verified')}
- Supplier Reported: ${count('Supplier Reported')}
- Unverified: ${count('Unverified')}
- Profiles with a document reference beyond their own website: ${withDocument}

## Key pages
- Home: ${origin}/
- Verification model: ${origin}/verification/
- How we qualify suppliers: ${origin}/how-we-qualify/
- Manufacturer directory: ${origin}/manufacturers/

## Related Charcoal Hub sites
- Main site: ${SITES.main}/
- Product database: ${SITES.data}/products/
- Testing & verification: ${SITES.testing}/

## Data status
- Supplier profiles published: ${supplierProfiles.length}
- Operator-entity records (excluded from supplier counts): ${operatorProfiles.length}
- Document references: ${withDocument} profile(s) carry a public registry record, company document or supplier-stated registration reference.
- State: profiles are published at the status shown above; unverified records are leads, not qualified suppliers.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
