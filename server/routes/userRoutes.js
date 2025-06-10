const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// CRUD routes
router.get('/', auth, roles('admin'), userController.getUsers);
router.get('/:id', auth, roles('admin'), userController.getUser);
router.post('/', auth, roles('admin'), userController.createUser);
router.put('/:id', auth, roles('admin'), userController.updateUser);
router.delete('/:id', auth, roles('admin'), userController.deleteUser);

module.exports = router;