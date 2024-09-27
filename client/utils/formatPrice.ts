export const formatPrice = (price: number) => {
	// const formattedPrice = new Intl.NumberFormat("en-US", {
	// 	style: "currency",
	// 	currency: "VND",
	// 	currencyDisplay: "code",
	// }).format(price)

	// const priceWithSingleCurrencyCode = formattedPrice.replace(/VND\s/, "")

	// return `VND ${priceWithSingleCurrencyCode}`

	return price.toLocaleString("it-IT", {
		style: "currency",
		currency: "VND",
	})
}
