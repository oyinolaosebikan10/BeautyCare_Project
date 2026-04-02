// admin.js
// Admin Dashboard Functionality

// Temporary obfuscation (not real security, just slows down casual users)
const _0x4f2a = ['oyinx2026','admin'];
// At least change the password from the obvious default

const AdminState = {
  isLoggedIn: false,
  currentSection: 'overview',
  charts: {}
};

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminListeners();
});

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('oyinx_admin_auth');
  if (isAuth === 'true') {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('adminLoginModal').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
  document.getElementById('adminLoginModal').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'grid';
  AdminState.isLoggedIn = true;
  initializeDashboard();
}

function handleAdminLogin(e) {
  e.preventDefault();
  const id = document.getElementById('adminId').value;
  const password = document.getElementById('adminPassword').value;
  
  // Simple auth check (in production, use proper backend auth)
  if (id === 'admin' && password === 'oyinx2026') {
    sessionStorage.setItem('oyinx_admin_auth', 'true');
    showDashboard();
    showToast('Welcome', 'Admin dashboard loaded', 'success');
  } else {
    showToast('Error', 'Invalid credentials', 'error');
  }
}

function adminLogout() {
  sessionStorage.removeItem('oyinx_admin_auth');
  location.reload();
}

function initializeDashboard() {
  loadStats();
  initCharts();
  loadRecentActivity();
  loadUsersTable();
  loadAnalysesGrid();
  loadAllergyReports();
  updateBadges();
}

function loadStats() {
  // Get stats from localStorage (synced with main app)
  const totalUsers = parseInt(localStorage.getItem('oyinx_totalUsers')) || 0;
  const totalAnalyses = parseInt(localStorage.getItem('oyinx_totalAnalyses')) || 0;
  const totalProducts = parseInt(localStorage.getItem('oyinx_totalProducts')) || 0;
  
  // Calculate estimated revenue (affiliate commission estimate)
  const estimatedRevenue = totalProducts * 2.5; // $2.50 average commission
  
  document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
  document.getElementById('totalAnalyses').textContent = totalAnalyses.toLocaleString();
  document.getElementById('totalProducts').textContent = totalProducts.toLocaleString();
  document.getElementById('totalRevenue').textContent = '$' + estimatedRevenue.toLocaleString();
  
  // Calculate growth (mock data - in production, compare with previous period)
  document.getElementById('userGrowth').textContent = '+' + Math.floor(Math.random() * 15 + 5) + '%';
  document.getElementById('analysisGrowth').textContent = '+' + Math.floor(Math.random() * 20 + 10) + '%';
  document.getElementById('productGrowth').textContent = '+' + Math.floor(Math.random() * 25 + 5) + '%';
  document.getElementById('revenueGrowth').textContent = '+' + Math.floor(Math.random() * 30 + 10) + '%';
}

function initCharts() {
  // User Growth Chart
  const userCtx = document.getElementById('userGrowthChart');
  if (userCtx) {
    AdminState.charts.userGrowth = new Chart(userCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [65, 78, 90, 115, 145, 180],
          borderColor: '#E91E63',
          backgroundColor: 'rgba(233,30,99,0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
  // Analysis Distribution Pie Chart
  const pieCtx = document.getElementById('analysisPieChart');
  if (pieCtx) {
    AdminState.charts.analysisPie = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Foundation Match', 'Skincare Routine', 'Color Analysis', 'Full Makeover'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: ['#E91E63', '#FFC1CC', '#C2185B', '#FCE4EC']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12 }
          }
        }
      }
    });
  }
  
  // Skin Tone Distribution
  const skinCtx = document.getElementById('skinToneChart');
  if (skinCtx) {
    new Chart(skinCtx, {
      type: 'bar',
      data: {
        labels: ['Fair', 'Light', 'Medium', 'Tan', 'Dark', 'Deep'],
        datasets: [{
          label: 'Users',
          data: [15, 25, 30, 18, 8, 4],
          backgroundColor: '#E91E63'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
  
  // Undertone Chart
  const undertoneCtx = document.getElementById('undertoneChart');
  if (undertoneCtx) {
    new Chart(undertoneCtx, {
      type: 'pie',
      data: {
        labels: ['Cool', 'Warm', 'Neutral'],
        datasets: [{
          data: [30, 45, 25],
          backgroundColor: ['#E6E6FA', '#FFD700', '#F5F5DC']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  
  // Concerns Chart
  const concernsCtx = document.getElementById('concernsChart');
  if (concernsCtx) {
    new Chart(concernsCtx, {
      type: 'horizontalBar',
      data: {
        labels: ['Aging', 'Acne', 'Dryness', 'Oiliness', 'Sensitivity', 'Dark Spots'],
        datasets: [{
          label: 'Reports',
          data: [120, 98, 85, 76, 65, 54],
          backgroundColor: '#C2185B'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } }
      }
    });
  }
}

function loadRecentActivity() {
  const activities = [
    { icon: 'fa-user-plus', text: 'New user registered', time: '2 minutes ago', color: '#667eea' },
    { icon: 'fa-microscope', text: 'AI Analysis completed', time: '5 minutes ago', color: '#f093fb' },
    { icon: 'fa-heart', text: 'Product saved to profile', time: '12 minutes ago', color: '#f5576c' },
    { icon: 'fa-shopping-bag', text: 'Retailer link clicked', time: '18 minutes ago', color: '#4facfe' },
    { icon: 'fa-exclamation-triangle', text: 'Allergy alert triggered', time: '25 minutes ago', color: '#fa709a' }
  ];
  
  const container = document.getElementById('activityList');
  if (container) {
    container.innerHTML = activities.map(a => `
      <div class="activity-item">
        <div class="activity-icon" style="background: ${a.color}20; color: ${a.color}">
          <i class="fas ${a.icon}"></i>
        </div>
        <div class="activity-content">
          <p>${a.text}</p>
          <span>${a.time}</span>
        </div>
      </div>
    `).join('');
  }
}

function loadUsersTable() {
  const users = JSON.parse(localStorage.getItem('oyinx_users')) || [
    { name: 'Sarah Johnson', email: 'sarah.j@email.com', joinDate: '2026-03-28', analyses: 3, saved: 12, lastActive: '2 min ago' },
    { name: 'Emily Chen', email: 'emily.chen@email.com', joinDate: '2026-03-27', analyses: 5, saved: 8, lastActive: '15 min ago' },
    { name: 'Maria Garcia', email: 'maria.g@email.com', joinDate: '2026-03-26', analyses: 2, saved: 5, lastActive: '1 hour ago' },
    { name: 'Jessica Williams', email: 'jess.w@email.com', joinDate: '2026-03-25', analyses: 7, saved: 23, lastActive: '3 hours ago' }
  ];
  
  const tbody = document.getElementById('usersTableBody');
  if (tbody) {
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-thumb">${u.name.split(' ').map(n => n[0]).join('')}</div>
            <span>${u.name}</span>
          </div>
        </td>
        <td>${u.email}</td>
        <td>${u.joinDate}</td>
        <td>${u.analyses}</td>
        <td>${u.saved}</td>
        <td>${u.lastActive}</td>
        <td>
          <div class="action-btns">
            <button class="action-view" title="View"><i class="fas fa-eye"></i></button>
            <button class="action-edit" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="action-delete" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function loadAnalysesGrid() {
  const analyses = [
    { user: 'Sarah J.', skinTone: 'Medium', undertone: 'Warm', faceShape: 'Oval', concern: 'Aging', date: '2026-03-30', match: '98%' },
    { user: 'Emily C.', skinTone: 'Fair', undertone: 'Cool', faceShape: 'Heart', concern: 'Acne', date: '2026-03-30', match: '95%' },
    { user: 'Maria G.', skinTone: 'Tan', undertone: 'Warm', faceShape: 'Round', concern: 'Dryness', date: '2026-03-29', match: '97%' }
  ];
  
  const grid = document.getElementById('analysesGrid');
  if (grid) {
    grid.innerHTML = analyses.map(a => `
      <div class="analysis-card">
        <div class="analysis-header">
          <span class="analysis-user">${a.user}</span>
          <span class="analysis-match">${a.match}</span>
        </div>
        <div class="analysis-details">
          <p><strong>Skin:</strong> ${a.skinTone} (${a.undertone})</p>
          <p><strong>Face:</strong> ${a.faceShape}</p>
          <p><strong>Concern:</strong> ${a.concern}</p>
          <p><strong>Date:</strong> ${a.date}</p>
        </div>
      </div>
    `).join('');
  }
}

function loadAllergyReports() {
  const allergies = [
    { name: 'Fragrance', count: 45 },
    { name: 'Silicone', count: 32 },
    { name: 'Nuts', count: 28 },
    { name: 'Parabens', count: 24 },
    { name: 'Sulfates', count: 19 }
  ];
  
  const container = document.getElementById('commonAllergies');
  if (container) {
    container.innerHTML = allergies.map(a => `
      <div class="allergy-item">
        <span class="allergy-name">${a.name}</span>
        <span class="allergy-count">${a.count}</span>
      </div>
    `).join('');
  }
  
  const safeCount = document.getElementById('safeProductCount');
  if (safeCount) {
    safeCount.textContent = '1,247';
  }
  
  const tbody = document.getElementById('allergyReportsBody');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td>Sarah Johnson</td>
        <td>Fragrance, Parabens</td>
        <td>45 products</td>
        <td>3 warnings</td>
        <td>2026-03-30</td>
      </tr>
      <tr>
        <td>Emily Chen</td>
        <td>Silicone</td>
        <td>62 products</td>
        <td>1 warning</td>
        <td>2026-03-29</td>
      </tr>
    `;
  }
}

function updateBadges() {
  const userBadge = document.getElementById('userBadge');
  const analysisBadge = document.getElementById('analysisBadge');
  
  if (userBadge) userBadge.textContent = Math.floor(Math.random() * 5 + 1);
  if (analysisBadge) analysisBadge.textContent = Math.floor(Math.random() * 10 + 3);
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  
  // Show selected section
  const section = document.getElementById(`${sectionName}Section`);
  if (section) {
    section.classList.add('active');
  }
  
  // Update sidebar
  event.target.closest('.sidebar-link')?.classList.add('active');
  
  // Update title
  const titles = {
    overview: 'Dashboard Overview',
    users: 'User Management',
    analytics: 'Analytics & Insights',
    analyses: 'AI Analyses',
    products: 'Product Management',
    resources: 'Digital Resources',
    allergies: 'Allergy Reports',
    settings: 'Platform Settings'
  };
  
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) {
    titleEl.textContent = titles[sectionName] || 'Dashboard';
  }
  
  AdminState.currentSection = sectionName;
}

function exportData(type) {
  showToast('Export', `${type} data export started...`, 'info');
  setTimeout(() => {
    showToast('Success', 'Export completed! Check your downloads.', 'success');
  }, 1500);
}

function addNewProduct() {
  showToast('Info', 'Product creation form opening...', 'info');
}

function addNewResource() {
  showToast('Info', 'Resource upload form opening...', 'info');
}

function initAdminListeners() {
  // Settings toggles
  document.querySelectorAll('.setting-item input[type="checkbox"]').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const settingName = this.closest('.setting-item').querySelector('label').textContent;
      showToast('Settings', `${settingName} ${this.checked ? 'enabled' : 'disabled'}`, 'success');
    });
  });
}

// Toast function
function showToast(title, message, type = 'info') {
  // Create toast container if not exists
  let container = document.querySelector('.admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
    container.style.cssText = `
      position: fixed;
      top: 100px;
      right: 30px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 15px;
    `;
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: white;
    padding: 20px 25px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 300px;
    animation: slideInRight 0.4s ease;
    border-left: 4px solid ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
  `;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };
  
  toast.innerHTML = `
    <i class="fas ${icons[type]}" style="font-size: 1.5rem; color: ${colors[type]}"></i>
    <div>
      <h4 style="margin: 0; font-size: 1rem; color: #2D1F23;">${title}</h4>
      <p style="margin: 5px 0 0; font-size: 0.9rem; color: #8B6B73;">${message}</p>
    </div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}