import { FC, ReactNode } from 'react'
import { Box, Button, Typography, TextField } from '@mui/material'
import { LoginData } from '../types'

export interface LoginFormProps {
	onSubmit: (data: LoginData) => Promise<void>
	onRegisterClick: () => void
	children?: ReactNode
}

export const LoginForm: FC<LoginFormProps> = ({
	onSubmit,
	onRegisterClick,
	children,
}) => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const data: LoginData = {
			email: formData.get('email') as string,
			password: formData.get('password') as string,
		}
		onSubmit(data)
	}

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
			sx={{
				mt: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography component='h1' variant='h5'>
				Вход
			</Typography>
			{children}
			<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
				Войти
			</Button>
			<Button fullWidth onClick={onRegisterClick}>
				Нет аккаунта? Зарегистрироваться
			</Button>
		</Box>
	)
}
