import { Request, Response, NextFunction } from "express"
const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new Error(`Route ${req.originalUrl} not found!`)
	res.status(404)
	next(error)
}

const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode
	if (error instanceof Error) {
		return res.status(statusCode).json({
			success: false,
			message: error.message,
		})
	} else {
		// Handle non-Error types if necessary
		return res.status(statusCode).json({
			success: false,
			message: "An unexpected error occurred.",
		})
	}
}

export { notFound, errorHandler }
