create table v0_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  thread_id uuid not null,
  turn_number int not null,
  event_type text not null check (event_type in ('roast', 'argue')),
  content text,
  reaction text check (reaction in ('go_harder', 'bullshit')),
  moderation_flagged boolean not null default false,
  ai_call_succeeded boolean not null default false,
  shared boolean not null default false,
  created_at timestamptz not null default now()
);

create table spend_tracker (
  id int primary key default 1,
  total_estimated_cost numeric not null default 0,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into spend_tracker (id, total_estimated_cost) values (1, 0);