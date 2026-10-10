/* ══════════════════════════════════════════════════════════════
   KAMALPUR ABHIJAAN SANGHA — JAVASCRIPT
   Interactivity & Smooth Experience inspired by kallol.com
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initCarousels();
  initDonationPresets();
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

function openLightbox(titleOrEl, caption, icon) {
  const modal = document.getElementById('lightboxModal');
  const lbTitle = document.getElementById('lbTitle');
  const lbCaption = document.getElementById('lbCaption');
  const lbIcon = document.getElementById('lbIcon');

  if (titleOrEl && titleOrEl.nodeType === 1) {
    const el = titleOrEl;
    const t = el.getAttribute('data-title') || el.querySelector('.gi-caption strong')?.textContent || '';
    const d = el.getAttribute('data-desc') || el.querySelector('.gi-caption span')?.textContent || '';
    const iconEl = el.querySelector('.gi-icon');
    if (lbTitle) lbTitle.textContent = t;
    if (lbCaption) lbCaption.textContent = d;
    if (lbIcon && iconEl) lbIcon.innerHTML = iconEl.innerHTML;
  } else {
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

function openDonationModal() {
  const modal = document.getElementById('donationModal');
  const amountEl = document.getElementById('modalDonationAmount');
  if (amountEl) {
    amountEl.textContent = `₹${currentDonationAmount.toLocaleString('en-IN')}`;
  }

  // Always reset to Step 1 (Billing details) when opened
  goToDonationStep(1);

  if (modal) {
    modal.classList.add('open');
    const card = modal.querySelector('.modal-card');
    if (card) card.scrollTop = 0;
  }
}

function goToDonationStep(stepNumber) {
  const step1 = document.getElementById('donationStepBilling');
  const step2 = document.getElementById('donationStepQR');
  const step3 = document.getElementById('donationStepSuccess');

  if (step1) step1.style.display = (stepNumber === 1) ? 'block' : 'none';
  if (step2) step2.style.display = (stepNumber === 2) ? 'block' : 'none';
  if (step3) step3.style.display = (stepNumber === 3) ? 'block' : 'none';

  const modal = document.getElementById('donationModal');
  if (modal) {
    const card = modal.querySelector('.modal-card');
    if (card) card.scrollTop = 0;
  }
}

function handleBillingSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('donorName');
  const phoneInput = document.getElementById('donorPhone');
  const emailInput = document.getElementById('donorEmail');
  const addressInput = document.getElementById('donorAddress');
  const purposeInput = document.getElementById('donorPurpose');
  const panInput = document.getElementById('donorPan');

  currentDonorDetails = {
    name: nameInput ? nameInput.value.trim() : 'Devotee',
    phone: phoneInput ? phoneInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    address: addressInput ? addressInput.value.trim() : '',
    purpose: purposeInput ? purposeInput.value : 'Sharodotsav Durga Puja Chanda',
    pan: panInput ? panInput.value.trim().toUpperCase() : '',
    amount: currentDonationAmount,
    utr: '',
    trackingNo: ''
  };

  // Update Step 2: Flashed QR code details
  const qrDisplayAmount = document.getElementById('qrDisplayAmount');
  if (qrDisplayAmount) {
    qrDisplayAmount.textContent = `₹${currentDonationAmount.toLocaleString('en-IN')}`;
  }

  // Update deep-link UPI pay button for mobile devices
  const directUpiLink = document.getElementById('directUpiLink');
  if (directUpiLink) {
    const upiUri = `upi://pay?pa=kamalpurabhijansangha@sbi&pn=Kamalpur%20Abhijan%20Sangha&am=${currentDonationAmount}&cu=INR&tn=KAS%20Durgotsav%20Seva`;
    directUpiLink.href = upiUri;
  }

  // Clear optional UTR field in Step 2
  const utrInput = document.getElementById('donorUtr');
  if (utrInput) utrInput.value = '';

  // Advance to Step 2
  goToDonationStep(2);
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

function handlePaymentCompleted() {
  const utrInput = document.getElementById('donorUtr');
  const utrVal = utrInput ? utrInput.value.trim() : '';

  const randomTracking = Math.floor(1000 + Math.random() * 9000);
  currentDonorDetails.trackingNo = `#KAS-2026-${randomTracking}`;
  currentDonorDetails.utr = utrVal;

  // Populate Step 3 review popup values
  const trackingEl = document.getElementById('receiptTrackingNo');
  if (trackingEl) trackingEl.textContent = currentDonorDetails.trackingNo;

  const donorNameEl = document.getElementById('receiptDonorName');
  if (donorNameEl) donorNameEl.textContent = currentDonorDetails.name || 'Devotee';

  const amountEl = document.getElementById('receiptAmount');
  if (amountEl) amountEl.textContent = `₹${currentDonationAmount.toLocaleString('en-IN')}`;

  const phoneEl = document.getElementById('receiptPhoneTxt');
  if (phoneEl) {
    phoneEl.textContent = currentDonorDetails.phone ? `+91 ${currentDonorDetails.phone}` : 'Provided Number';
  }

  const addressEl = document.getElementById('receiptAddress');
  if (addressEl) addressEl.textContent = currentDonorDetails.address || 'Ranaghat';

  const catEl = document.getElementById('receiptCategory');
  if (catEl) catEl.textContent = currentDonorDetails.purpose || 'Sharodotsav Durga Puja Chanda';

  const utrRow = document.getElementById('receiptUtrRow');
  const utrEl = document.getElementById('receiptUtr');
  if (utrRow && utrEl) {
    if (utrVal) {
      utrRow.style.display = 'flex';
      utrEl.textContent = utrVal;
    } else {
      utrRow.style.display = 'none';
    }
  }

  // Move to Step 3 (Review & WhatsApp confirmation popup)
  goToDonationStep(3);
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

