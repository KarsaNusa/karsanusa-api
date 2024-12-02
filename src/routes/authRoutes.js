const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Registrasi
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Profil user (dilindungi middleware)
router.get('/profile', protect, getUserProfile);

module.exports = router;
