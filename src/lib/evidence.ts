/* Six-level evidence model (A–F) mirrored from the shared schema.
 * Source of truth: _shared/evidence-schema.md (repo root). */

export const EVIDENCE_LEVELS = {
  A: 'Unverified material',
  B: 'Supplier-declared',
  C: 'Document-verified',
  D: 'Identity verified',
  E: 'Capability verified',
  F: 'Third-party tested (traceable)',
} as const;

export type EvidenceLevel = keyof typeof EVIDENCE_LEVELS;

/* Legacy four-level status → evidence level. */
export const STATUS_TO_EVIDENCE: Record<string, EvidenceLevel> = {
  Unverified: 'A',
  'Supplier Reported': 'B',
  Verified: 'C',
  'Third-Party Verified': 'F',
};

/* Boundary rules (display code must respect these). */
export const EVIDENCE_BOUNDARY_RULES = [
  'Identity verification (D) is not quality proof (E/F).',
  'Business documents (C) are not factory capability (E).',
  'A supplier-forwarded report is supplier-declared (B) until the report number is traced.',
] as const;

export const evidenceLevelLabel = (status: string | null | undefined): string => {
  if (!status) return EVIDENCE_LEVELS.A;
  const level = STATUS_TO_EVIDENCE[status] ?? 'A';
  return EVIDENCE_LEVELS[level];
};
