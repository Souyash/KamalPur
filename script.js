/* ══════════════════════════════════════════════════════════════
   KAMALPUR ABHIJAAN SANGHA — JAVASCRIPT
   Interactivity & Smooth Experience inspired by kallol.com
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initCarousels();
  initDonationPresets();
  initAdminSeedData();
});

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
    title: 'Ranaghat Durgotsav 2026 (Conducted by Kamalpur Abhijan Sangha)',
    html: `
      <p><strong>Conducted by:</strong> Kamalpur Abhijan Sangha (কামালপুর অভিযান সংঘ)</p>
      <p><strong>Dates:</strong> Maha Shasthi to Vijaya Dashami (October 16–20, 2026)</p>
      <p><strong>Venue:</strong> Kamalpur Sangha Prangon (Near Primary Health Centre), Ranaghat, Nadia</p>
      <div style="background:var(--eg-lighter); padding:16px; border-radius:12px; margin:16px 0; border:1px solid var(--border);">
        <h4 style="color:var(--eg); margin-bottom:8px; font-family:var(--serif); font-size:18px;">Key Highlights:</h4>
        <ul style="padding-left:20px; line-height:1.7;">
          <li>Historic presentation of <strong>117 Divine Forms of Durga housed within 80 Temple Pavilions</strong>.</li>
          <li>Crafted by master sculptors from Krishnanagar and Kumartuli.</li>
          <li>World-renowned Chandannagar illuminated gates stretching across 1.5 km of approach roads.</li>
          <li>Daily Sandhya Aarti with 108 pradips, dhunuchi naach, and devotional Dhak performances.</li>
          <li>Maha Bhog distribution for over 25,000 pilgrims on Ashtami and Nabami afternoons.</li>
        </ul>
      </div>
      <p style="font-size:13px; color:var(--text-3);">Devotees wishing to offer pushpanjali or chanda are requested to collect tokens from the Sangha camp desk or online.</p>
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
        <strong>Want to volunteer or donate?</strong> Contact our Health Cell at +91 8637578740.
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

function filterHomeGallery(category, btnElement) {
  const container = document.getElementById('homeGalleryGrid');
  if (!container) return;

  const items = container.querySelectorAll('.gallery-item');
  const buttons = document.querySelectorAll('.gallery-filter-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  items.forEach(item => {
    const itemCat = item.getAttribute('data-cat');
    if (category === 'all' || itemCat === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function openLightbox(titleOrEl, caption, icon) {
  const modal = document.getElementById('lightboxModal');
  const lbTitle = document.getElementById('lbTitle');
  const lbCaption = document.getElementById('lbCaption');
  const lbIcon = document.getElementById('lbIcon');
  const lbImgBox = document.getElementById('lbImgBox');
  const lbImg = document.getElementById('lbImg');

  if (titleOrEl && titleOrEl.nodeType === 1) {
    const el = titleOrEl;
    const t = el.getAttribute('data-title') || el.querySelector('.gi-caption strong')?.textContent || '';
    const d = el.getAttribute('data-desc') || el.querySelector('.gi-caption span')?.textContent || '';
    const imgSrc = el.getAttribute('data-img') || el.querySelector('img')?.getAttribute('src');
    const iconEl = el.querySelector('.gi-icon');

    if (lbTitle) lbTitle.textContent = t;
    if (lbCaption) lbCaption.textContent = d;

    if (imgSrc && lbImgBox && lbImg) {
      lbImg.src = imgSrc;
      lbImgBox.style.display = 'block';
      if (lbIcon) lbIcon.style.display = 'none';
    } else {
      if (lbImgBox) lbImgBox.style.display = 'none';
      if (lbIcon) {
        lbIcon.style.display = 'inline-flex';
        if (iconEl) lbIcon.innerHTML = iconEl.innerHTML;
      }
    }
  } else {
    if (lbImgBox) lbImgBox.style.display = 'none';
    if (lbIcon) lbIcon.style.display = 'inline-flex';
    if (lbTitle) lbTitle.textContent = titleOrEl || '';
    if (lbCaption) lbCaption.textContent = caption || '';
    if (lbIcon && icon) {
      if (typeof icon === 'string' && icon.trim().startsWith('<')) {
        lbIcon.innerHTML = icon;
      } else {
        lbIcon.textContent = icon;
      }
    }
  }

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

/* ── 6. Donation Presets & Multi-Step Form Handling ── */
let currentDonationAmount = 501;
let currentDonorDetails = {
  name: '',
  phone: '',
  email: '',
  address: '',
  purpose: 'Sharodotsav Durga Puja Chanda',
  pan: '',
  amount: 501,
  utr: '',
  trackingNo: ''
};

function initDonationPresets() {
  const input = document.getElementById('customAmount');
  if (input) {
    input.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        currentDonationAmount = val;
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

function openDonationModal(amount) {
  if (amount && typeof amount === 'number') {
    currentDonationAmount = amount;
  } else {
    const input = document.getElementById('customAmount');
    if (input && input.value) {
      currentDonationAmount = parseInt(input.value, 10) || 501;
    }
  }

  const modal = document.getElementById('donationModal');
  const amountEl = document.getElementById('modalDonationAmount');
  if (amountEl) {
    amountEl.textContent = `₹${currentDonationAmount.toLocaleString('en-IN')}`;
  }

  const nameInput = document.getElementById('donorName');
  if (nameInput) {
    nameInput.value = '';
  }

  if (modal) {
    modal.classList.add('open');
    const card = modal.querySelector('.modal-card');
    if (card) card.scrollTop = 0;
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 150);
  }
}

function handleDonationWhatsAppSubmit(event) {
  if (event) event.preventDefault();

  const nameInput = document.getElementById('donorName');
  const donorName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Devotee';
  const amount = (typeof currentDonationAmount !== 'undefined' && currentDonationAmount) ? currentDonationAmount : 501;
  const SANGHA_PHONE = '8637578740';

  // Save to persistent storage for Sangha Admin Panel ledger
  try {
    const record = {
      id: '#KAS-2026-' + Math.floor(1000 + Math.random() * 9000),
      name: donorName,
      phone: '+91 8637578740',
      email: '',
      amount: amount,
      address: 'Ranaghat',
      purpose: 'Sharodotsav Durga Puja Chanda',
      pan: '',
      utr: 'WhatsApp Redirection',
      date: new Date().toISOString(),
      status: 'pending'
    };
    const stored = JSON.parse(localStorage.getItem('kas_donations') || '[]');
    stored.unshift(record);
    localStorage.setItem('kas_donations', JSON.stringify(stored));
  } catch (e) {
    console.error('Storage error:', e);
  }

  // Close the modal
  closeModal('donationModal');

  // Pre-filled WhatsApp message
  const text = `Hello Kamalpur Abhijan Sangha, my name is ${donorName}. I would like to contribute Rs.${amount} for Durgotsav Seva.`;
  const waUrl = `https://wa.me/91${SANGHA_PHONE}?text=${encodeURIComponent(text)}`;

  // Redirect to WhatsApp
  const opened = window.open(waUrl, '_blank');
  if (!opened || opened.closed || typeof opened.closed === 'undefined') {
    window.location.href = waUrl;
  }
}

// Backward compatibility aliases & safe helpers
const handleBillingSubmit = handleDonationWhatsAppSubmit;

function goToDonationStep(stepNumber) {
  // Maintained for backward compatibility
}

function handleUpiPayClick(event, appName = 'whatsapp') {
  if (event) event.preventDefault();
  handleDonationWhatsAppSubmit();
}

function handlePaymentCompleted() {
  handleDonationWhatsAppSubmit();
}

function copyUpiId(upiId, btnElement) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(upiId).then(() => {
      showCopiedFeedback(btnElement);
    }).catch(() => {
      fallbackCopyText(upiId, btnElement);
    });
  } else {
    fallbackCopyText(upiId, btnElement);
  }
}

function fallbackCopyText(text, btnElement) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showCopiedFeedback(btnElement);
  } catch (err) {
    console.error('Failed to copy UPI ID:', err);
  }
  document.body.removeChild(ta);
}

function showCopiedFeedback(btnElement) {
  if (!btnElement) return;
  const origText = btnElement.textContent;
  btnElement.textContent = '✓ Copied!';
  btnElement.style.background = '#128C7E';
  btnElement.style.color = '#FFFFFF';
  btnElement.style.borderColor = '#128C7E';
  setTimeout(() => {
    btnElement.textContent = origText;
    btnElement.style.background = '';
    btnElement.style.color = '';
    btnElement.style.borderColor = '';
  }, 2200);
}

/* ── 7. Membership Application Submit ── */
function handleMembershipSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('membership-form');
  const successBox = document.getElementById('join-success');

  if (form) {
    const nameEl = form.querySelector('[name="name"]') || form.querySelector('#mName');
    const phoneEl = form.querySelector('[name="phone"]') || form.querySelector('#mPhone');
    const cityEl = form.querySelector('[name="city"]') || form.querySelector('#mCity');
    const interestEl = form.querySelector('[name="interest"]') || form.querySelector('#mInterest');
    const msgEl = form.querySelector('[name="message"]') || form.querySelector('#mMessage');

    const memberRecord = {
      id: '#MEM-2026-' + Math.floor(1000 + Math.random() * 9000),
      name: nameEl ? nameEl.value.trim() : 'Devotee Applicant',
      phone: phoneEl ? phoneEl.value.trim() : '',
      city: cityEl ? cityEl.value.trim() : 'Ranaghat',
      interest: interestEl ? (interestEl.options[interestEl.selectedIndex] ? interestEl.options[interestEl.selectedIndex].text : interestEl.value) : 'Puja & Cultural Wing',
      message: msgEl ? msgEl.value.trim() : '',
      date: new Date().toISOString(),
      status: 'pending'
    };

    try {
      const stored = JSON.parse(localStorage.getItem('kas_members') || '[]');
      stored.unshift(memberRecord);
      localStorage.setItem('kas_members', JSON.stringify(stored));
    } catch (e) {
      console.error('Member storage error:', e);
    }

    form.style.display = 'none';
    if (successBox) successBox.style.display = 'block';
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

/* ── 8. Seed Initial Ledger Data if Storage Empty ── */
function initAdminSeedData() {
  try {
    if (!localStorage.getItem('kas_donations') || JSON.parse(localStorage.getItem('kas_donations') || '[]').length === 0) {
      const sampleDonations = [
        {
          id: '#KAS-2026-9241',
          name: 'Anirban Bhattacharya',
          phone: '9830145678',
          email: 'anirban.b@gmail.com',
          amount: 2501,
          address: 'Mission Para, Ranaghat, PIN 741201',
          purpose: 'Sharodotsav Durga Puja Chanda',
          pan: 'ABCDB4321K',
          utr: '429188231904',
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'pending'
        },
        {
          id: '#KAS-2026-8819',
          name: 'Priyanka Sen',
          phone: '9874561230',
          email: 'priyanka.sen@outlook.com',
          amount: 5001,
          address: 'College Road, Ranaghat, PIN 741201',
          purpose: 'Maha Bhog & Prasad Annadan',
          pan: '',
          utr: '429177112049',
          date: new Date(Date.now() - 3600000 * 5).toISOString(),
          status: 'verified'
        },
        {
          id: '#KAS-2026-7492',
          name: 'Sourav Ganguly',
          phone: '9433120987',
          email: 'sourav.g@yahoo.com',
          amount: 11000,
          address: 'Biswas Para, Ranaghat, PIN 741201',
          purpose: 'Youth Sports & Football Academy',
          pan: 'AABCS9876P',
          utr: '429155098231',
          date: new Date(Date.now() - 3600000 * 12).toISOString(),
          status: 'verified'
        },
        {
          id: '#KAS-2026-6120',
          name: 'Dr. Debabrata Roy',
          phone: '9836701234',
          email: 'droy.ranaghat@gmail.com',
          amount: 501,
          address: 'Hospital More, Ranaghat, PIN 741201',
          purpose: 'Free Health & Blood Donation Seva',
          pan: '',
          utr: '429144332190',
          date: new Date(Date.now() - 3600000 * 20).toISOString(),
          status: 'pending'
        },
        {
          id: '#KAS-2026-5891',
          name: 'Kakoli Mukherjee',
          phone: '9732114455',
          email: '',
          amount: 1001,
          address: 'Kamalpur Station Road, Ranaghat',
          purpose: 'Sharodotsav Durga Puja Chanda',
          pan: '',
          utr: '429133981120',
          date: new Date(Date.now() - 3600000 * 30).toISOString(),
          status: 'verified'
        }
      ];
      localStorage.setItem('kas_donations', JSON.stringify(sampleDonations));
    }

    if (!localStorage.getItem('kas_members') || JSON.parse(localStorage.getItem('kas_members') || '[]').length === 0) {
      const sampleMembers = [
        {
          id: '#MEM-2026-1029',
          name: 'Arindam Ghosh',
          phone: '9830567890',
          city: 'Ranaghat',
          interest: 'Puja & Cultural Wing',
          message: 'Interested in stage decor and photography coordination during Navami & Dashami.',
          date: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: 'reviewed'
        },
        {
          id: '#MEM-2026-2041',
          name: 'Tanushree Das',
          phone: '9874112233',
          city: 'Ranaghat',
          interest: 'Community Seva & Health',
          message: 'Nurse by profession. Want to volunteer at the free health camp and blood donation drive.',
          date: new Date(Date.now() - 3600000 * 48).toISOString(),
          status: 'pending'
        }
      ];
      localStorage.setItem('kas_members', JSON.stringify(sampleMembers));
    }
  } catch (e) {
    console.error('Seed data error:', e);
  }
}

