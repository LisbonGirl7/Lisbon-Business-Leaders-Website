/* ════════════════════════════════════════
   MOBILE NAV
   ════════════════════════════════════════ */
(function () {
  const hamburger = document.getElementById('nav-hamburger');
  const links = document.getElementById('nav-links');
  if (!hamburger || !links) return;

  hamburger.addEventListener('click', function () {
    const open = links.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close nav when a link is clicked (mobile)
  links.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ════════════════════════════════════════
   NEWSLETTER FORM
   ════════════════════════════════════════ */
(function () {
  const form = document.getElementById('newsletter-form');
  const msg = document.getElementById('newsletter-msg');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.trim()) {
      if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.style.color = '#c0392b'; }
      return;
    }
    if (msg) {
      msg.style.color = 'var(--color-gold)';
      msg.textContent = 'Thank you — you\'re on the list!';
    }
    input.value = '';
  });
})();


/* ════════════════════════════════════════
   MEMBERSHIP APPLICATION FORM (Formspree)
   ════════════════════════════════════════ */
(function () {
  const form = document.getElementById('membership-form');
  const msg = document.getElementById('form-msg');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        if (msg) { msg.style.color = 'var(--color-gold)'; msg.textContent = 'Application received! We\'ll be in touch within 48 hours.'; }
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (msg) { msg.style.color = '#c0392b'; msg.textContent = 'Something went wrong. Please email us directly at hello@lisbonbusinessleaders.com'; }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Application'; }
    }
  });
})();


/* ════════════════════════════════════════
   CONTACT FORM (Formspree)
   ════════════════════════════════════════ */
(function () {
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('contact-form-msg');
  if (!form) return;

  // Pre-fill subject from URL param: contact.html?subject=Sponsorship+Enquiry
  const params = new URLSearchParams(window.location.search);
  const subjectParam = params.get('subject');
  if (subjectParam) {
    const select = form.querySelector('#contact-subject');
    if (select) {
      const match = Array.from(select.options).find(o => o.value === subjectParam);
      if (match) select.value = match.value;
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        if (msg) { msg.style.color = 'var(--color-gold)'; msg.textContent = 'Message sent! We\'ll be in touch within 2 business days.'; }
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (msg) { msg.style.color = '#c0392b'; msg.textContent = 'Something went wrong. Please email us at hello@lisbonbusinessleaders.com'; }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
    }
  });
})();


/* ════════════════════════════════════════
   EVENTS PAGE — filter by type
   ════════════════════════════════════════ */
(function () {
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.dataset.filter;

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      document.querySelectorAll('#upcoming-events-grid [data-type]').forEach(function (card) {
        if (filter === 'all' || card.dataset.type === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();


/* ════════════════════════════════════════
   DIRECTORY PAGE — search + industry filter
   ════════════════════════════════════════ */
(function () {
  const searchInput = document.getElementById('member-search');
  const industryBtns = document.querySelectorAll('[data-industry]');
  const grid = document.getElementById('member-grid');
  const noResults = document.getElementById('no-results');
  if (!grid) return;

  let activeIndustry = 'all';
  let searchQuery = '';

  function applyFilters() {
    const cards = grid.querySelectorAll('.member-card');
    let visible = 0;

    cards.forEach(function (card) {
      const matchIndustry = activeIndustry === 'all' || card.dataset.industry === activeIndustry;
      const name = (card.dataset.name || '').toLowerCase();
      const company = (card.dataset.company || '').toLowerCase();
      const matchSearch = !searchQuery || name.includes(searchQuery) || company.includes(searchQuery);

      if (matchIndustry && matchSearch) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  industryBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeIndustry = btn.dataset.industry;
      industryBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }
})();


/* ════════════════════════════════════════
   SMOOTH SCROLL for anchor links
   ════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ════════════════════════════════════════
   NAV — highlight active link on scroll
   (home page only, for single-page feel)
   ════════════════════════════════════════ */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      nav.style.borderBottomColor = 'rgba(184,151,90,0.35)';
    } else {
      nav.style.borderBottomColor = 'rgba(184,151,90,0.2)';
    }
  }, { passive: true });
})();
