const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const firestore = require("./config/firestore.js");
const path = require("path");
const forumRoutes = require("./routes/forumRoutes.js")
const bodyParser = require("body-parser");

// Import routes
const authRoutes = require("./routes/authRoutes.js");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/forum', forumRoutes);

// 404 handler
/* eslint-enable no-unused-vars */
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Setup multer untuk meng-handle file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Pastikan folder 'uploads' ada
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Route untuk mengirim pesan
app.post("/api/forum/messages", upload.single("image"), async (req, res) => {
  const { message, userId } = req.body;

  // Validasi bahwa message dan userId ada
  if (!message || !userId) {
    return res.status(400).json({ message: "Pesan dan userId diperlukan." });
  }

  // Cek jika file gambar diupload
  const imagePath = req.file ? req.file.path : null;

  // Menyimpan pesan ke Firestore
  const messageId = uuidv4();
  const newMessage = {
    id: messageId,
    userId,
    message,
    imagePath,
    createdAt: new Date().toISOString(),
  };

  try {
    await firestore.collection("forumMessages").doc(messageId).set(newMessage);
    res.status(201).json({
      message: "Pesan berhasil dikirim.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saat menyimpan pesan:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengirim pesan." });
  }
});

// Mendapatkan detail pesan
app.get("/api/forum/messages/:messageId", async (req, res) => {
  const { messageId } = req.params; // Mendapatkan messageId dari URL

  try {
    // Ambil pesan dari Firestore berdasarkan ID
    const messageDoc = await firestore
      .collection("forumMessages")
      .doc(messageId)
      .get();

    if (!messageDoc.exists) {
      return res.status(404).json({ message: "Pesan tidak ditemukan." });
    }

    // Mengirimkan pesan yang ditemukan
    res.status(200).json({
      message: "Pesan ditemukan.",
      data: messageDoc.data(),
    });
  } catch (error) {
    console.error("Error saat mengambil pesan:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil pesan." });
  }
});

// Menghapus pesan
app.delete("/api/forum/messages/:messageId", async (req, res) => {
  const { messageId } = req.params; // Mendapatkan messageId dari URL

  try {
    // Hapus pesan dari Firestore berdasarkan ID
    await firestore.collection("forumMessages").doc(messageId).delete();

    res.status(200).json({ message: "Pesan berhasil dihapus." });
  } catch (error) {
    console.error("Error saat menghapus pesan:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus pesan." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
