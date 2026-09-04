create table api_errors (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status int,
  error_details text,
  created_at timestamptz not null default now()
);

alter table api_errors enable row level security;