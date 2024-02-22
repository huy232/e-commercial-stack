export type ProductType = {
	brand: string
	category: string[]
	color: []
	createdAt: Date
	description: string
	images: string[]
	price: number
	quantity: number
	ratings: []
	slug: string
	sold: number
	title: string
	totalRatings: number
	updatedAt: Date
	_id: string
	thumbnail: string
}

export interface DailyDealType extends ProductType {
	expirationTime: string
}
