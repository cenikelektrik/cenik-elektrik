(function () {
  const WHATSAPP_NUMBER = '905466836148';
  const PRICE_LISTS = window.CENIK_PRICE_LISTS || [];

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function initPartnerPlaceholders() {
    document.querySelectorAll('.partner-logo-slot[href="#"]').forEach(link => {
      link.addEventListener('click', event => event.preventDefault());
    });
  }

  function initYear() {
    document.querySelectorAll('[data-current-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  function renderPriceLists() {
    const grid = document.getElementById('priceListGrid');
    if (!grid) return;

    const search = document.getElementById('priceListSearch');
    const count = document.getElementById('priceListCount');
    const filterText = document.getElementById('catalogActiveFilter');
    const categoryButtons = Array.from(document.querySelectorAll('[data-catalog-category]'));
    const categories = ['Tümü', 'Ampuller', 'Armatürler', 'Anahtar & Priz', 'Kablolar', 'Sigorta', 'Pano', 'LED Şerit', 'Elektrik Aksesuarları'];

    const slugify = value => String(value || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/&/g, ' ve ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const categoryBySlug = new Map(categories.map(category => [slugify(category), category]));
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = categoryBySlug.get(slugify(params.get('kategori') || params.get('category')));
    let activeCategory = requestedCategory || 'Tümü';

    function syncButtons() {
      categoryButtons.forEach(button => {
        const active = button.dataset.catalogCategory === activeCategory;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }

    function draw() {
      const q = (search?.value || '').trim().toLocaleLowerCase('tr-TR');
      const filtered = PRICE_LISTS.filter(item => {
        const brandMatch = item.brand.toLocaleLowerCase('tr-TR').includes(q);
        const itemCategories = Array.isArray(item.categories) ? item.categories : [];
        const categoryMatch = activeCategory === 'Tümü' || itemCategories.includes(activeCategory);
        return brandMatch && categoryMatch;
      });

      if (count) count.textContent = filtered.length;
      if (filterText) {
        const base = activeCategory === 'Tümü' ? 'Tüm markalar' : activeCategory;
        filterText.textContent = q
          ? `${base} içinde “${search.value.trim()}” araması gösteriliyor.`
          : `${base} kategorisindeki uygun markalar gösteriliyor.`;
      }

      if (!filtered.length) {
        const message = activeCategory === 'Tümü'
          ? 'Farklı bir marka adıyla tekrar arayın.'
          : 'Bu kategoride aramanızla eşleşen bir fiyat listesi bulunamadı.';
        grid.innerHTML = `<div class="empty-state"><h2>Sonuç bulunamadı.</h2><p>${message}</p></div>`;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const brand = escapeHtml(item.brand);
        const pdf = escapeAttribute(item.pdf);
        const cover = escapeAttribute(item.cover);
        const quoteUrl = `teklif.html?brand=${encodeURIComponent(item.brand)}`;

        return `
          <article class="catalog-card" data-brand="${brand}">
            <a class="catalog-cover-link" href="${pdf}" target="_blank" rel="noopener noreferrer" aria-label="${brand} PDF kataloğunu aç">
              <span class="catalog-cover-frame">
                <img class="catalog-cover" src="${cover}" alt="${brand} katalog ve fiyat listesi kapağı" loading="lazy">
                <span class="catalog-pdf-chip">PDF</span>
                <span class="catalog-open-hint">PDF'yi Aç</span>
              </span>
            </a>
            <div class="catalog-card-footer">
              <a class="catalog-brand-name" href="${pdf}" target="_blank" rel="noopener noreferrer">${brand}</a>
              <a class="catalog-quote-link" href="${quoteUrl}">Teklif iste →</a>
            </div>
          </article>`;
      }).join('');
    }

    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        activeCategory = button.dataset.catalogCategory || 'Tümü';
        syncButtons();

        const url = new URL(window.location.href);
        if (activeCategory === 'Tümü') url.searchParams.delete('kategori');
        else url.searchParams.set('kategori', slugify(activeCategory));
        url.searchParams.delete('category');
        window.history.replaceState({}, '', url);

        draw();
      });
    });

    search?.addEventListener('input', draw);
    syncButtons();
    draw();
  }

  function initWhatsappQuoteForm() {
    const form = document.getElementById('whatsappQuoteForm');
    if (!form) return;

    const productsField = form.querySelector('[name="products"]');
    const params = new URLSearchParams(window.location.search);
    const brand = params.get('brand');
    if (brand && productsField && !productsField.value.trim()) {
      productsField.value = `Marka: ${brand}\nÜrün Kodu:\nAdet:`;
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('customerName') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const products = String(data.get('products') || '').trim();
      const note = String(data.get('note') || '').trim();

      if (!name || !products) {
        showToast('Ad / firma ve ürün kodu bilgilerini doldurun.');
        return;
      }

      const message = [
        'Merhaba Cenik Elektrik, fiyat teklifi almak istiyorum.',
        '',
        `Ad / Firma: ${name}`,
        phone ? `Telefon: ${phone}` : '',
        '',
        'Ürün kodları / adetler:',
        products,
        note ? `\nNot: ${note}` : ''
      ].filter(Boolean).join('\n');

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }


  function initTheme() {
    const THEME_KEY = 'cenik-theme';

    // Karanlık tema CSS dosyasını tüm sayfalara otomatik ekle.
    if (!document.querySelector('link[data-cenik-dark-theme]')) {
      const themeStylesheet = document.createElement('link');
      themeStylesheet.rel = 'stylesheet';
      themeStylesheet.href = 'assets/css/dark-theme.css?v=20260923-v3';
      themeStylesheet.dataset.cenikDarkTheme = 'true';
      document.head.appendChild(themeStylesheet);
    }

    let savedTheme = 'light';
    try {
      savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    } catch (_) {}

    const nav = document.querySelector('.main-nav');
    if (!nav) {
      document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
      return;
    }

    let button = nav.querySelector('.theme-toggle');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'theme-toggle';

      const quoteLink = nav.querySelector('.quote-link');
      if (quoteLink) nav.insertBefore(button, quoteLink);
      else nav.appendChild(button);
    }

    const icons = {
      moon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.2 15.6A8.7 8.7 0 0 1 8.4 3.8 8.9 8.9 0 1 0 20.2 15.6Z"></path>
        </svg>`,
      sun: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path>
        </svg>`
    };

    function applyTheme(theme, persist = false) {
      const dark = theme === 'dark';
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';

      button.innerHTML = `
        <span class="theme-toggle-icon">${dark ? icons.sun : icons.moon}</span>
        <span class="theme-toggle-label">${dark ? 'Açık Tema' : 'Koyu Tema'}</span>`;

      button.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Karanlık temaya geç');
      button.setAttribute('title', dark ? 'Açık temaya geç' : 'Karanlık temaya geç');
      button.setAttribute('aria-pressed', String(dark));

      if (persist) {
        try {
          localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
        } catch (_) {}
      }
    }

    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    // Sonraki sahne hazir olsun: ilk geciste bos bir arka plan gorunmesin.
    const backgroundLoads = new Map();
    function prepareBackground(theme) {
      const wide = document.querySelector('main.ce-home-page') &&
        window.matchMedia('(min-width: 901px)').matches;
      const url = `assets/img/site-background-${theme}${wide ? '-wide' : ''}.webp?v=20260923-v3`;
      if (!backgroundLoads.has(url)) {
        backgroundLoads.set(url, new Promise(resolve => {
          const image = new Image();
          const timer = setTimeout(resolve, 1800);
          const done = () => { clearTimeout(timer); resolve(); };
          image.onload = done;
          image.onerror = done;
          image.src = url;
        }));
      }
      return backgroundLoads.get(url);
    }

    prepareBackground(savedTheme === 'dark' ? 'light' : 'dark');
    let switching = false;

    button.addEventListener('click', async () => {
      if (switching) return;
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        applyTheme(next, true);
        return;
      }

      switching = true;
      button.setAttribute('aria-busy', 'true');
      let fadeOut;
      let fadeIn;
      try {
        await prepareBackground(next);
        root.classList.add('theme-changing');
        if (typeof document.startViewTransition === 'function') {
          // Tum sayfayi, sabit arka plan dahil, yarim saniyede capraz soldur.
          const transition = document.startViewTransition(() => applyTheme(next, true));
          transition.ready.catch(() => {});
          await transition.finished;
        } else if (typeof document.body.animate === 'function') {
          // View Transitions olmayan tarayicilarda da yumusak bir solma kullan.
          fadeOut = document.body.animate([{ opacity: 1 }, { opacity: 0 }],
            { duration: 220, easing: 'ease-in', fill: 'forwards' });
          await fadeOut.finished;
          applyTheme(next, true);
          fadeIn = document.body.animate([{ opacity: 0 }, { opacity: 1 }],
            { duration: 280, easing: 'ease-out', fill: 'forwards' });
          await fadeIn.finished;
        } else {
          applyTheme(next, true);
        }
      } catch (_) {
        // Sekme degisse ya da animasyon iptal edilse bile secilen tema uygulansin.
        applyTheme(next, true);
      } finally {
        if (fadeOut) fadeOut.cancel();
        if (fadeIn) fadeIn.cancel();
        root.classList.remove('theme-changing');
        button.removeAttribute('aria-busy');
        switching = false;
      }
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  initTheme();
  initMenu();
  initYear();
  initPartnerPlaceholders();
  renderPriceLists();
  initWhatsappQuoteForm();
})();
