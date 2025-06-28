const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
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
// เพิ่ม routes อื่น ๆ เช่น cartRoutes, orderRoutes, userRoutes

// ใช้งาน routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));