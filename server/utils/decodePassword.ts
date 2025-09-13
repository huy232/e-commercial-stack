import CryptoJS from "crypto-js"

export const decryptToRawPassword = (password: string) => {
	const decrypted = CryptoJS.AES.decrypt(
		password,
		process.env.CLIENT_HASH_SECRET as string
	)
	const rawPassword = decrypted.toString(CryptoJS.enc.Utf8)

	return rawPassword
}
