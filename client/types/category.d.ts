import { Brand } from "./brand"

export type CategoryType = {
	_id: string
	title: string
	brand: Brand[]
	slug: string
	image: string
	option: { type: string; value: string[] }[]
}

export interface ProductCategory {
	id: number
	name: string
	sort: string
}

export interface ProductCategories {
	_id: string
	title: string
	slug: string
	brand: []
}
