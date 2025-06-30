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
        const producted = await product.find({}).exec();
        res.json(producted) // ส่งข้อมูลสินค้าออกไป
    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
}
exports.create = async (req, res) => {
  try {
    const { name, detail, price, category, brand } = req.body;
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
        const { name, detail, price, category, brand } = req.body;
        let updateData = { name, detail, price, category, brand };

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({ url: `/uploads/${file.filename}` }));
            // For simplicity, replacing existing images with new ones. 
            // A more robust solution might merge or allow specific image deletion.
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