import { FC, ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { RegisterData } from '../types'

export interface RegisterFormProps {
	onSubmit: (data: RegisterData) => Promise<void>
	onLoginClick: () => void
	children?: ReactNode
}

export const RegisterForm: FC<RegisterFormProps> = ({
	onSubmit,
	onLoginClick,
	children,
}) => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const data: RegisterData = {
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
			middleName: formData.get('middleName') as string,
			birthDate: formData.get('birthDate') as string,
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
				Регистрация
			</Typography>
			{children}
			<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
				Зарегистрироваться
			</Button>
			<Button fullWidth onClick={onLoginClick}>
				Уже есть аккаунт? Войти
			</Button>
		</Box>
	)
}
