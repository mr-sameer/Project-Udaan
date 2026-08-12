-- ============================================================
-- PROJECT UDAAN — Storage buckets (Migration 0004)
-- Run this after 0001-0003. Requires storage schema (default
-- in every Supabase project).
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('public-assets', 'public-assets', true),
  ('project-media', 'project-media', true),
  ('private-documents', 'private-documents', false),
  ('contribution-evidence', 'contribution-evidence', false),
  ('certificates', 'certificates', false),
  ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- public-assets / project-media: anyone can read, only staff can write
create policy "public_assets_read" on storage.objects
  for select using (bucket_id in ('public-assets', 'project-media'));

create policy "public_assets_write_staff" on storage.objects
  for insert with check (
    bucket_id in ('public-assets', 'project-media') and is_staff()
  );

create policy "public_assets_update_staff" on storage.objects
  for update using (bucket_id in ('public-assets', 'project-media') and is_staff());

create policy "public_assets_delete_staff" on storage.objects
  for delete using (bucket_id in ('public-assets', 'project-media') and is_staff());

-- contribution-evidence: owner (folder = their user id) can upload/read
-- their own; staff can read all for verification. Never public.
create policy "evidence_owner_rw" on storage.objects
  for all using (
    bucket_id = 'contribution-evidence'
    and (auth.uid())::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'contribution-evidence'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "evidence_staff_read" on storage.objects
  for select using (bucket_id = 'contribution-evidence' and is_staff());

-- certificates: system-generated, owner can read their own; staff full access
create policy "certificates_owner_read" on storage.objects
  for select using (
    bucket_id = 'certificates'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "certificates_staff_all" on storage.objects
  for all using (bucket_id = 'certificates' and is_staff())
  with check (bucket_id = 'certificates' and is_staff());

-- receipts: owner can read their own; staff full access. Written only
-- by the server (service role) after a verified payment webhook.
create policy "receipts_owner_read" on storage.objects
  for select using (
    bucket_id = 'receipts'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "receipts_staff_all" on storage.objects
  for all using (bucket_id = 'receipts' and is_staff())
  with check (bucket_id = 'receipts' and is_staff());

-- private-documents: staff only (audited statements, internal PDFs, etc.)
create policy "private_documents_staff_all" on storage.objects
  for all using (bucket_id = 'private-documents' and is_staff())
  with check (bucket_id = 'private-documents' and is_staff());

-- ------------------------------------------------------------
-- Notes for the application layer:
--   - Client uploads to contribution-evidence/{user_id}/{filename}
--   - Client uploads to certificates/{user_id}/{filename} only via
--     a server action using the service-role key (never directly)
--   - Always request a signed URL (supabase.storage.from(bucket)
--     .createSignedUrl(path, expiresInSeconds)) for private buckets;
--     never store or expose a permanently-public URL for them.
-- ------------------------------------------------------------
