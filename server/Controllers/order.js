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

            // ลดจำนวนสต็อกสินค้า
            product.quantity -= item.count;
            await product.save();

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
            .populate('orderBy', 'name') // Populate user name
            .exec();

        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send('Get All Orders Failed');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        // Validate orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send('รหัสคำสั่งซื้อไม่ถูกต้อง');
        }

        // Validate orderStatus
        const allowedStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).send('สถานะคำสั่งซื้อไม่ถูกต้อง');
        }

        let orderUpdated = await Order.findByIdAndUpdate(
            orderId,
            { orderstatus: orderStatus },
            { new: true }
        ).exec();

        if (!orderUpdated) {
            return res.status(404).send('ไม่พบคำสั่งซื้อ');
        }

        res.send(orderUpdated);
    } catch (err) {
        console.error(err);
        res.status(500).send('อัปเดตสถานะคำสั่งซื้อไม่สำเร็จ');
    }
};