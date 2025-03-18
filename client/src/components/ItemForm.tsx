import React, { useState, useEffect } from 'react'
import { TextField, Button, Box, Paper } from '@mui/material'
import { Item, ItemFormData } from '../types'

interface ItemFormProps {
	onSubmit: (data: ItemFormData) => void
	initialData?: Item
	submitLabel?: string
}

export const ItemForm: React.FC<ItemFormProps> = ({
	onSubmit,
	initialData,
	submitLabel = 'Сохранить',
}) => {
	const [formData, setFormData] = useState<ItemFormData>({
		name: '',
		description: '',
	})

	useEffect(() => {
		if (initialData) {
			setFormData({
				name: initialData.name,
				description: initialData.description,
			})
		}
	}, [initialData])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(formData)
	}

	return (
		<Paper elevation={2} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
			<Box
				component='form'
				onSubmit={handleSubmit}
				sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
			>
				<TextField
					label='Название'
					value={formData.name}
					onChange={e => setFormData({ ...formData, name: e.target.value })}
					required
					fullWidth
				/>
				<TextField
					label='Описание'
					value={formData.description}
					onChange={e =>
						setFormData({ ...formData, description: e.target.value })
					}
					multiline
					rows={4}
					required
					fullWidth
				/>
				<Button type='submit' variant='contained' color='primary'>
					{submitLabel}
				</Button>
			</Box>
		</Paper>
	)
}
