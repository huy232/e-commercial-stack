import jwt from "jsonwebtoken"

const generateAccessToken = (uid: string, role: string[]) => {
	return jwt.sign({ _id: uid, role }, process.env.JWT_SECRET as string, {
		expiresIn: "1d",
	})
}

const generateRefreshToken = (uid: string) => {
	return jwt.sign({ _id: uid }, process.env.JWT_SECRET as string, {
		expiresIn: "7d",
	})
}

export { generateAccessToken, generateRefreshToken }
