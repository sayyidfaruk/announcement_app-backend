const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static('uploads')); // Serve static files (e.g., images, PDFs)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

// Test database connection
sequelize.sync({ force: false })
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Error connecting to database', err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
