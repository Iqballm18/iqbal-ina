/* ============================================================
   OPEN INVITATION
   ============================================================ */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby5XWkYAXiaI4nNMizOQ7HkCeuSiHfrQu3h0AVvsFyawPIxxoLFmFTbML53MukPcbL8/exec";
function openInvitation(e) {
  e.preventDefault();

  // Jalankan Musik
  const audio = document.getElementById('wedding-audio');
  const musicBtn = document.getElementById('music-control');
  
  if (audio) {
    audio.play().catch(error => console.log("Autoplay dicegah browser"));
    musicBtn.style.display = 'flex';
    musicBtn.classList.add('playing');
  }

  // cover fade out
  const cover = document.getElementById('cover');
  cover.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cover.style.opacity    = '0';
  cover.style.transform  = 'scale(1.04)';

  setTimeout(() => {
    cover.style.display = 'none';
    const main = document.getElementById('main-content');
    main.classList.add('open');

    requestAnimationFrame(() => {
      startCountdown();
      initScrollReveal();
      spawnPetals();
      initCalendarLink(); // Panggil fungsi kalender di sini
      setTimeout(initActiveNav, 700); // Panggil nav highlight di sini
    });
  }, 600);
}

/* ============================================================
   FLOATING PETALS (cover only – spawned on load)
   ============================================================ */
function spawnPetals() {
  const container = document.getElementById('cover') || document.body;
  // remove existing petals first
  document.querySelectorAll('.petal').forEach(p => p.remove());

  const count = 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size  = 7 + Math.random() * 8;
    const dur   = 6 + Math.random() * 8;
    const delay = Math.random() * 10;
    const left  = Math.random() * 100;
    p.style.cssText = `
      left:${left}%;
      width:${size}px; height:${size * 1.4}px;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    container.appendChild(p);
  }
}
window.addEventListener('DOMContentLoaded', spawnPetals);

/* ============================================================
   COUNTDOWN  (with digit-flip animation)
   ============================================================ */
function startCountdown() {
  const target = new Date('2026-08-21T08:00:00');

  const ids = ['cd-days','cd-hours','cd-minutes','cd-seconds'];
  const prev = { days: null, hours: null, minutes: null, seconds: null };

  function setVal(id, key, val) {
    const str = String(val).padStart(2, '0');
    const el  = document.getElementById(id);
    if (!el) return;
    if (prev[key] !== str) {
      el.classList.remove('flip');
      void el.offsetWidth;          // reflow to restart animation
      el.classList.add('flip');
      el.textContent = str;
      prev[key] = str;
    }
  }

  function update() {
    const diff = target - new Date();
    if (diff <= 0) {
      ids.forEach(id => { const el = document.getElementById(id); if(el) el.textContent='00'; });
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

function initCalendarLink() {
  const eventTitle = "Pernikahan Iqbal & Ina";
  const eventDetails = "Mohon doa restu dan kehadirannya dalam acara pernikahan kami.";
  const eventLocation = "Dsn. Grogol RT/RW 006/006 Ds. Grogol Kec. Diwek Kab. Jombang";
  
  // Format tanggal untuk Google Calendar (YYYYMMDDTHHMMSSZ)
  // Akad dimulai jam 08:00 WIB (UTC+7), maka dalam UTC adalah 01:00
  const startDate = "20260821T010000Z"; 
  const endDate = "20260821T100000Z"; // Asumsi selesai jam 17:00 WIB (10:00 UTC)

  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}&sf=true&output=xml`;

  const calendarBtn = document.getElementById('btn-google-calendar');
  if (calendarBtn) {
    calendarBtn.href = calendarUrl;
  }
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

      // generic reveal classes
      if (el.classList.contains('reveal') ||
          el.classList.contains('reveal-left') ||
          el.classList.contains('reveal-right') ||
          el.classList.contains('reveal-scale')) {
        el.classList.add('revealed');
      }

      // special: story dots pop in
      if (el.classList.contains('story-dot')) {
        el.classList.add('revealed');
      }

      // special: timeline line grows
      if (el.classList.contains('story-timeline')) {
        setTimeout(() => el.classList.add('line-grow'), 150);
      }

      // special: gallery items stagger
      if (el.classList.contains('gallery-item')) {
        el.classList.add('revealed');
      }

      // special: divider grows
      if (el.classList.contains('divider-leaf')) {
        el.classList.add('revealed');
      }

      // special: event card top bar
      if (el.classList.contains('event-card')) {
        el.classList.add('revealed');
      }

      // special: message items slide in
      if (el.classList.contains('message-item')) {
        el.classList.add('revealed');
      }

      // section wash background flash
      if (el.tagName === 'SECTION') {
        el.classList.add('in-view');
        setTimeout(() => el.classList.remove('in-view'), 700);
      }

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // observe everything that needs it
  const selectors = [
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.story-dot', '.story-timeline', '.gallery-item',
    '.divider-leaf', '.event-card', '.message-item', 'section'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => observer.observe(el));
  });
}

/* ============================================================
   ADD REVEAL CLASSES PROGRAMMATICALLY
   So the HTML stays clean — JS decides who gets what animation.
   ============================================================ */
function addRevealClasses() {

  /* ---- hero section (first section after nav) ---- */
  const heroSection = document.querySelector('#main-content > section:first-of-type');
  if (heroSection) {
    heroSection.querySelector('.section-label')?.classList.add('reveal', 'd1');
    heroSection.querySelector('.section-title')?.classList.add('reveal', 'd2');
  }

  /* ---- all section labels & titles ---- */
  document.querySelectorAll('.section-label').forEach((el, i) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  document.querySelectorAll('.section-title').forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal', 'd1');
  });

  /* ---- countdown boxes slide up with stagger ---- */
  document.querySelectorAll('.countdown-box').forEach((el, i) => {
    el.classList.add('reveal', `d${i + 1}`);
  });

  /* ---- couple: bride from right, groom from left, amp scale ---- */
  const coupleCards = document.querySelectorAll('.couple-card');
  if (coupleCards[0]) coupleCards[0].classList.add('reveal-left');
  if (coupleCards[1]) coupleCards[1].classList.add('reveal-right');
  const amp = document.querySelector('.couple-amp');
  if (amp) amp.classList.add('reveal-scale');

  /* ---- event cards alternate left/right ---- */
  document.querySelectorAll('.event-card').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });

  /* ---- story text: odd from right, even from left ---- */
  document.querySelectorAll('.story-item').forEach((item, i) => {
    const text = item.querySelector('.story-text');
    if (!text) return;
    text.classList.add(i % 2 === 0 ? 'reveal-right' : 'reveal-left');
  });

  /* ---- gallery items: scale in with stagger ---- */
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.1 + Math.floor(i / 3) * 0.08}s`;
  });

  /* ---- ucapan form ---- */
  document.querySelector('.ucapan-form')?.classList.add('reveal');

  /* ---- rsvp container ---- */
  document.querySelector('.rsvp-container')?.classList.add('reveal');

  /* ---- footer children ---- */
  const footer = document.querySelector('footer');
  if (footer) {
    footer.querySelector('.footer-label')?.classList.add('reveal', 'd1');
    footer.querySelector('.footer-names')?.classList.add('reveal', 'd2');
  }
}

/* ===================== COPY TO CLIPBOARD ===================== */
function copyText(elementId, btn) {
  const text = document.getElementById(elementId).innerText;
  const originalText = btn.innerText;

  navigator.clipboard.writeText(text).then(() => {
    btn.innerText = "✓ Tersalin";
    btn.style.background = "var(--green)";
    btn.style.color = "#fff";
    
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = "";
      btn.style.color = "";
    }, 2000);
  }).catch(err => {
    console.error('Gagal menyalin: ', err);
  });
}

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
function openLightbox(src) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.style.animation = 'lbOut 0.25s ease forwards';
  setTimeout(() => {
    lb.classList.remove('open');
    lb.style.animation = '';
    document.body.style.overflow = '';
  }, 240);
}

/* add lbOut keyframe dynamically */
(function() {
  const style = document.createElement('style');
  style.textContent = `@keyframes lbOut { to { opacity: 0; } }`;
  document.head.appendChild(style);
})();

/* ============================================================
   RSVP INTERACTIONS
   ============================================================ */
function toggleCheck(el) {
  const cb = el.querySelector('.rsvp-checkbox');
  if (cb.classList.contains('checked')) {
    cb.classList.remove('checked');
    cb.textContent = '';
  } else {
    cb.classList.add('checked');
    cb.textContent = '✓';
  }
}

function setJumlah(btn) {
  document.querySelectorAll('.jumlah-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function submitRSVP() {
  const btn = document.querySelector('#rsvp .btn-submit');
  if (btn) {
    btn.textContent = '✓ Terkirim!';
    btn.style.background = 'var(--green)';
    setTimeout(() => {
      btn.textContent = 'Kirim Konfirmasi';
      btn.style.background = '';
    }, 3000);
  }
}

/* ============================================================
   UCAPAN / MESSAGES
   ============================================================ */
// Fungsi untuk memilih status kehadiran
function setStatusHadir(btn, status) {
  // Reset semua tombol di container yang sama
  const container = btn.parentElement;
  container.querySelectorAll('.btn-status').forEach(b => b.classList.remove('active'));
  
  // Aktifkan tombol yang diklik
  btn.classList.add('active');
  
  // Set value ke hidden input
  document.getElementById('ucapan-status').value = status;
}

// Update fungsi kirimUcapan yang sudah ada
async function kirimUcapan() {
  const namaEl   = document.getElementById('ucapan-nama');
  const pesanEl  = document.getElementById('ucapan-pesan');
  const statusEl = document.getElementById('ucapan-status');

  const btnSubmit = document.querySelector('#ucapan .btn-submit');
  
  const nama   = namaEl.value.trim();
  const pesan  = pesanEl.value.trim();
  const status = statusEl.value;

  if (!nama || !pesan || !status) {
    alert("Mohon isi nama, pesan, dan konfirmasi kehadiran Anda.");
    return;
  }

  // Efek Loading
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span>⌛ Mengirim...</span>';

  try {
    // Kirim ke Google Sheets
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ nama, status, pesan })
    });

    // Feedback Berhasil
    btnSubmit.textContent = '🌸 Terkirim!';
    btnSubmit.style.background = 'var(--green)';
    
    // Reset Form
    namaEl.value = '';
    pesanEl.value = '';
    statusEl.value = '';
    document.querySelectorAll('.btn-status').forEach(b => b.classList.remove('active'));

    // Muat ulang daftar pesan agar yang baru muncul
    loadMessages();

    setTimeout(() => {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Kirim Ucapan';
      btnSubmit.style.background = '';
    }, 3000);

  } catch (error) {
    console.error('Error!', error.message);
    alert("Maaf, gagal mengirim ucapan. Silakan coba lagi.");
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Kirim Ucapan';
  }
}

async function loadMessages() {
  const listContainer = document.getElementById('messages-list');
  listContainer.innerHTML = '<p style="text-align:center; font-size:12px; opacity:0.6;">Memuat pesan...</p>';

  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();

    if (data.length === 0) {
      listContainer.innerHTML = '<p style="text-align:center; font-size:12px; opacity:0.5;">Belum ada ucapan.</p>';
      return;
    }

    // Render data ke HTML
    listContainer.innerHTML = data.map(item => `
      <div class="message-item revealed pop-in">
        <div class="message-icon">💌</div>
        <div>
          <div class="message-name">
            ${escapeHtml(item.nama)} 
            <span class="message-status">${item.status}</span>
          </div>
          <div class="message-text">${escapeHtml(item.pesan)}</div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    listContainer.innerHTML = '<p style="text-align:center; color:red; font-size:12px;">Gagal memuat ucapan.</p>';
    console.error(error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  gantiNamaTamu();
  loadMessages(); // Tambahkan ini agar pesan langsung muncul saat web dibuka
});

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* shake keyframe */
(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-7px); }
      40%      { transform: translateX(7px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   NAMA TAMU DARI URL  (?to=Budi+Santoso)
   ============================================================ */
function gantiNamaTamu() {
  const params    = new URLSearchParams(window.location.search);
  const namaTamu  = params.get('to');
  if (namaTamu) {
    const el = document.querySelector('.cover-guest');
    if (el) el.innerText = namaTamu;
  }
}
window.addEventListener('DOMContentLoaded', gantiNamaTamu);

/* ============================================================
   ACTIVE NAV HIGHLIGHT on scroll
   ============================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], #countdown-section');
  const navLinks = document.querySelectorAll('.sticky-nav a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--rose)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
}

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
function toggleMusic(e) {
  const audio = document.getElementById('wedding-audio');
  const btn = document.getElementById('music-control');
  const icon = document.getElementById('music-icon');

  if (audio.paused) {
    audio.play();
    btn.classList.add('playing');
    icon.textContent = '🎵';
  } else {
    audio.pause();
    btn.classList.remove('playing');
    icon.textContent = '🔇';
  }
}

const giftData = {
  bri: {
    bank: "BRI",
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
    holder: "GoPay, OVO, DANA, ShopeePay",
    btnText: "Salin Nomor"
  },
  kado: {
    bank: "Alamat Pengiriman",
    number: "Dsn. Grogol RT/RW 006/006 Ds. Grogol Kec. Diwek Kab. Jombang",
    holder: "Penerima: Ina Nikmatul Chasanah",
    btnText: "Salin Alamat"
  }
};

function updateGiftDisplay() {
  const selector = document.getElementById('gift-selector');
  const selected = giftData[selector.value];
  const detailBox = document.getElementById('gift-detail-box');

  // Animasi fade out sederhana
  detailBox.style.opacity = '0';
  
  setTimeout(() => {
    document.getElementById('display-bank').innerText = selected.bank;
    document.getElementById('display-number').innerText = selected.number;
    document.getElementById('display-holder').innerText = selected.holder;
    document.getElementById('btn-copy-gift').innerText = selected.btnText;
    
    // Fade in kembali
    detailBox.style.opacity = '1';
  }, 200);
}

function copyGiftText() {
  const text = document.getElementById('display-number').innerText;
  const btn = document.getElementById('btn-copy-gift');
  const originalText = btn.innerText;

  navigator.clipboard.writeText(text).then(() => {
    btn.innerText = "✓ Tersalin";
    btn.style.background = "var(--green)";
    btn.style.color = "#fff";
    
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = "";
      btn.style.color = "";
    }, 2000);
  });
}