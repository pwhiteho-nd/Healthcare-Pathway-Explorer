# Healthcare Pathway Explorer

A frontend-only demonstration worksheet for exploring healthcare interests and preparing for an advisor conversation.

## Run

Use the existing **Healthcare Pathway Explorer: web** workflow in Replit. It runs:

```sh
pnpm --filter @workspace/healthcare-pathway-explorer run dev
```

The managed workflow supplies `PORT` and `BASE_PATH`. Outside that workflow, use `PORT=5173 BASE_PATH=/` before the command. No AI keys, accounts, database, or API server are required by this flow.

## Data and simulated behavior

`src/lib/pathway-logic.ts` contains five fictional sample records, preference options, validation, deterministic matching, and advisor-question/summary templates. No live AI or inference model is used. Free text is retained only as an advisor note, not interpreted for matching.

Formats, durations, and schedules are fictional scenario assumptions only. Institution/provider, geographic location, tuition/cost basis, published requirements, source URLs, and verification dates are deliberately not supplied. Unknown facts never satisfy an explicit constraint. A set budget limit or specific geographic preference therefore cannot be confirmed with the current samples.

To replace the examples later, supply independently verified records and real source links/dates; update the record type and matching rules together. Do not relabel these examples as verified.

## Privacy and limitations

- Answers and summary edits live only in React memory. Refresh, reset, or closing the page clears them.
- No student-input logging, browser storage, API calls, or submissions.
- Copy/print are user-initiated exports; copied/printed copies are outside the app's reset control.
- No eligibility/admission decisions, TEAS interpretation, guarantees of future nursing admission, or official affiliation.
- The prototype does not prove real program availability, affordability, requirements, or schedule suitability.

## Checks

```sh
pnpm --filter @workspace/healthcare-pathway-explorer run typecheck
pnpm --filter @workspace/healthcare-pathway-explorer exec tsx --test src/lib/pathway-logic.test.ts
```
