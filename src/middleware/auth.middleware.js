const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken

		if (!accessToken) {
			return res.status(401).json({ error: 'Требуется аутентификация' })
		}

		try {
			const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
			const user = await User.findByPk(decoded.id)

			if (!user) {
				throw new Error('Пользователь не найден')
			}

			req.user = user
			next()
		} catch (error) {
			// Если токен доступа недействителен, пробуем обновить через refresh token
			const refreshToken = req.cookies.refreshToken

			if (!refreshToken) {
				return res.status(401).json({ error: 'Требуется аутентификация' })
			}

			try {
				const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
				const user = await User.findByPk(decoded.id)

				if (!user) {
					throw new Error('Пользователь не найден')
				}

				// Генерируем новые токены
				const newAccessToken = jwt.sign(
					{ id: user.id, role: user.role },
					process.env.JWT_SECRET,
					{ expiresIn: '15m' }
				)
				const newRefreshToken = jwt.sign(
					{ id: user.id },
					process.env.JWT_REFRESH_SECRET,
					{ expiresIn: '7d' }
				)

				// Устанавливаем новые cookies
				res.cookie('accessToken', newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 15 * 60 * 1000, // 15 минут
				})

				res.cookie('refreshToken', newRefreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
				})

				req.user = user
				next()
			} catch (refreshError) {
				return res
					.status(401)
					.json({ error: 'Требуется повторная авторизация' })
			}
		}
	} catch (error) {
		console.error('Ошибка аутентификации:', error.message)
		res.status(401).json({ error: 'Пожалуйста, авторизуйтесь' })
	}
}

const checkRole = roles => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({ error: 'Требуется аутентификация' })
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Доступ запрещен' })
		}

		next()
	}
}

module.exports = {
	auth,
	checkRole,
}
