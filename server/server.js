const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./Config/db')
const { readdirSync } = require('fs')
const multer = require('multer');
const path = require('path');

//const productRouters= require('./Routes/product')
//const authRouters=require('./Routes/auth')

const app = express()

connectDB()

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))
app.use('/uploads', express.static('uploads'));  // <-- ใช้ bodyParser ตรงนี้ ถูกต้องแล้ว

//Route1
//app.get('/product', (req,res) => {
//    res.send('Hello Endpoint 1232131')
//})

//Route2
//app.use('/api',productRouters)
//app.use('/api',authRouters)

//Route3
app.use('/api/products', require('./Routes/product'));
app.use('/api/auth', require('./Routes/auth'));

app.listen(5000, () => console.log('Server is Runing  port 5000'))
