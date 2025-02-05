const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth').router; // Ensure correct import
const scanRoutes = require('./routes/scan').router; // Ensure correct import
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Use correct router imports
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
