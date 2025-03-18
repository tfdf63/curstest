const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const bcrypt = require('bcryptjs')

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		firstName: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		middleName: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		birthDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM('admin', 'fan'),
			defaultValue: 'fan',
			allowNull: false,
		},
	},
	{
		tableName: 'users',
		timestamps: true,
		hooks: {
			beforeCreate: async user => {
				if (user.password) {
					const salt = await bcrypt.genSalt(10)
					user.password = await bcrypt.hash(user.password, salt)
				}
			},
			beforeUpdate: async user => {
				if (user.changed('password')) {
					const salt = await bcrypt.genSalt(10)
					user.password = await bcrypt.hash(user.password, salt)
				}
			},
		},
	}
)

// Метод для проверки пароля
User.prototype.validatePassword = async function (password) {
	return await bcrypt.compare(password, this.password)
}

module.exports = User
