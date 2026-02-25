# Tutorial Simples - Importar Users ggLeap e Distinguir Cliente vs Staff

## Objetivo
Ficar com os utilizadores corretamente classificados no teu site:
- `player` = Cliente
- `staff` / `admin` = Trabalhador
- `source = 'ggcircuit_portal'` para users vindos do CSV ggLeap

---

## Passo 1) Executar SQL base (se ainda não fizeste)
No Supabase -> SQL Editor:
1. Executa `database.sql`
2. Executa `SQL_IMPORT_GGLEAP.sql`

---

## Passo 2) Importar o CSV para staging
No Supabase:
1. Vai a **Table Editor**
2. Abre a tabela `ggleap_users_staging`
3. Clica em **Import data from CSV**
4. Seleciona o ficheiro `users.csv`
5. Confirma import

Nota: esta tabela é apenas temporária para processamento.

---

## Passo 3) Marcar utilizadores do portal ggLeap
No SQL Editor, executa só este bloco (já está em `SQL_IMPORT_GGLEAP.sql`):

```sql
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
```

---

## Passo 4) Marcar staff/admin (opcional, recomendado)
```sql
update public.profiles
set source = 'ggleap_admin'
where role in ('admin', 'staff')
  and source in ('local', 'csv_import');
```

---

## Passo 5) Verificar resultado
```sql
select
  source,
  role,
  count(*) as total
from public.profiles
group by source, role
order by source, role;
```

---

## Como interpretar no Admin
No `admin.html` -> separador **Utilizadores**:
- Tipo = **Cliente** quando `role = player`
- Tipo = **Trabalhador** quando `role = staff/admin`
- Origem em `source` mostra de onde veio o utilizador

---

## Se algo não aparecer
1. Confirmar que o email no CSV bate certo com `auth.users.email`
2. Confirmar que o utilizador já existe em `profiles`
3. Executar novamente o bloco do Passo 3

---

## Ficheiros que vais usar
- `database.sql`
- `SQL_IMPORT_GGLEAP.sql`
- `TUTORIAL_IMPORT_GGLEAP.md`

