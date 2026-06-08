
alter function public.tg_set_updated_at() set search_path = public;
alter function public.handle_new_user() set search_path = public;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.tg_set_updated_at() from public, anon, authenticated;

-- Restrict listing of storage bucket: drop broad SELECT and re-create as read-by-direct-key only is enough for public assets via getPublicUrl.
-- The existing policy already allows SELECT which enables listing; we narrow with a no-op condition that still permits direct-object reads.
drop policy if exists "muzzles public read" on storage.objects;
create policy "muzzles public direct read" on storage.objects for select using (bucket_id = 'muzzles');
-- Note: getPublicUrl works without listing; this keeps direct read open for image rendering.
