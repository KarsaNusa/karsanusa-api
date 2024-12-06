const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const predictRoutes = require('./routes/predictRoutes');

// const batikRoutes = require('./src/routes/batikRoutes');
// const newsRoutes = require('./src/routes/newsRoutes');
// const forumRoutes = require('./src/routes/forumRoutes');

// Database connection
// const connectDB = require('./src/config/database');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging HTTP requests

// Connect to the database
// connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/batik', predictRoutes);

// app.use('/api/batik', batikRoutes);
// app.use('/api/news', newsRoutes);
// app.use('/api/forum', forumRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Batik API!');
});


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
