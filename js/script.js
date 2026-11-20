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

  // Pagination: [data-per] shows N items per page; [data-fit] packs as many photos per page as fit without cropping
  $$('[data-per],[data-fit]').forEach(g => {
    const items = [...g.children], pager = g.nextElementSibling, label = $('span', pager);
    const [prev, next] = $$('button', pager);
    let p = 0;
    const groups = () => {
      if (!g.hasAttribute('data-fit')) {
        const n = innerWidth < 800 ? 2 : +g.dataset.per || 3, out = [];
        items.forEach((_, i) => (i % n ? out[out.length - 1].push(i) : out.push([i])));
        return out;
      }
      const max = (g.clientWidth / Math.max(g.clientHeight, 1)) * 1.33, out = [[]];
      let sum = 0;
      items.forEach((f, i) => {
        const ar = +f.style.getPropertyValue('--ar') || 1;
        if (sum + ar > max && out[out.length - 1].length) { out.push([]); sum = 0; }
        out[out.length - 1].push(i);
        sum += ar;
      });
      return out;
    };
    const draw = () => {
      const gr = groups();
      p = Math.min(p, gr.length - 1);
      items.forEach((f, i) => (f.hidden = !gr[p].includes(i)));
      if (g.hasAttribute('data-fit')) {
        const sum = gr[p].reduce((s, i) => s + (+items[i].style.getPropertyValue('--ar') || 1), 0);
        g.style.setProperty('--h', Math.min(g.clientHeight, (g.clientWidth - 12 * (gr[p].length - 1)) / sum) + 'px');
      }
      pager.hidden = gr.length < 2;
      label.textContent = `${p + 1} / ${gr.length}`;
      prev.disabled = p === 0;
      next.disabled = p === gr.length - 1;
    };
    prev.onclick = () => { p--; draw(); };
    next.onclick = () => { p++; draw(); };
    addEventListener('resize', draw);
    draw();
  });

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
