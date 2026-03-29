// Global State
const state = {
  currentUser: null,
  savedProducts: JSON.parse(localStorage.getItem('savedProducts')) || [],
  analysisHistory: JSON.parse(localStorage.getItem('analysisHistory')) || [],
  currentAnalysis: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Hide loading screen
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
  }, 2000);

  // Initialize AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  });

  // Check for saved login
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    state.currentUser = JSON.parse(savedUser);
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
  updateSavedCount();
});

// Hero Slider
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
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
      header.classList.add('header-scrolled');
      fabSecondary.classList.add('visible');
    } else {
      header.classList.remove('header-scrolled');
      fabSecondary.classList.remove('visible');
    }

    // Update active nav
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      const height = section.clientHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// Animated Counters
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-count');
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  });
  
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
  
  for (let i = 0; i < 30; i++) {
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
    `;
    container.appendChild(particle);
  }
}

// Authentication
function openAuth(tab = 'login') {
  const modal = document.getElementById('authModal');
  modal.classList.add('active');
  switchAuthTab(tab);
}

function closeAuth() {
  document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(`${tab}Form`).classList.add('active');
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
  const email = document.getElementById('loginEmail').value;
  
  // Simulate login
  state.currentUser = {
    email: email,
    firstName: email.split('@')[0],
    lastName: '',
    avatar: null
  };
  
  localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
  updateUIForLoggedInUser();
  closeAuth();
  showToast('Welcome Back!', `Signed in as ${email}`, 'success');
}

function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('regFirstName').value;
  const lastName = document.getElementById('regLastName').value;
  const email = document.getElementById('regEmail').value;
  
  state.currentUser = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    avatar: null
  };
  
  localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
  updateUIForLoggedInUser();
  closeAuth();
  showToast('Account Created!', `Welcome to OYINX, ${firstName}`, 'success');
}

function socialLogin(provider) {
  showToast('Coming Soon', `${provider} login will be available shortly`, 'info');
}

function updateUIForLoggedInUser() {
  const user = state.currentUser;
  if (!user) return;
  
  const userBtn = document.getElementById('userBtn');
  const userInitials = document.getElementById('userInitials');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const heroCta = document.getElementById('heroCtaBtn');
  
  userBtn.innerHTML = `
    <div class="user-avatar-small" style="width: 32px; height: 32px; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.9rem;">
      ${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}
    </div>
    <span>${user.firstName}</span>
  `;
  userBtn.classList.add('logged-in');
  userBtn.onclick = toggleUserMenu;
  
  userInitials.textContent = `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`;
  userName.textContent = `${user.firstName} ${user.lastName}`;
  userEmail.textContent = user.email;
  
  if (heroCta) {
    heroCta.innerHTML = '<span>My Beauty Profile</span><i class="fas fa-user"></i>';
    heroCta.onclick = showProfile;
  }
}

function toggleUserMenu() {
  document.getElementById('userMenu').classList.toggle('active');
}

function logout() {
  state.currentUser = null;
  localStorage.removeItem('currentUser');
  location.reload();
}

function showProfile() {
  if (!state.currentUser) {
    openAuth('login');
    return;
  }
  showToast('Profile', 'Profile page coming soon!', 'info');
  document.getElementById('userMenu').classList.remove('active');
}

function showHistory() {
  showToast('History', `You have ${state.analysisHistory.length} saved analyses`, 'info');
  document.getElementById('userMenu').classList.remove('active');
}

function showSaved() {
  showToast('Saved Products', `You have ${state.savedProducts.length} saved products`, 'info');
  document.getElementById('userMenu').classList.remove('active');
}

function showSettings() {
  showToast('Settings', 'Settings page coming soon!', 'info');
  document.getElementById('userMenu').classList.remove('active');
}

// Upload Zone
function initUploadZone() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('photoUpload');
  
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
  
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('preview').src = e.target.result;
    document.getElementById('uploadPlaceholder').hidden = true;
    document.getElementById('uploadPreview').hidden = false;
    showToast('Success', 'Photo uploaded successfully!', 'success');
    updateStep(1);
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  document.getElementById('uploadPlaceholder').hidden = false;
  document.getElementById('uploadPreview').hidden = true;
  document.getElementById('photoUpload').value = '';
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
      document.getElementById('skinTone').value = this.dataset.value;
    });
  });
  
  // Undertone cards
  document.querySelectorAll('.undertone-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.undertone-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('undertone').value = this.dataset.value;
    });
  });
  
  // Allergy toggle
  document.getElementById('hasAllergies').addEventListener('change', function() {
    document.getElementById('allergyInput').style.display = this.checked ? 'block' : 'none';
  });
}

// Step Management
function updateStep(step) {
  const steps = document.querySelectorAll('.step');
  const lines = document.querySelectorAll('.step-line');
  
  steps.forEach((s, i) => {
    if (i < step) {
      s.classList.add('completed');
      s.classList.remove('active');
    } else if (i === step) {
      s.classList.add('active');
      s.classList.remove('completed');
    } else {
      s.classList.remove('active', 'completed');
    }
  });
  
  lines.forEach((l, i) => {
    if (i < step - 1) {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });
}

// AI Analysis
function analyzeBeauty() {
  const skinTone = document.getElementById('skinTone').value;
  const undertone = document.getElementById('undertone').value;
  const faceShape = document.getElementById('faceShape').value;
  const skinConcern = document.getElementById('skinConcern').value;
  const preview = document.getElementById('preview').src;
  
  if (!preview || preview === '') {
    showToast('Error', 'Please upload a photo first', 'error');
    return;
  }
  
  if (!skinTone || !undertone) {
    showToast('Error', 'Please select skin tone and undertone', 'error');
    return;
  }

  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true;
  btn.querySelector('.btn-text').hidden = true;
  btn.querySelector('.btn-loader').hidden = false;
  
  updateStep(2);
  
  // Simulate AI processing
  setTimeout(() => {
    updateStep(3);
    
    setTimeout(() => {
      generateResults(skinTone, undertone, faceShape, skinConcern, preview);
      
      btn.disabled = false;
      btn.querySelector('.btn-text').hidden = false;
      btn.querySelector('.btn-loader').hidden = true;
      updateStep(4);
      
      document.getElementById('recommendationsSection').classList.add('active');
      document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      showToast('Analysis Complete', 'Your personalized beauty profile is ready!', 'success');
    }, 2000);
  }, 1500);
}

function generateResults(skin, undertone, face, concern, preview) {
  // Set images
  document.getElementById('beforeImage').src = preview;
  document.getElementById('afterImage').src = preview;
  
  // Show face mesh
  document.getElementById('faceMesh').classList.add('active');
  
  // Generate feature markers
  const markers = [
    { top: '30%', left: '35%', label: 'Eyes' },
    { top: '25%', left: '50%', label: 'Forehead' },
    { top: '45%', left: '30%', label: 'Cheek' },
    { top: '45%', left: '70%', label: 'Cheek' },
    { top: '60%', left: '50%', label: 'Lips' }
  ];
  
  const markersContainer = document.getElementById('featureMarkers');
  markersContainer.innerHTML = markers.map(m => `
    <div class="feature-marker" style="top: ${m.top}; left: ${m.left};" data-label="${m.label}"></div>
  `).join('');
  
  // Skin profile
  const skinProfiles = {
    fair: { desc: 'Fair porcelain skin with delicate texture', concerns: ['Sun sensitivity', 'Redness'] },
    light: { desc: 'Light skin with neutral undertones', concerns: ['Occasional dryness'] },
    medium: { desc: 'Medium skin with warm golden tones', concerns: ['Uneven tone'] },
    tan: { desc: 'Rich tan skin with warm undertones', concerns: ['Hyperpigmentation'] },
    dark: { desc: 'Deep dark skin with warm undertones', concerns: ['Ashiness'] },
    deep: { desc: 'Rich deep skin with intense undertones', concerns: ['Scarring'] }
  };
  
  const profile = skinProfiles[skin] || skinProfiles.light;
  document.getElementById('skinProfileText').innerHTML = `
    <strong>${profile.desc}</strong><br>
    <small>Common concerns: ${profile.concerns.join(', ')}</small>
  `;
  
  // Profile badges
  document.getElementById('profileBadges').innerHTML = `
    <span class="profile-badge">${undertone}</span>
    <span class="profile-badge">${face || 'Auto-detect'}</span>
    ${concern ? `<span class="profile-badge">${concern}</span>` : ''}
  `;
  
  // Seasonal color palette
  const palettes = {
    cool: ['#E6E6FA', '#DDA0DD', '#FFB6C1', '#87CEEB', '#D8BFD8'],
    warm: ['#FFD700', '#FFA500', '#FF6347', '#DAA520', '#F4A460'],
    neutral: ['#F5F5DC', '#D2B48C', '#C0C0C0', '#D3D3D3', '#E5E5E5'],
    olive: ['#808000', '#556B2F', '#8FBC8F', '#6B8E23', '#9ACD32']
  };
  
  const colors = palettes[undertone] || palettes.neutral;
  document.getElementById('seasonPalette').innerHTML = colors.map((c, i) => `
    <div class="season-color" style="background: ${c}" data-name="Color ${i + 1}"></div>
  `).join('');
  
  // Face geometry
  const faceGuides = {
    oval: 'Balanced proportions ideal for most makeup styles',
    round: 'Add contour to create definition and angles',
    square: 'Soften jawline with strategic contouring',
    heart: 'Balance forehead width with lower face emphasis',
    diamond: 'Highlight cheekbones, minimize forehead',
    long: 'Create width illusion with horizontal techniques'
  };
  
  document.getElementById('faceGeometryText').textContent = faceGuides[face] || 'Upload photo for geometric analysis';
  
  // Generate product recommendations
  generateProductRecommendations(skin, undertone, concern);
  
  // Generate timeline
  generateTimeline(face, concern);
  
  // Save to history
  state.currentAnalysis = {
    date: new Date().toISOString(),
    skinTone: skin,
    undertone: undertone,
    faceShape: face,
    concern: concern
  };
}

function generateProductRecommendations(skin, undertone, concern) {
  const products = [
    {
      id: 1,
      name: 'Pro Filt\'r Soft Matte Foundation',
      brand: 'Fenty Beauty',
      category: 'foundation',
      match: 98,
      image: 'https://images.unsplash.com/photo-1631730486784-5b10a140ed5f',
      description: 'Longwear foundation with climate-adaptive technology',
      ingredients: ['Hyaluronic Acid', 'Grape Seed Oil'],
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
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec',
      description: 'Multi-purpose concealer for buildable coverage',
      ingredients: ['Vitamin E', 'Grapefruit Extract'],
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
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
      description: 'Peachy-pink blush with golden shimmer',
      ingredients: ['Vitamin E', 'Rosehip Oil'],
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
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
      description: 'Neutral and berry tones for versatile looks',
      ingredients: ['Kaolin', 'Vitamin E'],
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
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa',
      description: 'Hydrating matte formula with 3D glow pigments',
      ingredients: ['Orchid Extract', 'Triglycerides'],
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
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
      description: 'Potent vitamin C serum for brightening',
      ingredients: ['Vitamin C', 'Ferulic Acid', 'Vitamin E'],
      retailers: [
        { name: 'Sephora', url: 'https://www.sephora.com', icon: 'fa-shopping-bag' },
        { name: 'Dermstore', url: 'https://www.dermstore.com', icon: 'fa-sparkles' }
      ]
    }
  ];
  
  const container = document.getElementById('productResults');
  container.innerHTML = products.map(product => `
    <div class="product-recommendation" data-category="${product.category}">
      <div class="product-rec-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="match-badge"><i class="fas fa-check-circle"></i> ${product.match}% Match</div>
        <button class="save-product ${isSaved(product.id) ? 'saved' : ''}" onclick="toggleSaveProduct(${product.id})">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-rec-info">
        <div class="product-rec-brand">${product.brand}</div>
        <h4 class="product-rec-name">${product.name}</h4>
        <p class="product-rec-description">${product.description}</p>
        <div class="product-rec-meta">
          ${product.ingredients.map(i => `<span class="meta-tag">${i}</span>`).join('')}
          <span class="meta-tag allergy-free"><i class="fas fa-check"></i> Allergy Free</span>
        </div>
        <div class="retailer-links">
          ${product.retailers.map((r, i) => `
            <a href="${r.url}" target="_blank" class="retailer-link ${i === 0 ? 'primary' : ''}">
              <i class="fab ${r.icon}"></i> ${r.name}
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function generateTimeline(face, concern) {
  const steps = [
    { icon: 'fa-pump-soap', title: 'Prep', desc: 'Cleanse & moisturize' },
    { icon: 'fa-spray-can', title: 'Prime', desc: 'Extend makeup wear' },
    { icon: 'fa-circle', title: 'Foundation', desc: 'Even skin tone' },
    { icon: 'fa-eye', title: 'Conceal', desc: 'Targeted coverage' },
    { icon: 'fa-sun', title: 'Contour', desc: face ? `${face} technique` : 'Define features' },
    { icon: 'fa-heart', title: 'Color', desc: 'Blush & highlight' },
    { icon: 'fa-eye', title: 'Eyes', desc: 'Shadow & liner' },
    { icon: 'fa-lips', title: 'Lips', desc: 'Define & color' }
  ];
  
  document.getElementById('masterclassTimeline').innerHTML = steps.map((step, i) => `
    <div class="timeline-step">
      <div class="step-number">${i + 1}</div>
      <div class="timeline-content">
        <h5>${step.title}</h5>
        <p>${step.desc}</p>
      </div>
    </div>
  `).join('');
}

function isSaved(productId) {
  return state.savedProducts.includes(productId);
}

function toggleSaveProduct(productId) {
  if (!state.currentUser) {
    openAuth('login');
    return;
  }
  
  const index = state.savedProducts.indexOf(productId);
  if (index > -1) {
    state.savedProducts.splice(index, 1);
    showToast('Removed', 'Product removed from saved', 'info');
  } else {
    state.savedProducts.push(productId);
    showToast('Saved', 'Product added to your collection', 'success');
  }
  
  localStorage.setItem('savedProducts', JSON.stringify(state.savedProducts));
  updateSavedCount();
  
  // Update button state
  event.currentTarget.classList.toggle('saved');
}

function updateSavedCount() {
  const count = document.getElementById('savedCount');
  if (count) {
    count.textContent = state.savedProducts.length;
  }
}

function saveAnalysis() {
  if (!state.currentUser) {
    openAuth('login');
    return;
  }
  
  if (state.currentAnalysis) {
    state.analysisHistory.push(state.currentAnalysis);
    localStorage.setItem('analysisHistory', JSON.stringify(state.analysisHistory));
    showToast('Saved', 'Analysis saved to your profile', 'success');
  }
}

function shareAnalysis() {
  showToast('Share', 'Sharing options coming soon!', 'info');
}

// Toast Notifications
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
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
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Navigation
function scrollToFinder() {
  document.getElementById('finder').scrollIntoView({ behavior: 'smooth' });
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
document.getElementById('hamburger').addEventListener('click', function() {
  this.classList.toggle('active');
  document.getElementById('nav-links').classList.toggle('show');
});

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.getElementById('userMenu');
  const userBtn = document.getElementById('userBtn');
  
  if (!userMenu.contains(e.target) && !userBtn.contains(e.target)) {
    userMenu.classList.remove('active');
  }
});