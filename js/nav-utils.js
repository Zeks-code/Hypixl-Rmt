// Skyblock RMT - Navigation Utilities
// Author: Skyblock RMT Team
// Version: 1.0.0

/**
 * Ensures the SkyCoins link is always visible in navigation
 * This function should be called after any navigation state changes
 */
function ensureSkyCoinsVisibility() {
  // Find SkyCoins links in both relative and absolute paths
  const skyCoinsLinks = document.querySelectorAll('a[href*="buy-coins.html"]');
  
  skyCoinsLinks.forEach(link => {
    // Always make SkyCoins visible with flex display to align icon properly
    link.style.display = 'flex';
    // Ensure proper alignment of the text and icon
    link.style.alignItems = 'center';
  });
}

/**
 * Updates navigation based on authentication status
 */
function updateNavForAuthStatus() {
  const token = localStorage.getItem('skyblock_rmt_token');
  if (!token) return; // Not logged in
  
  const userData = JSON.parse(localStorage.getItem('skyblock_rmt_user'));
  if (!userData || !userData.role) return;
  
  // Update account links
  const userAccountLinks = document.querySelectorAll('.user-account-link');
  userAccountLinks.forEach(link => {
    // Set appropriate profile link based on role
    if (userData.role.toLowerCase() === 'seller') {
      link.setAttribute('href', 'seller-profile.html');
    } else {
      link.setAttribute('href', 'buyer-profile.html');
    }
    
    // Update username display
    const usernameEl = link.querySelector('.username');
    if (usernameEl) {
      usernameEl.textContent = userData.username;
    }
    
    // Show the account link
    link.style.display = 'inline-block';
  });
  
  // Ensure SkyCoins is visible
  ensureSkyCoinsVisibility();
  
  // Hide login/register when logged in
  const loginLinks = document.querySelectorAll('a[href*="login.html"]');
  const registerLinks = document.querySelectorAll('a[href*="role-selection.html"], a[href*="register.html"]');
  
  loginLinks.forEach(link => {
    link.style.display = 'none';
  });
  
  registerLinks.forEach(link => {
    link.style.display = 'none';
  });
}

// When the DOM is loaded, set up navigation
document.addEventListener('DOMContentLoaded', () => {
  // Initialize nav visibility
  updateNavForAuthStatus();
  
  // Add listener for menu toggle to ensure SkyCoins visibility
  const navToggle = document.querySelector('.mobile-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', ensureSkyCoinsVisibility);
  }
}); 