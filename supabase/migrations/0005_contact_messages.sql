-- ============================================================
-- PROJECT UDAAN — Contact messages (Migration 0005)
-- Small addition: a place for the public /contact form to land,
-- readable only by staff.
-- ============================================================

create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Anyone (including anonymous visitors) can submit a message, but
-- nobody can read it back through the API — only staff, via the
-- admin panel, can list them.
create policy "contact_messages_insert_anyone" on contact_messages
  for insert with check (true);

create policy "contact_messages_select_staff" on contact_messages
  for select using (is_staff());
