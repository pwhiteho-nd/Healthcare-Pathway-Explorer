# Healthcare Pathway Explorer

A student prototype that helps people considering alternatives to nursing explore sample healthcare pathways and prepare questions for an advisor.

## First working slice
Choose healthcare interests (or Unsure), enter practical preferences, and select See sample pathways. Review fictional scenarios, explanations, conflicts, and unknowns, then edit an advisor summary. Revise/reset and copy/print controls are available. The app does not determine eligibility or admission.

## Open the prototype
[Replit project](https://replit.com/@pwhiteho/Healthcare-Pathway-Explorer) — open the Preview pane. Public reviewer access and a stable shareable link still need verification before submission.

## AI role and transparency
Future AI would interpret written priorities and explain verified program options and tradeoffs. Currently, AI behavior is simulated using rules and templates; no live model is called. Forms, filtering, validation, results, and summary editing work. Optional free text is copied into the summary but does not affect matching. All five records and their format, duration, and schedule assumptions are fictional. Institutions, locations, costs, requirements, sources, and verification dates are not supplied. Unknown facts do not count as meeting a constraint. Answers clear on refresh or reset. This is not an official ATI, NHA, or university product.

## Three test results
Tests below concern the functional version before the navy-and-gold update; recheck after styling. Replit Agent reported all three tests. Codex also directly observed the typical result and empty-input validation in Safari.

| Test | Input or action | What happened | Result |
| --- | --- | --- | --- |
| Typical | Patient care; in person; up to 12 months; weekday daytime; budget/region unsure | One fictional Bedside Care Foundations scenario appeared with explanations, conflicts for other options, advisor questions, and an editable summary. | Pass |
| Challenge | Patient care; online; up to 12 months; evenings/weekends | Replit Agent reported zero matches, conflict explanations, and advisor questions without relaxing constraints. | Pass (agent-reported) |
| Empty | No interests; constraints unsure; submit | Submission blocked with guidance to choose an interest or Unsure. | Pass |

## Known limitations
1. **Fictional data:** Real programs and budget/location fit cannot be confirmed. Next, replace samples with verified South Bend-area program records and sources.
2. **Simulated AI:** Rules/templates cannot interpret nuanced written preferences. Next, compare them with source-grounded AI explanations to test whether live AI adds value.
3. **Temporary answers:** Refresh/reset clears answers and edits. Copy/print supports taking a summary to an advisor; test whether that meets students' needs before adding storage.

## Work remaining before submission
Synchronize the current Replit source files to this repository, verify the shareable prototype link, and repeat the three tests after styling. This repository is not yet submission-ready.
