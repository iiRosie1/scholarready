# ScholarReady Sequential MVP Task List

## Execution rules

1. Read `PRD.md` and this file before every coding turn.
2. Select strictly the first pending item marked `- [ ]`.
3. Implement only that item; do not modify unrelated features.
4. Run its verification gate and record relevant evidence in the commit or development notes.
5. Mark the item `- [x]` only after the gate passes, then stop for student review.
6. Never place real credentials, personal data, or Supabase service-role keys in Git.
7. Keep the entire MVP at HK$0: use only open-source packages and the free plans of GitHub, Supabase, and Vercel; do not add any service that requires payment details.
8. When finishing every module, pause so user can do testing before giving permission to proceed. Let user know what features have been added and what to test. Please start with the front-end before doing back-end stuff.



## Module 1 - Environment and project foundation

- [x] **1.1 Create the Next.js project foundation.** Initialize the App Router project with TypeScript strict mode, Tailwind CSS, ESLint, a `src` directory, and the `@/`* alias.
  **Verification Gate:** Run `npm run dev`; confirm the home route opens at `http://localhost:3000` without terminal or browser-console errors, then stop the server.

- [ ] **1.2 Add the standard quality scripts.** Add scripts for `lint`, `test` (using the chosen lightweight test runner), and `build`, plus only the packages needed by the current architecture.
  **Verification Gate:** Run `npm run lint`, the empty/smoke `npm run test`, and `npm run build`; all three commands must exit successfully.

- [ ] **1.3 Protect configuration files.** Confirm `.env`* secrets are ignored, create `.env.example` with the three variable names from `PRD.md`, and document local setup without including values.
  **Verification Gate:** Run `git check-ignore .env.local` and inspect `.env.example`; `.env.local` must be ignored and no real secret may appear in tracked changes.

- [ ] **1.4 Confirm the zero-cost dependency boundary.** Add a short README cost section listing GitHub Free, Supabase Free, Vercel Hobby, open-source packages, the free `.vercel.app` address, and every intentionally omitted paid integration.
  **Verification Gate:** Inspect the package list and setup instructions; the MVP must require no paid package, commercial asset, custom domain, billing-enabled API, or payment method.

- [ ] **1.5 Create the shared visual foundation.** Define color, spacing, typography, focus-ring, status, and container styles in the global stylesheet/Tailwind theme.
  **Verification Gate:** Render a small style-sample on the home route and manually confirm readable type, visible 2px keyboard focus, and no horizontal overflow at 375px and 1440px.

- [ ] **1.6 Create shared layout components.** Build public header/footer and protected desktop-sidebar/mobile-menu shells with semantic landmarks and current-route states.
  **Verification Gate:** Run the local server and keyboard through every navigation control at 375px and 1440px; focus order, labels, active state, menu close behavior, and overflow must be correct.



## Module 2 - Supabase database provisioning

- [ ] **2.1 Create and connect the Supabase project.** Create the project manually, add only the project URL and publishable key to `.env.local`, and add localhost/auth redirect settings.
  **Verification Gate:** Start the app and run a server-side connection health check; confirm a successful response without printing either credential.

- [ ] **2.2 Add typed Supabase clients.** Create separate browser and server client utilities using `@supabase/ssr`, with cookie handling suitable for the Next.js App Router.
  **Verification Gate:** Run `npm run build` and a small server/client connection smoke test; confirm zero TypeScript errors and no service-role key in the client bundle or tracked files.

- [ ] **2.3 Create the** `profiles` **migration.** Add the exact columns, checks, timestamps, primary/foreign key, and update behavior defined in `PRD.md`.
  **Verification Gate:** Apply the migration to the development database, inspect the table definition, and insert then delete one fictional row through a safe test transaction.

- [ ] **2.4 Create the scholarship catalog migration.** Add `scholarships` and `eligibility_rules` with supported rule/operator constraints and cascading foreign key.
  **Verification Gate:** Apply the migration and inspect both table definitions; an invalid rule/operator insert must fail and deleting a test scholarship must remove its test rules.

- [ ] **2.5 Create the application-tracking migration.** Add `applications`, `application_tasks`, and `evidence_items` with checks, uniqueness, ownership fields, and cascading relationships.
  **Verification Gate:** Apply the migration; confirm duplicate user/scholarship applications and invalid statuses fail, while deleting a test application removes its tasks and linked evidence.

- [ ] **2.6 Enable and define Row Level Security.** Add the select/mutation policies from `PRD.md` for all six public tables.
  **Verification Gate:** Using two test users, prove user A cannot select, update, or delete user B's profile, applications, tasks, or evidence; confirm both can read seeded scholarships/rules but cannot change them.

- [ ] **2.7 Seed fictional catalog data.** Add a repeatable seed script for at least eight labeled fictional scholarships and varied rules, all with future demonstration deadlines.
  **Verification Gate:** Run the seed twice; confirm no duplicates, at least eight scholarships exist, every scholarship has at least one rule, and all visible records are labeled fictional.

- [ ] **2.8 Generate application database types.** Generate TypeScript types from the final development schema and commit the generated type file.
  **Verification Gate:** Run `npm run build`; database reads/writes must type-check without `any` casts added solely to bypass schema errors.



## Module 3 - Authentication and protected routes

- [ ] **3.1 Implement the sign-up route.** Build `/signup` with labeled fields, password guidance, validation, privacy/PICS acknowledgement, Supabase sign-up, and useful success/error messages.
  **Verification Gate:** Create a new test account using only fictional details; confirm expected validation, auth-user creation, keyboard operation, and no password/token logging.

- [ ] **3.2 Implement the login route.** Build `/login` with accessible errors, sign-up/reset links, and safe post-login navigation to `/dashboard`.
  **Verification Gate:** Test one correct and one incorrect login; the correct account reaches the dashboard, the incorrect attempt shows a neutral inline error, and the browser console stays clean.

- [ ] **3.3 Implement auth session refresh and route protection.** Add the supported Supabase middleware/proxy session refresh and redirect signed-out users away from protected routes.
  **Verification Gate:** In a private browser session, request every protected route directly and confirm redirect to login; sign in, refresh twice, and confirm the session remains valid.

- [ ] **3.4 Implement sign-out.** Connect all sign-out controls to Supabase and clear the session before returning to the public site.
  **Verification Gate:** Sign out from the protected shell, use the browser Back button, and confirm protected content cannot be viewed without logging in again.

- [ ] **3.5 Implement password reset.** Build reset-request and password-update states and configure only the approved localhost/Vercel redirect origins.
  **Verification Gate:** Request a reset for a test account, follow the received development link, set a new password, and confirm only the new password logs in.



## Module 4 - Profile and matching engine

- [ ] **4.1 Build the profile form UI.** Create `/profile` with the defined academic fields, activity tags, validation, required/optional indicators, and fictional-data guidance.
  **Verification Gate:** At 375px and 1440px, keyboard through the form and trigger each validation state; labels, error associations, focus movement, and layout must be correct.

- [ ] **4.2 Persist the user's profile.** Add a server-validated profile upsert tied only to `auth.uid()` and show loading, success, and failure feedback.
  **Verification Gate:** Save a fictional profile, refresh and sign in again; all saved values must return. Try an out-of-range GPA/year and confirm server rejection.

- [ ] **4.3 Create the pure rule-matching module.** Implement typed evaluation for the MVP's supported rules and output `eligible`, `possibly eligible`, or `not eligible` with a reason for every criterion.
  **Verification Gate:** Run unit tests covering every operator, missing profile data, all-rules-met, one-rule-failed, and optional-rule behavior; all tests must pass.

- [ ] **4.4 Create the readiness and deadline utilities.** Implement zero-safe readiness percentage and overdue/7-day/30-day/later urgency calculations.
  **Verification Gate:** Run boundary tests for zero tasks, partial/all completion, exact date boundaries, and an overdue date using a fixed clock; all tests must pass.



## Module 5 - Scholarship discovery and comparison

- [ ] **5.1 Build the scholarship matches route.** Render seeded fictional scholarships on `/scholarships` with deadline, amount label, category, match state, and an incomplete-profile prompt.
  **Verification Gate:** Test with complete and incomplete fictional profiles; every card must show the correct state, the fictional-data notice, and no uncaught loading/error state.

- [ ] **5.2 Add eligibility explanations.** Display each scholarship's met, unmet, and unknown criteria with plain-language limitations.
  **Verification Gate:** Compare UI explanations against matcher unit-test fixtures for one scholarship in each state; every criterion and limitation must agree with the computed result.

- [ ] **5.3 Add search, filters, sorting, and empty/reset states.** Support name/provider search, category and eligibility filters, and deadline/amount/name sorting without changing stored data.
  **Verification Gate:** Exercise each control alone and in combination; confirm expected results, stable sorting, a useful zero-results state, and a working Reset action.

- [ ] **5.4 Add compare selection controls.** Let a user add/remove up to three scholarships and navigate to `/compare`, preserving selection for the current browser session.
  **Verification Gate:** Attempt zero through four selections; the UI must require at least two for meaningful comparison, cap selection at three, and explain the cap accessibly.

- [ ] **5.5 Build the comparison table.** Compare selected scholarship deadlines, award labels, eligibility states, and criteria side by side with remove/back actions.
  **Verification Gate:** Audit the table at 1440px and 375px; headers/caption must be announced correctly, all data must remain accessible, and narrow layouts may scroll without clipping controls.



## Module 6 - Applications, evidence, deadlines, and dashboard

- [ ] **6.1 Implement save-as-application.** Create one user-owned application from a scholarship and atomically add a short default checklist derived from its requirements.
  **Verification Gate:** Save a scholarship twice; confirm exactly one application exists, its checklist exists once, the current user owns it, and another user cannot read it.

- [ ] **6.2 Build the application detail route.** Create `/applications/[id]` with scholarship summary, editable status/deadline/notes, checklist, evidence summary, and readiness indicator.
  **Verification Gate:** Open an owned and unowned ID; the owned record renders correctly, the unowned record reveals no data, and invalid statuses/overlong notes are rejected server-side.

- [ ] **6.3 Persist checklist interactions.** Allow the owner to complete/reopen tasks and update `completed_at` and readiness immediately.
  **Verification Gate:** Toggle a required item, refresh, and sign in again; completion and readiness must persist. Confirm a second user cannot mutate the item.

- [ ] **6.4 Build the evidence tracker.** Create `/evidence` with add/edit/delete flows for evidence metadata and status; clearly state that actual file upload is not part of the MVP.
  **Verification Gate:** Create, edit, link, and delete a fictional evidence item; refresh after each action to prove persistence, and verify a second user has no access.

- [ ] **6.5 Build the deadlines route.** Create `/deadlines` with chronological application deadlines, urgency text/icons, overdue handling, and links to application details.
  **Verification Gate:** Use fixed test records in every urgency band; verify order and label boundaries against utility tests and ensure urgency is not communicated by color alone.

- [ ] **6.6 Build the dashboard.** Create `/dashboard` with profile-completion prompt, match count, application/readiness cards, and nearest deadlines based on current user data.
  **Verification Gate:** Test new-user, partially configured, and active-application states; each state must show accurate counts, useful next actions, and no other user's data.



## Module 7 - Public pages, settings, and trust content

- [ ] **7.1 Build the landing page.** Create the public hero, value proposition, core workflow, fictional-data/trust notice, feature overview, and clear sign-up action without outcome guarantees.
  **Verification Gate:** Audit at 375px and 1440px; the purpose and primary action must be clear above the fold, links must work, and prohibited prediction/guarantee language must be absent.

- [ ] **7.2 Build the pricing page.** Show free, seasonal premium, and institutional concepts with transparent limits, test-only/no-payment wording, and no implication of improved award outcomes.
  **Verification Gate:** Confirm there is no card-entry form, checkout endpoint, webhook, enabled purchase action, Stripe dependency, or account requirement; manually review all pricing copy against `PRD.md` trust rules.

- [ ] **7.3 Build settings and privacy content.** Show account email, sign out, Personal Information Collection Statement, data-handling summary, and a safe account-erasure action or explicit prototype instructions.
  **Verification Gate:** Keyboard-audit the page, verify privacy text covers purpose/fields/provider/retention/access-correction/required fields, and test deletion only with a disposable account after confirming cascade behavior.

- [ ] **7.4 Add loading, error, empty, and not-found states.** Cover all public/protected routes and expected mutation failures with calm, actionable messages.
  **Verification Gate:** Force offline/query failure, empty datasets, and invalid IDs; each state must render without leaking technical details or leaving an unusable blank page.

- [ ] **7.5 Create the user-testing checklist.** Add a repository document covering the complete fictional demo journey, expected results, browser/device, tester, date, result, and notes.
  **Verification Gate:** A student tester must execute every checklist row and record pass/fail evidence; unresolved failures become new scoped tasks before launch.



## Module 8 - Pre-launch audits and deployment

- [ ] **8.1 Run the security and privacy audit.** Review tracked files, environment boundaries, input validation, logging, redirects, cookies, and every RLS policy.
  **Verification Gate:** Secret scanning/tracked-file inspection finds no credential or real personal data, and the two-user RLS test matrix passes for every user-owned table and mutation.

- [ ] **8.2 Run the accessibility and responsive audit.** Review semantics, headings, names/labels, keyboard access, focus, contrast, status communication, motion, and overflow.
  **Verification Gate:** Complete automated accessibility checks plus manual keyboard and viewport checks at 375px and 1440px; fix all critical/serious issues and all blockers in the core workflow.

- [ ] **8.3 Run the complete local regression.** Execute the documented demo journey from sign-up through persistent checklist/readiness tracking.
  **Verification Gate:** `npm run lint`, `npm run test`, and `npm run build` all pass, and every core user-testing row passes in a clean/private browser session.

- [ ] **8.4 Review GitHub history and repository access.** Ensure meaningful milestone commits, current documentation, no generated clutter, and the assessor's required access.
  **Verification Gate:** Inspect the remote repository from the intended assessor-access path; confirm the latest commit is present, history is meaningful, required files open, and no secret is visible.

- [ ] **8.5 Deploy to Vercel.** Import the GitHub repository, configure production environment variables and Supabase redirect URLs, and deploy the production branch.
  **Verification Gate:** Vercel Hobby reports a successful production build and the free `.vercel.app` URL loads from a signed-out private browser without special permissions or payment setup.

- [ ] **8.6 Run the production smoke test.** Re-test auth, profile, matching, comparison, application creation, checklist persistence, evidence, deadlines, pricing, settings, and sign-out on the live URL.
  **Verification Gate:** Record the live URL and dated results; every critical flow must pass with no browser-console error, broken route, cross-user data exposure, or missing fictional/eligibility disclaimer.

- [ ] **8.7 Complete the student ownership review.** Rewrite product decisions in the student's own voice, verify the implementation against both documents, and prepare the truthful AI-use declaration.
  **Verification Gate:** The student can explain every major feature, schema relationship, matching rule, security control, and test result; AI use is declared truthfully according to the professor's final instructions.

- [ ] **8.8 Confirm the production MVP remains free.** Review all deployed resources, integrations, quotas, and setup instructions against the zero-cost boundary in `PRD.md`.
  **Verification Gate:** The full production demo works without a custom domain, paid plan, paid API, payment method, or unexpected billable resource; record the free-plan services used in the README.

- [ ] **8.9 Schedule required free-tier availability checks.** Add calendar reminders to open and smoke-test the live application at least once within every seven-day period for as long as the assignment requires the site to remain accessible; this is a manual operational check, not a paid monitor or artificial keep-alive job.
  **Verification Gate:** Confirm all reminder dates exist and complete the first check: the Vercel URL loads, login and one Supabase-backed page work, and the Supabase dashboard does not show the project as paused. Record this and every later dated result in the user-testing checklist.



## Deferred Phase 2 backlog - do not execute during MVP

- [ ] Real scholarship-provider feeds, provenance review, and catalog administration.
- [ ] Actual document uploads with private storage, malware controls, and retention rules.
- [ ] Test-mode Stripe checkout, subscription state, signed webhooks, and billing portal.
- [ ] Adviser/provider roles, institution workspaces, and multi-tenant authorization.
- [ ] Email/SMS reminders and calendar synchronization.
- [ ] Collaboration, recommendation requests, and provider submission workflows.
- [ ] Advanced explainable recommendations only after bias, privacy, and accuracy review.
- [ ] Analytics, localization, dark mode, avatars, and native mobile applications.