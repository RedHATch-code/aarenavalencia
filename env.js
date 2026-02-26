// ================================================================
//  ARENA GAMING VALENCIA — Configuração do frontend
//  Preenche os campos abaixo e guarda o ficheiro.
//  Nunca partilhes este ficheiro publicamente com chaves privadas.
// ================================================================
window.SUPABASE_CONFIG = {

  // ── Supabase ──────────────────────────────────────────────────
  // Vai a https://app.supabase.com → o teu projeto → Settings → API
  // Copia "Project URL" para SUPABASE_URL
  SUPABASE_URL: "https://vglpakdfljeyxxvuoveo.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_wL8-DblATn2HzQvPiluvRQ_4BoHORKg",

  // ── Pagamentos ────────────────────────────────────────────────
  // URL da sessão de checkout Stripe (ex: https://buy.stripe.com/xxx)
  PAYMENT_STRIPE_URL: "",
  // URL do botão PayPal (ex: https://www.paypal.com/cgi-bin/webscr?...)
  PAYMENT_PAYPAL_URL: "",
  // Número de telefone para MB Way (ex: "+351912345678")
  PAYMENT_MBWAY_PHONE: "",

  // ── ggLeap / ggCircuit ────────────────────────────────────────
  // URL do portal de reservas para clientes
  // (ex: https://portal.ggcircuit.com/arena-valencia ou URL personalizado)
  GGLEAP_PORTAL_URL: "",

  // URL do painel de gestão para staff/admin
  // (ex: https://app.ggcircuit.com ou https://arena-valencia.ggcircuit.com/admin)
  GGLEAP_ADMIN_URL: "",

  // Define como false para desativar o embed iframe do portal
  GGLEAP_EMBED_IFRAME: true
};
