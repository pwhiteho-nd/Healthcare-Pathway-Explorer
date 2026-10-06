# Healthcare Pathway Explorer

This is my first prototype for helping students who don't get into nursing but still want to work in healthcare explore other options and prepare for an advisor conversation.

## What it does
Students choose their interests and preferences for training time, schedule, learning format, budget, and location. They can choose Unsure if they haven't decided. The app shows sample pathways, explains what fits or doesn't fit, and gives them questions for an advisor. They can edit, copy, or print their summary, go back to change answers, or reset the form. It doesn't decide whether someone qualifies for a program.

## How to open it
Open the [Replit project](https://replit.com/@pwhiteho/Healthcare-Pathway-Explorer) and use the Preview pane. I still need to check that the prototype link opens for other people before submitting.

## How AI is used
Eventually, AI would help make sense of what a student writes and explain how real programs fit their goals. Right now, that part is simulated using preset rules and responses. There is no live AI connection.

The form, matching, error messages, and editable summary work. The five pathways and their formats, training times, and schedules are made-up examples. Real schools, locations, costs, requirements, and sources haven't been added yet. Missing information isn't treated as a match. Anything typed in the optional interests box is included in the summary but isn't used to choose pathways.

This is a student prototype, not an official ATI, NHA, or university product.

## Three test cases
Replit Agent ran these tests and reported the results below. Codex also checked the main flow and empty-input message in Safari. These results are from before the blue-and-gold design update, so they still need to be checked again afterward.

| Test | What was entered | What happened | Result |
| --- | --- | --- | --- |
| Typical | Patient care, in person, up to 12 months, weekday daytime; budget and location unsure | One sample pathway appeared with reasons it fit, reasons other options didn't, advisor questions, and an editable summary. | Pass |
| Challenge | Patient care, online, up to 12 months, evenings/weekends | Replit reported no matches. The app explained why and gave advisor questions without changing the student's choices. | Pass, reported by Replit |
| Empty | No interest selected; everything else left unsure | The app asked the student to choose an interest or Unsure before continuing. | Pass |

## Known limitations
1. **The programs are examples.** They can't confirm real costs or locations yet. My next step would be to add a small set of verified programs in the South Bend area.
2. **AI is simulated.** It doesn't understand written answers yet. I want to test whether real AI explanations would help more than the current preset responses, using verified program information.
3. **Answers aren't saved.** Refreshing or resetting clears the form and summary edits. Students can copy or print the summary, and I need to see whether that's enough for an advising meeting.

## Still to finish
I still need to add the project files to GitHub, check that the prototype link opens for other people, and rerun the three tests after the design update.
