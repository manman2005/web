const express = require('express');
const router = express.Router();

// Middleware
const { auth } = require('../Middleware/auth');
const { adminCheck } = require('../Middleware/admin');

// Controller
const { createOrder, getOrders, updateOrderStatus } = require('../Controllers/order');

// Routes
router.post('/', auth, createOrder);
router.get('/orders', auth, getOrders);
router.put('/order/order-status', auth, adminCheck, updateOrderStatus);

module.exports = router;