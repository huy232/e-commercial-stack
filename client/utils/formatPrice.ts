export const formatPrice = (price: number) => {
	const formattedPrice = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "VND",
	}).format(price)

	return formattedPrice
}
