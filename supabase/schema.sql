-- Run this in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Consultations
create table public.consultations (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  email               text not null,
  phone               text not null,
  message             text,
  plan_selected       text,
  amount_paise        integer,
  payment_status      text not null default 'pending'
                        check (payment_status in ('pending', 'paid', 'failed')),
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  razorpay_signature  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Contacts
create table public.contacts (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_consultations_updated
  before update on public.consultations
  for each row execute procedure public.handle_updated_at();

-- Row Level Security
alter table public.consultations enable row level security;
alter table public.contacts enable row level security;

-- Service role (used by server API routes) gets full access
-- Anon has no access — all writes go through server-side API routes
create policy "service_role_all_consultations"
  on public.consultations for all
  to service_role
  using (true)
  with check (true);

create policy "service_role_all_contacts"
  on public.contacts for all
  to service_role
  using (true)
  with check (true);

-- Performance indexes
create index consultations_created_at_idx on public.consultations(created_at desc);
create index contacts_created_at_idx on public.contacts(created_at desc);
create index consultations_payment_status_idx on public.consultations(payment_status);
