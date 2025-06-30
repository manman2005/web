const express = require('express');
const router = express.Router();

// Middleware
const { auth } = require('../Middleware/auth');
const { adminCheck } = require('../Middleware/admin');

// Controller
const { createOrder, getOrders, getAllOrders, updateOrderStatus } = require('../Controllers/order');

// Routes
router.post('/', auth, createOrder);
router.get('/orders', auth, getOrders); // For user specific orders
router.get('/admin/orders', auth, adminCheck, getAllOrders); // For admin to get all orders
router.put('/order/order-status', auth, adminCheck, updateOrderStatus);

module.exports = router;