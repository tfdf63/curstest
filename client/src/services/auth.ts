import axios from 'axios'
import { AuthResponse, LoginData, RegisterData, User } from '../types'

const API_URL = 'http://localhost:3001/api/auth'

// Время неактивности до автоматического выхода (30 минут)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000

let inactivityTimer: NodeJS.Timeout | null = null
let refreshTokenTimer: NodeJS.Timeout | null = null

// Функция для обновления таймера неактивности
const resetInactivityTimer = (callback: () => void) => {
	if (inactivityTimer) {
		clearTimeout(inactivityTimer)
	}
	inactivityTimer = setTimeout(callback, INACTIVITY_TIMEOUT)
}

// Функция для настройки автоматического обновления токена
const setupRefreshTokenTimer = (callback: () => Promise<void>) => {
	if (refreshTokenTimer) {
		clearInterval(refreshTokenTimer)
	}
	// Обновляем токен каждые 14 минут (токен живет 15 минут)
	refreshTokenTimer = setInterval(callback, 14 * 60 * 1000)
}

// Очистка всех таймеров
const clearTimers = () => {
	if (inactivityTimer) {
		clearTimeout(inactivityTimer)
		inactivityTimer = null
	}
	if (refreshTokenTimer) {
		clearInterval(refreshTokenTimer)
		refreshTokenTimer = null
	}
}

// Функция для сохранения пользователя
const saveUser = (user: User) => {
	localStorage.setItem('user', JSON.stringify(user))
}

// Функция для получения пользователя
const getUser = (): User | null => {
	const userStr = localStorage.getItem('user')
	return userStr ? JSON.parse(userStr) : null
}

// Функция для удаления пользователя
const removeUser = () => {
	localStorage.removeItem('user')
}

export const authApi = {
	register: async (data: RegisterData): Promise<AuthResponse> => {
		try {
			const response = await axios.post(`${API_URL}/register`, data, {
				withCredentials: true,
			})
			const { user } = response.data
			saveUser(user)
			return response.data
		} catch (error: any) {
			console.error(
				'Ошибка при регистрации:',
				error.response?.data?.error || error.message
			)
			throw new Error(error.response?.data?.error || 'Ошибка при регистрации')
		}
	},

	login: async (data: LoginData): Promise<AuthResponse> => {
		try {
			const response = await axios.post(`${API_URL}/login`, data, {
				withCredentials: true,
			})
			const { user } = response.data
			saveUser(user)
			return response.data
		} catch (error: any) {
			console.error(
				'Ошибка при входе:',
				error.response?.data?.error || error.message
			)
			throw new Error(error.response?.data?.error || 'Ошибка при входе')
		}
	},

	getProfile: async (): Promise<User> => {
		try {
			const response = await axios.get(`${API_URL}/profile`, {
				withCredentials: true,
			})
			const user = response.data
			saveUser(user)
			return user
		} catch (error: any) {
			console.error(
				'Ошибка при получении профиля:',
				error.response?.data?.error || error.message
			)
			throw new Error(
				error.response?.data?.error || 'Ошибка при получении профиля'
			)
		}
	},

	logout: async (): Promise<void> => {
		try {
			await axios.post(
				`${API_URL}/logout`,
				{},
				{
					withCredentials: true,
				}
			)
		} catch (error: any) {
			console.error(
				'Ошибка при выходе:',
				error.response?.data?.error || error.message
			)
			throw new Error(error.response?.data?.error || 'Ошибка при выходе')
		} finally {
			removeUser()
			clearTimers()
		}
	},

	refreshToken: async (): Promise<{ user: User }> => {
		try {
			const response = await axios.post(
				`${API_URL}/refresh-token`,
				{},
				{
					withCredentials: true,
				}
			)
			const { user } = response.data
			saveUser(user)
			return response.data
		} catch (error: any) {
			console.error(
				'Ошибка при обновлении токена:',
				error.response?.data?.error || error.message
			)
			removeUser()
			throw new Error(
				error.response?.data?.error || 'Ошибка при обновлении токена'
			)
		}
	},

	setupAuthTokens: (onLogout: () => void) => {
		// Настраиваем автоматический выход при неактивности
		const resetTimer = () => resetInactivityTimer(onLogout)

		// Добавляем слушатели событий для отслеживания активности
		window.addEventListener('mousemove', resetTimer)
		window.addEventListener('keypress', resetTimer)
		window.addEventListener('click', resetTimer)
		window.addEventListener('scroll', resetTimer)

		// Запускаем таймер при инициализации
		resetTimer()

		// Настраиваем автоматическое обновление токена
		setupRefreshTokenTimer(async () => {
			try {
				await authApi.refreshToken()
			} catch (error) {
				console.error('Ошибка при автоматическом обновлении токена:', error)
				onLogout()
			}
		})

		// Возвращаем функцию очистки
		return () => {
			window.removeEventListener('mousemove', resetTimer)
			window.removeEventListener('keypress', resetTimer)
			window.removeEventListener('click', resetTimer)
			window.removeEventListener('scroll', resetTimer)
			clearTimers()
		}
	},
}

// Создаем перехватчик для обработки ошибок ответов
axios.interceptors.response.use(
	response => response,
	async error => {
		if (error.response?.status === 401) {
			try {
				const { user } = await authApi.refreshToken()
				// Повторяем исходный запрос
				const config = error.config
				return axios(config)
			} catch (refreshError) {
				console.error('Ошибка при обновлении токена:', refreshError)
				// Если не удалось обновить токен, перенаправляем на страницу входа
				window.location.href = '/auth'
				return Promise.reject(error)
			}
		}
		return Promise.reject(error)
	}
)
