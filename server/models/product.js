const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: String,
    detail: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    images: [
        {
            url: String,
        },
    ],
}, {timestamps: true})

module.exports = mongoose.model('products', productSchema)