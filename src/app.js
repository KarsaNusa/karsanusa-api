const express = require('express');
const predictRoute = require('./routes/predictRoute');
const app = express();

// Middleware untuk mengurai body JSON
app.use(express.json()); // Ini akan memungkinkan untuk mendapatkan req.body dalam format JSON

app.use('/api/batik', predictRoute);

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});