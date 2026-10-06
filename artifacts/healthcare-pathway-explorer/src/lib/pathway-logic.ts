// Pure logic: validation, matching, advisor questions, summary. No I/O, no storage, no network.

export const SAMPLE_LABEL = 'Sample data—not verified programs';
export const SIM_LABEL = 'Simulated AI — rules/templates only; no live AI';

export const INTEREST_OPTIONS = [
  { id: 'patient-care', label: 'Hands-on patient care' },
  { id: 'lab-diagnostics', label: 'Laboratory and diagnostics' },
  { id: 'imaging', label: 'Medical imaging' },
  { id: 'mental-health', label: 'Mental health support' },
  { id: 'rehab-therapy', label: 'Rehabilitation and therapy' },
  { id: 'health-data', label: 'Health information and data' },
  { id: 'public-health', label: 'Public and community health' },
  { id: 'unsure', label: 'Unsure — show me examples' },
] as const;

export const LOCATION_OPTIONS = [
  { id: 'in-person', label: 'In person' },
  { id: 'online', label: 'Online' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'unsure', label: 'Unsure' },
] as const;
export const TIME_OPTIONS = [
  { id: 'up-to-12', label: 'Up to 12 months', months: 12 },
  { id: 'up-to-24', label: 'Up to 2 years', months: 24 },
  { id: 'up-to-48', label: 'Up to 4 years', months: 48 },
  { id: 'over-48', label: 'More than 4 years is fine', months: 96 },
  { id: 'unsure', label: 'Unsure', months: 0 },
] as const;
export const BUDGET_OPTIONS = [
  { id: 'low', label: 'Up to $1,000' },
  { id: 'moderate', label: 'Up to $5,000' },
  { id: 'flexible', label: 'No budget limit' },
  { id: 'unsure', label: 'Unsure' },
] as const;
export const SCHEDULE_OPTIONS = [
  { id: 'daytime', label: 'Weekday daytime' },
  { id: 'evening-weekend', label: 'Evenings or weekends' },
  { id: 'flexible', label: 'Flexible' },
  { id: 'unsure', label: 'Unsure' },
] as const;

export const FREE_TEXT_MAX = 280;

export interface FormValues {
  interests: string[];
  freeText: string;
  location: string;
  preferredPlace: string;
  trainingTime: string;
  budget: string;
  schedule: string;
}
export const EMPTY_FORM: FormValues = {
  interests: [],
  freeText: '',
  location: 'unsure',
  preferredPlace: '',
  trainingTime: 'unsure',
  budget: 'unsure',
  schedule: 'unsure',
};

export interface PathwayRecord {
  id: string;
  title: string;
  tags: string[]; // interest ids
  format: 'in-person' | 'online' | 'hybrid';
  durationMonths: number;
  schedule: 'daytime' | 'evening-weekend' | 'flexible';
  cost: 'unknown';
  provider: 'unknown';
  location: null;
  requirements: null;
  costBasis: null;
  sourceUrl: null;
  verificationDate: null;
}

// Fictional scenario assumptions. Format/duration/schedule are illustrative, not program facts.
const unknownFacts = { location: null, requirements: null, costBasis: null, sourceUrl: null, verificationDate: null };
export const PATHWAYS: PathwayRecord[] = [
  { ...unknownFacts, id: 'p1', title: 'Sample Pathway 1: Bedside Care Foundations', tags: ['patient-care', 'mental-health'], format: 'in-person', durationMonths: 12, schedule: 'daytime', cost: 'unknown', provider: 'unknown' },
  { ...unknownFacts, id: 'p2', title: 'Sample Pathway 2: Lab and Diagnostics Track', tags: ['lab-diagnostics', 'health-data'], format: 'hybrid', durationMonths: 24, schedule: 'flexible', cost: 'unknown', provider: 'unknown' },
  { ...unknownFacts, id: 'p3', title: 'Sample Pathway 3: Imaging and Patient Care Track', tags: ['imaging', 'patient-care'], format: 'in-person', durationMonths: 24, schedule: 'daytime', cost: 'unknown', provider: 'unknown' },
  { ...unknownFacts, id: 'p4', title: 'Sample Pathway 4: Health Information Studies', tags: ['health-data', 'public-health'], format: 'online', durationMonths: 18, schedule: 'evening-weekend', cost: 'unknown', provider: 'unknown' },
  { ...unknownFacts, id: 'p5', title: 'Sample Pathway 5: Rehabilitation and Community Wellness', tags: ['rehab-therapy', 'public-health', 'mental-health'], format: 'in-person', durationMonths: 48, schedule: 'evening-weekend', cost: 'unknown', provider: 'unknown' },
];

export interface ValidationResult {
  valid: boolean;
  errors: { interests?: string; freeText?: string; preferences?: string; preferredPlace?: string };
}

export function validateForm(v: FormValues): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  const known = new Set<string>(INTEREST_OPTIONS.map((o) => o.id));
  if (!Array.isArray(v.interests) || v.interests.length === 0) {
    errors.interests = 'Choose an interest or select “Unsure — show me examples” to continue. You can revise your answers later.';
  } else if (v.interests.some((i) => !known.has(i))) {
    errors.interests = 'One or more interests are not recognized. Please choose from the listed options.';
  }
  if (v.preferredPlace.length > 120) errors.preferredPlace = 'Keep your preferred region to 120 characters or fewer. Do not enter a street address.';
  if (![LOCATION_OPTIONS.some((o) => o.id === v.location), TIME_OPTIONS.some((o) => o.id === v.trainingTime), BUDGET_OPTIONS.some((o) => o.id === v.budget), SCHEDULE_OPTIONS.some((o) => o.id === v.schedule)].every(Boolean)) {
    errors.preferences = 'Please select a listed practical preference, or choose Unsure.';
  }
  const t = v.freeText ?? '';
  if (t.length > FREE_TEXT_MAX) {
    errors.freeText = `Please keep this note to ${FREE_TEXT_MAX} characters or fewer (currently ${t.length}).`;
  } else if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(t) || /\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/.test(t)) {
    errors.freeText = 'Please remove email addresses or phone numbers. This worksheet does not need personal contact details.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export type Status = 'met' | 'conflict' | 'unknown' | 'unspecified';
export interface Statuses { interests: Status; location: Status; preferredPlace: Status; trainingTime: Status; schedule: Status; budget: Status }

export interface PathwayMatch {
  record: PathwayRecord;
  overlap: string[];
  statuses: Statuses;
  explanation: string[];
  unknowns: string[];
  conflicts: string[];
}

const labelOf = (opts: readonly { id: string; label: string }[], id: string) => opts.find((o) => o.id === id)?.label ?? id;
const interestLabel = (id: string) => labelOf(INTEREST_OPTIONS, id);

export function evaluatePathway(v: FormValues, r: PathwayRecord): PathwayMatch {
  const overlap = r.tags.filter((t) => v.interests.includes(t));
  const explanation: string[] = [];
  const unknowns: string[] = [];
  const conflicts: string[] = [];
   const unsureInterest = v.interests.includes('unsure');
   const s: Statuses = { interests: unsureInterest ? 'unspecified' : overlap.length ? 'met' : 'conflict', location: 'unspecified', preferredPlace: 'unspecified', trainingTime: 'unspecified', schedule: 'unspecified', budget: 'unspecified' };

   if (unsureInterest) explanation.push('You chose Unsure for interests. This is an example to discuss, not an inferred interest match.');
   else if (overlap.length) explanation.push(`Record tags that match your interests: ${overlap.map(interestLabel).join(', ')}.`);
  else conflicts.push('No record tag matches your selected interests.');

   if (v.preferredPlace.trim()) {
     s.preferredPlace = 'unknown';
     unknowns.push(`No geographic location is supplied, so availability in "${v.preferredPlace.trim()}" cannot be checked.`);
   }
  if (v.location !== 'unsure') {
    if (v.location === r.format) { s.location = 'met'; explanation.push(`Scenario assumption: format is ${r.format}, matching your preference.`); }
    else { s.location = 'conflict'; conflicts.push(`Scenario format is ${r.format}; you chose ${v.location}.`); }
  }
  if (v.trainingTime !== 'unsure') {
    const max = TIME_OPTIONS.find((o) => o.id === v.trainingTime)?.months ?? 0;
    if (r.durationMonths <= max) { s.trainingTime = 'met'; explanation.push(`Scenario assumption: ${r.durationMonths} months, within "${labelOf(TIME_OPTIONS, v.trainingTime)}".`); }
    else { s.trainingTime = 'conflict'; conflicts.push(`Scenario duration is ${r.durationMonths} months; you chose "${labelOf(TIME_OPTIONS, v.trainingTime)}".`); }
  }
  if (v.schedule !== 'unsure') {
    if (v.schedule === 'flexible' || r.schedule === 'flexible' || v.schedule === r.schedule) {
      s.schedule = 'met';
      explanation.push(`Scenario assumption: schedule is ${r.schedule}, compatible with "${labelOf(SCHEDULE_OPTIONS, v.schedule)}".`);
    } else { s.schedule = 'conflict'; conflicts.push(`Scenario schedule is ${r.schedule}; you chose "${labelOf(SCHEDULE_OPTIONS, v.schedule)}".`); }
  }
   if (v.budget !== 'unsure' && v.budget !== 'flexible') {
    // Cost is unknown/not supplied, so it can never count as meeting a budget constraint.
    s.budget = r.cost === 'unknown' ? 'unknown' : 'met';
    unknowns.push(`Cost is unknown (not supplied), so your budget choice "${labelOf(BUDGET_OPTIONS, v.budget)}" cannot be checked.`);
  }
   unknowns.push('Institution/provider, geographic location, cost and cost basis, published requirements, source URL, and verification date are not supplied.');
  return { record: r, overlap, statuses: s, explanation, unknowns, conflicts };
}

export interface MatchResult {
  matches: PathwayMatch[]; // fixed sample order; not a ranking
  excluded: PathwayMatch[];
  noMatch: boolean;
}

export function matchPathways(v: FormValues, records: PathwayRecord[] = PATHWAYS): MatchResult {
  const all = records.map((r) => evaluatePathway(v, r));
   const meetsCriteria = (m: PathwayMatch) => m.conflicts.length === 0 && !Object.values(m.statuses).includes('unknown');
   const matches = all.filter(meetsCriteria).slice(0, 5);
   const excluded = all.filter((m) => !meetsCriteria(m));
  return { matches, excluded, noMatch: matches.length === 0 };
}

export function buildAdvisorQuestions(v: FormValues, res: MatchResult): string[] {
  const q: string[] = [];
  if (res.noMatch) {
     q.push('Can you help find and verify real options that meet my stated constraints without changing them?');
    q.push('What real programs exist that fit all of my constraints together?');
  } else {
    q.push('Which real programs correspond to these sample shapes, if any?');
  }
   if (v.budget !== 'unsure' && v.budget !== 'flexible') q.push(`Are any verified options within my "${labelOf(BUDGET_OPTIONS, v.budget)}" limit, including fees, materials, and other required expenses?`);
   else q.push('What is the total cost of a verified program, and what does it include?');
   if (v.preferredPlace.trim()) q.push(`Which verified options are available in "${v.preferredPlace.trim()}"?`);
   q.push('What published requirements should I review directly with the provider? This worksheet cannot determine my eligibility or admission.');
   q.push('What deadlines, requirements, and source documents can the provider confirm?');
  if (v.location !== 'unsure') {
    const article = v.location === 'hybrid' ? 'a' : 'an';
    q.push(`Which real options offer ${article} ${v.location} format?`);
  }
  if (v.schedule !== 'unsure') q.push('How are real schedules structured, and how firm are they?');
  if (v.trainingTime !== 'unsure') q.push('How long do real programs take from start to finish?');
  q.push('Where can I verify any information we discuss?');
  return q;
}

export function buildSummary(v: FormValues, res: MatchResult): string {
  const L: string[] = [];
  L.push('Advisor prep summary');
  L.push(`${SAMPLE_LABEL}. ${SIM_LABEL}.`);
  L.push('');
  L.push(`Interests: ${v.interests.map(interestLabel).join(', ') || 'none selected'}`);
  if (v.freeText.trim()) L.push(`My note: ${v.freeText.trim()}`);
   L.push(`Learning format: ${labelOf(LOCATION_OPTIONS, v.location)}`);
   L.push(`Preferred region: ${v.preferredPlace.trim() || 'Unsure / no location constraint'}`);
  L.push(`Training time: ${labelOf(TIME_OPTIONS, v.trainingTime)}`);
  L.push(`Budget: ${labelOf(BUDGET_OPTIONS, v.budget)}`);
  L.push(`Schedule: ${labelOf(SCHEDULE_OPTIONS, v.schedule)}`);
  L.push('');
  if (res.noMatch) L.push('Sample results: no sample pathway fits all stated constraints. Constraints were not relaxed.');
  else {
    L.push(`Sample pathways shown (${res.matches.length}, in no ranked order):`);
    res.matches.forEach((m) => L.push(`- ${m.record.title}: ${m.unknowns.length} unknown item(s) to confirm`));
  }
  L.push('');
  L.push('Questions for my advisor:');
  buildAdvisorQuestions(v, res).forEach((x) => L.push(`- ${x}`));
  L.push('');
   L.push('These are fictional scenario assumptions, not real program offers. Institution, location, cost/basis, requirements, sources, and verification dates are not supplied. No eligibility/admission decision is made; another pathway does not guarantee nursing admission.');
  return L.join('\n');
}
