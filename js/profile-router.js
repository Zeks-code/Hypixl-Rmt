// Skyblock RMT - Profile Router
// This script redirects users to the appropriate profile page based on their role

document.addEventListener('DOMContentLoaded', () => {
  // Function to check if we're on an account page that needs redirection
  function checkAndRedirectProfile() {
    // Get current page path
    const path = window.location.pathname;
    
    // Check if we're on the generic profile page that needs redirection
    if (path.endsWith('/profile.html')) {
      const userData = JSON.parse(localStorage.getItem('skyblock_rmt_user'));
      
      if (userData && userData.role) {
        // Redirect based on user role
        if (userData.role.toLowerCase() === 'seller') {
          window.location.href = 'seller-profile.html';
        } else {
          window.location.href = 'buyer-profile.html';
        }
      } else {
        // Default to buyer if no role found
        window.location.href = 'buyer-profile.html';
      }
    }
  }
  
  // Update all profile links to point to the router instead
  function updateProfileLinks() {
    // Get user data
    const userData = JSON.parse(localStorage.getItem('skyblock_rmt_user'));
    
    if (userData && userData.role) {
      // Determine if we're on the index page or a subpage
      const isIndexPage = window.location.pathname.endsWith('/index.html') || 
                          window.location.pathname.endsWith('/') || 
                          window.location.pathname.split('/').pop() === '';
      
      // Select all links that point to profile page
      const profileLinks = document.querySelectorAll('a[href*="profile.html"]');
      
      profileLinks.forEach(link => {
        // Update links based on user role
        const href = link.getAttribute('href');
        let newHref;
        
        if (userData.role.toLowerCase() === 'seller') {
          // Replace the href attribute to point to seller profile
          // Make sure we don't create "seller-seller-profile.html"
          if (href.includes('seller-profile.html')) {
            newHref = href;
          } else {
            newHref = href.replace('profile.html', 'seller-profile.html');
          }
        } else {
          // Replace the href attribute to point to buyer profile
          newHref = href.replace('profile.html', 'buyer-profile.html');
        }
        
        link.setAttribute('href', newHref);
      });
      
      // Also update the header "My Account" link specifically
      const userAccountLinks = document.querySelectorAll('.user-account-link, .username-link');
      userAccountLinks.forEach(link => {
        // Update link text format to have proper parentheses
        const usernameEl = link.querySelector('.username');
        if (usernameEl) {
          const innerHTML = link.innerHTML;
          if (innerHTML.includes('My Account (')) {
            link.innerHTML = innerHTML.replace('My Account (', 'My Account: (');
          }
        }
        
        // Set correct path based on role
        if (userData.role.toLowerCase() === 'seller') {
          link.setAttribute('href', isIndexPage ? 'pages/seller-profile.html' : 'seller-profile.html');
        } else {
          link.setAttribute('href', isIndexPage ? 'pages/buyer-profile.html' : 'buyer-profile.html');
        }
      });
    }
  }
  
  // Run both functions on page load
  checkAndRedirectProfile();
  updateProfileLinks();
}); 