# Healthcare Pathway Explorer

This is my first prototype for helping students who don't get into nursing but still want to work in healthcare explore other options and prepare for an advisor conversation.

## What it does
Students choose their interests and preferences for training time, schedule, learning format, budget, and location. They can choose Unsure if they haven't decided. The app shows sample pathways, explains what fits or doesn't fit, and gives them questions for an advisor. They can edit, copy, or print their summary, go back to change answers, or reset the form. It doesn't decide whether someone qualifies for a program.

## How to open it
Open the [Replit project](https://replit.com/@pwhiteho/Healthcare-Pathway-Explorer) and use the Preview pane. I still need to check that the prototype link opens for other people before submitting.

## Run the source
Use Node.js 24 and pnpm 10 in Replit or Linux. The current workspace configuration and lockfile target Linux.

```sh
pnpm install --frozen-lockfile
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/healthcare-pathway-explorer run dev
```

Open `http://localhost:5173`. In Replit, the existing Healthcare Pathway Explorer web workflow supplies the port and base path; use its Preview pane instead.

The prototype is frontend-only. No account, database, API server, AI key, or paid service is needed. Shared API/database scaffolding is included to keep the existing workspace configuration complete, but the worksheet doesn't use it.

To check the source:

```sh
pnpm --filter @workspace/healthcare-pathway-explorer run typecheck
pnpm --filter @workspace/healthcare-pathway-explorer exec tsx --test src/lib/pathway-logic.test.ts
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/healthcare-pathway-explorer run build
```

The pathway records, matching rules, validation, and summary/question templates are in `artifacts/healthcare-pathway-explorer/src/lib/pathway-logic.ts`. The form and results page are in `src/pages/home.tsx` in that same app folder. The tests cover the three cases below, unknown costs/locations, invalid inputs, Unsure, TEAS-neutral matching, and advisor-question grammar.

## How AI is used
Eventually, AI would help make sense of what a student writes and explain how real programs fit their goals. Right now, that part is simulated using preset rules and responses. There is no live AI connection.

The form, matching, error messages, and editable summary work. The five pathways and their formats, training times, and schedules are made-up examples. Real schools, locations, costs, requirements, and sources haven't been added yet. Missing information isn't treated as a match. Anything typed in the optional interests box is included in the summary but isn't used to choose pathways.

The app labels these limitations as **Sample data—not verified programs** and **Simulated AI — rules/templates only; no live AI**.

This is a student prototype, not an official ATI, NHA, or university product.

## Three test cases
Codex manually verified all three typical/no-match/empty cases in Safari after styling on October 6, 2026, and all passed. This Safari verification is reported by the project owner; Replit Agent did not rerun Safari. Replit Agent separately checked all three flows in Chromium after the blue-and-gold design update, along with summary editing, revise/reset, and mobile layout.

| Test | What was entered | What happened | Result |
| --- | --- | --- | --- |
| Typical | Patient care, in person, up to 12 months, weekday daytime; budget and location unsure | One sample pathway appeared with reasons it fit, reasons other options didn't, advisor questions, and an editable summary. | Pass |
| No-match | Patient care, online, up to 12 months, evenings/weekends | No matches appeared. The app explained why and gave advisor questions without changing the student's choices. | Pass |
| Empty | No interest selected; everything else left unsure | The app asked the student to choose an interest or Unsure before continuing. | Pass |

## Known limitations
1. **The programs are examples.** They can't confirm real costs or locations yet. My next step would be to add a small set of verified programs in the South Bend area.
2. **AI is simulated.** It doesn't understand written answers yet. I want to test whether real AI explanations would help more than the current preset responses, using verified program information.
3. **Answers aren't saved.** Refreshing or resetting clears the form and summary edits. Students can copy or print the summary, and I need to see whether that's enough for an advising meeting.

## Still to finish
I still need to check that the prototype link opens for other people before submitting.
