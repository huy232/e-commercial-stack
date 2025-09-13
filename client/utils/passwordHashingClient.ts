// import SHA256 from "crypto-js/sha256"

// export const passwordHashingClient = async (
// 	password: string
// ): Promise<string> => {
// 	const saltSecret = process.env.NEXT_PUBLIC_HASH_SECRET ?? ""
// 	const data = password + saltSecret

// 	const encoder = new TextEncoder()
// 	const encoded = encoder.encode(data)

// 	try {
// 		const subtle = window.crypto?.subtle
// 		if (!subtle) throw new Error("Web Crypto not available")

// 		const hashBuffer = await subtle.digest("SHA-256", encoded)
// 		const hashArray = Array.from(new Uint8Array(hashBuffer))
// 		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
// 	} catch (err) {
// 		console.warn("Falling back to crypto-js:", err)
// 		return SHA256(data).toString()
// 	}
// }

import CryptoJS from "crypto-js"

export const passwordHashingClient = (password: string): string => {
	const secret = process.env.NEXT_PUBLIC_CLIENT_HASH_SECRET ?? ""
	return CryptoJS.AES.encrypt(password, secret).toString()
}
