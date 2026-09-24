# Rehab Copilot

An AI assistant for physiotherapists: from history-taking
to diagnostic hypotheses and rehabilitation planning.

English | [Українська](README.uk.md)

## Overview

Rehab Copilot is being developed to support physiotherapists
during the assessment of people with musculoskeletal complaints.

The application aims to help collect patient history, clarify
symptoms, select functional tests, interpret findings, and
develop reasoned diagnostic hypotheses.

Based on the collected information, the assistant will suggest
relevant clinical guidelines, protocols where available, and
a draft rehabilitation plan with source references.

## Who It Is For

Physiotherapists and physiotherapy students who want a structured
approach to assessment and clinical reasoning.

The first version is intended exclusively for fictional
educational cases.

## Planned Workflow

1. The clinician creates a case and records symptoms,
   patient history, and personal goals.
2. The assistant suggests follow-up questions and identifies
   missing information.
3. The assistant flags potential signs that warrant
   medical referral.
4. The assistant suggests functional tests and measurements,
   explaining their purpose and limitations.
5. The clinician selects assessments and records the results.
6. The assistant proposes diagnostic hypotheses with supporting
   reasoning, uncertainty, and questions for further assessment.
7. The assistant suggests treatment and rehabilitation approaches
   for the clinician to consider within their scope of practice.
8. The clinician checks the sources, edits, and approves
   the final plan.

## First Release

The first complete workflow will cover the initial assessment
of an adult with low back pain using fictional data.

Two modes are planned:

- **AI mode** — language model responses supported by retrieval
  from selected reference sources.
- **Demo mode** — clearly labeled, prewritten responses
  without requiring a paid API.

Support for other musculoskeletal regions will be added
incrementally.

## Intended Use and Limitations

Rehab Copilot supports the development and review of hypotheses.
It does not independently establish a definitive diagnosis
or prescribe treatment.

The educational version has not been clinically validated
and is not intended for managing real patients.
Do not enter personal or medical data belonging to real people.

AI responses and references require verification.
The absence of a warning does not guarantee the absence of risk.

## Planned Technology Stack

- **Node.js + TypeScript** — main backend and API.
- **Python** — AI integration, retrieval-augmented generation
  (RAG), and response evaluation.
- **HTML/CSS/JavaScript** — web interface.
- **SQLite** — case storage.
- **Rust** — calculations of changes in pain and function measures.
- **GitHub Actions** — automated checks.
- **Docker** — reproducible execution.

## Project Status

Early development. The capabilities described above are planned
and have not yet been implemented.

This project is being built as a developer portfolio project
with assistance from AI tools for writing and reviewing code.