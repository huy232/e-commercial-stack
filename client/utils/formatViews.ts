export function formatViews(views: number): string {
	if (views < 1000) return `${views}`

	const units = [
		{ value: 1e12, suffix: "T" }, // trillion
		{ value: 1e9, suffix: "B" }, // billion
		{ value: 1e6, suffix: "M" }, // million
		{ value: 1e3, suffix: "K" }, // thousand
	]

	for (const unit of units) {
		if (views >= unit.value) {
			const formatted = (views / unit.value).toFixed(
				views >= unit.value * 10 ? 0 : 1
			)
			return `${formatted}${unit.suffix}`
		}
	}

	return `${views}`
}
