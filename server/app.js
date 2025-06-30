const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors({ allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/roitai', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// import routes
const productRoutes = require('./Routes/product');
const authRoutes = require('./Routes/auth');
const orderRoutes = require('./Routes/order');

// ใช้งาน routes
app.use('/api', productRoutes);
app.use('/api', authRoutes);
app.use('/api', orderRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));