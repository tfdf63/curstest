import React, { useState, useEffect } from 'react'
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
	Alert,
	useTheme,
	useMediaQuery,
} from '@mui/material'
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material'
import { teamApi } from '../services/teams'
import { Team } from '../types'
import { formatDate } from '../utils/formatters'

// Компонент для отображения карточки команды на мобильных устройствах
const TeamCard: React.FC<{
	team: Team
	onEdit: (team: Team) => void
	onDelete: (id: number) => void
}> = ({ team, onEdit, onDelete }) => {
	return (
		<Paper
			sx={{
				p: 2,
				mb: 2,
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
			}}
		>
			<Typography variant='h6' gutterBottom>
				{team.name}
			</Typography>
			<Typography variant='body1' color='text.secondary' gutterBottom>
				Город: {team.city}
			</Typography>
			<Typography variant='body2' color='text.secondary' gutterBottom>
				Создано: {formatDate(team.createdAt)}
			</Typography>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
				<IconButton color='primary' onClick={() => onEdit(team)} size='small'>
					<EditIcon />
				</IconButton>
				<IconButton
					color='error'
					onClick={() => onDelete(team.id)}
					size='small'
				>
					<DeleteIcon />
				</IconButton>
			</Box>
		</Paper>
	)
}

// Основной компонент страницы команд
export const Teams: React.FC = () => {
	const [teams, setTeams] = useState<Team[]>([])
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingTeam, setEditingTeam] = useState<Team | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		city: '',
	})
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	})

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))

	// Загрузка списка команд при монтировании компонента
	useEffect(() => {
		fetchTeams()
	}, [])

	// Функция получения списка команд
	const fetchTeams = async () => {
		try {
			const data = await teamApi.getAll()
			setTeams(data)
		} catch (error) {
			showSnackbar('Ошибка при загрузке команд', 'error')
		}
	}

	// Обработчик открытия диалога создания/редактирования
	const handleDialogOpen = (team?: Team) => {
		if (team) {
			setEditingTeam(team)
			setFormData({
				name: team.name,
				city: team.city,
			})
		} else {
			setEditingTeam(null)
			setFormData({
				name: '',
				city: '',
			})
		}
		setDialogOpen(true)
	}

	// Обработчик закрытия диалога
	const handleDialogClose = () => {
		setDialogOpen(false)
		setEditingTeam(null)
	}

	// Обработчик отправки формы
	const handleSubmit = async () => {
		try {
			if (editingTeam) {
				await teamApi.update(editingTeam.id, formData)
				showSnackbar('Команда успешно обновлена')
			} else {
				await teamApi.create(formData)
				showSnackbar('Команда успешно создана')
			}
			handleDialogClose()
			fetchTeams()
		} catch (error) {
			showSnackbar(
				`Ошибка при ${editingTeam ? 'обновлении' : 'создании'} команды`,
				'error'
			)
		}
	}

	// Обработчик удаления команды
	const handleDelete = async (id: number) => {
		if (window.confirm('Вы уверены, что хотите удалить эту команду?')) {
			try {
				await teamApi.delete(id)
				showSnackbar('Команда успешно удалена')
				fetchTeams()
			} catch (error) {
				showSnackbar('Ошибка при удалении команды', 'error')
			}
		}
	}

	// Функция отображения уведомлений
	const showSnackbar = (
		message: string,
		severity: 'success' | 'error' = 'success'
	) => {
		setSnackbar({
			open: true,
			message,
			severity,
		})
	}

	// Валидация формы
	const isFormValid = formData.name.trim() !== '' && formData.city.trim() !== ''

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 3,
				}}
			>
				<Typography variant='h4'>Команды</Typography>
				<Button
					variant='contained'
					startIcon={<AddIcon />}
					onClick={() => handleDialogOpen()}
				>
					Добавить команду
				</Button>
			</Box>

			{isMobile ? (
				// Мобильная версия - карточки
				<Box>
					{teams.map(team => (
						<TeamCard
							key={team.id}
							team={team}
							onEdit={handleDialogOpen}
							onDelete={handleDelete}
						/>
					))}
					{teams.length === 0 && (
						<Typography color='text.secondary' align='center'>
							Команды не найдены
						</Typography>
					)}
				</Box>
			) : (
				// Десктопная версия - таблица
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Название</TableCell>
								<TableCell>Город</TableCell>
								<TableCell>Дата создания</TableCell>
								<TableCell>Действия</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{teams.map(team => (
								<TableRow key={team.id}>
									<TableCell>{team.id}</TableCell>
									<TableCell>{team.name}</TableCell>
									<TableCell>{team.city}</TableCell>
									<TableCell>{formatDate(team.createdAt)}</TableCell>
									<TableCell>
										<IconButton
											color='primary'
											onClick={() => handleDialogOpen(team)}
										>
											<EditIcon />
										</IconButton>
										<IconButton
											color='error'
											onClick={() => handleDelete(team.id)}
										>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
							{teams.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} align='center'>
										Команды не найдены
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{/* Диалог создания/редактирования */}
			<Dialog
				open={dialogOpen}
				onClose={handleDialogClose}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>
					{editingTeam ? 'Редактировать команду' : 'Создать команду'}
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						label='Название команды'
						fullWidth
						variant='outlined'
						value={formData.name}
						onChange={e => setFormData({ ...formData, name: e.target.value })}
						error={formData.name.trim() === ''}
						helperText={formData.name.trim() === '' ? 'Обязательное поле' : ''}
						sx={{ mb: 2, mt: 1 }}
					/>
					<TextField
						margin='dense'
						label='Город'
						fullWidth
						variant='outlined'
						value={formData.city}
						onChange={e => setFormData({ ...formData, city: e.target.value })}
						error={formData.city.trim() === ''}
						helperText={formData.city.trim() === '' ? 'Обязательное поле' : ''}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Отмена</Button>
					<Button
						onClick={handleSubmit}
						variant='contained'
						disabled={!isFormValid}
					>
						{editingTeam ? 'Сохранить' : 'Создать'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Уведомления */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					variant='filled'
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	)
}
