export type Review = {
	comment: string
	postedBy: {
		firstName: string
		lastName: string
		avatar: string
	}
	star: number
	_id: string
	updatedAt: string
}

export type ProductType = {
	brand: string
	category: string[]
	color: []
	createdAt: Date
	description: string
	images: string[]
	price: number
	quantity: number
	ratings: Review[]
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
