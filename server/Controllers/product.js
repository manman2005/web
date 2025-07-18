const product = require ('../models/product')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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

        const LOW_STOCK_THRESHOLD = 10; // กำหนดเกณฑ์สินค้าใกล้หมด
        const productWithAlert = {
            ...oneProduct.toObject(),
            lowStockAlert: oneProduct.quantity !== undefined && oneProduct.quantity < LOW_STOCK_THRESHOLD
        };

        res.json(productWithAlert);
    } catch (err) {
        console.log(err);
        res.status(500).send('server error');
    }
}

exports.list = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        const products = await product.find(query).exec();
        const LOW_STOCK_THRESHOLD = 10; // กำหนดเกณฑ์สินค้าใกล้หมด
        const productsWithAlert = products.map(p => ({
            ...p.toObject(),
            lowStockAlert: p.quantity !== undefined && p.quantity < LOW_STOCK_THRESHOLD
        }));
        res.json(productsWithAlert);
    } catch (err) {
        console.log(err);
        res.status(500).send('server error');
    }
}
exports.create = async (req, res) => {
  try {
    let { name, detail, price, category, brand, quantity } = req.body;

    // Convert price and quantity to numbers if they exist
    if (price !== undefined) {
      price = Number(price);
    }
    if (quantity !== undefined) {
      quantity = Number(quantity);
    }

    // Input Validation
    if (!name) {
      return res.status(400).send('กรุณากรอกชื่อสินค้า');
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).send('ราคาต้องเป็นตัวเลขและไม่ติดลบ');
    }
    if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
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
        const { name, detail, category, brand, imagesToDelete } = req.body;
        let { price, quantity } = req.body;

        console.log('Received price (before conversion):', price, 'Type:', typeof price);
        console.log('Received quantity (before conversion):', quantity, 'Type:', typeof quantity);

        if (price !== undefined) {
            price = Number(price);
        }
        if (quantity !== undefined) {
            quantity = Number(quantity);
        }

        console.log('Received price (after conversion):', price, 'Type:', typeof price);
        console.log('Received quantity (after conversion):', quantity, 'Type:', typeof quantity);

        let updateData = {};

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === '') {
                return res.status(400).send('ชื่อสินค้าไม่ถูกต้อง');
            }
            updateData.name = name;
        }
        if (detail !== undefined) {
            if (typeof detail !== 'string') {
                return res.status(400).send('รายละเอียดสินค้าไม่ถูกต้อง (ต้องเป็นข้อความ)');
            }
            updateData.detail = detail;
        }
        if (category !== undefined) {
            if (typeof category !== 'string') {
                return res.status(400).send('หมวดหมู่สินค้าไม่ถูกต้อง (ต้องเป็นข้อความ)');
            }
            updateData.category = category;
        }
        if (brand !== undefined) {
            if (typeof brand !== 'string') {
                return res.status(400).send('แบรนด์สินค้าไม่ถูกต้อง (ต้องเป็นข้อความ)');
            }
            updateData.brand = brand;
        }
        if (price !== undefined) {
            if (typeof price !== 'number' || price < 0) {
                return res.status(400).send('ราคาต้องเป็นตัวเลขและไม่ติดลบ');
            }
            updateData.price = price;
        }
        if (quantity !== undefined) {
            if (typeof quantity !== 'number' || quantity < 0) {
                return res.status(400).send('จำนวนสินค้าต้องเป็นตัวเลขและไม่ติดลบ');
            }
            updateData.quantity = quantity;
        }

        // Handle image deletion
        if (imagesToDelete && imagesToDelete.length > 0) {
            const existingProduct = await product.findById(id).exec();
            if (existingProduct) {
                let currentImages = existingProduct.images.map(img => img.url);
                const imagesToKeep = currentImages.filter(url => !imagesToDelete.includes(url));

                for (const imageUrl of imagesToDelete) {
                    const filename = path.basename(imageUrl);
                    const filePath = path.join(__dirname, '..', 'uploads', filename);
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Error deleting file ${filePath}:`, err);
                        else console.log(`Successfully deleted file: ${filePath}`);
                    });
                }
                updateData.images = imagesToKeep.map(url => ({ url }));
            }
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const existingProduct = await product.findById(id).exec();
            const existingImages = existingProduct ? existingProduct.images : [];
            const newImages = req.files.map(file => ({ url: `/uploads/${file.filename}` }));
            updateData.images = [...existingImages, ...newImages];
        }

        // If no fields are provided for update, return an error or just proceed without updating anything
        if (Object.keys(updateData).length === 0 && (!req.files || req.files.length === 0)) {
            return res.status(400).send('ไม่มีข้อมูลที่ต้องการอัปเดต');
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