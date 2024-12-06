const jwt = require('jsonwebtoken');

// Middleware untuk melindungi rute dengan otentikasi
exports.protect = (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        token = token.replace('Bearer ', ''); // Menghapus "Bearer " jika ada
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
