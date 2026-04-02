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

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }, 2000);

  // Initialize AOS animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  // Check for saved login
  const savedUser = localStorage.getItem('oyinx_currentUser');
  if (savedUser) {
    AppState.currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  }

  // Initialize all components
  initHeroSlider();
  initScrollEffects();
  initCounters();
  initUploadZone();
  initFormSelectors();
  initFilters();
  initParticles();
  initDigitalResources();
  updateSavedCount();
  
  // Initialize allergy system
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

    // Update active nav
    updateActiveNav();
  });
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
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
  const suffix = element.textContent.includes('%') ? '%' : 
                 element.textContent.includes('+') ? '+' : '';
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 20);
}

// Particles
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  // Limit particles on mobile
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const particleCount = isMobile ? 10 : 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: rgba(233,30,99,${Math.random() * 0.2});
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
  if (modal) {
    modal.classList.remove('active');
  }
}

function switchAuthTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  
  tabs.forEach(t => t.classList.remove('active'));
  forms.forEach(f => f.classList.remove('active'));
  
  event.target.classList.add('active');
  const targetForm = document.getElementById(`${tab}Form`);
  if (targetForm) {
    targetForm.classList.add('active');
  }
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = event.currentTarget.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
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
  
  // Simulate login with enhanced user data
  AppState.currentUser = {
    email: email,
    firstName: email.split('@')[0],
    lastName: '',
    avatar: null,
    joinDate: new Date().toISOString(),
    analyses: 0,
    savedProducts: []
  };
  
  // Update admin stats
  updateAdminStats('users');
  
  localStorage.setItem('oyinx_currentUser', JSON.stringify(AppState.currentUser));
  updateUIForLoggedInUser();
  closeAuth();
  showToast('Welcome Back!', `Signed in as ${email}`, 'success');
}

function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('regFirstName')?.value;
  const lastName = document.getElementById('regLastName')?.value;
  const email = document.getElementById('regEmail')?.value;
  
  if (!email || !firstName) return;
  
  AppState.currentUser = {
    email: email,
    firstName: firstName,
    lastName: lastName || '',
    avatar: null,
    joinDate: new Date().toISOString(),
    analyses: 0,
    savedProducts: []
  };
  
  // Update admin stats
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
  
  const userBtn = document.getElementById('userBtn');
  const userInitials = document.getElementById('userInitials');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const heroCta = document.getElementById('heroCtaBtn');
  
  const initials = `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`;
  
  if (userBtn) {
    userBtn.innerHTML = `
      <div class="user-avatar-small" style="width: 32px; height: 32px; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.9rem;">
        ${initials}
      </div>
      <span class="desktop-only">${user.firstName}</span>
    `;
    userBtn.classList.add('logged-in');
    userBtn.onclick = toggleUserMenu;
  }
  
  if (userInitials) userInitials.textContent = initials;
  if (userName) userName.textContent = `${user.firstName} ${user.lastName}`;
  if (userEmail) userEmail.textContent = user.email;
  
  if (heroCta) {
    heroCta.innerHTML = '<span>My Beauty Profile</span><i class="fas fa-user"></i>';
    heroCta.onclick = showProfile;
  }
}

function toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

function logout() {
  AppState.currentUser = null;
  localStorage.removeItem('oyinx_currentUser');
  location.reload();
}

function showProfile() {
  if (!AppState.currentUser) {
    openAuth('login');
    return;
  }
  showToast('Profile', 'Profile page coming soon!', 'info');
  document.getElementById('userMenu')?.classList.remove('active');
}

function showHistory() {
  const count = AppState.analysisHistory.length;
  showToast('History', `You have ${count} saved analyses`, 'info');
  document.getElementById('userMenu')?.classList.remove('active');
}

function showSaved() {
  const count = AppState.savedProducts.length;
  showToast('Saved Products', `You have ${count} saved products`, 'info');
  document.getElementById('userMenu')?.classList.remove('active');
}

function showSettings() {
  showToast('Settings', 'Settings page coming soon!', 'info');
  document.getElementById('userMenu')?.classList.remove('active');
}

// Upload Zone
function initUploadZone() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('photoUpload');
  
  if (!zone || !input) return;
  
  zone.addEventListener('click', () => input.click());
  
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.style.borderColor = 'var(--primary-color)';
    zone.style.background = 'var(--primary-light)';
  });
  
  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = '';
    zone.style.background = '';
  });
  
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
  
  input.addEventListener('change', (e) => {
    if (e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Error', 'Please upload an image file', 'error');
    return;
  }
  
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    showToast('Error', 'File size must be less than 10MB', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('preview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const previewContainer = document.getElementById('uploadPreview');
    
    if (preview) preview.src = e.target.result;
    if (placeholder) placeholder.hidden = true;
    if (previewContainer) previewContainer.hidden = false;
    
    showToast('Success', 'Photo uploaded successfully!', 'success');
    updateStep(1);
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  const placeholder = document.getElementById('uploadPlaceholder');
  const preview = document.getElementById('uploadPreview');
  const input = document.getElementById('photoUpload');
  
  if (placeholder) placeholder.hidden = false;
  if (preview) preview.hidden = true;
  if (input) input.value = '';
}

function enhancePhoto() {
  showToast('AI Enhancement', 'Improving photo quality for better analysis...', 'info');
  setTimeout(() => {
    showToast('Complete', 'Photo enhanced!', 'success');
  }, 1500);
}

// Form Selectors
function initFormSelectors() {
  // Skin tone selector
  document.querySelectorAll('.tone-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.tone-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      const input = document.getElementById('skinTone');
      if (input) input.value = this.dataset.value;
    });
  });
  
  // Undertone cards
  document.querySelectorAll('.undertone-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.undertone-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      const input = document.getElementById('undertone');
      if (input) input.value = this.dataset.value;
    });
  });
  
  // Allergy toggle
  const allergyCheckbox = document.getElementById('hasAllergies');
  if (allergyCheckbox) {
    allergyCheckbox.addEventListener('change', function() {
      const input = document.getElementById('allergyInput');
      if (input) {
        input.style.display = this.checked ? 'block' : 'none';
      }
    });
  }
}

// Allergy System
function initAllergySystem() {
  const allergyInput = document.getElementById('allergyList');
  if (allergyInput) {
    allergyInput.addEventListener('change', function() {
      AppState.userAllergies = this.value.split(',').map(a => a.trim().toLowerCase()).filter(a => a);
    });
  }
}

function checkProductSafety(product) {
  if (AppState.userAllergies.length === 0) return { safe: true, warnings: [] };
  
  const warnings = [];
  const ingredients = product.ingredients.map(i => i.toLowerCase());
  
  AppState.userAllergies.forEach(allergy => {
    if (ingredients.some(ing => ing.includes(allergy))) {
      warnings.push(`Contains ${allergy}`);
    }
  });
  
  return {
    safe: warnings.length === 0,
    warnings: warnings
  };
}

// Step Management
function updateStep(step) {
  const steps = document.querySelectorAll('.step');
  const lines = document.querySelectorAll('.step-line');
  
  steps.forEach((s, i) => {
    s.classList.remove('completed', 'active');
    if (i < step) {
      s.classList.add('completed');
    } else if (i === step) {
      s.classList.add('active');
    }
  });
  
  lines.forEach((l, i) => {
    l.classList.toggle('active', i < step);
  });
}

// AI Analysis
function analyzeBeauty() {
  const skinTone = document.getElementById('skinTone')?.value;
  const undertone = document.getElementById('undertone')?.value;
  const faceShape = document.getElementById('faceShape')?.value;
  const skinConcern = document.getElementById('skinConcern')?.value;
  const preview = document.getElementById('preview')?.src;
  
  if (!preview || preview === '') {
    showToast('Error', 'Please upload a photo first', 'error');
    return;
  }
  
  if (!skinTone || !undertone) {
    showToast('Error', 'Please select skin tone and undertone', 'error');
    return;
  }

  const btn = document.getElementById('analyzeBtn');
  if (btn) {
    btn.disabled = true;
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    if (btnText) btnText.hidden = true;
    if (btnLoader) btnLoader.hidden = false;
  }
  
  updateStep(2);
  
  // Simulate AI processing
  setTimeout(() => {
    updateStep(3);
    
    setTimeout(() => {
      generateResults(skinTone, undertone, faceShape, skinConcern, preview);
      
      if (btn) {
        btn.disabled = false;
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        if (btnText) btnText.hidden = false;
        if (btnLoader) btnLoader.hidden = true;
      }
      
      updateStep(4);
      
      const recSection = document.getElementById('recommendationsSection');
      if (recSection) {
        recSection.classList.add('active');
        recSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Update admin stats
      updateAdminStats('analyses');
      
      showToast('Analysis Complete', 'Your personalized beauty profile is ready!', 'success');
    }, 2000);
  }, 1500);
}

function generateResults(skin, undertone, face, concern, preview) {
  // Set images
  const beforeImage = document.getElementById('beforeImage');
  const afterImage = document.getElementById('afterImage');
  
  if (beforeImage) beforeImage.src = preview;
  if (afterImage) afterImage.src = preview;
  
  // Show face mesh
  const faceMesh = document.getElementById('faceMesh');
  if (faceMesh) faceMesh.classList.add('active');
  
  // Generate feature markers
  const markers = [
    { top: '30%', left: '35%', label: 'Eyes' },
    { top: '25%', left: '50%', label: 'Forehead' },
    { top: '45%', left: '30%', label: 'Cheek' },
    { top: '45%', left: '70%', label: 'Cheek' },
    { top: '60%', left: '50%', label: 'Lips' }
  ];
  
  const markersContainer = document.getElementById('featureMarkers');
  if (markersContainer) {
    markersContainer.innerHTML = markers.map(m => `
      <div class="feature-marker" style="top: ${m.top}; left: ${m.left};" data-label="${m.label}"></div>
    `).join('');
  }
  
  // Skin profile with detailed analysis
  const skinProfiles = {
    fair: { 
      desc: 'Fair porcelain skin with delicate texture', 
      concerns: ['Sun sensitivity', 'Redness', 'Freckles'],
      characteristics: 'Cool or neutral undertones, burns easily, may have freckles'
    },
    light: { 
      desc: 'Light skin with neutral undertones', 
      concerns: ['Occasional dryness', 'Mild sensitivity'],
      characteristics: 'Versatile undertone range, tans gradually'
    },
    medium: { 
      desc: 'Medium skin with warm golden tones', 
      concerns: ['Uneven tone', 'Occasional breakouts'],
      characteristics: 'Warm undertones, tans easily, olive to golden hue'
    },
    tan: { 
      desc: 'Rich tan skin with warm undertones', 
      concerns: ['Hyperpigmentation', 'Uneven texture'],
      characteristics: 'Golden to caramel tones, rarely burns'
    },
    dark: { 
      desc: 'Deep dark skin with warm undertones', 
      concerns: ['Ashiness', 'Hyperpigmentation'],
      characteristics: 'Rich melanin content, warm golden undertones'
    },
    deep: { 
      desc: 'Rich deep skin with intense undertones', 
      concerns: ['Scarring', 'Product ashiness'],
      characteristics: 'Deep melanin, may have cool or warm undertones'
    }
  };
  
  const profile = skinProfiles[skin] || skinProfiles.light;
  const skinProfileText = document.getElementById('skinProfileText');
  if (skinProfileText) {
    skinProfileText.innerHTML = `
      <strong>${profile.desc}</strong><br>
      <small>${profile.characteristics}</small><br>
      <small style="color: var(--primary-color);">Common concerns: ${profile.concerns.join(', ')}</small>
    `;
  }
  
  // Profile badges
  const profileBadges = document.getElementById('profileBadges');
  if (profileBadges) {
    profileBadges.innerHTML = `
      <span class="profile-badge">${undertone}</span>
      <span class="profile-badge">${face || 'Auto-detect'}</span>
      ${concern ? `<span class="profile-badge">${concern}</span>` : ''}
      <span class="profile-badge">${skin}</span>
    `;
  }
  
  // Seasonal color palette
  const palettes = {
    cool: ['#E6E6FA', '#DDA0DD', '#FFB6C1', '#87CEEB', '#D8BFD8', '#B0E0E6'],
    warm: ['#FFD700', '#FFA500', '#FF6347', '#DAA520', '#F4A460', '#FF8C00'],
    neutral: ['#F5F5DC', '#D2B48C', '#C0C0C0', '#D3D3D3', '#E5E5E5', '#F0F0F0'],
    olive: ['#808000', '#556B2F', '#8FBC8F', '#6B8E23', '#9ACD32', '#6B8E23']
  };
  
  const colors = palettes[undertone] || palettes.neutral;
  const seasonPalette = document.getElementById('seasonPalette');
  if (seasonPalette) {
    seasonPalette.innerHTML = colors.map((c, i) => `
      <div class="season-color" style="background: ${c}" data-name="${undertone} Tone ${i + 1}"></div>
    `).join('');
  }
  
  // Face geometry
  const faceGuides = {
    oval: 'Balanced proportions ideal for most makeup styles. Soft contouring enhances natural symmetry.',
    round: 'Add contour to create definition and angles. Focus on cheekbones and jawline.',
    square: 'Soften jawline with strategic contouring. Highlight center of face.',
    heart: 'Balance forehead width with lower face emphasis. Contour temples, highlight chin.',
    diamond: 'Highlight cheekbones, minimize forehead. Soft contour on cheek angles.',
    long: 'Create width illusion with horizontal techniques. Contour forehead and chin.'
  };
  
  const faceGeometryText = document.getElementById('faceGeometryText');
  if (faceGeometryText) {
    faceGeometryText.textContent = faceGuides[face] || faceGuides.oval;
  }
  
  // Generate personalized recommendations
  generateProductRecommendations(skin, undertone, concern);
  generateTimeline(face, concern);
  
  // Save to history
  AppState.currentAnalysis = {
    date: new Date().toISOString(),
    skinTone: skin,
    undertone: undertone,
    faceShape: face,
    concern: concern,
    profile: profile
  };
}

function generateProductRecommendations(skin, undertone, concern) {
  // Comprehensive product database with allergy info
  const products = [
    {
      id: 1,
      name: 'Pro Filt\'r Soft Matte Foundation',
      brand: 'Fenty Beauty',
      category: 'foundation',
      match: 98,
      image: 'https://images.unsplash.com/photo-1631730486784-5b10a140ed5f?w=600',
      description: 'Longwear foundation with climate-adaptive technology',
      ingredients: ['Hyaluronic Acid', 'Grape Seed Oil', 'Dimethicone'],
      allergens: ['silicone'],
      skinTypes: ['oily', 'combination', 'normal'],
      concerns: ['oiliness', 'acne'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Amazon', url: 'https://www.amazon.com', icon: 'fa-amazon' }
      ]
    },
    {
      id: 2,
      name: 'Radiant Creamy Concealer',
      brand: 'NARS',
      category: 'concealer',
      match: 95,
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600',
      description: 'Multi-purpose concealer for buildable coverage',
      ingredients: ['Vitamin E', 'Grapefruit Extract', 'Bisabolol'],
      allergens: [],
      skinTypes: ['all'],
      concerns: ['darkspots', 'aging'],
      retailers: [
        { name: 'Ulta', url: 'https://www.ulta.com', icon: 'fa-store' },
        { name: 'Amazon', url: 'https://www.amazon.com', icon: 'fa-amazon' }
      ]
    },
    {
      id: 3,
      name: 'Orgasm Blush',
      brand: 'NARS',
      category: 'blush',
      match: 92,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
      description: 'Peachy-pink blush with golden shimmer',
      ingredients: ['Vitamin E', 'Rosehip Oil', 'Mica'],
      allergens: [],
      skinTypes: ['all'],
      concerns: ['aging'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Amazon', url: 'https://www.amazon.com', icon: 'fa-amazon' }
      ]
    },
    {
      id: 4,
      name: 'Modern Renaissance Palette',
      brand: 'Anastasia',
      category: 'eyeshadow',
      match: 94,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
      description: 'Neutral and berry tones for versatile looks',
      ingredients: ['Kaolin', 'Vitamin E', 'Talc'],
      allergens: ['talc'],
      skinTypes: ['all'],
      concerns: ['all'],
      retailers: [
        { name: 'Ulta', url: 'https://www.ulta.com', icon: 'fa-store' },
        { name: 'Amazon', url: 'https://www.amazon.com', icon: 'fa-amazon' }
      ]
    },
    {
      id: 5,
      name: 'Matte Revolution Lipstick',
      brand: 'Charlotte Tilbury',
      category: 'lipstick',
      match: 96,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
      description: 'Hydrating matte formula with 3D glow pigments',
      ingredients: ['Orchid Extract', 'Triglycerides', 'Peppermint Oil'],
      allergens: ['fragrance'],
      skinTypes: ['all'],
      concerns: ['aging', 'dryness'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Amazon', url: 'https://www.amazon.com', icon: 'fa-amazon' }
      ]
    },
    {
      id: 6,
      name: 'C-Firma Fresh Day Serum',
      brand: 'Drunk Elephant',
      category: 'skincare',
      match: 97,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
      description: 'Potent vitamin C serum for brightening',
      ingredients: ['Vitamin C', 'Ferulic Acid', 'Vitamin E', 'Pumpkin Ferment'],
      allergens: [],
      skinTypes: ['all'],
      concerns: ['brightening', 'aging', 'darkspots'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Dermstore', url: 'https://www.dermstore.com', icon: 'fa-sparkles' }
      ]
    },
    {
      id: 7,
      name: 'Ultra Repair Cream',
      brand: 'First Aid Beauty',
      category: 'skincare',
      match: 99,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
      description: 'Intense hydration for dry, distressed skin',
      ingredients: ['Colloidal Oatmeal', 'Shea Butter', 'Allantoin'],
      allergens: ['nuts'],
      skinTypes: ['dry', 'sensitive'],
      concerns: ['dryness', 'sensitivity'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Ulta', url: 'https://www.ulta.com', icon: 'fa-store' }
      ]
    },
    {
      id: 8,
      name: 'Salicylic Acid 2% Solution',
      brand: 'The Ordinary',
      category: 'skincare',
      match: 93,
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600',
      description: 'BHA exfoliant for blemish-prone skin',
      ingredients: ['Salicylic Acid', 'Hamamelis Virginiana Water'],
      allergens: [],
      skinTypes: ['oily', 'combination', 'acne-prone'],
      concerns: ['acne', 'oiliness', 'pores'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Ulta', url: 'https://www.ulta.com', icon: 'fa-store' }
      ]
    }
  ];
  
  // Filter products based on user profile and allergies
  const filteredProducts = products.map(product => {
    const safety = checkProductSafety(product);
    let matchScore = product.match;
    
    // Adjust match score based on concerns
    if (concern && product.concerns.includes(concern)) {
      matchScore += 2;
    }
    
    // Mark unsafe products
    if (!safety.safe) {
      matchScore = Math.max(0, matchScore - 20);
    }
    
    return { ...product, safety, adjustedMatch: Math.min(100, matchScore) };
  }).sort((a, b) => b.adjustedMatch - a.adjustedMatch);
  
  const container = document.getElementById('productResults');
  if (!container) return;
  
  container.innerHTML = filteredProducts.map(product => {
    const isSaved = AppState.savedProducts.includes(product.id);
    const allergyWarning = !product.safety.safe ? 
      `<div class="allergy-warning"><i class="fas fa-exclamation-triangle"></i> Contains allergens</div>` : '';
    
    return `
    <div class="product-recommendation" data-category="${product.category}" data-safe="${product.safety.safe}">
      <div class="product-rec-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="match-badge"><i class="fas fa-check-circle"></i> ${product.adjustedMatch}% Match</div>
        ${allergyWarning}
        <button class="save-product ${isSaved ? 'saved' : ''}" onclick="toggleSaveProduct(${product.id})" aria-label="Save product">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-rec-info">
        <div class="product-rec-brand">${product.brand}</div>
        <h4 class="product-rec-name">${product.name}</h4>
        <p class="product-rec-description">${product.description}</p>
        <div class="product-rec-meta">
          ${product.ingredients.slice(0, 3).map(i => `<span class="meta-tag">${i}</span>`).join('')}
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
    { icon: 'fa-pump-soap', title: 'Prep', desc: 'Cleanse & moisturize based on your ${concern || "skin type"}' },
    { icon: 'fa-spray-can', title: 'Prime', desc: 'Extend makeup wear' },
    { icon: 'fa-circle', title: 'Foundation', desc: 'Match your undertone perfectly' },
    { icon: 'fa-eye', title: 'Conceal', desc: 'Targeted coverage for ${concern || "blemishes"}' },
    { icon: 'fa-sun', title: 'Contour', desc: face ? `${face} face technique` : 'Define features' },
    { icon: 'fa-heart', title: 'Color', desc: 'Blush & highlight placement' },
    { icon: 'fa-eye', title: 'Eyes', desc: 'Shadow & liner for your shape' },
    { icon: 'fa-lips', title: 'Lips', desc: 'Define & color' }
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

function isSaved(productId) {
  return AppState.savedProducts.includes(productId);
}

function toggleSaveProduct(productId) {
  if (!AppState.currentUser) {
    openAuth('login');
    return;
  }
  
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
  
  // Update button state
  const btn = event.currentTarget;
  if (btn) {
    btn.classList.toggle('saved');
  }
}

function updateSavedCount() {
  // Update any visible count badges
  const badges = document.querySelectorAll('.saved-count');
  badges.forEach(badge => {
    badge.textContent = AppState.savedProducts.length;
  });
}

function saveAnalysis() {
  if (!AppState.currentUser) {
    openAuth('login');
    return;
  }
  
  if (AppState.currentAnalysis) {
    AppState.analysisHistory.push(AppState.currentAnalysis);
    localStorage.setItem('oyinx_analysisHistory', JSON.stringify(AppState.analysisHistory));
    showToast('Saved', 'Analysis saved to your profile', 'success');
  }
}

function shareAnalysis() {
  if (navigator.share) {
    navigator.share({
      title: 'My OYINX Beauty Analysis',
      text: 'Check out my personalized beauty profile!',
      url: window.location.href
    }).catch(() => {
      showToast('Share', 'Link copied to clipboard!', 'success');
    });
  } else {
    showToast('Share', 'Link copied to clipboard!', 'success');
  }
}

// Digital Resources
function initDigitalResources() {
  const resources = [
    {
      id: 1,
      title: 'The Complete Guide to Skin Undertones',
      type: 'E-Book',
      price: 12.99,
      description: 'Master the art of identifying your undertone and choosing the perfect makeup shades.',
      icon: 'fa-book',
      color: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      id: 2,
      title: 'Clean Beauty: Ingredient Handbook',
      type: 'Guide',
      price: 9.99,
      description: 'Comprehensive guide to clean beauty ingredients, what to avoid, and what to embrace.',
      icon: 'fa-leaf',
      color: 'linear-gradient(135deg, #11998e, #38ef7d)'
    },
    {
      id: 3,
      title: 'Acne-Prone Skin Masterclass',
      type: 'Video Course',
      price: 29.99,
      description: 'Expert-led course on managing acne-prone skin with the right products and routines.',
      icon: 'fa-video',
      color: 'linear-gradient(135deg, #fc4a1a, #f7b733)'
    },
    {
      id: 4,
      title: 'Anti-Aging Skincare Protocol',
      type: 'E-Book',
      price: 15.99,
      description: 'Science-backed strategies for preventing and reducing signs of aging.',
      icon: 'fa-book',
      color: 'linear-gradient(135deg, #ee0979, #ff6a00)'
    },
    {
      id: 5,
      title: 'Makeup for Beginners',
      type: 'Video Course',
      price: 24.99,
      description: 'Step-by-step tutorials for mastering everyday makeup looks.',
      icon: 'fa-video',
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)'
    },
    {
      id: 6,
      title: 'Allergy-Free Beauty Guide',
      type: 'E-Book',
      price: 14.99,
      description: 'Navigate beauty shopping with allergies and sensitivities safely.',
      icon: 'fa-shield-alt',
      color: 'linear-gradient(135deg, #fa709a, #fee140)'
    }
  ];
  
  const grid = document.getElementById('resourcesGrid');
  if (!grid) return;
  
  grid.innerHTML = resources.map(resource => `
    <div class="resource-card">
      <div class="resource-image" style="background: ${resource.color}">
        <i class="fas ${resource.icon}"></i>
      </div>
      <div class="resource-content">
        <div class="resource-type">${resource.type}</div>
        <h3 class="resource-title">${resource.title}</h3>
        <p class="resource-description">${resource.description}</p>
        <div class="resource-meta">
          <span class="resource-price">$${resource.price}</span>
          <button class="resource-btn" onclick="purchaseResource(${resource.id})">
            Get Access
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function purchaseResource(id) {
  if (!AppState.currentUser) {
    openAuth('login');
    return;
  }
  showToast('Coming Soon', 'Digital store launching soon!', 'info');
}

// Admin Stats Update
function updateAdminStats(type) {
  switch(type) {
    case 'users':
      AppState.adminStats.totalUsers++;
      localStorage.setItem('oyinx_totalUsers', AppState.adminStats.totalUsers);
      break;
    case 'analyses':
      AppState.adminStats.totalAnalyses++;
      localStorage.setItem('oyinx_totalAnalyses', AppState.adminStats.totalAnalyses);
      break;
    case 'products':
      AppState.adminStats.totalProducts++;
      localStorage.setItem('oyinx_totalProducts', AppState.adminStats.totalProducts);
      break;
  }
}

// Toast Notifications
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Navigation
function scrollToFinder() {
  const finder = document.getElementById('finder');
  if (finder) {
    finder.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize filters
function initFilters() {
  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const category = tab.dataset.category;
      document.querySelectorAll('.product-recommendation').forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  });
}

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    const nav = document.getElementById('nav-links');
    if (nav) {
      nav.classList.toggle('show');
    }
  });
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.getElementById('userMenu');
  const userBtn = document.getElementById('userBtn');
  
  if (userMenu && userBtn && !userMenu.contains(e.target) && !userBtn.contains(e.target)) {
    userMenu.classList.remove('active');
  }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav-links');
    if (hamburger) hamburger.classList.remove('active');
    if (nav) nav.classList.remove('show');
  });
});