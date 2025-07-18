const express = require('express');
const router = express.Router();
const { createProductReview } = require('../controllers/review');
const { auth } = require('../middleware/auth');

router.route('/:id/reviews').post(auth, createProductReview);

module.exports = router;