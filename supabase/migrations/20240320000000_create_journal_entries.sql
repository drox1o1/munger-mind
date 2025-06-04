create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  scrip_id uuid references scrips(id) on delete cascade not null,
  type text not null check (type in ('analysis', 'trade')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an index on scrip_id for faster lookups
create index if not exists journal_entries_scrip_id_idx on journal_entries(scrip_id);

-- Create a function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create a trigger to automatically update the updated_at column
create trigger update_journal_entries_updated_at
  before update on journal_entries
  for each row
  execute function update_updated_at_column(); 