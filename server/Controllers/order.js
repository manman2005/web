const Order = require('../models/Order');
const Users = require('../models/Users');

exports.createOrder = async (req, res) => {
    try {
        const { cart, cartTotal } = req.body;
        const user = await Users.findOne({ name: req.user.name }).exec();

        let newOrder = await new Order({
            products: cart,
            cartTotal,
            orderBy: user._id
        }).save();

        res.send(newOrder);
    } catch (err) {
        console.log(err);
        res.status(500).send('Create Order Failed');
    }
};

exports.getOrders = async (req, res) => {
    try {
        const user = await Users.findOne({ name: req.user.name }).exec();

        let orders = await Order.find({ orderBy: user._id })
            .populate('products.product')
            .exec();

        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send('Get Orders Failed');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;
        let orderUpdated = await Order.findByIdAndUpdate(
            orderId,
            { orderstatus: orderStatus },
            { new: true }
        ).exec();
        res.send(orderUpdated);
    } catch (err) {
        console.log(err);
        res.status(500).send('Update Order Status Failed');
    }
};