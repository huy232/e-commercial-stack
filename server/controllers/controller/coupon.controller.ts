import { Request, Response } from "express"
import { Coupon } from "../../models"
import { calculateExpiry } from "../../utils/calculateExpiry"
import asyncHandler from "express-async-handler"

interface UpdateCoupon {
	name?: string
	discount?: number
	expiry?: Date
}

class CouponController {
	createNewCoupon = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { name, discount, expiry } = req.body
			if (!name || !discount || !expiry) {
				throw new Error("Missing inputs required")
			}
			const calculatedExpiry = calculateExpiry(expiry)
			const response = await Coupon.create({
				...req.body,
				expiry: calculatedExpiry,
			})
			res.json({
				success: response ? true : false,
				message: response
					? "Success created a coupon"
					: "Something went wrong while creating a coupon",
				createdCoupon: response ? response : {},
			})
		}
	)

	getCoupons = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await Coupon.find().select("-createdAt -updatedAt")
			res.json({
				success: response ? true : false,
				message: response
					? "Success getting coupons"
					: "Something went wrong while getting coupons",
				coupons: response ? response : {},
			})
		}
	)
	updateCoupon = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { coupon_id } = req.params
			const { expiry, discount, name } = req.body

			if (Object.keys(req.body).length === 0) {
				throw new Error("Missing inputs")
			}

			let updateObject: UpdateCoupon = {}
			if (expiry) {
				const calculatedExpiry = calculateExpiry(expiry)
				updateObject.expiry = calculatedExpiry
			}

			if (discount) {
				updateObject.discount = discount
			}
			if (name) {
				updateObject.name = name
			}

			const response = await Coupon.findByIdAndUpdate(coupon_id, updateObject, {
				new: true,
			})

			res.json({
				success: response ? true : false,
				message: response
					? "Success update coupon"
					: "Something went wrong while update coupon",
				updatedCoupon: response ? response : {},
			})
		}
	)

	deleteCoupon = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { coupon_id } = req.params

			const response = await Coupon.findByIdAndDelete(coupon_id)

			res.json({
				success: response ? true : false,
				message: response
					? "Success delete coupon"
					: "Something went wrong while delete coupon",
				deletedCoupon: response ? response : {},
			})
		}
	)
}
export default new CouponController()
