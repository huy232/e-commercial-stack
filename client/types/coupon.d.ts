import { FormatDiscountEnum } from "./formatDiscountEnum"

export interface ICoupon {
	_id: string
	name: string
	code: string
	discount: number
	discountType: FormatDiscountEnum
	expiry?: Date
	usageLimit?: number
	usedCount: number
	activeCouple: boolean
	createdAt: string
	updatedAt: string
}
