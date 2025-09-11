export const formatDate = (dateStr: string) => {
	const date = new Date(dateStr)
	const today = new Date()
	const yesterday = new Date()
	yesterday.setDate(today.getDate() - 1)

	if (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	) {
		return "Today"
	} else if (
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear()
	) {
		return "Yesterday"
	}

	return date.toLocaleDateString("en-GB") // dd/mm/yyyy
}

export const formatHourMinute = (dateStr: string) => {
	return new Date(dateStr).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	})
}
