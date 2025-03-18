import React, { useState } from 'react'
import {
	AppBar,
	Box,
	CssBaseline,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from '@mui/material'
import {
	Menu as MenuIcon,
	Person as PersonIcon,
	Group as GroupIcon,
	Logout as LogoutIcon,
	Home as HomeIcon,
	People as PeopleIcon,
	SportsSoccer as TeamsIcon,
	Sports as GamesIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DRAWER_WIDTH = 240

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [mobileOpen, setMobileOpen] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const { user, logout } = useAuth()

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const handleLogout = async () => {
		await logout()
		navigate('/auth')
	}

	const menuItems = [
		{
			text: 'Главная',
			icon: <HomeIcon />,
			path: '/',
		},
		...(user?.role === 'admin'
			? [
					{
						text: 'Пользователи',
						icon: <PeopleIcon />,
						path: '/users',
					},
					{
						text: 'Команды',
						icon: <TeamsIcon />,
						path: '/teams',
					},
					{
						text: 'Матчи',
						icon: <GamesIcon />,
						path: '/games',
					},
			  ]
			: []),
	]

	const drawer = (
		<List>
			{menuItems.map(item => (
				<ListItem key={item.text} disablePadding>
					<ListItemButton
						onClick={() => navigate(item.path)}
						selected={location.pathname === item.path}
					>
						<ListItemIcon>{item.icon}</ListItemIcon>
						<ListItemText primary={item.text} />
					</ListItemButton>
				</ListItem>
			))}
		</List>
	)

	const getFormattedUserInfo = () => {
		if (!user) return ''
		return `${user.lastName} ${user.firstName} (${
			user.role === 'admin' ? 'Администратор' : 'Пользователь'
		})`
	}

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh' }}>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{
					zIndex: theme => theme.zIndex.drawer + 1,
					width: '100%',
				}}
			>
				<Toolbar>
					<IconButton
						color='inherit'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
						{getFormattedUserInfo()}
					</Typography>
					<IconButton
						color='inherit'
						onClick={() => navigate('/')}
						sx={{ mr: 1 }}
					>
						<HomeIcon />
					</IconButton>
					<IconButton
						color='inherit'
						onClick={() => navigate(`/users/${user?.id}`)}
						sx={{ mr: 1 }}
					>
						<PersonIcon />
					</IconButton>
					<IconButton color='inherit' onClick={handleLogout}>
						<LogoutIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Box
				component='nav'
				sx={{
					width: { sm: DRAWER_WIDTH },
					flexShrink: { sm: 8 },
					display: { sm: user?.role === 'admin' ? 'block' : 'none' },
				}}
			>
				{/* Мобильная версия */}
				<Drawer
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true,
					}}
					sx={{
						display: {
							xs: user?.role === 'admin' ? 'block' : 'none',
							sm: 'none',
						},
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: DRAWER_WIDTH,
							height: 'calc(100% - 64px)',
							top: '64px',
						},
					}}
				>
					{drawer}
				</Drawer>
				{/* Десктопная версия */}
				<Drawer
					variant='permanent'
					sx={{
						display: {
							xs: 'none',
							sm: user?.role === 'admin' ? 'block' : 'none',
						},
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: DRAWER_WIDTH,
							height: 'calc(100% - 64px)',
							top: '64px',
							position: 'fixed',
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					pt: '88px',
					px: 3,
					width: '100%',
					ml: { sm: user?.role === 'admin' ? `${DRAWER_WIDTH}px` : 0 },
				}}
			>
				{children}
			</Box>
		</Box>
	)
}

export default Layout
