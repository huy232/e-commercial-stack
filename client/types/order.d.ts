export type OrderType = {
	_id: string
	products: UserCart[]
	status: "Cancelled" | "Processing" | "Success" | "Refund" | "Delivering"
	total: number
	coupon: null | ICoupon
	orderBy: Users
	createdAt: Date
	notes: string
	shippingAddress: {
		name: string
		country: string
		line1: string
		line2: string
		city: string
		state: string
		postal_code: string
		phone: string
	}
}
