'use strict'

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('games', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			homeTeamId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'teams',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			awayTeamId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'teams',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			date: {
				type: Sequelize.DATEONLY,
				allowNull: true,
			},
			time: {
				type: Sequelize.TIME,
				allowNull: true,
			},
			spectators: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			homeScore: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			awayScore: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('games')
	},
}
