const { DataTypes } = require('sequelize')

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Обновляем email для использования в качестве уникального идентификатора
		await queryInterface.changeColumn('users', 'email', {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		})

		// Удаляем поле username
		await queryInterface.removeColumn('users', 'username')
	},

	down: async (queryInterface, Sequelize) => {
		// Добавляем поле username обратно
		await queryInterface.addColumn('users', 'username', {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
		})

		// Заполняем username значениями из email
		await queryInterface.sequelize.query(`
			UPDATE users 
			SET username = email
		`)
	},
}
