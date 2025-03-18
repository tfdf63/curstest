import axios from 'axios'
import { Item, UpdateItemData } from '../types'

const API_URL = 'http://localhost:3001/api/items'

const getAuthHeader = () => {
	const token = localStorage.getItem('token')
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
}

export const itemApi = {
	getItems: async (): Promise<Item[]> => {
		const response = await axios.get(API_URL, getAuthHeader())
		return response.data
	},

	createItem: async (data: {
		name: string
		description: string
		price: number
		imageUrl: string
	}): Promise<Item> => {
		const response = await axios.post(API_URL, data, getAuthHeader())
		return response.data
	},

	updateItem: async (id: number, data: UpdateItemData): Promise<Item> => {
		// Сначала получаем текущий элемент, чтобы сохранить createdAt
		const currentItem = await axios.get(`${API_URL}/${id}`, getAuthHeader())
		const originalCreatedAt = currentItem.data.createdAt

		// Обновляем элемент
		const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader())
		const updatedItem = response.data

		// Восстанавливаем оригинальную дату создания
		updatedItem.createdAt = originalCreatedAt

		return updatedItem
	},

	deleteItem: async (id: number): Promise<void> => {
		await axios.delete(`${API_URL}/${id}`, getAuthHeader())
	},
}
