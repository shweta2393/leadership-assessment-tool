# Leadership Assessment Tool

Full-stack Next.js app that runs a 9-question leadership self-assessment, computes dimension and overall scores, shows results immediately, and emails a professional HTML report with a PDF attachment.

**Live Demo:** https://leadership-assessment-tool-olive.vercel.app/ 
**GitHub Repo:** https://github.com/shweta2393/leadership-assessment-tool
**Submission Date:** 7th May 2026


## 1. Code Structure Brief
Monorepo Next.js App Router. Split into layers so business logic isn't tied to UI:

- **UI layer** `app/ + components/` : Form rendering, client states, results screen
- **Domain layer** `lib/domain/` : Config, scoring, feedback - pure functions, testable
- **Service layer** `lib/services/` : PDF via `@sparticuz/chromium` + Resend email
- **API layer** `app/api/assessments/route.ts` : Validate → Score → PDF → Email

Key files: `app/page.tsx`, `app/api/assessments/route.ts`, `lib/domain/scoring.ts`

## 2. Scoring Logic
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

## 3. Email Service Choice: Resend
**Why Resend over SendGrid/Mailgun:**
1. **Vercel-native**: Works in serverless without extra config
2. **Simple API**: `resend.emails.send()` with attachments in 3 lines
3. **Free tier**: 3k emails/month covers assessment + demos
4. **Modern DX**: TypeScript-first, fits Next.js stack

**Trade-off**: Free tier requires `onboarding@resend.dev` sender. Production would use verified domain `reports@yourdomain.com`. API key backend-only via `lib/server/env.ts`, never exposed to browser.

## 4. AI Assistance Disclosure
AI assistance was used for:

- scaffolding the initial Next.js project structure,
- drafting/refining implementation code for form/API/scoring/service layers,
- generating and polishing README documentation.

All generated code was then integrated, reviewed, and validated locally using `npm run lint` and `npm run build`.

## Tech Stack
Next.js 15 + TypeScript + Tailwind CSS + Vercel Serverless + Resend + Puppeteer Core + Zod

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
2. Set `RESEND_API_KEY` and `EMAIL_FROM` in Vercel project environment variables. ["Emails sent via onboarding@resend.dev for assessment purposes due to Resend free tier limitations.]
3. PDF generation on Vercel uses `@sparticuz/chromium` with `puppeteer-core` so no manual Chrome install is required.
4. Deploy.
5. Use deployed frontend URL and submit the form to hit live backend and send live email.

If you test locally and need to target a specific browser binary, set `PUPPETEER_EXECUTABLE_PATH` in `.env.local`.

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

## What I would improve with more time

- Add persistent storage for submissions and delivery history (DB + admin view).
- Add automated tests (unit tests for scoring/schema, integration tests for API).
- Add retry queue/circuit-breaker for transient email outages.
- Make PDF branding more polished and template-driven.
- Add authenticated admin analytics (dimension trends over time).
- Add true branching question logic and versioned assessment definitions.