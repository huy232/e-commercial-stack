export type OrderType = {
	_id: string
	products: UserCart[]
	status: "Cancelled" | "Processing" | "Success" | "Refund" | "Delivering"
	total: number
	coupon: null | ICoupon
	orderBy: Users
	createdAt: Date
}
