import React from 'react'
import { Box } from '@mui/material'

interface PageContainerProps {
	children: React.ReactNode
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				maxWidth: '1200px',
				mx: 'auto',
				width: '100%',
			}}
		>
			{children}
		</Box>
	)
}
