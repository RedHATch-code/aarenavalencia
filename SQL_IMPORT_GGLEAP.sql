-- Importação e marcação de utilizadores ggLeap/ggCircuit
-- Objetivo: marcar perfis existentes como source='ggcircuit_portal'
-- com base nos emails vindos do CSV (users.csv).

-- 1) Tabela de staging para importar o CSV do ggLeap
create table if not exists public.ggleap_users_staging (
  username text,
  email text,
  user_group text,
  first_name text,
  last_name text,
  date_of_birth text,
  phone_number text,
  post_pay_limit text,
  created_at text,
  last_visit text
);

-- 2) Limpar staging (opcional antes de novo upload)
-- truncate table public.ggleap_users_staging;

-- 3) Depois de importares o CSV para ggleap_users_staging (via Table Editor):
--    marcar perfis existentes no auth/profiles como ggcircuit_portal.
with cleaned_emails as (
  select lower(trim(email)) as email
  from public.ggleap_users_staging
  where email is not null
    and trim(email) <> ''
    and trim(email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  group by 1
)
update public.profiles p
set source = 'ggcircuit_portal'
from auth.users u
join cleaned_emails c
  on lower(u.email) = c.email
where p.id = u.id
  and p.source <> 'ggcircuit_portal';

-- 4) (Opcional) marcar staff/admin como origem backoffice
update public.profiles
set source = 'ggleap_admin'
where role in ('admin', 'staff')
  and source in ('local', 'csv_import');

-- 5) Relatório rápido
select
  source,
  role,
  count(*) as total
from public.profiles
group by source, role
order by source, role;

