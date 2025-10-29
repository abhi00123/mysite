export default async function decorate(block) {
  const root = block;
  if (!root) return;

  // --- 1) Grab authored slides (direct children) ---
  const slideNodes = [...root.querySelectorAll(':scope > div')];
  if (!slideNodes.length) return;

  // Pull number and label from a <p> regardless of markup style
  function parseStatP(p) {
    const text = p.textContent?.trim() || '';
    return {
      number: parseFloat(text.match(/-?\d+(\.\d+)?/)?.[0] || '0'),
      label: text.replace(/-?\d+(\.\d+)?/, '').trim()
    };
  }

  function extractReadMore(statsWrap) {
    const last = statsWrap.querySelector('p:last-child');
    if (!last) return { text: '', href: '' };
    const a = last.querySelector('a');
    return {
      text: (a?.textContent || last.textContent || '').trim(),
      href: a?.getAttribute('href') || ''
    };
  }

  function extractSlide(node) {
    const textWrap = node.querySelector('.text-content') || node.querySelector('div:nth-child(1)') || node;
    const statsWrap = node.querySelector('.stats') || node.querySelector('div:nth-child(2)') || node;
    const imageWrap = node.querySelector('.image-content') || node.querySelector('div:nth-child(3)') || node;

    return {
      titleHTML: (textWrap.querySelector('.title')?.innerHTML || textWrap.querySelector('p:nth-child(1)')?.innerHTML || '').trim(),
      descHTML: (textWrap.querySelector('.description')?.innerHTML || textWrap.querySelector('p:nth-child(2)')?.innerHTML || '').trim(),
      stats: statsWrap ? [...statsWrap.querySelectorAll('p')].slice(0, -1).map(parseStatP).slice(0, 3) : [],
      readMore: statsWrap ? extractReadMore(statsWrap) : { text: '', href: '' },
      imageHTML: imageWrap.querySelector('picture')?.outerHTML || imageWrap.querySelector('img')?.outerHTML || ''
    };
  }

  const data = slideNodes.map(extractSlide).filter(s => s.imageHTML);
  if (!data.length) return;

  // --- 2) Rebuild DOM: left info + right image track ---
  root.innerHTML = '';
  const grid = document.createElement('div'); grid.className = 'carousel-grid';
  const info = document.createElement('div'); info.className = 'info-panel';
  info.innerHTML = `
    <p class="title"></p>
    <p class="description"></p>
    <div class="stats"></div>
    <a href="#" class="read-more">Read Success Story ></a>
  `;
  const thumbs = document.createElement('div'); thumbs.className = 'thumbs';
  const track = document.createElement('div');  track.className = 'thumb-track';
  track.style.transition = 'transform 400ms cubic-bezier(.22,.61,.36,1)';
  thumbs.appendChild(track);

  const nav = document.createElement('div'); nav.className = 'carousel-nav';
  const prev = document.createElement('button'); prev.className = 'prev'; prev.type = 'button'; prev.setAttribute('aria-label', 'Previous image');
  const next = document.createElement('button'); next.className = 'next'; next.type = 'button'; next.setAttribute('aria-label', 'Next image');
  nav.appendChild(prev); nav.appendChild(next);

  grid.appendChild(info); grid.appendChild(thumbs);
  root.appendChild(grid); root.appendChild(nav);

  data.forEach((slide, i) => {
    const card = document.createElement('div');
    card.className = 'thumb-card';
    card.innerHTML = `<button type="button" aria-label="Go to item ${i + 1}">${slide.imageHTML}</button>`;
    track.appendChild(card);
    card.querySelector('button').addEventListener('click', () => goTo(i, true));
  });
  const cards = [...track.querySelectorAll('.thumb-card')];

  // --- 3) Render info + count-up ---
  function renderInfo(slide) {
    const titleEl = info.querySelector('.title');
    const descEl = info.querySelector('.description');
    titleEl.innerHTML = slide.titleHTML || '';
    descEl.innerHTML = slide.descHTML || '';

    const statsEl = info.querySelector('.stats');
    statsEl.innerHTML = '';
    slide.stats.forEach(s => {
      const p = document.createElement('p');
      p.className = 'stat';
      p.dataset.target = String(Math.round(s.number || 0));
      p.innerHTML = `<span class="number">0</span><span class="label">${s.label || ''}</span>`;
      statsEl.appendChild(p);
    });

    const link = info.querySelector('.read-more');
    link.textContent = slide.readMore.text || 'Read Success Story >';
    link.setAttribute('href', slide.readMore.href || '#');
  }

  function animateCount(el, to, duration = 1200) {
    const start = 0; let startTs;
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    function step(ts) {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      el.textContent = String(Math.round(start + (to - start) * easeOutCubic(p)));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(to);
    }
    requestAnimationFrame(step);
  }

  function animateStatsInInfo() {
    info.querySelectorAll('.stat .number').forEach(numEl => {
      const to = parseFloat(numEl.parentElement.dataset.target || '0') || 0;
      numEl.textContent = '0';
      animateCount(numEl, to, 1200);
    });
  }

  // --- 4) Image-only slider (Flex + real measurements) ---
  let index = 0;

  function updateTransform() {
    const w = cards[0]?.getBoundingClientRect().width || 0;
    const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;

    while (track.children.length < data.length * 3) {
      data.forEach((slide, i) => {
        const card = document.createElement('div');
        card.className = 'thumb-card';
        card.innerHTML = `<button type="button" aria-label="Go to item ${i + 1}">${slide.imageHTML}</button>`;
        track.appendChild(card);
        card.querySelector('button').addEventListener('click', () => goTo(i, true));
      });
    }

    const totalSlides = data.length;
    const actualIndex = index < 0
      ? (totalSlides - (-index % totalSlides)) % totalSlides
      : index % totalSlides;

    track.style.transform = `translateX(${-(index * (w + gap))}px)`;

    if (Math.abs(index) >= totalSlides) {
      setTimeout(() => {
        track.style.transition = 'none';
        index = actualIndex;
        track.style.transform = `translateX(${-(index * (w + gap))}px)`;
        requestAnimationFrame(() => track.style.transition = '');
      }, 400);
    }
  }

  function updateActive() {
    cards.forEach((c, i) => c.classList.toggle('active', i === index));
    prev.disabled = false;
    next.disabled = false;
  }

  function goTo(i, fromUser = false) {
    const prevIndex = index;
    const totalSlides = data.length;
    index = i;

    let actualIndex = index;
    if (index < 0) {
      actualIndex = totalSlides - (-index % totalSlides);
      if (actualIndex === totalSlides) actualIndex = 0;
    } else {
      actualIndex = index % totalSlides;
    }

    if (prevIndex !== index) {
      renderInfo(data[actualIndex]);
      animateStatsInInfo();
      updateTransform();
      updateActive();

      if (fromUser) {
        const activeCard = track.children[index + totalSlides];
        if (activeCard) activeCard.querySelector('button')?.focus();
      }
    }
  }

  prev.addEventListener('click', () => goTo(index - 1, true));
  next.addEventListener('click', () => goTo(index + 1, true));

  // Keyboard navigation
  root.tabIndex = 0;
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1, true); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index - 1, true); }
  });

  // Swipe navigation
  let startX = 0, dx = 0, down = false;
  thumbs.addEventListener('pointerdown', (e) => { down = true; startX = e.clientX; });
  thumbs.addEventListener('pointermove', (e) => { if (down) dx = e.clientX - startX; });
  ['pointerup','pointercancel','pointerleave'].forEach(evt => {
    thumbs.addEventListener(evt, () => {
      if (!down) return; down = false;
      if (dx > 50) goTo(index - 1, true);
      else if (dx < -50) goTo(index + 1, true);
      dx = 0;
    });
  });

  // Re-measure after images load and on resize
  function refreshAfterImages() {
    const imgs = track.querySelectorAll('img');
    let pending = imgs.length;
    if (!pending) { updateTransform(); return; }
    imgs.forEach(img => {
      const done = () => { if (--pending === 0) updateTransform(); };
      if (img.complete) done();
      else { img.addEventListener('load', done); img.addEventListener('error', done); }
    });
  }

  let rid;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rid); rid = requestAnimationFrame(updateTransform);
  });

  // Init
  renderInfo(data[0]);
  animateStatsInInfo();
  refreshAfterImages();
  updateActive();
}
