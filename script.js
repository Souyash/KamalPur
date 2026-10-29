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
  initPublicGallery();
  initPublicArtists();
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
  inauguration: {
    badge: 'GRAND INAUGURATION & SEVA · OCT 13, 2026',
    title: 'Grand Inauguration Ceremony of Saree Bitoron & Durga Puja 2026',
    html: `
      <p><strong>Date &amp; Time:</strong> October 13, 2026 | 5:00 PM</p>
      <p><strong>Venue:</strong> Kamalpur Sangha Prangon (Near Primary Health Centre), Ranaghat, Nadia</p>
      
      <div style="background:#FFF8E7; padding:16px; border-radius:12px; margin:14px 0; border:1px solid #FFE082;">
        <h4 style="color:#B45309; margin:0 0 8px; font-family:var(--serif); font-size:17px;">Distinguished Chief Guests &amp; Dignitaries:</h4>
        <ul style="padding-left:20px; line-height:1.7; margin:0;">
          <li><strong>Shri Ashok Kirtania:</strong> Hon'ble Minister of Food and Supplies, Govt. of West Bengal &amp; Renowned Philanthropist <em>(Chief Guest &amp; Coordinator)</em></li>
          <li><strong>Shri Ashim Biswas:</strong> Hon'ble MLA, Ranaghat Uttar Purba Constituency &amp; President, Kamalpur Abhijan Sangha</li>
        </ul>
      </div>

      <div style="background:var(--eg-lighter); padding:16px; border-radius:12px; margin:14px 0; border:1px solid var(--border);">
        <h4 style="color:var(--eg); margin:0 0 8px; font-family:var(--serif); font-size:17px;">Major Event Highlights &amp; Announcements:</h4>
        <ul style="padding-left:20px; line-height:1.7; margin:0;">
          <li>🌟 <strong>4,000 Saree Bitoron (বস্ত্র বিতরণ):</strong> Monumental free saree distribution ceremony empowering 4,000 underprivileged mothers and sisters across Nadia.</li>
          <li>🛕 <strong>Inauguration of Kamalpur Durga Puja:</strong> Auspicious formal opening and lamp-lighting for Ranaghat's premier 117-Durga festival.</li>
          <li>📜 <strong>Special Grants Announcement:</strong> Announcements of Special Grants &amp; governmental development allocations for Kamalpur Abhijan Sangha.</li>
        </ul>
      </div>

      <p style="font-size:13px; color:var(--text-3); margin-top:12px;">Devotees, pilgrims, and respected residents across Bengal are warmly welcomed to attend this grand inaugurative gathering.</p>
    `
  },
  durga: {
    badge: 'SHARODOTSAV 2026',
    title: 'Ranaghat Durgotsav 2026 (Conducted by Kamalpur Abhijan Sangha)',
    html: `
      <p><strong>Conducted by:</strong> Kamalpur Abhijan Sangha (কামালপুর অভিযান সংঘ)</p>
      <p><strong>Event Direction &amp; Management:</strong> Subha Kumar Mandal (SUBHA-ARTHA)</p>
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
    badge: 'TRADITIONAL WORSHIP · 2026',
    title: 'Banner Lakshmi Puja (Kojagori Purnima)',
    html: `
      <p><strong>Date:</strong> October 25, 2026 (Kojagori Purnima) | Auspicious Evening Puja</p>
      <p><strong>Venue:</strong> Kamalpur Sangha Mandir &amp; Prangon, Ranaghat</p>
      <div style="background:var(--eg-lighter); padding:16px; border-radius:12px; margin:14px 0; border:1px solid var(--border);">
        <h4 style="color:var(--eg); margin:0 0 8px; font-family:var(--serif); font-size:17px;">Rituals &amp; Highlights:</h4>
        <ul style="padding-left:20px; line-height:1.7; margin:0;">
          <li><strong>Banner Lakshmi Puja:</strong> Auspicious sacred worship of Maa Lakshmi under the festival banner on Kojagori Purnima night.</li>
          <li>Traditional intricate alpana art drawn by neighborhood women across the temple steps.</li>
          <li>Midnight Maha Aarti, conch-shell dhwani, sacred shital prasad, and khichuri bhog distribution for hundreds of devotees.</li>
          <li>Followed by Shyama Puja (Kali Puja) with deepavali lamps and devotional midnight offering.</li>
        </ul>
      </div>
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
    badge: 'HEALTHCARE SEVA · BI-ANNUAL',
    title: 'Blood Donation Camp (Twice a Year)',
    html: `
      <p><strong>Frequency:</strong> Organized Twice Every Year (Summer &amp; Pre-Puja Drives)</p>
      <p><strong>Partners:</strong> Nadia District Red Cross &amp; Ranaghat Sub-Divisional Hospital Blood Bank</p>
      <p>Kamalpur Abhijan Sangha's premier healthcare initiative running for over 38 consecutive years. By hosting camps twice a year, we mobilize over 600+ units of life-saving blood to support thalassemia patients, emergency trauma centers, and maternity wards across Ranaghat.</p>
      <div style="background:var(--eg-lighter); padding:14px; border-radius:10px; margin:14px 0; border:1px solid var(--border);">
        <h4 style="color:var(--eg); margin:0 0 6px; font-family:var(--serif); font-size:16px;">Donor Amenities &amp; Health Checks:</h4>
        <ul style="padding-left:18px; line-height:1.7; margin:0;">
          <li>Free hemoglobin, blood-grouping, and vitals screening for every volunteer.</li>
          <li>Nutrition refreshment kits (fruits, eggs, milk, juice) and donor certificate of recognition.</li>
          <li>Emergency blood donor registry accessible 24/7 for local residents in distress.</li>
        </ul>
      </div>
      <div style="margin-top:12px; padding:12px; background:var(--gold-pale); border-radius:8px; font-size:13.5px;">
        <strong>Want to volunteer or donate?</strong> Contact our Health &amp; Seva Cell at +91 8637578740.
      </div>
    `
  },
  bostro_kombol: {
    badge: 'COMMUNITY SEVA & RELIEF',
    title: 'Bostro Bitoron & Kombol Bitoron Seva',
    html: `
      <p><strong>Frequency:</strong> Twice Annually (Autumn Sharodotsav Saree Drive &amp; Winter Blanket Distribution)</p>
      <p><strong>Venue:</strong> Sangha Bhavan &amp; Neighborhood Outreach Centers, Kamalpur</p>
      <div style="background:#FFF8E7; padding:15px; border-radius:10px; margin:14px 0; border:1px solid #FFE082;">
        <h4 style="color:#B45309; margin:0 0 8px; font-family:var(--serif); font-size:16px;">Two Pillars of Warmth &amp; Dignity:</h4>
        <ul style="padding-left:18px; line-height:1.7; margin:0;">
          <li>🌟 <strong>Bostro Bitoron (বস্ত্র বিতরণ):</strong> Over 4,000 festive new sarees and children's apparel distributed ahead of Durga Puja to ensure every mother and child celebrates with pride.</li>
          <li>❄️ <strong>Kombol Bitoron (কম্বল বিতরণ):</strong> Every December, volunteers distribute 1,500+ thick winter blankets and woolen sweaters to low-income elders, rickshaw pullers, and shelterless families.</li>
        </ul>
      </div>
      <p style="font-size:13.5px; color:var(--text-2);">Supported by government dignitaries, patron donations, and voluntary youth distribution brigades.</p>
    `
  },
  spoken_ai: {
    badge: 'YOUTH SKILLS & MODERN TECH',
    title: 'Spoken English & AI Coaching Class',
    html: `
      <p><strong>Initiative:</strong> Free Youth Digital Empowerment &amp; Language Academy</p>
      <p><strong>Target Group:</strong> High School Students, College Undergraduates, and Job Aspirants</p>
      <div style="background:var(--eg-lighter); padding:16px; border-radius:12px; margin:14px 0; border:1px solid var(--border);">
        <h4 style="color:var(--eg); margin:0 0 8px; font-family:var(--serif); font-size:16px;">Curriculum &amp; Hands-On Training:</h4>
        <ul style="padding-left:18px; line-height:1.7; margin:0;">
          <li>🗣️ <strong>Spoken English Fluency:</strong> Everyday conversational English, corporate email drafting, pronunciation correction, and confident interview presentation skills.</li>
          <li>🤖 <strong>Artificial Intelligence (AI) Literacy:</strong> Practical usage of generative AI tools (Gemini, ChatGPT) for research, academic writing, presentation building, and office automation.</li>
          <li>💻 <strong>Digital Workspace Skills:</strong> Professional typing, Google Workspace/Docs/Sheets, and digital resume creation.</li>
        </ul>
      </div>
      <p style="font-size:13.5px; color:var(--text-3);">Classes conducted in the Sangha Library &amp; Computer Lab on weekends by corporate professionals and volunteer educators.</p>
    `
  },
  job_coaching: {
    badge: 'CAREER GUIDANCE & PUBLIC SERVICE',
    title: 'Competitive Job Coaching Class',
    html: `
      <p><strong>Objective:</strong> Preparing Rural &amp; Semi-Urban Youth for Secure Public Sector Careers</p>
      <p><strong>Class Schedule:</strong> Regular Weekend Batches &amp; Evening Doubt-Clearing Sessions</p>
      <div style="background:var(--eg-lighter); padding:16px; border-radius:12px; margin:14px 0; border:1px solid var(--border);">
        <h4 style="color:var(--eg); margin:0 0 8px; font-family:var(--serif); font-size:16px;">Covered Examinations &amp; Resources:</h4>
        <ul style="padding-left:18px; line-height:1.7; margin:0;">
          <li><strong>State Government:</strong> WBCS (Prelims + Mains), West Bengal Police (Constable &amp; SI), Kolkata Police, and WBPSC Clerkship/Misc.</li>
          <li><strong>Central Government:</strong> Staff Selection Commission (SSC CGL/CHSL/MTS), Indian Railways (RRB NTPC &amp; Group D), and IBPS Banking.</li>
          <li><strong>Teaching &amp; Defense:</strong> WB Primary TET, Upper Primary, Army, Navy, and Air Force recruitment.</li>
          <li><strong>Free Study Material:</strong> Weekly mock test series, current affairs booklets, and full lending access to Sangha's competitive exam library.</li>
        </ul>
      </div>
    `
  },
  job_hub: {
    badge: 'EMPLOYMENT & LIVELIHOOD',
    title: 'Job Hub for All Kinds of People (4 Times a Year)',
    html: `
      <p><strong>Frequency:</strong> Organized Quarterly (4 Times a Year — January, April, July, October)</p>
      <p><strong>Venue:</strong> Sangha Prangon &amp; Community Hall, Kamalpur, Ranaghat</p>
      <div style="background:#FFF8E7; padding:16px; border-radius:12px; margin:14px 0; border:1px solid #FFE082;">
        <h4 style="color:#B45309; margin:0 0 8px; font-family:var(--serif); font-size:16px;">Inclusive Employment for Every Skill Category:</h4>
        <ul style="padding-left:18px; line-height:1.7; margin:0;">
          <li>💼 <strong>White-Collar &amp; Graduates:</strong> IT support, data entry, customer service, retail managers, sales executives, and accountants.</li>
          <li>🔧 <strong>Skilled &amp; Technical:</strong> Electricians, plumbers, solar technicians, CNC operators, healthcare assistants, and lab technicians.</li>
          <li>🚚 <strong>Field &amp; Support:</strong> Commercial drivers, logistics dispatchers, delivery associates, security personnel, and warehouse staff.</li>
        </ul>
      </div>
      <p style="font-size:13.5px; color:var(--text-2);">Over 40+ regional enterprises, MSMEs, hospitals, and logistics partners participate in each quarterly job fair. On-the-spot interviews and offer letters distributed.</p>
    `
  },
  borodurga_art: {
    badge: 'ARTISANAL HERITAGE & CREATIVE HUB',
    title: 'BoroDurga Art Village',
    html: `
      <p><strong>Location:</strong> Kamalpur Cultural Precinct, Ranaghat, Nadia</p>
      <p><strong>Vision:</strong> A year-round living art hub nurturing master clay artisans, sculptors, and folk craftsmen of Bengal.</p>
      <div style="background:var(--eg-lighter); padding:16px; border-radius:12px; margin:14px 0; border:1px solid var(--border);">
        <h4 style="color:var(--eg); margin:0 0 8px; font-family:var(--serif); font-size:16px;">Artisanal Wings &amp; Craft Workshops:</h4>
        <ul style="padding-left:18px; line-height:1.7; margin:0;">
          <li>🏺 <strong>Krishnanagar &amp; Kumartuli Clay Studio:</strong> Traditional clay idol sculpting studio where master artisans teach youth sacred pratima sculpting.</li>
          <li>🕯️ <strong>Chandannagar Light Design Lab:</strong> Technical training in dynamic LED gate sequencing, kinetic illumination, and safety engineering.</li>
          <li>🌾 <strong>Folk Crafts &amp; Sholapith:</strong> Preserving ancient dokra brass casting, terracotta temple murals, and shola daker saaj decorative ornaments.</li>
          <li>🎨 <strong>Public Art Exhibitions:</strong> Regular weekend display gallery attracting art historians, tourists, and cultural patrons.</li>
        </ul>
      </div>
    `
  },
  youth_skills: {
    badge: 'YOUTH EDUCATION',
    title: 'Youth Education & Career Hub',
    html: `
      <p><strong>Location:</strong> Sangha Bhavan, Kamalpur</p>
      <p>Free youth training programs focusing on spoken English fluency, generative AI tools, and competitive examination coaching empowering local students and job seekers.</p>
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
    badge: 'COMMUNITY SEVA',
    title: 'Annual Community Seva & Health Meet',
    html: `
      <p>Annual community gathering featuring free preventive health checkups, educational student awards, and social welfare distribution for residents.</p>
    `
  },
  manager: {
    badge: 'OFFICIAL EVENT MANAGEMENT',
    title: 'Lead Event Manager: Subha Kumar Mandal (SUBHA-ARTHA)',
    html: `
      <div style="display:flex; gap:18px; align-items:center; flex-wrap:wrap; margin-bottom:16px;">
        <img src="assets/event-manager-avatar.jpg" alt="Subha Kumar Mandal" style="width:90px; height:90px; border-radius:50%; object-fit:cover; border:2.5px solid var(--gold); box-shadow:0 6px 18px rgba(0,0,0,0.15);">
        <div>
          <h4 style="font-family:var(--serif); font-size:22px; color:var(--eg-dark); margin:0 0 4px;">SUBHA Kumar MANDAL</h4>
          <p style="margin:0 0 4px; color:var(--gold-dark); font-weight:700; font-size:13.5px;">Civil Engineering · CA (Inter)</p>
          <p style="margin:0; color:var(--text-2); font-size:13px;">Business &amp; Career Consultant · Lead Event Organiser</p>
          <p style="margin:3px 0 0; color:var(--eg); font-weight:700; font-size:13px;">Managing Director: <strong>SUBHA-ARTHA</strong></p>
        </div>
      </div>

      <div style="margin:16px 0; border-radius:12px; overflow:hidden; border:1px solid var(--border); box-shadow:0 8px 24px rgba(0,0,0,0.12);">
        <img src="assets/subha-artha-card.png" alt="SUBHA-ARTHA Visiting Card" style="width:100%; display:block;">
      </div>

      <div style="background:var(--eg-lighter); padding:16px; border-radius:12px; margin:16px 0; border:1px solid var(--border); font-size:13.5px; line-height:1.7;">
        <h5 style="color:var(--eg); margin:0 0 8px; font-family:var(--serif); font-size:16px;">Event Direction &amp; Core Operations:</h5>
        <ul style="padding-left:18px; margin:0;">
          <li><strong>Architecture &amp; Layout:</strong> 80 Temple Pavilions housing 117 Durga forms engineered for smooth queue dispersion.</li>
          <li><strong>Illumination &amp; Sound:</strong> Over 1.5 km of Chandannagar light boulevards and multi-stage acoustics.</li>
          <li><strong>Public Safety &amp; Seva:</strong> 24x7 security perimeter, emergency medical corridors, and daily Annakut Maha Bhog logistics.</li>
          <li><strong>Media &amp; Web Production:</strong> Multi-camera live broadcast, sponsorship activation, and official web portals.</li>
        </ul>
      </div>

      <div style="background:#FFF8E7; padding:16px; border-radius:12px; border:1px solid #FFE082; font-size:13.5px;">
        <p style="margin:0 0 6px;"><strong>Direct Phones:</strong> <a href="tel:+918637578740" style="color:var(--eg); font-weight:700;">+91 8637578740</a> / <a href="tel:+918250603038" style="color:var(--eg); font-weight:700;">+91 8250603038</a></p>
        <p style="margin:0 0 6px;"><strong>WhatsApp:</strong> <a href="https://wa.me/918637578740?text=Hello%20Subha%20Kumar%20Mandal,%20inquiry%20regarding%20Kamalpur%20Abhijan%20Sangha%20Event%20Management." target="_blank" rel="noopener noreferrer" style="color:#25D366; font-weight:700;">Chat on WhatsApp &rarr;</a></p>
        <p style="margin:0 0 6px;"><strong>Email:</strong> <a href="mailto:thesubhaartha@gmail.com" style="color:var(--eg); font-weight:700;">thesubhaartha@gmail.com</a></p>
        <p style="margin:0;"><strong>Official Website:</strong> <a href="https://www.subhaartha.com" target="_blank" rel="noopener noreferrer" style="color:var(--eg); font-weight:700;">www.subhaartha.com &rarr;</a></p>
      </div>
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

  if (badge) badge.textContent = 'ARTISANS & SCULPTORS · SHARODOTSAV 2026';
  if (title) title.textContent = 'Master Sculptors & Creative Visionaries';
  if (body) {
    body.innerHTML = `
      <div style="line-height:1.7;">
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid rgba(212,160,23,0.25);">
          <img src="assets/artist-nitish-munshi-avatar.jpg" alt="Nitish Munshi" style="width:54px; height:54px; border-radius:50%; object-fit:cover; border:2px solid var(--gold, #B45309); flex-shrink:0;">
          <div>
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--gold-dark, #B45309); font-weight:700;">Pratima Shilpi · প্রধান প্রতিমা শিল্পী</div>
            <strong style="font-size:16px; color:var(--text-1, #1A1A1A);">Sri Nitish Munshi (শ্রী নীতিশ মুন্সী)</strong>
            <div style="font-size:13px; color:var(--text-2, #4A5568);">Lead Sculptor crafting Maa Durga's sacred pratima for the 2026 theme <em>&ldquo;গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ&rdquo;</em>.</div>
          </div>
        </div>
        <p><strong>Kumartuli & Krishnanagar Clay Masters:</strong> Hand-sculpting the venerated 117 scriptural forms of Devi Durga across 80 temple pavilions.</p>
        <p style="margin-top:10px;"><strong>Pandal Architects (Ray & Dey):</strong> Eco-friendly bamboo, terracotta relief, and dokra brass spatial installation across 45,000 sq ft.</p>
        <p style="margin-top:10px;"><strong>Chandannagar Illumination (Babu Pal & Sridam Das):</strong> 1.5 km animated LED gate avenue along Ranaghat station boulevard.</p>
        <div style="margin-top:18px; text-align:center;">
          <a href="artists.html" class="hero-btn primary" style="display:inline-block; padding:10px 22px; font-size:13px; text-decoration:none; border-radius:8px; background:var(--gold-dark, #B45309); color:#fff; font-weight:700;">View Full Master Artisans Directory &rarr;</a>
        </div>
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

let activeLightboxItems = [];
let activeLightboxIndex = 0;

function populateLightboxFromElement(el) {
  if (!el || el.nodeType !== 1) return;
  const lbTitle = document.getElementById('lbTitle');
  const lbCaption = document.getElementById('lbCaption');
  const lbIcon = document.getElementById('lbIcon');
  const lbImgBox = document.getElementById('lbImgBox');
  const lbImg = document.getElementById('lbImg');
  const lbBadge = document.getElementById('lbBadge');
  const lbYear = document.getElementById('lbYear');
  const lbCounter = document.getElementById('lbCounter');
  const prevBtn = document.querySelector('.lb-prev');
  const nextBtn = document.querySelector('.lb-next');

  const t = el.getAttribute('data-title') || el.querySelector('.line-1, .gi-title, .hgi-title, .gi-caption strong')?.textContent || '';
  const d = el.getAttribute('data-desc') || el.querySelector('.line-2, .gi-desc, .hgi-desc, .gi-caption span')?.textContent || '';
  const imgSrc = el.getAttribute('data-img') || el.querySelector('img')?.getAttribute('src');
  const cat = el.getAttribute('data-cat-label') || el.querySelector('.gi-badge, .hgi-tags .gi-badge')?.textContent || el.getAttribute('data-cat') || 'Kamalpur Gallery';
  const yr = el.getAttribute('data-year') || el.querySelector('.yessy-card-count, .gi-year-tag, .hgi-tags .gi-year-tag')?.textContent || '2026';
  const iconEl = el.querySelector('.gi-icon');

  if (lbTitle) lbTitle.textContent = t;
  if (lbCaption) lbCaption.textContent = d;
  if (lbBadge) lbBadge.textContent = cat;
  if (lbYear) lbYear.textContent = yr;

  if (activeLightboxItems.length > 1 && lbCounter) {
    lbCounter.textContent = `${activeLightboxIndex + 1} / ${activeLightboxItems.length}`;
    lbCounter.style.display = 'inline-block';
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
  } else {
    if (lbCounter) lbCounter.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  if (imgSrc && lbImgBox && lbImg) {
    lbImg.src = imgSrc;
    lbImg.alt = t || 'Enlarged gallery view';
    lbImgBox.style.display = 'flex';
    if (lbIcon) lbIcon.style.display = 'none';
  } else {
    if (lbImgBox) lbImgBox.style.display = 'none';
    if (lbIcon) {
      lbIcon.style.display = 'inline-flex';
      if (iconEl) lbIcon.innerHTML = iconEl.innerHTML;
    }
  }
}

function openLightbox(titleOrEl, caption, icon) {
  const modal = document.getElementById('lightboxModal');
  if (titleOrEl && titleOrEl.nodeType === 1) {
    const parentContainer = titleOrEl.closest('#mainGalleryGrid, #homeGalleryGrid, .gallery-grid, .home-gallery-grid');
    if (parentContainer) {
      activeLightboxItems = Array.from(parentContainer.querySelectorAll('.gallery-item, .home-gallery-item, .yessy-card')).filter(it => it.style.display !== 'none');
      const idx = activeLightboxItems.indexOf(titleOrEl);
      activeLightboxIndex = idx >= 0 ? idx : 0;
    } else {
      activeLightboxItems = [titleOrEl];
      activeLightboxIndex = 0;
    }
    populateLightboxFromElement(titleOrEl);
  } else {
    activeLightboxItems = [];
    activeLightboxIndex = 0;
    const lbTitle = document.getElementById('lbTitle');
    const lbCaption = document.getElementById('lbCaption');
    const lbIcon = document.getElementById('lbIcon');
    const lbImgBox = document.getElementById('lbImgBox');
    const lbBadge = document.getElementById('lbBadge');
    const lbYear = document.getElementById('lbYear');
    const lbCounter = document.getElementById('lbCounter');
    const prevBtn = document.querySelector('.lb-prev');
    const nextBtn = document.querySelector('.lb-next');

    if (lbImgBox) lbImgBox.style.display = 'none';
    if (lbIcon) lbIcon.style.display = 'inline-flex';
    if (lbTitle) lbTitle.textContent = titleOrEl || '';
    if (lbCaption) lbCaption.textContent = caption || '';
    if (lbBadge) lbBadge.textContent = 'Kamalpur Gallery';
    if (lbYear) lbYear.textContent = '2026';
    if (lbCounter) lbCounter.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
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

function lightboxNav(delta) {
  if (!activeLightboxItems || activeLightboxItems.length <= 1) return;
  activeLightboxIndex = (activeLightboxIndex + delta + activeLightboxItems.length) % activeLightboxItems.length;
  populateLightboxFromElement(activeLightboxItems[activeLightboxIndex]);
}

function openImageLightbox(src, title, caption, badge, year) {
  const modal = document.getElementById('lightboxModal');
  const lbImgBox = document.getElementById('lbImgBox');
  const lbImg = document.getElementById('lbImg');
  const lbIcon = document.getElementById('lbIcon');
  const lbTitle = document.getElementById('lbTitle');
  const lbCaption = document.getElementById('lbCaption');
  const lbBadge = document.getElementById('lbBadge');
  const lbYear = document.getElementById('lbYear');
  const lbCounter = document.getElementById('lbCounter');
  const prevBtn = document.querySelector('.lb-prev');
  const nextBtn = document.querySelector('.lb-next');

  if (lbImg && src) lbImg.src = src;
  if (lbImgBox) lbImgBox.style.display = 'block';
  if (lbIcon) lbIcon.style.display = 'none';
  if (lbTitle) lbTitle.textContent = title || 'Official Sangha Panorama';
  if (lbCaption) lbCaption.textContent = caption || 'Kamalpur Abhijan Sangha — Our Culture, Our Pride, Our Community.';
  if (lbBadge) lbBadge.textContent = badge || 'Official Canvas';
  if (lbYear) lbYear.textContent = year || '2026';
  if (lbCounter) lbCounter.style.display = 'none';
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';

  if (modal) modal.classList.add('open');
}

window.openLightbox = openLightbox;
window.openImageLightbox = openImageLightbox;
window.lightboxNav = lightboxNav;

function openVideoModal(videoSrc, title) {
  const modal = document.getElementById('videoPlayerModal');
  const player = document.getElementById('videoModalPlayer');
  const titleEl = document.getElementById('videoModalTitle');
  if (titleEl) titleEl.textContent = title || 'Kamalpur Video Chronicle';
  if (player) {
    player.src = videoSrc;
    player.play().catch(() => {});
  }
  if (modal) modal.classList.add('open');
}

function closeVideoModal() {
  const modal = document.getElementById('videoPlayerModal');
  const player = document.getElementById('videoModalPlayer');
  if (player) {
    player.pause();
    player.src = '';
  }
  if (modal) modal.classList.remove('open');
}

window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
  if (modalId === 'videoPlayerModal') {
    const player = document.getElementById('videoModalPlayer');
    if (player) {
      player.pause();
      player.src = '';
    }
  }
}

// Global escape key and arrow keys listener for modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ['eventModal', 'donationModal', 'lightboxModal', 'videoPlayerModal'].forEach(closeModal);
    dismissIntro();
  }
  if (document.getElementById('lightboxModal')?.classList.contains('open')) {
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'ArrowLeft') lightboxNav(-1);
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

function copyBankField(text, btnElement) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopiedFeedback(btnElement);
    }).catch(() => {
      fallbackCopyText(text, btnElement);
    });
  } else {
    fallbackCopyText(text, btnElement);
  }
}
window.copyBankField = copyBankField;
window.copyText = copyBankField;

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

/* ── 8. Seed Initial Ledger, Gallery & Artists Data if Storage Empty ── */
function initAdminSeedData() {
  try {
    if (localStorage.getItem('kas_donations') === null) {
      localStorage.setItem('kas_donations', JSON.stringify([]));
    }

    if (localStorage.getItem('kas_members') === null) {
      localStorage.setItem('kas_members', JSON.stringify([]));
    }

    const sampleGallery = [
      {
        id: 1,
        title: '1. Mahishasuramardini — Terracotta Clay Sanctum',
        category: 'Terracotta Form',
        year_tag: 'Form #1',
        desc_text: 'Sacred classical terracotta clay sculpture of Devi Durga in dynamic battle posture, subduing the Asura with divine weapons crafted from sacred soil.',
        img_url: 'assets/gallery/durga-form-1.jpg'
      },
      {
        id: 2,
        title: '2. Devi Katyayani — Green Stone Patina Form',
        category: 'Stone Patina',
        year_tag: 'Form #2',
        desc_text: 'Serene celestial manifestation of Devi Katyayani draped in sacred robes, standing poised on the ferocious lion above the buffalo altar.',
        img_url: 'assets/gallery/durga-form-2.jpg'
      },
      {
        id: 3,
        title: '3. Devi Chandraghanta — Golden Swarna Varna Form',
        category: 'Swarna Varna',
        year_tag: 'Form #3',
        desc_text: 'Radiant golden-visaged manifestation of Devi Chandraghanta adorned in vermilion and crimson drape, seated atop the roaring lion.',
        img_url: 'assets/gallery/durga-form-3.jpg'
      },
      {
        id: 4,
        title: '4. Devi Skandamata & Gajaraj — Antique Bronze Form',
        category: 'Bronze Patina',
        year_tag: 'Form #4',
        desc_text: 'Monumental bronze-patina sculpture featuring Devi Durga flanked by the sacred royal elephant and lion, conquering the forces of darkness.',
        img_url: 'assets/gallery/durga-form-4.jpg'
      },
      {
        id: 5,
        title: '5. Devi Kushmanda — Illuminated Cosmic Aura Form',
        category: 'Cosmic Aura',
        year_tag: 'Form #5',
        desc_text: 'Divine manifestation of Devi Kushmanda enclosed within a luminous cosmic halo rising above the demon head, glowing under sacred temple illumination.',
        img_url: 'assets/gallery/durga-form-5.jpg'
      }
    ];

    const GALLERY_SYNC_KEY = 'kas_gallery_ver_5forms_2026';
    if (localStorage.getItem('kas_gallery_sync') !== GALLERY_SYNC_KEY || localStorage.getItem('kas_gallery') === null) {
      localStorage.setItem('kas_gallery_sync', GALLERY_SYNC_KEY);
      localStorage.setItem('kas_gallery', JSON.stringify(sampleGallery));
    }

    const nitishMunshiArtist = {
      id: 0,
      name: 'Nitish Munshi',
      craft: 'Master Sculptor & Chief Idol Artist (প্রধান প্রতিমা শিল্পী)',
      region: 'Nadia & Kumartuli Tradition · Maa Durga Pratima Shilpi',
      era_tag: '2026 Theme Idol',
      avatar_initials: 'NM',
      bio: 'Acclaimed master sculptor and idol artisan Nitish Munshi breathes transcendent spiritual majesty and emotional depth into sacred clay. For Kamalpur Abhijan Sangha\'s historic 2026 Durgotsav under the theme "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Nitish Munshi leads the sculpting of the sanctum\'s divine Maa Durga Mahishasuramardini pratima and sacred forms, weaving classical Shastric clay modeling, sacred Ganga silt, and evocative devotional expression.',
      tradition: 'Sacred Clay Modeling, Shastric Iconography & Chokkhu Daan Artistry',
      accolades: 'Lead Idol Artisan for 2026 Theme',
      creations: '117 Forms Sanctum Idols, Mahishasuramardini, Navadurga Sculptural Iconography',
      philosophy: '"প্রতিমা শুধু মাটির রূপ নয়, মায়ের প্রতি ভক্ত হৃদয়ের নিখাদ ভক্তি আর অনুভবের দৃশ্যমান প্রকাশ। Chokkhu Daan is the supreme moment when clay awakens into divinity, blessing every soul that bows before Her."',
      img_url: 'assets/artist-nitish-munshi-avatar.jpg'
    };

    const sanjitSarkarArtist = {
      id: 101,
      name: 'Sanjit Sarkar',
      craft: 'Master Sculptor & Idol Artisan (প্রতিমা শিল্পী ও মৃৎশিল্পী)',
      region: 'Nadia & Bengal Artisan Guild · Maa Durga Pratima Shilpi',
      era_tag: '2026 Theme Idol',
      avatar_initials: 'SS',
      bio: 'Esteemed master sculptor and idol artisan Sanjit Sarkar is dedicated to the classical art of Bengal clay iconography. For Kamalpur Abhijan Sangha\'s 2026 landmark Durgotsav centering on "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Sanjit Sarkar sculpts sacred representations of the divine mother, combining pure alluvial Ganga clay, anatomical perfection, and spiritual facial ornamentation.',
      tradition: 'Sacred Clay Modeling, Traditional Straw Binding & Divine Visage',
      accolades: 'Lead Idol Artisan for 2026 Theme',
      creations: '117 Forms Sanctum Idols, Mahishasuramardini & Scriptural Iconography',
      philosophy: '"মাটির প্রতিটি ছোঁয়ায় ভক্তি আর নিষ্ঠা মিশে থাকে। মায়ের প্রসন্ন রূপ ফুটিয়ে তোলাই আমাদের পরম সাধনা।"',
      img_url: 'assets/artist-sanjit-sarkar-avatar.jpg'
    };

    const apurbaRayArtist = {
      id: 102,
      name: 'Apurba Ray',
      craft: 'Master Artist & Thematic Sculptor (মন্ডপ ও রূপসজ্জা শিল্পী)',
      region: 'Nadia & Bengal Art Studio · রূপসজ্জা ও থিম শিল্পী',
      era_tag: '2026 Theme Artisan',
      avatar_initials: 'AR',
      bio: 'Master artist Apurba Ray is renowned for his mastery over thematic sacred spatial aesthetics, environmental ornamentation, and classical Bengal artistic craftsmanship. For Kamalpur Abhijan Sangha\'s 2026 landmark celebration of "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Apurba Ray orchestrates the atmospheric ornamentation and sanctum artistic installations that elevate the devotee\'s spiritual journey into the ancient cave sanctum of the Adi Shakti.',
      tradition: 'Thematic Space Design, Bengal Clay & Sanctum Artistry',
      accolades: '2026 Theme Master Artisan & Spatial Designer',
      creations: 'Sanctum Ambience & Aesthetic Ornamentation of 117 Durga Forms',
      philosophy: '"শিল্প যেখানে ভক্তির রূপ ধারণ করে, সেখানেই সৃষ্টি সার্থক হয়। মায়ের অপরূপ রূপসজ্জায় আমাদের পরম নিষ্ঠা।"',
      img_url: 'assets/artist-apurba-ray-avatar.jpg'
    };

    const proshantoRoyArtist = {
      id: 103,
      name: 'Proshanto Roy',
      craft: 'Master Artisan & Thematic Sculptor (প্রতিমা ও রূপসজ্জা শিল্পী)',
      region: 'Nadia & Bengal Artisan Guild · থিম ও প্রতিমা শিল্পী',
      era_tag: '2026 Theme Artisan',
      avatar_initials: 'PR',
      bio: 'Dedicated artisan and sculptor Proshanto Roy co-creates the profound sculptural majesty and sacred cave atmosphere for our historic 2026 Durgotsav presentation "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ". Through exquisite clay modeling and thematic detailing, Sri Proshanto Roy manifests the timeless spiritual grace of the divine Mother.',
      tradition: 'Sacred Clay Modeling, Sculptural Detailing & Thematic Artistry',
      accolades: '2026 Theme Master Artisan & Sculptor',
      creations: 'Thematic Sculpture & Sacred Sanctum Forms for 117 Durga Manifestations',
      philosophy: '"শিল্প যেখানে ভক্তির রূপ ধারণ করে, মায়ের আশীর্বাদে সেই সৃষ্টি জীবন্ত হয়ে ওঠে।"',
      img_url: 'assets/artist-proshanto-roy-avatar.jpg'
    };

    const anandaPaulArtist = {
      id: 104,
      name: 'Ananda Paul',
      craft: 'Master Sculptor & Idol Artisan (মৃৎশিল্পী ও প্রতিমা রূপকার)',
      region: 'Nadia & Kumartuli Tradition · মৃৎ ও প্রতিমা শিল্পী',
      era_tag: '2026 Theme Idol',
      avatar_initials: 'AP',
      bio: 'Esteemed master clay sculptor Ananda Paul brings generations of traditional Bengal Kumbhakar mastery to Kamalpur Abhijan Sangha\'s 2026 landmark celebration "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ". Sculpting divine Shastric idols from pure sacred silt and straw bindings, Sri Ananda Paul shapes the transcendent expressions of Devi Durga.',
      tradition: 'Sacred Clay Modeling, Straw Binding & Divine Visage',
      accolades: '2026 Theme Master Artisan & Sculptor',
      creations: 'Sacred Durga Pratima & Iconographic Forms for 117 Durga Forms',
      philosophy: '"মাটির অঙ্গে প্রাণ প্রতিষ্ঠা করাই আমাদের বংশপরম্পরার সাধনা। মায়ের স্নেহময়ী ও তেজস্বী রূপ ফুটিয়ে তোলাতেই সার্থকতা।"',
      img_url: 'assets/artist-ananda-paul-avatar.jpg'
    };

    let storedArtists = null;
    try {
      storedArtists = JSON.parse(localStorage.getItem('kas_artists') || 'null');
    } catch (e) {}

    if (!storedArtists || !Array.isArray(storedArtists) || storedArtists.length === 0) {
      const sampleArtists = [
        nitishMunshiArtist,
        sanjitSarkarArtist,
        apurbaRayArtist,
        proshantoRoyArtist,
        anandaPaulArtist,
        {
          id: 1,
          name: 'Pradip Rudra Pal',
          craft: 'Chief Clay Sculptor & Idol Architect',
          region: 'Kumartuli, North Kolkata · 4th Gen Dynasty',
          era_tag: '2005 – 2026',
          avatar_initials: 'PR',
          bio: 'Fourth-generation inheritor of the legendary Kumartuli clay sculpting dynasty, Pradip Rudra Pal has spent over 35 years sculpting divine forms for Bengal premier pujas. At Kamalpur Abhijan Sangha, he conceptualized and hand-sculpted the monumental 117 scriptural forms of Devi Durga, marrying traditional Ganga silt clay with classical Sanskrit iconography.',
          tradition: 'Ganga Clay, Straw Binding & Classical Ekchala / Dhaaker Saaj',
          accolades: '7x Biswakarma Shilpa Puraskar, Asian Paints Sharad Shamman (2018, 2022)',
          creations: '117 Forms Sanctum, 108 Durga Avatar Darshan, Mahishasuramardini',
          philosophy: '"Maa Durga is not mere clay and straw. She is the living mother of Bengal. Each layer of Ganga soil carries centuries of prayer, awakening the divine shakti in every devotee who enters our mandap."'
        },
        {
          id: 2,
          name: 'Susanta Ray & Subrata Dey',
          craft: 'Pandal Architects & Spatial Designers',
          region: 'Kolkata & Ranaghat · Thematic Spatial Studio',
          era_tag: '2012 – 2026',
          avatar_initials: 'SR',
          bio: 'Celebrated architectural visionaries of Bengal contemporary Puja movement, Ray & Dey specialize in massive sustainable installations crafted purely from bamboo, terracotta tiles, Dokra brass accents, and handmade jute fabric. For our 2026 Durgotsav, they engineered the awe-inspiring 80 interconnected temple pavilions across 45,000 square feet.',
          tradition: 'Nadia Bamboo, Terracotta Relief Tiles, Dokra Brass, Organic Jute',
          accolades: 'Bengal Thematic Pandal Excellence Award (2024), Nadia Heritage Trophy',
          creations: '80 Temple Sanctum Complex, Terracotta Whispering Corridor, Vedic Dome',
          philosophy: 'Zero synthetic plastics, sustainable architecture, over 65,000 seasoned bamboo poles.'
        },
        {
          id: 3,
          name: 'Babu Pal & Sridam Das',
          craft: 'Chandannagar Illumination Engineers',
          region: 'Chandannagar, Hooghly · Lighting Guild Maestros',
          era_tag: '1994 – Present',
          avatar_initials: 'BP',
          bio: 'Carrying forward Chandannagar legendary lighting heritage for 32 continuous years, Babu Pal and Sridam Das design the iconic 1.5-kilometer illuminated grand avenue from Ranaghat Station to the Sangha grounds. Their kinetic computerized arches depict animated mythological sequences from the Ramayana, Mahishasuramardini, and Bengal heritage.',
          tradition: 'Kinetic 3D LED Arches, Microcontroller Storyboard Illumination',
          accolades: 'Chandannagar Light Master Guild Gold Medal (2016, 2023)',
          creations: '1.5 km Station Boulevard Gate, Dancing Peacock 3D Arch, Cosmic Chariot',
          philosophy: 'Over 250,000 smart LEDs with dedicated green generator safety grid.'
        },
        {
          id: 4,
          name: 'Gokul Das & Motilal Troupe',
          craft: 'Traditional Dhak Maestros & Percussion Ensemble',
          region: 'Murshidabad & Ranaghat · 60-Member Ensemble',
          era_tag: '1988 – Present',
          avatar_initials: 'GD',
          bio: 'A 60-member percussion collective led by master dhaki Gokul Das, this family troupe has provided the heartbeat of Kamalpur Abhijan Sangha for 38 unbroken years. Their hypnotic, resonant rhythms accompany the sacred Bodhon, the 108-lamp Sandhi Puja crescendo, the thrilling Dhunuchi Nritya, and the grand Vijaya Dashami Churni river procession.',
          tradition: 'Bengal Mango Wood Dhak, Brass Kanshi & Sanctum Shankha Ensemble',
          accolades: 'State Folk Percussion Honors (2014), Nadia Cultural Heritage Award',
          creations: 'Mahalaya Bodhon Beats, Sandhi Puja 108 Dhak Aarati, Dashami Bhasan',
          philosophy: '"The Dhak does not create sound; it summons the soul. When 60 dhaks strike in unison at Sandhi Puja, you feel the heartbeat of Bengal."'
        },
        {
          id: 5,
          name: 'Maniklal Chitrakar',
          craft: 'Bengal Pata Chitra & Folk Scroll Murals',
          region: 'Naya, Pingla, Paschim Medinipur · Patua Guild',
          era_tag: '2016 – 2026',
          avatar_initials: 'MC',
          bio: 'A celebrated master of Bengal ancient Patachitra scroll painting tradition, Maniklal Chitrakar uses exclusively hand-ground organic pigments derived from teak leaves, turmeric, crushed conch shells, and Aparajita flower petals. His massive narrative murals narrate Devi Mahatmya hymns and traditional village folklore.',
          tradition: 'Organic Vegetable & Mineral Dyes on Handcrafted Cloth-Paper Scrolls',
          accolades: 'West Bengal State Master Craftsperson Award (2019)',
          creations: 'Devi Mahatmya 100-foot mural gallery, Navadurga Folk Scroll cycle',
          philosophy: 'Preserving endangered rural Bengal talas & organic mineral pigments.'
        },
        {
          id: 6,
          name: 'Pt. Debojyoti Banerjee & Swapan Chakraborty',
          craft: 'Sacred Soundscape & Theme Music Composers',
          region: 'Ranaghat & Nadia · Acoustic Heritage Center',
          era_tag: '2008 – Present',
          avatar_initials: 'DB',
          bio: 'Acclaimed classical musicians and acoustic soundscape designers, Pandit Debojyoti Banerjee (sitar & sarod) and Swapan Chakraborty (choral arrangement) compose the custom atmospheric score for Kamalpur Abhijan Sangha every autumn. Blending pure Raag Bhairav, Shankha calls, and Vedic Chandi stotrams.',
          tradition: 'Classical Indian Ragas, Sanskrit Vedic Stotrams & Spatial Ambient Acoustic',
          accolades: 'Nadia Classical Music Academy Honors (2020)',
          creations: 'The 117 Devi Hymn Symphony, Dawn Bodhon Raga, Evening Arati Choir',
          philosophy: 'Multi-zone 3D spatial acoustic sound field with zero harsh frequencies.'
        }
      ];
      localStorage.setItem('kas_artists', JSON.stringify(sampleArtists));
    } else {
      let updated = false;
      if (!storedArtists.some(a => a.name && a.name.toLowerCase().includes('ananda paul'))) {
        const proshantoIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('proshanto roy'));
        const apurbaIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('apurba ray'));
        const sanjitIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('sanjit sarkar'));
        const nitishIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('nitish munshi'));
        let insertIdx = 0;
        if (proshantoIdx !== -1) {
          insertIdx = proshantoIdx + 1;
        } else if (apurbaIdx !== -1) {
          insertIdx = apurbaIdx + 1;
        } else if (sanjitIdx !== -1) {
          insertIdx = sanjitIdx + 1;
        } else if (nitishIdx !== -1) {
          insertIdx = nitishIdx + 1;
        }
        storedArtists.splice(insertIdx, 0, anandaPaulArtist);
        updated = true;
      }
      if (!storedArtists.some(a => a.name && a.name.toLowerCase().includes('proshanto roy'))) {
        const apurbaIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('apurba ray'));
        const sanjitIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('sanjit sarkar'));
        const nitishIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('nitish munshi'));
        let insertIdx = 0;
        if (apurbaIdx !== -1) {
          insertIdx = apurbaIdx + 1;
        } else if (sanjitIdx !== -1) {
          insertIdx = sanjitIdx + 1;
        } else if (nitishIdx !== -1) {
          insertIdx = nitishIdx + 1;
        }
        storedArtists.splice(insertIdx, 0, proshantoRoyArtist);
        updated = true;
      }
      if (!storedArtists.some(a => a.name && a.name.toLowerCase().includes('apurba ray'))) {
        const sanjitIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('sanjit sarkar'));
        const nitishIdx = storedArtists.findIndex(a => a.name && a.name.toLowerCase().includes('nitish munshi'));
        let insertIdx = 0;
        if (sanjitIdx !== -1) {
          insertIdx = sanjitIdx + 1;
        } else if (nitishIdx !== -1) {
          insertIdx = nitishIdx + 1;
        }
        storedArtists.splice(insertIdx, 0, apurbaRayArtist);
        updated = true;
      }
      if (!storedArtists.some(a => a.name && a.name.toLowerCase().includes('sanjit sarkar'))) {
        const insertIdx = storedArtists.some(a => a.name && a.name.toLowerCase().includes('nitish munshi')) ? 1 : 0;
        storedArtists.splice(insertIdx, 0, sanjitSarkarArtist);
        updated = true;
      }
      if (!storedArtists.some(a => a.name && a.name.toLowerCase().includes('nitish munshi'))) {
        storedArtists.unshift(nitishMunshiArtist);
        updated = true;
      }
      if (updated) {
        localStorage.setItem('kas_artists', JSON.stringify(storedArtists));
      }
    }
  } catch (e) {
    console.error('Seed data error:', e);
  }
}

/* ── 9. Public Dynamic Renderers for Gallery & Artists ── */
async function initPublicGallery() {
  const grid = document.getElementById('mainGalleryGrid');
  if (!grid) return;

  try {
    const res = await fetch('api/gallery.php?cb=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        localStorage.setItem('kas_gallery', JSON.stringify(json.data));
      }
    }
  } catch (e) {}

  const galleryList = JSON.parse(localStorage.getItem('kas_gallery') || '[]');
  if (!galleryList || galleryList.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-2); font-size: 15px; font-weight: 500;">No gallery photos published yet. Check back soon!</div>';
    return;
  }

  // Update dynamic count tags on filter buttons
  const counts = { all: galleryList.length, durga: 0, lights: 0, seva: 0, culture: 0 };
  galleryList.forEach(item => {
    const k = mapCategoryKey(item.category);
    if (counts[k] !== undefined) counts[k]++;
  });
  Object.keys(counts).forEach(k => {
    const el = document.getElementById('count-' + k);
    if (el) el.textContent = counts[k];
  });

  grid.innerHTML = galleryList.map((item) => {
    const cat = item.category || 'Maha Protima';
    const catKey = mapCategoryKey(cat);
    const year = item.year_tag || '2025–2026';
    const title = item.title || 'Kamalpur Durgotsav';
    const desc = item.desc_text || '';
    const img = item.img_url || 'assets/durga-scene.jpg';

    // Format line 1 and line 2 for the fine-art framed card title
    let line1 = title;
    let line2 = cat;
    if (title.includes('—')) {
      const parts = title.split('—');
      line1 = parts[0].trim();
      line2 = parts[1].trim();
    } else if (title.includes('&amp;')) {
      const parts = title.split('&amp;');
      line1 = parts[0].trim();
      line2 = '&amp; ' + parts[1].trim();
    } else if (title.includes('&')) {
      const parts = title.split('&');
      line1 = parts[0].trim();
      line2 = '&amp; ' + parts[1].trim();
    }

    return `
      <div class="yessy-card" data-cat="${escapeAttr(catKey)}" data-cat-label="${escapeAttr(cat)}" data-year="${escapeAttr(year)}" data-title="${escapeAttr(title)}" data-desc="${escapeAttr(desc)}" data-img="${escapeAttr(img)}" onclick="openLightbox(this)" tabindex="0" role="button" aria-label="${escapeAttr(title)}">
        <img src="${escapeAttr(img)}" alt="${escapeAttr(title)}" class="yessy-card-img" loading="lazy" onerror="this.src='assets/durga-scene.jpg'">
        <div class="yessy-card-overlay">
          <div class="yessy-card-title">
            <span class="line-1">${escapeHtml(line1)}</span>
            <span class="line-2">${escapeHtml(line2)}</span>
          </div>
        </div>
        <span class="yessy-card-count">${escapeHtml(year)}</span>
      </div>
    `;
  }).join('');
}

window.currentGalleryCategory = 'all';
window.currentGallerySearch = '';

function filterGallery(category, btn) {
  document.querySelectorAll('.filter-btn, .h-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn && btn.nodeType === 1) btn.classList.add('active');
  const catSelect = document.getElementById('yessyCatSelect');
  if (catSelect && typeof category === 'string') catSelect.value = category;

  window.currentGalleryCategory = category || 'all';
  applyGalleryFilters();
}

function handleGallerySearch(query) {
  window.currentGallerySearch = query || '';
  const clearBtn = document.getElementById('searchClearBtn');
  if (clearBtn) clearBtn.style.display = query ? 'inline-block' : 'none';
  applyGalleryFilters();
}

function clearGallerySearch() {
  const input = document.getElementById('gallerySearchInput') || document.getElementById('yessySearchInput');
  if (input) input.value = '';
  handleGallerySearch('');
}

function executeHeroSearch() {
  const input = document.getElementById('yessySearchInput');
  const select = document.getElementById('yessyCatSelect');
  const query = input ? input.value : '';
  const cat = select ? select.value : 'all';

  window.currentGalleryCategory = cat;
  window.currentGallerySearch = query;
  applyGalleryFilters();

  const target = document.getElementById('mainGalleryGrid') || document.querySelector('.yessy-category-section');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function applyGalleryFilters() {
  const cat = window.currentGalleryCategory || 'all';
  const q = (window.currentGallerySearch || '').trim().toLowerCase();
  const items = document.querySelectorAll('#mainGalleryGrid .yessy-card, #mainGalleryGrid .gallery-item');
  let visibleCount = 0;

  items.forEach(item => {
    const itemCat = (item.getAttribute('data-cat') || '').toLowerCase();
    const title = (item.getAttribute('data-title') || '').toLowerCase();
    const desc = (item.getAttribute('data-desc') || '').toLowerCase();
    const catLabel = (item.getAttribute('data-cat-label') || '').toLowerCase();
    const year = (item.getAttribute('data-year') || '').toLowerCase();

    const matchesCat = cat === 'all' || itemCat.includes(cat) || catLabel.includes(cat);
    const matchesSearch = !q || title.includes(q) || desc.includes(q) || catLabel.includes(q) || year.includes(q) || itemCat.includes(q);

    if (matchesCat && matchesSearch) {
      item.style.display = '';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });

  const noResults = document.getElementById('galleryNoResults');
  if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

window.executeHeroSearch = executeHeroSearch;

function filterHomeGallery(category, btn) {
  document.querySelectorAll('.h-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const items = document.querySelectorAll('#homeGalleryGrid .home-gallery-item');
  items.forEach(item => {
    const itemCat = (item.getAttribute('data-cat') || '').toLowerCase();
    if (category === 'all' || itemCat.includes(category)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

window.filterGallery = filterGallery;
window.handleGallerySearch = handleGallerySearch;
window.clearGallerySearch = clearGallerySearch;
window.applyGalleryFilters = applyGalleryFilters;
window.filterHomeGallery = filterHomeGallery;

function mapCategoryKey(cat) {
  if (!cat) return 'all';
  const c = cat.toLowerCase();
  if (c.includes('terracotta') || c.includes('clay')) return 'terracotta';
  if (c.includes('stone') || (c.includes('patina') && !c.includes('bronze'))) return 'stone';
  if (c.includes('swarna') || c.includes('gold') || c.includes('yellow')) return 'swarna';
  if (c.includes('bronze') || c.includes('gajaraj') || c.includes('elephant')) return 'bronze';
  if (c.includes('aura') || c.includes('cosmic') || c.includes('kushmanda')) return 'aura';
  if (c.includes('protima') || c.includes('durga')) return 'durga';
  return 'all';
}

function mapArtistCraftCategory(craft) {
  if (!craft) return 'all';
  const c = craft.toLowerCase();
  if (c.includes('clay') || c.includes('sculpt') || c.includes('idol') || c.includes('protima') || c.includes('kumartuli')) return 'sculpture';
  if (c.includes('pandal') || c.includes('architect') || c.includes('spatial') || c.includes('bamboo')) return 'pandal';
  if (c.includes('light') || c.includes('illumination') || c.includes('chandannagar') || c.includes('led')) return 'lights';
  if (c.includes('dhak') || c.includes('percussion') || c.includes('music') || c.includes('sound') || c.includes('acoustic') || c.includes('composer')) return 'music';
  if (c.includes('pata') || c.includes('mural') || c.includes('folk') || c.includes('scroll') || c.includes('chitra') || c.includes('paint')) return 'murals';
  return 'all';
}

async function initPublicArtists() {
  const grid = document.getElementById('publicArtistsGrid');
  if (!grid) return;

  try {
    const res = await fetch('api/artists.php?cb=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        localStorage.setItem('kas_artists', JSON.stringify(json.data));
      }
    }
  } catch (e) {}

  let artistsList = [];
  try {
    artistsList = JSON.parse(localStorage.getItem('kas_artists') || '[]');
  } catch (e) {}

  const nitishMunshiArtist = {
    id: 1,
    name: 'Nitish Munshi',
    craft: 'Master Sculptor & Chief Idol Artist (প্রধান প্রতিমা শিল্পী)',
    region: 'Nadia & Kumartuli Tradition · Maa Durga Pratima Shilpi',
    era_tag: '2026 Theme Idol',
    avatar_initials: 'NM',
    bio: 'Acclaimed master sculptor and idol artisan Nitish Munshi breathes transcendent spiritual majesty and emotional depth into sacred clay. For Kamalpur Abhijan Sangha\'s historic 2026 Durgotsav under the theme "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Nitish Munshi leads the sculpting of the sanctum\'s divine Maa Durga Mahishasuramardini pratima and sacred forms, weaving classical Shastric clay modeling, sacred Ganga silt, and evocative devotional expression.',
    tradition: 'Sacred Clay Modeling, Shastric Iconography & Chokkhu Daan Artistry',
    accolades: 'Lead Idol Artisan for 2026 Theme',
    creations: '117 Forms Sanctum Idols, Mahishasuramardini, Navadurga Sculptural Iconography',
    philosophy: '"প্রতিমা শুধু মাটির রূপ নয়, মায়ের প্রতি ভক্ত হৃদয়ের নিখাদ ভক্তি আর অনুভবের দৃশ্যমান প্রকাশ। Chokkhu Daan is the supreme moment when clay awakens into divinity, blessing every soul that bows before Her."',
    img_url: 'assets/artist-nitish-munshi-avatar.jpg'
  };

  const sanjitSarkarArtist = {
    id: 101,
    name: 'Sanjit Sarkar',
    craft: 'Master Sculptor & Idol Artisan (প্রতিমা শিল্পী ও মৃৎশিল্পী)',
    region: 'Nadia & Bengal Artisan Guild · Maa Durga Pratima Shilpi',
    era_tag: '2026 Theme Idol',
    avatar_initials: 'SS',
    bio: 'Esteemed master sculptor and idol artisan Sanjit Sarkar is dedicated to the classical art of Bengal clay iconography. For Kamalpur Abhijan Sangha\'s 2026 landmark Durgotsav centering on "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Sanjit Sarkar sculpts sacred representations of the divine mother, combining pure alluvial Ganga clay, anatomical perfection, and spiritual facial ornamentation.',
    tradition: 'Sacred Clay Modeling, Traditional Straw Binding & Divine Visage',
    accolades: 'Lead Idol Artisan for 2026 Theme',
    creations: '117 Forms Sanctum Idols, Mahishasuramardini & Scriptural Iconography',
    philosophy: '"মাটির প্রতিটি ছোঁয়ায় ভক্তি আর নিষ্ঠা মিশে থাকে। মায়ের প্রসন্ন রূপ ফুটিয়ে তোলাই আমাদের পরম সাধনা।"',
    img_url: 'assets/artist-sanjit-sarkar-avatar.jpg'
  };

  const apurbaRayArtist = {
    id: 102,
    name: 'Apurba Ray',
    craft: 'Master Artist & Thematic Sculptor (মন্ডপ ও রূপসজ্জা শিল্পী)',
    region: 'Nadia & Bengal Art Studio · রূপসজ্জা ও থিম শিল্পী',
    era_tag: '2026 Theme Artisan',
    avatar_initials: 'AR',
    bio: 'Master artist Apurba Ray is renowned for his mastery over thematic sacred spatial aesthetics, environmental ornamentation, and classical Bengal artistic craftsmanship. For Kamalpur Abhijan Sangha\'s 2026 landmark celebration of "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ", Sri Apurba Ray orchestrates the atmospheric ornamentation and sanctum artistic installations that elevate the devotee\'s spiritual journey into the ancient cave sanctum of the Adi Shakti.',
    tradition: 'Thematic Space Design, Bengal Clay & Sanctum Artistry',
    accolades: '2026 Theme Master Artisan & Spatial Designer',
    creations: 'Sanctum Ambience & Aesthetic Ornamentation of 117 Durga Forms',
    philosophy: '"শিল্প যেখানে ভক্তির রূপ ধারণ করে, সেখানেই সৃষ্টি সার্থক হয়। মায়ের অপরূপ রূপসজ্জায় আমাদের পরম নিষ্ঠা।"',
    img_url: 'assets/artist-apurba-ray-avatar.jpg'
  };

  const proshantoRoyArtist = {
    id: 103,
    name: 'Proshanto Roy',
    craft: 'Master Artisan & Thematic Sculptor (প্রতিমা ও রূপসজ্জা শিল্পী)',
    region: 'Nadia & Bengal Artisan Guild · থিম ও প্রতিমা শিল্পী',
    era_tag: '2026 Theme Artisan',
    avatar_initials: 'PR',
    bio: 'Dedicated artisan and sculptor Proshanto Roy co-creates the profound sculptural majesty and sacred cave atmosphere for our historic 2026 Durgotsav presentation "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ". Through exquisite clay modeling and thematic detailing, Sri Proshanto Roy manifests the timeless spiritual grace of the divine Mother.',
    tradition: 'Sacred Clay Modeling, Sculptural Detailing & Thematic Artistry',
    accolades: '2026 Theme Master Artisan & Sculptor',
    creations: 'Thematic Sculpture & Sacred Sanctum Forms for 117 Durga Manifestations',
    philosophy: '"শিল্প যেখানে ভক্তির রূপ ধারণ করে, মায়ের আশীর্বাদে সেই সৃষ্টি জীবন্ত হয়ে ওঠে।"',
    img_url: 'assets/artist-proshanto-roy-avatar.jpg'
  };

  const anandaPaulArtist = {
    id: 104,
    name: 'Ananda Paul',
    craft: 'Master Sculptor & Idol Artisan (মৃৎশিল্পী ও প্রতিমা রূপকার)',
    region: 'Nadia & Kumartuli Tradition · মৃৎ ও প্রতিমা শিল্পী',
    era_tag: '2026 Theme Idol',
    avatar_initials: 'AP',
    bio: 'Esteemed master clay sculptor Ananda Paul brings generations of traditional Bengal Kumbhakar mastery to Kamalpur Abhijan Sangha\'s 2026 landmark celebration "গর্ভগুহার অন্তরালে আদিশক্তির অনন্ত রূপ". Sculpting divine Shastric idols from pure sacred silt and straw bindings, Sri Ananda Paul shapes the transcendent expressions of Devi Durga.',
    tradition: 'Sacred Clay Modeling, Straw Binding & Divine Visage',
    accolades: '2026 Theme Master Artisan & Sculptor',
    creations: 'Sacred Durga Pratima & Iconographic Forms for 117 Durga Forms',
    philosophy: '"মাটির অঙ্গে প্রাণ প্রতিষ্ঠা করাই আমাদের বংশপরম্পরার সাধনা। মায়ের স্নেহময়ী ও তেজস্বী রূপ ফুটিয়ে তোলাতেই সার্থকতা।"',
    img_url: 'assets/artist-ananda-paul-avatar.jpg'
  };

  if (Array.isArray(artistsList) && artistsList.length > 0) {
    let updated = false;
    if (!artistsList.some(a => a.name && a.name.toLowerCase().includes('ananda paul'))) {
      const proshantoIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('proshanto roy'));
      const apurbaIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('apurba ray'));
      const sanjitIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('sanjit sarkar'));
      const nitishIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('nitish munshi'));
      let insertIdx = 0;
      if (proshantoIdx !== -1) {
        insertIdx = proshantoIdx + 1;
      } else if (apurbaIdx !== -1) {
        insertIdx = apurbaIdx + 1;
      } else if (sanjitIdx !== -1) {
        insertIdx = sanjitIdx + 1;
      } else if (nitishIdx !== -1) {
        insertIdx = nitishIdx + 1;
      }
      artistsList.splice(insertIdx, 0, anandaPaulArtist);
      updated = true;
    }
    if (!artistsList.some(a => a.name && a.name.toLowerCase().includes('proshanto roy'))) {
      const apurbaIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('apurba ray'));
      const sanjitIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('sanjit sarkar'));
      const nitishIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('nitish munshi'));
      let insertIdx = 0;
      if (apurbaIdx !== -1) {
        insertIdx = apurbaIdx + 1;
      } else if (sanjitIdx !== -1) {
        insertIdx = sanjitIdx + 1;
      } else if (nitishIdx !== -1) {
        insertIdx = nitishIdx + 1;
      }
      artistsList.splice(insertIdx, 0, proshantoRoyArtist);
      updated = true;
    }
    if (!artistsList.some(a => a.name && a.name.toLowerCase().includes('apurba ray'))) {
      const sanjitIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('sanjit sarkar'));
      const nitishIdx = artistsList.findIndex(a => a.name && a.name.toLowerCase().includes('nitish munshi'));
      let insertIdx = 0;
      if (sanjitIdx !== -1) {
        insertIdx = sanjitIdx + 1;
      } else if (nitishIdx !== -1) {
        insertIdx = nitishIdx + 1;
      }
      artistsList.splice(insertIdx, 0, apurbaRayArtist);
      updated = true;
    }
    if (!artistsList.some(a => a.name && a.name.toLowerCase().includes('sanjit sarkar'))) {
      const insertIdx = artistsList.some(a => a.name && a.name.toLowerCase().includes('nitish munshi')) ? 1 : 0;
      artistsList.splice(insertIdx, 0, sanjitSarkarArtist);
      updated = true;
    }
    if (!artistsList.some(a => a.name && a.name.toLowerCase().includes('nitish munshi'))) {
      artistsList.unshift(nitishMunshiArtist);
      updated = true;
    }
    if (updated) {
      localStorage.setItem('kas_artists', JSON.stringify(artistsList));
    }
  }

  if (!artistsList || artistsList.length === 0) {
    if (grid.querySelectorAll('.artist-card').length > 0) return;
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-2); font-size: 15px; font-weight: 500;">No master artisan profiles published yet. Check back soon!</div>';
    return;
  }

  grid.innerHTML = artistsList.map((item, idx) => {
    const initials = item.avatar_initials || (item.name ? item.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'AR');
    const rdClass = `rd${(idx % 3) + 1}`;
    const craftCat = mapArtistCraftCategory(item.craft);
    const artistId = item.id || (idx + 1);
    const savedTributes = parseInt(localStorage.getItem('kas_artist_tributes_' + artistId) || '0', 10);
    const tributeCount = (savedTributes > 0 ? savedTributes : (18 + ((artistId * 7) % 25)));

    return `
      <article class="artist-card reveal visible ${rdClass}" data-craft-cat="${escapeAttr(craftCat)}" data-artist-id="${escapeAttr(artistId)}">
        <div class="artist-header">
          <div class="artist-avatar-wrap">
            ${item.img_url ? `<img src="${escapeAttr(item.img_url)}" alt="${escapeAttr(item.name)}" class="artist-avatar-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">` : ''}
            <span class="artist-avatar-initials" style="${item.img_url ? 'display:none;' : ''}">${escapeHtml(initials)}</span>
            <span class="artist-online-dot" title="Active Master Artist"></span>
          </div>
          <div class="artist-identity">
            <h3 class="artist-name">${escapeHtml(item.name)}</h3>
            <div class="artist-craft">${escapeHtml(item.craft)}</div>
            <div class="artist-region">📍 ${escapeHtml(item.region)}</div>
          </div>
          <span class="artist-era-tag">${escapeHtml(item.era_tag || '2005 – Present')}</span>
        </div>

        <p class="artist-bio">${escapeHtml(item.bio)}</p>

        ${(item.tradition || item.accolades || item.creations) ? `
          <div class="artist-credentials">
            ${item.tradition ? `
              <div class="artist-cred-row">
                <span class="artist-cred-label">Tradition / Medium</span>
                <span class="artist-cred-val">${escapeHtml(item.tradition)}</span>
              </div>
            ` : ''}
            ${item.accolades ? `
              <div class="artist-cred-row">
                <span class="artist-cred-label">Accolades</span>
                <span class="artist-cred-val">${escapeHtml(item.accolades)}</span>
              </div>
            ` : ''}
            ${item.creations ? `
              <div class="artist-cred-row">
                <span class="artist-cred-label">Creations</span>
                <span class="artist-cred-val">${escapeHtml(item.creations)}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${item.philosophy ? `
          <div class="artist-creations-box">
            <div class="acb-title">Artistic Vision & Philosophy</div>
            <div class="acb-items">
              <em>${escapeHtml(item.philosophy)}</em>
            </div>
          </div>
        ` : ''}

        <div class="artist-card-footer">
          <button type="button" class="artist-tribute-btn" onclick="sendArtistTribute(this, '${escapeAttr(item.name)}', ${artistId})">
            <span>🙏 Pay Pranām</span>
            <span class="tribute-pill" data-counter="${tributeCount}">${tributeCount}</span>
          </button>
          <span class="artist-verified-seal">✓ Master Artisan</span>
        </div>
      </article>
    `;
  }).join('');
}

function filterArtists(category, btn) {
  const buttons = document.querySelectorAll('.artist-filter-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('#publicArtistsGrid .artist-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-craft-cat') || 'all';
    if (category === 'all' || cardCat === category || cardCat === 'all') {
      card.style.display = '';
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = 'artistCardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

function sendArtistTribute(btn, artistName, id) {
  if (!btn) return;
  const pill = btn.querySelector('.tribute-pill');
  let current = parseInt(pill ? (pill.getAttribute('data-counter') || pill.textContent || '0') : '0', 10);
  current += 1;
  if (pill) {
    pill.setAttribute('data-counter', current);
    pill.textContent = current;
  }

  if (id) {
    try {
      localStorage.setItem('kas_artist_tributes_' + id, current);
    } catch (e) {}
  }

  const rect = btn.getBoundingClientRect();
  const emojis = ['🌸', '🪔', '✨', '🙏', '🌺', '🕉️'];
  for (let i = 0; i < 4; i++) {
    const particle = document.createElement('span');
    particle.className = 'tribute-particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = (rect.left + rect.width / 2 + (Math.random() * 40 - 20)) + 'px';
    particle.style.top = (rect.top + (Math.random() * 20 - 10)) + 'px';
    particle.style.animationDelay = (i * 0.1) + 's';
    document.body.appendChild(particle);
    setTimeout(() => { particle.remove(); }, 1400);
  }

  showStoryToast('🙏 Paid Pranām to ' + (artistName || 'Master Artist'));
}

function scrollToStoryEpoch(targetId, btn) {
  if (btn) {
    const allBtns = document.querySelectorAll('.epoch-pill-btn');
    allBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const target = document.getElementById(targetId);
  if (target) {
    const navHeight = 90;
    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
    window.scrollTo({
      top: targetPos,
      behavior: 'smooth'
    });
  }
}

function showStoryToast(msg) {
  let toast = document.getElementById('kasGlobalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'kasGlobalToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(26, 18, 11, 0.95);
      color: #FDE68A;
      border: 1px solid rgba(245, 158, 11, 0.45);
      border-radius: 999px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.02em;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.25);
      backdrop-filter: blur(12px);
      z-index: 10000;
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 2800);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

window.addEventListener('storage', (e) => {
  if (e.key === 'kas_gallery' || e.key === 'kas_gallery_updated') initPublicGallery();
  if (e.key === 'kas_artists' || e.key === 'kas_artists_updated') initPublicArtists();
});

window.initPublicGallery = initPublicGallery;
window.initPublicArtists = initPublicArtists;
window.filterArtists = filterArtists;
window.sendArtistTribute = sendArtistTribute;
window.scrollToStoryEpoch = scrollToStoryEpoch;
window.showStoryToast = showStoryToast;
window.mapArtistCraftCategory = mapArtistCraftCategory;



