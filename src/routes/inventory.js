const express = require('express');
const { getAllInventory, getInventoryById, createInventory, updateInventory, deleteInventory } = require('../controllers/inventoryController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, getAllInventory);
router.get('/:id', authenticate, getInventoryById);
router.post('/', authenticate, createInventory);
router.put('/:id', authenticate, updateInventory);
router.delete('/:id', authenticate, authorize('Administrador'), deleteInventory);

module.exports = router;