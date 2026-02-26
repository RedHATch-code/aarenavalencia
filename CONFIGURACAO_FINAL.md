# ⚙️ Arena Gaming Valencia — Configuração Final

Após o deploy do site, preenche os valores em `env.js` para ativar todas as funcionalidades.

---

## 1. Supabase (Auth + Base de dados)

1. Vai a [app.supabase.com](https://app.supabase.com) → o teu projeto
2. **Settings → API**
3. Copia:
   - **Project URL** → `SUPABASE_URL`  
   - A chave `anon/public` já está em `SUPABASE_PUBLISHABLE_KEY`

4. **Authentication → URL Configuration:**
   - Site URL: `https://SEU-SITE.netlify.app`
   - Redirect URLs: `https://SEU-SITE.netlify.app/perfil.html`

---

## 2. ggLeap / ggCircuit

### Portal de reservas (clientes)
- Vai ao teu painel ggCircuit → **Portal Settings → Customer Portal URL**
- Cola esse URL em `GGLEAP_PORTAL_URL` no `env.js`
- O site embed-o automaticamente em `reservas.html`

### Painel de gestão (staff/admin)
- URL do painel ggLeap admin: normalmente `https://app.ggcircuit.com` ou `https://SEU-LOCATION.ggcircuit.com/admin`
- Cola em `GGLEAP_ADMIN_URL` no `env.js`
- **Efeito:** quando um utilizador com role `staff` ou `admin` faz login no site, aparece automaticamente:
  - Um botão "Abrir painel ggLeap ↗" no topo do `admin.html`  
  - Uma notificação toast com link direto para o ggLeap

---

## 3. Pagamentos

| Campo | O que preencher |
|---|---|
| `PAYMENT_STRIPE_URL` | URL da sessão Stripe Checkout (ex: `https://buy.stripe.com/xxx`) |
| `PAYMENT_PAYPAL_URL` | URL do botão PayPal (gerado em paypal.com/buttons) |
| `PAYMENT_MBWAY_PHONE` | Número de telemóvel MB Way (ex: `+351912345678`) |

---

## 4. Netlify — Deploy automático (CI/CD)

Para que cada `git push` atualize o site automaticamente:

1. Vai a [app.netlify.com](https://app.netlify.com) → o teu site
2. **Site configuration → Build & deploy → Continuous deployment**
3. Liga ao teu repositório GitHub/GitLab
4. **Build command:** *(deixa vazio — é HTML estático)*
5. **Publish directory:** `.`

---

## 5. Domínio personalizado (opcional)

Em Netlify → **Domain management → Add custom domain:**
- Ex: `arenavalencia.gg` → configura o CNAME/A record no teu DNS
- HTTPS é automático via Let's Encrypt

---

## 6. Env.js preenchido (exemplo)

```js
window.SUPABASE_CONFIG = {
  SUPABASE_URL: "https://xyzxyz.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_...",
  PAYMENT_STRIPE_URL: "https://buy.stripe.com/test_xxx",
  PAYMENT_PAYPAL_URL: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=XXX",
  PAYMENT_MBWAY_PHONE: "+351912345678",
  GGLEAP_PORTAL_URL: "https://portal.ggcircuit.com/arena-valencia",
  GGLEAP_ADMIN_URL: "https://app.ggcircuit.com",
  GGLEAP_EMBED_IFRAME: true
};
```

---

## 7. Roles de utilizador (Supabase)

Para dar acesso admin/staff a um utilizador:

```sql
-- Substitui pelo UUID do utilizador em auth.users
UPDATE public.profiles SET role = 'admin' WHERE id = 'UUID-DO-UTILIZADOR';
-- ou
UPDATE public.profiles SET role = 'staff' WHERE id = 'UUID-DO-UTILIZADOR';
```

Com role `admin` ou `staff`:
- O link "Admin" aparece na navegação
- O painel ggLeap aparece como atalho em `admin.html`
- Toast de acesso rápido ao ggLeap aparece em qualquer página
