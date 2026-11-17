import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMPTY_FORM, PATHWAYS, buildAdvisorQuestions, buildSummary, matchPathways, validateForm } from './pathway-logic.ts';

test('typical: patient care, in person, within 12 months, daytime, budget unsure', () => {
  const input = { ...EMPTY_FORM, interests: ['patient-care'], location: 'in-person', trainingTime: 'up-to-12', schedule: 'daytime' };
  assert.equal(validateForm(input).valid, true);
  const result = matchPathways(input);
  assert.deepEqual(result.matches.map((m) => m.record.id), ['p1']);
  assert.ok(result.matches[0].explanation.some((text) => text.includes('12 months')));
  assert.ok(buildSummary(input, result).includes('Questions for my advisor'));
});

test('no match: patient care, online, within 12 months, evenings/weekends', () => {
  const input = { ...EMPTY_FORM, interests: ['patient-care'], location: 'online', trainingTime: 'up-to-12', schedule: 'evening-weekend' };
  const result = matchPathways(input);
  assert.equal(result.noMatch, true);
  assert.equal(result.matches.length, 0);
  assert.ok(result.excluded.find((m) => m.record.id === 'p1')?.conflicts.some((text) => text.includes('format')));
  assert.ok(buildAdvisorQuestions(input, result).some((q) => q.includes('without changing')));
});

test('missing costs and locations do not count as matches', () => {
  const input = { ...EMPTY_FORM, interests: ['patient-care'], budget: 'low', preferredPlace: 'Indianapolis' };
  const result = matchPathways(input);
  assert.equal(result.noMatch, true);
  assert.equal(result.excluded[0].statuses.budget, 'unknown');
  assert.equal(result.excluded[0].statuses.preferredPlace, 'unknown');
});

test('empty and invalid submissions receive helpful validation', () => {
  assert.match(validateForm(EMPTY_FORM).errors.interests ?? '', /Unsure/);
  assert.equal(validateForm({ ...EMPTY_FORM, interests: ['invalid'] }).valid, false);
  assert.equal(validateForm({ ...EMPTY_FORM, interests: ['patient-care'], freeText: 'a'.repeat(281) }).valid, false);
  assert.equal(validateForm({ ...EMPTY_FORM, interests: ['patient-care'], schedule: 'invalid' }).valid, false);
});

test('unsure interests are allowed without inferring an interest match', () => {
  const input = { ...EMPTY_FORM, interests: ['unsure'] };
  assert.equal(validateForm(input).valid, true);
  const result = matchPathways(input);
  assert.equal(result.matches.length, 5);
  assert.ok(result.matches.every((m) => m.statuses.interests === 'unspecified'));
});

test('TEAS/admission notes never affect matching; no institutions or sources fabricated', () => {
  const input = { ...EMPTY_FORM, interests: ['patient-care'] };
  assert.deepEqual(matchPathways({ ...input, freeText: 'My TEAS score is 70. Do I qualify?' }), matchPathways(input));
  assert.ok(PATHWAYS.every((r) => r.provider === 'unknown' && r.sourceUrl === null && r.verificationDate === null));
  assert.ok(buildAdvisorQuestions(input, matchPathways(input)).some((q) => q.includes('cannot determine my eligibility')));
});

test('advisor format questions use the correct article', () => {
  for (const [location, article] of [['online', 'an'], ['in-person', 'an'], ['hybrid', 'a']]) {
    const input = { ...EMPTY_FORM, interests: ['patient-care'], location };
    assert.ok(buildAdvisorQuestions(input, matchPathways(input)).includes(`Which real options offer ${article} ${location} format?`));
  }
  const input = { ...EMPTY_FORM, interests: ['patient-care'] };
  assert.ok(!buildAdvisorQuestions(input, matchPathways(input)).some((q) => q.startsWith('Which real options offer')));
});

test('typical second case: health data online, 24 months, evening schedule', () => {
  const input = { ...EMPTY_FORM, interests: ['health-data'], location: 'online', trainingTime: 'up-to-24', schedule: 'evening-weekend' };
  const r = matchPathways(input);
  assert.deepEqual(r.matches.map(m => m.record.id), ['p4']);
  assert.equal(r.options[0].record.id, 'p4');
});

test('peer challenge: relevant discussion option remains visible without hiding conflicts', () => {
  const input = { ...EMPTY_FORM, interests: ['health-data', 'public-health'], location: 'in-person', trainingTime: 'up-to-12', budget: 'moderate', schedule: 'daytime' };
  const r = matchPathways(input);
  assert.equal(r.noMatch, true);
  assert.equal(r.options.length, 5);
  assert.equal(r.options[0].record.id, 'p4');
  assert.equal(r.options[0].conflicts.length, 3);
  assert.equal(r.options[0].statuses.budget, 'unknown');
  const summary = buildSummary(input, r);
  for (const text of r.options[0].conflicts) assert.ok(summary.includes(`Conflict: ${text}`));
  assert.ok(summary.includes('Cost is unknown'));
});

test('risk: ranking and exported summary cannot silently relax budget or region', () => {
  const input = { ...EMPTY_FORM, interests: ['patient-care'], budget: 'low', preferredPlace: 'South Bend' };
  const r = matchPathways(input);
  assert.equal(r.matches.length, 0);
  assert.equal(r.options[0].record.id, 'p1');
  assert.ok(r.options.every(m => m.statuses.budget === 'unknown' && m.statuses.preferredPlace === 'unknown'));
  const summary = buildSummary(input, r);
  assert.ok(summary.includes('Needs verification — fit cannot be confirmed'));
  assert.ok(summary.includes('Up to $1,000'));
  assert.ok(summary.includes('South Bend'));
  assert.ok(summary.includes('None were relaxed'));
});

test('all unsure means exploration only, not inferred suitability', () => {
  const input = { ...EMPTY_FORM, interests: ['unsure'] };
  const r = matchPathways(input);
  assert.equal(r.explorationOnly, true);
  assert.ok(buildSummary(input, r).includes('no preferences to assess'));
});
