// Skyblock RMT - Main JavaScript
// Author: Skyblock RMT Team
// Version: 1.0.0

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('nav');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      navToggle.classList.toggle('active');
      
      // Ensure SkyCoins link visibility when menu is toggled
      ensureSkyCoinsVisibility();
    });
  }
  
  // Function to ensure SkyCoins link is visible
  function ensureSkyCoinsVisibility() {
    const skyCoinsLinks = document.querySelectorAll('a[href*="buy-coins.html"]');
    skyCoinsLinks.forEach(link => {
      link.style.display = 'flex';
      link.style.alignItems = 'center';
      
      // Make sure the icon is visible if it exists
      const icon = link.querySelector('img');
      if (icon) {
        icon.style.display = 'inline';
      } else {
        // If the icon is missing, recreate it
        const isOnSkyCoinsPage = window.location.href.includes('buy-coins.html');
        if (isOnSkyCoinsPage) {
          // Create the icon if it's missing
          const iconImg = document.createElement('img');
          iconImg.src = '../images/coin-icon.svg';
          iconImg.alt = 'SkyCoins';
          iconImg.style.width = '16px';
          iconImg.style.height = '16px';
          iconImg.style.marginRight = '4px';
          iconImg.style.verticalAlign = '-2px';
          link.insertBefore(iconImg, link.firstChild);
        }
      }
    });
  }
  
  // Run the SkyCoins visibility function on page load
  ensureSkyCoinsVisibility();
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for header
          behavior: 'smooth'
        });
        
        // Close mobile nav if open
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          navToggle.classList.remove('active');
        }
      }
    });
  });
  
  // Add scroll animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-in, .feature-card, .product-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  };
  
  // Run on scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Run once on load
  animateOnScroll();
  
  // Product slider functionality (optional)
  const setupProductSlider = () => {
    const slider = document.querySelector('.product-slider');
    if (!slider) return;
    
    // Add touch swipe functionality for mobile
    let startX, moveX;
    let isDown = false;
    
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX;
    });
    
    slider.addEventListener('mouseleave', () => {
      isDown = false;
    });
    
    slider.addEventListener('mouseup', () => {
      isDown = false;
    });
    
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      moveX = e.pageX;
      const walk = (moveX - startX) * 2; // Scroll speed
      slider.scrollLeft = slider.scrollLeft - walk;
    });
    
    // Touch events for mobile
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
    });
    
    slider.addEventListener('touchmove', (e) => {
      moveX = e.touches[0].pageX;
      const walk = (moveX - startX) * 2;
      slider.scrollLeft = slider.scrollLeft - walk;
    });
  };
  
  // Initialize product slider if present
  setupProductSlider();
  
  // Form validation
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          // Add error class
          field.classList.add('error');
          
          // Create error message if doesn't exist
          let errorMsg = field.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('p');
            errorMsg.classList.add('error-message');
            errorMsg.textContent = 'This field is required';
            field.insertAdjacentElement('afterend', errorMsg);
          }
        } else {
          // Remove error class and message
          field.classList.remove('error');
          const errorMsg = field.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
          }
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
  
  // Neon glow effect for buttons
  const glowButtons = document.querySelectorAll('.btn-primary');
  
  glowButtons.forEach(button => {
    button.addEventListener('mouseover', () => {
      button.classList.add('pulse');
    });
    
    button.addEventListener('mouseout', () => {
      button.classList.remove('pulse');
    });
  });
}); 