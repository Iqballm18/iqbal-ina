/* ============================================================
   GOOGLE SHEETS ENDPOINT
   ============================================================ */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby5XWkYAXiaI4nNMizOQ7HkCeuSiHfrQu3h0AVvsFyawPIxxoLFmFTbML53MukPcbL8/exec";

/* ============================================================
   OPEN INVITATION
   ============================================================ */
function openInvitation(e) {
  e.preventDefault();

  // Cover fade out
  const cover = document.getElementById('cover');
  cover.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  cover.style.opacity    = '0';
  cover.style.transform  = 'scale(1.05)';

  setTimeout(() => {
    cover.style.display = 'none';

    const main = document.getElementById('main-content');
    main.classList.add('open');

    const footer = document.getElementById('site-footer');
    if (footer) footer.style.display = 'block';

    // Show music player pill
    showMusicPlayer();

    // Start music with FADE IN effect
    musicFadeIn();

    requestAnimationFrame(() => {
      startCountdown();
      initScrollReveal();
      spawnMainPetals();
      initCalendarLink();
      setTimeout(initActiveNav, 700);
    });
  }, 700);
}

/* ============================================================
   PETALS — cover + main content background ambiance
   ============================================================ */
function spawnPetals(container, count) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size  = 7 + Math.random() * 9;
    const dur   = 7 + Math.random() * 9;
    const delay = Math.random() * 12;
    const left  = Math.random() * 100;
    p.style.cssText = `
      left:${left}%;
      width:${size}px;
      height:${size * 1.45}px;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    container.appendChild(p);
  }
}

function spawnMainPetals() {
  const main = document.getElementById('main-content');
  if (main) spawnPetals(main, 10);
}

window.addEventListener('DOMContentLoaded', () => {
  const cover = document.getElementById('cover');
  if (cover) spawnPetals(cover, 16);
  gantiNamaTamu();
  loadMessages();
});

/* ============================================================
   PREMIUM MUSIC PLAYER — FADE IN / FADE OUT
   ============================================================ */
const FADE_DURATION = 2200;   // ms — how long the full fade takes
let   fadeInterval  = null;

/* ============================================================
   MUSIC PLAYER — INSTANT PLAY/PAUSE
   ============================================================ */

function musicFadeIn() {
  const audio = document.getElementById('wedding-audio');
  if (!audio) return;

  // Set volume langsung ke target tanpa interval
  audio.volume = 0.72;

  audio.play().then(() => {
    setPillState(true);
  }).catch(err => {
    console.log('Autoplay blocked — waiting for interaction:', err);
    document.addEventListener('click', function firstClick() {
      musicFadeIn();
      document.removeEventListener('click', firstClick);
    }, { once: true });
  });
}

function musicFadeOut(callback) {
  const audio = document.getElementById('wedding-audio');
  if (!audio) return;

  // Langsung pause
  audio.pause();
  setPillState(false);
  if (callback) callback();
}

/* Toggle called by the button */
function toggleMusic(e) {
  if (e) e.stopPropagation();
  const audio = document.getElementById('wedding-audio');
  if (!audio) return;

  // Ripple
  const btn = document.getElementById('music-control');
  btn.classList.remove('ripple');
  void btn.offsetWidth;
  btn.classList.add('ripple');

  if (audio.paused) {
    musicFadeIn();
  } else {
    musicFadeOut();
  }
}

/* Update pill UI for playing/paused state */
function setPillState(playing) {
  const icon = document.getElementById('music-icon');
  const pill = document.querySelector('.music-pill');

  if (playing) {
    if (icon) icon.textContent = '♪';
    pill?.classList.add('playing');
  } else {
    if (icon) icon.textContent = '𝄽';
    pill?.classList.remove('playing');
  }
}

/* Show the pill with a slide-up entrance */
function showMusicPlayer() {
  const player = document.querySelector('.music-player');
  if (!player) return;
  player.classList.add('visible');
  player.style.transform = 'translateY(80px)';
  player.style.opacity   = '0';
  player.style.transition = 'transform 0.6s cubic-bezier(.34,1.3,.64,1), opacity 0.5s ease';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      player.style.transform = 'translateY(0)';
      player.style.opacity   = '1';
    });
  });

  // Auto-expand pill for 4s then collapse
  setTimeout(() => expandPill(), 400);
  setTimeout(() => collapsePill(), 4500);
}

function expandPill() {
  document.querySelector('.music-pill')?.classList.add('expanded');
}
function collapsePill() {
  document.querySelector('.music-pill')?.classList.remove('expanded');
}

/* Hover expand/collapse */
document.addEventListener('DOMContentLoaded', () => {
  const pill = document.querySelector('.music-pill');
  if (!pill) return;
  pill.addEventListener('mouseenter', expandPill);
  pill.addEventListener('mouseleave', () => setTimeout(collapsePill, 800));
  // Touch support
  pill.addEventListener('touchstart', () => {
    expandPill();
    setTimeout(collapsePill, 3500);
  }, { passive: true });
});

/* ============================================================
   COUNTDOWN — with digit-flip animation
   ============================================================ */
function startCountdown() {
  const target = new Date('2026-08-21T08:00:00+07:00');
  const prev   = { days: null, hours: null, minutes: null, seconds: null };

  function setVal(id, key, val) {
    const str = String(val).padStart(2, '0');
    const el  = document.getElementById(id);
    if (!el || prev[key] === str) return;
    el.classList.remove('flip');
    void el.offsetWidth;
    el.classList.add('flip');
    el.textContent = str;
    prev[key] = str;
  }

  function update() {
    const diff = target - new Date();
    if (diff <= 0) {
      ['cd-days','cd-hours','cd-minutes','cd-seconds'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    setVal('cd-days',    'days',    Math.floor(diff / 86400000));
    setVal('cd-hours',   'hours',   Math.floor((diff % 86400000) / 3600000));
    setVal('cd-minutes', 'minutes', Math.floor((diff % 3600000)  / 60000));
    setVal('cd-seconds', 'seconds', Math.floor((diff % 60000)    / 1000));
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   GOOGLE CALENDAR LINK
   ============================================================ */
function initCalendarLink() {
  const title    = "Pernikahan Iqbal & Ina";
  const details  = "Mohon doa restu dan kehadirannya dalam acara pernikahan kami.";
  const location = "Dsn. Grogol RT/RW 006/006 Ds. Grogol Kec. Diwek Kab. Jombang";
  const start    = "20260821T010000Z";
  const end      = "20260821T100000Z";

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

  const btn = document.getElementById('btn-google-calendar');
  if (btn) btn.href = url;
}

/* ============================================================
   SCROLL-REVEAL ENGINE
   ============================================================ */
function initScrollReveal() {
  addRevealClasses();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (['reveal','reveal-left','reveal-right','reveal-scale'].some(c => el.classList.contains(c))) {
        el.classList.add('revealed');
      }
      if (el.classList.contains('story-dot'))      el.classList.add('revealed');
      if (el.classList.contains('story-timeline')) setTimeout(() => el.classList.add('line-grow'), 200);
      if (el.classList.contains('gallery-item'))   el.classList.add('revealed');
      if (el.classList.contains('divider-leaf'))   el.classList.add('revealed');
      if (el.classList.contains('event-card'))     el.classList.add('revealed');
      if (el.classList.contains('message-item'))   el.classList.add('revealed');

      if (el.tagName === 'SECTION') {
        el.classList.add('in-view');
        setTimeout(() => el.classList.remove('in-view'), 700);
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

  ['.reveal','.reveal-left','.reveal-right','.reveal-scale',
   '.story-dot','.story-timeline','.gallery-item',
   '.divider-leaf','.event-card','.message-item','section']
    .forEach(sel => document.querySelectorAll(sel).forEach(el => observer.observe(el)));
}

function addRevealClasses() {
  // Section labels & titles
  document.querySelectorAll('.section-label').forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  document.querySelectorAll('.section-title').forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal','d1');
  });

  // Countdown boxes stagger
  document.querySelectorAll('.countdown-box').forEach((el, i) => {
    el.classList.add('reveal', `d${i + 1}`);
  });

  // Couple cards
  const cards = document.querySelectorAll('.couple-card');
  if (cards[0]) cards[0].classList.add('reveal-left');
  if (cards[1]) cards[1].classList.add('reveal-right');
  document.querySelector('.couple-amp')?.classList.add('reveal-scale');

  // Event cards
  document.querySelectorAll('.event-card').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });

  // Gallery stagger
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 2) * 0.12}s`;
  });

  // Forms
  document.querySelector('.ucapan-form')?.classList.add('reveal');
  document.querySelector('.gift-card')?.classList.add('reveal');

  // Footer
  const footer = document.querySelector('footer');
  if (footer) {
    footer.querySelector('.footer-label')?.classList.add('reveal','d1');
    footer.querySelector('.footer-names')?.classList.add('reveal','d2');
  }
}

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
function openLightbox(src) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.style.animation = 'lbOut 0.28s ease forwards';
  setTimeout(() => {
    lb.classList.remove('open');
    lb.style.animation = '';
    document.body.style.overflow = '';
  }, 260);
}
(function() {
  const s = document.createElement('style');
  s.textContent = `@keyframes lbOut { to { opacity: 0; } }`;
  document.head.appendChild(s);
})();

/* ============================================================
   RSVP / UCAPAN
   ============================================================ */
function setStatusHadir(btn, status) {
  btn.parentElement.querySelectorAll('.btn-status').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('ucapan-status').value = status;
}

async function kirimUcapan() {
  const namaEl   = document.getElementById('ucapan-nama');
  const pesanEl  = document.getElementById('ucapan-pesan');
  const statusEl = document.getElementById('ucapan-status');
  const btn      = document.querySelector('#ucapan .btn-submit');

  const nama   = namaEl.value.trim();
  const pesan  = pesanEl.value.trim();
  const status = statusEl.value;

  if (!nama || !pesan || !status) {
    [namaEl, pesanEl].forEach(el => {
      if (!el.value.trim()) shakeEl(el);
    });
    alert("Mohon isi nama, pesan, dan konfirmasi kehadiran Anda.");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '⌛ Mengirim...';

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ nama, status, pesan })
    });

    btn.textContent = '🌸 Terkirim!';
    btn.style.background = 'var(--green)';
    namaEl.value  = '';
    pesanEl.value = '';
    statusEl.value = '';
    document.querySelectorAll('.btn-status').forEach(b => b.classList.remove('active'));

    loadMessages();

    setTimeout(() => {
      btn.disabled   = false;
      btn.textContent = 'Kirim Ucapan';
      btn.style.background = '';
    }, 3200);

  } catch (err) {
    console.error(err);
    alert("Maaf, gagal mengirim. Silakan coba lagi.");
    btn.disabled   = false;
    btn.textContent = 'Kirim Ucapan';
  }
}

async function loadMessages() {
  const list = document.getElementById('messages-list');
  if (!list) return;
  list.innerHTML = '<p style="text-align:center;font-size:12px;opacity:0.6;padding:20px 0;">Memuat pesan...</p>';

  try {
    const res  = await fetch(SCRIPT_URL);
    const data = await res.json();

    if (!data.length) {
      list.innerHTML = '<p style="text-align:center;font-size:12px;opacity:0.5;padding:20px 0;">Belum ada ucapan.</p>';
      return;
    }

    list.innerHTML = data.map(item => `
      <div class="message-item revealed pop-in">
        <div class="message-icon">💌</div>
        <div>
          <div class="message-name">
            ${escapeHtml(item.nama)}
            <span class="message-status">${escapeHtml(item.status)}</span>
          </div>
          <div class="message-text">${escapeHtml(item.pesan)}</div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    list.innerHTML = '<p style="text-align:center;color:var(--rose);font-size:12px;padding:20px 0;">Gagal memuat ucapan.</p>';
  }
}

/* ============================================================
   GIFT SECTION
   ============================================================ */
const giftData = {
  bri: {
    bank: "Bank BRI",
    number: "3638 0103 6696 532",
    holder: "a.n. INA NIKMATUL CHASANAH",
    btnText: "Salin Nomor"
  },
  seabank: {
    bank: "SeaBank",
    number: "901683771990",
    holder: "a.n. INA NIKMATUL CHASANAH",
    btnText: "Salin Nomor"
  },
  ewallet: {
    bank: "E-Wallet",
    number: "088224906918",
    holder: "GoPay • OVO • DANA • ShopeePay",
    btnText: "Salin Nomor"
  },
  kado: {
    bank: "Alamat Pengiriman",
    number: "Dsn. Grogol RT/RW 006/006\nDs. Grogol Kec. Diwek Kab. Jombang",
    holder: "Penerima: Ina Nikmatul Chasanah",
    btnText: "Salin Alamat"
  }
};

function updateGiftDisplay() {
  const key       = document.getElementById('gift-selector').value;
  const selected  = giftData[key];
  const detailBox = document.getElementById('gift-detail-box');

  detailBox.style.opacity = '0';
  detailBox.style.transform = 'translateY(8px)';
  detailBox.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

  setTimeout(() => {
    document.getElementById('display-bank').innerText   = selected.bank;
    document.getElementById('display-number').innerText = selected.number;
    document.getElementById('display-holder').innerText = selected.holder;
    document.getElementById('btn-copy-gift').innerText  = selected.btnText;
    detailBox.style.opacity   = '1';
    detailBox.style.transform = 'translateY(0)';
  }, 230);
}

function copyGiftText() {
  const text = document.getElementById('display-number').innerText;
  const btn  = document.getElementById('btn-copy-gift');
  const orig = btn.innerText;

  navigator.clipboard.writeText(text).then(() => {
    btn.innerText = "✓ Tersalin";
    btn.style.background = "var(--green)";
    btn.style.color = "#fff";
    setTimeout(() => {
      btn.innerText = orig;
      btn.style.background = "";
      btn.style.color = "";
    }, 2200);
  });
}

/* ============================================================
   NAMA TAMU DARI URL
   ============================================================ */
function gantiNamaTamu() {
  const name = new URLSearchParams(window.location.search).get('to');
  if (name) {
    const el = document.querySelector('.cover-guest');
    if (el) el.innerText = name;
  }
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT
   ============================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], #countdown-section');
  const navLinks = document.querySelectorAll('.sticky-nav a');

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        const match = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active-nav', match);
      });
    });
  }, { threshold: 0.35 }).observe(
    ...Array.from(sections).length ? sections : [document.body]
  );

  // Separate observer for each section
  sections.forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.35 }).observe(s);
  });
}

/* ============================================================
   HELPERS
   ============================================================ */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function shakeEl(el) {
  const s = document.createElement('style');
  s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
  document.head.appendChild(s);
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

function copyText(elementId, btn) {
  const text = document.getElementById(elementId)?.innerText;
  if (!text) return;
  const orig = btn.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.innerText = "✓ Tersalin";
    btn.style.background = "var(--green)";
    btn.style.color = "#fff";
    setTimeout(() => {
      btn.innerText = orig;
      btn.style.background = "";
      btn.style.color = "";
    }, 2000);
  });
}

function changePage(dir) {
  // placeholder for pagination if needed
}
