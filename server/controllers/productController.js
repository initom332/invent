const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    // Real-time low stock notification
    const LOW_STOCK_THRESHOLD = 10;
    if (product.stock <= LOW_STOCK_THRESHOLD) {
      const io = req.app.get('io');
      io.emit('lowStock', {
        productId: product._id,
        name: product.name,
        stock: product.stock,
      });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
