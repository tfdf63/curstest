const { Sequelize } = require('sequelize')
require('dotenv').config()

const dbConfig = {
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	dialect: 'postgres',
	logging: false, // Отключаем логирование SQL запросов
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
}

const sequelize = new Sequelize(dbConfig)

module.exports = sequelize
