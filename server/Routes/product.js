const express = require('express');
const router = express.Router();
const { read, list, create, update, remove } = require('../Controllers/product');
const { auth } = require('../Middleware/auth');
const { adminCheck } = require('../Middleware/admin');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and JPG images are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// GET /api/products (public)
router.get('/', list);

// GET /api/products/:id (public)
router.get('/:id', read);

// POST /api/products (protected, admin only)
router.post('/', auth, adminCheck, upload.array('images', 5), create);

// PUT /api/products/:id (protected, admin only)
router.put('/:id', auth, adminCheck, upload.array('images', 5), update);

// DELETE /api/products/:id (protected, admin only)
router.delete('/:id', auth, adminCheck, remove);

module.exports = router;