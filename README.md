# Healthcare Pathway Explorer

This is my revised prototype for helping students who don't get into nursing but still want to work in healthcare explore other options and prepare for an advisor conversation.

## What it does
Students choose their interests and preferences for training time, schedule, learning format, budget, and location. They can choose Unsure if they haven't decided. The app shows sample pathways, explains what fits or doesn't fit, and gives them questions for an advisor. They can edit, copy, or print their summary, go back to change answers, or reset the form. It doesn't decide whether someone qualifies for a program.

## How to open it
Open the [live demo](https://pwhiteho-nd.github.io/Healthcare-Pathway-Explorer/). No sign-in is needed. Choose your interests and preferences, then select "See sample pathways" to explore examples and prepare for advising.

## Run the source
Use Node.js 24 and pnpm 10 in Replit or Linux.

```sh
pnpm install --frozen-lockfile
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/healthcare-pathway-explorer run dev
```

Open `http://localhost:5173`. In Replit, the existing Healthcare Pathway Explorer web workflow supplies the port and base path; use its Preview pane instead.

The prototype is frontend-only. No account, database, API server, AI key, or paid service is needed. Shared API/database scaffolding is included to keep the existing workspace configuration complete, but the worksheet doesn't use it.

To check the source:

```sh
pnpm --filter @workspace/healthcare-pathway-explorer run typecheck
node --test artifacts/healthcare-pathway-explorer/src/lib/pathway-logic.test.ts
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/healthcare-pathway-explorer run build
```

The pathway records, matching rules, validation, and summary/question templates are in `artifacts/healthcare-pathway-explorer/src/lib/pathway-logic.ts`. The form and results page are in `src/pages/home.tsx` in that same app folder. The tests cover typical inputs, the peer-feedback challenge, unknown costs/locations, invalid inputs, Unsure, TEAS-neutral matching, and advisor-summary safeguards.

## Build for GitHub Pages
Use the same Node.js 24 and pnpm 10 setup:

```sh
pnpm install --frozen-lockfile
PORT=5173 BASE_PATH=/Healthcare-Pathway-Explorer/ pnpm --filter @workspace/healthcare-pathway-explorer run build
touch artifacts/healthcare-pathway-explorer/dist/public/.nojekyll
```

Put only the contents of `artifacts/healthcare-pathway-explorer/dist/public` at the root of `gh-pages`, including `.nojekyll`. Don't copy source files, attachments, secrets, or local Git history.

In the repository's Settings > Pages, choose **Deploy from a branch**, **gh-pages**, and **/(root)**, then save. The source stays on `main`; verify the published link after each deployment.

## How AI is used
Eventually, AI would help make sense of what a student writes and explain how real programs fit their goals. Right now, that part is simulated using preset rules and responses. There is no live AI connection.

The form, matching, error messages, and editable summary work. The five pathways and their formats, training times, and schedules are made-up examples. Real schools, locations, costs, requirements, and sources haven't been added yet. Missing information is marked unknown and is never treated as meeting a constraint. Discussion options are ordered by shared interests and then fewer explicit conflicts; the first option is not necessarily feasible. Specific conflicts and unknowns remain in the advisor summary. Anything typed in the optional interests box is included in the summary but isn't used to choose pathways.

The app labels these limitations as **Sample data—not verified programs** and **Simulated AI — rules/templates only; no live AI**.

This is a student prototype, not an official ATI, NHA, or university product.

## Revision evidence
See [revision.md](revision.md) for the three priority changes, anonymous peer-feedback decisions, before/after comparison, test results, risk response, limitations, and next priorities. See the [draft AI-use disclosure](ai-use-disclosure.md) for tools, prompt excerpts, human corrections, and product AI status.

## Demo Video
Recording pending. This milestone is not ready to submit until my narrated 2–3 minute video is recorded, shared with the instructors, and linked here. [Recording notes and submission checklist](demo-walkthrough.md).

## Known limitations
1. **The programs are examples.** They can't confirm real costs or locations yet. My next step would be to add a small set of verified programs in the South Bend area.
2. **AI is simulated.** It doesn't understand written answers yet. I want to test whether real AI explanations would help more than the current preset responses, using verified program information.
3. **Answers aren't saved.** Refreshing or resetting clears the form and summary edits. Students can copy or print the summary, and I need to see whether that's enough for an advising meeting.
