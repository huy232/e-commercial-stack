export type CategoryType = {
	_id: string
	title: string
	brand: string[]
	slug: string
	image: string
}

export interface ProductCategory {
	id: number
	name: string
	sort: string
}
