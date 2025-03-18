import axios from 'axios'
import { User, UpdateUserData } from '../types'

const API_URL = 'http://localhost:3001/api/users'

// Настраиваем axios для работы с cookies
axios.defaults.withCredentials = true

export const userApi = {
	getUsers: async (): Promise<User[]> => {
		const response = await axios.get(API_URL)
		return response.data
	},

	getUser: async (id: number): Promise<User> => {
		try {
			const response = await axios.get(`${API_URL}/${id}`)
			return response.data
		} catch (error) {
			throw error
		}
	},

	createUser: async (data: {
		firstName: string
		lastName: string
		middleName?: string
		birthDate?: string
		email: string
		password: string
		role: 'admin' | 'fan'
	}): Promise<User> => {
		const response = await axios.post(API_URL, data)
		return response.data
	},

	updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
		const response = await axios.put(`${API_URL}/${id}`, data)
		return response.data
	},

	deleteUser: async (id: number): Promise<void> => {
		await axios.delete(`${API_URL}/${id}`)
	},
}
