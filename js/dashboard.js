// Skyblock RMT - Dashboard JavaScript
// Handles dashboard statistics and data visualization

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const token = localStorage.getItem('skyblock_rmt_token');
  if (!token) return;
  
  // Get the user data
  const userData = JSON.parse(localStorage.getItem('skyblock_rmt_user'));
  if (!userData || userData.role !== 'seller') return;
  
  // Load dashboard statistics
  loadDashboardStats(userData.username);
  
  // Load recent orders
  loadRecentOrders(userData.username);
  
  // Load recent listings
  loadRecentListings(userData.username);
  
  // Set up date filter dropdown
  setupDateFilter();
});

// Load dashboard statistics
function loadDashboardStats(username) {
  // Get elements
  const totalSalesElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
  const ordersElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
  const activeListingsElement = document.querySelector('.stat-card:nth-child(3) .stat-value');
  const ratingElement = document.querySelector('.stat-card:nth-child(4) .stat-value');
  
  const totalSalesTrendElement = document.querySelector('.stat-card:nth-child(1) .stat-trend');
  const ordersTrendElement = document.querySelector('.stat-card:nth-child(2) .stat-trend');
  const activeListingsTrendElement = document.querySelector('.stat-card:nth-child(3) .stat-trend');
  const ratingTrendElement = document.querySelector('.stat-card:nth-child(4) .stat-trend');
  
  // Get date filter value (30, 7, or 1 days)
  const days = parseInt(document.querySelector('.filter-dropdown span').textContent);
  
  // Calculate dates
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);
  
  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(previousStartDate.getDate() - days);
  
  // Get orders data
  const allOrders = JSON.parse(localStorage.getItem('skyblock_rmt_orders')) || [];
  const sellerOrders = allOrders.filter(order => order.seller === username);
  
  // Current period orders
  const currentPeriodOrders = sellerOrders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= startDate && orderDate <= today;
  });
  
  // Previous period orders (for comparison)
  const previousPeriodOrders = sellerOrders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= previousStartDate && orderDate < startDate;
  });
  
  // Get listings data
  const allListings = JSON.parse(localStorage.getItem('skyblock_rmt_listings')) || [];
  const sellerListings = allListings.filter(listing => listing.seller === username);
  const activeListings = sellerListings.filter(listing => listing.active === true);
  
  // Calculate statistics
  
  // 1. Total Sales
  const totalSales = currentPeriodOrders.reduce((sum, order) => sum + order.amount, 0);
  const previousTotalSales = previousPeriodOrders.reduce((sum, order) => sum + order.amount, 0);
  const salesPercentChange = previousTotalSales === 0 ? 100 : ((totalSales - previousTotalSales) / previousTotalSales) * 100;
  
  // 2. Orders Count
  const ordersCount = currentPeriodOrders.length;
  const previousOrdersCount = previousPeriodOrders.length;
  const ordersPercentChange = previousOrdersCount === 0 ? 100 : ((ordersCount - previousOrdersCount) / previousOrdersCount) * 100;
  
  // 3. Active Listings
  const activeListingsCount = activeListings.length;
  const previousActiveListingsCount = activeListingsCount; // We don't have historical data
  const listingsPercentChange = 0; // Assume no change
  
  // 4. Rating
  // Get average rating from all orders
  let totalRating = 0;
  let ratingCount = 0;
  sellerListings.forEach(listing => {
    if (listing.sellerRating) {
      totalRating += listing.sellerRating;
      ratingCount++;
    }
  });
  const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
  const ratingChange = 0.2; // Placeholder, we don't have historical rating data
  
  // Update the UI
  if (totalSalesElement) totalSalesElement.textContent = `$${totalSales.toFixed(2)}`;
  if (ordersElement) ordersElement.textContent = ordersCount;
  if (activeListingsElement) activeListingsElement.textContent = activeListingsCount;
  if (ratingElement) ratingElement.textContent = averageRating.toFixed(1);
  
  // Update trend indicators
  if (totalSalesTrendElement) {
    totalSalesTrendElement.textContent = `${salesPercentChange >= 0 ? '+' : ''}${salesPercentChange.toFixed(1)}%`;
    totalSalesTrendElement.className = `stat-trend ${salesPercentChange === 0 ? 'neutral' : salesPercentChange < 0 ? 'negative' : ''}`;
  }
  
  if (ordersTrendElement) {
    ordersTrendElement.textContent = `${ordersPercentChange >= 0 ? '+' : ''}${ordersPercentChange.toFixed(1)}%`;
    ordersTrendElement.className = `stat-trend ${ordersPercentChange === 0 ? 'neutral' : ordersPercentChange < 0 ? 'negative' : ''}`;
  }
  
  if (activeListingsTrendElement) {
    activeListingsTrendElement.textContent = `${listingsPercentChange}%`;
    activeListingsTrendElement.className = `stat-trend ${listingsPercentChange === 0 ? 'neutral' : listingsPercentChange < 0 ? 'negative' : ''}`;
  }
  
  if (ratingTrendElement) {
    ratingTrendElement.textContent = `+${ratingChange}`;
    ratingTrendElement.className = `stat-trend`;
  }
}

// Setup date filter dropdown
function setupDateFilter() {
  const filterDropdown = document.querySelector('.filter-dropdown');
  if (!filterDropdown) return;
  
  filterDropdown.addEventListener('click', function() {
    const currentDays = parseInt(this.querySelector('span').textContent);
    
    // Cycle through 30, 7, and 1 days
    let newDays;
    if (currentDays === 30) newDays = 7;
    else if (currentDays === 7) newDays = 1;
    else newDays = 30;
    
    this.querySelector('span').textContent = newDays;
    
    // Reload stats with new date range
    const userData = JSON.parse(localStorage.getItem('skyblock_rmt_user'));
    if (userData) {
      loadDashboardStats(userData.username);
    }
  });
}

// Load recent orders for the dashboard
function loadRecentOrders(username) {
  const recentOrdersContainer = document.getElementById('recent-orders');
  if (!recentOrdersContainer) return;
  
  // Get all orders for this seller
  const allOrders = JSON.parse(localStorage.getItem('skyblock_rmt_orders')) || [];
  const sellerOrders = allOrders.filter(order => order.seller === username);
  
  // Sort by date (newest first)
  sellerOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Take the 5 most recent orders
  const recentOrders = sellerOrders.slice(0, 5);
  
  // Clear the loading message
  recentOrdersContainer.innerHTML = '';
  
  // Check if we have any orders
  if (recentOrders.length === 0) {
    recentOrdersContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <h4>No orders yet</h4>
        <p>Your recent orders will appear here when you receive them.</p>
      </div>
    `;
    return;
  }
  
  // Create a table for the orders
  const orderTable = document.createElement('table');
  orderTable.className = 'dashboard-table';
  
  // Create table header
  const tableHeader = document.createElement('thead');
  tableHeader.innerHTML = `
    <tr>
      <th>Order ID</th>
      <th>Buyer</th>
      <th>Product</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Date</th>
    </tr>
  `;
  orderTable.appendChild(tableHeader);
  
  // Create table body
  const tableBody = document.createElement('tbody');
  
  // Add order rows
  recentOrders.forEach(order => {
    const row = document.createElement('tr');
    
    // Format date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString();
    
    // Get status class
    let statusClass = '';
    if (order.status === 'pending') statusClass = 'status-pending';
    else if (order.status === 'processing') statusClass = 'status-processing';
    else if (order.status === 'completed') statusClass = 'status-completed';
    
    row.innerHTML = `
      <td><a href="orders.html">${order.id}</a></td>
      <td>${order.buyer}</td>
      <td class="product-title">${order.productTitle}</td>
      <td class="amount">$${parseFloat(order.amount).toFixed(2)}</td>
      <td><span class="status-badge ${statusClass}">${order.status}</span></td>
      <td>${formattedDate}</td>
    `;
    
    tableBody.appendChild(row);
  });
  
  orderTable.appendChild(tableBody);
  recentOrdersContainer.appendChild(orderTable);
}

// Load recent listings for the dashboard
function loadRecentListings(username) {
  const recentListingsContainer = document.getElementById('recent-listings');
  if (!recentListingsContainer) return;
  
  // Get all listings for this seller
  const allListings = JSON.parse(localStorage.getItem('skyblock_rmt_listings')) || [];
  const sellerListings = allListings.filter(listing => listing.seller === username);
  
  // Sort by date (newest first)
  sellerListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Take the 5 most recent listings
  const recentListings = sellerListings.slice(0, 5);
  
  // Clear the loading message
  recentListingsContainer.innerHTML = '';
  
  // Check if we have any listings
  if (recentListings.length === 0) {
    recentListingsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <h4>No listings yet</h4>
        <p>Create your first listing to start selling on Skyblock RMT!</p>
        <a href="create-listing.html" class="btn btn-primary" style="margin-top: 15px;">Create Listing</a>
      </div>
    `;
    return;
  }
  
  // Create a table for the listings
  const listingTable = document.createElement('table');
  listingTable.className = 'dashboard-table';
  
  // Create table header
  const tableHeader = document.createElement('thead');
  tableHeader.innerHTML = `
    <tr>
      <th>Title</th>
      <th>Category</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Status</th>
      <th>Created</th>
    </tr>
  `;
  listingTable.appendChild(tableHeader);
  
  // Create table body
  const tableBody = document.createElement('tbody');
  
  // Add listing rows
  recentListings.forEach(listing => {
    const row = document.createElement('tr');
    
    // Format date
    const createdDate = new Date(listing.createdAt);
    const formattedDate = createdDate.toLocaleDateString();
    
    // Get status
    const status = listing.active ? 'Active' : 'Inactive';
    const statusClass = listing.active ? 'status-completed' : 'status-pending';
    
    row.innerHTML = `
      <td class="product-title"><a href="product.html?id=${listing.id}">${listing.title}</a></td>
      <td>${listing.category}</td>
      <td class="amount">$${parseFloat(listing.price).toFixed(2)}</td>
      <td>${listing.quantity}</td>
      <td><span class="status-badge ${statusClass}">${status}</span></td>
      <td>${formattedDate}</td>
    `;
    
    tableBody.appendChild(row);
  });
  
  listingTable.appendChild(tableBody);
  recentListingsContainer.appendChild(listingTable);
}

// Initialize dashboard
window.dashboard = {
  loadDashboardStats,
  loadRecentOrders,
  loadRecentListings,
  setupDateFilter
}; 