import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMPTY_FORM, PATHWAYS, buildAdvisorQuestions, buildSummary, matchPathways, validateForm } from './pathway-logic';

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
