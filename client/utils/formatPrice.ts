export const formatPrice = (price: number) => {
	if (price) {
		return price.toLocaleString("it-IT", {
			style: "currency",
			currency: "VND",
		})
	}
}
