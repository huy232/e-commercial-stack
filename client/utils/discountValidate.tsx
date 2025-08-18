export const discountValidate = (product: {
	discount: {
		expirationDate: Date
	}
	enableDiscount: boolean
}) => {
	const currentDate = new Date()
	const discount = product.discount
	const enableDiscount = product.enableDiscount
	const isDiscountValid =
		enableDiscount &&
		discount &&
		new Date(discount.expirationDate) > currentDate

	return isDiscountValid
}
