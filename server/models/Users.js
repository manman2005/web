const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    },
    address: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    }
}, { timestamps: true })

module.exports = mongoose.model('Users', userSchema)
