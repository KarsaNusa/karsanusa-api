const jwt = require('jsonwebtoken');

// Fungsi untuk menghasilkan token JWT
exports.generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
