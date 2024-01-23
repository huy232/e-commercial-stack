import { check, validationResult, ValidationChain } from "express-validator"
import { Request, Response, NextFunction } from "express"

export const validateRegisterUser: ValidationChain[] = [
	check("firstName", "First name cannot be empty").not().isEmpty(),
	check("firstName", "First name must be alphanumeric").isAlphanumeric(),
	check("lastName", "Last name cannot be empty").not().isEmpty(),
	check("lastName", "Last name must be alphanumeric").isAlphanumeric(),
	check("email", "Email cannot be empty").not().isEmpty(),
	check("email", "Invalid email").isEmail(),
	check("password", "Password must have more than 6 characters").isLength({
		min: 6,
	}),
]

export const validateLogin: ValidationChain[] = [
	check("email", "Email cannot be empty").not().isEmpty(),
	check("email", "Invalid email").isEmail(),
	check("password", "Password must have more than 6 characters").isLength({
		min: 6,
	}),
]

export const runValidation = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.status(400).json({ success: false, errors: errors.array() })
	}
	next()
}
