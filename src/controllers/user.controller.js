const User = require('../models/user.model')

// Функция для определения пола по окончаниям ФИО
function determineGender(lastName, firstName, middleName) {
	// Окончания женских фамилий
	const femaleLastNameEndings = [
		'ая',
		'яя',
		'ова',
		'ева',
		'ина',
		'ына',
		'ская',
		'цкая',
		'ная',
		'тая',
	]
	// Окончания женских имен
	const femaleFirstNameEndings = ['а', 'я', 'ия', 'ея']
	// Окончания женских отчеств
	const femaleMiddleNameEndings = ['овна', 'евна', 'ична', 'инична']

	// Проверяем фамилию
	const lastNameEnding = lastName.slice(-3).toLowerCase()
	if (femaleLastNameEndings.some(ending => lastNameEnding.endsWith(ending))) {
		return 'female'
	}

	// Проверяем имя
	const firstNameEnding = firstName.slice(-1).toLowerCase()
	if (femaleFirstNameEndings.some(ending => firstNameEnding.endsWith(ending))) {
		return 'female'
	}

	// Проверяем отчество
	if (middleName) {
		const middleNameEnding = middleName.slice(-4).toLowerCase()
		if (
			femaleMiddleNameEndings.some(ending => middleNameEnding.endsWith(ending))
		) {
			return 'female'
		}
	}

	// Если не определили женский пол, считаем мужским
	return 'male'
}

// Функция для расчета возраста
function calculateAge(birthDate) {
	if (!birthDate) return null

	const today = new Date()
	const birth = new Date(birthDate)

	let age = today.getFullYear() - birth.getFullYear()
	const monthDiff = today.getMonth() - birth.getMonth()

	// Если день рождения еще не наступил в текущем году, уменьшаем возраст на 1
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--
	}

	return age
}

class UserController {
	async createUser(req, res) {
		try {
			const {
				firstName,
				lastName,
				middleName,
				birthDate,
				email,
				password,
				role,
			} = req.body

			// Проверяем, существует ли пользователь с таким email
			const existingUser = await User.findOne({ where: { email } })
			if (existingUser) {
				return res
					.status(400)
					.json({ error: 'Пользователь с таким email уже существует' })
			}

			// Создаем нового пользователя
			const user = await User.create({
				firstName,
				lastName,
				middleName,
				birthDate,
				email,
				password,
				role: role || 'fan',
			})

			// Возвращаем данные созданного пользователя
			res.status(201).json({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				middleName: user.middleName,
				birthDate: user.birthDate,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
			})
		} catch (error) {
			console.error('Ошибка при создании пользователя:', error)
			res.status(500).json({ error: 'Ошибка при создании пользователя' })
		}
	}

	async getAllUsers(req, res) {
		console.log('Получен запрос на получение всех пользователей')
		try {
			const users = await User.findAll({
				attributes: [
					'id',
					'firstName',
					'lastName',
					'middleName',
					'birthDate',
					'email',
					'role',
					'createdAt',
				],
				order: [['lastName', 'ASC']],
			})

			// Добавляем информацию о поле и возрасте для каждого пользователя
			const usersWithAdditionalInfo = users.map(user => ({
				...user.toJSON(),
				gender: determineGender(user.lastName, user.firstName, user.middleName),
				age: calculateAge(user.birthDate),
			}))

			console.log('Найдено пользователей:', usersWithAdditionalInfo.length)
			res.json(usersWithAdditionalInfo)
		} catch (error) {
			console.error('Ошибка при получении пользователей:', error)
			res
				.status(500)
				.json({ error: 'Ошибка при получении списка пользователей' })
		}
	}

	async updateUser(req, res) {
		try {
			const { id } = req.params
			const { firstName, lastName, middleName, birthDate, email, role } =
				req.body

			const user = await User.findByPk(id)
			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' })
			}

			// Проверяем, не пытается ли админ изменить свою роль
			if (req.user.id === parseInt(id) && role && role !== req.user.role) {
				return res.status(403).json({
					error: 'Вы не можете изменить свою собственную роль',
				})
			}

			await user.update({
				firstName,
				lastName,
				middleName,
				birthDate,
				email,
				role,
			})

			res.json({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				middleName: user.middleName,
				birthDate: user.birthDate,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Ошибка при обновлении пользователя' })
		}
	}

	async deleteUser(req, res) {
		try {
			const { id } = req.params

			// Проверяем, не пытается ли админ удалить самого себя
			if (req.user.id === parseInt(id)) {
				return res.status(403).json({
					error: 'Вы не можете удалить свой собственный аккаунт',
				})
			}

			const user = await User.findByPk(id)
			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' })
			}

			await user.destroy()
			res.json({ message: 'Пользователь успешно удален' })
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Ошибка при удалении пользователя' })
		}
	}

	async getUser(req, res) {
		try {
			const { id } = req.params

			// Проверяем права доступа: пользователь может видеть только свой профиль
			if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
				return res.status(403).json({
					error: 'У вас нет прав для просмотра этого профиля',
				})
			}

			const user = await User.findByPk(id, {
				attributes: [
					'id',
					'firstName',
					'lastName',
					'middleName',
					'birthDate',
					'email',
					'role',
					'createdAt',
				],
			})

			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' })
			}

			// Добавляем информацию о поле и возрасте
			const userWithAdditionalInfo = {
				...user.toJSON(),
				gender: determineGender(user.lastName, user.firstName, user.middleName),
				age: calculateAge(user.birthDate),
			}

			res.json(userWithAdditionalInfo)
		} catch (error) {
			console.error('Ошибка при получении пользователя:', error)
			res.status(500).json({ error: 'Ошибка при получении пользователя' })
		}
	}
}

module.exports = new UserController()
