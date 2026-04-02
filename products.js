// products.js
// Products Page Functionality

document.addEventListener('DOMContentLoaded', () => {
  initializeProductsPage();
});

function initializeProductsPage() {
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }, 1500);

  // Initialize components
  initProductFilters();
  initProductGrid();
  initPriceRange();
  initSortDropdown();
  
  // Load initial products
  loadProducts();
}

// Product Database
const productDatabase = [
  {
    id: 101,
    name: 'Double Wear Stay-in-Place Foundation',
    brand: 'Estée Lauder',
    category: 'makeup',
    subcategory: 'foundation',
    price: 43.00,
    originalPrice: null,
    rating: 4.8,
    reviews: 12543,
    image: 'https://images.unsplash.com/photo-1631730486784-5b10a140ed5f?w=600',
    images: [
      'https://images.unsplash.com/photo-1631730486784-5b10a140ed5f?w=600',
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600'
    ],
    description: '24-hour wear, flawless, natural, matte foundation with SPF 10. Won\'t change color, smudge or come off on clothes.',
    ingredients: ['Water', 'Cyclopentasiloxane', 'Trimethylsiloxysilicate', 'Butylene Glycol', 'PEG-10 Dimethicone'],
    allergens: ['silicone'],
    skinTypes: ['oily', 'combination'],
    concerns: ['oiliness', 'longwear'],
    tags: ['longwear', 'matte', 'spf'],
    isNew: false,
    isSale: false,
    retailers: [
      { name: 'Sephora', url: 'https://www.sephora.com', price: 43.00 },
      { name: 'Ulta', url: 'https://www.ulta.com', price: 43.00 },
      { name: 'Amazon', url: 'https://www.amazon.com', price: 38.99 }
    ]
  },
  {
    id: 102,
    name: 'Good Genes All-In-One Lactic Acid Treatment',
    brand: 'Sunday Riley',
    category: 'skincare',
    subcategory: 'serum',
    price: 122.00,
    originalPrice: null,
    rating: 4.6,
    reviews: 8921,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
      'https://images.unsplash.com/photo-1617897903246-719242758050?w=600'
    ],
    description: 'Clarifies, smooths, and retexturizes skin for instant radiance. Potent lactic acid formula.',
    ingredients: ['Lactic Acid', 'Licorice', 'Lemongrass', 'Aloe', 'Arnica'],
    allergens: [],
    skinTypes: ['normal', 'dry', 'combination'],
    concerns: ['aging', 'texture', 'brightening'],
    tags: ['cruelty-free', 'lactic-acid', 'brightening'],
    isNew: true,
    isSale: false,
    retailers: [
      { name: 'Sephora', url: 'https://www.sephora.com', price: 122.00 },
      { name: 'Dermstore', url: 'https://www.dermstore.com', price: 122.00 }
    ]
  },
  {
    id: 103,
    name: 'Better Than Sex Mascara',
    brand: 'Too Faced',
    category: 'makeup',
    subcategory: 'mascara',
    price: 28.00,
    originalPrice: null,
    rating: 4.4,
    reviews: 25678,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'
    ],
    description: 'An intensely black, volumizing mascara with an hourglass-shaped brush that separates, coats, and curls.',
    ingredients: ['Water', 'Paraffin', 'Polybutene', 'Styrene/Acrylates/Ammonium Methacrylate Copolymer'],
    allergens: [],
    skinTypes: ['all'],
    concerns: [],
    tags: ['volumizing', 'cruelty-free'],
    isNew: false,
    isSale: true,
    salePrice: 22.00,
    retailers: [
      { name: 'Ulta', url: 'https://www.ulta.com', price: 28.00 },
      { name: 'Sephora', url: 'https://www.sephora.com', price: 28.00 },
      { name: 'Amazon', url: 'https://www.amazon.com', price: 24.99 }
    ]
  },
  {
    id: 104,
    name: 'Creme de Corps',
    brand: 'Kiehl\'s',
    category: 'skincare',
    subcategory: 'body',
    price: 32.00,
    originalPrice: null,
    rating: 4.9,
    reviews: 6789,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'
    ],
    description: 'Superb all-over body moisturizer specially formulated with beta-carotene and cocoa butter.',
    ingredients: ['Squalane', 'Cocoa Butter', 'Beta-Carotene', 'Sesame Oil'],
    allergens: [],
    skinTypes: ['dry', 'very-dry'],
    concerns: ['dryness'],
    tags: ['body-care', 'moisturizing'],
    isNew: false,
    isSale: false,
    retailers: [
      { name: 'Kiehl\'s', url: 'https://www.kiehls.com', price: 32.00 },
      { name: 'Sephora', url: 'https://www.sephora.com', price: 32.00 }
    ]
  },
  {
    id: 105,
    name: 'Dyson Supersonic Hair Dryer',
    brand: 'Dyson',
    category: 'tools',
    subcategory: 'hair-tools',
    price: 429.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 3456,
    image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=600',
    images: [
      'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=600'
    ],
    description: 'Intelligent heat control for shine. Powerful digital motor. Engineered for balance.',
    ingredients: [],
    allergens: [],
    skinTypes: ['all'],
    concerns: [],
    tags: ['luxury', 'ionic', 'fast-drying'],
    isNew: true,
    isSale: false,
    retailers: [
      { name: 'Sephora', url: 'https://www.sephora.com', price: 429.99 },
      { name: 'Ulta', url: 'https://www.ulta.com', price: 429.99 },
      { name: 'Dyson', url: 'https://www.dyson.com', price: 429.99 }
    ]
  },
  {
    id: 106,
    name: 'Glossier You Perfume',
    brand: 'Glossier',
    category: 'fragrance',
    subcategory: 'perfume',
    price: 68.00,
    originalPrice: null,
    rating: 4.5,
    reviews: 12345,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600'
    ],
    description: 'A skin-scent that smells like you. Creamy, sparkling, clean, warm.',
    ingredients: ['Ambrette', 'Ambrox', 'Musk', 'Iris Root', 'Pink Pepper'],
    allergens: ['fragrance'],
    skinTypes: ['all'],
    concerns: [],
    tags: ['clean-beauty', 'cruelty-free'],
    isNew: false,
    isSale: false,
    retailers: [
      { name: 'Glossier', url: 'https://www.glossier.com', price: 68.00 },
      { name: 'Sephora', url: 'https://www.sephora.com', price: 68.00 }
    ]
  }
];

let currentFilters = {
  category: 'all',
  skinType: 'all',
  concern: 'all',
  maxPrice: 500,
  sort: 'recommended'
};

let displayedProducts = [];

function initProductFilters() {
  // Category filters
  document.querySelectorAll('#categoryFilters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#categoryFilters .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilters.category = chip.dataset.filter;
      applyFilters();
    });
  });
  
  // Skin type filters
  document.querySelectorAll('#skinTypeFilters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#skinTypeFilters .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilters.skinType = chip.dataset.filter;
      applyFilters();
    });
  });
  
  // Concern filters
  document.querySelectorAll('#concernFilters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#concernFilters .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilters.concern = chip.dataset.filter;
      applyFilters();
    });
  });
  
  // Search functionality
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      applyFilters();
    }, 300));
  }
}

function initPriceRange() {
  const range = document.getElementById('priceRange');
  const display = document.getElementById('priceValue');
  
  if (range && display) {
    range.addEventListener('input', () => {
      currentFilters.maxPrice = parseInt(range.value);
      display.textContent = range.value == 500 ? 'Under $500' : `Under $${range.value}`;
      applyFilters();
    });
  }
}

function initSortDropdown() {
  const sort = document.getElementById('sortProducts');
  if (sort) {
    sort.addEventListener('change', () => {
      currentFilters.sort = sort.value;
      applyFilters();
    });
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function applyFilters() {
  let filtered = [...productDatabase];
  
  // Category filter
  if (currentFilters.category !== 'all') {
    filtered = filtered.filter(p => p.category === currentFilters.category);
  }
  
  // Skin type filter
  if (currentFilters.skinType !== 'all') {
    filtered = filtered.filter(p => 
      p.skinTypes.includes('all') || p.skinTypes.includes(currentFilters.skinType)
    );
  }
  
  // Concern filter
  if (currentFilters.concern !== 'all') {
    filtered = filtered.filter(p => p.concerns.includes(currentFilters.concern));
  }
  
  // Price filter
  filtered = filtered.filter(p => {
    const price = p.salePrice || p.price;
    return price <= currentFilters.maxPrice;
  });
  
  // Search filter
  const searchTerm = document.getElementById('productSearch')?.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.tags.some(t => t.includes(searchTerm))
    );
  }
  
  // Sort
  switch(currentFilters.sort) {
    case 'price-low':
      filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      break;
    case 'price-high':
      filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
  }
  
  displayedProducts = filtered;
  renderProducts(filtered);
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  if (products.length === 0) {
    grid.innerHTML = `
      <div class="no-products">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your filters</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = products.map(product => {
    const price = product.salePrice || product.price;
    const hasDiscount = product.salePrice && product.originalPrice;
    
    return `
      <div class="product-card" onclick="openProductModal(${product.id})">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-badges">
            ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
            ${product.salePrice ? `<span class="badge badge-sale">Sale</span>` : ''}
            ${product.allergens.length === 0 ? '<span class="badge badge-safe">Clean</span>' : ''}
          </div>
          <div class="product-actions">
            <button class="action-btn" onclick="event.stopPropagation(); quickSave(${product.id})" title="Save">
              <i class="fas fa-heart"></i>
            </button>
            <button class="action-btn" onclick="event.stopPropagation(); quickView(${product.id})" title="Quick view">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-brand">${product.brand}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            <span class="stars">${generateStars(product.rating)}</span>
            <span class="rating-count">(${product.reviews.toLocaleString()})</span>
          </div>
          <div class="product-price">
            <span class="current-price">$${price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="product-meta">
            ${product.tags.slice(0, 3).map(tag => `<span class="product-tag">${tag}</span>`).join('')}
          </div>
          <div class="product-footer">
            <button class="view-details-btn">Details</button>
            <button class="buy-now-btn">Shop Now</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (hasHalf) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
}

function openProductModal(productId) {
  const product = productDatabase.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('productModal');
  
  // Populate modal
  document.getElementById('modalMainImage').src = product.images[0];
  document.getElementById('modalBrand').textContent = product.brand;
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalStars').innerHTML = generateStars(product.rating);
  document.getElementById('modalReviewCount').textContent = `${product.reviews.toLocaleString()} reviews`;
  
  const price = product.salePrice || product.price;
  document.getElementById('modalPrice').innerHTML = `
    $${price.toFixed(2)}
    ${product.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-light); font-size: 1.2rem; margin-left: 10px;">$${product.originalPrice.toFixed(2)}</span>` : ''}
  `;
  
  document.getElementById('modalDescription').textContent = product.description;
  
  // Ingredients
  document.getElementById('modalIngredients').innerHTML = product.ingredients
    .slice(0, 6)
    .map(i => `<span class="ingredient-tag">${i}</span>`)
    .join('');
  
  // Safety badge
  const safetyBadge = document.getElementById('modalAllergyBadge');
  if (product.allergens.length === 0) {
    safetyBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>Clean formula - No major allergens</span>';
    safetyBadge.className = 'safety-badge safe';
  } else {
    safetyBadge.innerHTML = `<i class="fas fa-info-circle"></i><span>Contains: ${product.allergens.join(', ')}</span>`;
    safetyBadge.className = 'safety-badge warning';
  }
  
  // Retailers
  document.getElementById('modalRetailers').innerHTML = product.retailers.map(r => `
    <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="retailer-btn">
      <span>${r.name}</span>
      <span>$${r.price.toFixed(2)} <i class="fas fa-external-link-alt"></i></span>
    </a>
  `).join('');
  
  // Thumbnails
  document.getElementById('modalThumbnails').innerHTML = product.images.map((img, i) => `
    <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeModalImage('${img}', this)">
      <img src="${img}" alt="">
    </div>
  `).join('');
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function changeModalImage(src, thumb) {
  document.getElementById('modalMainImage').src = src;
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function quickSave(productId) {
  showToast('Success', 'Product saved to your profile', 'success');
}

function quickView(productId) {
  openProductModal(productId);
}

function saveToProfile() {
  showToast('Success', 'Product saved to your profile', 'success');
  closeProductModal();
}

function shareProduct() {
  if (navigator.share) {
    navigator.share({
      title: document.getElementById('modalProductName').textContent,
      text: 'Check out this product on OYINX!',
      url: window.location.href
    });
  } else {
    showToast('Copied', 'Link copied to clipboard', 'success');
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  // In real implementation, this would switch content
  showToast('Info', `${tabName} content loading...`, 'info');
}

function loadProducts() {
  applyFilters();
}

// Close modal on outside click
document.getElementById('productModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'productModal') {
    closeProductModal();
  }
});

// Toast function (same as main script)
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
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}