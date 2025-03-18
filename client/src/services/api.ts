import axios from 'axios'
import { Item, ItemFormData } from '../types'

const API_URL = 'http://localhost:3001/api'

export const api = {
	getItems: async (): Promise<Item[]> => {
		const response = await axios.get(`${API_URL}/items`)
		return response.data
	},

	getItem: async (id: number): Promise<Item> => {
		const response = await axios.get(`${API_URL}/items/${id}`)
		return response.data
	},

	createItem: async (data: ItemFormData): Promise<Item> => {
		const response = await axios.post(`${API_URL}/items`, data)
		return response.data
	},

	updateItem: async (id: number, data: ItemFormData): Promise<Item> => {
		const response = await axios.put(`${API_URL}/items/${id}`, data)
		return response.data
	},

	deleteItem: async (id: number): Promise<void> => {
		await axios.delete(`${API_URL}/items/${id}`)
	},
}
