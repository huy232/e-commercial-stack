import { FormatDiscountEnum } from "@/types/formatDiscountEnum"
import { formatPrice } from "@/utils"

export const formatDiscount = (
	type: FormatDiscountEnum,
	valueFromCoupon: number,
	valueFromSource: number
): number => {
	if (type === FormatDiscountEnum.percentage) {
		return valueFromSource - valueFromSource * (valueFromCoupon / 100)
	} else if (type === FormatDiscountEnum.fixed) {
		return valueFromSource - valueFromCoupon
	} else {
		throw new Error("Invalid discount type")
	}
}

export const formatDiscountDisplay = (couponData: {
	discount: number
	discountType: FormatDiscountEnum
}): string => {
	const { discount, discountType } = couponData

	if (discountType === FormatDiscountEnum.percentage) {
		return `${discount}%`
	} else if (discountType === FormatDiscountEnum.fixed) {
		return formatPrice(discount) ?? ""
	} else {
		throw new Error("Invalid discount type")
	}
}
