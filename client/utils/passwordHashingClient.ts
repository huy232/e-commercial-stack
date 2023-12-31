export const passwordHashingClient = async (
	password: string
): Promise<string> => {
	const saltSecret = process.env.NEXT_PUBLIC_HASH_SECRET

	const encoder = new TextEncoder()
	const data = encoder.encode(password + saltSecret)
	const hashBuffer = await crypto.subtle.digest("SHA-256", data)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("")
	return hashHex
}
