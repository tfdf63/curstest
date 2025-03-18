import React, { useState, useEffect } from 'react'
import { Container, Snackbar, Alert, TextField } from '@mui/material'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { authApi } from '../services/auth'
import { LoginData, RegisterData } from '../types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Auth: React.FC = () => {
	const [isLoginMode, setIsLoginMode] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()
	const { setUser } = useAuth()
	const [formData, setFormData] = useState<RegisterData>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	})

	const handleLogin = async (data: LoginData) => {
		try {
			const response = await authApi.login(data)
			localStorage.setItem('token', response.token)
			localStorage.setItem('user', JSON.stringify(response.user))
			setUser(response.user)
			navigate('/')
		} catch (err: any) {
			setError(err.response?.data?.message || 'Ошибка при входе')
		}
	}

	const handleRegister = async (data: RegisterData) => {
		try {
			const response = await authApi.register(data)
			localStorage.setItem('token', response.token)
			localStorage.setItem('user', JSON.stringify(response.user))
			setUser(response.user)
			navigate('/')
		} catch (err: any) {
			setError(err.response?.data?.message || 'Ошибка при регистрации')
		}
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	return (
		<Container maxWidth='sm' sx={{ py: 4 }}>
			{isLoginMode ? (
				<LoginForm
					onSubmit={handleLogin}
					onRegisterClick={() => setIsLoginMode(false)}
				>
					<TextField
						margin='normal'
						required
						fullWidth
						label='Email'
						name='email'
						autoComplete='email'
						value={formData.email}
						onChange={handleChange}
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						name='password'
						label='Пароль'
						type='password'
						autoComplete='current-password'
						value={formData.password}
						onChange={handleChange}
					/>
				</LoginForm>
			) : (
				<RegisterForm
					onSubmit={handleRegister}
					onLoginClick={() => setIsLoginMode(true)}
				>
					{!isLoginMode && (
						<>
							<TextField
								margin='normal'
								required
								fullWidth
								label='Фамилия'
								name='lastName'
								autoComplete='family-name'
								value={formData.lastName}
								onChange={handleChange}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								label='Имя'
								name='firstName'
								autoComplete='given-name'
								value={formData.firstName}
								onChange={handleChange}
							/>
							<TextField
								margin='normal'
								fullWidth
								label='Отчество'
								name='middleName'
								autoComplete='additional-name'
								value={formData.middleName || ''}
								onChange={handleChange}
							/>
							<TextField
								margin='normal'
								fullWidth
								label='Дата рождения'
								name='birthDate'
								type='date'
								value={formData.birthDate || ''}
								onChange={handleChange}
								InputLabelProps={{
									shrink: true,
								}}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								label='Email'
								name='email'
								autoComplete='email'
								value={formData.email}
								onChange={handleChange}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								name='password'
								label='Пароль'
								type='password'
								autoComplete='new-password'
								value={formData.password}
								onChange={handleChange}
							/>
						</>
					)}
				</RegisterForm>
			)}
			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				onClose={() => setError(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert onClose={() => setError(null)} severity='error'>
					{error}
				</Alert>
			</Snackbar>
		</Container>
	)
}
