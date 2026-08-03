/* ============================================================
   GOOGLE SHEETS ENDPOINT
   ============================================================ */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby5XWkYAXiaI4nNMizOQ7HkCeuSiHfrQu3h0AVvsFyawPIxxoLFmFTbML53MukPcbL8/exec";

/* ============================================================
   OPEN INVITATION
   ============================================================ */
function openInvitation(e) {
  e.preventDefault();

  // Ambil nama tamu dari input (jika diisi manual)
  getGuestNameFromInput();

  // Button loading feedback
  const btn = document.getElementById('btn-open');
  if (btn) {
    btn.textContent = '✦ Membuka...';
    btn.style.pointerEvents = 'none';
  }

  // Cover fade out
  const cover = document.getElementById('cover');
  cover.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  cover.style.opacity = '0';
  cover.style.transform = 'scale(1.05)';

  setTimeout(() => {
    document.body.classList.remove('cover-active');
    cover.style.display = 'none';

    const main = document.getElementById('main-content');
    main.classList.add('open');

    const footer = document.getElementById('site-footer');
    if (footer) footer.classList.remove('footer-hidden');

    // Launch confetti celebration
    launchConfetti();

    // Show music player pill
    showMusicPlayer();

    // Start music with FADE IN effect
    musicFadeIn();

    requestAnimationFrame(() => {
      startCountdown();
      initScrollReveal();
      spawnMainPetals();
      initCalendarLink();
      initScrollIndicatorHide();
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
    const size = 7 + Math.random() * 9;
    const dur = 7 + Math.random() * 9;
    const delay = Math.random() * 12;
    const left = Math.random() * 100;
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

/* Sparkle dots — subtle twinkling gold particles */
function spawnSparkles(container, count) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const size = 2 + Math.random() * 3;
    const dur = 2 + Math.random() * 3;
    const delay = Math.random() * 5;
    const left = 10 + Math.random() * 80;
    const top = 10 + Math.random() * 80;
    s.style.cssText = `
      left:${left}%;
      top:${top}%;
      width:${size}px;
      height:${size}px;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    container.appendChild(s);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const cover = document.getElementById('cover');
  if (cover) {
    spawnPetals(cover, 16);
    spawnSparkles(cover, 12);
  }
  gantiNamaTamu();
  loadMessages();
});

/* ============================================================
   PREMIUM MUSIC PLAYER — FADE IN / FADE OUT
   ============================================================ */
const FADE_DURATION = 2200;   // ms — how long the full fade takes
let fadeInterval = null;

/* ============================================================
   PREMIUM MUSIC PLAYER — INSTANT PLAY/PAUSE
   ============================================================ */

/* Playlist data */
const playlist = [
  { src: 'media/Brian McKnight  - Marry Your Daughter.m4a', title: 'Marry Your Daughter', artist: 'Brian McKnight' },
  { src: 'media/Sheila on 7 - Hari Bersamanya.m4a', title: 'Hari Bersamanya', artist: 'Sheila on 7' },
  { src: "media/Paul Partohap - THANK YOU 4 LOVIN' ME.m4a", title: "Thank You 4 Lovin' Me", artist: 'Paul Partohap' },
  { src: 'media/Barasuara - Terbuang Dalam Waktu.m4a', title: 'Terbuang Dalam Waktu', artist: 'Barasuara' }
];
let currentTrack = 0;

function loadTrack(index) {
  const audio = document.getElementById('wedding-audio');
  if (!audio) return;
  currentTrack = index;
  const track = playlist[currentTrack];
  audio.src = track.src;

  const titleEl = document.getElementById('music-song-title');
  const artistEl = document.getElementById('music-song-artist');
  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;
}

function nextTrack(e) {
  if (e) e.stopPropagation();
  const audio = document.getElementById('wedding-audio');
  const wasPlaying = audio && !audio.paused;

  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);

  expandPill();
  schedulePillCollapse(3000);

  if (wasPlaying) {
    audio.play().then(() => setPillState(true));
  }
}

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
    if (icon) icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>';
    pill?.classList.add('playing');
  } else {
    if (icon) icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
    pill?.classList.remove('playing');
  }
}

/* ============================================================
   PREMIUM MUSIC PLAYER — SMART HOVER GUARD & TIMER
   ============================================================ */
let pillCollapseTimer = null;
let isMouseInsidePill = false;

function clearPillTimer() {
  if (pillCollapseTimer) {
    clearTimeout(pillCollapseTimer);
    pillCollapseTimer = null;
  }
}

function expandPill() {
  clearPillTimer();
  document.querySelector('.music-pill')?.classList.add('expanded');
}

function collapsePill() {
  if (isMouseInsidePill) return; // Guard: do not collapse while cursor is over the pill
  clearPillTimer();
  document.querySelector('.music-pill')?.classList.remove('expanded');
}

function schedulePillCollapse(delayMs = 3000) {
  clearPillTimer();
  pillCollapseTimer = setTimeout(() => {
    collapsePill();
  }, delayMs);
}

/* Show the pill with a slide-up entrance */
function showMusicPlayer() {
  const player = document.querySelector('.music-player');
  if (!player) return;

  // Expand immediately so song title & artist are revealed without delay
  expandPill();

  player.classList.add('visible');
  player.style.opacity = '0';
  player.style.transition = 'opacity 0.4s ease';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      player.style.opacity = '1';
      setTimeout(() => {
        player.style.transition = '';
        player.style.opacity = '';
      }, 450);
    });
  });

  // Keep expanded initially for 7s so user can comfortably see the song info
  schedulePillCollapse(7000);
}

/* Hover & Touch expand/collapse handlers */
document.addEventListener('DOMContentLoaded', () => {
  const pill = document.querySelector('.music-pill');
  if (!pill) return;

  // Desktop: Hover Guard
  pill.addEventListener('mouseenter', () => {
    isMouseInsidePill = true;
    expandPill();
  });

  pill.addEventListener('mouseleave', () => {
    isMouseInsidePill = false;
    schedulePillCollapse(3000); // 3s grace period after cursor leaves
  });

  // Mobile: Touch Support
  pill.addEventListener('touchstart', () => {
    expandPill();
    schedulePillCollapse(6000); // 6s view time on touch
  }, { passive: true });
});

/* ============================================================
   COUNTDOWN — with digit-flip animation
   ============================================================ */
function startCountdown() {
  const target = new Date('2026-08-23T10:00:00+07:00');
  const prev = { days: null, hours: null, minutes: null, seconds: null };

  function setVal(id, key, val) {
    const str = String(val).padStart(2, '0');
    const el = document.getElementById(id);
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
      ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    setVal('cd-days', 'days', Math.floor(diff / 86400000));
    setVal('cd-hours', 'hours', Math.floor((diff % 86400000) / 3600000));
    setVal('cd-minutes', 'minutes', Math.floor((diff % 3600000) / 60000));
    setVal('cd-seconds', 'seconds', Math.floor((diff % 60000) / 1000));
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   GOOGLE CALENDAR LINK
   ============================================================ */
function initCalendarLink() {
  const title = "Pernikahan Iqbal & Ina";
  const details = "Mohon doa restu dan kehadirannya dalam acara pernikahan kami.";
  const location = "Perumahan Denanyar Indah AA 11 Rt 04 Rw 07, Jombang";
  const start = "20260823T030000Z";
  const end = "20260823T120000Z";

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

      if (['reveal', 'reveal-left', 'reveal-right', 'reveal-scale'].some(c => el.classList.contains(c))) {
        el.classList.add('revealed');
      }
      if (el.classList.contains('story-dot')) el.classList.add('revealed');
      if (el.classList.contains('story-timeline')) setTimeout(() => el.classList.add('line-grow'), 200);
      if (el.classList.contains('gallery-item')) el.classList.add('revealed');
      if (el.classList.contains('divider-leaf')) el.classList.add('revealed');
      if (el.classList.contains('event-card')) el.classList.add('revealed');
      if (el.classList.contains('message-item')) el.classList.add('revealed');

      if (el.tagName === 'SECTION') {
        el.classList.add('in-view');
        setTimeout(() => el.classList.remove('in-view'), 700);
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

  ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.story-dot', '.story-timeline', '.gallery-item',
    '.divider-leaf', '.event-card', '.message-item', 'section']
    .forEach(sel => document.querySelectorAll(sel).forEach(el => observer.observe(el)));
}

function addRevealClasses() {
  // Section labels & titles
  document.querySelectorAll('.section-label').forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  document.querySelectorAll('.section-title').forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal', 'd1');
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
    footer.querySelector('.footer-label')?.classList.add('reveal', 'd1');
    footer.querySelector('.footer-names')?.classList.add('reveal', 'd2');
  }
}

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
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
(function () {
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
  const namaEl = document.getElementById('ucapan-nama');
  const pesanEl = document.getElementById('ucapan-pesan');
  const statusEl = document.getElementById('ucapan-status');
  const btn = document.querySelector('#ucapan .btn-submit');

  const nama = namaEl.value.trim();
  const pesan = pesanEl.value.trim();
  const status = statusEl.value;

  // Clear previous errors
  clearFormErrors();

  // Inline validation
  let hasError = false;
  if (!nama) {
    showFormError('error-nama', 'Mohon isi nama Anda');
    shakeEl(namaEl);
    hasError = true;
  }
  if (!status) {
    showFormError('error-status', 'Pilih konfirmasi kehadiran');
    hasError = true;
  }
  if (!pesan) {
    showFormError('error-pesan', 'Tuliskan pesan atau doa Anda');
    shakeEl(pesanEl);
    hasError = true;
  }
  if (hasError) return;

  btn.disabled = true;
  btn.innerHTML = '⌛ Mengirim...';

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ nama, status, pesan })
    });

    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" style="vertical-align:middle;margin-right:6px;"><polyline points="20 6 9 17 4 12"/></svg> Terkirim!';
    btn.style.background = 'var(--green)';
    namaEl.value = '';
    pesanEl.value = '';
    statusEl.value = '';
    document.querySelectorAll('.btn-status').forEach(b => b.classList.remove('active'));

    loadMessages();

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send" style="vertical-align:middle;margin-right:6px;"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Kirim Ucapan';
      btn.style.background = '';
    }, 3200);

  } catch (err) {
    console.error(err);
    showFormError('error-pesan', 'Gagal mengirim. Silakan coba lagi.');
    btn.disabled = false;
    btn.textContent = 'Kirim Ucapan';
  }
}

function showFormError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
    el.classList.add('visible');
  }
}

function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
}

function getStatusClass(status = '') {
  const s = status.toLowerCase();
  if (s.includes('hadir') && !s.includes('tidak')) return 'status-hadir';
  if (s.includes('tidak')) return 'status-tidak-hadir';
  if (s.includes('ragu')) return 'status-ragu-ragu';
  return '';
}

async function loadMessages() {
  const list = document.getElementById('messages-list');
  if (!list) return;
  showMessagesSkeleton(list);

  try {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();

    if (!data.length) {
      list.innerHTML = '<p style="text-align:center;font-size:12px;opacity:0.5;padding:20px 0;">Belum ada ucapan.</p>';
      return;
    }

    list.innerHTML = data.map(item => {
      const initial = item.nama ? item.nama.trim().charAt(0).toUpperCase() : '💌';
      const statusCls = getStatusClass(item.status);
      return `
      <div class="message-item revealed pop-in">
        <div class="message-icon">${escapeHtml(initial)}</div>
        <div style="flex:1;">
          <div class="message-name">
            ${escapeHtml(item.nama)}
            ${item.status ? `<span class="message-status ${statusCls}">${escapeHtml(item.status)}</span>` : ''}
          </div>
          <div class="message-text">${escapeHtml(item.pesan)}</div>
        </div>
      </div>
    `;
    }).join('');

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
    number: "363801036696532",
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
    number: "Perumahaan Denanyar Indah AA-11 Rt 04 Rw 07, Denanyar, Jombang",
    holder: "Penerima: Iqbal Maulana",
    btnText: "Salin Alamat"
  }
};

function toggleGiftDropdown(e) {
  if (e) e.stopPropagation();
  const trigger = document.getElementById('gift-dropdown-trigger');
  const menu = document.getElementById('gift-dropdown-menu');
  if (!menu || !trigger) return;
  const isOpen = menu.classList.contains('show');

  if (isOpen) {
    closeGiftDropdown();
  } else {
    menu.classList.add('show');
    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }
}

function closeGiftDropdown() {
  const trigger = document.getElementById('gift-dropdown-trigger');
  const menu = document.getElementById('gift-dropdown-menu');
  if (menu && trigger) {
    menu.classList.remove('show');
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }
}

function selectGiftDropdownOption(el, key) {
  document.querySelectorAll('.gift-dropdown-option').forEach(opt => opt.classList.remove('active'));
  el.classList.add('active');

  const triggerSelected = document.getElementById('gift-dropdown-selected');
  if (triggerSelected) {
    triggerSelected.innerHTML = el.innerHTML;
  }

  const selector = document.getElementById('gift-selector');
  if (selector) {
    selector.value = key;
    updateGiftDisplay();
  }

  closeGiftDropdown();
}

function selectGiftMethod(btn, key) {
  const option = document.querySelector(`.gift-dropdown-option[data-value="${key}"]`);
  if (option) {
    selectGiftDropdownOption(option, key);
  }
}

document.addEventListener('click', function (e) {
  const dropdown = document.getElementById('custom-gift-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    closeGiftDropdown();
  }
});

function updateGiftDisplay() {
  const key = document.getElementById('gift-selector').value;
  const selected = giftData[key];
  const detailBox = document.getElementById('gift-detail-box');
  const btn = document.getElementById('btn-copy-gift');

  detailBox.style.opacity = '0';
  detailBox.style.transform = 'translateY(8px)';
  detailBox.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

  setTimeout(() => {
    document.getElementById('display-bank').innerText = selected.bank;
    document.getElementById('display-number').innerText = selected.number;
    document.getElementById('display-holder').innerText = selected.holder;
    btn.setAttribute('data-orig', selected.btnText);
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" style="margin-right:4px;"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> ${selected.btnText}`;
    btn.classList.remove('copied');
    detailBox.style.opacity = '1';
    detailBox.style.transform = 'translateY(0)';
  }, 230);
}

function copyGiftText() {
  const text = document.getElementById('display-number').innerText;
  const btn = document.getElementById('btn-copy-gift');
  const orig = btn.getAttribute('data-orig') || 'Salin Nomor';

  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" style="vertical-align:middle;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg> Berhasil Disalin';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" style="margin-right:4px;"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> ${orig}`;
      btn.classList.remove('copied');
    }, 2200);
  });
}

/* ============================================================
   NAMA TAMU DARI URL — atau input manual jika tidak ada
   ============================================================ */
let guestName = '';

function gantiNamaTamu() {
  const name = new URLSearchParams(window.location.search).get('to');
  const guestEl = document.querySelector('.cover-guest');
  const inputWrap = document.getElementById('cover-guest-input');
  const placeEl = document.querySelector('.cover-place');

  if (name) {
    // Ada parameter ?to= → tampilkan nama langsung
    guestName = name;
    if (guestEl) guestEl.innerText = name;
  } else {
    // Tidak ada parameter → sembunyikan teks default, tampilkan input
    if (guestEl) guestEl.style.display = 'none';
    if (placeEl) placeEl.style.display = 'none';
    if (inputWrap) inputWrap.style.display = 'block';
  }
}

/* Ambil nama dari input cover saat buka undangan */
function getGuestNameFromInput() {
  const input = document.getElementById('input-nama-tamu');
  if (input && input.value.trim()) {
    guestName = input.value.trim();
  }
  // Auto-fill ke form ucapan
  const ucapanNama = document.getElementById('ucapan-nama');
  if (ucapanNama && guestName) {
    ucapanNama.value = guestName;
  }
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT — single observer for all sections
   ============================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], #countdown-section');
  const navLinks = document.querySelectorAll('.sticky-nav a');
  const sideNavDots = document.querySelectorAll('.side-nav-dot');

  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      // Update top nav
      navLinks.forEach(a => {
        a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
      });
      // Update side nav dots
      sideNavDots.forEach(dot => {
        dot.classList.toggle('active-nav', dot.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   HELPERS
   ============================================================ */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Shake animation style — injected once */
(function () {
  const s = document.createElement('style');
  s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
  document.head.appendChild(s);
})();

function shakeEl(el) {
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

/* ============================================================
   SCROLL INDICATOR — hide after first scroll
   ============================================================ */
function initScrollIndicatorHide() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;

  let hidden = false;
  window.addEventListener('scroll', function () {
    if (!hidden && window.scrollY > 100) {
      indicator.classList.add('hidden');
      hidden = true;
    }
  }, { passive: true });
}

/* ============================================================
   LIGHTBOX — KEYBOARD SUPPORT (Escape to close)
   ============================================================ */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('open')) {
      closeLightbox();
    }
  }
});

/* ============================================================
   SIDE NAV TOGGLE (scroll-up reveal, scroll-down collapse)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('side-nav-toggle');
  const sideNav = document.getElementById('side-nav');
  if (!toggleBtn || !sideNav) return;

  let isManual = false;
  let scrollTimer = null;
  let lastScrollY = window.scrollY;

  toggleBtn.addEventListener('click', () => {
    isManual = true;
    sideNav.classList.toggle('collapsed');
    const isCollapsed = sideNav.classList.contains('collapsed');
    toggleBtn.setAttribute('aria-label', isCollapsed ? 'Tampilkan navigasi' : 'Sembunyikan navigasi');
  });

  window.addEventListener('scroll', () => {
    if (isManual) return;

    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (Math.abs(delta) > 4) {
      if (delta > 0) {
        // Scrolling DOWN -> Collapse side nav
        if (!sideNav.classList.contains('collapsed')) {
          sideNav.classList.add('collapsed');
          toggleBtn.setAttribute('aria-label', 'Tampilkan navigasi');
        }
      } else {
        // Scrolling UP -> Reveal side nav
        if (sideNav.classList.contains('collapsed')) {
          sideNav.classList.remove('collapsed');
          toggleBtn.setAttribute('aria-label', 'Sembunyikan navigasi');
        }
      }
      lastScrollY = currentScrollY;
    }

    // Auto-expand side nav 1.8s after scroll stops
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (!isManual) {
        sideNav.classList.remove('collapsed');
        toggleBtn.setAttribute('aria-label', 'Sembunyikan navigasi');
      }
    }, 1800);
  }, { passive: true });
});

/* ============================================================
   LOADING SKELETON FOR MESSAGES
   ============================================================ */
function showMessagesSkeleton(container) {
  let html = '';
  for (let i = 0; i < 3; i++) {
    html += `<div class="messages-skeleton">
      <div class="skeleton-circle"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>`;
  }
  container.innerHTML = html;
}

/* ============================================================
   CONFETTI ANIMATION — triggered when opening invitation
   ============================================================ */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#c9a96e', '#e8c9b8', '#c9826b', '#a5b898', '#6b7c5e', '#e8d5a3', '#fff'];
  const confettiCount = 120;
  const confetti = [];

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      drift: (Math.random() - 0.5) * 1.5,
      opacity: 1
    });
  }

  let frame = 0;
  const maxFrames = 180; // ~3 seconds at 60fps

  function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fadeStart = maxFrames * 0.65;
    const globalOpacity = frame > fadeStart ? 1 - (frame - fadeStart) / (maxFrames - fadeStart) : 1;

    confetti.forEach(c => {
      c.y += c.speed;
      c.x += c.drift + Math.sin(c.angle) * 0.5;
      c.angle += c.spin;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      ctx.globalAlpha = globalOpacity * c.opacity;
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    });

    if (frame < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }

  requestAnimationFrame(animate);
}

/* ============================================================
   PREVENT MOBILE PINCH ZOOM & DOUBLE-TAP ZOOM
   ============================================================ */
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function (e) {
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });
