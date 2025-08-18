import { Cart, ProductExtraType } from "@/types"
import { discountValidate } from "./discountValidate"

export const handleCalculatePrice = (item: Cart) => {
	let basePrice
	const { enableDiscount, discount } = item.product
	if (discountValidate({ discount, enableDiscount })) {
		basePrice = item.product.discount.productPrice
	} else {
		basePrice = item.product.price
	}
	if (item.variant) {
		basePrice += item.variant.price
	}
	basePrice *= item.quantity

	return basePrice
}
