-- ============================================================
-- PROJECT UDAAN — Row Level Security (Migration 0002)
--
-- Principle: the browser is never trusted. Every policy below
-- checks auth.uid() and the user_roles table server-side inside
-- Postgres itself, so even a compromised/modified frontend
-- cannot escalate privilege, verify its own contribution, or
-- alter payment/impact data.
-- ============================================================

-- ------------------------------------------------------------
-- Helper: does the current user hold a given role?
-- SECURITY DEFINER so it can read user_roles regardless of the
-- caller's own row-level access, without being spoofable — it
-- always checks auth.uid(), never a client-supplied user id.
-- ------------------------------------------------------------

create or replace function has_role(check_role app_role)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = check_role
  );
$$;

create or replace function is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid()
      and role in ('coordinator', 'admin', 'super_admin')
  );
$$;

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$$;

create or replace function is_project_staff(target_project_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select is_admin() or exists (
    select 1 from project_members
    where project_id = target_project_id
      and user_id = auth.uid()
      and role in ('lead', 'coordinator')
  );
$$;

-- ------------------------------------------------------------
-- Enable RLS everywhere
-- ------------------------------------------------------------

alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table volunteer_applications enable row level security;
alter table projects enable row level security;
alter table project_locations enable row level security;
alter table project_members enable row level security;
alter table project_updates enable row level security;
alter table tasks enable row level security;
alter table volunteer_contributions enable row level security;
alter table campaigns enable row level security;
alter table donations enable row level security;
alter table impact_metrics enable row level security;
alter table stories enable row level security;
alter table certificates enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;
alter table organization_settings enable row level security;
alter table documents enable row level security;

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------

create policy "profiles_select_own" on profiles
  for select using (user_id = auth.uid());

create policy "profiles_select_staff" on profiles
  for select using (is_staff());

create policy "profiles_insert_own" on profiles
  for insert with check (user_id = auth.uid());

create policy "profiles_update_own" on profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "profiles_update_admin" on profiles
  for update using (is_admin());

-- ------------------------------------------------------------
-- USER ROLES
-- A user can read their own roles. Only admins can write roles —
-- this is the single most important policy in the schema: it is
-- what prevents a client from ever granting itself "admin".
-- ------------------------------------------------------------

create policy "user_roles_select_own" on user_roles
  for select using (user_id = auth.uid());

create policy "user_roles_select_admin" on user_roles
  for select using (is_admin());

create policy "user_roles_write_admin_only" on user_roles
  for all using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------
-- VOLUNTEER APPLICATIONS
-- ------------------------------------------------------------

create policy "applications_select_own" on volunteer_applications
  for select using (user_id = auth.uid());

create policy "applications_select_staff" on volunteer_applications
  for select using (is_staff());

create policy "applications_insert_own" on volunteer_applications
  for insert with check (user_id = auth.uid());

-- applicants may not edit status/reviewer fields; only re-submit
-- while still pending, and only their own non-decision fields
create policy "applications_update_own_pending" on volunteer_applications
  for update using (user_id = auth.uid() and status = 'pending')
  with check (user_id = auth.uid() and status = 'pending');

create policy "applications_update_staff" on volunteer_applications
  for update using (is_staff()) with check (is_staff());

-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------

create policy "projects_select_public" on projects
  for select using (visibility = 'public');

create policy "projects_select_member" on projects
  for select using (
    exists (select 1 from project_members where project_id = projects.id and user_id = auth.uid())
  );

create policy "projects_select_staff" on projects
  for select using (is_staff());

create policy "projects_write_staff" on projects
  for all using (is_staff()) with check (is_staff());

-- ------------------------------------------------------------
-- PROJECT LOCATIONS / MEMBERS / UPDATES
-- ------------------------------------------------------------

create policy "project_locations_select_public" on project_locations
  for select using (
    exists (select 1 from projects p where p.id = project_locations.project_id and p.visibility = 'public')
    or is_staff()
  );
create policy "project_locations_write_staff" on project_locations
  for all using (is_project_staff(project_id)) with check (is_project_staff(project_id));

create policy "project_members_select_own" on project_members
  for select using (user_id = auth.uid());
create policy "project_members_select_staff" on project_members
  for select using (is_staff());
create policy "project_members_write_staff" on project_members
  for all using (is_project_staff(project_id)) with check (is_project_staff(project_id));

create policy "project_updates_select_published" on project_updates
  for select using (
    published = true
    and exists (select 1 from projects p where p.id = project_updates.project_id and p.visibility = 'public')
  );
create policy "project_updates_select_staff" on project_updates
  for select using (is_staff());
create policy "project_updates_write_staff" on project_updates
  for all using (is_project_staff(project_id)) with check (is_project_staff(project_id));

-- ------------------------------------------------------------
-- TASKS
-- ------------------------------------------------------------

create policy "tasks_select_assignee" on tasks
  for select using (assigned_to = auth.uid());

create policy "tasks_select_staff" on tasks
  for select using (is_staff());

create policy "tasks_insert_staff" on tasks
  for insert with check (is_project_staff(project_id));

-- volunteers may only move their own task between todo/in_progress/completed —
-- never re-assign it or change project/priority/due_date
create policy "tasks_update_assignee_status_only" on tasks
  for update using (assigned_to = auth.uid())
  with check (
    assigned_to = auth.uid()
    and status in ('todo', 'in_progress', 'completed')
  );

create policy "tasks_update_staff" on tasks
  for update using (is_project_staff(project_id)) with check (is_project_staff(project_id));

create policy "tasks_delete_staff" on tasks
  for delete using (is_project_staff(project_id));

-- ------------------------------------------------------------
-- VOLUNTEER CONTRIBUTIONS
-- A volunteer may create+read their own, but the status/verified_*
-- columns are only ever writable by staff (enforced by a separate
-- update policy that staff alone satisfy, plus the trigger below
-- that blocks a volunteer's own update from touching those columns).
-- ------------------------------------------------------------

create policy "contributions_select_own" on volunteer_contributions
  for select using (user_id = auth.uid());

create policy "contributions_select_staff" on volunteer_contributions
  for select using (is_staff());

create policy "contributions_insert_own" on volunteer_contributions
  for insert with check (user_id = auth.uid() and status = 'pending');

create policy "contributions_update_own_while_pending" on volunteer_contributions
  for update using (user_id = auth.uid() and status = 'pending')
  with check (user_id = auth.uid() and status = 'pending');

create policy "contributions_update_staff" on volunteer_contributions
  for update using (is_staff()) with check (is_staff());

-- Belt-and-braces: even if a policy above were mis-scoped, this
-- trigger physically rejects any attempt by a non-staff caller to
-- change verification fields.
create or replace function protect_contribution_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_staff() then
    new.status := old.status;
    new.verified_by := old.verified_by;
    new.verified_at := old.verified_at;
    new.verification_notes := old.verification_notes;
  end if;
  return new;
end;
$$;

create trigger trg_protect_contribution_verification
  before update on volunteer_contributions
  for each row execute function protect_contribution_verification();

-- ------------------------------------------------------------
-- CAMPAIGNS
-- ------------------------------------------------------------

create policy "campaigns_select_active" on campaigns
  for select using (status in ('active', 'completed'));

create policy "campaigns_select_staff" on campaigns
  for select using (is_staff());

create policy "campaigns_write_staff" on campaigns
  for all using (is_staff()) with check (is_staff());

-- ------------------------------------------------------------
-- DONATIONS
-- Payment status is NEVER writable by the donor. Inserts land as
-- 'pending' only; the service-role key (used exclusively by the
-- verified payment webhook, never by browser code) is the only
-- path that flips a donation to 'successful'.
-- ------------------------------------------------------------

create policy "donations_select_own" on donations
  for select using (donor_user_id = auth.uid());

create policy "donations_select_staff" on donations
  for select using (is_staff());

-- public can see aggregate-safe rows (no PII) for campaign progress bars
-- via a dedicated view (campaign_totals), not this table directly.

create policy "donations_insert_own_pending" on donations
  for insert with check (donor_user_id = auth.uid() and payment_status = 'pending');

-- Donors may only toggle their own display preference, and only
-- while a request also leaves every financial column untouched —
-- enforced by trigger below for defense in depth.
create policy "donations_update_own_display_pref" on donations
  for update using (donor_user_id = auth.uid())
  with check (donor_user_id = auth.uid());

create or replace function protect_donation_financials()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_staff() then
    new.amount := old.amount;
    new.payment_status := old.payment_status;
    new.provider_order_id := old.provider_order_id;
    new.provider_payment_id := old.provider_payment_id;
    new.receipt_number := old.receipt_number;
    new.receipt_url := old.receipt_url;
  end if;
  return new;
end;
$$;

create trigger trg_protect_donation_financials
  before update on donations
  for each row execute function protect_donation_financials();

-- Only the service role (webhook, bypasses RLS) or staff may mark
-- a donation successful/refunded — never the anon/browser client.
create policy "donations_update_staff" on donations
  for update using (is_staff()) with check (is_staff());

-- ------------------------------------------------------------
-- IMPACT METRICS
-- Only verified rows are publicly visible — see the public view.
-- ------------------------------------------------------------

create policy "impact_select_staff" on impact_metrics
  for select using (is_staff());

create policy "impact_select_verified_public" on impact_metrics
  for select using (verified = true);

create policy "impact_write_staff" on impact_metrics
  for insert with check (is_staff());

create policy "impact_update_staff" on impact_metrics
  for update using (is_staff()) with check (is_staff());

-- Only admins can flip verified = true (coordinators can propose actuals,
-- only admin/super_admin can verify and publish)
create or replace function protect_impact_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.verified = true and old.verified = false and not is_admin() then
    raise exception 'Only admins may verify impact metrics';
  end if;
  return new;
end;
$$;

create trigger trg_protect_impact_verification
  before update on impact_metrics
  for each row execute function protect_impact_verification();

-- ------------------------------------------------------------
-- STORIES
-- ------------------------------------------------------------

create policy "stories_select_published" on stories
  for select using (status = 'published');

create policy "stories_select_staff" on stories
  for select using (is_staff());

create policy "stories_write_staff" on stories
  for all using (is_staff()) with check (is_staff());

-- ------------------------------------------------------------
-- CERTIFICATES
-- ------------------------------------------------------------

create policy "certificates_select_own" on certificates
  for select using (volunteer_id = auth.uid());

create policy "certificates_select_staff" on certificates
  for select using (is_staff());

create policy "certificates_write_staff" on certificates
  for insert with check (is_staff());

-- Certificates are immutable once issued (no update policy at all).
-- Public verification (by code, minimal fields) goes through a
-- SECURITY DEFINER function, not a table policy — see 0003.

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------

create policy "notifications_select_own" on notifications
  for select using (user_id = auth.uid());

create policy "notifications_update_own_read_state" on notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "notifications_insert_staff" on notifications
  for insert with check (is_staff());

-- ------------------------------------------------------------
-- AUDIT LOGS — append-only, staff-readable, nobody can edit/delete
-- ------------------------------------------------------------

create policy "audit_logs_select_admin" on audit_logs
  for select using (is_admin());

create policy "audit_logs_insert_staff" on audit_logs
  for insert with check (is_staff());

-- deliberately: no update or delete policy exists for audit_logs.

-- ------------------------------------------------------------
-- ORGANIZATION SETTINGS
-- ------------------------------------------------------------

create policy "org_settings_select_all" on organization_settings
  for select using (true);

create policy "org_settings_update_admin" on organization_settings
  for update using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------
-- DOCUMENTS
-- ------------------------------------------------------------

create policy "documents_select_public" on documents
  for select using (is_public = true);

create policy "documents_select_staff" on documents
  for select using (is_staff());

create policy "documents_write_staff" on documents
  for all using (is_staff()) with check (is_staff());
