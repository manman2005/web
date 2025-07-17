const mongoose = require('mongoose');
const Order = require('../models/Order');
const Users = require('../models/Users');
const Product = require('../models/product'); // เพิ่ม Product model

exports.createOrder = async (req, res) => {
    try {
        const { cart } = req.body; // ไม่รับ cartTotal จาก client โดยตรง
        const user = await Users.findOne({ name: req.user.name }).exec();

        if (!user) {
            return res.status(400).send('ไม่พบผู้ใช้สำหรับสร้างคำสั่งซื้อ');
        }

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).send('ตะกร้าสินค้าไม่ถูกต้องหรือว่างเปล่า');
        }

        let productsForOrder = [];
        let calculatedCartTotal = 0;

        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            if (!item.product || !item.count) {
                return res.status(400).send('ข้อมูลสินค้าในตะกร้าไม่สมบูรณ์');
            }

            const product = await Product.findById(item.product).exec();

            if (!product) {
                return res.status(404).send(`ไม่พบสินค้า: ${item.product}`);
            }

            if (typeof item.count !== 'number' || item.count <= 0) {
                return res.status(400).send(`จำนวนสินค้า ${product.name} ไม่ถูกต้อง`);
            }

            if (product.quantity < item.count) {
                return res.status(400).send(`สินค้า ${product.name} มีไม่เพียงพอในสต็อก`);
            }

            

            productsForOrder.push({
                product: product._id,
                count: item.count,
                price: product.price // บันทึกราคา ณ ตอนที่สั่งซื้อ
            });
            calculatedCartTotal += product.price * item.count;
        }

        let newOrder = await new Order({
            products: productsForOrder,
            cartTotal: calculatedCartTotal,
            orderBy: user._id
        }).save();

        res.send(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).send('สร้างคำสั่งซื้อไม่สำเร็จ');
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

exports.getAllOrders = async (req, res) => {
    try {
        let orders = await Order.find({})
            .populate('products.product')
            .populate('orderBy', 'name address phone') // Populate user name, address, and phone
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .exec();

        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send('Get All Orders Failed');
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send('รหัสคำสั่งซื้อไม่ถูกต้อง');
        }

        const deletedOrder = await Order.findByIdAndDelete(orderId).exec();

        if (!deletedOrder) {
            return res.status(404).send('ไม่พบคำสั่งซื้อที่จะลบ');
        }

        res.send({ message: 'ลบคำสั่งซื้อสำเร็จ', deletedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).send('ลบคำสั่งซื้อไม่สำเร็จ');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send('รหัสคำสั่งซื้อไม่ถูกต้อง');
        }

        const allowedStatuses = ['Pending', 'Processing', 'Cancelled', 'Completed'];
        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).send('สถานะคำสั่งซื้อไม่ถูกต้อง');
        }

        // Find the order first to get its current status and products
        let order = await Order.findById(orderId).populate('products.product').exec();

        if (!order) {
            return res.status(404).send('ไม่พบคำสั่งซื้อ');
        }

        const previousStatus = order.orderstatus;

        // Update the order status
        order.orderstatus = orderStatus;
        let orderUpdated = await order.save();

        // If the new status is 'Completed' and the previous status was not 'Completed',
        // then decrease product quantities
        if (orderStatus === 'Completed' && previousStatus !== 'Completed') {
            for (const item of order.products) {
                const product = await Product.findById(item.product._id).exec();
                if (product) {
                    product.quantity -= item.count;
                    await product.save();
                } else {
                    console.warn(`Product with ID ${item.product._id} not found for stock update.`);
                }
            }
        }

        // If the new status is 'Cancelled' and the previous status was not 'Cancelled',
        // then increase product quantities (return to stock)
        if (orderStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
            for (const item of order.products) {
                const product = await Product.findById(item.product._id).exec();
                if (product) {
                    product.quantity += item.count;
                    await product.save();
                } else {
                    console.warn(`Product with ID ${item.product._id} not found for stock update.`);
                }
            }
        }

        res.send(orderUpdated);
    } catch (err) {
        console.error(err);
        res.status(500).send('อัปเดตสถานะคำสั่งซื้อไม่สำเร็จ');
    }
};

exports.getSalesData = async (req, res) => {
    try {
        const { period } = req.query; // 'daily', 'weekly', 'monthly', 'yearly'
        let groupStage = {};
        let sortStage = {};

        switch (period) {
            case 'daily':
                groupStage = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
                sortStage = { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
                break;
            case 'weekly':
                groupStage = {
                    year: { $year: '$createdAt' },
                    week: { $week: '$createdAt' }
                };
                sortStage = { '_id.year': 1, '_id.week': 1 };
                break;
            case 'monthly':
                groupStage = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                };
                sortStage = { '_id.year': 1, '_id.month': 1 };
                break;
            case 'yearly':
                groupStage = {
                    year: { $year: '$createdAt' }
                };
                sortStage = { '_id.year': 1 };
                break;
            default:
                return res.status(400).send('Invalid period specified. Use daily, weekly, monthly, or yearly.');
        }

        const salesData = await Order.aggregate([
            {
                $match: {
                    orderstatus: 'Completed' // Only count completed orders as sales
                }
            },
            {
                $unwind: '$products' // Deconstruct the products array
            },
            {
                $group: {
                    _id: groupStage,
                    totalItemsSold: { $sum: '$products.count' },
                    totalSalesValue: { $sum: { $multiply: ['$products.count', '$products.price'] } } // Calculate total sales value
                }
            },
            {
                $sort: sortStage
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id
                    period: '$_id',
                    totalItemsSold: 1,
                    totalSalesValue: 1
                }
            }
        ]);

        res.json(salesData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get sales data');
    }
};