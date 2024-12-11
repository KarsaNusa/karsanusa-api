const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const firestore = require("../config/firestore");

const router = express.Router();

// Konfigurasi penyimpanan gambar lokal
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "uploads");
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum 5MB
});

// Endpoint: Mengirim pesan
router.post("/messages", upload.single("image"), async (req, res) => {
  const { message, userId } = req.body;
  const file = req.file;

  if (!message || !userId) {
    return res.status(400).json({ message: "Pesan dan userId diperlukan." });
  }

  const id = uuidv4();
  const imagePath = file ? `/uploads/${file.filename}` : null;
  const createdAt = new Date();

  try {
    // Periksa apakah userId valid
    const userDoc = await firestore.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(400).json({ message: "User tidak ditemukan." });
    }

    // Simpan data ke Firestore
    await firestore.collection("messages").doc(id).set({
      id,
      userId,
      message,
      imagePath,
      createdAt,
    });

    res.status(201).json({
      message: "Pesan berhasil dikirim.",
      data: { id, userId, message, imagePath, createdAt },
    });
  } catch (error) {
    console.error("Error menyimpan pesan ke Firestore:", error);
    res.status(500).json({ message: "Gagal menyimpan pesan." });
  }
});

// Endpoint: Melihat semua pesan
router.get("/messages", async (req, res) => {
  try {
    const snapshot = await firestore
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();

    const messages = snapshot.docs.map((doc) => doc.data());
    res.json({ data: messages });
  } catch (error) {
    console.error("Error mendapatkan pesan dari Firestore:", error);
    res.status(500).json({ message: "Gagal mendapatkan pesan." });
  }
});

// Endpoint: Melihat detail pesan
router.get("/messages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await firestore.collection("messages").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Pesan tidak ditemukan." });
    }

    res.json({ data: doc.data() });
  } catch (error) {
    console.error("Error mendapatkan detail pesan:", error);
    res.status(500).json({ message: "Gagal mendapatkan pesan." });
  }
});

// Endpoint: Menghapus pesan
router.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await firestore.collection("messages").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Pesan tidak ditemukan." });
    }

    // Hapus dokumen Firestore
    await firestore.collection("messages").doc(id).delete();

    // Hapus file gambar (jika ada)
    const imagePath = doc.data().imagePath;
    if (imagePath) {
      const fs = require("fs");
      const filePath = path.join(__dirname, imagePath);

      fs.unlink(filePath, (err) => {
        if (err) console.error("Error menghapus file gambar:", err);
      });
    }

    res.json({ message: "Pesan berhasil dihapus." });
  } catch (error) {
    console.error("Error menghapus pesan:", error);
    res.status(500).json({ message: "Gagal menghapus pesan." });
  }
});

module.exports = router;
