const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Registrasi
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profil user (dilindungi middleware)
router.get("/profile", protect, getUserProfile);

let model;

// Load model saat server mulai
(async () => {
  // eslint-disable-next-line no-undef
  model = await tf.loadLayersModel("https://storage.googleapis.com/ml-models-karsanusa/best_model.h5");
  console.log("Model berhasil dimuat");
})();

router.post("/predict", async (req, res) => {
  try {
    if (!model) {
      return res.status(500).send('Model belum dimuat');
  }
    const inputData = req.body.inputData;
    // eslint-disable-next-line no-undef
    const tensorInput = tf.tensor(inputData);
    const prediction = model.predict(tensorInput).arraySync(); // Prediksi dan konversi ke array

    res.json({ prediction });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing prediction");
  }
});

module.exports = router;
