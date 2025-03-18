const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const sequelize = require('../config/db.config.js')

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// Импортируем модели
db.Team = require('./team.model.js')(sequelize, Sequelize)

// Устанавливаем связи между моделями
Object.values(db).forEach(model => {
	if (model.associate) {
		model.associate(db)
	}
})

module.exports = db
