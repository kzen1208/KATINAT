// Function to synchronize cart count between desktop and mobile cart icons
function syncCartCount() {
  // Get the cart count from header cart icon
  const headerCartCount = document.querySelector('.header .cart-count');
  // Get the cart badge from mobile bottom nav
  const mobileCartBadge = document.querySelector('.mobile-bottom-nav .cart-badge');
  
  // If both elements exist, sync the count
  if (headerCartCount && mobileCartBadge) {
    const count = headerCartCount.textContent;
    mobileCartBadge.textContent = count;
  }
}

// Update cart count when cart is modified
function updateCartCount(count) {
  // Update header cart count
  const headerCartCount = document.querySelector('.header .cart-count');
  if (headerCartCount) {
    headerCartCount.textContent = count;
  }
  
  // Update mobile cart badge
  const mobileCartBadge = document.querySelector('.mobile-bottom-nav .cart-badge');
  if (mobileCartBadge) {
    mobileCartBadge.textContent = count;
  }
}

// Run sync on page load
document.addEventListener('DOMContentLoaded', syncCartCount);