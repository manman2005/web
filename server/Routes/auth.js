const express = require('express')
const router = express.Router()


const { register ,login, listUsers, updateUser } = require( '../Controllers/auth')
const { auth } = require('../Middleware/auth');
const { adminCheck } = require('../Middleware/admin');


// http://localhost:5000/api/register
router.post('/register',register)
router.post('/login',login)

// Admin routes for user management
router.get('/users', auth, adminCheck, listUsers);
router.put('/users/:id', auth, adminCheck, updateUser);


module.exports = router