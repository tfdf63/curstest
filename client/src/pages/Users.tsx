import React, { useState, useEffect } from 'react'
import {
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Snackbar,
	Alert,
	useTheme,
	useMediaQuery,
	Stack,
	Card,
	CardContent,
	CardActions,
	Container,
} from '@mui/material'
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Add as AddIcon,
	Person as PersonIcon,
} from '@mui/icons-material'
import { userApi } from '../services/users'
import { User, UpdateUserData } from '../types'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { formatAge } from '../utils/format'
import { PageContainer } from '../components/PageContainer'

export const Users: React.FC = () => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isTablet = useMediaQuery(theme.breakpoints.down('md'))
	const [users, setUsers] = useState<User[]>([])
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editForm, setEditForm] = useState<UpdateUserData>({})
	const [notification, setNotification] = useState<{
		message: string
		type: 'success' | 'error'
	} | null>(null)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [createForm, setCreateForm] = useState({
		firstName: '',
		lastName: '',
		middleName: '',
		birthDate: '',
		email: '',
		password: '',
		role: 'fan' as 'admin' | 'fan',
	})

	const { user: currentUser } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!currentUser?.role || currentUser.role !== 'admin') {
			navigate('/')
			return
		}
		fetchUsers()
	}, [currentUser, navigate])

	const fetchUsers = async () => {
		try {
			const data = await userApi.getUsers()
			const sortedUsers = data.sort((a, b) =>
				a.lastName.localeCompare(b.lastName, 'ru')
			)
			setUsers(sortedUsers)
		} catch (error) {
			setNotification({
				message: 'Ошибка при загрузке пользователей',
				type: 'error',
			})
		}
	}

	const handleEdit = (user: User) => {
		setSelectedUser(user)
		setEditForm({
			firstName: user.firstName,
			lastName: user.lastName,
			middleName: user.middleName,
			birthDate: user.birthDate,
			email: user.email,
			role: user.role,
		})
		setIsDialogOpen(true)
	}

	const handleDelete = async (user: User) => {
		if (
			window.confirm(
				`Вы уверены, что хотите удалить пользователя ${user.firstName} ${user.lastName}?`
			)
		) {
			try {
				await userApi.deleteUser(user.id)
				setNotification({
					message: 'Пользователь успешно удален',
					type: 'success',
				})
				fetchUsers()
			} catch (error: any) {
				setNotification({
					message:
						error.response?.data?.error || 'Ошибка при удалении пользователя',
					type: 'error',
				})
			}
		}
	}

	const handleSubmit = async () => {
		if (!selectedUser) return

		try {
			await userApi.updateUser(selectedUser.id, editForm)
			setNotification({
				message: 'Пользователь успешно обновлен',
				type: 'success',
			})
			setIsDialogOpen(false)
			fetchUsers()
		} catch (error: any) {
			setNotification({
				message:
					error.response?.data?.error || 'Ошибка при обновлении пользователя',
				type: 'error',
			})
		}
	}

	const handleCreateUser = async () => {
		try {
			await userApi.createUser(createForm)
			setNotification({
				message: 'Пользователь успешно создан',
				type: 'success',
			})
			setIsCreateDialogOpen(false)
			fetchUsers()
			setCreateForm({
				firstName: '',
				lastName: '',
				middleName: '',
				birthDate: '',
				email: '',
				password: '',
				role: 'fan',
			})
		} catch (error) {
			setNotification({
				message: 'Ошибка при создании пользователя',
				type: 'error',
			})
		}
	}

	const formatRole = (role: string) => {
		return role === 'admin' ? 'admin' : 'fan'
	}

	const formatDate = (date: string | undefined | null) => {
		if (!date) return ''
		return format(new Date(date), 'dd.MM.yyyy')
	}

	const UserTable = () => (
		<TableContainer component={Paper} sx={{ width: '100%' }}>
			<Table sx={{ width: '100%' }}>
				<TableHead>
					<TableRow>
						{!isMobile && <TableCell width={50}>ID</TableCell>}
						<TableCell width={50} align='center'>
							Профиль
						</TableCell>
						<TableCell width={150}>Фамилия</TableCell>
						<TableCell width={150}>Имя</TableCell>
						{!isTablet && <TableCell width={120}>Дата рождения</TableCell>}
						{!isMobile && <TableCell width={80}>Возраст</TableCell>}
						<TableCell width={200}>Email</TableCell>
						<TableCell width={100}>Роль</TableCell>
						{!isTablet && <TableCell width={150}>Дата регистрации</TableCell>}
						<TableCell width={120} align='center'>
							Действия
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{users.map(user => (
						<TableRow key={user.id}>
							{!isMobile && <TableCell>{user.id}</TableCell>}
							<TableCell align='center'>
								<IconButton
									onClick={() => navigate(`/users/${user.id}`)}
									size='small'
									color='primary'
								>
									<PersonIcon />
								</IconButton>
							</TableCell>
							<TableCell sx={{ wordBreak: 'break-word' }}>
								{user.lastName}
							</TableCell>
							<TableCell sx={{ wordBreak: 'break-word' }}>
								{user.firstName}
							</TableCell>
							{!isTablet && <TableCell>{formatDate(user.birthDate)}</TableCell>}
							{!isMobile && (
								<TableCell>{formatAge(user.age ?? null)}</TableCell>
							)}
							<TableCell sx={{ wordBreak: 'break-word' }}>
								{user.email}
							</TableCell>
							<TableCell>{formatRole(user.role)}</TableCell>
							{!isTablet && (
								<TableCell>{formatDate(user.createdAt!)}</TableCell>
							)}
							<TableCell align='center'>
								<IconButton
									onClick={() => handleEdit(user)}
									disabled={user.id === currentUser?.id}
									size='small'
									sx={{ mr: 1 }}
								>
									<EditIcon />
								</IconButton>
								<IconButton
									onClick={() => handleDelete(user)}
									disabled={user.id === currentUser?.id}
									size='small'
								>
									<DeleteIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)

	const UserCards = () => (
		<Stack spacing={2} sx={{ width: '100%' }}>
			{users.map(user => (
				<Card key={user.id}>
					<CardContent>
						<Typography variant='h6' gutterBottom>
							{user.lastName} {user.firstName}
						</Typography>
						{user.middleName && (
							<Typography color='textSecondary' gutterBottom>
								Отчество: {user.middleName}
							</Typography>
						)}
						<Typography>Email: {user.email}</Typography>
						<Typography>Роль: {formatRole(user.role)}</Typography>
						{user.birthDate && (
							<Typography>
								Дата рождения: {formatDate(user.birthDate)}
							</Typography>
						)}
						<Typography>Возраст: {formatAge(user.age ?? null)}</Typography>
						<Typography>
							Дата регистрации: {formatDate(user.createdAt!)}
						</Typography>
					</CardContent>
					<CardActions>
						<Button
							size='small'
							startIcon={<EditIcon />}
							onClick={() => handleEdit(user)}
							disabled={user.id === currentUser?.id}
						>
							Редактировать
						</Button>
						<Button
							size='small'
							color='error'
							startIcon={<DeleteIcon />}
							onClick={() => handleDelete(user)}
							disabled={user.id === currentUser?.id}
						>
							Удалить
						</Button>
						<Button
							size='small'
							color='primary'
							startIcon={<PersonIcon />}
							onClick={() => navigate(`/users/${user.id}`)}
						>
							Профиль
						</Button>
					</CardActions>
				</Card>
			))}
		</Stack>
	)

	return (
		<PageContainer>
			<Container maxWidth='lg'>
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
					sx={{ mb: 3 }}
				>
					<Typography variant='h4' component='h1'>
						Пользователи
					</Typography>
					<Button
						variant='contained'
						startIcon={<AddIcon />}
						onClick={() => setIsCreateDialogOpen(true)}
					>
						Добавить пользователя
					</Button>
				</Stack>

				{isMobile ? <UserCards /> : <UserTable />}
			</Container>

			<Dialog
				open={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				fullScreen={isMobile}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>Редактировать пользователя</DialogTitle>
				<DialogContent sx={{ pt: 2, minWidth: isMobile ? 'auto' : '400px' }}>
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
						<FormControl fullWidth>
							<InputLabel>Роль</InputLabel>
							<Select
								value={editForm.role || ''}
								onChange={e =>
									setEditForm({
										...editForm,
										role: e.target.value as 'admin' | 'fan',
									})
								}
								label='Роль'
							>
								<MenuItem value='admin'>admin</MenuItem>
								<MenuItem value='fan'>fan</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
					<Button onClick={handleSubmit} variant='contained'>
						Сохранить
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={isCreateDialogOpen}
				onClose={() => setIsCreateDialogOpen(false)}
				fullScreen={isMobile}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>Создать нового пользователя</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1 }}>
						<TextField
							label='Имя'
							fullWidth
							required
							value={createForm.firstName}
							onChange={e =>
								setCreateForm({ ...createForm, firstName: e.target.value })
							}
						/>
						<TextField
							label='Фамилия'
							fullWidth
							required
							value={createForm.lastName}
							onChange={e =>
								setCreateForm({ ...createForm, lastName: e.target.value })
							}
						/>
						<TextField
							label='Отчество'
							fullWidth
							value={createForm.middleName}
							onChange={e =>
								setCreateForm({ ...createForm, middleName: e.target.value })
							}
						/>
						<TextField
							label='Дата рождения'
							type='date'
							fullWidth
							InputLabelProps={{ shrink: true }}
							value={createForm.birthDate}
							onChange={e =>
								setCreateForm({ ...createForm, birthDate: e.target.value })
							}
						/>
						<TextField
							label='Email'
							type='email'
							fullWidth
							required
							value={createForm.email}
							onChange={e =>
								setCreateForm({ ...createForm, email: e.target.value })
							}
						/>
						<TextField
							label='Пароль'
							type='password'
							fullWidth
							required
							value={createForm.password}
							onChange={e =>
								setCreateForm({ ...createForm, password: e.target.value })
							}
						/>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button onClick={() => setIsCreateDialogOpen(false)}>Отмена</Button>
					<Button onClick={handleCreateUser} variant='contained'>
						Создать
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
		</PageContainer>
	)
}
