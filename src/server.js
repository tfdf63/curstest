const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const itemRoutes = require('./routes/item.routes')
const sequelize = require('./config/db.config')
const Item = require('./models/item.model')
const authRoutes = require('./routes/auth.routes')

const app = express()

// Middleware
app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Синхронизация моделей с базой данных
sequelize
	.sync()
	.then(() => {
		console.log('Database synchronized successfully.')
	})
	.catch(err => {
		console.error('Failed to sync database:', err)
	})

// Test database connection
sequelize
	.authenticate()
	.then(() => {
		console.log('Successfully connected to PostgreSQL.')
	})
	.catch(err => {
		console.error('Error connecting to the database:', err)
	})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
