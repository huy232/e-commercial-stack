export const getVariantFilters = (filterCategory: any[]) => {
	const variantFilters = new Set<string>()
	filterCategory.forEach((category) => {
		category.options.forEach((option: { type: string }) => {
			variantFilters.add(option.type)
		})
	})

	return Array.from(variantFilters)
}
