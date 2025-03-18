export interface Item {
	id: number
	name: string
	description: string
	price: number
	imageUrl: string
	createdAt?: string
}

export interface ItemFormData {
	name: string
	description: string
}

export interface User {
	id: number
	firstName: string
	lastName: string
	middleName?: string
	birthDate?: string
	email: string
	role: 'admin' | 'fan'
	createdAt?: string
	gender?: 'male' | 'female'
	age?: number | null
}

export interface UpdateUserData {
	firstName?: string
	lastName?: string
	middleName?: string
	birthDate?: string
	email?: string
	role?: 'admin' | 'fan'
}

export interface AuthResponse {
	user: User
	token: string
}

export interface LoginData {
	email: string
	password: string
}

export interface RegisterData {
	firstName: string
	lastName: string
	middleName?: string
	birthDate?: string
	email: string
	password: string
}

export interface UpdateItemData {
	name?: string
	description?: string
	price?: number
	imageUrl?: string
}

export interface Team {
	id: number
	name: string
	city: string
	createdAt: string
	updatedAt: string
}
