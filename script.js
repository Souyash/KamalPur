/* ══════════════════════════════════════════════════════════════
   KAMALPUR ABHIJAAN SANGHA — JAVASCRIPT
   Interactivity & Smooth Experience inspired by kallol.com
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initIntroOverlay();
  initNav();
  initScrollReveal();
  initCarousels();
  initDonationPresets();
});

/* ── 1. Real-time Animated Cinematic Video Engine & Authentic Dhaak Synthesizer ── */
let introCountdownTimer = null;
let dhakAudioContext = null;
let dhakInterval = null;
let isDhakPlaying = false;
let videoCanvasAnimId = null;

function initIntroOverlay() {
  // Start Realtime Animated Video Canvas Engine
  initRealtimeVideoCanvas();

  // Countdown timer for auto-dismiss (7 seconds)
  let timeLeft = 7;
  const timerSpan = document.getElementById('introSecLeft');
  introCountdownTimer = setInterval(() => {
    timeLeft -= 1;
    if (timerSpan) timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(introCountdownTimer);
      dismissIntro();
    }
  }, 1000);

  // Allow clicking anywhere outside buttons to enter
  const overlay = document.getElementById('intro-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target.closest('#introAudioBtn')) return;
      dismissIntro();
    });
  }

  // Allow escape key to dismiss
  document.addEventListener('keydown', function handleIntroEsc(e) {
    if (e.key === 'Escape') {
      dismissIntro();
      document.removeEventListener('keydown', handleIntroEsc);
    }
  });
}

function dismissIntro() {
  if (introCountdownTimer) {
    clearInterval(introCountdownTimer);
    introCountdownTimer = null;
  }
  stopDhakAudio();

  if (videoCanvasAnimId) {
    cancelAnimationFrame(videoCanvasAnimId);
    videoCanvasAnimId = null;
  }

  const overlay = document.getElementById('intro-overlay');
  if (overlay && !overlay.classList.contains('hidden')) {
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 1000);
  }
}

/* ══════════════════════════════════════════════════════════════
   REAL-TIME 60FPS CINEMATIC VIDEO ENGINE
   Simulates full HD 60fps theatrical Durga Puja celebration:
   - Ken Burns cinematic camera pan, zoom and breathing
   - Volumetric rising incense smoke & glowing heat haze
   - Dynamic golden particle & ember field with physics
   - Ray-traced divine lens flare & halo god-rays pulsing
   - Live rhythmic bass flash synced with Dhaak drum beats
══════════════════════════════════════════════════════════════ */
function initRealtimeVideoCanvas() {
  const canvas = document.getElementById('realtimeVideoCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Load High-Res Durga Festive Artwork
  const img = new Image();
  img.src = 'assets/durga-scene.jpg';

  let width = 0;
  let height = 0;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle & Spark Physics System
  const particles = [];
  const particleCount = Math.min(width > 768 ? 90 : 45, 120);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 1.8 + 0.6),
      speedX: (Math.random() - 0.5) * 1.2,
      opacity: Math.random() * 0.8 + 0.2,
      fadeSpeed: Math.random() * 0.015 + 0.005,
      hue: Math.random() > 0.4 ? 42 : 18, // Gold or fiery amber
      pulse: Math.random() * Math.PI
    });
  }

  // Volumetric Smoke Puffs System (Rising from Dhunuchi)
  const smokePuffs = [];
  const smokeCount = 28;
  for (let i = 0; i < smokeCount; i++) {
    smokePuffs.push({
      x: width * 0.76 + (Math.random() - 0.5) * 80,
      y: height * 0.6 + Math.random() * 200,
      radius: Math.random() * 45 + 25,
      maxRadius: Math.random() * 140 + 80,
      speedY: -(Math.random() * 1.4 + 0.8),
      speedX: (Math.random() - 0.3) * 0.9,
      alpha: Math.random() * 0.22 + 0.08,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015
    });
  }

  let startTime = performance.now();
  let imgLoaded = false;
  img.onload = () => { imgLoaded = true; };

  function renderVideoFrame(now) {
    const elapsed = (now - startTime) / 1000;

    // Clear black screen
    ctx.fillStyle = '#060302';
    ctx.fillRect(0, 0, width, height);

    /* ── A. Cinematic Camera Motion (Ken Burns: Smooth Pan & Zoom) ── */
    const zoomProgress = Math.min(elapsed / 10, 1);
    const scale = 1.05 + Math.sin(elapsed * 0.45) * 0.04 + (zoomProgress * 0.06);
    const panX = Math.sin(elapsed * 0.3) * 20;
    const panY = Math.cos(elapsed * 0.35) * 14;

    ctx.save();

    if (imgLoaded) {
      // Calculate aspect ratio cover
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let drawW, drawH;

      if (canvasAspect > imgAspect) {
        drawW = width;
        drawH = width / imgAspect;
      } else {
        drawH = height;
        drawW = height * imgAspect;
      }

      ctx.translate(width / 2 + panX, height / 2 + panY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      // Subtle dynamic camera heat-shimmer on altar
      const shimmer = Math.sin(elapsed * 4) * 0.03;
      ctx.fillStyle = `rgba(255, 120, 20, ${0.04 + shimmer})`;
      ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      // Fallback ambient golden gradient before image arrives
      const grad = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width/2);
      grad.addColorStop(0, '#5A1E0B');
      grad.addColorStop(0.6, '#1A0804');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();

    /* ── B. Real-time Volumetric Dhunuchi Smoke Physics ── */
    ctx.save();
    smokePuffs.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.radius += 0.35;
      p.rotation += p.rotSpeed;
      p.alpha -= 0.0006;

      if (p.y < -p.maxRadius || p.alpha <= 0) {
        // Reset puff at dancer's right hand position
        p.x = width * (width > 768 ? 0.74 : 0.78) + (Math.random() - 0.5) * 40;
        p.y = height * 0.65;
        p.radius = Math.random() * 30 + 20;
        p.alpha = Math.random() * 0.18 + 0.06;
      }

      const smokeGrad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
      smokeGrad.addColorStop(0, `rgba(240, 230, 215, ${p.alpha * 0.9})`);
      smokeGrad.addColorStop(0.5, `rgba(180, 160, 140, ${p.alpha * 0.5})`);
      smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = smokeGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    /* ── C. Divine Radiant God-Rays & Golden Halo ── */
    ctx.save();
    const haloX = width * 0.5 + panX * 0.5;
    const haloY = height * (width > 768 ? 0.38 : 0.32) + panY * 0.5;
    const haloRadius = Math.min(width, height) * 0.42;

    const divinePulse = 0.28 + Math.sin(elapsed * 2.2) * 0.08;
    const haloGrad = ctx.createRadialGradient(haloX, haloY, 20, haloX, haloY, haloRadius);
    haloGrad.addColorStop(0, `rgba(255, 230, 130, ${divinePulse * 1.5})`);
    haloGrad.addColorStop(0.35, `rgba(255, 150, 30, ${divinePulse})`);
    haloGrad.addColorStop(0.7, `rgba(180, 40, 10, ${divinePulse * 0.3})`);
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(haloX, haloY, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // 8 Rotating Divine Light Shafts (Surya Kiran)
    ctx.translate(haloX, haloY);
    ctx.rotate(elapsed * 0.12);
    for (let r = 0; r < 8; r++) {
      ctx.rotate(Math.PI / 4);
      const rayGrad = ctx.createLinearGradient(0, 0, haloRadius * 1.1, 0);
      rayGrad.addColorStop(0, 'rgba(255, 215, 0, 0.14)');
      rayGrad.addColorStop(0.6, 'rgba(255, 140, 0, 0.05)');
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(haloRadius * 1.2, -6);
      ctx.lineTo(haloRadius * 1.2, 6);
      ctx.lineTo(0, 18);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    /* ── D. Floating Gold Embers & Sparks Physics ── */
    ctx.save();
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.pulse += 0.05;

      if (p.y < -20) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
      ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${currentOpacity})`;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.8)`;
      ctx.shadowBlur = p.size * 3;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    /* ── E. Live Dhaak Rhythmic Flash Pulse ── */
    if (isDhakPlaying) {
      const beatPulse = (Math.sin(elapsed * 15) + 1) * 0.5;
      if (beatPulse > 0.8) {
        ctx.fillStyle = `rgba(255, 160, 40, ${(beatPulse - 0.8) * 0.25})`;
        ctx.fillRect(0, 0, width, height);
      }
    }

    videoCanvasAnimId = requestAnimationFrame(renderVideoFrame);
  }

  videoCanvasAnimId = requestAnimationFrame(renderVideoFrame);
}

/* ── Web Audio API: Authentic Bengali Dhaak Rhythm Synthesizer ──
   Dhaak beats pattern: Classic Sharodotsav "Dha - Kur - Kur - Dha"
   Produces wooden barrel resonance + skin membrane tap without external files. */
function playSingleDhaakHit(time, type = 'heavy') {
  if (!dhakAudioContext) return;

  const now = time || dhakAudioContext.currentTime;

  if (type === 'heavy') {
    // Deep barrel hit ("DHA")
    const osc = dhakAudioContext.createOscillator();
    const gain = dhakAudioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.exponentialRampToValueAtTime(58, now + 0.18);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(dhakAudioContext.destination);

    osc.start(now);
    osc.stop(now + 0.28);

    // Membrane snap / slap
    const snapOsc = dhakAudioContext.createOscillator();
    const snapGain = dhakAudioContext.createGain();
    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(420, now);
    snapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

    snapGain.gain.setValueAtTime(0.35, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    snapOsc.connect(snapGain);
    snapGain.connect(dhakAudioContext.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.06);
  } else {
    // Sharp stick tap on rim/edge ("KUR")
    const tapOsc = dhakAudioContext.createOscillator();
    const tapGain = dhakAudioContext.createGain();

    tapOsc.type = 'sine';
    tapOsc.frequency.setValueAtTime(320, now);
    tapOsc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

    tapGain.gain.setValueAtTime(0.4, now);
    tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    tapOsc.connect(tapGain);
    tapGain.connect(dhakAudioContext.destination);

    tapOsc.start(now);
    tapOsc.stop(now + 0.09);
  }
}

function startDhakRhythm() {
  if (!dhakAudioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      dhakAudioContext = new AudioCtx();
    }
  }

  if (dhakAudioContext && dhakAudioContext.state === 'suspended') {
    dhakAudioContext.resume();
  }

  isDhakPlaying = true;
  updateAudioBtnUI(true);

  // Bengali Dhaak pattern sequence:
  // Step 0: DHA! (heavy)
  // Step 1: kur (tap)
  // Step 2: kur (tap)
  // Step 3: DHA! (heavy)
  // Step 4: DHA! (heavy)
  // Step 5: kur (tap)
  let step = 0;
  const tempoInterval = 210; // ms per strike

  if (dhakInterval) clearInterval(dhakInterval);

  dhakInterval = setInterval(() => {
    if (!dhakAudioContext) return;
    const now = dhakAudioContext.currentTime;

    if (step === 0 || step === 3 || step === 4) {
      playSingleDhaakHit(now, 'heavy');
    } else {
      playSingleDhaakHit(now, 'tap');
    }

    step = (step + 1) % 6;
  }, tempoInterval);
}

function stopDhakAudio() {
  if (dhakInterval) {
    clearInterval(dhakInterval);
    dhakInterval = null;
  }
  isDhakPlaying = false;
  updateAudioBtnUI(false);
}

function toggleDhakAudio() {
  if (isDhakPlaying) {
    stopDhakAudio();
  } else {
    startDhakRhythm();
  }
}

function updateAudioBtnUI(playing) {
  const btn = document.getElementById('introAudioBtn');
  const icon = document.getElementById('audioBtnIcon');
  const text = document.getElementById('audioBtnText');
  if (btn) btn.classList.toggle('playing', playing);
  if (icon) icon.textContent = playing ? '🔊' : '🔈';
  if (text) text.textContent = playing ? 'Mute Dhaak' : 'Play Dhaak Beats';
}

/* ── 2. Sticky Nav & Mobile Menu ── */
function initNav() {
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  if (nav) {
    const checkScroll = () => {
      nav.classList.toggle('elevated', window.scrollY > 20);
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Close when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
      });
    });
  }

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY;

    sections.forEach(section => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }, { passive: true });
}

/* ── 3. Scroll Reveal Animations ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(el => observer.observe(el));
}

/* ── 4. Tab Switching & Carousels ── */
function switchTab(type) {
  const panelC = document.getElementById('panel-c');
  const panelS = document.getElementById('panel-s');
  const tabC = document.getElementById('tab-c');
  const tabS = document.getElementById('tab-s');

  const isC = type === 'c';

  if (panelC && panelS) {
    panelC.classList.toggle('show', isC);
    panelS.classList.toggle('show', !isC);
  }

  if (tabC && tabS) {
    tabC.className = `etab${isC ? ' active-c' : ''}`;
    tabS.className = `etab${!isC ? ' active-s' : ''}`;
  }

  // Recalculate slides and ensure visible elements animate
  setTimeout(() => {
    const activeCarouselId = isC ? 'cc' : 'sc';
    initCarousel(activeCarouselId, !isC);
  }, 40);
}

const carousels = {};

function getVisibleSlides() {
  if (window.innerWidth <= 820) return 1;
  if (window.innerWidth <= 1080) return 2;
  return 3;
}

function initCarousels() {
  initCarousel('cc', false);
  initCarousel('sc', true);

  window.addEventListener('resize', () => {
    ['cc', 'sc'].forEach(id => {
      const isGold = id === 'sc';
      initCarousel(id, isGold);
    });
  });
}

function initCarousel(id, isGold) {
  const track = document.getElementById(id);
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
  const visible = getVisibleSlides();
  const maxIndex = Math.max(0, total - visible);

  carousels[id] = { index: 0, total, visible, maxIndex };
  buildDots(`${id}-dots`, maxIndex + 1, isGold, id);
  goToSlide(id, 0, isGold);
}

function buildDots(dotsId, count, isGold, trackId) {
  const dotsEl = document.getElementById(dotsId);
  if (!dotsEl) return;
  dotsEl.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = `c-dot${i === 0 ? (isGold ? ' active active-gold' : ' active') : ''}`;
    dot.addEventListener('click', () => goToSlide(trackId, i, isGold));
    dotsEl.appendChild(dot);
  }
}

function updateDots(dotsId, activeIndex, isGold) {
  const dots = document.querySelectorAll(`#${dotsId} .c-dot`);
  dots.forEach((dot, idx) => {
    dot.className = `c-dot${idx === activeIndex ? (isGold ? ' active active-gold' : ' active') : ''}`;
  });
}

function goToSlide(id, index, isGold) {
  const c = carousels[id];
  if (!c) return;

  c.index = Math.max(0, Math.min(index, c.maxIndex));
  const track = document.getElementById(id);
  const slide = track.querySelector('.carousel-slide');
  if (!slide) return;

  const slideWidth = slide.offsetWidth + 24; // width + gap
  track.style.transform = `translateX(-${c.index * slideWidth}px)`;
  updateDots(`${id}-dots`, c.index, isGold);
}

function moveCarousel(id, dir) {
  const c = carousels[id];
  if (!c) return;
  const isGold = id === 'sc';
  const newIndex = c.index + dir;
  if (newIndex >= 0 && newIndex <= c.maxIndex) {
    goToSlide(id, newIndex, isGold);
  } else if (newIndex < 0) {
    goToSlide(id, c.maxIndex, isGold); // Wrap to end
  } else {
    goToSlide(id, 0, isGold); // Wrap to start
  }
}

/* ── 5. Event Data & Modals ── */
const eventDatabase = {
  durga: {
    badge: 'SHARODOTSAV 2026',
    title: 'Ranaghat Kamalpur Durgotsav 2026',
    html: `
      <p><strong>Dates:</strong> Maha Shasthi to Vijaya Dashami (October 16–20, 2026)</p>
      <p><strong>Venue:</strong> Kamalpur Sangha Prangon, Ranaghat, Nadia</p>
      <div style="background:var(--eg-lighter); padding:16px; border-radius:12px; margin:16px 0; border:1px solid var(--border);">
        <h4 style="color:var(--eg); margin-bottom:8px; font-family:var(--serif); font-size:18px;">Key Highlights:</h4>
        <ul style="padding-left:20px; line-height:1.7;">
          <li>Presentation of the historic <strong>117 Divine Forms of Durga</strong> exhibition.</li>
          <li>Architectural Pandal designed by legendary artisans of Bengal.</li>
          <li>World-renowned Chandannagar illuminated gates stretching across 1.5 km of approach roads.</li>
          <li>Daily Sandhya Aarti with 108 pradips and devotional Dhak competitions.</li>
          <li>Maha Bhog distribution for over 25,000 pilgrims on Ashtami and Nabami.</li>
        </ul>
      </div>
      <p style="font-size:13px; color:var(--text-3);">Devotees wishing to offer pushpanjali or chanda are requested to collect tokens from the Sangha camp desk.</p>
    `
  },
  bijoya: {
    badge: 'FRATERNAL GATHERING',
    title: 'Grand Bijoya Sammilanee 2026',
    html: `
      <p><strong>Date:</strong> October 25, 2026 | 5:30 PM onwards</p>
      <p><strong>Location:</strong> Sangha Auditorium & Grounds, Kamalpur</p>
      <p>The annual post-Puja reunion brings together all residents, youth, elders, and neighboring clubs of Ranaghat. Features traditional sweets distribution (Sandesh, Nimki, Ghugni), honoring senior club patrons, musical recitals, and felicitation of local academic achievers.</p>
    `
  },
  laxmi: {
    badge: 'TRADITIONAL WORSHIP',
    title: 'Kojagori Lakshmi & Kali Puja',
    html: `
      <p><strong>Dates:</strong> Lakshmi Puja (Nov 1) & Shyama Puja (Nov 10)</p>
      <p>A sacred community observation with midnight aarti, traditional alpana art created by local women, and distribution of special prasad.</p>
    `
  },
  saraswati: {
    badge: 'YOUTH & KNOWLEDGE',
    title: 'Saraswati Puja & Art Fair 2027',
    html: `
      <p><strong>Date:</strong> Basant Panchami (Jan 24, 2027)</p>
      <p>Organized entirely by our Youth Wing. Features hate-khori rituals for toddlers, district-level sit-and-draw art contests for school students, book distribution, and acoustic cultural performances.</p>
    `
  },
  rabindra: {
    badge: 'CULTURAL HERITAGE',
    title: 'Pochishe Boishakh — Rabindra Jayanti',
    html: `
      <p><strong>Date:</strong> May 09, 2027 | 6:00 PM</p>
      <p>A reverent evening celebrating Rabindranath Tagore and Kazi Nazrul Islam with choir music, recitations, sitar melodies, and a short folk drama performed by Kamalpur theater artists.</p>
    `
  },
  blood: {
    badge: 'HEALTHCARE SEVA',
    title: 'Annual Mega Blood Donation Drive',
    html: `
      <p><strong>Organized with:</strong> Nadia District Red Cross & Ranaghat Sub-Divisional Hospital Blood Bank</p>
      <p>Our flagship social initiative running for over 38 consecutive years. Over 300 units of blood are donated annually. Free hemoglobin and blood-group testing provided to all participants.</p>
      <div style="margin-top:14px; padding:12px; background:var(--gold-pale); border-radius:8px;">
        <strong>Want to volunteer or donate?</strong> Contact our Health Cell at +91 98300 12345.
      </div>
    `
  },
  football: {
    badge: 'ATHLETICS & SPORTS',
    title: 'Kamalpur Gold Cup Football Tournament',
    html: `
      <p><strong>Location:</strong> Kamalpur Sangha Athletic Stadium</p>
      <p>16 renowned football clubs from Nadia, North 24 Parganas, and Kolkata compete for the prestigious Kamalpur Gold Cup. Matches are played under floodlights with commentary, medical support, and huge spectator attendance.</p>
    `
  },
  health: {
    badge: 'COMMUNITY HEALTH',
    title: 'Free Eye & Diagnostic Clinic',
    html: `
      <p>Held quarterly in collaboration with leading hospitals. Provides free eye checkups, cataract screening, spectacles distribution, and general physician consultations for underprivileged and elderly residents.</p>
    `
  },
  relief: {
    badge: 'SOCIAL WELFARE',
    title: 'Winter Warmth & Relief Drive',
    html: `
      <p>Every December, our volunteers distribute over 1,500 thick wool blankets and warm clothing kits to low-income families, railway station dwellers, and senior citizens across Ranaghat.</p>
    `
  },
  sports_meet: {
    badge: 'ANNUAL MEET',
    title: 'Annual Sports Day & Mini Marathon',
    html: `
      <p>Full day of sports featuring track events, lemon-and-spoon race for children, musical chairs, veteran's walk, and the 5-kilometer Ranaghat Friendship Mini Marathon.</p>
    `
  }
};

function openEventModal(eventKey) {
  const data = eventDatabase[eventKey];
  if (!data) return;

  const modal = document.getElementById('eventModal');
  const badge = document.getElementById('eventModalBadge');
  const title = document.getElementById('eventModalTitle');
  const body = document.getElementById('eventModalBody');

  if (badge) badge.textContent = data.badge;
  if (title) title.textContent = data.title;
  if (body) body.innerHTML = data.html;

  if (modal) modal.classList.add('open');
}

function openArtistModal() {
  const modal = document.getElementById('eventModal');
  const badge = document.getElementById('eventModalBadge');
  const title = document.getElementById('eventModalTitle');
  const body = document.getElementById('eventModalBody');

  if (badge) badge.textContent = 'CULTURAL SCHEDULE · SHARODOTSAV 2026';
  if (title) title.textContent = 'Cultural Artists & Performing Acts';
  if (body) {
    body.innerHTML = `
      <div style="line-height:1.7;">
        <p><strong>Maha Shasthi (Oct 16):</strong> Inauguration ceremony followed by Dhaak Ensemble & Inaugural Baul Sandhya.</p>
        <p style="margin-top:10px;"><strong>Maha Saptami (Oct 17):</strong> Classical Bengali Modern Songs by prominent artists from Kolkata.</p>
        <p style="margin-top:10px;"><strong>Maha Ashtami (Oct 18):</strong> Dhunuchi Naach competition & Mega Folk Band live performance.</p>
        <p style="margin-top:10px;"><strong>Maha Nabami (Oct 19):</strong> Theatrical Drama (Natok) staged by Kamalpur Natyadal followed by Bollywood-Bengali fusion night.</p>
        <p style="margin-top:10px;"><strong>Vijaya Dashami (Oct 20):</strong> Sindoor Khela, Shobhayatra, and traditional Immersion procession along the Churni river.</p>
      </div>
    `;
  }
  if (modal) modal.classList.add('open');
}

function openLightbox(title, caption, icon) {
  const modal = document.getElementById('lightboxModal');
  const lbTitle = document.getElementById('lbTitle');
  const lbCaption = document.getElementById('lbCaption');
  const lbIcon = document.getElementById('lbIcon');

  if (lbTitle) lbTitle.textContent = title;
  if (lbCaption) lbCaption.textContent = caption;
  if (lbIcon) lbIcon.textContent = icon;

  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

// Global escape key listener for modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ['eventModal', 'donationModal', 'lightboxModal'].forEach(closeModal);
    dismissIntro();
  }
});

/* ── 6. Donation Presets & Form Handling ── */
let currentDonationAmount = 501;

function initDonationPresets() {
  const input = document.getElementById('customAmount');
  if (input) {
    input.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        currentDonationAmount = val;
        // remove active from preset buttons if doesn't match
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
      }
    });
  }
}

function selectDonation(amount, btnElement) {
  currentDonationAmount = amount;
  const input = document.getElementById('customAmount');
  if (input) input.value = amount;

  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
}

function openDonationModal() {
  const modal = document.getElementById('donationModal');
  const amountEl = document.getElementById('modalDonationAmount');
  if (amountEl) {
    amountEl.textContent = `₹${currentDonationAmount.toLocaleString('en-IN')}`;
  }

  // Reset success view if open
  const form = document.getElementById('donation-form');
  const successView = document.getElementById('donationSuccessView');
  if (form) form.style.display = 'block';
  if (successView) successView.style.display = 'none';

  if (modal) modal.classList.add('open');
}

function handleDonationSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('donation-form');
  const successView = document.getElementById('donationSuccessView');
  const receiptNo = document.getElementById('receiptNo');

  const randomNo = Math.floor(1000 + Math.random() * 9000);
  if (receiptNo) receiptNo.textContent = `#KAS-2026-${randomNo}`;

  if (form) form.style.display = 'none';
  if (successView) successView.style.display = 'block';
}

/* ── 7. Membership Application Submit ── */
function handleMembershipSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('membership-form');
  const successBox = document.getElementById('join-success');

  if (form && successBox) {
    form.style.display = 'none';
    successBox.style.display = 'block';
  }
}

function resetMembershipForm() {
  const form = document.getElementById('membership-form');
  const successBox = document.getElementById('join-success');

  if (form && successBox) {
    form.reset();
    form.style.display = 'block';
    successBox.style.display = 'none';
  }
}

