const mongoose = require('mongoose')

const productSchema =mongoose.Schema({
    name:String,
    detail : {
        type :String
    },
    price: {
        type: Number
    },
    images: [
        {
            url: String,
        },
    ],
}, {timestamps: true})

module.exports = mongoose.model('products', productSchema)