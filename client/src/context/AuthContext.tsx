import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types'
import { authApi } from '../services/auth'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
	user: User | null
	setUser: (user: User | null) => void
	logout: () => Promise<void>
	isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null)
	const navigate = useNavigate()
	const isAdmin = user?.role === 'admin'

	const handleLogout = async () => {
		try {
			await authApi.logout()
		} catch (error) {
			console.error('Ошибка при выходе из системы:', error)
		} finally {
			setUser(null)
			localStorage.removeItem('token')
			localStorage.removeItem('user')
			navigate('/auth')
		}
	}

	useEffect(() => {
		let mounted = true

		// Пытаемся восстановить сессию при загрузке приложения
		const initAuth = async () => {
			try {
				// Сначала проверяем наличие сохраненного пользователя
				const savedUser = localStorage.getItem('user')
				const token = localStorage.getItem('token')

				if (savedUser && token) {
					// Если есть сохраненные данные, устанавливаем их
					if (mounted) {
						setUser(JSON.parse(savedUser))
					}

					try {
						// Пытаемся обновить токен
						const { user } = await authApi.refreshToken()
						if (mounted) {
							setUser(user)
							localStorage.setItem('user', JSON.stringify(user))
						}
					} catch (refreshError) {
						console.error('Ошибка обновления токена:', refreshError)
						// Если не удалось обновить токен, очищаем данные
						if (mounted) {
							setUser(null)
							localStorage.removeItem('token')
							localStorage.removeItem('user')
							if (window.location.pathname !== '/auth') {
								navigate('/auth')
							}
						}
					}
				} else {
					// Если нет сохраненных данных, перенаправляем на страницу входа
					if (mounted && window.location.pathname !== '/auth') {
						navigate('/auth')
					}
				}
			} catch (error) {
				console.error('Ошибка инициализации аутентификации:', error)
				if (mounted) {
					setUser(null)
					localStorage.removeItem('token')
					localStorage.removeItem('user')
					if (window.location.pathname !== '/auth') {
						navigate('/auth')
					}
				}
			}
		}

		initAuth()

		// Очищаем флаг mounted при размонтировании
		return () => {
			mounted = false
		}
	}, [navigate])

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				logout: handleLogout,
				isAdmin,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
