const { DataTypes } = require('sequelize')

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const tableInfo = await queryInterface.describeTable('users')

		if (!tableInfo.firstName) {
			await queryInterface.addColumn('users', 'firstName', {
				type: DataTypes.STRING(50),
				allowNull: false,
				defaultValue: '',
			})
		}

		if (!tableInfo.lastName) {
			await queryInterface.addColumn('users', 'lastName', {
				type: DataTypes.STRING(50),
				allowNull: false,
				defaultValue: '',
			})
		}

		if (!tableInfo.middleName) {
			await queryInterface.addColumn('users', 'middleName', {
				type: DataTypes.STRING(50),
				allowNull: true,
			})
		}

		if (!tableInfo.birthDate) {
			await queryInterface.addColumn('users', 'birthDate', {
				type: DataTypes.DATEONLY,
				allowNull: true,
			})
		}

		// Копируем данные из username в firstName и lastName
		await queryInterface.sequelize.query(`
			UPDATE users 
			SET "firstName" = username,
					"lastName" = username
			WHERE "firstName" = '' OR "lastName" = ''
		`)
	},

	down: async (queryInterface, Sequelize) => {
		const tableInfo = await queryInterface.describeTable('users')

		if (tableInfo.firstName) {
			await queryInterface.removeColumn('users', 'firstName')
		}
		if (tableInfo.lastName) {
			await queryInterface.removeColumn('users', 'lastName')
		}
		if (tableInfo.middleName) {
			await queryInterface.removeColumn('users', 'middleName')
		}
		if (tableInfo.birthDate) {
			await queryInterface.removeColumn('users', 'birthDate')
		}
	},
}
