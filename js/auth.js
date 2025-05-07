// Skyblock RMT - Authentication JavaScript
// Author: Skyblock RMT Team
// Version: 1.0.0

// Simulated authentication state (this would be server-side in production)
let authState = {
  isLoggedIn: false,
  user: null,
  userRole: null
};

// Check if user is logged in
function isLoggedIn() {
  // In a real app, this would check cookies/localStorage or make an API call
  // For now, we'll check our simulated auth state
  const token = localStorage.getItem('skyblock_rmt_token');
  return !!token;
}

// Set logged in state from stored token (run on page load)
function restoreAuthState() {
  const token = localStorage.getItem('skyblock_rmt_token');
  const userData = localStorage.getItem('skyblock_rmt_user');
  
  if (token && userData) {
    authState.isLoggedIn = true;
    authState.user = JSON.parse(userData);
    authState.userRole = authState.user.role;
    
    // Update UI based on auth state
    updateAuthUI();
  }
}

// Update UI elements based on authentication state
function updateAuthUI() {
  const loginLinks = document.querySelectorAll('a[href*="login.html"]');
  const registerLinks = document.querySelectorAll('a[href*="role-selection.html"], a[href*="register.html"]');
  const usernameLinks = document.querySelectorAll('.username-link');
  const usernameElements = document.querySelectorAll('.username');
  const userAccountLinks = document.querySelectorAll('.user-account-link');
  
  if (authState.isLoggedIn && authState.user) {
    // Hide login/register links when logged in
    loginLinks.forEach(link => {
      link.style.display = 'none';
    });
    
    registerLinks.forEach(link => {
      link.style.display = 'none';
    });
    
    // Show username links when logged in
    usernameLinks.forEach(link => {
      link.style.display = 'inline-block';
    });
    
    // Show user account links in header
    userAccountLinks.forEach(link => {
      link.style.display = 'inline-block';
    });
    
    // Update username display
    usernameElements.forEach(el => {
      el.textContent = authState.user.username;
    });
    
    // Make sure profile links point to the correct profile based on role
    updateProfileLinksBasedOnRole();
  } else {
    // Show login/register links when logged out
    loginLinks.forEach(link => {
      link.style.display = 'inline-block';
    });
    
    registerLinks.forEach(link => {
      link.style.display = 'inline-block';
    });
    
    // Hide username links when logged out
    usernameLinks.forEach(link => {
      link.style.display = 'none';
    });
    
    // Hide user account links in header
    userAccountLinks.forEach(link => {
      link.style.display = 'none';
    });
  }
  
  // Run this function immediately after DOM loading as well
  document.addEventListener('DOMContentLoaded', updateAuthUI);
}

// Update profile links based on user role
function updateProfileLinksBasedOnRole() {
  if (!authState.isLoggedIn || !authState.user) return;
  
  const userData = authState.user;
  const isIndexPage = window.location.pathname.endsWith('/index.html') || 
                      window.location.pathname.endsWith('/') || 
                      window.location.pathname.split('/').pop() === '';
  
  // Select all profile links
  const profileLinks = document.querySelectorAll('a[href*="profile.html"], a[href*="buyer-profile.html"], a[href*="seller-profile.html"]');
  
  profileLinks.forEach(link => {
    // Update links based on user role
    let newHref;
    
    if (userData.role && userData.role.toLowerCase() === 'seller') {
      // Point to seller profile
      newHref = isIndexPage ? 'pages/seller-profile.html' : 'seller-profile.html';
    } else {
      // Point to buyer profile (default)
      newHref = isIndexPage ? 'pages/buyer-profile.html' : 'buyer-profile.html';
    }
    
    link.setAttribute('href', newHref);
    link.style.display = 'inline-block'; // Ensure visibility
  });
  
  // Also update the specific classes used for these links
  const userSpecificLinks = document.querySelectorAll('.user-account-link, .username-link');
  userSpecificLinks.forEach(link => {
    // Update link text to make sure it's correct
    const usernameEl = link.querySelector('.username');
    if (usernameEl) {
      usernameEl.textContent = userData.username;
    }
    
    // Set the href appropriately
    if (userData.role && userData.role.toLowerCase() === 'seller') {
      link.setAttribute('href', isIndexPage ? 'pages/seller-profile.html' : 'seller-profile.html');
    } else {
      link.setAttribute('href', isIndexPage ? 'pages/buyer-profile.html' : 'buyer-profile.html');
    }
    
    link.style.display = 'inline-block'; // Ensure visibility
  });
}

// Handle login attempts
function login(username, password, selectedRole) {
  // In a real app, this would be an API call
  // For demo purposes, just simulate a successful login
  
  // Simulated server response
  const success = true;
  
  // Use explicitly provided role if available, otherwise determine from username
  const role = selectedRole || (username.includes('seller') ? 'seller' : 'buyer');
  
  const user = {
    id: '123456',
    username: username,
    role: role,
    email: `${username}@example.com`
  };
  
  if (success) {
    // Store auth info (in a real app, this would be a JWT token)
    const token = 'simulated_jwt_token_' + Date.now();
    localStorage.setItem('skyblock_rmt_token', token);
    localStorage.setItem('skyblock_rmt_user', JSON.stringify(user));
    
    // Update auth state
    authState.isLoggedIn = true;
    authState.user = user;
    authState.userRole = user.role;
    
    // Update UI
    updateAuthUI();
    
    return true;
  }
  
  return false;
}

// Handle logout
function logout() {
  // Clear stored auth data
  localStorage.removeItem('skyblock_rmt_token');
  localStorage.removeItem('skyblock_rmt_user');
  
  // Reset auth state
  authState.isLoggedIn = false;
  authState.user = null;
  authState.userRole = null;
  
  // Update UI
  updateAuthUI();
  
  // Redirect to home page
  window.location.href = '../index.html';
}

// Handle buy button clicks
function handleBuyButtonClick(event) {
  // Check if user is logged in
  if (!isLoggedIn()) {
    event.preventDefault();
    
    // Store the item details or URL to return after login
    const productItem = event.target.closest('.product-item');
    if (productItem) {
      const productName = productItem.querySelector('h3').textContent;
      localStorage.setItem('skyblock_rmt_pending_purchase', productName);
    }
    
    // Redirect to login page with return parameter
    window.location.href = 'login.html?returnTo=marketplace.html';
    return false;
  }
  
  return true; // Continue with purchase if logged in
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Restore auth state from storage
  restoreAuthState();
  
  // Make sure to update profile links manually here in case restoreAuthState didn't run
  if (isLoggedIn()) {
    updateProfileLinksBasedOnRole();
  }
  
  // Set up buy button event listeners
  const buyButtons = document.querySelectorAll('.btn-accent');
  buyButtons.forEach(button => {
    if (button.textContent.trim() === 'Buy Now') {
      button.addEventListener('click', handleBuyButtonClick);
    }
  });
  
  // Handle logout button clicks
  const logoutButtons = document.querySelectorAll('.logout-button');
  logoutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });
  
  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const roleSelect = document.getElementById('role-select');
      const selectedRole = roleSelect ? roleSelect.value : null;
      
      if (login(username, password, selectedRole)) {
        // Check if there's a returnTo parameter
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('returnTo');
        
        if (returnTo) {
          window.location.href = returnTo;
        } else {
          // Redirect based on user role
          const userData = JSON.parse(localStorage.getItem('skyblock_rmt_user'));
          if (userData && userData.role) {
            if (userData.role.toLowerCase() === 'seller') {
              window.location.href = 'seller-profile.html';
            } else {
              window.location.href = 'buyer-profile.html';
            }
          } else {
            window.location.href = 'buyer-profile.html'; // Default to buyer
          }
        }
      } else {
        // Show login error
        const errorContainer = document.querySelector('.login-error');
        if (errorContainer) {
          errorContainer.textContent = 'Invalid username or password';
          errorContainer.style.display = 'block';
        }
      }
    });
  }
  
  // Immediately update the auth UI on page load
  updateAuthUI();
}); 