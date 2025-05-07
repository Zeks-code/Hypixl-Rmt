// Test script for Profile Routing
// This script allows you to quickly test the profile routing functionality

function testProfileRouting() {
  console.log('Testing profile routing...');
  
  // Create test user data
  function createTestUser(role) {
    const userData = {
      id: 'test-123',
      username: `test-${role}`,
      role: role,
      email: `test-${role}@example.com`
    };
    
    // Save to localStorage
    localStorage.setItem('skyblock_rmt_token', 'test_token_' + Date.now());
    localStorage.setItem('skyblock_rmt_user', JSON.stringify(userData));
    
    console.log(`Created test ${role} user:`, userData);
    
    // Refresh page to see the effect
    location.reload();
  }
  
  // Function to add test buttons to page
  function addTestButtons() {
    // Create test panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    panel.style.padding = '10px';
    panel.style.borderRadius = '5px';
    panel.style.zIndex = '9999';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '5px';
    
    // Add title
    const title = document.createElement('div');
    title.textContent = 'Test Profile Routing';
    title.style.color = 'white';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    panel.appendChild(title);
    
    // Add seller button
    const sellerBtn = document.createElement('button');
    sellerBtn.textContent = 'Set as Seller';
    sellerBtn.onclick = () => createTestUser('seller');
    panel.appendChild(sellerBtn);
    
    // Add buyer button
    const buyerBtn = document.createElement('button');
    buyerBtn.textContent = 'Set as Buyer';
    buyerBtn.onclick = () => createTestUser('buyer');
    panel.appendChild(buyerBtn);
    
    // Add logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = () => {
      localStorage.removeItem('skyblock_rmt_token');
      localStorage.removeItem('skyblock_rmt_user');
      location.reload();
    };
    panel.appendChild(logoutBtn);
    
    // Add current status
    const status = document.createElement('div');
    status.style.color = 'white';
    status.style.fontSize = '12px';
    status.style.marginTop = '5px';
    
    const userData = JSON.parse(localStorage.getItem('skyblock_rmt_user'));
    if (userData) {
      status.textContent = `Current: ${userData.username} (${userData.role})`;
    } else {
      status.textContent = 'Current: Logged out';
    }
    
    panel.appendChild(status);
    
    // Add to page
    document.body.appendChild(panel);
  }
  
  // Add test buttons
  addTestButtons();
}

// Run the test function when page loads
document.addEventListener('DOMContentLoaded', testProfileRouting); 