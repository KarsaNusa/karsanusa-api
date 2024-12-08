const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes.js');

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

// 404 handler 
/* eslint-enable no-unused-vars */
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
