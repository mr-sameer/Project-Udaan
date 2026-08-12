-- ============================================================
-- PROJECT UDAAN — Public views + auth bootstrap (Migration 0003)
-- ============================================================

-- ------------------------------------------------------------
-- campaign_totals — the ONLY thing the public site queries for
-- "₹X raised of ₹Y goal". Sums only successful donations, and
-- returns zero rows leaked as "raised" until money has actually
-- cleared. No donor PII, no payment IDs.
-- ------------------------------------------------------------

create or replace view campaign_totals as
select
  c.id as campaign_id,
  c.slug,
  c.name,
  c.goal_amount,
  coalesce(sum(d.amount) filter (where d.payment_status = 'successful'), 0) as amount_raised,
  count(d.id) filter (where d.payment_status = 'successful') as supporter_count
from campaigns c
left join donations d on d.campaign_id = c.id
group by c.id, c.slug, c.name, c.goal_amount;

-- Donor display names, respecting the opt-in flag — used for any
-- "recent supporters" list. Never exposes email/phone/payment IDs.
create or replace view campaign_public_donors as
select
  d.campaign_id,
  case when d.show_name_publicly then p.full_name else 'Anonymous' end as display_name,
  d.amount,
  d.created_at
from donations d
left join profiles p on p.user_id = d.donor_user_id
where d.payment_status = 'successful';

-- ------------------------------------------------------------
-- verified_impact — what the homepage Impact section is allowed
-- to render. Anything not verified never reaches this view.
-- ------------------------------------------------------------

create or replace view verified_impact as
select
  im.id,
  im.project_id,
  p.name as project_name,
  im.metric_key,
  im.label,
  im.actual,
  im.unit,
  im.period,
  im.verified_at
from impact_metrics im
join projects p on p.id = im.project_id
where im.verified = true;

grant select on campaign_totals, campaign_public_donors, verified_impact to anon, authenticated;

-- ------------------------------------------------------------
-- Auth bootstrap: when a new user signs up via Supabase Auth,
-- automatically create their profile row and assign the safe
-- default role. This runs with definer rights on auth.users so
-- it fires regardless of the caller's own RLS — but it NEVER
-- reads a client-supplied role; the role is hard-coded here.
-- ------------------------------------------------------------

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email)
  on conflict (user_id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'volunteer')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function handle_new_user();

-- ------------------------------------------------------------
-- Generic audit-log helper, callable from server actions via RPC
-- so every sensitive mutation gets one consistent log shape.
-- ------------------------------------------------------------

create or replace function log_audit_event(
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_old_data jsonb default null,
  p_new_data jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into audit_logs (actor_user_id, action, entity_type, entity_id, old_data, new_data)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, p_old_data, p_new_data);
end;
$$;

grant execute on function log_audit_event(text, text, uuid, jsonb, jsonb) to authenticated;

-- ------------------------------------------------------------
-- Certificate verification — public, minimal fields only, via a
-- SECURITY DEFINER function rather than a table SELECT policy,
-- so a lookup by code never becomes a listing of all certificates.
-- ------------------------------------------------------------

create or replace function verify_certificate(p_code text)
returns table (
  certificate_code text,
  volunteer_name text,
  project_name text,
  hours numeric,
  issue_date date
)
language sql
security definer
set search_path = public
stable
as $$
  select
    c.certificate_code,
    p.full_name as volunteer_name,
    pr.name as project_name,
    c.hours,
    c.issue_date
  from certificates c
  join profiles p on p.user_id = c.volunteer_id
  left join projects pr on pr.id = c.project_id
  where c.certificate_code = p_code;
$$;

grant execute on function verify_certificate(text) to anon, authenticated;
