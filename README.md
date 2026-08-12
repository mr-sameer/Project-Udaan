# Project Udaan — Platform

Next.js 14 (App Router) + Supabase (Postgres, Auth, Storage, RLS). This
turns the static Udaan homepage into a database-driven platform while
keeping the existing Indian-heritage visual identity.

## 1. Setup

```bash
npm install
cp .env.example .env.local   # fill in your real Supabase project values
```

Run the migrations against your Supabase project, in order:

```
supabase/migrations/0001_core_schema.sql
supabase/migrations/0002_rls_policies.sql
supabase/migrations/0003_views_and_triggers.sql
supabase/migrations/0004_storage.sql
supabase/migrations/0005_contact_messages.sql
```

Either paste each file into the Supabase SQL editor in order, or:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Optionally, for local development data:

```bash
psql <your-connection-string> -f supabase/seed/seed.sql
```

Then:

```bash
npm run dev
```

Regenerate real types once your schema is live (replaces the hand-written `types/database.ts`):

```bash
npx supabase gen types typescript --project-id <your-project-id> > types/database.ts
```

To make your own account an admin (there is deliberately no UI path to grant `admin`/`super_admin` — see Security below), run in the Supabase SQL editor after registering normally:

```sql
insert into user_roles (user_id, role) values ('<your-auth-user-uuid>', 'admin');
```

---

## 2. What was implemented

- Full Next.js App Router structure: `(public)`, `(auth)`, `dashboard`, `admin`, `api` route groups
- Complete Postgres schema (16 tables) with UUIDs, timestamps, FKs, indexes, `updated_at` triggers
- Row Level Security on every table — the browser is never trusted; roles/verification/payment status are enforced in Postgres itself, not just in the UI
- Central TypeScript authorization layer (`lib/permissions`) mirroring the SQL-level `has_role()`/`is_staff()`/`is_admin()` functions
- Supabase Auth: register, login, logout, forgot/reset password, email verification callback
- Auto-provisioning: a Postgres trigger creates a profile + assigns the `volunteer` role the moment someone signs up — the role is never taken from client input
- Public homepage sections (Current Projects, Impact, Fundraising, Stories) now query Supabase live, with honest Day-0 empty states instead of hard-coded numbers
- Volunteer flow end to end: apply → admin review → dashboard → assigned projects/tasks → record contribution (+evidence upload) → staff verification → real aggregate stats → certificate issuance → public certificate verification
- Donor flow end to end: donate → pending order → mock payment (dev) or real webhook (prod) → campaign totals update automatically → receipts → donor dashboard
- Admin panel: overview (live counts + activity feed from audit logs), applications, volunteers (role assignment), projects (CRUD), tasks, contributions (verify/reject), campaigns, donations (read-only), impact (record + admin-only verify/publish), stories, certificates, audit logs (append-only), settings, contact messages
- Notifications (in-app, database-backed)
- SEO: per-page metadata, dynamic metadata for project/story/campaign detail pages, `robots.ts`, dynamic `sitemap.ts`
- Payment abstraction (`lib/payments/provider.ts`) with a working mock provider and a real webhook handler that's the only path to a successful donation

## 3. Routes created

**Public:** `/`, `/why-udaan`, `/projects`, `/projects/[slug]`, `/impact`, `/stories`, `/stories/[slug]`, `/about`, `/campaigns`, `/campaigns/[slug]`, `/donate`, `/donate/mock-checkout`, `/volunteer/apply`, `/contact`, `/verify`, `/verify/[certificateId]`

**Auth:** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/api/auth/callback`

**Volunteer dashboard:** `/dashboard`, `/dashboard/volunteer`, `/dashboard/volunteer/projects`, `/dashboard/volunteer/tasks`, `/dashboard/volunteer/contributions`, `/dashboard/volunteer/certificates`, `/dashboard/notifications`, `/dashboard/profile`

**Donor dashboard:** `/dashboard/donor`, `/dashboard/donor/donations`, `/dashboard/donor/receipts`

**Admin:** `/admin`, `/admin/applications`, `/admin/volunteers`, `/admin/projects`, `/admin/tasks`, `/admin/contributions`, `/admin/campaigns`, `/admin/donations`, `/admin/impact`, `/admin/stories`, `/admin/certificates`, `/admin/audit`, `/admin/settings`, `/admin/contact`

**API:** `/api/webhooks/payments` (POST, service-role only)

**Not built:** `/dashboard/mentor`, `/dashboard/coordinator` (both currently fall back to the volunteer dashboard via `dashboardPathForRole`) — same pattern as the volunteer dashboard, straightforward to add.

## 4. Database tables created

`profiles`, `user_roles`, `volunteer_applications`, `projects`, `project_locations`, `project_members`, `project_updates`, `tasks`, `volunteer_contributions`, `campaigns`, `donations`, `impact_metrics`, `stories`, `certificates`, `notifications`, `audit_logs`, `organization_settings`, `documents`, `contact_messages` — plus views `campaign_totals`, `campaign_public_donors`, `verified_impact`.

## 5. RLS policies created

Every table has RLS enabled with explicit policies (see `supabase/migrations/0002_rls_policies.sql` for the full set and comments). Highlights:

- `user_roles` is writable **only** by admins — this is what actually prevents privilege escalation, not the UI
- `volunteer_contributions` and `donations` have triggers (`protect_contribution_verification`, `protect_donation_financials`) that silently revert any attempt by a non-staff caller to change verification/financial columns, even if a policy were ever mis-scoped
- `impact_metrics` verification requires `is_admin()`, not just `is_staff()` — a trigger raises an exception otherwise
- `audit_logs` has no update/delete policy for any role — genuinely append-only
- Certificate public verification goes through a `SECURITY DEFINER` function (`verify_certificate`), never a table policy, so a code lookup can't become a listing of every certificate

## 6. Authentication features that work

Register (with email confirmation), login, logout, forgot password, reset password, session refresh via middleware, protected-route redirects (`/dashboard/*`, `/admin/*` → `/login`; unauthorized staff routes → `/unauthorized`).

**Not wired:** OAuth providers (Google, etc.) — the Supabase Auth config supports it, but no provider buttons are built yet.

## 7. Volunteer features that work

Apply, get reviewed/approved by staff, see real dashboard stats (computed from verified rows only), see assigned projects, move own tasks between statuses, record a contribution with optional evidence upload, see contribution history and status, see issued certificates with a public verification link.

## 8. Admin features that work

Live dashboard counts + activity feed, review/approve/reject/waitlist applications, assign roles (with `super_admin` explicitly blocked from the UI), create/update projects, assign project members via a searchable name/email picker (`/admin/projects/[id]`), create tasks, verify/reject contributions, create campaigns, view donations (read-only, filterable), record + verify impact metrics, create/publish stories, issue certificates, read-only audit log, edit organization settings (never fabricates registration/PAN/80G/FCRA — shows "Pending" until filled in), read contact messages.

**Not built:** CSV export/reporting; the task-assignment and certificate-issuance forms still take a raw user UUID rather than the searchable picker used for project members — same pattern, just not replicated there yet.

## 9. Donor features that work

Donate (mock payment flow in dev), see donation history, see receipts (only generated after a successful payment), donor dashboard totals (from successful payments only).

## 10. What's dynamic now

Current Projects, Impact numbers, Stories, Campaign/donation progress, project detail pages + updates, story detail pages, campaign detail pages, all admin data, all dashboard data, organization settings/About page, notifications.

## 11. What's still static

The emotional/heritage sections are static, editorial JSX by design — `Hero`, `WhyWeExist`, `DayZero`, `Closing`, `Footer`, `MobileBar` (`components/udaan/StaticSections.tsx`) and `GenerationsChain`, `KnowledgeTradition`, `WisdomThatStillSpeaks`, `UdaanPromise`, `PassItForward` (`components/udaan/HeritageSections.tsx`), all now ported into the app and assembled on the homepage in `app/page.tsx`. This is brand copy, not organizational data — it doesn't belong in a database table.

## 12. What requires external credentials

- **Supabase**: URL + anon key + service-role key (you said you already have these)
- **Payments**: Razorpay or Cashfree keys to go beyond `PAYMENTS_MODE=mock`. The adapter shape is ready in `lib/payments/provider.ts`; the real `createOrder`/`verifyWebhookSignature` implementation is stubbed and throws until you fill it in
- **Email**: nothing is wired yet (`EMAIL_PROVIDER`/`EMAIL_API_KEY` are placeholders in `.env.example`) — Supabase's built-in auth emails work out of the box, but application/donation/certificate notifications are currently in-app only

## 13. What remains before production launch

1. Implement the real Razorpay/Cashfree adapter and webhook signature verification
2. Wire transactional email (application status, contribution verified, donation receipt) — the notification records already exist, an email step just needs to hook into their creation
3. CSV export for admin reports (volunteer/contribution/donation/project/impact/campaign)
4. Rate limiting on public forms (`/contact`, `/volunteer/apply`, `/donate`)
5. Test all four user journeys (public, volunteer, donor, admin) end to end against your real Supabase project — this sandbox has no network path to Supabase, so nothing here has been run against a live database
6. Replace the hand-written `types/database.ts` with `supabase gen types` output
7. Add OAuth if you want it
8. Legal/organizational fields in `/admin/settings` — currently all "Pending"
9. `/dashboard/mentor` and `/dashboard/coordinator` currently fall back to the volunteer dashboard layout via `dashboardPathForRole` — build role-specific views if mentors/coordinators need different tools than volunteers

## Security notes worth knowing

- `lib/supabase/admin.ts` (the service-role client) is marked `import "server-only"` — it is a build error to import it from any Client Component
- The service-role client is used in exactly two places: the payment webhook and the mock-payment dev simulator. Every other query goes through the RLS-bound client
- `SELF_ASSIGNABLE_ROLES` in `lib/permissions/roles.ts` and the `handle_new_user()` Postgres trigger are the two places that determine what role a new user gets — both hard-code `volunteer`, neither reads client input
- `super_admin` cannot be granted anywhere in the app UI, by design — set it directly in Supabase once, for yourself
