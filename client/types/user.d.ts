import { ProductExtraType } from "./product"

export interface User {
	id: string
	username: string
}

type UserAddress = {
	phone?: string
	line1?: string
	line2?: string
	city?: string
	state?: string
	postal_code?: string
	country?: string
	name?: string
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
	cart: UserCart[]
	address: UserAddress
	wishlist: []
	isBlocked: boolean
	createdAt: string
	mobile: number
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
	cart: UserCart[]
	address: UserAddress
	wishlist: []
	isBlocked: boolean
	createdAt: string
	mobile: number
}

export interface UpdateUser {
	_id?: string
	firstName?: string
	lastName?: string
	email?: string
	isBlocked?: boolean
	role?: string[]
}

export interface UpdateUserProfile {
	_id: string
	firstName: string
	lastName: string
	email: string
	mobile?: number
	address?: UserAddress
	avatar?: string
}

export interface VariantType {
	variant: { type: string; value: string }[]
	price: number
	stock: number
	_id: string
}
