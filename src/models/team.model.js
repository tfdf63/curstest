module.exports = (sequelize, DataTypes) => {
	const Team = sequelize.define(
		'Team',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
		},
		{
			tableName: 'teams',
		}
	)

	Team.associate = function (models) {
		// здесь будут определены связи с другими моделями
	}

	return Team
}
