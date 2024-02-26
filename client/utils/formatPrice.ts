export const formatPrice = (price: number) => {
	const formattedPrice = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "VND",
		currencyDisplay: "code",
	}).format(price)

	const priceWithSingleCurrencyCode = formattedPrice.replace(/VND\s/, "")

	return `VND ${priceWithSingleCurrencyCode}`
}

export const formatPriceNumber = (price: number): string => {
	const formattedPrice = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "VND",
		currencyDisplay: "code",
	}).format(price)

	const priceWithSingleCurrencyCode = formattedPrice.replace(/VND\s/, "")

	return priceWithSingleCurrencyCode
}
