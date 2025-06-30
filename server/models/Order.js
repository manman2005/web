const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: 'Product'
            },
            count: Number,
            price: Number
        }
    ],
    cartTotal: Number,
    orderstatus: {
        type: String,
        default: 'Not Processed',
        enum: [
            'Not Processed',
            'Processing',
            'Cancelled',
            'Completed'
        ]
    },
    orderBy: {
        type: ObjectId,
        ref: 'Users'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);