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
