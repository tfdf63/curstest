import React from 'react'
import {
	List,
	ListItem,
	ListItemText,
	IconButton,
	Paper,
	Typography,
	Box,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { Item } from '../types'

interface ItemListProps {
	items: Item[]
	onEdit: (item: Item) => void
	onDelete: (id: number) => void
	isAdmin: boolean
}

export const ItemList: React.FC<ItemListProps> = ({
	items,
	onEdit,
	onDelete,
	isAdmin,
}) => {
	if (items.length === 0) {
		return (
			<Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
				<Typography variant='body1'>Нет элементов</Typography>
			</Paper>
		)
	}

	return (
		<Paper elevation={2}>
			<List>
				{items.map((item, index) => (
					<ListItem
						key={item.id}
						divider={index < items.length - 1}
						sx={{
							'& .MuiListItemText-root': {
								mr: isAdmin ? 15 : 0,
								'& .MuiListItemText-primary': {
									wordBreak: 'break-word',
								},
								'& .MuiListItemText-secondary': {
									wordBreak: 'break-word',
								},
							},
						}}
						secondaryAction={
							isAdmin && (
								<Box
									sx={{
										minWidth: '100px',
										display: 'flex',
										justifyContent: 'flex-end',
									}}
								>
									<IconButton
										edge='end'
										onClick={() => onEdit(item)}
										size='small'
										sx={{ mr: 1 }}
									>
										<EditIcon />
									</IconButton>
									<IconButton
										edge='end'
										onClick={() => onDelete(item.id)}
										size='small'
									>
										<DeleteIcon />
									</IconButton>
								</Box>
							)
						}
					>
						<ListItemText primary={item.name} secondary={item.description} />
					</ListItem>
				))}
			</List>
		</Paper>
	)
}
