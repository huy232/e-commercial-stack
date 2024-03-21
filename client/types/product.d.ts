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

export type VariantType = {
	color: string
	images: string[]
	thumbnail: string
	price: number
	title: string
}

export type ProductType = {
	brand: string
	category: string[]
	color: string[]
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
	variants?: VariantType[]
}

export interface DailyDealType extends ProductType {
	expirationTime: string
}

export type CreateProductType = {
	title: string
	description: string
	price: number
	quantity: number
	thumbnail: File
	productImages: File[]
	category: string
	brand: string
}
