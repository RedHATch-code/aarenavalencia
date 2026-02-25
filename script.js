/* ================================================================
   ARENA GAMING VALENCIA — script.js
   Interactions, i18n, Supabase integration, shop, admin, checkout
   ================================================================ */

/* ── 1. Toast Notification System ─────────────────────────────── */
function showToast(msg, type = 'info', duration = 4200) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  container.appendChild(el);

  // Double rAF ensures the element is in the DOM before the class is added
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('toast-visible'));
  });

  const hide = () => {
    el.classList.remove('toast-visible');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  };

  setTimeout(hide, duration);
}

/* ── 1b. Setup Wizard (fires if SUPABASE_URL not configured) ───── */
(function checkSetup() {
  const cfg = window.SUPABASE_CONFIG || {};
  if (!cfg.SUPABASE_URL) {
    // Non-blocking: shows once per session
    const key = 'arena_setup_warned';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    setTimeout(() => {
      showToast('⚠ SUPABASE_URL não configurado em env.js — auth e loja não funcionam.', 'warning', 8000);
    }, 1200);
  }
})();

/* ── 2. Button Loading State ───────────────────────────────────── */
function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add('is-loading');
    btn.innerHTML = '<span class="spinner"></span> A processar...';
  } else {
    btn.disabled = false;
    btn.classList.remove('is-loading');
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
  }
}

/* ── 3. Mobile Menu ────────────────────────────────────────────── */
(function initMobileMenu() {
  const menuBtn = document.querySelector('#menuBtn');
  const nav = document.querySelector('#mainNav');
  if (!menuBtn || !nav) return;

  const toggle = (open) => {
    const isOpen = open !== undefined ? open : !nav.classList.contains('open');
    nav.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.textContent = isOpen ? '✕' : '☰';
  };

  menuBtn.addEventListener('click', () => toggle());

  // Close when clicking a link
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) toggle(false);
  });

  // Close on outside click
  document.addEventListener('pointerdown', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
      toggle(false);
    }
  });
})();

/* ── 4. Demo Forms (non-auth) ──────────────────────────────────── */
(function initDemoForms() {
  const forms = document.querySelectorAll("form[data-demo='true']");
  forms.forEach((form) => {
    if (form.closest('#tab-login, #tab-register, #tab-reset')) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.dataset.message || 'Datos enviados con éxito.';
      showToast(msg, 'success');
      form.reset();
    });
  });
})();

/* ── 5. Tabs ───────────────────────────────────────────────────── */
(function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  if (!tabButtons.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));
      button.classList.add('active');
      document.querySelector(`#${target}`)?.classList.add('active');
    });
  });
})();

/* ── 6. FAQ ────────────────────────────────────────────────────── */
(function initFaq() {
  document.querySelectorAll('.faq-item button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      // Close others
      document.querySelectorAll('.faq-item.open').forEach((open) => {
        if (open !== item) open.classList.remove('open');
      });
      item?.classList.toggle('open');
    });
  });
})();

/* ── 7. i18n Dictionary ────────────────────────────────────────── */
const i18n = {
  es_cast: {
    nav_home: "Inicio",
    nav_services: "Servicios",
    nav_setup: "PCs & Setup",
    nav_events: "Eventos",
    nav_booking: "Reservas",
    nav_store: "Tienda",
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
    nav_store: "Tienda",
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
    nav_store: "Loja",
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
    nav_store: "Store",
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
    nav_store: "Магазин",
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

/* ── 8. Apply Language ─────────────────────────────────────────── */
function applyLanguage(lang) {
  const dict = i18n[lang] || i18n.es_cast;
  const htmlLang = lang === 'pt' ? 'pt' : lang === 'en' ? 'en' : lang === 'ru' ? 'ru' : 'es';
  document.documentElement.lang = htmlLang;

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) node.textContent = dict[key];
  });
}

/* ── 9. Language Switcher Init ─────────────────────────────────── */
(function initLanguage() {
  // Inject if not present
  if (!document.getElementById('languageSelect')) {
    const topbar = document.querySelector('.topbar');
    const menuBtn = document.querySelector('#menuBtn');
    if (topbar && menuBtn) {
      const div = document.createElement('div');
      div.className = 'lang-switch';
      div.innerHTML = `<select id="languageSelect" aria-label="Seleccionar idioma">
        <option value="es_cast">Castellano</option>
        <option value="pt">Português</option>
        <option value="en">English</option>
        <option value="es_latam">Español (Lat.)</option>
        <option value="ru">Русский</option>
      </select>`;
      topbar.insertBefore(div, menuBtn);
    }
  }

  const select = document.getElementById('languageSelect');
  if (!select) return;

  const saved = localStorage.getItem('arena_lang') || 'es_cast';
  select.value = saved;
  applyLanguage(saved);

  select.addEventListener('change', (e) => {
    const lang = e.target.value;
    localStorage.setItem('arena_lang', lang);
    applyLanguage(lang);
  });
})();

/* ── 10. Experience Enhancements ───────────────────────────────── */
(function enhanceExperience() {
  const body = document.body;

  // Page entry animation: add class first (synchronous, before paint), remove on rAF
  body.classList.add('is-entering');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => body.classList.remove('is-entering'));
  });

  // Cursor reactive ambient light
  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    body.style.setProperty('--mx', `${x}%`);
    body.style.setProperty('--my', `${y}%`);
  });

  // Page transition overlay
  if (!document.querySelector('.page-transition')) {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    body.appendChild(overlay);
  }

  document.querySelectorAll("a[href$='.html']").forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;

      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) return;

      e.preventDefault();
      body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = target.href; }, 230);
    });
  });

  // 3D tilt on cards
  const tiltItems = document.querySelectorAll('.card, .info-box, .blog-post, .timeline-item, .faq-item');
  tiltItems.forEach((item) => {
    item.addEventListener('pointermove', (e) => {
      const rect = item.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 5;
      const ry = (px - 0.5) * 7;
      item.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });
    item.addEventListener('pointerleave', () => {
      item.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // IntersectionObserver for .reveal elements
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));
})();

/* ── 11. Shop Module ───────────────────────────────────────────── */
(function shopModule() {
  const hasShopArea = Boolean(document.querySelector('#shopProducts'));
  const cartItemsEl = document.querySelector('#cartItems');
  const cartTotalEl = document.querySelector('#cartTotal');
  const clearBtn = document.querySelector('#clearCartBtn');
  const checkoutBtn = document.querySelector('#checkoutBtn');
  const CART_KEY = 'arena_cart_v1';

  if (!hasShopArea && !cartItemsEl) return;

  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  };

  const saveCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

  const currency = (n) => `${n.toFixed(2).replace('.', ',')} €`;

  const renderCart = () => {
    if (!cartItemsEl || !cartTotalEl) return;
    const cart = readCart();

    if (!cart.length) {
      cartItemsEl.innerHTML = '<p class="lead">O carrinho está vazio.</p>';
      cartTotalEl.textContent = '0,00 €';
      return;
    }

    let total = 0;
    cartItemsEl.innerHTML = cart.map((item) => {
      const line = item.price * item.qty;
      total += line;
      return `<div class="cart-item">
        <p><strong>${item.name}</strong><br><span class="qty-badge">Qtd: ${item.qty}</span></p>
        <p>${currency(line)}</p>
        <button class="remove-item" data-remove-id="${item.id}" aria-label="Remover ${item.name}">✕</button>
      </div>`;
    }).join('');

    cartTotalEl.textContent = currency(total);

    cartItemsEl.querySelectorAll('[data-remove-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove-id');
        saveCart(readCart().filter((x) => x.id !== id));
        renderCart();
      });
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    const price = Number(btn.getAttribute('data-price') || 0);
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
    showToast(`${name} adicionado ao carrinho.`, 'success');
  });

  clearBtn?.addEventListener('click', () => { saveCart([]); renderCart(); });

  checkoutBtn?.addEventListener('click', () => {
    const cart = readCart();
    if (!cart.length) {
      showToast('Adiciona produtos ao carrinho primeiro.', 'warning');
      return;
    }
    window.location.href = 'pagamento.html';
  });

  renderCart();
})();

/* ── 12. Supabase Suite ────────────────────────────────────────── */
(function supabaseSuite() {
  const cfg = window.SUPABASE_CONFIG || {};
  const hasSupabaseLib = typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function';
  const canInit = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_PUBLISHABLE_KEY && hasSupabaseLib);
  const CART_KEY = 'arena_cart_v1';

  if (!canInit) {
    const adminStatus = document.querySelector('#adminStatus');
    if (adminStatus) adminStatus.textContent = 'Configura SUPABASE_URL em env.js para ativar o admin.';
    return;
  }

  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY);

  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  };

  const formatEUR = (n) => `${Number(n).toFixed(2).replace('.', ',')} €`;

  /* ── Helpers ─────────────────────────────────────────────────── */
  async function getSessionWithProfile() {
    const { data: sData } = await sb.auth.getSession();
    const session = sData?.session || null;
    if (!session) return { session: null, profile: null };

    const { data: profile } = await sb
      .from('profiles')
      .select('id, role, full_name, username, source')
      .eq('id', session.user.id)
      .maybeSingle();

    return { session, profile: profile || null };
  }

  function ensureAdminLink(isAdmin) {
    const nav = document.querySelector('#mainNav');
    if (!nav) return;
    let adminLink = nav.querySelector('a[data-admin-link]');

    if (isAdmin && !adminLink) {
      adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.dataset.adminLink = 'true';
      adminLink.textContent = 'Admin';
      nav.appendChild(adminLink);
    }

    if (!isAdmin && adminLink) adminLink.remove();
  }

  function updateNavForSession(session, name) {
    const loginLink = document.querySelector('#navLoginLink');
    if (!loginLink) return;

    if (session) {
      const displayName = name || session.user.email?.split('@')[0] || 'Perfil';
      loginLink.href = 'perfil.html';
      loginLink.textContent = displayName;
      loginLink.removeAttribute('data-i18n');
    } else {
      loginLink.href = 'login.html';
      const lang = localStorage.getItem('arena_lang') || 'es_cast';
      const dict = i18n[lang] || i18n.es_cast;
      loginLink.textContent = dict.nav_login || 'Login';
      loginLink.setAttribute('data-i18n', 'nav_login');
    }
  }

  /* ── Login Page ──────────────────────────────────────────────── */
  async function setupLoginPage() {
    const loginForm = document.querySelector('#tab-login form');
    const registerForm = document.querySelector('#tab-register form');
    const resetForm = document.querySelector('#tab-reset form');

    if (!loginForm && !registerForm && !resetForm) return;

    [loginForm, registerForm, resetForm].forEach((f) => f?.removeAttribute('data-demo'));

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = loginForm.querySelector('[type="submit"]');
        const email = loginForm.querySelector('input[type="email"]')?.value?.trim();
        const password = loginForm.querySelector('input[type="password"]')?.value;

        setLoading(btn, true);
        const { error } = await sb.auth.signInWithPassword({ email, password });
        setLoading(btn, false);

        if (error) { showToast(`Erro no login: ${error.message}`, 'error'); return; }
        showToast('Login efetuado com sucesso!', 'success');
        setTimeout(() => { window.location.href = 'perfil.html'; }, 800);
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = registerForm.querySelector('[type="submit"]');
        const name = registerForm.querySelector('input[type="text"]')?.value?.trim();
        const email = registerForm.querySelector('input[type="email"]')?.value?.trim();
        const password = registerForm.querySelector('input[type="password"]')?.value;

        if (!email || !password) { showToast('Preenche todos os campos obrigatórios.', 'warning'); return; }
        if (password.length < 6) { showToast('A password deve ter pelo menos 6 caracteres.', 'warning'); return; }

        setLoading(btn, true);
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        setLoading(btn, false);

        if (error) { showToast(`Erro no registo: ${error.message}`, 'error'); return; }

        const uid = data?.user?.id;
        if (uid) {
          await sb.from('profiles').upsert({ id: uid, full_name: name, role: 'player', source: 'local' });
        }

        showToast('Conta criada! Verifica o teu email para confirmação.', 'success', 6000);
      });
    }

    if (resetForm) {
      resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = resetForm.querySelector('[type="submit"]');
        const email = resetForm.querySelector('input[type="email"]')?.value?.trim();

        setLoading(btn, true);
        const { error } = await sb.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login.html`
        });
        setLoading(btn, false);

        if (error) { showToast(`Erro: ${error.message}`, 'error'); return; }
        showToast('Email de recuperação enviado. Verifica a caixa de entrada.', 'success', 6000);
      });
    }
  }

  /* ── Perfil Page ─────────────────────────────────────────────── */
  async function setupPerfilPage() {
    const perfilForm = document.querySelector('#perfilForm');
    if (!perfilForm) return;

    const { session, profile } = await getSessionWithProfile();

    if (!session) {
      showToast('Precisas de fazer login para aceder ao perfil.', 'warning');
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
      return;
    }

    // Fill fields
    const nameInput = document.querySelector('#perfilName');
    const emailInput = document.querySelector('#perfilEmail');
    const nicknameInput = document.querySelector('#perfilNickname');
    const displayNameEl = document.querySelector('#perfilDisplayName');
    const levelEl = document.querySelector('#perfilLevel');
    const levelBadgeEl = document.querySelector('#perfilLevelBadge');
    const verifiedEl = document.querySelector('#perfilVerified');

    const displayName = profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Jogador';
    const role = profile?.role || 'player';
    const roleLabel = role === 'admin' ? 'Admin' : role === 'staff' ? 'Staff' : 'Player';
    const badgeClass = role === 'admin' ? 'badge-pink' : role === 'staff' ? 'badge-cyan' : 'badge-gold';

    if (nameInput) nameInput.value = profile?.full_name || session.user.user_metadata?.full_name || '';
    if (emailInput) emailInput.value = session.user.email || '';
    if (nicknameInput) nicknameInput.value = profile?.username || '';
    if (displayNameEl) displayNameEl.textContent = displayName;
    if (levelEl) levelEl.textContent = roleLabel;
    if (levelBadgeEl) levelBadgeEl.innerHTML = `<span class="badge ${badgeClass}">${roleLabel}</span>`;
    if (verifiedEl) verifiedEl.textContent = session.user.email_confirmed_at ? '✓ Verificado' : '⚠ Pendente';

    // Avatar
    const avatarEl = document.querySelector('#perfilAvatar');
    if (avatarEl) avatarEl.src = `https://i.pravatar.cc/68?u=${session.user.id}`;

    // Save profile
    perfilForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = perfilForm.querySelector('[type="submit"]');
      setLoading(btn, true);

      const { error } = await sb.from('profiles').upsert({
        id: session.user.id,
        full_name: nameInput?.value?.trim(),
        username: nicknameInput?.value?.trim()
      });

      setLoading(btn, false);
      if (error) { showToast(`Erro: ${error.message}`, 'error'); return; }
      showToast('Perfil atualizado com sucesso!', 'success');
    });

    // Logout
    const logoutBtn = document.querySelector('#logoutBtn');
    logoutBtn?.addEventListener('click', async () => {
      setLoading(logoutBtn, true);
      await sb.auth.signOut();
      showToast('Sessão terminada.', 'info');
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    });

    // Load booking history
    const historyTbody = document.querySelector('#perfilHistory tbody');
    if (historyTbody) {
      const { data: bookings, error: bErr } = await sb
        .from('bookings')
        .select('created_at, station_name, duration_hours, status')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!bErr && bookings?.length) {
        historyTbody.innerHTML = bookings.map((b) => `
          <tr>
            <td>${new Date(b.created_at).toLocaleDateString()}</td>
            <td>${b.station_name || 'PC Arena Pro'}</td>
            <td>${b.duration_hours}h</td>
            <td><span class="badge badge-${b.status === 'completed' ? 'green' : b.status === 'active' ? 'cyan' : 'pink'}">${b.status}</span></td>
          </tr>`).join('');
      }
    }
  }

  /* ── Admin Page ──────────────────────────────────────────────── */
  async function setupAdminPage() {
    const adminStatus = document.querySelector('#adminStatus');
    const panel = document.querySelector('#adminPanel');
    if (!adminStatus || !panel) return;

    const { session, profile } = await getSessionWithProfile();
    const isAdmin = Boolean(session && profile && ['admin', 'staff'].includes(profile.role));
    ensureAdminLink(isAdmin);

    if (!session) { adminStatus.textContent = 'Precisas de fazer login para aceder ao painel.'; return; }
    if (!isAdmin) { adminStatus.textContent = 'Sem permissão: esta conta não é administradora.'; return; }

    adminStatus.innerHTML = `Acesso autorizado <span class="badge badge-cyan">${profile.role}</span>`;
    panel.style.display = 'block';

    const paymentConfigStatus = document.querySelector('#paymentConfigStatus');
    if (paymentConfigStatus) {
      const stripe = cfg.PAYMENT_STRIPE_URL ? '<span class="badge badge-green">Stripe OK</span>' : '<span class="badge badge-pink">Stripe em falta</span>';
      const paypal = cfg.PAYMENT_PAYPAL_URL ? '<span class="badge badge-green">PayPal OK</span>' : '<span class="badge badge-pink">PayPal em falta</span>';
      const mbway = cfg.PAYMENT_MBWAY_PHONE ? '<span class="badge badge-green">MB Way OK</span>' : '<span class="badge badge-pink">MB Way em falta</span>';
      paymentConfigStatus.innerHTML = `${stripe} &nbsp; ${paypal} &nbsp; ${mbway}`;
    }

    const productsListEl = document.querySelector('#adminProductsList');
    const eventsListEl = document.querySelector('#adminEventsList');
    const usersListEl = document.querySelector('#adminUsersList');
    const productForm = document.querySelector('#productForm');
    const eventForm = document.querySelector('#eventForm');
    const userRoleFilter = document.querySelector('#userRoleFilter');
    const userSourceFilter = document.querySelector('#userSourceFilter');
    const reloadUsersBtn = document.querySelector('#reloadUsersBtn');

    const loadProducts = async () => {
      if (!productsListEl) return;
      const { data, error } = await sb
        .from('products')
        .select('id, name, price_eur, stock, is_active')
        .order('created_at', { ascending: false });

      if (error) { productsListEl.innerHTML = `<p>${error.message}</p>`; return; }
      if (!data?.length) { productsListEl.innerHTML = '<p>Sem produtos.</p>'; return; }

      productsListEl.innerHTML = data.map((p) =>
        `<div class="admin-item">
          <p><strong>${p.name}</strong><br>${formatEUR(p.price_eur)} &nbsp; Stock: ${p.stock} &nbsp; <span class="badge ${p.is_active ? 'badge-green' : 'badge-pink'}">${p.is_active ? 'Ativo' : 'Inativo'}</span></p>
          <button class="remove-item" data-del-product="${p.id}" aria-label="Eliminar ${p.name}">✕</button>
        </div>`
      ).join('');

      productsListEl.querySelectorAll('[data-del-product]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-del-product');
          const { error: delError } = await sb.from('products').delete().eq('id', id);
          if (delError) { showToast(delError.message, 'error'); return; }
          showToast('Produto eliminado.', 'info');
          loadProducts();
        });
      });
    };

    const loadEvents = async () => {
      if (!eventsListEl) return;
      const { data, error } = await sb
        .from('events')
        .select('id, title, starts_at, event_type')
        .order('starts_at', { ascending: true });

      if (error) { eventsListEl.innerHTML = `<p>${error.message}</p>`; return; }
      if (!data?.length) { eventsListEl.innerHTML = '<p>Sem eventos.</p>'; return; }

      eventsListEl.innerHTML = data.map((e) =>
        `<div class="admin-item">
          <p><strong>${e.title}</strong><br>${new Date(e.starts_at).toLocaleString()} &nbsp; <span class="badge badge-cyan">${e.event_type}</span></p>
          <button class="remove-item" data-del-event="${e.id}" aria-label="Eliminar ${e.title}">✕</button>
        </div>`
      ).join('');

      eventsListEl.querySelectorAll('[data-del-event]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-del-event');
          const { error: delError } = await sb.from('events').delete().eq('id', id);
          if (delError) { showToast(delError.message, 'error'); return; }
          showToast('Evento eliminado.', 'info');
          loadEvents();
        });
      });
    };

    const loadUsers = async () => {
      if (!usersListEl) return;
      let query = sb
        .from('profiles')
        .select('id, username, full_name, role, source, created_at')
        .order('created_at', { ascending: false })
        .limit(300);

      const roleVal = userRoleFilter?.value || '';
      const sourceVal = userSourceFilter?.value || '';
      if (roleVal) query = query.eq('role', roleVal);
      if (sourceVal) query = query.eq('source', sourceVal);

      const { data, error } = await query;
      if (error) { usersListEl.innerHTML = `<p>${error.message}</p>`; return; }
      if (!data?.length) { usersListEl.innerHTML = '<p>Sem utilizadores para este filtro.</p>'; return; }

      usersListEl.innerHTML = data.map((u) => {
        const isStaff = ['admin', 'staff'].includes(u.role);
        const nome = u.full_name || u.username || u.id;
        const badgeClass = u.role === 'admin' ? 'badge-pink' : u.role === 'staff' ? 'badge-cyan' : 'badge-gold';
        return `<div class="admin-item">
          <p><strong>${nome}</strong><br>
            <span class="badge ${badgeClass}">${u.role}</span>
            &nbsp; ${isStaff ? 'Trabalhador' : 'Cliente'}
            &nbsp; <span class="muted">${u.source || 'local'}</span>
          </p>
          <span class="qty-badge">${new Date(u.created_at).toLocaleDateString()}</span>
        </div>`;
      }).join('');
    };

    productForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = productForm.querySelector('[type="submit"]');
      setLoading(btn, true);
      const payload = {
        name: document.querySelector('#pName')?.value?.trim(),
        description: document.querySelector('#pDescription')?.value?.trim() || null,
        price_eur: Number(document.querySelector('#pPrice')?.value || 0),
        image_url: document.querySelector('#pImage')?.value?.trim() || null,
        stock: Number(document.querySelector('#pStock')?.value || 0),
        is_active: document.querySelector('#pActive')?.value === 'true',
        created_by: session.user.id
      };
      const { error } = await sb.from('products').insert(payload);
      setLoading(btn, false);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Produto guardado com sucesso!', 'success');
      productForm.reset();
      loadProducts();
    });

    eventForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = eventForm.querySelector('[type="submit"]');
      setLoading(btn, true);

      const { data: arena } = await sb.from('arenas').select('id').limit(1).maybeSingle();
      if (!arena?.id) {
        showToast('Não existe arena configurada na base de dados.', 'error');
        setLoading(btn, false);
        return;
      }

      const startLocal = document.querySelector('#eStart')?.value;
      const endLocal = document.querySelector('#eEnd')?.value;
      const payload = {
        arena_id: arena.id,
        title: document.querySelector('#eTitle')?.value?.trim(),
        description: document.querySelector('#eDescription')?.value?.trim() || null,
        event_type: document.querySelector('#eType')?.value || 'other',
        starts_at: startLocal ? new Date(startLocal).toISOString() : null,
        ends_at: endLocal ? new Date(endLocal).toISOString() : null,
        max_participants: Number(document.querySelector('#eMax')?.value || 0) || null,
        is_public: true,
        created_by: session.user.id
      };

      const { error } = await sb.from('events').insert(payload);
      setLoading(btn, false);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Evento guardado com sucesso!', 'success');
      eventForm.reset();
      loadEvents();
    });

    loadProducts();
    loadEvents();
    loadUsers();
    userRoleFilter?.addEventListener('change', loadUsers);
    userSourceFilter?.addEventListener('change', loadUsers);
    reloadUsersBtn?.addEventListener('click', loadUsers);
  }

  /* ── Checkout Page ───────────────────────────────────────────── */
  async function setupCheckoutPage() {
    const checkoutItems = document.querySelector('#checkoutItems');
    const checkoutTotal = document.querySelector('#checkoutTotal');
    const payStripeBtn = document.querySelector('#payStripeBtn');
    const payPaypalBtn = document.querySelector('#payPaypalBtn');
    const payMbwayBtn = document.querySelector('#payMbwayBtn');
    const statusEl = document.querySelector('#checkoutStatus');
    const mbwayInfo = document.querySelector('#mbwayInfo');

    if (!checkoutItems || !checkoutTotal) return;

    const cart = readCart();
    if (!cart.length) {
      checkoutItems.innerHTML = '<p class="lead">O carrinho está vazio.</p>';
      checkoutTotal.textContent = '0,00 €';
      if (payStripeBtn) payStripeBtn.disabled = true;
      if (payPaypalBtn) payPaypalBtn.disabled = true;
      if (payMbwayBtn) payMbwayBtn.disabled = true;
      return;
    }

    let total = 0;
    checkoutItems.innerHTML = cart.map((item) => {
      const line = item.price * item.qty;
      total += line;
      return `<div class="cart-item">
        <p><strong>${item.name}</strong><br><span class="qty-badge">Qtd: ${item.qty}</span></p>
        <p>${formatEUR(line)}</p>
        <span></span>
      </div>`;
    }).join('');

    checkoutTotal.textContent = formatEUR(total);

    const { session } = await getSessionWithProfile();
    if (!session && statusEl) {
      statusEl.textContent = 'Faz login para registar a encomenda no sistema.';
    }

    const createOrder = async (method) => {
      if (!session) return { error: { message: 'Precisas de login para pagar.' } };

      const orderPayload = {
        user_id: session.user.id,
        customer_email: session.user.email,
        amount_total: total,
        currency: 'EUR',
        status: 'pending',
        payment_method: method
      };

      const { data: order, error } = await sb.from('orders').insert(orderPayload).select('id').single();
      if (error) return { error };

      const itemsPayload = cart.map((item) => ({
        order_id: order.id,
        product_id: null,
        product_name: item.name,
        qty: item.qty,
        unit_price: item.price,
        line_total: item.price * item.qty
      }));

      const { error: itemErr } = await sb.from('order_items').insert(itemsPayload);
      if (itemErr) return { error: itemErr };

      return { orderId: order.id };
    };

    payStripeBtn?.addEventListener('click', async () => {
      setLoading(payStripeBtn, true);
      const { error } = await createOrder('stripe');
      setLoading(payStripeBtn, false);
      if (error) { showToast(error.message, 'error'); return; }
      if (cfg.PAYMENT_STRIPE_URL) { window.location.href = cfg.PAYMENT_STRIPE_URL; return; }
      showToast('Define PAYMENT_STRIPE_URL em env.js para ativar Stripe.', 'warning');
    });

    payPaypalBtn?.addEventListener('click', async () => {
      setLoading(payPaypalBtn, true);
      const { error } = await createOrder('paypal');
      setLoading(payPaypalBtn, false);
      if (error) { showToast(error.message, 'error'); return; }
      if (cfg.PAYMENT_PAYPAL_URL) { window.location.href = cfg.PAYMENT_PAYPAL_URL; return; }
      showToast('Define PAYMENT_PAYPAL_URL em env.js para ativar PayPal.', 'warning');
    });

    payMbwayBtn?.addEventListener('click', async () => {
      setLoading(payMbwayBtn, true);
      const { orderId, error } = await createOrder('mbway');
      setLoading(payMbwayBtn, false);
      if (error) { showToast(error.message, 'error'); return; }

      const ref = `MBW-${String(orderId).slice(0, 8).toUpperCase()}`;
      await sb.from('orders').update({ payment_reference: ref }).eq('id', orderId);
      if (mbwayInfo) mbwayInfo.textContent = `Referência MB Way: ${ref} | Contacto: ${cfg.PAYMENT_MBWAY_PHONE || '(configurar em env.js)'}`;
      if (statusEl) statusEl.textContent = 'Pedido criado. Conclui o pagamento por MB Way.';
      localStorage.setItem(CART_KEY, '[]');
      showToast('Pedido MB Way criado com sucesso!', 'success');
    });
  }

  /* ── Store Page ──────────────────────────────────────────────── */
  async function setupStorePage() {
    const shopGrid = document.querySelector('#shopProducts');
    if (!shopGrid) return;

    const { data, error } = await sb
      .from('products')
      .select('id, name, description, price_eur, image_url, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data?.length) return;

    const fallbackShots = ['shot-1', 'shot-2', 'shot-3', 'shot-4', 'shot-5', 'shot-6'];
    shopGrid.innerHTML = data.map((p, idx) => {
      const shotClass = fallbackShots[idx % fallbackShots.length];
      const photo = p.image_url
        ? `<div class="product-photo shot" style="background-image:url('${String(p.image_url).replace(/'/g, '%27')}')"></div>`
        : `<div class="product-photo shot ${shotClass}"></div>`;

      return `<article class="card product-card">
        ${photo}
        <h3>${p.name}</h3>
        <p>${p.description || 'Produto oficial Arena Gaming Valencia.'}</p>
        <p class="price">${formatEUR(p.price_eur)}</p>
        <button class="btn btn-primary" data-add-to-cart data-id="${p.id}" data-name="${p.name.replace(/"/g, '&quot;')}" data-price="${p.price_eur}">Adicionar ao carrinho</button>
      </article>`;
    }).join('');
  }

  /* ── ggLeap Admin Redirect ───────────────────────────────────── */
  function setupGgleapAdminPanel(profile) {
    const adminUrl = (cfg.GGLEAP_ADMIN_URL || '').trim();
    const isStaff = ['admin', 'staff'].includes(profile?.role);
    if (!isStaff) return;

    // In admin page: inject a ggLeap management block at the top
    const adminGuard = document.querySelector('#adminGuard');
    if (adminGuard) {
      const ggleapBlock = document.createElement('article');
      ggleapBlock.className = 'card';
      ggleapBlock.style.cssText = 'border-color:rgba(0,240,255,0.5);margin-bottom:0;';
      ggleapBlock.innerHTML = `
        <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;">
            <p class="eyebrow" style="margin:0 0 0.3rem">Gestão Operacional</p>
            <h3 style="margin:0 0 0.4rem">Painel ggLeap / ggCircuit</h3>
            <p style="margin:0">Gere reservas, postos, utilizadores e relatórios diretamente no sistema ggLeap.</p>
          </div>
          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
            ${adminUrl
              ? `<a class="btn btn-primary" href="${adminUrl}" target="_blank" rel="noopener noreferrer">Abrir painel ggLeap ↗</a>`
              : `<span class="badge badge-pink" style="padding:0.4rem 0.8rem;">GGLEAP_ADMIN_URL não configurado em env.js</span>`
            }
          </div>
        </div>`;
      adminGuard.prepend(ggleapBlock);
    }

    // Show toast redirect offer for staff landing anywhere
    if (adminUrl && !document.querySelector('#adminPanel')) {
      const key = `arena_ggleap_offer_${Date.now().toString().slice(0, -4)}`;
      if (sessionStorage.getItem('arena_ggleap_offered')) return;
      sessionStorage.setItem('arena_ggleap_offered', '1');

      setTimeout(() => {
        const container = document.getElementById('toast-container') || (() => {
          const el = document.createElement('div');
          el.id = 'toast-container';
          document.body.appendChild(el);
          return el;
        })();

        const el = document.createElement('div');
        el.className = 'toast toast-info';
        el.style.cssText = 'max-width:360px;cursor:pointer;';
        el.innerHTML = `<strong>Painel ggLeap</strong><br><small>Clica aqui para ir para o painel de gestão ggLeap.</small>`;
        el.addEventListener('click', () => window.open(adminUrl, '_blank'));
        container.appendChild(el);
        requestAnimationFrame(() => { requestAnimationFrame(() => el.classList.add('toast-visible')); });
        setTimeout(() => { el.classList.remove('toast-visible'); el.addEventListener('transitionend', () => el.remove(), { once: true }); }, 10000);
      }, 1800);
    }
  }

  /* ── Session-aware nav ───────────────────────────────────────── */
  async function bootstrapRoleNav() {
    const { session, profile } = await getSessionWithProfile();
    const isAdmin = Boolean(session && profile && ['admin', 'staff'].includes(profile.role));
    ensureAdminLink(isAdmin);
    updateNavForSession(session, profile?.full_name || session?.user?.user_metadata?.full_name);
    if (isAdmin) setupGgleapAdminPanel(profile);
  }

  setupLoginPage();
  setupAdminPage();
  setupCheckoutPage();
  setupStorePage();
  setupPerfilPage();
  bootstrapRoleNav();
})();

/* ── 13. ggLeap Booking Portal ─────────────────────────────────── */
(function setupGgleapPortal() {
  const iframe = document.querySelector('#portalEmbed');
  const openBtn = document.querySelector('#portalOpenBtn');
  const statusEl = document.querySelector('#portalStatus');
  const wrap = document.querySelector('#portalEmbedWrap');
  if (!iframe || !openBtn || !statusEl || !wrap) return;

  const cfg = window.SUPABASE_CONFIG || {};
  const portalUrl = (cfg.GGLEAP_PORTAL_URL || '').trim();
  const allowEmbed = cfg.GGLEAP_EMBED_IFRAME !== false;

  if (!portalUrl) {
    wrap.style.display = 'none';
    openBtn.style.display = 'none';
    statusEl.textContent = 'Falta configurar GGLEAP_PORTAL_URL no ficheiro env.js.';
    return;
  }

  openBtn.href = portalUrl;

  if (!allowEmbed) {
    wrap.style.display = 'none';
    statusEl.textContent = 'Embed desativado. Usa o botão para abrir o portal oficial.';
    return;
  }

  let loaded = false;
  const fallback = () => {
    if (loaded) return;
    wrap.style.display = 'none';
    statusEl.textContent = 'O portal bloqueou o iframe. Usa o botão para abrir em nova aba.';
  };

  iframe.addEventListener('load', () => {
    loaded = true;
    statusEl.textContent = 'Portal carregado.';
  });

  setTimeout(fallback, 4500);
  iframe.src = portalUrl;
})();

/* ── 14. PC Reservation Redirect ───────────────────────────────── */
(function setupPcReservationRedirect() {
  const form = document.querySelector('#pcReservationForm');
  if (!form) return;

  const cfg = window.SUPABASE_CONFIG || {};
  const portalUrl = (cfg.GGLEAP_PORTAL_URL || '').trim();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!portalUrl) {
      showToast('Falta configurar GGLEAP_PORTAL_URL no env.js.', 'warning');
      return;
    }
    window.location.href = portalUrl;
  });
})();