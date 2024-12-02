/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// exports.protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             // Ambil token dari header
//             token = req.headers.authorization.split(' ')[1];

//             // Verifikasi token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             // Ambil user dari token
//             req.user = await User.findById(decoded.id).select('-password');

//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };


exports.protect = (req, res, next) => {
    // Simulasi validasi token berhasil
    req.user = {
        _id: 'dummy_user_id',
        username: 'dummy_user',
        email: 'dummy_user@example.com',
    };
    next();
};
