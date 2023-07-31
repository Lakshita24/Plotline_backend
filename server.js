const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Sample data to store products and services (this can be replaced with a database)
const products = [
  { id: 1, name: 'Product A', type: 'product', price: 1500 },
  { id: 2, name: 'Product B', type: 'product', price: 4500 },
  { id: 3, name: 'Product C', type: 'product', price: 8000 },
];

const services = [
  { id: 1, name: 'Service X', type: 'service', price: 1200 },
  { id: 2, name: 'Service Y', type: 'service', price: 6000 },
  { id: 3, name: 'Service Z', type: 'service', price: 10000 },
];

// Sample data to store user carts (this can be replaced with a database)
const carts = {};

// Endpoint to create a new user account
app.post('/api/user/create', (req, res) => {
  const { userId } = req.body;
  if (carts[userId]) {
    return res.status(409).json({ error: 'User account already exists.' });
  }
  carts[userId] = [];
  res.json({ message: 'User account created successfully.' });
});

// Endpoint to fetch all products and services information with their prices
app.get('/api/products', (req, res) => {
  res.json({ products, services });
});

// Helper function to find a product or service by ID
function findItemById(itemId) {
  const item = [...products, ...services].find(item => item.id === itemId);
  return item;
}

// Endpoint to add a product or service to the user's cart
app.post('/api/user/cart/add', (req, res) => {
  const { userId, itemId, quantity } = req.body;
  if (!carts[userId]) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const itemToAdd = findItemById(itemId);
  if (!itemToAdd) {
    return res.status(404).json({ error: 'Item not found.' });
  }
  carts[userId].push({ ...itemToAdd, quantity });
  res.json({ message: 'Item added to the cart successfully.' });
});

// Endpoint to remove a product or service from the user's cart
app.post('/api/user/cart/remove', (req, res) => {
  const { userId, itemId } = req.body;
  if (!carts[userId]) {
    return res.status(404).json({ error: 'User not found.' });
  }
  carts[userId] = carts[userId].filter(item => item.id !== itemId);
  res.json({ message: 'Item removed from the cart successfully.' });
});

// Endpoint to clear the user's cart
app.post('/api/user/cart/clear', (req, res) => {
  const { userId } = req.body;
  if (!carts[userId]) {
    return res.status(404).json({ error: 'User not found.' });
  }
  carts[userId] = [];
  res.json({ message: 'Cart cleared successfully.' });
});

// Helper function to calculate tax for an item
function calculateTax(item) {
  if (item.type === 'product') {
    if (item.price > 1000 && item.price <= 5000) {
      return item.price * 0.12; // Apply Tax PA
    } else if (item.price > 5000) {
      return item.price * 0.18; // Apply Tax PB
    } else {
      return 200; // Apply Tax PC
    }
  } else if (item.type === 'service') {
    if (item.price > 1000 && item.price <= 8000) {
      return item.price * 0.1; // Apply Tax SA
    } else if (item.price > 8000) {
      return item.price * 0.15; // Apply Tax SB
    } else {
      return 100; // Apply Tax SC
    }
  }
}

// Endpoint to view the total bill (including tax) during checkout
app.get('/api/user/cart/totalBill', (req, res) => {
  const { userId } = req.query;
  if (!carts[userId]) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Calculate total bill by applying taxes to each item
  const cartItems = carts[userId];
  let totalBill = 0;

  cartItems.forEach(item => {
    const tax = calculateTax(item);
    totalBill += item.price * item.quantity + tax;
    item.tax = tax;
  });

  res.json({ cartItems, totalBill });
});

// Endpoint to confirm the order
app.post('/api/user/cart/confirmOrder', (req, res) => {
  const { userId } = req.body;
  if (!carts[userId]) {
    return res.status(404).json({ error: 'User not found.' });
  }
  
  // Perform any necessary actions to confirm the order (e.g., save the order in a database)

  res.json({ message: 'Order confirmed successfully.' });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
