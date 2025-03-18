import React, { useState, useEffect } from 'react'
import {
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	CardMedia,
	CardActions,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Snackbar,
	Alert,
	AppBar,
	Toolbar,
	Box,
	useTheme,
	useMediaQuery,
	Stack,
} from '@mui/material'
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Home as HomeIcon,
	Logout as LogoutIcon,
	Add as AddIcon,
} from '@mui/icons-material'
import { itemApi } from '../services/items'
import { Item } from '../types'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const ItemList: React.FC = () => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [items, setItems] = useState<Item[]>([])
	const [selectedItem, setSelectedItem] = useState<Item | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editForm, setEditForm] = useState<Partial<Item>>({})
	const [notification, setNotification] = useState<{
		message: string
		type: 'success' | 'error'
	} | null>(null)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [createForm, setCreateForm] = useState({
		name: '',
		description: '',
		price: 0,
		imageUrl: '',
	})

	const { user: currentUser, logout } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		fetchItems()
	}, [])

	const handleLogout = () => {
		logout()
		navigate('/auth')
	}

	const fetchItems = async () => {
		try {
			const data = await itemApi.getItems()
			// Сортируем элементы по id в порядке возрастания
			const sortedItems = data.sort((a: Item, b: Item) => a.id - b.id)
			setItems(sortedItems)
		} catch (error) {
			setNotification({
				message: 'Ошибка при загрузке элементов',
				type: 'error',
			})
		}
	}

	const handleEdit = (item: Item) => {
		setSelectedItem(item)
		setEditForm({
			name: item.name,
			description: item.description,
			price: item.price,
			imageUrl: item.imageUrl,
		})
		setIsDialogOpen(true)
	}

	const handleDelete = async (item: Item) => {
		if (
			window.confirm(`Вы уверены, что хотите удалить элемент ${item.name}?`)
		) {
			try {
				await itemApi.deleteItem(item.id)
				setNotification({
					message: 'Элемент успешно удален',
					type: 'success',
				})
				fetchItems()
			} catch (error) {
				setNotification({
					message: 'Ошибка при удалении элемента',
					type: 'error',
				})
			}
		}
	}

	const handleSubmit = async () => {
		if (!selectedItem) return

		try {
			await itemApi.updateItem(selectedItem.id, editForm)
			setNotification({
				message: 'Элемент успешно обновлен',
				type: 'success',
			})
			setIsDialogOpen(false)
			fetchItems()
		} catch (error) {
			setNotification({
				message: 'Ошибка при обновлении элемента',
				type: 'error',
			})
		}
	}

	const handleCreateItem = async () => {
		try {
			await itemApi.createItem({
				...createForm,
				price: Number(createForm.price),
			})
			setNotification({
				message: 'Элемент успешно создан',
				type: 'success',
			})
			setIsCreateDialogOpen(false)
			fetchItems()
			setCreateForm({
				name: '',
				description: '',
				price: 0,
				imageUrl: '',
			})
		} catch (error) {
			setNotification({
				message: 'Ошибка при создании элемента',
				type: 'error',
			})
		}
	}

	return (
		<>
			<AppBar position='static'>
				<Toolbar
					sx={{
						flexDirection: isMobile ? 'column' : 'row',
						py: isMobile ? 2 : 0,
					}}
				>
					<Typography
						variant='h6'
						component='div'
						sx={{
							flexGrow: 1,
							mb: isMobile ? 1 : 0,
							textAlign: isMobile ? 'center' : 'left',
						}}
					>
						{currentUser?.lastName} {currentUser?.firstName} (
						{currentUser?.role})
					</Typography>
					<Box sx={{ display: 'flex', gap: 1 }}>
						<Button
							color='inherit'
							onClick={() => navigate('/')}
							startIcon={<HomeIcon />}
						>
							{!isMobile && 'На главную'}
						</Button>
						<Button
							color='inherit'
							onClick={handleLogout}
							startIcon={<LogoutIcon />}
						>
							{!isMobile && 'Выйти'}
						</Button>
					</Box>
				</Toolbar>
			</AppBar>

			<Container maxWidth='lg' sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: isMobile ? 'column' : 'row',
						justifyContent: 'space-between',
						alignItems: isMobile ? 'stretch' : 'center',
						mb: { xs: 2, sm: 3, md: 4 },
						gap: 2,
					}}
				>
					<Typography
						variant='h4'
						component='h1'
						sx={{
							fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
							textAlign: isMobile ? 'center' : 'left',
						}}
					>
						Список элементов
					</Typography>
					<Button
						variant='contained'
						color='primary'
						startIcon={<AddIcon />}
						onClick={() => setIsCreateDialogOpen(true)}
						fullWidth={isMobile}
					>
						Добавить элемент
					</Button>
				</Box>

				<Grid container spacing={3}>
					{items.map(item => (
						<Grid item xs={12} sm={6} md={4} key={item.id}>
							<Card>
								<CardMedia
									component='img'
									height='200'
									image={item.imageUrl}
									alt={item.name}
								/>
								<CardContent>
									<Typography gutterBottom variant='h5' component='div'>
										{item.name}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{item.description}
									</Typography>
									<Typography variant='h6' color='primary' sx={{ mt: 1 }}>
										{item.price} ₽
									</Typography>
								</CardContent>
								<CardActions>
									<Button
										size='small'
										startIcon={<EditIcon />}
										onClick={() => handleEdit(item)}
									>
										Редактировать
									</Button>
									<Button
										size='small'
										color='error'
										startIcon={<DeleteIcon />}
										onClick={() => handleDelete(item)}
									>
										Удалить
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>

				<Dialog
					open={isDialogOpen}
					onClose={() => setIsDialogOpen(false)}
					fullScreen={isMobile}
					maxWidth='sm'
					fullWidth
				>
					<DialogTitle>Редактировать элемент</DialogTitle>
					<DialogContent sx={{ pt: 2, minWidth: isMobile ? 'auto' : '400px' }}>
						<Stack spacing={2} sx={{ mt: 1 }}>
							<TextField
								label='Название'
								fullWidth
								value={editForm.name || ''}
								onChange={e =>
									setEditForm({ ...editForm, name: e.target.value })
								}
							/>
							<TextField
								label='Описание'
								fullWidth
								multiline
								rows={4}
								value={editForm.description || ''}
								onChange={e =>
									setEditForm({ ...editForm, description: e.target.value })
								}
							/>
							<TextField
								label='Цена'
								type='number'
								fullWidth
								value={editForm.price || ''}
								onChange={e =>
									setEditForm({ ...editForm, price: Number(e.target.value) })
								}
							/>
							<TextField
								label='URL изображения'
								fullWidth
								value={editForm.imageUrl || ''}
								onChange={e =>
									setEditForm({ ...editForm, imageUrl: e.target.value })
								}
							/>
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
					<DialogTitle>Создать новый элемент</DialogTitle>
					<DialogContent>
						<Stack spacing={2} sx={{ mt: 1 }}>
							<TextField
								label='Название'
								fullWidth
								required
								value={createForm.name}
								onChange={e =>
									setCreateForm({ ...createForm, name: e.target.value })
								}
							/>
							<TextField
								label='Описание'
								fullWidth
								multiline
								rows={4}
								required
								value={createForm.description}
								onChange={e =>
									setCreateForm({ ...createForm, description: e.target.value })
								}
							/>
							<TextField
								label='Цена'
								type='number'
								fullWidth
								required
								value={createForm.price}
								onChange={e =>
									setCreateForm({
										...createForm,
										price: Number(e.target.value),
									})
								}
							/>
							<TextField
								label='URL изображения'
								fullWidth
								required
								value={createForm.imageUrl}
								onChange={e =>
									setCreateForm({ ...createForm, imageUrl: e.target.value })
								}
							/>
						</Stack>
					</DialogContent>
					<DialogActions sx={{ px: 3, pb: 2 }}>
						<Button onClick={() => setIsCreateDialogOpen(false)}>Отмена</Button>
						<Button onClick={handleCreateItem} variant='contained'>
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
			</Container>
		</>
	)
}
