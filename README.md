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

## Setup
1. Dependencies installation:
   ```bash
   npm install
   ```
2. Local env file creation:
   ```bash
   copy .env.example .env.local
   ```
3. Environment values setup in `.env.local`:
   - `RESEND_API_KEY=...`
   - `EMAIL_FROM=Leadership Tool <reports@yourdomain.com>`
4. Local run:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).
