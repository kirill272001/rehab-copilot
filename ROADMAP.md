# Project Roadmap

Rehab Copilot is developed incrementally, starting with fictional
adult low back pain cases.

## Milestones

- [x] RC-001 — Prepare the environment, Git repository, and bilingual README.
- [x] RC-002 — Publish the repository and document the development workflow.
- [x] RC-003 — Define requirements, the assessment workflow, and acceptance criteria.
- [x] RC-004 — Set up the Node.js + TypeScript server and health endpoint.
- [ ] RC-005 — Implement case creation, storage, and retrieval with SQLite.
- [ ] RC-006 — Build the interface for creating, listing, and opening cases.
- [ ] RC-007 — Add structured history-taking forms.
- [ ] RC-008 — Implement demo mode with clearly labeled prewritten responses.
- [ ] RC-009 — Connect the Python service to a language model API.
- [ ] RC-010 — Implement retrieval from selected sources and source references.
- [ ] RC-011 — Add follow-up questions and potential referral warnings.
- [ ] RC-012 — Suggest functional tests and record assessment results.
- [ ] RC-013 — Generate diagnostic hypotheses with reasoning and uncertainty.
- [ ] RC-014 — Generate source-supported draft rehabilitation plans.
- [ ] RC-015 — Evaluate AI responses using fictional assessment scenarios.
- [ ] RC-016 — Add the Rust module for changes in pain and function measures.
- [ ] RC-017 — Add Docker and automated GitHub checks.
- [ ] RC-018 — Prepare documentation, demo data, and release v0.1.0.

Tests are added alongside implementation. RC-015 focuses on
evaluating AI response quality.

## Development Workflow

1. Create an Issue with a goal and acceptance criteria.
2. Create a branch for the task.
3. Implement the changes.
4. Verify the result and run relevant tests.
5. Commit and push the changes.
6. Open a Pull Request linked to the Issue.
7. Review the changes and address feedback.
8. Merge the Pull Request and update local main.

A milestone is complete when its acceptance criteria are met
and its changes are merged.

## Current Focus

We are currently working on RC-004.
The next deliverable is a reviewed TypeScript HTTP server
with a health endpoint and local startup instructions.