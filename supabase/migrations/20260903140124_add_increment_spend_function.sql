create or replace function increment_spend(amount numeric)
returns void as $$
begin
  update spend_tracker
  set total_estimated_cost = total_estimated_cost + amount,
      updated_at = now()
  where id = 1;
end;
$$ language plpgsql;