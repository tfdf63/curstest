const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { auth, checkRole } = require('../middleware/auth.middleware')

// Все маршруты защищены middleware auth
router.use(auth)

// Маршрут для получения отдельного пользователя (доступен всем авторизованным пользователям)
router.get('/:id', userController.getUser)

// Маршруты, требующие роль админа
router.post('/', checkRole(['admin']), userController.createUser)
router.get('/', checkRole(['admin']), userController.getAllUsers)
router.put('/:id', checkRole(['admin']), userController.updateUser)
router.delete('/:id', checkRole(['admin']), userController.deleteUser)

module.exports = router
