const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// CRUD routes
router.get('/', auth, productController.getProducts);
router.get('/:id', auth, productController.getProduct);
router.post('/', auth, roles('admin', 'manager'), productController.createProduct);
router.put('/:id', auth, roles('admin', 'manager'), productController.updateProduct);
router.delete('/:id', auth, roles('admin', 'manager'), productController.deleteProduct);

module.exports = router;