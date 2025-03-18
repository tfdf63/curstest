const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

class AuthController {
	// Генерация токенов доступа и обновления
	generateTokens = user => {
		const accessToken = jwt.sign(
			{ id: user.id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '30m' }
		)
		const refreshToken = jwt.sign(
			{ id: user.id },
			process.env.JWT_REFRESH_SECRET,
			{ expiresIn: '7d' }
		)
		return { accessToken, refreshToken }
	}

	// Установка cookies
	setTokenCookies = (res, { accessToken, refreshToken }) => {
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000, // 15 минут
		})

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
		})
	}

	register = async (req, res) => {
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

			// Проверяем, существует ли пользователь
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

			const tokens = this.generateTokens(user)
			this.setTokenCookies(res, tokens)

			res.json({
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					middleName: user.middleName,
					birthDate: user.birthDate,
					email: user.email,
					role: user.role,
				},
			})
		} catch (error) {
			console.error('Ошибка при регистрации:', error.message)
			res.status(500).json({ error: 'Ошибка при регистрации пользователя' })
		}
	}

	login = async (req, res) => {
		try {
			const { email, password } = req.body

			// Находим пользователя
			const user = await User.findOne({ where: { email } })
			if (!user) {
				return res.status(401).json({ error: 'Неверные учетные данные' })
			}

			// Проверяем пароль
			const isValidPassword = await user.validatePassword(password)
			if (!isValidPassword) {
				return res.status(401).json({ error: 'Неверные учетные данные' })
			}

			const tokens = this.generateTokens(user)
			this.setTokenCookies(res, tokens)

			res.json({
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					middleName: user.middleName,
					birthDate: user.birthDate,
					email: user.email,
					role: user.role,
				},
			})
		} catch (error) {
			console.error('Ошибка при входе:', error.message)
			res.status(500).json({ error: 'Ошибка при входе в систему' })
		}
	}

	refreshToken = async (req, res) => {
		try {
			const { refreshToken } = req.cookies

			if (!refreshToken) {
				return res.status(401).json({ error: 'Токен обновления отсутствует' })
			}

			const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
			const user = await User.findByPk(decoded.id)

			if (!user) {
				return res.status(401).json({ error: 'Пользователь не найден' })
			}

			const tokens = this.generateTokens(user)
			this.setTokenCookies(res, tokens)

			res.json({
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					middleName: user.middleName,
					birthDate: user.birthDate,
					email: user.email,
					role: user.role,
				},
			})
		} catch (error) {
			console.error('Ошибка при обновлении токена:', error.message)
			res.status(401).json({ error: 'Недействительный токен обновления' })
		}
	}

	logout = async (req, res) => {
		try {
			res.clearCookie('accessToken')
			res.clearCookie('refreshToken')
			res.json({ message: 'Выход выполнен успешно' })
		} catch (error) {
			console.error('Ошибка при выходе:', error.message)
			res.status(500).json({ error: 'Ошибка при выходе из системы' })
		}
	}

	getProfile = async (req, res) => {
		try {
			const user = await User.findByPk(req.user.id)
			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' })
			}

			res.json({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				middleName: user.middleName,
				birthDate: user.birthDate,
				email: user.email,
				role: user.role,
			})
		} catch (error) {
			console.error('Ошибка при получении профиля:', error.message)
			res.status(500).json({ error: 'Ошибка при получении профиля' })
		}
	}
}

module.exports = new AuthController()
