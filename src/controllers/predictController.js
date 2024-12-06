const multer = require("multer");
// const path = require("path");
const axios = require("axios");

// Konfigurasi Multer untuk upload file
const upload = multer({
  // dest: path.join(__dirname, "./models/best_model.json"), // Direktori sementara untuk menyimpan file
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum file size 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Hanya file gambar yang diizinkan!"), false);
    }
    cb(null, true);
  },
});

// Middleware untuk menangani upload
exports.uploadBatikImage = upload.single("batikImage");

// Proses prediksi gambar batik
exports.predictBatik = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Gambar batik harus diunggah." });
    }

    // Simulasi mengirimkan gambar ke model prediksi
    const filePath = req.file.path;

    // Jika model ada di Python/endpoint lain, gunakan axios untuk mengirim file
    const modelEndpoint = "http://localhost:5000/predict"; // Ganti dengan URL model Anda
    const formData = new FormData();
    // eslint-disable-next-line no-undef
    formData.append("batikImage", fs.createReadStream(filePath));

    const response = await axios.post(modelEndpoint, formData, {
      headers: { "Content-Type": `multipart/form-data` },
    });

    // Hasil prediksi
    const predictionResult = response.data;

    // Kembalikan hasil ke klien
    return res.status(200).json({
      message: "Prediksi berhasil",
      data: predictionResult,
    });
  } catch (err) {
    console.error("Error saat memproses prediksi:", err.message);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memproses prediksi." });
  }
};
