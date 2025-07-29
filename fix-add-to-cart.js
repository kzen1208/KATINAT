// Function to ensure all Add to Cart buttons are visible
function ensureAddToCartButtonsVisible() {
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    
    // For each product card, ensure the Add to Cart button is visible
    productCards.forEach(card => {
        const addToCartBtn = card.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.style.display = 'block';
        }
    });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial check for Add to Cart buttons
    ensureAddToCartButtonsVisible();
    
    // Also run after a short delay to catch any dynamically loaded content
    setTimeout(ensureAddToCartButtonsVisible, 500);
});

// Run whenever a category is clicked
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Short delay to allow display changes to take effect
        setTimeout(ensureAddToCartButtonsVisible, 100);
    });
});