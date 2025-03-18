const express = require('express')
const router = express.Router()
const teamController = require('../controllers/team.controller')
const { auth, checkRole } = require('../middleware/auth.middleware')

// Получить список всех команд (доступно всем авторизованным пользователям)
router.get('/', auth, checkRole(['admin']), teamController.getAllTeams)

// Получить команду по ID (доступно всем авторизованным пользователям)
router.get('/:id', auth, checkRole(['admin']), teamController.getTeamById)

// Создать новую команду (только для админа)
router.post('/', auth, checkRole(['admin']), teamController.createTeam)

// Обновить данные команды (только для админа)
router.put('/:id', auth, checkRole(['admin']), teamController.updateTeam)

// Удалить команду (только для админа)
router.delete('/:id', auth, checkRole(['admin']), teamController.deleteTeam)

module.exports = router
