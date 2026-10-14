# ScholarReady

ScholarReady is a Next.js App Router prototype for scholarship discovery and application preparation. The catalog and student examples are fictional and intended for demonstration and user testing.

## Local setup

Requirements:

- Node.js 20+
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment configuration

Copy the safe template before connecting Supabase:

```bash
cp .env.example .env.local
```

Then add values only to `.env.local` on your own machine. The required variables are:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.local` is ignored by Git and must never be committed. Do not add a Supabase service-role key, database password, real personal data, or any other secret to the repository. The deployed `NEXT_PUBLIC_SITE_URL` should use the live Vercel origin.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

The current frontend uses fictional demo data. Supabase authentication, persistence, migrations, and Row Level Security are added in later MVP tasks.

## Zero-cost implementation boundary

ScholarReady is designed to run without payment details for this assignment:

- **Source control:** GitHub Free repository.
- **Database, authentication, and reset email:** Supabase Free project.
- **Hosting and HTTPS:** Vercel Hobby with its free `.vercel.app` address; a custom domain is not required.
- **Application packages:** open-source Next.js, React, TypeScript, Tailwind CSS, and ESLint packages only.
- **Catalog and matching:** local fictional records and deterministic TypeScript rules, without a paid data feed, scraping service, generative-AI API, or prediction API.
- **Evidence tracking:** text metadata and statuses only, without paid file storage or OCR.
- **Pricing:** static plan information only; no checkout or payment processing.

The product intentionally does not require or integrate paid GitHub features, a commercial template or component kit, a paid database or authentication provider, paid hosting, a custom domain, Stripe, Drizzle, Clerk, ImageKit, paid analytics, background-job infrastructure, or any billing-enabled API. If a free-plan quota is reached, reduce seeded records or test traffic rather than adding a paid dependency.
