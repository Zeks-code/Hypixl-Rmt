// Skyblock RMT - Marketplace JavaScript
// Handles marketplace listings and offer management

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const token = localStorage.getItem('skyblock_rmt_token');
  const userData = token ? JSON.parse(localStorage.getItem('skyblock_rmt_user')) : null;
  
  // Clear any sample listings that might exist from previous versions
  clearSampleListings();
  
  // Load all marketplace listings
  loadMarketplaceListings();
  
  // Setup filter functionality
  setupFilters();
  
  // Setup search functionality
  setupSearch();
  
  // Update all coin listings to use the correct image
  updateCoinListingImages();
});

// Function to load all marketplace listings from localStorage or API
function loadMarketplaceListings() {
  const listingsContainer = document.querySelector('.listings-grid');
  if (!listingsContainer) return;
  
  // Clear existing listings
  listingsContainer.innerHTML = '';
  
  // Get listings from localStorage (in a real app, this would be an API call)
  let listings = JSON.parse(localStorage.getItem('skyblock_rmt_listings')) || [];
  
  // Filter active listings only
  const activeListings = listings.filter(listing => listing.active);
  
  // Update listings count
  const listingsCount = document.getElementById('listings-count');
  if (listingsCount) {
    listingsCount.textContent = activeListings.length;
  }
  
  if (activeListings.length === 0) {
    listingsContainer.innerHTML = `
      <div class="no-listings">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3>No listings found</h3>
        <p>There are no active listings matching your criteria. <a href="create-listing.html" class="create-link">Create a listing</a> to get started!</p>
      </div>
    `;
    return;
  }
  
  // Display listings
  activeListings.forEach(listing => {
    const listingCard = createListingCard(listing);
    listingsContainer.appendChild(listingCard);
  });
}

// Creates a DOM element for a listing card
function createListingCard(listing) {
  const card = document.createElement('div');
  card.className = 'listing-card';
  card.setAttribute('data-id', listing.id);
  card.setAttribute('data-category', listing.category);
  
  // Fix image path logic to use appropriate category icons that exist
  let imageUrl;
  if (listing.images && listing.images.length > 0) {
    imageUrl = listing.images[0];
  } else {
    // Map categories to existing SVG icons
    const categoryIcons = {
      'coins': '4648267406545a74a60b1d.jpg',
      'weapons': 'diamond_sword.svg',
      'armor': 'diamond_block.svg',
      'pets': 'emerald_block.svg',
      'resources': 'iron_block.svg',
      'misc': 'enchanted_book.svg'
    };
    const iconFile = categoryIcons[listing.category] || 'default.svg';
    imageUrl = `../images/products/${iconFile}`;
  }
  
  card.innerHTML = `
    <div class="listing-image">
      <img src="${imageUrl}" alt="${listing.title}" onerror="this.src='../images/products/default.svg'">
      <div class="listing-badge ${listing.category}">${listing.category}</div>
    </div>
    <div class="listing-content">
      <h3 class="listing-title">${listing.title}</h3>
      <div class="listing-seller">
        <img src="../images/seller-icon.svg" alt="Seller">
        <span>${listing.seller}</span>
        <div class="seller-rating">
          ${getStarRating(listing.sellerRating)}
        </div>
      </div>
      <div class="listing-meta">
        <div class="listing-stock">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <span>Stock: ${listing.quantity}</span>
        </div>
        <div class="listing-time">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${getTimeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </div>
    <div class="listing-price">
      <span class="price-value">$${parseFloat(listing.price).toFixed(2)}</span>
      <a href="product.html?id=${listing.id}" class="btn btn-sm btn-primary">View</a>
    </div>
  `;
  
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn')) {
      window.location.href = `product.html?id=${listing.id}`;
    }
  });
  
  return card;
}

// Generates HTML for star ratings
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="star full"></i>';
  }
  
  // Half star
  if (halfStar) {
    starsHtml += '<i class="star half"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="star empty"></i>';
  }
  
  return starsHtml;
}

// Returns a human-readable time string
function getTimeAgo(timestamp) {
  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now - created;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffDay > 0) {
    return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
  }
  if (diffHour > 0) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  }
  if (diffMin > 0) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  }
  return 'Just now';
}

// Creates sample listings for demo purposes - Removed, not using sample listings anymore
function createSampleListings() {
  // This function is kept for reference but not used anymore
  return [];
}

// Setup filter functionality
function setupFilters() {
  const filterOptions = document.querySelectorAll('.filter-option input');
  if (!filterOptions.length) return;
  
  filterOptions.forEach(option => {
    option.addEventListener('change', () => {
      applyFilters();
    });
  });
}

// Apply selected filters
function applyFilters() {
  const selectedCategories = [];
  const categoryCheckboxes = document.querySelectorAll('.category-filter input:checked');
  
  categoryCheckboxes.forEach(checkbox => {
    selectedCategories.push(checkbox.value);
  });
  
  const priceMin = parseFloat(document.querySelector('#price-min')?.value || 0);
  const priceMax = parseFloat(document.querySelector('#price-max')?.value || 1000000);
  
  const listingCards = document.querySelectorAll('.listing-card');
  
  listingCards.forEach(card => {
    const category = card.getAttribute('data-category');
    const price = parseFloat(card.querySelector('.price-value').textContent.replace('$', ''));
    
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
    const priceMatch = price >= priceMin && price <= priceMax;
    
    if (categoryMatch && priceMatch) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', debounce(() => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      document.querySelectorAll('.listing-card').forEach(card => {
        card.style.display = '';
      });
      return;
    }
    
    document.querySelectorAll('.listing-card').forEach(card => {
      const title = card.querySelector('.listing-title').textContent.toLowerCase();
      const description = card.getAttribute('data-description')?.toLowerCase() || '';
      
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }, 300));
}

// Debounce function for search input
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Function to add a new listing and display it immediately in the marketplace
function addNewListing(listingData) {
  // Get existing listings
  let listings = JSON.parse(localStorage.getItem('skyblock_rmt_listings')) || [];
  
  // Create a new listing ID
  const newId = `lst${1000 + listings.length + 1}`;
  
  // Get user data
  const userData = JSON.parse(localStorage.getItem('skyblock_rmt_user')) || {};
  
  // Create the new listing object
  const newListing = {
    id: newId,
    title: listingData.title,
    price: parseFloat(listingData.price),
    category: listingData.category,
    description: listingData.description,
    seller: userData.username || 'Anonymous Seller',
    sellerRating: userData.rating || 4.0,
    quantity: parseInt(listingData.quantity),
    createdAt: new Date().toISOString(),
    images: listingData.images || [],
    active: true
  };
  
  // Ensure coin listings get the proper image if images array is empty
  if (newListing.category === 'coins' && (!newListing.images || newListing.images.length === 0)) {
    newListing.images = ['../images/products/4648267406545a74a60b1d.jpg'];
  }
  
  // Add to listings array
  listings.push(newListing);
  
  // Save to localStorage
  localStorage.setItem('skyblock_rmt_listings', JSON.stringify(listings));
  
  // If we're on the marketplace page, refresh the listings
  if (document.querySelector('.listings-grid')) {
    loadMarketplaceListings();
  }
  
  return newId;
}

// Export functions for other scripts to use
window.skyblockMarketplace = {
  addNewListing,
  loadMarketplaceListings,
  updateListing,
  deleteListing
};

// Clear any sample listings from previous versions
function clearSampleListings() {
  // Check if we've already cleared the sample listings
  const cleared = localStorage.getItem('sample_listings_cleared');
  if (cleared) return;
  
  // Get current listings
  const listings = JSON.parse(localStorage.getItem('skyblock_rmt_listings')) || [];
  
  // Keep only user created listings, filter out the sample ones
  const userListings = listings.filter(listing => {
    // Sample listings have fixed IDs - lst1001, lst1002, lst1003
    return !['lst1001', 'lst1002', 'lst1003'].includes(listing.id);
  });
  
  // Save the filtered listings back to localStorage
  localStorage.setItem('skyblock_rmt_listings', JSON.stringify(userListings));
  
  // Mark that we've cleared the sample listings
  localStorage.setItem('sample_listings_cleared', 'true');
}

// Function to update an existing listing
function updateListing(listingId, updatedData) {
  // Get current listings
  let listings = JSON.parse(localStorage.getItem('skyblock_rmt_listings')) || [];
  
  // Find the listing to update
  const index = listings.findIndex(listing => listing.id === listingId);
  
  if (index !== -1) {
    // Get existing listing and preserve any properties not in the updated data
    const existingListing = listings[index];
    
    // Update the listing with new data, preserving the id, seller, rating, createdAt
    listings[index] = {
      ...existingListing,
      title: updatedData.title,
      price: parseFloat(updatedData.price),
      category: updatedData.category,
      description: updatedData.description,
      quantity: parseInt(updatedData.quantity),
      images: updatedData.images || existingListing.images
    };
    
    // Save updated listings to localStorage
    localStorage.setItem('skyblock_rmt_listings', JSON.stringify(listings));
    
    // If we're on the marketplace page, refresh the listings
    if (document.querySelector('.listings-grid')) {
      loadMarketplaceListings();
    }
    
    return true;
  }
  
  return false;
}

// Function to delete a listing
function deleteListing(listingId) {
  // Get all listings
  let allListings = JSON.parse(localStorage.getItem('skyblock_rmt_listings')) || [];
  
  // Filter out the listing to delete
  allListings = allListings.filter(listing => listing.id !== listingId);
  
  // Save back to localStorage
  localStorage.setItem('skyblock_rmt_listings', JSON.stringify(allListings));
  
  // If we're on the marketplace page, refresh the listings
  if (document.querySelector('.listings-grid')) {
    loadMarketplaceListings();
  }
  
  return true;
}

// Update all coin listings to use the correct image
function updateCoinListingImages() {
  const listings = JSON.parse(localStorage.getItem('skyblock_rmt_listings')) || [];
  let updated = false;
  
  listings.forEach(listing => {
    if (listing.category === 'coins') {
      // Check if using old image path
      if (!listing.images || 
          listing.images.length === 0 || 
          listing.images[0] === '../images/products/gold_block.svg' ||
          listing.images[0] === '../images/products/default.svg') {
        listing.images = ['../images/products/4648267406545a74a60b1d.jpg'];
        updated = true;
      }
    }
  });
  
  if (updated) {
    localStorage.setItem('skyblock_rmt_listings', JSON.stringify(listings));
    console.log('Updated coin listing images to use the correct image path');
  }
} 