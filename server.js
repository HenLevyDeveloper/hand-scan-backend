const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth').router;
const scanRoutes = require('./routes/scan').router;
const productsRoutes = require('./routes/products').router;

require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/products', productsRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
