const product = require ('../models/product')
const mongoose = require('mongoose');
exports.read = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid product id');
        }
        const oneProduct = await product.findById(id).exec();

        if (!oneProduct) {
            return res.status(404).send('Product not found');
        }

        res.json(oneProduct);
    } catch (err) {
        console.log(err);
        res.status(500).send('server error');
    }
}

exports.list = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await product.find(query).exec();
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).send('server error');
    }
}
exports.create = async (req, res) => {
  try {
    const { name, detail, price, category, brand, quantity } = req.body;

    // Input Validation
    if (!name || !detail || !category || !brand) {
      return res.status(400).send('กรุณากรอกข้อมูลสินค้าให้ครบถ้วน (ชื่อ, รายละเอียด, หมวดหมู่, แบรนด์)');
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).send('ราคาต้องเป็นตัวเลขและไม่ติดลบ');
    }
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).send('จำนวนสินค้าต้องเป็นตัวเลขและไม่ติดลบ');
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({ url: `/uploads/${file.filename}` }));
    }

    const newProduct = new product({
      name,
      detail,
      price,
      category,
      brand,
      quantity,
      images,
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, detail, price, category, brand, quantity } = req.body;

        // Input Validation for update
        if (name !== undefined && typeof name !== 'string' || (typeof name === 'string' && name.trim() === '')) {
            return res.status(400).send('ชื่อสินค้าไม่ถูกต้อง');
        }
        if (detail !== undefined && typeof detail !== 'string' || (typeof detail === 'string' && detail.trim() === '')) {
            return res.status(400).send('รายละเอียดสินค้าไม่ถูกต้อง');
        }
        if (category !== undefined && typeof category !== 'string' || (typeof category === 'string' && category.trim() === '')) {
            return res.status(400).send('หมวดหมู่สินค้าไม่ถูกต้อง');
        }
        if (brand !== undefined && typeof brand !== 'string' || (typeof brand === 'string' && brand.trim() === '')) {
            return res.status(400).send('แบรนด์สินค้าไม่ถูกต้อง');
        }
        if (price !== undefined && (typeof price !== 'number' || price < 0)) {
            return res.status(400).send('ราคาต้องเป็นตัวเลขและไม่ติดลบ');
        }
        if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
            return res.status(400).send('จำนวนสินค้าต้องเป็นตัวเลขและไม่ติดลบ');
        }

        let updateData = { name, detail, price, category, brand, quantity };

        // Remove undefined fields from updateData
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({ url: `/uploads/${file.filename}` }));
            updateData.images = newImages;
        }

        const updatedProduct = await product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).exec();

        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }

        res.json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
}
exports.remove = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedProduct = await product.findByIdAndDelete(id).exec();

        if (!deletedProduct) {
            return res.status(404).send('Product not found');
        }

        res.json({
            message: 'Product deleted successfully',
            deleted: deletedProduct
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('server error');
    }
}