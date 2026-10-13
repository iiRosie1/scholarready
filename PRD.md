# ScholarReady Product Requirements Document

## 1. Executive Overview & Personas



### 1.1 Product purpose

ScholarReady is a scholarship eligibility and application-preparation workspace for undergraduate students. It helps a student create an academic and activity profile, discover fictional scholarships, understand why each opportunity may or may not match, compare requirements, organize evidence, and track readiness and deadlines in one place.

ScholarReady supports planning; it does not predict awards, guarantee success, or imply that payment improves scholarship outcomes.

### 1.2 Problem and value proposition

Scholarship information is often fragmented across websites and expressed through complex eligibility rules. Students may miss relevant opportunities or deadlines and may not know which supporting materials are incomplete. ScholarReady turns that fragmented process into a transparent workflow:

1. Create an account.
2. Complete a student profile.
3. Review relevant scholarship matches.
4. See a plain-language eligibility explanation.
5. Compare selected scholarships.
6. Track evidence and application requirements.
7. Monitor deadlines and readiness until submission-ready.



### 1.3 Personas

**Primary persona - Undergraduate applicant**

- Wants relevant opportunities without reviewing every listing manually.
- Needs clear explanations of qualifying and missing criteria.
- Needs one place for deadlines, evidence, notes, and checklist progress.
- Values privacy, clarity, and a reassuring interface.

**Secondary persona - Scholarship adviser**

- Helps students understand requirements and prepare applications.
- In the MVP, can use the demonstration experience but has no separate adviser account or student-management portal.

**Future personas - School/university and scholarship provider**

- May license the product or manage opportunities after the MVP.
- Multi-tenant administration and provider tools are explicitly deferred.



### 1.4 Revenue model

- **Free basic tier:** profile, fictional scholarship discovery, matching explanations, comparison, and basic application tracking.
- **Seasonal premium concept:** additional planning and organization tools during application periods.
- **Institutional concept:** school, university, adviser, or provider licensing.
- The MVP pricing page explains these tiers only. It uses no real payment processing and makes no claim that payment affects scholarship outcomes.



### 1.5 MVP success criteria

The MVP succeeds when a new user can securely sign up, complete a profile, receive explainable matches from fictional data, compare scholarships, save one as an application, update evidence/checklist progress, view a readiness indicator and deadline, refresh the browser, and find their data still present.

## 2. Phased Scope Isolation



### 2.1 Phase 1 - Core MVP

The MVP includes:

- Email/password sign-up, sign-in, sign-out, and password reset through Supabase Auth.
- Protected application routes and user-owned persistent data.
- Profile builder for academic and activity information.
- Seeded fictional student and scholarship demonstration data.
- Scholarship list with text search, filters, sorting, and deadline display.
- Deterministic rule-based matching with `eligible`, `possibly eligible`, and `not eligible` states.
- Plain-language explanations showing satisfied, missing, and unknown criteria.
- Side-by-side comparison of up to three scholarships.
- Ability to save a scholarship as an application.
- Evidence tracker using metadata/status records only; actual file upload is deferred.
- Per-application checklist, notes, status, deadline, and automatically calculated readiness percentage.
- Dashboard summaries for match count, upcoming deadlines, and application progress.
- Settings page with account information and a clear sign-out action.
- Pricing page with free, seasonal premium, and institutional concepts; no live checkout.
- Responsive behavior at desktop and mobile widths, optimized primarily for desktop/laptop.
- A user-testing checklist and fictional demo journey.



### 2.2 Phase 2 - Post-launch expansion (deferred)

The following must not be built during the MVP unless every Phase 1 task is complete and the student explicitly approves a scope change:

- Real scholarship feeds, scraping, provider APIs, or claims of comprehensive listings.
- Real payment collection, Stripe Checkout, subscriptions, or webhooks.
- Actual document upload, OCR, document analysis, or cloud-storage management.
- AI-written essays, award prediction, probability scoring, or opaque AI matching.
- Adviser dashboards, provider portals, multi-tenant school accounts, and role-based team seats.
- Email/SMS/push reminders and calendar synchronization.
- Recommendation workflows, collaboration, comments, and application submission to providers.
- Advanced analytics, dark mode, custom avatars, localization, and native mobile apps.



### 2.3 Assumptions and constraints

- All scholarship and demonstration student data is fictional and labeled as such.
- Eligibility is guidance based on entered data, not an official provider decision.
- Dates are stored as ISO dates and presented clearly in the user's locale.
- The assignment prototype is designed for demonstration and user testing, not production use with real scholarship data.
- No secret, service-role key, database password, or real personal data may be committed to GitHub.
- The complete MVP must be buildable and deployable for HK$0 using Cursor's available access, GitHub Free, Supabase Free, and Vercel Hobby. It must not require a paid domain, paid API, paid component library, or credit-card-enabled service.
- Free-tier limits are acceptable for an assignment prototype. The app should use small seeded datasets, efficient queries, and no background jobs so it remains comfortably within those limits.



## 3. Interface & UI Layout



### 3.1 Information architecture and routes


| Route                | Access    | Purpose and key components                                                                                       |
| -------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `/`                  | Public    | Hero, problem/value explanation, core workflow, fictional-data notice, pricing preview, calls to action          |
| `/login`             | Public    | Email/password login, reset-password link, sign-up link, accessible error states                                 |
| `/signup`            | Public    | Account creation, password guidance, privacy notice link, login link                                             |
| `/reset-password`    | Public    | Request and complete the Supabase password-reset flow                                                            |
| `/dashboard`         | Protected | Welcome/profile prompt, match summary, application readiness cards, upcoming deadlines                           |
| `/profile`           | Protected | Academic and activity profile form with saved-state feedback                                                     |
| `/scholarships`      | Protected | Fictional scholarship cards/table, search, filter, sort, eligibility badges and explanations                     |
| `/compare`           | Protected | Desktop-first table comparing up to three selected scholarships                                                  |
| `/evidence`          | Protected | Evidence records grouped by type/status and linked to applications; no binary uploads in MVP                     |
| `/applications/[id]` | Protected | Application status, deadline, checklist, evidence links, notes, readiness calculation                            |
| `/deadlines`         | Protected | Chronological deadline list with urgency labels and application links                                            |
| `/settings`          | Protected | Account email, privacy information, sign out, and MVP account-deletion instructions/action if safely implemented |
| `/pricing`           | Public    | Three transparent plan concepts and test-only/no-payment disclosure                                              |




### 3.2 Navigation

- Public header: logo/name, How it works anchor, Pricing, Log in, Get started.
- Protected desktop shell: sidebar links to Dashboard, Profile, Scholarships, Compare, Evidence, Deadlines, Settings; sign-out is easy to find.
- Mobile/small-screen shell: accessible menu button and stacked content. Desktop comparison may scroll horizontally without clipping content.
- The current route is visually indicated and conveyed programmatically with `aria-current`.



### 3.3 Visual direction

- Clean, reassuring, and academic rather than sales-heavy.
- Strong hierarchy, spacious cards, readable tables, and restrained blue/teal/cream palette.
- Status never relies on color alone; pair color with text and/or an icon.
- Avoid excessive animation, clutter, urgency manipulation, and claims that exploit student anxiety.
- Important public-page value and primary action should appear above a 667px mobile fold where practical.



### 3.4 Core interaction rules

- Profile forms use labels, helper text, validation messages, and saved-state confirmation.
- Matching explanations show each criterion as met, unmet, or unknown.
- Search/filter/sort state has a visible reset action and a useful empty state.
- Comparison accepts no more than three scholarships and makes removal clear.
- Readiness equals completed required checklist items divided by total required checklist items, multiplied by 100 and rounded to the nearest whole number. With zero items, readiness is 0%.
- Deadline urgency is derived from the stored deadline: overdue, due within 7 days, due within 30 days, or later.
- Destructive actions require confirmation and do not silently remove data.



## 4. Technical Stack & Architectural Constraints



### 4.1 Required stack

- **IDE/workflow:** Cursor with single-task execution from `tasklist.md`.
- **Frontend/full stack:** Next.js App Router and TypeScript with strict type checking.
- **Styling:** Tailwind CSS; reusable accessible components may be created locally.
- **Backend/data/auth:** Supabase PostgreSQL, Supabase Auth, and `@supabase/ssr` clients.
- **Version control:** Git and GitHub with meaningful incremental commits.
- **Hosting:** Vercel connected to the GitHub repository.



### 4.1.1 Zero-cost implementation boundary


| Need                      | Free solution used by the MVP                                                                            | Paid dependency avoided                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Coding                    | Cursor access already available to the student                                                           | No additional AI/API subscription required by the app |
| Source control            | GitHub Free repository                                                                                   | No paid GitHub features required                      |
| Web framework             | Open-source Next.js, TypeScript, and Tailwind CSS packages                                               | No commercial template or component kit               |
| Database/auth/reset email | Supabase Free project                                                                                    | No separate paid database or auth provider            |
| Hosting and HTTPS         | Vercel Hobby for this personal, non-commercial student project, using its provided `.vercel.app` address | No paid hosting or custom domain                      |
| Scholarship catalog       | Small fictional seed file/database records                                                               | No paid data feed or scraping service                 |
| Matching                  | Local deterministic TypeScript rules                                                                     | No paid generative-AI or prediction API               |
| Evidence tracking         | Text metadata and statuses                                                                               | No paid file storage or OCR service                   |
| Pricing demonstration     | Static plan cards only                                                                                   | No Stripe account or payment processing needed        |


The prototype is intentionally tiny compared with the current free allowances: eight scholarship records, a small number of test users, no uploaded files, no analytics, no background jobs, and ordinary classroom-demo traffic. If a free-plan quota is reached, reduce demo records rather than adding a paid dependency. The MVP must remain functional without entering payment details. Because a Supabase Free project may pause after inactivity, the student must open and test the live app regularly throughout the assignment's required availability period and restore the project promptly if the dashboard reports it paused.

### 4.2 Architecture rules

- Prefer React Server Components for data reading; use Client Components only for interactive state and forms.
- Use Server Actions or route handlers for trusted mutations and validate all inputs server-side.
- Use Supabase Auth as the single source of identity. Never trust a client-supplied user ID.
- Keep matching logic deterministic, typed, and testable in a dedicated module.
- Keep seeded scholarship data separate from user-owned profile/application data.
- Use database constraints and Row Level Security (RLS) as the final authorization boundary.
- Do not introduce Drizzle, Clerk, Stripe, ImageKit, or a generative-AI API in the MVP; Supabase covers the selected database/auth needs and the remaining services are deferred.



### 4.3 Environment configuration

Local `.env.local` and Vercel environment settings require:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The deployed `NEXT_PUBLIC_SITE_URL` must use the live Vercel origin. `.env.local` must be ignored by Git. A `.env.example` may contain names and safe placeholders only. A Supabase service-role key is not required for normal MVP browser/server flows and must never be exposed to the client.

### 4.4 Matching rules

Each fictional scholarship stores structured eligibility rules. The matcher compares the current profile against active rules:

- All required rules met: `eligible`.
- No required rule failed but one or more profile values are missing: `possibly eligible`.
- At least one required rule failed: `not eligible`.

The output includes a reason for every rule. It is an informational match, not an award prediction or final eligibility decision.

## 5. Database Schema & Entity Design

Supabase Auth owns credentials in `auth.users`. Application tables live in `public`, use UUID primary keys, use `timestamptz` audit fields, and enable RLS.

### 5.1 Tables



#### `profiles`


| Column                     | Type           | Rules                                                      |
| -------------------------- | -------------- | ---------------------------------------------------------- |
| `id`                       | `uuid`         | Primary key; references `auth.users(id)` on delete cascade |
| `full_name`                | `text`         | Required, 1-100 characters                                 |
| `study_level`              | `text`         | Required; MVP value `undergraduate`                        |
| `institution`              | `text`         | Optional                                                   |
| `major`                    | `text`         | Optional                                                   |
| `study_year`               | `smallint`     | Optional; check 1-8                                        |
| `gpa`                      | `numeric(3,2)` | Optional; check 0-4                                        |
| `citizenship_region`       | `text`         | Optional; fictional/demo value only                        |
| `activity_tags`            | `text[]`       | Not null, default empty array                              |
| `financial_need`           | `boolean`      | Optional                                                   |
| `created_at`, `updated_at` | `timestamptz`  | Not null, default current timestamp                        |




#### `scholarships`


| Column                     | Type          | Rules                                       |
| -------------------------- | ------------- | ------------------------------------------- |
| `id`                       | `uuid`        | Primary key, default generated UUID         |
| `slug`                     | `text`        | Unique and required                         |
| `name`, `provider`         | `text`        | Required; explicitly fictional              |
| `summary`                  | `text`        | Required                                    |
| `amount_label`             | `text`        | Required display text; no financial promise |
| `deadline`                 | `date`        | Required                                    |
| `category`, `study_level`  | `text`        | Required                                    |
| `is_featured`              | `boolean`     | Not null, default false                     |
| `created_at`, `updated_at` | `timestamptz` | Not null, default current timestamp         |




#### `eligibility_rules`


| Column           | Type       | Rules                                                                     |
| ---------------- | ---------- | ------------------------------------------------------------------------- |
| `id`             | `uuid`     | Primary key                                                               |
| `scholarship_id` | `uuid`     | References `scholarships(id)` on delete cascade                           |
| `rule_type`      | `text`     | Check against supported deterministic rule types                          |
| `operator`       | `text`     | Check against supported operators such as `gte`, `equals`, `includes_any` |
| `value_json`     | `jsonb`    | Required structured comparison value                                      |
| `explanation`    | `text`     | Required plain-language criterion                                         |
| `is_required`    | `boolean`  | Not null, default true                                                    |
| `sort_order`     | `smallint` | Not null, default 0                                                       |




#### `applications`


| Column                     | Type          | Rules                                               |
| -------------------------- | ------------- | --------------------------------------------------- |
| `id`                       | `uuid`        | Primary key                                         |
| `user_id`                  | `uuid`        | References `auth.users(id)` on delete cascade       |
| `scholarship_id`           | `uuid`        | References `scholarships(id)` on delete cascade     |
| `status`                   | `text`        | Check: saved, preparing, ready, submitted, archived |
| `personal_deadline`        | `date`        | Optional; otherwise use scholarship deadline        |
| `notes`                    | `text`        | Optional, maximum 5,000 characters                  |
| `created_at`, `updated_at` | `timestamptz` | Not null, default current timestamp                 |


Unique constraint: (`user_id`, `scholarship_id`).

#### `application_tasks`


| Column                       | Type          | Rules                                           |
| ---------------------------- | ------------- | ----------------------------------------------- |
| `id`                         | `uuid`        | Primary key                                     |
| `application_id`             | `uuid`        | References `applications(id)` on delete cascade |
| `title`                      | `text`        | Required, 1-160 characters                      |
| `is_required`, `is_complete` | `boolean`     | Not null; defaults true and false respectively  |
| `sort_order`                 | `smallint`    | Not null, default 0                             |
| `completed_at`               | `timestamptz` | Nullable; set only when complete                |
| `created_at`, `updated_at`   | `timestamptz` | Not null, default current timestamp             |




#### `evidence_items`


| Column                     | Type          | Rules                                                                  |
| -------------------------- | ------------- | ---------------------------------------------------------------------- |
| `id`                       | `uuid`        | Primary key                                                            |
| `user_id`                  | `uuid`        | References `auth.users(id)` on delete cascade                          |
| `application_id`           | `uuid`        | Optional; references `applications(id)` on delete cascade              |
| `title`                    | `text`        | Required, 1-160 characters                                             |
| `evidence_type`            | `text`        | Check: transcript, essay, recommendation, certificate, activity, other |
| `status`                   | `text`        | Check: missing, requested, draft, ready                                |
| `document_name`            | `text`        | Optional metadata only; no file upload in MVP                          |
| `notes`                    | `text`        | Optional, maximum 2,000 characters                                     |
| `created_at`, `updated_at` | `timestamptz` | Not null, default current timestamp                                    |




### 5.2 RLS and authorization

- Enable RLS on every public table.
- `profiles`: authenticated users may select, insert, update, and delete only the row where `id = auth.uid()`.
- `applications`: authenticated users may CRUD only rows where `user_id = auth.uid()`.
- `application_tasks`: access is allowed only when the parent application belongs to `auth.uid()`.
- `evidence_items`: authenticated users may CRUD only rows where `user_id = auth.uid()`; any linked application must also belong to that user.
- `scholarships` and `eligibility_rules`: authenticated users may read seeded rows; ordinary users may not insert, update, or delete them.
- Public landing/pricing pages do not require database reads. If public scholarship previews are later added, expose only a deliberately limited view.



### 5.3 Seed data

- Seed at least eight clearly fictional scholarships with varied majors, GPA thresholds, years, activities, need criteria, amounts, and future deadlines.
- Include checklist templates in application-creation logic so a saved application immediately has meaningful requirements.
- Provide a fictional demo profile description in documentation; do not commit a real user's credentials.



## 6. Third-Party API & Payment Boundaries



### 6.1 Supabase

- Supabase provides PostgreSQL, authentication, reset-password email flow, and session handling.
- Configure permitted redirect URLs for localhost and the deployed Vercel domain.
- Use publishable browser credentials only; protect user records with RLS.
- Database migrations and seed scripts are version-controlled, but actual credentials are not.



### 6.2 Vercel and GitHub

- GitHub is the source of truth for version history.
- Vercel builds the production branch and stores deployment environment variables.
- Production deployment must pass `npm run build` and be tested from a signed-out browser session.



### 6.3 Payments

- The MVP has no payment endpoint, checkout session, webhook, credit-card form, or subscription database state.
- Pricing buttons are labeled as prototype concepts or disabled/contact actions.
- Test payments may be considered only as a Phase 2 enhancement; neither test nor real payment setup is required to build, demonstrate, or grade the MVP.



### 6.4 External data and AI

- No real scholarship API, scraped data, or generative-AI service is required.
- Matching is local rule-based logic using fictional records.
- Any future integration must document data provenance, rate limits, error handling, privacy impact, server-only keys, and user-facing limitations before implementation.



## 7. Quality, Accessibility & Compliance Standards



### 7.1 Functional quality and testing

- Each `tasklist.md` item is completed separately and marked `[x]` only after its stated verification gate passes.
- Core automated tests cover matching states, readiness calculation, deadline urgency, and authorization-sensitive data helpers where practical.
- Required manual flows: sign up, sign in, reset request, profile save, match explanation, filter/sort, compare, save application, toggle task, refresh persistence, evidence update, and deadline view.
- `npm run lint`, `npm run test` (when configured), and `npm run build` must pass before deployment.
- Test the live Vercel URL, not only localhost.



### 7.2 Accessibility

- Target WCAG 2.2 Level AA.
- Normal text contrast is at least 4.5:1; large text is at least 3:1.
- All interactive elements work with keyboard alone and have visible focus indicators at least 2 CSS pixels thick.
- Use semantic landmarks, logical heading order, explicit form labels, useful error summaries, and accessible table headers/captions.
- Provide at least 44 by 44 CSS pixel targets where feasible.
- Respect reduced-motion preferences and avoid unnecessary animation.
- Verify at approximately 375px mobile and 1440px desktop widths with no hidden controls or unreadable content.



### 7.3 Security and privacy

- Validate and normalize inputs on the server; escape rendered user content through React defaults.
- Never hardcode secrets or expose a service-role key in client code.
- RLS policies must be tested with two separate users to prove cross-user isolation.
- Use secure Supabase-managed sessions and avoid storing auth tokens in custom local storage.
- Do not log passwords, access tokens, profile details, or evidence notes.
- Collect only MVP-required data and use fictional information for demonstrations.
- Provide a plain-language Personal Information Collection Statement covering purpose, fields collected, storage provider, retention approach, access/correction contact placeholder, and voluntary/required fields, aligned with Hong Kong PDPO principles.
- If non-essential analytics/cookies are later added, obtain consent before activation. The MVP should avoid them.
- Provide an account-erasure path or clear prototype instructions; deletion must cascade through user-owned data.



### 7.4 Trust and content standards

- Display a persistent notice that scholarship and demo data is fictional.
- State that eligibility results are guidance and must be confirmed with the scholarship provider.
- Never state or imply award prediction, guaranteed success, or better outcomes for paying users.
- Use supportive, neutral wording rather than pressure or fear.



### 7.5 Definition of done

The MVP is done only when:

- The complete core workflow in Section 1.5 works with persistent user-owned data.
- All required pages load without uncaught errors and protected routes reject signed-out access.
- Fictional data, eligibility limitations, and pricing limitations are clearly labeled.
- RLS isolation is verified using two users.
- Core logic tests, linting, and production build pass.
- Desktop and mobile accessibility checks find no critical blockers.
- The GitHub repository contains meaningful commits, no secrets, and current documentation.
- The Vercel deployment is publicly reachable and its major flows are re-tested.
- A user-testing checklist and the deferred enhancement list are included for handoff.
- The live MVP works on the documented free plans with no paid API, subscription, custom domain, or payment method required.
- The live app has been checked regularly throughout the required post-submission availability period so its free Supabase project has not remained paused.

