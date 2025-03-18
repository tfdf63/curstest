const db = require('../models')
const Team = db.Team

// Получить список всех команд
exports.getAllTeams = async (req, res) => {
	try {
		const teams = await Team.findAll()
		res.json(teams)
	} catch (error) {
		res.status(500).json({
			message: error.message || 'Произошла ошибка при получении списка команд',
		})
	}
}

// Получить команду по ID
exports.getTeamById = async (req, res) => {
	const { id } = req.params
	try {
		const team = await Team.findByPk(id)
		if (!team) {
			return res.status(404).json({ message: 'Команда не найдена' })
		}
		res.json(team)
	} catch (error) {
		res.status(500).json({
			message: error.message || 'Ошибка при получении данных команды',
		})
	}
}

// Создать новую команду (только для админа)
exports.createTeam = async (req, res) => {
	try {
		const { name, city } = req.body
		if (!name || !city) {
			return res.status(400).json({
				message: 'Название команды и город обязательны для заполнения',
			})
		}

		const team = await Team.create({ name, city })
		res.status(201).json(team)
	} catch (error) {
		res.status(500).json({
			message: error.message || 'Ошибка при создании команды',
		})
	}
}

// Обновить данные команды (только для админа)
exports.updateTeam = async (req, res) => {
	const { id } = req.params
	try {
		const team = await Team.findByPk(id)
		if (!team) {
			return res.status(404).json({ message: 'Команда не найдена' })
		}

		const { name, city } = req.body
		await team.update({
			name: name || team.name,
			city: city || team.city,
		})
		res.json(team)
	} catch (error) {
		res.status(500).json({
			message: error.message || 'Ошибка при обновлении данных команды',
		})
	}
}

// Удалить команду (только для админа)
exports.deleteTeam = async (req, res) => {
	const { id } = req.params
	try {
		const team = await Team.findByPk(id)
		if (!team) {
			return res.status(404).json({ message: 'Команда не найдена' })
		}

		await team.destroy()
		res.json({ message: 'Команда успешно удалена' })
	} catch (error) {
		res.status(500).json({
			message: error.message || 'Ошибка при удалении команды',
		})
	}
}
