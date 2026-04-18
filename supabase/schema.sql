-- Mini IPL — Supabase schema
-- Run this in the Supabase SQL editor for your project.

create table if not exists teams (
  id   text primary key,
  name text not null,
  color text not null
);

create table if not exists matches (
  id        uuid default gen_random_uuid() primary key,
  team1     text not null,
  team2     text not null,
  score1    int  not null,
  score2    int  not null,
  winner    text not null,
  status    text default 'completed',
  timestamp bigint default (extract(epoch from now()) * 1000)::bigint
);

-- Public read/write (private league app — tighten if needed)
alter table teams   enable row level security;
alter table matches enable row level security;

create policy "Public read teams"    on teams   for select using (true);
create policy "Public write teams"   on teams   for insert with check (true);
create policy "Public read matches"  on matches for select using (true);
create policy "Public write matches" on matches for insert with check (true);

-- Enable real-time for matches
alter publication supabase_realtime add table matches;

-- Add extra columns for owner and home ground
alter table teams add column if not exists full_name text;
alter table teams add column if not exists owner     text;
alter table teams add column if not exists ground    text;

alter table teams add column if not exists tagline   text;

-- Seed teams
insert into teams (id, name, full_name, color, owner, ground, tagline) values
  ('rcb', 'RCB', 'Royal Challengers Bengaluru', '#EC1C24', 'Srikant', 'M. Chinnaswamy Stadium, Bengaluru', 'Ee Sala Cup Namde'),
  ('csk', 'CSK', 'Chennai Super Kings',         '#FFCB05', 'KVD',     'MA Chidambaram Stadium, Chennai', 'Whistle Podu'),
  ('mi',  'MI',  'Mumbai Indians',              '#004BA0', 'Debu',    'Wankhede Stadium, Mumbai', 'Duniya Hila Denge'),
  ('kkr', 'KKR', 'Kolkata Knight Riders',       '#3A225D', 'Ekansh',  'Eden Gardens, Kolkata', 'Korbo Lorbo Jeetbo'),
  ('srh', 'SRH', 'Sunrisers Hyderabad',         '#FF6B35', 'Ashpak',  'Rajiv Gandhi Intl. Stadium, Hyderabad', 'Orange Fire')
on conflict (id) do update set 
  full_name = excluded.full_name,
  color = excluded.color,
  owner = excluded.owner,
  ground = excluded.ground,
  tagline = excluded.tagline;
