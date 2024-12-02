/* eslint-disable no-unused-vars */
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Fungsi untuk membuat JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Registrasi
// exports.registerUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // Cek apakah user sudah ada
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email sudah digunakan' });
//         }

//         // Buat user baru
//         const user = await User.create({ username, email, password });

//         res.status(201).json({
//             _id: user.id,
//             username: user.username,
//             email: user.email,
//             token: generateToken(user._id),
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Login
// exports.loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Cek apakah user ada
//         const user = await User.findOne({ email });
//         if (!user || !(await user.matchPassword(password))) {
//             return res.status(401).json({ message: 'Email atau password salah' });
//         }

//         res.status(200).json({
//             _id: user.id,
//             username: user.username,
//             email: user.email,
//             token: generateToken(user._id),
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Profil User (contoh route yang membutuhkan autentikasi)
// exports.getUserProfile = async (req, res) => {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//         return res.status(404).json({ message: 'User tidak ditemukan' });
//     }

//     res.status(200).json(user);
// };

exports.registerUser = async (req, res) => {
    res.status(201).json({ message: 'Registrasi berhasil (dummy)' });
};

exports.loginUser = async (req, res) => {
    res.status(200).json({
        token: 'dummy-token',
        message: 'Login berhasil (dummy)',
    });
};

exports.getUserProfile = async (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
    });
};
