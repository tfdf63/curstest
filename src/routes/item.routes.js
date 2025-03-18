const express = require('express')
const router = express.Router()
const itemController = require('../controllers/item.controller')
const { auth, checkRole } = require('../middleware/auth.middleware')

// Публичные маршруты
router.get('/', itemController.getAllItems)
router.get('/:id', itemController.getItemById)

// Защищенные маршруты (только для админов)
router.post('/', auth, checkRole(['admin']), itemController.createItem)
router.put('/:id', auth, checkRole(['admin']), itemController.updateItem)
router.delete('/:id', auth, checkRole(['admin']), itemController.deleteItem)

module.exports = router
