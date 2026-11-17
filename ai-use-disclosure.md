# Draft AI-use disclosure

I already had the problem and capstone context before this project. I used ChatGPT Codex to help organize the work around the assignment, revise the prototype, write tests, and draft the documentation. The existing Replit prototype was built with help from Replit Agent and Codex.

Representative excerpts from my actual prompts:
- “go fix up my whole thing then for gen ai only for the project prototype revision. go do it according to rubric and also what the notion page says” — Codex used the assignment and feedback to focus the revision and prepare code, tests, and documentation.
- “But, like, other stuff, that's how I write.” — I asked for changes that improve the substance without replacing my voice.
- “This is a direction to test, not a solution my interviews have already validated.” — I supplied this boundary so the project wouldn't overstate the interview evidence.

A correction I made was clarifying that ATI cannot directly identify rejected nursing applicants and that a TEAS score cannot tell us admission status. That matters because the prototype should help students explore, not label them or decide whether they qualify.

For this revision, the implementation adapts the peer suggestion to always recommend a path: options are ordered for discussion, with conflicts and missing information kept visible. It does not force a recommendation. Codex proposed and implemented that approach; I still need to review the final experience myself.

Codex ran automated checks of the rules and summary output, including two typical inputs, a peer-feedback challenge, invalid inputs, uncertainty, and a risk case. These checks do not establish student usefulness or live-model accuracy. Student/advisor review and verification of real program data remain necessary.

In the product itself, AI is simulated. Inputs are selected interests, format, training time, budget, region, and schedule. Rules compare those choices with five fictional examples. Templates output reasons, conflicts, unknowns, and advisor questions. The optional note is copied to the summary, not interpreted. There is no model call, AI API key, or admission decision. A future model would need verified sources and tests for unsupported claims and inappropriate tradeoffs.
