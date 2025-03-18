import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import { Home } from './pages/Home'
import { Auth } from './pages/Auth'
import { Users } from './pages/Users'
import { UserProfile } from './pages/UserProfile'
import { AuthProvider } from './context/AuthContext'
import CookieConsent from './components/CookieConsent'
import Layout from './components/Layout'
import { useAuth } from './context/AuthContext'
import { Teams } from './pages/Teams'

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#dc004e',
		},
	},
})

// Компонент для защищенных маршрутов с Layout
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
	element,
}) => {
	const { user } = useAuth()

	if (!user) {
		return <Navigate to='/auth' replace />
	}

	return <Layout>{element}</Layout>
}

// Компонент для маршрутов, доступных только администраторам
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
	const { user } = useAuth()

	if (!user || user.role !== 'admin') {
		return <Navigate to='/' replace />
	}

	return <Layout>{element}</Layout>
}

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<AuthProvider>
					<Routes>
						<Route path='/auth' element={<Auth />} />
						<Route
							path='/users/:id'
							element={<ProtectedRoute element={<UserProfile />} />}
						/>
						<Route
							path='/users'
							element={<ProtectedRoute element={<Users />} />}
						/>
						<Route path='/teams' element={<AdminRoute element={<Teams />} />} />
						<Route path='/' element={<ProtectedRoute element={<Home />} />} />
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
					<CookieConsent />
				</AuthProvider>
			</Router>
		</ThemeProvider>
	)
}

export default App
