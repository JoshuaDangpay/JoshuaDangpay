(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pages = ['index', 'personal', 'achievements', 'family-friends'];
  const slug = u => new URL(u, location.href).pathname.split('/').pop().replace('.html', '') || 'index';
  const here = slug(location.href), main = $('main');

  // Age from birthday (data-birth="YYYY-MM-DD"); only the day and month are shown elsewhere
  $$('[data-birth]').forEach(el => {
    const [y, m, d] = el.dataset.birth.split('-').map(Number), now = new Date();
    let age = now.getFullYear() - y;
    if (now < new Date(now.getFullYear(), m - 1, d)) age--;
    el.textContent = age;
  });

  // Horizontal slide between pages
  const dir = +sessionStorage.getItem('dir') || 0;
  sessionStorage.removeItem('dir');
  if (!reduce && dir) main.classList.add(dir > 0 ? 'in-r' : 'in-l');
  $$('nav a[href], a[data-nav]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    const to = slug(a.href);
    if (to === here) { e.preventDefault(); return; }
    if (reduce) return;
    e.preventDefault();
    const d = pages.indexOf(to) > pages.indexOf(here) ? 1 : -1;
    sessionStorage.setItem('dir', d);
    main.classList.add(d > 0 ? 'out-l' : 'out-r');
    setTimeout(() => (location.href = a.href), 260);
  }));
  addEventListener('pageshow', e => { if (e.persisted) main.classList.remove('out-l', 'out-r'); });

  // Gallery: arrange all photos in 1 to 3 rows so they fit on one screen without cropping
  const g = $('.gal');
  if (g) {
    const items = $$('figure', g), gap = 12;
    const ar = f => +f.style.getPropertyValue('--ar') || 1;
    const layout = () => {
      const W = g.clientWidth, H = g.clientHeight, tot = items.reduce((s, f) => s + ar(f), 0);
      let best = null;
      for (let r = 1; r <= Math.min(3, items.length); r++) {
        const rows = [[]];
        let s = 0;
        items.forEach(f => {
          if (s >= tot / r - 0.01 && rows.length < r) { rows.push([]); s = 0; }
          rows[rows.length - 1].push(f);
          s += ar(f);
        });
        const h = Math.min((H - gap * (rows.length - 1)) / rows.length,
          ...rows.map(row => (W - gap * (row.length - 1)) / row.reduce((a, f) => a + ar(f), 0)));
        if (!best || h > best.h * 1.08) best = { h, rows };
      }
      g.replaceChildren(...best.rows.map(row => {
        const d = document.createElement('div');
        d.className = 'row';
        d.append(...row);
        return d;
      }));
      g.style.setProperty('--h', best.h + 'px');
    };
    layout();
    addEventListener('resize', layout);
  }

  // Lightbox for every [data-lb] element on the page
  const set = $$('[data-lb]');
  if (set.length) {
    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML = '<button class="lb-x" aria-label="Close">&times;</button><button class="lb-p" aria-label="Previous image">&#8249;</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-n" aria-label="Next image">&#8250;</button>';
    document.body.append(lb);
    const img = $('img', lb), cap = $('figcaption', lb);
    let i = 0, opener = null;
    const show = n => {
      i = (n + set.length) % set.length;
      const src = $('img', set[i]);
      img.src = src.src;
      img.alt = src.alt;
      cap.textContent = set[i].dataset.cap || '';
    };
    const open = n => { opener = set[n]; show(n); lb.hidden = false; $('.lb-x', lb).focus(); };
    const close = () => { lb.hidden = true; if (opener) opener.focus(); };
    set.forEach((el, n) => {
      el.addEventListener('click', () => open(n));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); } });
    });
    $('.lb-x', lb).onclick = close;
    $('.lb-p', lb).onclick = () => show(i - 1);
    $('.lb-n', lb).onclick = () => show(i + 1);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }
})();
