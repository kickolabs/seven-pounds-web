-- Add WhatsApp notification status tracking
-- Run in Supabase SQL Editor if upgrading an existing database

alter table public.contacts
  add column if not exists notification_status text not null default 'pending'
  check (notification_status in ('pending', 'sent', 'failed'));

alter table public.consultations
  add column if not exists notification_status text not null default 'pending'
  check (notification_status in ('pending', 'sent', 'failed'));

create index if not exists contacts_notification_status_idx
  on public.contacts(notification_status);

create index if not exists consultations_notification_status_idx
  on public.consultations(notification_status);
