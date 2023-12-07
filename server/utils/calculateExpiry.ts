interface ExpiryOptions {
	date?: string // Specific date and time in "yyyy-mm-ddThh:mm:ss" format
	days?: number
	hours?: number
	minutes?: number
	// Add more units as needed (seconds, months, years, etc.)
}

function calculateExpiry(expiry: ExpiryOptions): Date {
	const now = new Date()
	let calculatedExpiry = new Date(now)

	if (expiry.date) {
		// If a specific date and time is provided
		calculatedExpiry = new Date(expiry.date)
	} else {
		// If a duration is provided
		if (expiry.days) {
			calculatedExpiry.setDate(now.getDate() + expiry.days)
		}
		if (expiry.hours) {
			calculatedExpiry.setHours(now.getHours() + expiry.hours)
		}
		if (expiry.minutes) {
			calculatedExpiry.setMinutes(now.getMinutes() + expiry.minutes)
		}
		// Add more units as needed (seconds, months, years, etc.)
	}

	return calculatedExpiry
}

export { calculateExpiry }
