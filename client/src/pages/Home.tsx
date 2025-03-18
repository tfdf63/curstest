import React from 'react'
import { Typography, Container, Box } from '@mui/material'
import { PageContainer } from '../components/PageContainer'

export const Home: React.FC = () => {
	return (
		<PageContainer>
			<Container maxWidth='lg'>
				<Box sx={{ mb: 4 }}>
					<Typography variant='h4' component='h1'>
						Главная страница
					</Typography>
				</Box>

				<Typography variant='body1'>
					Добро пожаловать в систему управления футбольными матчами!
				</Typography>
			</Container>
		</PageContainer>
	)
}
