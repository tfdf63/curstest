import axios from 'axios'
import { Team } from '../types'

const API_URL = 'http://localhost:3001/api/teams'

export const teamApi = {
	// Получить все команды
	getAll: async (): Promise<Team[]> => {
		try {
			const response = await axios.get(API_URL, {
				withCredentials: true,
			})
			return response.data
		} catch (error: any) {
			console.error(
				'Ошибка при получении команд:',
				error.response?.data?.message || error.message
			)
			throw new Error(
				error.response?.data?.message || 'Ошибка при получении команд'
			)
		}
	},

	// Получить команду по ID
	getById: async (id: number): Promise<Team> => {
		try {
			const response = await axios.get(`${API_URL}/${id}`, {
				withCredentials: true,
			})
			return response.data
		} catch (error: any) {
			console.error(
				'Ошибка при получении команды:',
				error.response?.data?.message || error.message
			)
			throw new Error(
				error.response?.data?.message || 'Ошибка при получении команды'
			)
		}
	},

	// Создать новую команду
	create: async (data: { name: string; city: string }): Promise<Team> => {
		try {
			const response = await axios.post(API_URL, data, {
				withCredentials: true,
			})
			return response.data
		} catch (error: any) {
			console.error(
				'Ошибка при создании команды:',
				error.response?.data?.message || error.message
			)
			throw new Error(
				error.response?.data?.message || 'Ошибка при создании команды'
			)
		}
	},

	// Обновить команду
	update: async (
		id: number,
		data: { name?: string; city?: string }
	): Promise<Team> => {
		try {
			const response = await axios.put(`${API_URL}/${id}`, data, {
				withCredentials: true,
			})
			return response.data
		} catch (error: any) {
			console.error(
				'Ошибка при обновлении команды:',
				error.response?.data?.message || error.message
			)
			throw new Error(
				error.response?.data?.message || 'Ошибка при обновлении команды'
			)
		}
	},

	// Удалить команду
	delete: async (id: number): Promise<void> => {
		try {
			await axios.delete(`${API_URL}/${id}`, {
				withCredentials: true,
			})
		} catch (error: any) {
			console.error(
				'Ошибка при удалении команды:',
				error.response?.data?.message || error.message
			)
			throw new Error(
				error.response?.data?.message || 'Ошибка при удалении команды'
			)
		}
	},
}
