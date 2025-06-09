const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// CRUD routes
router.get('/', auth, supplierController.getSuppliers);
router.get('/:id', auth, supplierController.getSupplier);
router.post('/', auth, roles('admin', 'manager'), supplierController.createSupplier);
router.put('/:id', auth, roles('admin', 'manager'), supplierController.updateSupplier);
router.delete('/:id', auth, roles('admin', 'manager'), supplierController.deleteSupplier);

module.exports = router;
