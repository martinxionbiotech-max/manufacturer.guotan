/* ------------------------------------------------------------------ */
/* CHARCOAL HUB — content collections (manufacturer.guotan).           */
/*                                                                     */
/* The `manufacturers` collection schema mirrors the §12 profile field */
/* set. EVERY field is optional/nullable on purpose: an unknown value  */
/* must be omitted or set to null, never invented.                     */
/*                                                                     */
/* A profile is written only when it has a real source and a           */
/* verification status. Nine profiles are published as of 2026-11-17;  */
/* their statuses are shown on the directory and each profile page.    */
/* ------------------------------------------------------------------ */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* §14 — the four verification levels. A closed enum means a profile   */
/* can never carry an off-spec status string.                          */
export const VERIFICATION_STATUSES = [
  'Verified',
  'Supplier Reported',
  'Third-Party Verified',
  'Unverified',
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

/* Field helpers — text, lists, booleans and numbers are all optional   */
/* and nullable so a partially sourced profile stays schema-valid       */
/* without guessing at values.                                          */
const text = () => z.string().trim().min(1).nullable().optional();
const textList = () => z.array(z.string().trim().min(1)).nullable().optional();
const flag = () => z.boolean().nullable().optional();

/* A document reference is a pointer to something a reader can weigh.  */
/* `check` states how far the reference has actually been checked, so  */
/* "on file" is never presented as "publicly checkable".               */
const documentEntry = z
  .object({
    label: z.string().trim().min(1),
    type: z.enum([
      'Public registry',
      'Company document',
      'Supplier-stated reference',
      'Public listing',
    ]),
    reference: z.string().trim().min(1),
    url: z.string().url().nullable().optional(),
    check: z.enum([
      'Publicly checkable',
      'On file — not public',
      'Supplier-stated — not independently checked',
    ]),
  })
  .strict();

const manufacturers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/manufacturers' }),
  schema: z
    .object({
      /* --- identity (§12) --- */
      manufacturer_id: text(),
      name: text(),
      location: text(),

      /* --- operations --- */
      factory_type: text(),
      factory_area: text(), // free text: units vary by source, not normalized to a number
      established: z.number().int().min(1900).max(2100).nullable().optional(),

      /* --- products & materials --- */
      main_products: textList(),
      raw_materials: textList(),
      applications: textList(),

      /* --- capacity --- */
      production_capacity: text(), // free text: units vary by source
      production_lines: z.number().int().nonnegative().nullable().optional(),

      /* --- market --- */
      export_markets: textList(),
      oem: flag(),
      private_label: flag(),
      packaging: textList(),
      moq: text(),

      /* --- quality --- */
      quality_control: textList(),
      testing: textList(),
      certifications: textList(),

      /* --- provenance / verification (§14) --- */
      website: z.string().url().nullable().optional(),
      verification_status: z.enum(VERIFICATION_STATUSES).nullable().optional(),
      last_verified: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'last_verified must be an ISO date (YYYY-MM-DD)')
        .nullable()
        .optional(),
      data_source: text(),

      /* --- role in the directory --- */
      /* The operating entity is listed for transparency; it must not be */
      /* counted as a charcoal supplier.                                 */
      profile_role: z.enum(['Supplier', 'Operator entity']).nullable().optional(),

      /* --- evidence artefacts (§14) --- */
      /* Only references that actually exist are listed. A supplier      */
      /* website is a public listing, not a company document.            */
      documents: z.array(documentEntry).nullable().optional(),

      /* A factual note the profile must carry (operator entity, dormant */
      /* registration, conflicting directory entry).                     */
      entity_note: text(),

      /* Hand-written SERP description; ≤160 characters.                 */
      meta_description: text(),

      /* --- relations (used by the §13 "Related Products" section) --- */
      related_products: textList(),
    })
    .strict(),
});

export const collections = { manufacturers };
