# Project Prototype Revision

## What I focused on
This is still my capstone idea for students who don't get into nursing but want to stay in healthcare. The goal of this slice is to help someone explore options and leave with useful questions for an advisor. It does not decide admission or eligibility.

The main issue in peer review was that students could answer the questions and still get no useful starting point. I focused on three changes:
1. Show discussion options even when no full fit can be confirmed. Shared interests come first, then fewer explicit conflicts. This is a simple discussion order, not a recommendation about what someone should enroll in.
2. Separate actual conflicts from information we don't have, and carry those details into the advisor summary. Nothing silently changes the student's choices.
3. Make the interest question clearly say “select all” and show how many are selected. Choosing Unsure now leads to exploration examples instead of implying we know what fits that student.

## Peer feedback and decisions
| Feedback or issue | Decision | What changed and why |
| --- | --- | --- |
| Several attempts returned no matches and similar explanations. | Acted on | All five examples remain available for discussion, with their own reasons, conflicts, unknowns, and advisor question. |
| Always recommend a ranked path, but don't sacrifice an important constraint. | Adapted | I used a transparent discussion order. I did not adopt “always recommend”: an option can be relevant to someone's interests and still violate their schedule or time limit. Those conflicts stay visible. |
| The advisor questions and summary were useful. | Kept and extended | The summary now includes the actual option-level conflicts and missing facts, so those details travel with the student. |
| It wasn't obvious that more than one interest could be selected. | Acted on | Added explicit instructions and a selected count. |
| Broader options would help. | Deferred | Five fictional examples keep this revision testable. More examples alone would not fix missing real cost and location information. Verified local programs are the next data priority. |

## Test evidence
Tests use synthetic inputs, not student records. Success criteria were encoded in assertions before running the revised logic. Codex ran these checks on November 16, 2026. These are automated behavior checks, not new student usability interviews or tests of a live AI model.

| Case | Input/action | Expected result / success criterion | Actual result | Result | Implication / next step |
| --- | --- | --- | --- | --- | --- |
| Typical 1 | Patient care; in person; up to 12 months; weekdays; other fields unsure | Bedside sample has no stated conflicts and appears first; advisor summary exists | Bedside sample was the only scenario meeting stated sample criteria and appeared first | Pass | Normal exploration still works; real feasibility remains unverified. |
| Typical 2 | Health data; online; up to 24 months; evenings/weekends | Health Information sample first and compatible with stated sample preferences | Health Information was first and the only scenario meeting those criteria | Pass | Different preferences produce a different first option. |
| Challenge / before-after | Health data + public health; in person; up to 12 months; $5,000; weekdays | Five discussion options, Health Information first for two shared interests, three conflicts and unknown budget retained; no full fit claimed | All assertions passed; format, duration, and schedule conflicts also appeared in generated summary | Pass | Provides a starting point without claiming the student's needs are met. |
| Empty / invalid | No interest; also test unrecognized interest, invalid schedule, and 281-character note | Validation blocks continuation and gives a correction | Each invalid input was rejected; empty-interest message offers Unsure | Pass | Invalid input is handled; browser error presentation also needs checking. |
| Risk | Patient care; $1,000 limit; South Bend | No confirmed fit; every budget and region status remains unknown; exported summary preserves limits and uncertainty | All five retain unknown budget/region; summary says fit cannot be confirmed and constraints were not relaxed | Pass | The safeguard persists outside the result cards. It cannot stop someone ignoring warnings. |
| Unsure | All preferences unsure | Exploration-only state; no inferred interest suitability | Exploration-only flag and summary wording passed | Pass | This is a starting point, not personalization. |
| Admission inference | Add a synthetic TEAS/admission question to the optional note | Matching unchanged; no invented sources or institutions | Matching identical; source/provider assertions passed | Pass | The app does not infer admission from TEAS. Notes still require user care. |

Full automated suite: 11 tests passed locally on November 16 and again in Replit on November 17. Local TypeScript checks and a production build also passed. Browser checks confirmed the empty-input message, selecting two interests, the peer challenge output, Unsure wording, editing/copying a synthetic summary, and restoring generated text. These checks were performed by Codex, not a student participant. Test source: [pathway-logic.test.ts](artifacts/healthcare-pathway-explorer/src/lib/pathway-logic.test.ts).

### Before and after
I used the same health-data/public-health input described in peer feedback. On the original code (commit dc83ed44), a local run returned 0 matches and 5 excluded options. The revised run still confirms no full fit, but shows five discussion options. Health Information appears first because it shares both interests. Its online format, 18-month duration, and evening/weekend schedule conflict with the student's selections, and its cost is unknown. Those details are displayed and included in the generated summary. The improvement is a more useful next conversation, not a claim that this option is suitable.

### What the evidence means
The checks show that the revised rules respond differently to different inputs and retain constraints in the generated output. They support the basic exploration-to-advisor-prep flow. They do not show that students understand the discussion order, find the wording helpful, or make better career decisions. A student/advisor walkthrough is still needed, especially to see whether the first card feels like an endorsement despite its conflict label.

## Risk and implemented response
The course theme most relevant here is overreliance. A student facing a setback could mistake the first option for a recommendation and assume it meets an important budget or schedule constraint. I changed the behavior, not just the disclaimer: unknown facts never count as met; every conflicting option gets a conflict status and the specific reasons; and those reasons remain in the generated advisor summary. The risk test checks unknown budget/location in both the evaluation and summary. No admission probability or eligibility decision is produced.

The remaining risk is that someone may still overvalue the first card or remove warnings while editing the summary. This prototype cannot verify real programs, and a human advisor/provider must confirm information before educational decisions.

## AI status and limitations
Actual: form, validation, comparison rules, discussion ordering, editable/copyable/printable summary. Simulated: pathway explanations and advisor questions use templates. Planned: an AI model could interpret a student's goals and explain verified program facts. No model is connected, and free-text notes do not affect ordering.

All five pathways, formats, durations, and schedules are fictional. Costs, locations, providers, requirements, and sources are missing. No account or persistent student storage is used. Refreshing clears answers. This is not an official ATI, NHA, or university product.

## Next priorities
1. Test whether students and an advisor understand the difference between relevant, conflicting, and unknown.
2. Add a small verified local dataset with dated sources for costs, requirements, and locations.
3. Compare these templates with source-grounded AI explanations before deciding whether live AI adds enough value.
