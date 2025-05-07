// Skyblock RMT - Orders JavaScript
// Handles orders management for the marketplace

// Global orders array to store orders in localStorage
let orders = [];

// Initialize the orders system
document.addEventListener('DOMContentLoaded', () => {
  // Load orders from localStorage or create a default empty array
  initializeOrdersSystem();
  
  // Clear any sample orders that were created for demo purposes
  clearSampleOrders();
});

// Initialize the orders system
function initializeOrdersSystem() {
  // Check if we already have orders in localStorage
  if (!localStorage.getItem('skyblock_rmt_orders')) {
    // Create the initial empty orders array
    localStorage.setItem('skyblock_rmt_orders', JSON.stringify([]));
  }
  
  // Load orders from localStorage
  orders = JSON.parse(localStorage.getItem('skyblock_rmt_orders')) || [];
}

// Clear sample orders function
function clearSampleOrders() {
  // Get existing orders
  const orders = JSON.parse(localStorage.getItem('skyblock_rmt_orders')) || [];
  
  // Filter out sample orders (they have specific IDs or are from sample buyers/sellers)
  const filteredOrders = orders.filter(order => {
    // Check if this is a sample order based on known sample attributes
    const isSampleBuyer = ['MinecraftPlayer123', 'SkyblockPro99', 'DungeonRunner42'].includes(order.buyer);
    const isSampleProduct = ['Hypixel Coin Pack (100M)', 'Mythic Sword (Maxed)', 'Rare Armor Set'].includes(order.productTitle);
    
    // If both conditions are met, it's likely a sample order
    return !(isSampleBuyer && isSampleProduct);
  });
  
  // Save the filtered orders back to localStorage
  localStorage.setItem('skyblock_rmt_orders', JSON.stringify(filteredOrders));
}

// Create a new order
function createOrder(orderData) {
  // Get existing orders
  const orders = JSON.parse(localStorage.getItem('skyblock_rmt_orders')) || [];
  
  // Generate a new order ID (format: ORD-YYYY-XXXX)
  const year = new Date().getFullYear();
  const orderNumber = orders.length + 1;
  const orderId = `ORD-${year}-${orderNumber.toString().padStart(4, '0')}`;
  
  // Create the new order object
  const newOrder = {
    id: orderId,
    productId: orderData.productId,
    productTitle: orderData.productTitle,
    buyer: orderData.buyer,
    seller: orderData.seller,
    amount: parseFloat(orderData.amount),
    date: new Date().toISOString(),
    status: 'pending', // initial status is 'pending'
    actions: [] // will track order actions/history
  };
  
  // Add to orders array
  orders.push(newOrder);
  
  // Save to localStorage
  localStorage.setItem('skyblock_rmt_orders', JSON.stringify(orders));
  
  return orderId;
}

// Get user's orders (seller or buyer)
function getUserOrders(username, role) {
  const orders = JSON.parse(localStorage.getItem('skyblock_rmt_orders')) || [];
  
  // Filter orders based on user's role (seller or buyer)
  return orders.filter(order => {
    if (role.toLowerCase() === 'seller') {
      return order.seller === username;
    } else {
      return order.buyer === username;
    }
  });
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
  // Get all orders
  const orders = JSON.parse(localStorage.getItem('skyblock_rmt_orders')) || [];
  
  // Find the order to update
  const index = orders.findIndex(order => order.id === orderId);
  
  if (index !== -1) {
    // Add action to the order history
    const action = {
      date: new Date().toISOString(),
      type: 'status_change',
      from: orders[index].status,
      to: newStatus
    };
    
    // Update the order status and add the action to history
    orders[index].status = newStatus;
    if (!orders[index].actions) {
      orders[index].actions = [];
    }
    orders[index].actions.push(action);
    
    // Save the updated orders array to localStorage
    localStorage.setItem('skyblock_rmt_orders', JSON.stringify(orders));
    
    return true;
  }
  
  return false;
}

// Get order details
function getOrderDetails(orderId) {
  const orders = JSON.parse(localStorage.getItem('skyblock_rmt_orders')) || [];
  return orders.find(order => order.id === orderId);
}

// Export functions for other scripts to use
window.skyblockOrders = {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderDetails
}; 