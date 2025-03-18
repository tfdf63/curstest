import React, { useState, useEffect } from 'react'
import {
	Snackbar,
	Button,
	Typography,
	Box,
	useTheme,
	useMediaQuery,
} from '@mui/material'

const CookieConsent: React.FC = () => {
	const [open, setOpen] = useState(false)
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	useEffect(() => {
		const consent = localStorage.getItem('cookieConsent')
		if (!consent) {
			setOpen(true)
		}
	}, [])

	const handleAccept = () => {
		localStorage.setItem('cookieConsent', 'true')
		setOpen(false)
	}

	return (
		<Snackbar
			open={open}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			sx={{
				'& .MuiPaper-root': {
					width: isMobile ? '100%' : '600px',
					maxWidth: '100%',
					backgroundColor: theme.palette.background.paper,
					borderRadius: 2,
					boxShadow: theme.shadows[4],
				},
			}}
		>
			<Box p={2}>
				<Typography variant='body1' gutterBottom>
					Мы используем файлы cookie для аутентификации и обеспечения
					безопасности. Эти файлы необходимы для корректной работы сайта и не
					используются для отслеживания или сбора личной информации.
				</Typography>
				<Box display='flex' justifyContent='flex-end' mt={1}>
					<Button
						variant='contained'
						color='primary'
						onClick={handleAccept}
						sx={{ minWidth: 100 }}
					>
						Понятно
					</Button>
				</Box>
			</Box>
		</Snackbar>
	)
}

export default CookieConsent
