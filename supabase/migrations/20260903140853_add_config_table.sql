create table config (
  label text primary key,
  value numeric not null
);

insert into config (label, value) values
  ('moderation_cost_usd', 0.001),
  ('ai_call_cost_usd', 0.008),
  ('spend_cap_usd', 20);

alter table config enable row level security;