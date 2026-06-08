
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  location text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles readable by all authenticated" on public.profiles for select to authenticated using (true);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- animal status enum
create type public.animal_status as enum ('active','theft','sold','dead');
create type public.animal_species as enum ('cow','buffalo');

-- animals
create table public.animals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text,
  tag_id text,
  species public.animal_species not null default 'cow',
  breed text,
  ai_breed_confidence numeric,
  age_months int,
  color text,
  muzzle_image_url text not null,
  muzzle_hash text not null unique,
  bcs_score numeric,
  estimated_price_pkr numeric,
  status public.animal_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.animals (owner_id);
create index on public.animals (status);
alter table public.animals enable row level security;
-- Any signed-in user may view (theft scanning is global)
create policy "animals viewable by authenticated" on public.animals for select to authenticated using (true);
create policy "owner inserts animals" on public.animals for insert to authenticated with check (auth.uid() = owner_id);
create policy "owner updates animals" on public.animals for update to authenticated using (auth.uid() = owner_id);
create policy "owner deletes animals" on public.animals for delete to authenticated using (auth.uid() = owner_id);

-- transfers ledger
create type public.transfer_status as enum ('pending','accepted','rejected','cancelled');
create table public.ownership_transfers (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references public.animals(id) on delete cascade,
  from_user uuid not null references auth.users(id),
  to_user uuid not null references auth.users(id),
  status public.transfer_status not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index on public.ownership_transfers (animal_id);
alter table public.ownership_transfers enable row level security;
create policy "transfers visible to parties" on public.ownership_transfers for select to authenticated
  using (auth.uid() = from_user or auth.uid() = to_user);
create policy "owner creates transfer" on public.ownership_transfers for insert to authenticated
  with check (auth.uid() = from_user);
create policy "recipient updates transfer" on public.ownership_transfers for update to authenticated
  using (auth.uid() = to_user or auth.uid() = from_user);

-- updated_at trigger
create or replace function public.tg_set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger animals_updated_at before update on public.animals for each row execute function public.tg_set_updated_at();

-- profile auto-create
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'phone',''));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- storage bucket for muzzle images
insert into storage.buckets (id, name, public) values ('muzzles','muzzles', true);
create policy "muzzles public read" on storage.objects for select using (bucket_id = 'muzzles');
create policy "muzzles auth upload" on storage.objects for insert to authenticated with check (bucket_id = 'muzzles');
create policy "muzzles owner delete" on storage.objects for delete to authenticated using (bucket_id = 'muzzles' and owner = auth.uid());
