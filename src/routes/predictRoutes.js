const express = require('express');
const { uploadBatikImage, predictBatik } = require('../controllers/predictController');

const router = express.Router();

// Rute untuk prediksi gambar batik
router.post('/predict', uploadBatikImage, predictBatik);

module.exports = router;
