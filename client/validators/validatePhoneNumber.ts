export const validatePhoneNumber = (value: string) => {
	if (!value) return "Phone number is required"
	if (!/^0\d{9,10}$/.test(value)) return "Invalid phone number format"
	return true
}
