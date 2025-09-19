import { check, validationResult, ValidationChain } from "express-validator"
import { Request, Response, NextFunction } from "express"
import CryptoJS from "crypto-js"

const passwordPolicy = check("password")
	.isLength({ min: 8, max: 50 })
	.withMessage("Password must be between 8 and 50 characters")
	.custom((value, { req }) => {
		try {
			const bytes = CryptoJS.AES.decrypt(
				value,
				process.env.CLIENT_HASH_SECRET as string
			)

			const decrypted = bytes.toString(CryptoJS.enc.Utf8)
			if (!decrypted) throw new Error("Invalid password data")

			// run validation rules
			const minLength = /.{8,}/
			const hasUppercase = /[A-Z]/
			const hasLowercase = /[a-z]/
			const hasNumber = /[0-9]/
			const hasSpecial = /[^A-Za-z0-9]/

			if (
				!(
					minLength.test(decrypted) &&
					hasUppercase.test(decrypted) &&
					hasLowercase.test(decrypted) &&
					hasNumber.test(decrypted) &&
					hasSpecial.test(decrypted)
				)
			) {
				throw new Error(
					"Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
				)
			}

			// keep both if you need
			req.body.decryptedPassword = decrypted
			req.body.password = value
			return true
		} catch (err) {
			throw new Error("Password decryption failed")
		}
	})

const nameValidator = (field: string) =>
	check(field)
		.notEmpty()
		.withMessage(`${field} is required`)
		.isAlpha("vi-VN", { ignore: " " })
		.withMessage(`${field} must contain only letters`)
		.isLength({ min: 1, max: 50 })
		.withMessage(`${field} must be between 1 and 50 characters`)
		.trim()
		.escape()

const emailValidator = check("email")
	.notEmpty()
	.withMessage("Email is required")
	.isEmail()
	.withMessage("Invalid email format")
	.isLength({ max: 100 })
	.withMessage("Email must not exceed 100 characters")
	.normalizeEmail({ gmail_remove_dots: false })
	.trim()

export const validateRegisterUser: ValidationChain[] = [
	nameValidator("firstName"),
	nameValidator("lastName"),
	emailValidator,
	passwordPolicy,
]

export const validateLogin: ValidationChain[] = [
	emailValidator,
	check("password", "Password is required").notEmpty(),
]

export const runValidation = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.status(400).json({ success: false, errors: errors.array() })
		return
	}
	next()
}
