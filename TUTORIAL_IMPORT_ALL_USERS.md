# Importar todos os users do CSV para Supabase

## 1) Definir variáveis (PowerShell)

```powershell
$env:SUPABASE_URL="https://SEU-PROJETO.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="SUA_SERVICE_ROLE_KEY"
$env:CSV_PATH="c:\Users\tiago\Downloads\users_supabase_clean.csv"
```

## 2) Correr importador

```powershell
node scripts/import_all_users_to_supabase.mjs
```

## 3) Verificar resultado no SQL Editor

```sql
select count(*) from auth.users;
select source, role, count(*) from public.profiles group by source, role order by source, role;
```

## Notas
- `SUPABASE_SERVICE_ROLE_KEY` é segredo. Nunca publicar no GitHub.
- O script cria users em Auth com password temporária aleatória e marca `source='ggcircuit_portal'`.
- Emails já existentes são ignorados.
