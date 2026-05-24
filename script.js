// script.js
// Global State Management
const AppState = {
  currentUser: null,
  savedProducts: JSON.parse(localStorage.getItem('oyinx_savedProducts')) || [],
  analysisHistory: JSON.parse(localStorage.getItem('oyinx_analysisHistory')) || [],
  currentAnalysis: null,
  userAllergies: [],
  adminStats: {
    totalUsers: parseInt(localStorage.getItem('oyinx_totalUsers')) || 0,
    totalAnalyses: parseInt(localStorage.getItem('oyinx_totalAnalyses')) || 0,
    totalProducts: parseInt(localStorage.getItem('oyinx_totalProducts')) || 0
  }
};

// ============================================================
//  AI CONFIGURATION
//  Change API_URL to your backend proxy endpoint.
//  NEVER put your Anthropic API key directly here.
//  See ai-integration-guide.js for how to set up the proxy.
// ============================================================
const AI_CONFIG = {
  API_URL: '/api/analyze',   // <-- change to your proxy URL when ready
  USE_REAL_AI: false         // <-- set to true once your proxy is live
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) loadingScreen.classList.add('hidden');
  }, 2000);

  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  const savedUser = localStorage.getItem('oyinx_currentUser');
  if (savedUser) {
    AppState.currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  }

  initHeroSlider();
  initScrollEffects();
  initCounters();
  initUploadZone();
  initFormSelectors();
  initFilters();
  initParticles();
  initDigitalResources();
  updateSavedCount();
  initAllergySystem();
}

// Hero Slider
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 6000);
}

// Scroll Effects
function initScrollEffects() {
  const header = document.getElementById('header');
  const fabSecondary = document.querySelector('.fab-secondary');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('header-scrolled');
      fabSecondary?.classList.add('visible');
    } else {
      header?.classList.remove('header-scrolled');
      fabSecondary?.classList.remove('visible');
    }
    updateActiveNav();
  });
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + section.clientHeight) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

// Animated Counters
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 20);
}

// Particles
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const particleCount = isMobile ? 10 : 30;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: rgba(194,24,91,${Math.random() * 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
      animation-delay: ${Math.random() * 5}s;
      pointer-events: none;
    `;
    container.appendChild(particle);
  }
}

// Authentication
function openAuth(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
    switchAuthTab(tab);
  }
}

function closeAuth() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('active');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  event.target.classList.add('active');
  const targetForm = document.getElementById(`${tab}Form`);
  if (targetForm) targetForm.classList.add('active');
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = event.currentTarget.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

function checkPasswordStrength(password) {
  const strength = document.getElementById('passwordStrength');
  if (!strength) return;
  let score = 0;
  if (password.length > 6) score++;
  if (password.length > 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  strength.className = 'password-strength';
  if (score < 2) strength.classList.add('weak');
  else if (score < 4) strength.classList.add('medium');
  else strength.classList.add('strong');
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail')?.value;
  if (!email) return;
  AppState.currentUser = {
    email,
    firstName: email.split('@')[0],
    lastName: '',
    avatar: null,
    joinDate: new Date().toISOString(),
    analyses: 0,
    savedProducts: []
  };
  updateAdminStats('users');
  localStorage.setItem('oyinx_currentUser', JSON.stringify(AppState.currentUser));
  updateUIForLoggedInUser();
  closeAuth();
  showToast('Welcome Back!', `Signed in as ${email}`, 'success');
}

function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('regFirstName')?.value;
  const lastName  = document.getElementById('regLastName')?.value;
  const email     = document.getElementById('regEmail')?.value;
  if (!email || !firstName) return;
  AppState.currentUser = {
    email, firstName, lastName: lastName || '',
    avatar: null,
    joinDate: new Date().toISOString(),
    analyses: 0,
    savedProducts: []
  };
  updateAdminStats('users');
  localStorage.setItem('oyinx_currentUser', JSON.stringify(AppState.currentUser));
  updateUIForLoggedInUser();
  closeAuth();
  showToast('Account Created!', `Welcome to OYINX, ${firstName}`, 'success');
}

function socialLogin(provider) {
  showToast('Coming Soon', `${provider} login will be available shortly`, 'info');
}

function updateUIForLoggedInUser() {
  const user = AppState.currentUser;
  if (!user) return;
  const userBtn    = document.getElementById('userBtn');
  const userInitials = document.getElementById('userInitials');
  const userName   = document.getElementById('userName');
  const userEmail  = document.getElementById('userEmail');
  const heroCta    = document.getElementById('heroCtaBtn');
  const initials   = `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`;
  if (userBtn) {
    userBtn.innerHTML = `
      <div style="width:32px;height:32px;background:linear-gradient(135deg,var(--primary-color),var(--primary-dark));border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;">${initials}</div>
      <span class="desktop-only">${user.firstName}</span>
    `;
    userBtn.classList.add('logged-in');
    userBtn.onclick = toggleUserMenu;
  }
  if (userInitials) userInitials.textContent = initials;
  if (userName)    userName.textContent  = `${user.firstName} ${user.lastName}`;
  if (userEmail)   userEmail.textContent = user.email;
  if (heroCta) {
    heroCta.innerHTML = '<span>My Beauty Profile</span><i class="fas fa-user"></i>';
    heroCta.onclick = showProfile;
  }
}

function toggleUserMenu() {
  document.getElementById('userMenu')?.classList.toggle('active');
}

function logout() {
  AppState.currentUser = null;
  localStorage.removeItem('oyinx_currentUser');
  location.reload();
}

function showProfile() {
  if (!AppState.currentUser) { openAuth('login'); return; }
  showToast('Profile', 'Profile page coming soon!', 'info');
  document.getElementById('userMenu')?.classList.remove('active');
}

function showHistory() {
  showToast('History', `You have ${AppState.analysisHistory.length} saved analyses`, 'info');
  document.getElementById('userMenu')?.classList.remove('active');
}

function showSaved() {
  showToast('Saved Products', `You have ${AppState.savedProducts.length} saved products`, 'info');
  document.getElementById('userMenu')?.classList.remove('active');
}

function showSettings() {
  showToast('Settings', 'Settings page coming soon!', 'info');
  document.getElementById('userMenu')?.classList.remove('active');
}

// Upload Zone
function initUploadZone() {
  const zone  = document.getElementById('uploadZone');
  const input = document.getElementById('photoUpload');
  if (!zone || !input) return;
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.style.borderColor = 'var(--primary-color)';
    zone.style.background  = 'var(--primary-light)';
  });
  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = '';
    zone.style.background  = '';
  });
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Error', 'Please upload an image file', 'error'); return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast('Error', 'File size must be less than 10MB', 'error'); return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview          = document.getElementById('preview');
    const placeholder      = document.getElementById('uploadPlaceholder');
    const previewContainer = document.getElementById('uploadPreview');
    if (preview)          preview.src      = e.target.result;
    if (placeholder)      placeholder.hidden     = true;
    if (previewContainer) previewContainer.hidden = false;
    showToast('Success', 'Photo uploaded successfully!', 'success');
    updateStep(1);
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  const placeholder = document.getElementById('uploadPlaceholder');
  const preview     = document.getElementById('uploadPreview');
  const input       = document.getElementById('photoUpload');
  if (placeholder) placeholder.hidden = false;
  if (preview)     preview.hidden     = true;
  if (input)       input.value        = '';
}

function enhancePhoto() {
  showToast('AI Enhancement', 'Improving photo quality for better analysis...', 'info');
  setTimeout(() => showToast('Complete', 'Photo enhanced!', 'success'), 1500);
}

// Form Selectors
function initFormSelectors() {
  document.querySelectorAll('.tone-option').forEach(option => {
    option.addEventListener('click', function () {
      document.querySelectorAll('.tone-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      const input = document.getElementById('skinTone');
      if (input) input.value = this.dataset.value;
    });
  });
  document.querySelectorAll('.undertone-card').forEach(card => {
    card.addEventListener('click', function () {
      document.querySelectorAll('.undertone-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      const input = document.getElementById('undertone');
      if (input) input.value = this.dataset.value;
    });
  });
  const allergyCheckbox = document.getElementById('hasAllergies');
  if (allergyCheckbox) {
    allergyCheckbox.addEventListener('change', function () {
      const input = document.getElementById('allergyInput');
      if (input) input.style.display = this.checked ? 'block' : 'none';
    });
  }
}

// Allergy System
function initAllergySystem() {
  const allergyInput = document.getElementById('allergyList');
  if (allergyInput) {
    allergyInput.addEventListener('change', function () {
      AppState.userAllergies = this.value.split(',').map(a => a.trim().toLowerCase()).filter(a => a);
    });
  }
}

function checkProductSafety(product) {
  if (AppState.userAllergies.length === 0) return { safe: true, warnings: [] };
  const warnings = [];
  const ingredients = product.ingredients.map(i => i.toLowerCase());
  AppState.userAllergies.forEach(allergy => {
    if (ingredients.some(ing => ing.includes(allergy))) warnings.push(`Contains ${allergy}`);
  });
  return { safe: warnings.length === 0, warnings };
}

// Step Management
function updateStep(step) {
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('completed', 'active');
    if (i < step)      s.classList.add('completed');
    else if (i === step) s.classList.add('active');
  });
  document.querySelectorAll('.step-line').forEach((l, i) => {
    l.classList.toggle('active', i < step);
  });
}

// ============================================================
//  AI ANALYSIS — Main entry point
// ============================================================
async function analyzeBeauty() {
  const skinTone    = document.getElementById('skinTone')?.value;
  const undertone   = document.getElementById('undertone')?.value;
  const faceShape   = document.getElementById('faceShape')?.value;
  const skinConcern = document.getElementById('skinConcern')?.value;
  const previewEl   = document.getElementById('preview');
  const preview     = previewEl?.src;

  if (!preview || preview === '' || preview === window.location.href) {
    showToast('Error', 'Please upload a photo first', 'error'); return;
  }
  if (!skinTone || !undertone) {
    showToast('Error', 'Please select skin tone and undertone', 'error'); return;
  }

  const btn = document.getElementById('analyzeBtn');
  if (btn) {
    btn.disabled = true;
    btn.querySelector('.btn-text').hidden  = true;
    btn.querySelector('.btn-loader').hidden = false;
  }

  updateStep(2);

  try {
    let analysis = null;

    if (AI_CONFIG.USE_REAL_AI) {
      // ── REAL AI PATH ──────────────────────────────────────
      const base64Image = getBase64FromDataUrl(preview);
      const mimeType    = getMimeTypeFromDataUrl(preview);
      updateStep(3);
      analysis = await callAIAnalysis({ base64Image, mimeType, skinTone, undertone, faceShape, skinConcern, allergies: AppState.userAllergies });
    } else {
      // ── DEMO PATH (no API key yet) ─────────────────────────
      // Simulates a 3-second AI call, then uses built-in logic
      await new Promise(r => setTimeout(r, 1500));
      updateStep(3);
      await new Promise(r => setTimeout(r, 1500));
      analysis = buildDemoAnalysis(skinTone, undertone, faceShape, skinConcern);
    }

    // Generate the "after" canvas overlay image
    const afterDataUrl = await generateAfterImage(preview, analysis);

    // Render everything into the UI
    renderAIResults(analysis, preview, afterDataUrl, skinTone, undertone, faceShape, skinConcern);

    updateStep(4);

    const recSection = document.getElementById('recommendationsSection');
    if (recSection) {
      recSection.classList.add('active');
      recSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updateAdminStats('analyses');
    showToast('Analysis Complete', 'Your personalized beauty profile is ready!', 'success');

  } catch (err) {
    console.error('AI Analysis failed:', err);
    showToast('Error', 'Analysis failed. Please try again.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.querySelector('.btn-text').hidden  = false;
      btn.querySelector('.btn-loader').hidden = true;
    }
  }
}

// ── Helper: extract base64 data from a data: URL ──
function getBase64FromDataUrl(dataUrl) {
  return dataUrl.split(',')[1];
}

// ── Helper: extract MIME type from a data: URL ──
function getMimeTypeFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:(image\/\w+);base64,/);
  return match ? match[1] : 'image/jpeg';
}

// ── Real AI call via backend proxy ──────────────────────────
async function callAIAnalysis({ base64Image, mimeType, skinTone, undertone, faceShape, skinConcern, allergies }) {
  const allergyText = allergies.length > 0
    ? `The user has these allergies: ${allergies.join(', ')}. Flag any recommended products that contain these.`
    : 'No known allergies.';

  const prompt = `You are OYINX, an expert AI beauty analyst combining dermatology, color theory, and makeup artistry.

Analyze this facial photo and the user's stated characteristics:
- Skin tone: ${skinTone}
- Undertone: ${undertone}
- Face shape: ${faceShape || 'auto-detect from photo'}
- Primary concern: ${skinConcern || 'general enhancement'}
- ${allergyText}

Respond ONLY with a JSON object, no markdown, no explanation. Use this exact structure:
{
  "skinProfile": {
    "tone": "detected tone name",
    "undertone": "confirmed or corrected undertone",
    "texture": "smooth/combination/oily/dry/sensitive",
    "evenness": "even/slightly uneven/uneven",
    "description": "2 sentence expert description",
    "characteristics": "specific features observed"
  },
  "faceAnalysis": {
    "shape": "oval/round/square/heart/diamond/long",
    "dominantFeatures": ["feature1", "feature2", "feature3"],
    "symmetry": "high/medium/asymmetric",
    "contourAdvice": "specific contouring advice for this face shape"
  },
  "colorScience": {
    "season": "Spring/Summer/Autumn/Winter",
    "palette": [
      { "hex": "#F5C6D0", "name": "Soft Rose", "use": "blush" },
      { "hex": "#8B4A6B", "name": "Plum Berry", "use": "eyeshadow" },
      { "hex": "#C17B50", "name": "Warm Nude", "use": "lip" },
      { "hex": "#E8B89A", "name": "Peach Glow", "use": "highlight" },
      { "hex": "#6B3A5A", "name": "Deep Berry", "use": "liner" },
      { "hex": "#F0DDD0", "name": "Vanilla", "use": "base" }
    ],
    "foundationUndertone": "warm/cool/neutral"
  },
  "makeupGuide": {
    "foundation": "shade and finish recommendation",
    "concealer": "coverage and color correction",
    "blush": "placement and color",
    "eyeshadow": "look recommendation",
    "lips": "color and finish"
  },
  "makeupOverlay": {
    "blushLeft":       { "x": 22, "y": 48, "width": 18, "color": "#FFB6C1", "opacity": 0.30 },
    "blushRight":      { "x": 78, "y": 48, "width": 18, "color": "#FFB6C1", "opacity": 0.30 },
    "highlightNose":   { "x": 50, "y": 32, "width": 8,  "color": "#FFFDE7", "opacity": 0.38 },
    "highlightBrow":   { "x": 50, "y": 22, "width": 14, "color": "#FFFDE7", "opacity": 0.28 },
    "contourLeft":     { "x": 12, "y": 45, "width": 12, "color": "#8B6B55", "opacity": 0.20 },
    "contourRight":    { "x": 88, "y": 45, "width": 12, "color": "#8B6B55", "opacity": 0.20 },
    "lipColor":        { "x": 50, "y": 68, "width": 20, "color": "#C17B50", "opacity": 0.45 }
  }
}`;

  const requestBody = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Image } },
        { type: 'text', text: prompt }
      ]
    }]
  };

  const response = await fetch(AI_CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data = await response.json();
  const rawText = data.content[0].text;
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

// ── Demo analysis (used when USE_REAL_AI is false) ─────────
function buildDemoAnalysis(skin, undertone, face, concern) {
  const palettes = {
    cool:    ['#E6E6FA','#DDA0DD','#FFB6C1','#87CEEB','#D8BFD8','#B0E0E6'],
    warm:    ['#FFD700','#FFA500','#FF6347','#DAA520','#F4A460','#FF8C00'],
    neutral: ['#F5F5DC','#D2B48C','#C0C0C0','#D3D3D3','#E5E5E5','#F0F0F0']
  };
  const colors = palettes[undertone] || palettes.neutral;
  const paletteNames = ['Base','Blush','Eye','Lip','Liner','Highlight'];
  const paletteUses  = ['base','blush','eyeshadow','lip','liner','highlight'];

  const skinDescs = {
    fair:   { description: 'Fair porcelain skin with delicate texture. Cool or neutral undertones with high sensitivity to sun.', characteristics: 'May have visible redness, freckles, or blue veins at wrist.' },
    light:  { description: 'Light skin with a smooth, even texture. Versatile undertone range that adapts well to many shades.', characteristics: 'Tans gradually, rarely burns, with a naturally luminous quality.' },
    medium: { description: 'Medium skin with warm golden undertones and a naturally radiant quality.', characteristics: 'Olive-to-golden hue, tans easily, very versatile for bold makeup.' },
    tan:    { description: 'Rich tan skin with warm undertones and a beautiful depth.', characteristics: 'Golden to caramel tones, rarely burns, vibrant and warm.' },
    dark:   { description: 'Deep dark skin with rich warm undertones and excellent melanin protection.', characteristics: 'Rich golden warmth, prone to hyperpigmentation if irritated.' },
    deep:   { description: 'Rich deep skin with intense undertones and exceptional natural beauty.', characteristics: 'High melanin content, may lean cool or warm, benefits from moisture.' }
  };

  const faceGuides = {
    oval:    'Balanced proportions — most makeup styles work beautifully. Soft contouring at temples enhances symmetry.',
    round:   'Define cheekbones with angled blush and contour below them. Elongate with a highlight down the nose bridge.',
    square:  'Soften the jawline with circular blush and contour corners. Highlight center forehead and chin for balance.',
    heart:   'Balance a wider forehead with contoured temples and a highlighted chin. Blush on apple of cheeks.',
    diamond: 'Highlight cheekbones — your best feature. Contour narrow forehead and chin to add width.',
    long:    'Create width with horizontal blush across cheeks. Contour forehead and chin to visually shorten the face.'
  };

  return {
    skinProfile: {
      tone: skin,
      undertone: undertone,
      texture: 'combination',
      evenness: 'slightly uneven',
      ...(skinDescs[skin] || skinDescs.medium)
    },
    faceAnalysis: {
      shape: face || 'oval',
      dominantFeatures: ['Eyes', 'Cheekbones', 'Jawline', 'Forehead', 'Lips'],
      symmetry: 'high',
      contourAdvice: faceGuides[face] || faceGuides.oval
    },
    colorScience: {
      season: undertone === 'cool' ? 'Summer' : undertone === 'warm' ? 'Autumn' : 'Spring',
      palette: colors.map((hex, i) => ({ hex, name: paletteNames[i], use: paletteUses[i] })),
      foundationUndertone: undertone
    },
    makeupGuide: {
      foundation: `${skin.charAt(0).toUpperCase() + skin.slice(1)} shade with ${undertone} finish`,
      concealer: 'One shade lighter, medium buildable coverage',
      blush: `${undertone === 'cool' ? 'Rose-pink' : 'Peachy coral'} on the apples of the cheeks`,
      eyeshadow: `${undertone === 'cool' ? 'Mauve and taupe' : 'Bronze and copper'} palette for depth`,
      lips: `${undertone === 'cool' ? 'Berry or mauve' : 'Warm nude or terracotta'} for harmony`
    },
    makeupOverlay: {
      blushLeft:     { x: 22, y: 48, width: 18, color: undertone === 'cool' ? '#FFB6C1' : '#FFAD8A', opacity: 0.30 },
      blushRight:    { x: 78, y: 48, width: 18, color: undertone === 'cool' ? '#FFB6C1' : '#FFAD8A', opacity: 0.30 },
      highlightNose: { x: 50, y: 32, width: 8,  color: '#FFFDE7', opacity: 0.38 },
      highlightBrow: { x: 50, y: 22, width: 14, color: '#FFFDE7', opacity: 0.28 },
      contourLeft:   { x: 12, y: 45, width: 12, color: '#8B6B55', opacity: 0.20 },
      contourRight:  { x: 88, y: 45, width: 12, color: '#8B6B55', opacity: 0.20 },
      lipColor:      { x: 50, y: 68, width: 20, color: undertone === 'cool' ? '#B06080' : '#C17B50', opacity: 0.45 }
    }
  };
}

// ── Generate the "After" image using Canvas overlays ────────
async function generateAfterImage(originalDataUrl, analysis) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas  = document.createElement('canvas');
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx     = canvas.getContext('2d');

      // Draw original
      ctx.drawImage(img, 0, 0);

      const overlay = analysis.makeupOverlay;
      if (overlay) {
        const drawPatch = (placement, blurPx) => {
          if (!placement) return;
          const cx = (placement.x / 100) * canvas.width;
          const cy = (placement.y / 100) * canvas.height;
          const rx = (placement.width / 100) * canvas.width;
          const ry = rx * 0.55;

          ctx.save();
          ctx.filter       = `blur(${blurPx}px)`;
          ctx.globalAlpha  = placement.opacity || 0.3;
          ctx.fillStyle    = placement.color;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        };

        drawPatch(overlay.blushLeft,     30);
        drawPatch(overlay.blushRight,    30);
        drawPatch(overlay.highlightNose, 18);
        drawPatch(overlay.highlightBrow, 22);
        drawPatch(overlay.contourLeft,   28);
        drawPatch(overlay.contourRight,  28);
        drawPatch(overlay.lipColor,       7);
      }

      // Subtle warm-tone final pass (beauty filter feel)
      ctx.save();
      ctx.globalCompositeOperation = 'soft-light';
      ctx.globalAlpha = 0.06;
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.4, canvas.width * 0.6
      );
      grad.addColorStop(0,   'rgba(255,200,180,1)');
      grad.addColorStop(1,   'rgba(255,200,180,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Watermark
      ctx.save();
      ctx.globalAlpha  = 0.55;
      ctx.font         = `${Math.max(12, canvas.width * 0.022)}px sans-serif`;
      ctx.fillStyle    = '#ffffff';
      ctx.textAlign    = 'right';
      ctx.shadowColor  = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur   = 6;
      ctx.fillText('OYINX Enhanced Guide', canvas.width - 14, canvas.height - 14);
      ctx.restore();

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.crossOrigin = 'anonymous';
    img.src = originalDataUrl;
  });
}

// ── Render all AI results into the UI ───────────────────────
function renderAIResults(analysis, beforeDataUrl, afterDataUrl, skin, undertone, face, concern) {
  // Before / After images
  const beforeImage = document.getElementById('beforeImage');
  const afterImage  = document.getElementById('afterImage');
  if (beforeImage) beforeImage.src = beforeDataUrl;
  if (afterImage) {
    afterImage.style.opacity = '0';
    afterImage.src = afterDataUrl;
    afterImage.onload = () => { afterImage.style.opacity = '1'; };
  }

  // Face mesh
  document.getElementById('faceMesh')?.classList.add('active');

  // Feature markers
  const markersContainer = document.getElementById('featureMarkers');
  if (markersContainer) {
    const features  = (analysis.faceAnalysis?.dominantFeatures || ['Eyes','Cheekbones','Jawline','Forehead','Lips']).slice(0, 5);
    const positions = [
      { top: '28%', left: '34%' },
      { top: '28%', left: '63%' },
      { top: '22%', left: '49%' },
      { top: '44%', left: '28%' },
      { top: '63%', left: '49%' }
    ];
    markersContainer.innerHTML = features.map((f, i) => `
      <div class="feature-marker"
           style="top:${positions[i]?.top || '50%'};left:${positions[i]?.left || '50%'};"
           data-label="${f}"></div>
    `).join('');
  }

  // Skin profile card
  const skinProfileText = document.getElementById('skinProfileText');
  if (skinProfileText && analysis.skinProfile) {
    const sp = analysis.skinProfile;
    skinProfileText.innerHTML = `
      <strong>${sp.description}</strong><br>
      <small style="color:var(--text-light)">${sp.characteristics}</small>
    `;
  }

  // Profile badges
  const profileBadges = document.getElementById('profileBadges');
  if (profileBadges) {
    [
      analysis.skinProfile?.tone,
      analysis.skinProfile?.undertone,
      analysis.faceAnalysis?.shape,
      analysis.skinProfile?.texture,
      concern
    ].filter(Boolean).forEach(b => {
      const span = document.createElement('span');
      span.className   = 'profile-badge';
      span.textContent = b;
      profileBadges.appendChild(span);
    });
  }

  // Color palette
  const seasonPalette = document.getElementById('seasonPalette');
  if (seasonPalette && analysis.colorScience?.palette) {
    seasonPalette.innerHTML = analysis.colorScience.palette.map(c => `
      <div class="season-color" style="background:${c.hex}" data-name="${c.name} (${c.use})"></div>
    `).join('');
  }

  // Face geometry
  const faceGeometryText = document.getElementById('faceGeometryText');
  if (faceGeometryText && analysis.faceAnalysis) {
    faceGeometryText.textContent = analysis.faceAnalysis.contourAdvice;
  }

  // Save to state
  AppState.currentAnalysis = {
    date: new Date().toISOString(),
    skinTone: skin, undertone, faceShape: face, concern,
    aiAnalysis: analysis
  };

  // Product recommendations + timeline
  generateProductRecommendations(
    analysis.skinProfile?.tone || skin,
    analysis.colorScience?.foundationUndertone || undertone,
    concern
  );
  generateTimeline(analysis.faceAnalysis?.shape || face, concern);
}

// Product Recommendations (original logic, unchanged)
function generateProductRecommendations(skin, undertone, concern) {
  const products = [
    {
      id: 1, name: "Pro Filt'r Soft Matte Foundation", brand: 'Fenty Beauty',
      category: 'foundation', match: 98,
      image: 'https://images.unsplash.com/photo-1631730486784-5b10a140ed5f?w=600',
      description: 'Longwear foundation with climate-adaptive technology',
      ingredients: ['Hyaluronic Acid','Grape Seed Oil','Dimethicone'],
      allergens: ['silicone'], skinTypes: ['oily','combination','normal'],
      concerns: ['oiliness','acne'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Amazon',  url: 'https://www.amazon.com',  icon: 'fa-amazon' }
      ]
    },
    {
      id: 2, name: 'Radiant Creamy Concealer', brand: 'NARS',
      category: 'concealer', match: 95,
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600',
      description: 'Multi-purpose concealer for buildable coverage',
      ingredients: ['Vitamin E','Grapefruit Extract','Bisabolol'],
      allergens: [], skinTypes: ['all'], concerns: ['darkspots','aging'],
      retailers: [
        { name: 'Ulta',   url: 'https://www.ulta.com',   icon: 'fa-store' },
        { name: 'Amazon', url: 'https://www.amazon.com', icon: 'fa-amazon' }
      ]
    },
    {
      id: 3, name: 'Orgasm Blush', brand: 'NARS',
      category: 'blush', match: 92,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
      description: 'Peachy-pink blush with golden shimmer',
      ingredients: ['Vitamin E','Rosehip Oil','Mica'],
      allergens: [], skinTypes: ['all'], concerns: ['aging'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Amazon',  url: 'https://www.amazon.com',  icon: 'fa-amazon' }
      ]
    },
    {
      id: 4, name: 'Modern Renaissance Palette', brand: 'Anastasia',
      category: 'eyeshadow', match: 94,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
      description: 'Neutral and berry tones for versatile looks',
      ingredients: ['Kaolin','Vitamin E','Talc'],
      allergens: ['talc'], skinTypes: ['all'], concerns: ['all'],
      retailers: [
        { name: 'Ulta',   url: 'https://www.ulta.com',   icon: 'fa-store' },
        { name: 'Amazon', url: 'https://www.amazon.com', icon: 'fa-amazon' }
      ]
    },
    {
      id: 5, name: 'Matte Revolution Lipstick', brand: 'Charlotte Tilbury',
      category: 'lipstick', match: 96,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
      description: 'Hydrating matte formula with 3D glow pigments',
      ingredients: ['Orchid Extract','Triglycerides','Peppermint Oil'],
      allergens: ['fragrance'], skinTypes: ['all'], concerns: ['aging','dryness'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Amazon',  url: 'https://www.amazon.com',  icon: 'fa-amazon' }
      ]
    },
    {
      id: 6, name: 'C-Firma Fresh Day Serum', brand: 'Drunk Elephant',
      category: 'skincare', match: 97,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
      description: 'Potent vitamin C serum for brightening',
      ingredients: ['Vitamin C','Ferulic Acid','Vitamin E','Pumpkin Ferment'],
      allergens: [], skinTypes: ['all'], concerns: ['brightening','aging','darkspots'],
      retailers: [
        { name: 'Sephora',   url: 'https://www.sephora.com',   icon: 'fa-shopping-bag' },
        { name: 'Dermstore', url: 'https://www.dermstore.com', icon: 'fa-sparkles' }
      ]
    },
    {
      id: 7, name: 'Ultra Repair Cream', brand: 'First Aid Beauty',
      category: 'skincare', match: 99,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
      description: 'Intense hydration for dry, distressed skin',
      ingredients: ['Colloidal Oatmeal','Shea Butter','Allantoin'],
      allergens: ['nuts'], skinTypes: ['dry','sensitive'], concerns: ['dryness','sensitivity'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Ulta',    url: 'https://www.ulta.com',    icon: 'fa-store' }
      ]
    },
    {
      id: 8, name: 'Salicylic Acid 2% Solution', brand: 'The Ordinary',
      category: 'skincare', match: 93,
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600',
      description: 'BHA exfoliant for blemish-prone skin',
      ingredients: ['Salicylic Acid','Hamamelis Virginiana Water'],
      allergens: [], skinTypes: ['oily','combination','acne-prone'], concerns: ['acne','oiliness'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Ulta',    url: 'https://www.ulta.com',    icon: 'fa-store' }
      ]
    }
  ];

  const filteredProducts = products.map(product => {
    const safety = checkProductSafety(product);
    let matchScore = product.match;
    if (concern && product.concerns.includes(concern)) matchScore += 2;
    if (!safety.safe) matchScore = Math.max(0, matchScore - 20);
    return { ...product, safety, adjustedMatch: Math.min(100, matchScore) };
  }).sort((a, b) => b.adjustedMatch - a.adjustedMatch);

  const container = document.getElementById('productResults');
  if (!container) return;

  container.innerHTML = filteredProducts.map(product => {
    const isSavedProduct = AppState.savedProducts.includes(product.id);
    const allergyWarning = !product.safety.safe
      ? `<div class="allergy-warning"><i class="fas fa-exclamation-triangle"></i> Contains allergens</div>` : '';
    return `
    <div class="product-recommendation" data-category="${product.category}" data-safe="${product.safety.safe}">
      <div class="product-rec-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="match-badge"><i class="fas fa-check-circle"></i> ${product.adjustedMatch}% Match</div>
        ${allergyWarning}
        <button class="save-product ${isSavedProduct ? 'saved' : ''}" onclick="toggleSaveProduct(${product.id})" aria-label="Save product">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-rec-info">
        <div class="product-rec-brand">${product.brand}</div>
        <h4 class="product-rec-name">${product.name}</h4>
        <p class="product-rec-description">${product.description}</p>
        <div class="product-rec-meta">
          ${product.ingredients.slice(0,3).map(i => `<span class="meta-tag">${i}</span>`).join('')}
          ${product.safety.safe ? '<span class="meta-tag allergy-free"><i class="fas fa-check"></i> Allergy Safe</span>' : ''}
        </div>
        <div class="retailer-links">
          ${product.retailers.map((r, i) => `
            <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="retailer-link ${i === 0 ? 'primary' : ''}">
              <i class="fab ${r.icon}"></i> ${r.name}
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `}).join('');
}

function generateTimeline(face, concern) {
  const steps = [
    { icon: 'fa-pump-soap',   title: 'Prep',       desc: `Cleanse & moisturize for ${concern || 'your skin type'}` },
    { icon: 'fa-spray-can',   title: 'Prime',       desc: 'Extend makeup wear all day' },
    { icon: 'fa-circle',      title: 'Foundation',  desc: 'Match your undertone perfectly' },
    { icon: 'fa-eye',         title: 'Conceal',     desc: `Targeted coverage for ${concern || 'blemishes'}` },
    { icon: 'fa-sun',         title: 'Contour',     desc: face ? `${face} face technique` : 'Define features' },
    { icon: 'fa-heart',       title: 'Color',       desc: 'Blush & highlight placement' },
    { icon: 'fa-eye',         title: 'Eyes',        desc: 'Shadow & liner for your shape' },
    { icon: 'fa-smile',       title: 'Lips',        desc: 'Define & color' }
  ];

  const timeline = document.getElementById('masterclassTimeline');
  if (timeline) {
    timeline.innerHTML = steps.map((step, i) => `
      <div class="timeline-step">
        <div class="step-number">${i + 1}</div>
        <div class="timeline-content">
          <h5>${step.title}</h5>
          <p>${step.desc}</p>
        </div>
      </div>
    `).join('');
  }
}

function toggleSaveProduct(productId) {
  if (!AppState.currentUser) { openAuth('login'); return; }
  const index = AppState.savedProducts.indexOf(productId);
  if (index > -1) {
    AppState.savedProducts.splice(index, 1);
    showToast('Removed', 'Product removed from saved', 'info');
  } else {
    AppState.savedProducts.push(productId);
    showToast('Saved', 'Product added to your collection', 'success');
    updateAdminStats('products');
  }
  localStorage.setItem('oyinx_savedProducts', JSON.stringify(AppState.savedProducts));
  updateSavedCount();
  const btn = event.currentTarget;
  if (btn) btn.classList.toggle('saved');
}

function updateSavedCount() {
  document.querySelectorAll('.saved-count').forEach(badge => {
    badge.textContent = AppState.savedProducts.length;
  });
}

function saveAnalysis() {
  if (!AppState.currentUser) { openAuth('login'); return; }
  if (AppState.currentAnalysis) {
    AppState.analysisHistory.push(AppState.currentAnalysis);
    localStorage.setItem('oyinx_analysisHistory', JSON.stringify(AppState.analysisHistory));
    showToast('Saved', 'Analysis saved to your profile', 'success');
  }
}

function shareAnalysis() {
  if (navigator.share) {
    navigator.share({ title: 'My OYINX Beauty Analysis', text: 'Check out my personalized beauty profile!', url: window.location.href })
      .catch(() => showToast('Share', 'Link copied to clipboard!', 'success'));
  } else {
    showToast('Share', 'Link copied to clipboard!', 'success');
  }
}

// Digital Resources
function initDigitalResources() {
  const resources = [
    { id:1, title:'The Complete Guide to Skin Undertones',    type:'E-Book',       price:12.99, description:'Master the art of identifying your undertone and choosing the perfect makeup shades.', icon:'fa-book',      color:'linear-gradient(135deg,#667eea,#764ba2)' },
    { id:2, title:'Clean Beauty: Ingredient Handbook',        type:'Guide',        price:9.99,  description:'Comprehensive guide to clean beauty ingredients, what to avoid, and what to embrace.',  icon:'fa-leaf',      color:'linear-gradient(135deg,#11998e,#38ef7d)' },
    { id:3, title:'Acne-Prone Skin Masterclass',              type:'Video Course', price:29.99, description:'Expert-led course on managing acne-prone skin with the right products and routines.',   icon:'fa-video',     color:'linear-gradient(135deg,#fc4a1a,#f7b733)' },
    { id:4, title:'Anti-Aging Skincare Protocol',             type:'E-Book',       price:15.99, description:'Science-backed strategies for preventing and reducing signs of aging.',                icon:'fa-book',      color:'linear-gradient(135deg,#ee0979,#ff6a00)' },
    { id:5, title:'Makeup for Beginners',                     type:'Video Course', price:24.99, description:'Step-by-step tutorials for mastering everyday makeup looks.',                          icon:'fa-video',     color:'linear-gradient(135deg,#4facfe,#00f2fe)' },
    { id:6, title:'Allergy-Free Beauty Guide',                type:'E-Book',       price:14.99, description:'Navigate beauty shopping with allergies and sensitivities safely.',                    icon:'fa-shield-alt',color:'linear-gradient(135deg,#fa709a,#fee140)' }
  ];
  const grid = document.getElementById('resourcesGrid');
  if (!grid) return;
  grid.innerHTML = resources.map(resource => `
    <div class="resource-card">
      <div class="resource-image" style="background:${resource.color}"><i class="fas ${resource.icon}"></i></div>
      <div class="resource-content">
        <div class="resource-type">${resource.type}</div>
        <h3 class="resource-title">${resource.title}</h3>
        <p class="resource-description">${resource.description}</p>
        <div class="resource-meta">
          <span class="resource-price">$${resource.price}</span>
          <button class="resource-btn" onclick="purchaseResource(${resource.id})">Get Access</button>
        </div>
      </div>
    </div>
  `).join('');
}

function purchaseResource(id) {
  if (!AppState.currentUser) { openAuth('login'); return; }
  showToast('Coming Soon', 'Digital store launching soon!', 'info');
}

// Admin Stats Update
function updateAdminStats(type) {
  const map = { users: 'oyinx_totalUsers', analyses: 'oyinx_totalAnalyses', products: 'oyinx_totalProducts' };
  const key = map[type];
  if (!key) return;
  const val = (parseInt(localStorage.getItem(key)) || 0) + 1;
  localStorage.setItem(key, val);
  if (type === 'users')    AppState.adminStats.totalUsers++;
  if (type === 'analyses') AppState.adminStats.totalAnalyses++;
  if (type === 'products') AppState.adminStats.totalProducts++;
}

// Toast Notifications
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
    <div class="toast-content"><h4>${title}</h4><p>${message}</p></div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// Navigation helpers
function scrollToFinder() {
  document.getElementById('finder')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filters
function initFilters() {
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.category;
      document.querySelectorAll('.product-recommendation').forEach(product => {
        product.style.display = (category === 'all' || product.dataset.category === category) ? 'block' : 'none';
      });
    });
  });
}

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    document.getElementById('nav-links')?.classList.toggle('show');
  });
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.getElementById('userMenu');
  const userBtn  = document.getElementById('userBtn');
  if (userMenu && userBtn && !userMenu.contains(e.target) && !userBtn.contains(e.target)) {
    userMenu.classList.remove('active');
  }
});

// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('hamburger')?.classList.remove('active');
    document.getElementById('nav-links')?.classList.remove('show');
  });
});