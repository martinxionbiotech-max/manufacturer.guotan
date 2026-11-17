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

/* Display metadata for one verification status. Kept here so the     */
/* directory and the profile page cannot drift apart on badge class,  */
/* evidence level or the one-line reading of a status.                */
export type StatusMeta = {
  cls: string;
  label: string;
  evidence: EvidenceLevel;
  evidenceLabel: string;
  oneLine: string;
  caveat: string;
  order: number;
};

export const STATUS_META: Record<string, StatusMeta> = {
  'Third-Party Verified': {
    cls: 'status-third-party',
    label: 'Third-Party Verified',
    evidence: 'F',
    evidenceLabel: EVIDENCE_LEVELS.F,
    oneLine: 'Independent testing or certification supports the published claims.',
    caveat:
      'Covers only the parameters named in the third-party document — not the whole factory, and not batch-to-batch consistency.',
    order: 0,
  },
  Verified: {
    cls: 'status-verified',
    label: 'Verified',
    evidence: 'C',
    evidenceLabel: EVIDENCE_LEVELS.C,
    oneLine: 'Identity and company documents have been reviewed against a source.',
    caveat:
      'Document review confirms who the company is and what it filed. It is not a product quality certificate and not a capability audit.',
    order: 1,
  },
  'Supplier Reported': {
    cls: 'status-supplier',
    label: 'Supplier Reported',
    evidence: 'B',
    evidenceLabel: EVIDENCE_LEVELS.B,
    oneLine: 'The operational figures are the supplier’s own statements.',
    caveat:
      'Self-reported data is published for context, never as an established fact. Capacity, MOQ, certifications and markets all need independent checks before contracting.',
    order: 2,
  },
  Unverified: {
    cls: 'status-unverified',
    label: 'Unverified',
    evidence: 'A',
    evidenceLabel: EVIDENCE_LEVELS.A,
    oneLine: 'A lead record: name and listing only, nothing checked.',
    caveat:
      'Nothing on the profile has been checked against an independent source. Treat it as a candidate to qualify, not a supplier you can rely on.',
    order: 3,
  },
};

export const statusMeta = (status: string | null | undefined): StatusMeta =>
  STATUS_META[status ?? ''] ?? STATUS_META.Unverified;

/* Profiles sort strongest status first, then alphabetically. The      */
/* directory states that this is not a ranking.                        */
export const compareByStatus = (
  a: { name?: string | null; verification_status?: string | null },
  b: { name?: string | null; verification_status?: string | null },
) => {
  const d = statusMeta(a.verification_status).order - statusMeta(b.verification_status).order;
  if (d !== 0) return d;
  return (a.name ?? '').localeCompare(b.name ?? '');
};
