export const validateEmail = (value: string) => {
	if (!value) return "Email is required"
	if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email address"
	return true
}
