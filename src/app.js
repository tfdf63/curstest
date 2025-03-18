const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sequelize = require('./config/db.config')
const authRoutes = require('./routes/auth.routes')
const itemRoutes = require('./routes/item.routes')
const userRoutes = require('./routes/user.routes')
const teamRoutes = require('./routes/team.routes')
require('dotenv').config()

const app = express()

// Настройка CORS для работы с cookies
app.use(
	cors({
		origin: process.env.CLIENT_URL || 'http://localhost:3000',
		credentials: true,
	})
)

app.use(cookieParser())
app.use(express.json())

// Маршруты
app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/users', userRoutes)
app.use('/api/teams', teamRoutes)

// Синхронизация моделей с базой данных
const initializeDatabase = async () => {
	try {
		await sequelize.sync()
		console.log('База данных синхронизирована')
	} catch (error) {
		console.error('Ошибка синхронизации базы данных:', error)
	}
}

// Запуск сервера
const PORT = process.env.PORT || 3001
app.listen(PORT, async () => {
	console.log(`Сервер запущен на порту ${PORT}`)
	await initializeDatabase()
})

module.exports = app
