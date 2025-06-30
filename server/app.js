const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');
const app = express();

app.use(cors({ allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// เชื่อมต่อ MongoDB
connectDB();

// import routes
const productRoutes = require('./Routes/product');
const authRoutes = require('./Routes/auth');
const orderRoutes = require('./Routes/order');

// ใช้งาน routes
app.use('/api', productRoutes);
app.use('/api', authRoutes);
app.use('/api', orderRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));