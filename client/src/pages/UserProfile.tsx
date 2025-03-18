import React, { useState, useEffect, useCallback } from 'react'
import {
	Container,
	Typography,
	Paper,
	Box,
	Button,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Stack,
	useTheme,
	useMediaQuery,
	Snackbar,
	Alert,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { userApi } from '../services/users'
import { User, UpdateUserData } from '../types'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'
import { formatAge } from '../utils/format'
import { PageContainer } from '../components/PageContainer'

export const UserProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [editForm, setEditForm] = useState<UpdateUserData>({})
	const [notification, setNotification] = useState<{
		message: string
		type: 'success' | 'error'
	} | null>(null)

	const { user: currentUser } = useAuth()
	const navigate = useNavigate()

	const fetchUser = useCallback(async () => {
		try {
			setIsLoading(true)
			const response = await userApi.getUser(Number(id))
			setUser(response)
		} catch (error: any) {
			console.error('Ошибка при загрузке профиля пользователя')
			setNotification({
				message:
					error.response?.data?.error ||
					'Ошибка при загрузке данных пользователя',
				type: 'error',
			})
			if (error.response?.status === 403) {
				navigate('/')
			}
		} finally {
			setIsLoading(false)
		}
	}, [id, navigate])

	useEffect(() => {
		if (!currentUser) {
			navigate('/auth')
			return
		}

		if (!id) {
			navigate('/')
			return
		}

		fetchUser()
	}, [id, currentUser, navigate, fetchUser])

	const handleEdit = () => {
		if (!user) return
		setEditForm({
			firstName: user.firstName,
			lastName: user.lastName,
			middleName: user.middleName,
			birthDate: user.birthDate,
			email: user.email,
		})
		setIsEditDialogOpen(true)
	}

	const handleSubmit = async () => {
		if (!user) return

		try {
			await userApi.updateUser(user.id, editForm)
			setNotification({
				message: 'Данные успешно обновлены',
				type: 'success',
			})
			setIsEditDialogOpen(false)
			fetchUser()
		} catch (error: any) {
			setNotification({
				message: error.response?.data?.error || 'Ошибка при обновлении данных',
				type: 'error',
			})
		}
	}

	if (isLoading) {
		return (
			<Container sx={{ py: 4, textAlign: 'center' }}>
				<Typography>Загрузка...</Typography>
			</Container>
		)
	}

	if (!user) {
		return null
	}

	return (
		<PageContainer>
			<Container maxWidth='md' sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
				<Paper sx={{ p: { xs: 2, sm: 3 } }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							mb: 3,
						}}
					>
						<Typography variant='h4' component='h1' gutterBottom>
							Профиль пользователя
						</Typography>
						{currentUser?.id === user.id && (
							<Button
								variant='contained'
								startIcon={<EditIcon />}
								onClick={handleEdit}
							>
								Редактировать
							</Button>
						)}
					</Box>

					<Stack spacing={2}>
						<Typography variant='h5'>
							{user.lastName} {user.firstName}
							{user.middleName && ` ${user.middleName}`}
						</Typography>
						<Typography>
							<strong>Email:</strong> {user.email}
						</Typography>
						<Typography>
							<strong>Роль:</strong>{' '}
							{user.role === 'admin' ? 'Администратор' : 'Пользователь'}
						</Typography>
						{user.birthDate && (
							<Typography>
								<strong>Дата рождения:</strong>{' '}
								{format(new Date(user.birthDate), 'dd.MM.yyyy')}
							</Typography>
						)}
						<Typography>
							<strong>Возраст:</strong> {formatAge(user.age ?? null)}
						</Typography>
						<Typography>
							<strong>Дата регистрации:</strong>{' '}
							{format(new Date(user.createdAt!), 'dd.MM.yyyy')}
						</Typography>
					</Stack>
				</Paper>

				<Dialog
					open={isEditDialogOpen}
					onClose={() => setIsEditDialogOpen(false)}
					fullScreen={isMobile}
					maxWidth='sm'
					fullWidth
				>
					<DialogTitle>Редактировать профиль</DialogTitle>
					<DialogContent sx={{ pt: 2 }}>
						<Stack spacing={2} sx={{ mt: 1 }}>
							<TextField
								label='Фамилия'
								fullWidth
								value={editForm.lastName || ''}
								onChange={e =>
									setEditForm({ ...editForm, lastName: e.target.value })
								}
							/>
							<TextField
								label='Имя'
								fullWidth
								value={editForm.firstName || ''}
								onChange={e =>
									setEditForm({ ...editForm, firstName: e.target.value })
								}
							/>
							<TextField
								label='Отчество'
								fullWidth
								value={editForm.middleName || ''}
								onChange={e =>
									setEditForm({ ...editForm, middleName: e.target.value })
								}
							/>
							<TextField
								label='Дата рождения'
								type='date'
								fullWidth
								value={editForm.birthDate || ''}
								onChange={e =>
									setEditForm({ ...editForm, birthDate: e.target.value })
								}
								InputLabelProps={{
									shrink: true,
								}}
							/>
							<TextField
								label='Email'
								type='email'
								fullWidth
								value={editForm.email || ''}
								onChange={e =>
									setEditForm({ ...editForm, email: e.target.value })
								}
							/>
						</Stack>
					</DialogContent>
					<DialogActions sx={{ px: 3, pb: 2 }}>
						<Button onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
						<Button onClick={handleSubmit} variant='contained'>
							Сохранить
						</Button>
					</DialogActions>
				</Dialog>

				<Snackbar
					open={!!notification}
					autoHideDuration={6000}
					onClose={() => setNotification(null)}
					anchorOrigin={{
						vertical: isMobile ? 'top' : 'bottom',
						horizontal: 'center',
					}}
				>
					<Alert
						onClose={() => setNotification(null)}
						severity={notification?.type}
						sx={{ width: '100%' }}
					>
						{notification?.message}
					</Alert>
				</Snackbar>
			</Container>
		</PageContainer>
	)
}
