const menuBtn = document.querySelector("#menuBtn");
const nav = document.querySelector("#mainNav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

const forms = document.querySelectorAll("form[data-demo='true']");
forms.forEach((form) => {
  if (form.closest("#tab-login, #tab-register, #tab-reset")) {
    return;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const msg = form.dataset.message || "Datos enviados con éxito.";
    alert(msg);
    form.reset();
  });
});

const tabButtons = document.querySelectorAll(".tab-btn");
if (tabButtons.length) {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document.querySelector(`#${target}`)?.classList.add("active");
    });
  });
}

const faqButtons = document.querySelectorAll(".faq-item button");
faqButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".faq-item")?.classList.toggle("open");
  });
});

const i18n = {
  es_cast: {
    nav_home: "Inicio",
    nav_services: "Servicios",
    nav_setup: "PCs & Setup",
    nav_events: "Eventos",
    nav_booking: "Reservas",
    nav_gallery: "Galería",
    nav_about: "Sobre Nosotros",
    nav_contact: "Contacto",
    nav_login: "Login",
    hero_brand: "Arena Gaming Valencia",
    hero_title: "Tu espacio gaming profesional en Valencia",
    hero_lead: "Centro de esports y entretenimiento digital para gamers casuales, competitivos, equipos y creadores. Rendimiento, comunidad y ambiente de torneo cada día.",
    hero_cta_book: "Reservar Ahora",
    hero_cta_events: "Ver Torneos",
    hero_cta_account: "Crear Cuenta",
    hero_highlights: "Destacados",
    hero_li_1: "Zona LAN con PCs de alto rendimiento",
    hero_li_2: "Torneos semanales con ranking",
    hero_li_3: "Eventos privados para equipos y empresas",
    hero_li_4: "Espacio para streaming y creación de contenido",
    services_title: "Servicios Principales",
    service_1_title: "PCs Gaming",
    service_1_text: "Estaciones con alta tasa de refresco y baja latencia para entrenamiento y competición.",
    service_2_title: "Torneos",
    service_2_text: "Competiciones de esports con estructura profesional y calendario mensual.",
    service_3_title: "Streaming",
    service_3_text: "Espacio preparado para creadores de contenido y emisiones locales.",
    service_4_title: "Eventos Privados",
    service_4_text: "Reserva del espacio para cumpleaños, equipos y team building gaming.",
    setup_title: "PCs & Setup Destacado",
    setup_tag: "Rendimiento",
    setup_card_title: "Setup Pro Arena",
    setup_card_text: "Monitores 240Hz, periféricos premium y máquinas optimizadas para juegos competitivos.",
    setup_cta: "Ver especificaciones",
    kpi_1: "Jugadores por día",
    kpi_2: "Abierto diariamente",
    kpi_3: "Eventos al mes",
    events_title: "Próximos Eventos",
    event_tag_1: "Viernes",
    event_tag_2: "Sábado",
    event_tag_3: "Domingo",
    event_text_1: "Formato competitivo 5v5 con premios y streaming local.",
    event_text_2: "Torneo abierto para la comunidad y equipos en formación.",
    event_text_3: "Sesiones libres con desafíos por objetivos y mini rankings.",
    events_cta: "Calendario Completo",
    gallery_title: "Galería Rápida",
    gallery_cta: "Ver Galería Completa",
    footer_text: "Gaming competitivo, comunidad fuerte y experiencias inmersivas en Valencia.",
    footer_links: "Enlaces",
    footer_book: "Reservas",
    footer_blog: "Blog",
    footer_contact: "Contacto"
  },
  es_latam: {
    nav_home: "Inicio",
    nav_services: "Servicios",
    nav_setup: "PCs y Setup",
    nav_events: "Eventos",
    nav_booking: "Reservas",
    nav_gallery: "Galería",
    nav_about: "Sobre Nosotros",
    nav_contact: "Contactos",
    nav_login: "Iniciar sesión",
    hero_brand: "Arena Gaming Valencia",
    hero_title: "Tu espacio gaming profesional en Valencia",
    hero_lead: "Centro de esports y entretenimiento digital para gamers casuales, competitivos, equipos y creadores. Rendimiento, comunidad y experiencia inmersiva todos los días.",
    hero_cta_book: "Reservar ahora",
    hero_cta_events: "Ver torneos",
    hero_cta_account: "Crear cuenta",
    hero_highlights: "Destacados",
    hero_li_1: "Zona LAN con PCs de alto desempeño",
    hero_li_2: "Torneos semanales con ranking",
    hero_li_3: "Eventos privados para equipos y empresas",
    hero_li_4: "Espacio para streaming y creación de contenido",
    services_title: "Servicios Principales",
    service_1_title: "PCs Gaming",
    service_1_text: "Estaciones con alta tasa de refresco y baja latencia para entrenamiento y competencia.",
    service_2_title: "Torneos",
    service_2_text: "Competencias de esports con estructura profesional y calendario mensual.",
    service_3_title: "Streaming",
    service_3_text: "Espacio preparado para creadores de contenido y transmisiones locales.",
    service_4_title: "Eventos privados",
    service_4_text: "Reserva del espacio para cumpleaños, equipos y team building gaming.",
    setup_title: "PCs y Setup Destacado",
    setup_tag: "Desempeño",
    setup_card_title: "Setup Pro Arena",
    setup_card_text: "Monitores de 240Hz, periféricos premium y máquinas optimizadas para juegos competitivos.",
    setup_cta: "Ver especificaciones",
    kpi_1: "Jugadores por día",
    kpi_2: "Abierto todos los días",
    kpi_3: "Eventos por mes",
    events_title: "Próximos Eventos",
    event_tag_1: "Viernes",
    event_tag_2: "Sábado",
    event_tag_3: "Domingo",
    event_text_1: "Formato competitivo 5v5 con premios y stream local.",
    event_text_2: "Torneo abierto para la comunidad y equipos en formación.",
    event_text_3: "Sesiones libres con desafíos por objetivos y mini rankings.",
    events_cta: "Calendario completo",
    gallery_title: "Galería rápida",
    gallery_cta: "Ver galería completa",
    footer_text: "Gaming competitivo, comunidad fuerte y experiencias inmersivas en Valencia.",
    footer_links: "Enlaces",
    footer_book: "Reservas",
    footer_blog: "Blog",
    footer_contact: "Contacto"
  },
  pt: {
    nav_home: "Início",
    nav_services: "Serviços",
    nav_setup: "PCs & Setup",
    nav_events: "Eventos",
    nav_booking: "Reservas",
    nav_gallery: "Galeria",
    nav_about: "Sobre Nós",
    nav_contact: "Contactos",
    nav_login: "Login",
    hero_brand: "Arena Gaming Valencia",
    hero_title: "O teu espaço gaming profissional em Valência",
    hero_lead: "Centro de esports e entretenimento digital para gamers casuais, competitivos, equipas e criadores. Performance, comunidade e vibe de torneio todos os dias.",
    hero_cta_book: "Reservar Agora",
    hero_cta_events: "Ver Torneios",
    hero_cta_account: "Criar Conta",
    hero_highlights: "Destaques",
    hero_li_1: "Zona LAN com PCs de alto desempenho",
    hero_li_2: "Torneios semanais com ranking",
    hero_li_3: "Eventos privados para equipas e empresas",
    hero_li_4: "Espaço para streaming e criação de conteúdo",
    services_title: "Serviços Principais",
    service_1_title: "PCs Gaming",
    service_1_text: "Estações com alta taxa de atualização e baixa latência para treino e competição.",
    service_2_title: "Torneios",
    service_2_text: "Competições de esports com estrutura profissional e calendário mensal.",
    service_3_title: "Streaming",
    service_3_text: "Espaço preparado para criadores de conteúdo e transmissões locais.",
    service_4_title: "Eventos Privados",
    service_4_text: "Reserva do espaço para aniversários, equipas e team building gaming.",
    setup_title: "PCs & Setup em Destaque",
    setup_tag: "Performance",
    setup_card_title: "Setup Pro Arena",
    setup_card_text: "Monitores 240Hz, periféricos premium e máquinas otimizadas para jogos competitivos.",
    setup_cta: "Ver especificações",
    kpi_1: "Jogadores por dia",
    kpi_2: "Aberto diariamente",
    kpi_3: "Eventos por mês",
    events_title: "Próximos Eventos",
    event_tag_1: "Sexta",
    event_tag_2: "Sábado",
    event_tag_3: "Domingo",
    event_text_1: "Formato competitivo 5v5 com prémios e stream local.",
    event_text_2: "Torneio aberto para comunidade e equipas em formação.",
    event_text_3: "Sessões livres com desafios por objetivos e mini rankings.",
    events_cta: "Calendário Completo",
    gallery_title: "Galeria Rápida",
    gallery_cta: "Ver Galeria Completa",
    footer_text: "Gaming competitivo, comunidade forte e experiências imersivas em Valência.",
    footer_links: "Links",
    footer_book: "Reservas",
    footer_blog: "Blog",
    footer_contact: "Contacto"
  },
  en: {
    nav_home: "Home",
    nav_services: "Services",
    nav_setup: "PCs & Setup",
    nav_events: "Events",
    nav_booking: "Bookings",
    nav_gallery: "Gallery",
    nav_about: "About Us",
    nav_contact: "Contact",
    nav_login: "Login",
    hero_brand: "Arena Gaming Valencia",
    hero_title: "Your professional gaming space in Valencia",
    hero_lead: "Esports and digital entertainment center for casual and competitive players, teams, and creators. Performance, community, and tournament energy every day.",
    hero_cta_book: "Book Now",
    hero_cta_events: "See Tournaments",
    hero_cta_account: "Create Account",
    hero_highlights: "Highlights",
    hero_li_1: "LAN zone with high-performance PCs",
    hero_li_2: "Weekly tournaments with ranking",
    hero_li_3: "Private events for teams and companies",
    hero_li_4: "Space for streaming and content creation",
    services_title: "Main Services",
    service_1_title: "Gaming PCs",
    service_1_text: "Stations with high refresh rate and low latency for training and competition.",
    service_2_title: "Tournaments",
    service_2_text: "Esports competitions with professional structure and monthly calendar.",
    service_3_title: "Streaming",
    service_3_text: "Area prepared for creators and local broadcasts.",
    service_4_title: "Private Events",
    service_4_text: "Venue booking for birthdays, teams, and gaming team building.",
    setup_title: "Featured PCs & Setup",
    setup_tag: "Performance",
    setup_card_title: "Pro Arena Setup",
    setup_card_text: "240Hz monitors, premium peripherals, and machines optimized for competitive games.",
    setup_cta: "See Specs",
    kpi_1: "Players per day",
    kpi_2: "Open daily",
    kpi_3: "Events per month",
    events_title: "Upcoming Events",
    event_tag_1: "Friday",
    event_tag_2: "Saturday",
    event_tag_3: "Sunday",
    event_text_1: "Competitive 5v5 format with prizes and local stream.",
    event_text_2: "Open tournament for community and rising teams.",
    event_text_3: "Free sessions with objective challenges and mini rankings.",
    events_cta: "Full Calendar",
    gallery_title: "Quick Gallery",
    gallery_cta: "View Full Gallery",
    footer_text: "Competitive gaming, strong community, and immersive experiences in Valencia.",
    footer_links: "Links",
    footer_book: "Bookings",
    footer_blog: "Blog",
    footer_contact: "Contact"
  },
  ru: {
    nav_home: "Главная",
    nav_services: "Услуги",
    nav_setup: "ПК и сетап",
    nav_events: "События",
    nav_booking: "Бронирование",
    nav_gallery: "Галерея",
    nav_about: "О нас",
    nav_contact: "Контакты",
    nav_login: "Вход",
    hero_brand: "Arena Gaming Valencia",
    hero_title: "Ваш профессиональный гейминг-пространство в Валенсии",
    hero_lead: "Центр киберспорта и цифровых развлечений для казуальных и соревновательных игроков, команд и создателей контента.",
    hero_cta_book: "Забронировать",
    hero_cta_events: "Смотреть турниры",
    hero_cta_account: "Создать аккаунт",
    hero_highlights: "Главное",
    hero_li_1: "LAN-зона с мощными ПК",
    hero_li_2: "Еженедельные турниры с рейтингом",
    hero_li_3: "Частные мероприятия для команд и компаний",
    hero_li_4: "Пространство для стриминга и контента",
    services_title: "Основные услуги",
    service_1_title: "Игровые ПК",
    service_1_text: "Станции с высокой частотой обновления и низкой задержкой для тренировок и соревнований.",
    service_2_title: "Турниры",
    service_2_text: "Киберспортивные соревнования с профессиональной организацией и ежемесячным календарем.",
    service_3_title: "Стриминг",
    service_3_text: "Зона для создателей контента и локальных трансляций.",
    service_4_title: "Частные события",
    service_4_text: "Бронирование площадки для дней рождения, команд и корпоративов.",
    setup_title: "Выделенный ПК и сетап",
    setup_tag: "Производительность",
    setup_card_title: "Pro Arena Setup",
    setup_card_text: "Мониторы 240 Гц, премиальные периферийные устройства и ПК для соревновательных игр.",
    setup_cta: "Смотреть характеристики",
    kpi_1: "Игроков в день",
    kpi_2: "Открыто ежедневно",
    kpi_3: "Событий в месяц",
    events_title: "Ближайшие события",
    event_tag_1: "Пятница",
    event_tag_2: "Суббота",
    event_tag_3: "Воскресенье",
    event_text_1: "Соревновательный формат 5v5 с призами и локальным стримом.",
    event_text_2: "Открытый турнир для сообщества и развивающихся команд.",
    event_text_3: "Свободные сессии с челленджами и мини-рейтингами.",
    events_cta: "Полный календарь",
    gallery_title: "Быстрая галерея",
    gallery_cta: "Открыть всю галерею",
    footer_text: "Соревновательный гейминг, сильное сообщество и иммерсивный опыт в Валенсии.",
    footer_links: "Ссылки",
    footer_book: "Бронирование",
    footer_blog: "Блог",
    footer_contact: "Контакты"
  }
};

function applyLanguage(lang) {
  const dict = i18n[lang] || i18n.es_cast;
  document.documentElement.lang = lang === "pt" ? "pt" : lang === "en" ? "en" : lang === "ru" ? "ru" : "es";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });
}

const languageSelect = document.querySelector("#languageSelect");
if (languageSelect) {
  const saved = localStorage.getItem("arena_lang") || "es_cast";
  languageSelect.value = saved;
  applyLanguage(saved);

  languageSelect.addEventListener("change", (event) => {
    const selected = event.target.value;
    localStorage.setItem("arena_lang", selected);
    applyLanguage(selected);
  });
}

// Interaction upgrade: cursor glow, card tilt, page transitions
(function enhanceExperience() {
  const body = document.body;

  // Enter animation
  requestAnimationFrame(() => body.classList.add("is-ready"));

  // Cursor reactive ambient light
  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    body.style.setProperty("--mx", `${x}%`);
    body.style.setProperty("--my", `${y}%`);
  });

  // Page transition overlay
  if (!document.querySelector(".page-transition")) {
    const overlay = document.createElement("div");
    overlay.className = "page-transition";
    body.appendChild(overlay);
  }

  document.querySelectorAll("a[href$='.html']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) {
        return;
      }

      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      body.classList.add("is-leaving");
      setTimeout(() => {
        window.location.href = target.href;
      }, 220);
    });
  });

  // 3D tilt hover cards
  const tiltItems = document.querySelectorAll(".card, .info-box, .blog-post, .timeline-item, .faq-item");
  tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 5;
      const ry = (px - 0.5) * 7;
      item.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
})();

// Loja: carrinho local (demo)
(function shopModule() {
  const hasShopArea = Boolean(document.querySelector("#shopProducts"));
  const cartItemsEl = document.querySelector("#cartItems");
  const cartTotalEl = document.querySelector("#cartTotal");
  const clearBtn = document.querySelector("#clearCartBtn");
  const checkoutBtn = document.querySelector("#checkoutBtn");
  const CART_KEY = "arena_cart_v1";

  if (!hasShopArea && !cartItemsEl) {
    return;
  }

  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const saveCart = (items) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  };

  const currency = (n) => `${n.toFixed(2).replace('.', ',')} €`;

  const renderCart = () => {
    if (!cartItemsEl || !cartTotalEl) {
      return;
    }

    const cart = readCart();
    if (!cart.length) {
      cartItemsEl.innerHTML = '<p class="lead">O carrinho está vazio.</p>';
      cartTotalEl.textContent = "0,00 €";
      return;
    }

    let total = 0;
    cartItemsEl.innerHTML = cart
      .map((item) => {
        const line = item.price * item.qty;
        total += line;
        return `<div class="cart-item"><p><strong>${item.name}</strong><br><span class="qty-badge">Qtd: ${item.qty}</span></p><p>${currency(line)}</p><button class="remove-item" data-remove-id="${item.id}">Remover</button></div>`;
      })
      .join("");

    cartTotalEl.textContent = currency(total);

    cartItemsEl.querySelectorAll("[data-remove-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-remove-id");
        const updated = readCart().filter((x) => x.id !== id);
        saveCart(updated);
        renderCart();
      });
    });
  };

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-add-to-cart]");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    const name = btn.getAttribute("data-name");
    const price = Number(btn.getAttribute("data-price") || 0);
    if (!id || !name || Number.isNaN(price)) return;

    const cart = readCart();
    const existing = cart.find((x) => x.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    saveCart(cart);
    renderCart();
    alert("Produto adicionado ao carrinho.");
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      saveCart([]);
      renderCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = readCart();
      if (!cart.length) {
        alert("Adiciona produtos ao carrinho primeiro.");
        return;
      }
      window.location.href = "pagamento.html";
    });
  }

  renderCart();
})();

// Extra i18n key for store link in Home
(function storeNavI18n() {
  const labels = {
    es_cast: "Tienda",
    es_latam: "Tienda",
    pt: "Loja",
    en: "Store",
    ru: "Магазин"
  };

  const apply = (lang) => {
    const text = labels[lang] || labels.es_cast;
    document.querySelectorAll('[data-i18n="nav_store"]').forEach((el) => {
      el.textContent = text;
    });
  };

  const lang = localStorage.getItem("arena_lang") || "es_cast";
  apply(lang);

  const languageSelectEl = document.querySelector("#languageSelect");
  if (languageSelectEl) {
    languageSelectEl.addEventListener("change", (event) => apply(event.target.value));
  }
})();

// Supabase integration + admin panel + payments
(function supabaseSuite() {
  const cfg = window.SUPABASE_CONFIG || {};
  const hasSupabaseLib = typeof window.supabase !== "undefined" && typeof window.supabase.createClient === "function";
  const canInit = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_PUBLISHABLE_KEY && hasSupabaseLib);
  const CART_KEY = "arena_cart_v1";

  if (!canInit) {
    const adminStatus = document.querySelector("#adminStatus");
    if (adminStatus) {
      adminStatus.textContent = "Configura SUPABASE_URL e carrega o cliente Supabase para ativar o admin.";
    }
    return;
  }

  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY);

  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const formatEUR = (n) => `${Number(n).toFixed(2).replace('.', ',')} €`;

  async function getSessionWithProfile() {
    const { data: sData } = await sb.auth.getSession();
    const session = sData?.session || null;
    if (!session) {
      return { session: null, profile: null };
    }

    const { data: profile } = await sb
      .from("profiles")
      .select("id, role, full_name, username")
      .eq("id", session.user.id)
      .maybeSingle();

    return { session, profile: profile || null };
  }

  function ensureAdminLink(isAdmin) {
    const nav = document.querySelector("#mainNav");
    if (!nav) return;
    let adminLink = nav.querySelector("a[data-admin-link]");

    if (isAdmin && !adminLink) {
      adminLink = document.createElement("a");
      adminLink.href = "admin.html";
      adminLink.dataset.adminLink = "true";
      adminLink.textContent = "Admin";
      nav.appendChild(adminLink);
    }

    if (!isAdmin && adminLink) {
      adminLink.remove();
    }
  }

  async function setupLoginPage() {
    const loginForm = document.querySelector("#tab-login form");
    const registerForm = document.querySelector("#tab-register form");
    const resetForm = document.querySelector("#tab-reset form");

    if (!loginForm && !registerForm && !resetForm) {
      return;
    }

    [loginForm, registerForm, resetForm].forEach((form) => form?.removeAttribute("data-demo"));

    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = loginForm.querySelector('input[type="email"]')?.value?.trim();
        const password = loginForm.querySelector('input[type="password"]')?.value;
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) {
          alert(`Erro no login: ${error.message}`);
          return;
        }
        alert("Login efetuado com sucesso.");
        window.location.href = "perfil.html";
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = registerForm.querySelector('input[type="text"]')?.value?.trim();
        const email = registerForm.querySelector('input[type="email"]')?.value?.trim();
        const password = registerForm.querySelector('input[type="password"]')?.value;

        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });

        if (error) {
          alert(`Erro no registo: ${error.message}`);
          return;
        }

        const uid = data?.user?.id;
        if (uid) {
          await sb.from("profiles").upsert({ id: uid, full_name: name, role: "player" });
        }

        alert("Conta criada. Verifica o teu email para confirmação (se ativo no Supabase).");
      });
    }

    if (resetForm) {
      resetForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = resetForm.querySelector('input[type="email"]')?.value?.trim();
        const { error } = await sb.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login.html`
        });
        if (error) {
          alert(`Erro: ${error.message}`);
          return;
        }
        alert("Email de recuperação enviado.");
      });
    }
  }

  async function setupAdminPage() {
    const adminStatus = document.querySelector("#adminStatus");
    const panel = document.querySelector("#adminPanel");
    if (!adminStatus || !panel) {
      return;
    }

    const { session, profile } = await getSessionWithProfile();
    const isAdmin = Boolean(session && profile && ["admin", "staff"].includes(profile.role));
    ensureAdminLink(isAdmin);

    if (!session) {
      adminStatus.textContent = "Precisas de fazer login para aceder ao painel.";
      return;
    }

    if (!isAdmin) {
      adminStatus.textContent = "Sem permissão: esta conta não é administradora.";
      return;
    }

    adminStatus.textContent = `Acesso autorizado (${profile.role}).`;
    panel.style.display = "block";

    const paymentConfigStatus = document.querySelector("#paymentConfigStatus");
    if (paymentConfigStatus) {
      const stripe = cfg.PAYMENT_STRIPE_URL ? "Stripe OK" : "Stripe em falta";
      const paypal = cfg.PAYMENT_PAYPAL_URL ? "PayPal OK" : "PayPal em falta";
      const mbway = cfg.PAYMENT_MBWAY_PHONE ? "MB Way OK" : "MB Way em falta";
      paymentConfigStatus.textContent = `${stripe} | ${paypal} | ${mbway}`;
    }

    const productsListEl = document.querySelector("#adminProductsList");
    const eventsListEl = document.querySelector("#adminEventsList");
    const productForm = document.querySelector("#productForm");
    const eventForm = document.querySelector("#eventForm");

    const loadProducts = async () => {
      if (!productsListEl) return;
      const { data, error } = await sb
        .from("products")
        .select("id, name, price_eur, stock, is_active")
        .order("created_at", { ascending: false });

      if (error) {
        productsListEl.innerHTML = `<p>${error.message}</p>`;
        return;
      }

      if (!data?.length) {
        productsListEl.innerHTML = "<p>Sem produtos.</p>";
        return;
      }

      productsListEl.innerHTML = data
        .map((p) => `<div class="admin-item"><p><strong>${p.name}</strong><br>${formatEUR(p.price_eur)} | Stock: ${p.stock} | ${p.is_active ? "Ativo" : "Inativo"}</p><button class="remove-item" data-del-product="${p.id}">Eliminar</button></div>`)
        .join("");

      productsListEl.querySelectorAll("[data-del-product]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-del-product");
          const { error: delError } = await sb.from("products").delete().eq("id", id);
          if (delError) {
            alert(delError.message);
            return;
          }
          loadProducts();
        });
      });
    };

    const loadEvents = async () => {
      if (!eventsListEl) return;
      const { data, error } = await sb
        .from("events")
        .select("id, title, starts_at, event_type")
        .order("starts_at", { ascending: true });

      if (error) {
        eventsListEl.innerHTML = `<p>${error.message}</p>`;
        return;
      }

      if (!data?.length) {
        eventsListEl.innerHTML = "<p>Sem eventos.</p>";
        return;
      }

      eventsListEl.innerHTML = data
        .map((e) => `<div class="admin-item"><p><strong>${e.title}</strong><br>${new Date(e.starts_at).toLocaleString()} | ${e.event_type}</p><button class="remove-item" data-del-event="${e.id}">Eliminar</button></div>`)
        .join("");

      eventsListEl.querySelectorAll("[data-del-event]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-del-event");
          const { error: delError } = await sb.from("events").delete().eq("id", id);
          if (delError) {
            alert(delError.message);
            return;
          }
          loadEvents();
        });
      });
    };

    productForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        name: document.querySelector("#pName")?.value?.trim(),
        description: document.querySelector("#pDescription")?.value?.trim() || null,
        price_eur: Number(document.querySelector("#pPrice")?.value || 0),
        image_url: document.querySelector("#pImage")?.value?.trim() || null,
        stock: Number(document.querySelector("#pStock")?.value || 0),
        is_active: document.querySelector("#pActive")?.value === "true",
        created_by: session.user.id
      };

      const { error } = await sb.from("products").insert(payload);
      if (error) {
        alert(error.message);
        return;
      }

      productForm.reset();
      loadProducts();
    });

    eventForm?.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { data: arena } = await sb.from("arenas").select("id").limit(1).maybeSingle();
      if (!arena?.id) {
        alert("Não existe arena configurada na base de dados.");
        return;
      }

      const startLocal = document.querySelector("#eStart")?.value;
      const endLocal = document.querySelector("#eEnd")?.value;
      const payload = {
        arena_id: arena.id,
        title: document.querySelector("#eTitle")?.value?.trim(),
        description: document.querySelector("#eDescription")?.value?.trim() || null,
        event_type: document.querySelector("#eType")?.value || "other",
        starts_at: startLocal ? new Date(startLocal).toISOString() : null,
        ends_at: endLocal ? new Date(endLocal).toISOString() : null,
        max_participants: Number(document.querySelector("#eMax")?.value || 0) || null,
        is_public: true,
        created_by: session.user.id
      };

      const { error } = await sb.from("events").insert(payload);
      if (error) {
        alert(error.message);
        return;
      }

      eventForm.reset();
      loadEvents();
    });

    loadProducts();
    loadEvents();
  }

  async function setupCheckoutPage() {
    const checkoutItems = document.querySelector("#checkoutItems");
    const checkoutTotal = document.querySelector("#checkoutTotal");
    const payStripeBtn = document.querySelector("#payStripeBtn");
    const payPaypalBtn = document.querySelector("#payPaypalBtn");
    const payMbwayBtn = document.querySelector("#payMbwayBtn");
    const statusEl = document.querySelector("#checkoutStatus");
    const mbwayInfo = document.querySelector("#mbwayInfo");

    if (!checkoutItems || !checkoutTotal) {
      return;
    }

    const cart = readCart();
    if (!cart.length) {
      checkoutItems.innerHTML = "<p>O carrinho está vazio.</p>";
      checkoutTotal.textContent = "0,00 €";
      payStripeBtn && (payStripeBtn.disabled = true);
      payPaypalBtn && (payPaypalBtn.disabled = true);
      payMbwayBtn && (payMbwayBtn.disabled = true);
      return;
    }

    let total = 0;
    checkoutItems.innerHTML = cart
      .map((item) => {
        const line = item.price * item.qty;
        total += line;
        return `<div class="cart-item"><p><strong>${item.name}</strong><br><span class="qty-badge">Qtd: ${item.qty}</span></p><p>${formatEUR(line)}</p><span></span></div>`;
      })
      .join("");

    checkoutTotal.textContent = formatEUR(total);

    const { session } = await getSessionWithProfile();
    if (!session) {
      statusEl && (statusEl.textContent = "Faz login para registar a encomenda no sistema.");
    }

    const createOrder = async (method) => {
      if (!session) {
        return { error: { message: "Precisas de login para pagar." } };
      }

      const orderPayload = {
        user_id: session.user.id,
        customer_email: session.user.email,
        amount_total: total,
        currency: "EUR",
        status: "pending",
        payment_method: method
      };

      const { data: order, error } = await sb.from("orders").insert(orderPayload).select("id").single();
      if (error) return { error };

      const itemsPayload = cart.map((item) => ({
        order_id: order.id,
        product_id: null,
        product_name: item.name,
        qty: item.qty,
        unit_price: item.price,
        line_total: item.price * item.qty
      }));

      const { error: itemErr } = await sb.from("order_items").insert(itemsPayload);
      if (itemErr) return { error: itemErr };

      return { orderId: order.id };
    };

    payStripeBtn?.addEventListener("click", async () => {
      const { error } = await createOrder("stripe");
      if (error) {
        alert(error.message);
        return;
      }

      if (cfg.PAYMENT_STRIPE_URL) {
        window.location.href = cfg.PAYMENT_STRIPE_URL;
        return;
      }
      alert("Define PAYMENT_STRIPE_URL em env.js para ativar Stripe.");
    });

    payPaypalBtn?.addEventListener("click", async () => {
      const { error } = await createOrder("paypal");
      if (error) {
        alert(error.message);
        return;
      }

      if (cfg.PAYMENT_PAYPAL_URL) {
        window.location.href = cfg.PAYMENT_PAYPAL_URL;
        return;
      }
      alert("Define PAYMENT_PAYPAL_URL em env.js para ativar PayPal.");
    });

    payMbwayBtn?.addEventListener("click", async () => {
      const { orderId, error } = await createOrder("mbway");
      if (error) {
        alert(error.message);
        return;
      }

      const ref = `MBW-${String(orderId).slice(0, 8).toUpperCase()}`;
      await sb.from("orders").update({ payment_reference: ref }).eq("id", orderId);
      mbwayInfo && (mbwayInfo.textContent = `Referência MB Way: ${ref} | Contacto: ${cfg.PAYMENT_MBWAY_PHONE || "(configurar em env.js)"}`);
      statusEl && (statusEl.textContent = "Pedido criado. Conclui o pagamento por MB Way e depois confirma manualmente no backoffice.");
      localStorage.setItem(CART_KEY, "[]");
    });
  }

  async function setupStorePage() {
    const shopGrid = document.querySelector("#shopProducts");
    if (!shopGrid) return;

    const { data, error } = await sb
      .from("products")
      .select("id, name, description, price_eur, image_url, is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return;
    }

    const fallbackShots = ["shot-1", "shot-2", "shot-3", "shot-4", "shot-5", "shot-6"];
    shopGrid.innerHTML = data
      .map((p, idx) => {
        const shotClass = fallbackShots[idx % fallbackShots.length];
        const photo = p.image_url
          ? `<div class="product-photo shot" style="background-image:url('${String(p.image_url).replace(/'/g, "%27")}')"></div>`
          : `<div class="product-photo shot ${shotClass}"></div>`;

        return `<article class="card product-card">
          ${photo}
          <h3>${p.name}</h3>
          <p>${p.description || "Produto oficial Arena Gaming Valencia."}</p>
          <p class="price">${formatEUR(p.price_eur)}</p>
          <button class="btn btn-primary" data-add-to-cart data-id="${p.id}" data-name="${p.name.replace(/"/g, "&quot;")}" data-price="${p.price_eur}">Adicionar ao carrinho</button>
        </article>`;
      })
      .join("");
  }

  async function bootstrapRoleNav() {
    const { session, profile } = await getSessionWithProfile();
    const isAdmin = Boolean(session && profile && ["admin", "staff"].includes(profile.role));
    ensureAdminLink(isAdmin);
  }

  setupLoginPage();
  setupAdminPage();
  setupCheckoutPage();
  setupStorePage();
  bootstrapRoleNav();
})();

