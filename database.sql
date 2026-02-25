-- Arena Gaming Valencia - Supabase SQL Schema
-- Execute este script no SQL Editor do Supabase.

create extension if not exists pgcrypto;

-- =========================
-- Common helpers
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================
-- Profiles (linked to auth.users)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  role text not null default 'player' check (role in ('player', 'admin', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- =========================
-- Arena information
-- =========================
create table if not exists public.arenas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  country text not null,
  phone text,
  email text,
  opening_hours text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.arenas enable row level security;

drop policy if exists "arenas_public_read" on public.arenas;
create policy "arenas_public_read"
on public.arenas
for select
using (true);

drop trigger if exists trg_arenas_updated_at on public.arenas;
create trigger trg_arenas_updated_at
before update on public.arenas
for each row
execute function public.set_updated_at();

-- =========================
-- Gaming setups / stations
-- =========================
create table if not exists public.gaming_setups (
  id uuid primary key default gen_random_uuid(),
  arena_id uuid not null references public.arenas(id) on delete cascade,
  setup_code text not null unique,
  setup_type text not null check (setup_type in ('pc', 'console', 'private_room')),
  cpu text,
  gpu text,
  ram text,
  monitor text,
  peripherals text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gaming_setups enable row level security;

drop policy if exists "setups_public_read" on public.gaming_setups;
create policy "setups_public_read"
on public.gaming_setups
for select
using (true);

drop trigger if exists trg_setups_updated_at on public.gaming_setups;
create trigger trg_setups_updated_at
before update on public.gaming_setups
for each row
execute function public.set_updated_at();

-- =========================
-- Events / tournaments
-- =========================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  arena_id uuid not null references public.arenas(id) on delete cascade,
  title text not null,
  description text,
  event_type text not null check (event_type in ('tournament', 'community', 'private', 'other')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  max_participants integer,
  is_public boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read"
on public.events
for select
using (is_public = true);

drop policy if exists "events_auth_insert" on public.events;
create policy "events_auth_insert"
on public.events
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "events_owner_update" on public.events;
create policy "events_owner_update"
on public.events
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

-- =========================
-- Event registrations
-- =========================
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'registered' check (status in ('registered', 'cancelled', 'waitlist')),
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.event_registrations enable row level security;

drop policy if exists "registrations_select_own" on public.event_registrations;
create policy "registrations_select_own"
on public.event_registrations
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "registrations_insert_own" on public.event_registrations;
create policy "registrations_insert_own"
on public.event_registrations
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "registrations_update_own" on public.event_registrations;
create policy "registrations_update_own"
on public.event_registrations
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "registrations_delete_own" on public.event_registrations;
create policy "registrations_delete_own"
on public.event_registrations
for delete
to authenticated
using (user_id = auth.uid());

-- =========================
-- Reservations (bookings)
-- =========================
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  arena_id uuid not null references public.arenas(id) on delete cascade,
  setup_id uuid not null references public.gaming_setups(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_reservation_range check (end_time > start_time)
);

create index if not exists idx_reservations_setup_time on public.reservations(setup_id, start_time, end_time);
create index if not exists idx_reservations_user on public.reservations(user_id);

alter table public.reservations enable row level security;

drop policy if exists "reservations_select_own" on public.reservations;
create policy "reservations_select_own"
on public.reservations
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "reservations_insert_own" on public.reservations;
create policy "reservations_insert_own"
on public.reservations
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "reservations_update_own" on public.reservations;
create policy "reservations_update_own"
on public.reservations
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "reservations_delete_own" on public.reservations;
create policy "reservations_delete_own"
on public.reservations
for delete
to authenticated
using (user_id = auth.uid());

drop trigger if exists trg_reservations_updated_at on public.reservations;
create trigger trg_reservations_updated_at
before update on public.reservations
for each row
execute function public.set_updated_at();

-- =========================
-- Contact messages
-- =========================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "contact_insert_public" on public.contact_messages;
create policy "contact_insert_public"
on public.contact_messages
for insert
with check (true);

-- no select policy on purpose (messages are private)

-- =========================
-- Blog posts
-- =========================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  is_published boolean not null default false,
  published_at timestamptz,
  author_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "blog_public_read_published" on public.blog_posts;
create policy "blog_public_read_published"
on public.blog_posts
for select
using (is_published = true);

drop trigger if exists trg_blog_updated_at on public.blog_posts;
create trigger trg_blog_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

-- =========================
-- Seed data
-- =========================
insert into public.arenas (name, address, city, country, phone, email, opening_hours)
values (
  'Arena Gaming Valencia',
  'Calle Jerónima Galés 45',
  'Valencia',
  'España',
  '+34 960 000 000',
  'contacto@arenavalencia.gg',
  'Lunes a Domingo: 10:00 - 02:00'
)
on conflict do nothing;

insert into public.gaming_setups (arena_id, setup_code, setup_type, cpu, gpu, ram, monitor, peripherals)
select a.id, s.setup_code, s.setup_type, s.cpu, s.gpu, s.ram, s.monitor, s.peripherals
from public.arenas a
cross join (
  values
    ('PC-01', 'pc', 'Intel i7', 'RTX 4070', '32GB DDR5', '240Hz 1ms', 'Teclado mecánico + mouse esports'),
    ('PC-02', 'pc', 'Ryzen 7', 'RTX 4070', '32GB DDR5', '240Hz 1ms', 'Teclado mecánico + mouse esports'),
    ('CON-01', 'console', null, null, null, '120Hz', 'Mando pro'),
    ('TEAM-ROOM', 'private_room', null, null, null, null, 'Sala privada para equipos')
) as s(setup_code, setup_type, cpu, gpu, ram, monitor, peripherals)
where a.name = 'Arena Gaming Valencia'
on conflict (setup_code) do nothing;

insert into public.events (arena_id, title, description, event_type, starts_at, ends_at, max_participants, is_public)
select
  a.id,
  e.title,
  e.description,
  e.event_type,
  e.starts_at,
  e.ends_at,
  e.max_participants,
  true
from public.arenas a
cross join (
  values
    (
      'Night Ranked Clash',
      'Torneo competitivo 5v5 con premios y ranking mensual.',
      'tournament',
      now() + interval '5 day',
      now() + interval '5 day 4 hour',
      40
    ),
    (
      'Community Cup',
      'Evento abierto para la comunidad con equipos mixtos.',
      'community',
      now() + interval '9 day',
      now() + interval '9 day 3 hour',
      60
    ),
    (
      'Gaming Team Building',
      'Formato privado para empresas y grupos.',
      'private',
      now() + interval '14 day',
      now() + interval '14 day 3 hour',
      30
    )
) as e(title, description, event_type, starts_at, ends_at, max_participants)
where a.name = 'Arena Gaming Valencia'
and not exists (
  select 1
  from public.events ev
  where ev.title = e.title
);

-- =========================
-- Admin + Store extension
-- =========================

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid
      and p.role in ('admin', 'staff')
  );
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_eur numeric(10,2) not null check (price_eur >= 0),
  image_url text,
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active"
on public.products
for select
using (is_active = true or public.is_admin(auth.uid()));

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
on public.products
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
on public.products
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
on public.products
for delete
to authenticated
using (public.is_admin(auth.uid()));

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_email text,
  amount_total numeric(10,2) not null check (amount_total >= 0),
  currency text not null default 'EUR',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  payment_method text not null check (payment_method in ('stripe', 'paypal', 'mbway')),
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  qty integer not null check (qty > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  line_total numeric(10,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "orders_insert_auth" on public.orders;
create policy "orders_insert_auth"
on public.orders
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
on public.orders
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "order_items_insert_auth" on public.order_items;
create policy "order_items_insert_auth"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "order_items_select_own_or_admin" on public.order_items;
create policy "order_items_select_own_or_admin"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

-- Seed products
insert into public.products (name, description, price_eur, image_url, stock, is_active)
values
  ('Camisola Arena Pro', 'Merch oficial em tecido técnico respirável.', 29.90, null, 50, true),
  ('Mousepad XL RGB', 'Superfície speed/control para jogos competitivos.', 24.90, null, 80, true),
  ('Pack 5h Arena', 'Voucher para 5 horas de jogo em setup premium.', 39.90, null, 120, true)
on conflict do nothing;

-- =========================
-- Security hardening (gglea.com + anti-escalation)
-- =========================

create table if not exists public.admin_whitelist (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    left join auth.users u on u.id = p.id
    left join public.admin_whitelist w on lower(w.email) = lower(u.email)
    where p.id = uid
      and (
        p.role in ('admin', 'staff')
        or w.email is not null
      )
  );
$$;

create or replace function public.enforce_profile_security()
returns trigger
language plpgsql
security definer
as $$
declare
  actor uuid;
  actor_is_admin boolean;
  email_domain text;
begin
  actor := auth.uid();
  actor_is_admin := public.is_admin(actor);

  -- Force new non-admin users to player role
  if tg_op = 'INSERT' then
    if not actor_is_admin then
      new.role := 'player';
    end if;

    -- If email exists, enforce gglea.com domain
    if new.id is not null then
      select split_part(lower(u.email), '@', 2)
      into email_domain
      from auth.users u
      where u.id = new.id;

      if email_domain is not null and email_domain <> 'gglea.com' and not actor_is_admin then
        raise exception 'Solo se permiten cuentas @gglea.com';
      end if;
    end if;

    return new;
  end if;

  -- Prevent privilege escalation by non-admins
  if tg_op = 'UPDATE' then
    if new.role <> old.role and not actor_is_admin then
      raise exception 'No autorizado para cambiar role';
    end if;

    if new.id <> old.id and not actor_is_admin then
      raise exception 'No autorizado';
    end if;

    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_profiles_security on public.profiles;
create trigger trg_profiles_security
before insert or update on public.profiles
for each row
execute function public.enforce_profile_security();

-- Restrict event creation/updates to admins/staff only
drop policy if exists "events_auth_insert" on public.events;
drop policy if exists "events_owner_update" on public.events;
drop policy if exists "events_admin_insert" on public.events;
drop policy if exists "events_admin_update" on public.events;

create policy "events_admin_insert"
on public.events
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy "events_admin_update"
on public.events
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "events_admin_delete"
on public.events
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Optional: keep this updated with allowed admins by email
-- insert into public.admin_whitelist(email) values ('admin@gglea.com') on conflict do nothing;

-- =========================
-- User source + classification helper
-- =========================
alter table public.profiles
add column if not exists source text not null default 'local'
check (source in ('local', 'ggcircuit_portal', 'ggleap_admin', 'manual_admin', 'csv_import'));

create or replace function public.user_kind(role_value text)
returns text
language sql
immutable
as $$
  select case
    when role_value in ('admin', 'staff') then 'worker'
    else 'client'
  end;
$$;

-- Normalização de origem para registos antigos
update public.profiles
set source = 'local'
where source is null;

-- Exemplo para imports vindos do portal
-- update public.profiles set source = 'ggcircuit_portal' where id in (...);
-- update public.profiles set source = 'ggleap_admin' where role in ('admin','staff');
