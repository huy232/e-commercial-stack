export interface User {
	id: string
	username: string
}

export interface ProfileUser {
	_id: string
	firstName: string
	lastName: string
	email: string
	avatar: string
	mobile: number
	password: string
	role: string[]
	cart: []
	address: string
	wishlist: []
	isBlocked: boolean
	createdAt: string
	phone: number
}

export interface Users {
	_id: string
	firstName: string
	lastName: string
	email: string
	avatar: string
	mobile: number
	password: string
	role: string[]
	cart: []
	address: string
	wishlist: []
	isBlocked: boolean
	createdAt: string
	phone: number
}

export interface UpdateUser {
	_id?: string
	firstName?: string
	lastName?: string
	email?: string
	isBlocked?: boolean
	role?: string[]
}
