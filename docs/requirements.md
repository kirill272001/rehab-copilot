# Requirements

## First-Release Scope

The first release supports fictional adult low back pain cases.
All AI-generated suggestions require clinician review.

## Initial Milestone

Create, save, list, and reopen educational cases without AI integration.

## User Stories

### US-001 — Create and save a case

As a physiotherapist, I want to create and save an educational case
with symptoms and patient history so that I can reopen it
and add assessment findings.

## Case Fields

| Field           | Required | Validation                       |
| --------------- | -------- | -------------------------------- |
| Title           | Yes      | 1–100 characters after trimming  |
| Age             | Yes      | Integer from 18 to 120           |
| Symptoms        | Yes      | 1–3000 characters after trimming |
| Patient history | Yes      | 1–5000 characters after trimming |

Only fictional data is permitted.
Real names and contact details are not required.

The system assigns a unique ID and creation timestamp
to each saved case.

## Acceptance Criteria

### US-001 — Create and save a case

1. Valid input creates exactly one case with a unique ID
   and creation timestamp.
2. Text fields are trimmed before validation and storage.
3. Empty or whitespace-only required fields prevent creation.
4. An age outside 18–120 or a non-integer age prevents creation.
5. Text exceeding the defined limits prevents creation.
6. Validation errors identify the invalid fields,
   and the form retains the entered values.
7. The backend validates input independently of the interface.
8. A success message is shown only after storage succeeds.
9. A saved case remains available after a server restart.

### US-002 — List cases

As a physiotherapist, I want to see saved educational cases
so that I can select a case to continue working on.

1. The list shows the title, age, and creation timestamp.
2. Cases are ordered by creation timestamp, newest first.
3. If there are no cases, the interface displays an empty state.
4. Selecting a case opens its details.

### US-003 — Open a case

As a physiotherapist, I want to reopen a saved educational case
so that I can review the previously recorded information.

1. The details show the saved title, age, symptoms,
   patient history, ID, and creation timestamp.
2. Opening a case does not change its saved data.
3. An unknown case ID returns a not-found response.
4. A storage failure is displayed as an error,
   rather than as an empty list or a missing case.

## Planned Assessment Workflow

1. Create or open a fictional case.
2. Record symptoms, patient history, and personal goals.
3. Review follow-up questions and potential referral warnings.
4. Select suggested assessments and record their results.
5. Review diagnostic hypotheses, reasoning, and uncertainty.
6. Review relevant sources and a draft rehabilitation plan.
7. Edit and approve the final summary.

AI features are implemented after the initial
case-management milestone.

## Out of Scope for the First Release

- Real patient data and clinical use.
- Children and complaints outside adult low back pain.
- Autonomous diagnosis or treatment decisions.
- User accounts and multi-user access.
