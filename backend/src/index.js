require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const superAdminRoutes = require('./routes/superAdmin');
const orgAdminRoutes = require('./routes/orgAdmin');
const userRoutes = require('./routes/user');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/admin', orgAdminRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Super Admin Email: ${process.env.SUPER_ADMIN_EMAIL}`);
});
