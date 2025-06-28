const express = require('express');
const router = express.Router();
const { read, list, create, update, remove } = require('../Controllers/product');
const { auth } = require('../Middleware/auth');

// GET /api/products (public)
router.get('/', list);
router.get('', list);

// GET /api/products/:id (public)
router.get('/:id', read);

// POST /api/products (protected)
router.post('/', auth, create);

// PUT /api/products/:id (protected)
router.put('/:id', auth, update);

// DELETE /api/products/:id (protected)
router.delete('/:id', auth, remove);

module.exports = router;