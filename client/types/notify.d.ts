export type Notification<T = string> = {
	_id: string
	message: string
	product_id: T
	isRead: boolean
	createdAt: Date
}

export interface NotifyProps<T = string> {
	_id: string
	user_id: string
	createdAt: Date
	notifications: Notification<T>[]
	unreadCount: number
	hasNextPage: boolean
	hasPrevPage: boolean
	totalPages: number
	currentPage: number
}

export type NotifyPropsWithString = NotifyProps<string>

// New structure where product_id is an object
export type NotifyPropsWithProduct = NotifyProps<{
	discount: {
		type: "percentage" | "fixed"
		value: number
		expirationDate: Date
		productPrice: number
	}
	slug: string
}>

export interface NotifyType<T = string> {
	_id: string
	message: T
	product_id?: string
	isRead: boolean
	createdAt: Date
}
