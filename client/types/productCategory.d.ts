import { Brand } from "./brand"

export type ProductCategoryType = {
	updatedAt: Date
	createdAt: Date
	_id: string
	title: string
	brand: Brand[]
	slug: string
	image: string
	option: { type: string; value: string[] }[]
}
