# Leadership Assessment Tool

Full-stack Next.js app that runs a 9-question leadership self-assessment, computes dimension and overall scores, shows results immediately, and emails a professional HTML report with a PDF attachment.

## Tech choices

- **Monorepo in one Next.js app**: frontend (`app/page.tsx`) and backend (`app/api/assessments/route.ts`) are deployed together.
- **Email provider: Resend**: straightforward API for transactional email and attachments.
- **PDF library: Puppeteer**: chosen because it renders HTML/CSS to polished PDFs, which makes report styling easy to evolve without hand-building low-level PDF drawing logic.
- **Validation: Zod**: strong schema-based validation both on client and server.

## Features

- 3 dimensions, 9 questions (1-5 Likert scale) generated from centralized config.
- Score per dimension + overall score + Low/Medium/High banding.
- Personalized feedback paragraph for each dimension.
- API posts raw answers and computed outputs in a clean JSON flow.
- Live email delivery with attached PDF report.
- Robust edge-case handling:
  - incomplete forms
  - invalid emails
  - duplicate submits (idempotency key + pending guard)
  - email provider outages (returns scores even if email fails)
- Secrets are backend-only (`RESEND_API_KEY` is never sent to browser code).

## Project structure

- `app/page.tsx`: assessment form screen
- `app/results/page.tsx`: results screen after submit
- `app/api/assessments/route.ts`: backend endpoint (validate, score, PDF, email)
- `components/`: form and result UI components
- `lib/domain/`: extensible assessment config, types, scoring, feedback
- `lib/validation/`: schema validation
- `lib/services/`: PDF + email services and templates
- `lib/server/`: server-only env and idempotency helpers

## How the code is structured

I split the app into layers so business logic is not tied to the UI:

- **UI layer (`app/` + `components/`)**: rendering form/questions/results and handling client submit states.
- **Domain layer (`lib/domain/`)**: question/dimension config, score types, score calculation, and feedback mapping.
- **Validation layer (`lib/validation/`)**: request schema and field-level constraints.
- **Service layer (`lib/services/`)**: integrations for PDF generation and email sending.
- **Server helpers (`lib/server/`)**: idempotency and env access (`server-only`) to protect secrets.

This allows extending dimensions/questions with minimal code changes (mostly config updates), and keeps scoring/email logic testable in isolation.

## Scoring logic

- The assessment uses three dimensions with three questions each.
- Each answer is a 1-5 integer.
- Per dimension, score is the average of its 3 answers (rounded to 2 decimals).
- Overall score is the average of all dimension scores (rounded to 2 decimals).
- Band thresholds are:
  - `Low`: `<= 2.5`
  - `Medium`: `<= 3.8`
  - `High`: `> 3.8`
- Feedback text is chosen by dimension + band from centralized config.

Implementation lives in `lib/domain/scoring.ts` and `lib/domain/assessmentConfig.ts`.

## Email service choice and why

I chose **Resend** because:

- It has a simple developer API for transactional email.
- Attachments are straightforward (used for the generated PDF report).
- Integration with server-side JavaScript is fast and clean.
- It works well with modern deployments like Vercel.

The API key is read only on the backend via `lib/server/env.ts`; it is never exposed to browser code.

## What I would improve with more time

- Add persistent storage for submissions and delivery history (DB + admin view).
- Add automated tests (unit tests for scoring/schema, integration tests for API).
- Add retry queue/circuit-breaker for transient email outages.
- Make PDF branding more polished and template-driven.
- Add authenticated admin analytics (dimension trends over time).
- Add true branching question logic and versioned assessment definitions.

## AI assistance disclosure

AI assistance was used for:

- scaffolding the initial Next.js project structure,
- drafting/refining implementation code for form/API/scoring/service layers,
- generating and polishing README documentation.

All generated code was then integrated, reviewed, and validated locally using `npm run lint` and `npm run build`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create local env file:
   ```bash
   copy .env.example .env.local
   ```
3. Set environment values in `.env.local`:
   - `RESEND_API_KEY=...`
   - `EMAIL_FROM=Leadership Tool <reports@yourdomain.com>`
4. Run locally:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Import repo into Vercel.
2. Set `RESEND_API_KEY` and `EMAIL_FROM` in Vercel project environment variables.["Emails sent via onboarding@resend.dev for assessment purposes due to Resend free tier limitations.]
3. Deploy.
4. Use deployed frontend URL and submit the form to hit live backend and send live email.

## Extend the assessment

- Add or edit dimensions/questions in `lib/domain/assessmentConfig.ts`.
- Update threshold rules in the same config.
- Add branching or alternate scoring by extending `lib/domain/scoring.ts` without changing API/UI contracts.

## Verification checklist

- Happy path: valid submission sends email + PDF and shows results screen.
- Invalid email: blocked with clear field error.
- Incomplete answers: blocked on client and validated again on server.
- Rapid double-click submit: duplicate prevented.
- Email service down: API still returns computed scores, and UI shows email failure clearly.
