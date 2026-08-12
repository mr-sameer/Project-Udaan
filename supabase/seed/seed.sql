-- ============================================================
-- PROJECT UDAAN — Development seed data
--
-- ⚠️  DEVELOPMENT ONLY. Do not run against production.
-- Everything here is prefixed "DEMO" on purpose so it can never
-- be mistaken for real organizational impact. Real projects,
-- campaigns and impact must be entered through /admin by a human
-- who can vouch for them.
-- ============================================================

insert into projects (name, slug, short_description, description, focus_area, status, visibility, funding_goal, target_beneficiaries)
values (
  'DEMO — Digital & Career Skills',
  'demo-digital-career-skills',
  'A practical learning program in digital literacy, AI awareness and career readiness.',
  'Development seed record. Replace with the real Project 01 once it is created by an admin.',
  'Digital Literacy · AI · Career Readiness',
  'preparing',
  'public',
  75000,
  30
);

insert into campaigns (name, slug, description, project_id, goal_amount, status)
select
  'DEMO — Digital & Career Skills Fund',
  'demo-digital-career-skills-fund',
  'Development seed campaign for local testing of the donation flow (mock payments only).',
  id,
  75000,
  'active'
from projects where slug = 'demo-digital-career-skills';

-- A DEMO impact metric, deliberately left unverified — this is the
-- default state, and it should stay unverified until a real admin
-- verifies real data. It will not appear on /impact until then.
insert into impact_metrics (project_id, metric_key, label, target, unit, verified)
select id, 'students_reached', 'Students reached', 30, 'count', false
from projects where slug = 'demo-digital-career-skills';

-- Note: volunteer/donor DEMO users are intentionally not seeded
-- here because they require real auth.users rows (created via
-- Supabase Auth, not plain SQL). Create a demo volunteer by
-- registering normally in the dev environment, then optionally
-- assign extra roles with:
--
--   insert into user_roles (user_id, role) values ('<uuid>', 'coordinator');
