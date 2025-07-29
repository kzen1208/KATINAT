// Mobile-specific functions
function toggleMobileMenu() {
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    sidebarOverlay.classList.toggle('active');
    
    // Toggle body scroll
    document.body.classList.toggle('menu-open');
}

function closeSidebar() {
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    sidebarOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function toggleSearch() {
    // Không cần thực hiện gì vì search box đã hiển thị trực tiếp trong header
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.focus();
    }
}

// Handle search
function handleSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) return;
    
    // Redirect to menu page with search
    window.location.href = `menu.html?search=${encodeURIComponent(searchTerm)}`;
}

// Add event listeners for search
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search-box .search-btn');
    const searchInput = document.querySelector('.search-box input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});

// Copy promo code function
function copyPromoCode() {
    const promoCode = document.getElementById('promoCode').textContent;
    navigator.clipboard.writeText(promoCode).then(() => {
        showNotification('Đã sao chép mã khuyến mãi!', 'success');
    });
}

// Initialize mobile functions
document.addEventListener('DOMContentLoaded', function() {
    // Auto-show promo modal after 2 seconds
    setTimeout(() => {
        const promoOverlay = document.getElementById('promoOverlay');
        if (promoOverlay) {
            promoOverlay.style.display = 'flex';
        }
    }, 2000);
    
    // Ensure cart function works
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn && !cartBtn.onclick) {
        cartBtn.addEventListener('click', openCart);
    }
    
    // Close sidebar when clicking on overlay
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function(e) {
            if (e.target === sidebarOverlay) {
                closeSidebar();
            }
        });
    }
    
    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
});