-- ============================================================
-- PROJECT UDAAN — Core Schema (Migration 0001)
-- Run against a fresh Supabase Postgres database.
-- Depends on: auth.users (built into Supabase)
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------

create type app_role as enum ('volunteer', 'donor', 'mentor', 'coordinator', 'admin', 'super_admin');

create type application_status as enum ('pending', 'under_review', 'approved', 'rejected', 'waitlisted');

create type project_status as enum ('planning', 'preparing', 'active', 'completed', 'paused', 'cancelled');
create type project_visibility as enum ('public', 'unlisted', 'private');

create type project_member_role as enum ('lead', 'volunteer', 'mentor', 'trainer', 'coordinator', 'researcher', 'content_creator');

create type task_status as enum ('todo', 'in_progress', 'completed', 'blocked');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');

create type contribution_type as enum (
  'teaching', 'mentoring', 'fundraising', 'technology', 'content',
  'research', 'community_outreach', 'event', 'equipment', 'administration', 'other'
);
create type contribution_status as enum ('pending', 'verified', 'rejected');

create type campaign_status as enum ('draft', 'active', 'completed', 'cancelled');

create type payment_status as enum ('pending', 'successful', 'failed', 'refunded', 'cancelled');
create type payment_provider as enum ('razorpay', 'cashfree', 'mock');

create type story_status as enum ('draft', 'review', 'published', 'archived');

-- ------------------------------------------------------------
-- PROFILES  (1:1 with auth.users)
-- ------------------------------------------------------------

create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  profile_photo_url text,
  bio text,
  city text,
  state text,
  country text default 'India',
  education text,
  occupation text,
  skills text[],
  linkedin_url text,
  website_url text,
  preferred_language text default 'en',
  status text not null default 'active' check (status in ('active', 'suspended', 'deactivated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_user_id on profiles(user_id);

-- ------------------------------------------------------------
-- USER ROLES  (one row per role a user holds; a user may hold several)
-- ------------------------------------------------------------

create table user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role)
);

create index idx_user_roles_user_id on user_roles(user_id);

-- ------------------------------------------------------------
-- VOLUNTEER APPLICATIONS
-- ------------------------------------------------------------

create table volunteer_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  city text,
  state text,
  education text,
  skills text[],
  experience text,
  availability text,
  preferred_areas text[],
  motivation text,
  status application_status not null default 'pending',
  reviewer_notes text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_volunteer_applications_user_id on volunteer_applications(user_id);
create index idx_volunteer_applications_status on volunteer_applications(status);

-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------

create table projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  focus_area text,
  status project_status not null default 'planning',
  visibility project_visibility not null default 'public',
  start_date date,
  end_date date,
  location text,
  target_beneficiaries integer,
  funding_goal numeric(12,2),
  cover_image_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_slug on projects(slug);
create index idx_projects_status on projects(status);
create index idx_projects_visibility on projects(visibility);

create table project_locations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  label text not null,
  city text,
  state text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  created_at timestamptz not null default now()
);

create table project_members (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role project_member_role not null default 'volunteer',
  assigned_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (project_id, user_id, role)
);

create index idx_project_members_project_id on project_members(project_id);
create index idx_project_members_user_id on project_members(user_id);

create table project_updates (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  body text,
  image_url text,
  published boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index idx_project_updates_project_id on project_updates(project_id);

-- ------------------------------------------------------------
-- TASKS
-- ------------------------------------------------------------

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  assigned_to uuid references auth.users(id),
  title text not null,
  description text,
  priority task_priority not null default 'medium',
  status task_status not null default 'todo',
  due_date date,
  completed_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_tasks_project_id on tasks(project_id);
create index idx_tasks_assigned_to on tasks(assigned_to);
create index idx_tasks_status on tasks(status);

-- ------------------------------------------------------------
-- VOLUNTEER CONTRIBUTIONS
-- ------------------------------------------------------------

create table volunteer_contributions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  task_id uuid references tasks(id) on delete set null,
  contribution_type contribution_type not null,
  contribution_date date not null,
  hours numeric(6,2),
  people_supported integer,
  description text,
  evidence_url text,
  status contribution_status not null default 'pending',
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  verification_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_contributions_user_id on volunteer_contributions(user_id);
create index idx_contributions_project_id on volunteer_contributions(project_id);
create index idx_contributions_status on volunteer_contributions(status);

-- ------------------------------------------------------------
-- CAMPAIGNS + DONATIONS
-- ------------------------------------------------------------

create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  project_id uuid references projects(id) on delete set null,
  goal_amount numeric(12,2) not null,
  start_date date,
  end_date date,
  status campaign_status not null default 'draft',
  cover_image_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_campaigns_slug on campaigns(slug);
create index idx_campaigns_status on campaigns(status);

create table donations (
  id uuid primary key default uuid_generate_v4(),
  donor_user_id uuid references auth.users(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  campaign_id uuid references campaigns(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'INR',
  payment_provider payment_provider not null default 'mock',
  provider_order_id text,
  provider_payment_id text,
  payment_status payment_status not null default 'pending',
  receipt_number text unique,
  receipt_url text,
  show_name_publicly boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_donations_donor_user_id on donations(donor_user_id);
create index idx_donations_campaign_id on donations(campaign_id);
create index idx_donations_payment_status on donations(payment_status);

-- ------------------------------------------------------------
-- IMPACT METRICS
-- ------------------------------------------------------------

create table impact_metrics (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete set null,
  metric_key text not null,
  label text not null,
  target numeric(12,2),
  actual numeric(12,2),
  unit text not null default 'count',
  period text,
  evidence_url text,
  verified boolean not null default false,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_impact_metrics_project_id on impact_metrics(project_id);
create index idx_impact_metrics_verified on impact_metrics(verified);

-- ------------------------------------------------------------
-- STORIES
-- ------------------------------------------------------------

create table stories (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  project_id uuid references projects(id) on delete set null,
  author_id uuid references auth.users(id),
  status story_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_stories_slug on stories(slug);
create index idx_stories_status on stories(status);

-- ------------------------------------------------------------
-- CERTIFICATES
-- ------------------------------------------------------------

create table certificates (
  id uuid primary key default uuid_generate_v4(),
  certificate_code text not null unique default ('UDN-' || upper(substr(replace(uuid_generate_v4()::text, '-', ''), 1, 10))),
  volunteer_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  contribution_id uuid references volunteer_contributions(id) on delete set null,
  hours numeric(6,2),
  issue_date date not null default current_date,
  issued_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index idx_certificates_code on certificates(certificate_code);
create index idx_certificates_volunteer_id on certificates(volunteer_id);

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_read on notifications(user_id, read);

-- ------------------------------------------------------------
-- AUDIT LOGS  (append-only)
-- ------------------------------------------------------------

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index idx_audit_logs_actor on audit_logs(actor_user_id);

-- ------------------------------------------------------------
-- ORGANIZATION SETTINGS  (single row)
-- ------------------------------------------------------------

create table organization_settings (
  id uuid primary key default uuid_generate_v4(),
  org_name text not null default 'Project Udaan',
  legal_name text,
  logo_url text,
  contact_email text,
  phone text,
  website text,
  social_links jsonb default '{}'::jsonb,
  registration_number text,
  pan text,
  status_80g text default 'Pending',
  status_fcra text default 'Pending',
  mission text,
  about_text text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

insert into organization_settings (org_name, status_80g, status_fcra)
values ('Project Udaan', 'Pending', 'Pending');

-- ------------------------------------------------------------
-- DOCUMENTS  (generic file registry, e.g. audited statements)
-- ------------------------------------------------------------

create table documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  file_url text not null,
  is_public boolean not null default false,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- updated_at triggers
-- ------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','user_roles','volunteer_applications','projects','project_members',
    'tasks','volunteer_contributions','campaigns','donations','impact_metrics',
    'stories'
  ]
  loop
    execute format('create trigger trg_%I_updated_at before update on %I for each row execute function set_updated_at();', t, t);
  end loop;
end $$;
