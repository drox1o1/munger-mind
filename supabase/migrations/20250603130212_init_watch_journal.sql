create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  symbol text not null,
  name text,
  added_at timestamptz default now()
);

create table journal (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  symbol text,
  body text,
  created_at timestamptz default now()
);

-- Row-level security
alter table profiles enable row level security;
create policy "self" on profiles for select using ( auth.uid() = id );

alter table watchlist enable row level security;
create policy "owner" on watchlist for all using ( auth.uid() = user_id );

alter table journal enable row level security;
create policy "owner" on journal for all using ( auth.uid() = user_id ); 