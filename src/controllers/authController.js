const firestore = require("../config/firestore"); // Mengimpor Firestore yang sudah diinisialisasi
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Registrasi pengguna baru
exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName } = req.body;

    // Pastikan nilai email dan password tidak undefined atau kosong
    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ message: "Email, password, dan fullName harus diisi" });
    }

    // Periksa apakah pengguna sudah ada
    console.log("Mencari pengguna dengan email:", email);
    const userRef = firestore.collection("users").where("email", "==", email);
    const userSnapshot = await userRef.get();
    console.log("Hasil pencarian pengguna:", userSnapshot.empty);

    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "Pengguna sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat objek pengguna baru
    const newUser = {
      email,
      password: hashedPassword,
      fullName,
      createdAt: new Date(),
    };

    // Simpan pengguna baru ke Firestore
    const userDocRef = await firestore.collection("users").add(newUser);

    // Ambil userId dari Firestore (ID dokumen pengguna)
    const userId = userDocRef.id;

    // Kembalikan response dengan userId
    return res.status(201).json({
      message: "Pengguna berhasil terdaftar",
      userId, // Sertakan userId dalam respons
    });
  } catch (err) {
    console.error("Terjadi kesalahan saat mendaftar pengguna:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Periksa apakah pengguna ada
    const userRef = firestore.collection("users").where("email", "==", email);
    const userSnapshot = await userRef.get();
    if (userSnapshot.empty) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const userData = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id; // Ambil ID dokumen pengguna dari Firestore
    const fullName = userData.fullName; // Ambil fullName dari data pengguna

    // Periksa password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { userId, email: userData.email }, // Tambahkan userId ke payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Kirimkan response dengan token, userId, dan fullName
    return res.json({
      message: "Login berhasil",
      token,
      userId, // Sertakan userId dalam respons
      fullName, // Sertakan fullName dalam respons
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


// Mendapatkan Profil User
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Ambil data user berdasarkan userId
    const userDoc = await firestore.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const userData = userDoc.data();

    return res.json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
  