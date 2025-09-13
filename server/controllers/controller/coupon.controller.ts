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
			const { name, code, discount, discountType, expiry, usageLimit } =
				req.body
			if (!name || !code || !discount || !discountType) {
				res
					.status(400)
					.json({ success: false, message: "Missing inputs required" })
				return
			}

			const calculatedExpiry = expiry ? calculateExpiry(expiry) : undefined
			const response = await Coupon.create({
				name,
				code,
				discount,
				discountType,
				expiry: calculatedExpiry,
				usageLimit,
			})
			res.json({
				success: response ? true : false,
				message: response
					? "Successfully created a coupon"
					: "Something went wrong while creating a coupon",
				data: response ? response : {},
			})
		}
	)

	getSpecificCoupon = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { couponCode } = req.params
			const response = await Coupon.findOne({
				code: new RegExp(`^${couponCode}$`, "i"),
			}).select("-createdAt -updatedAt")

			if (!response) {
				res.json({
					success: false,
					message: "This coupon code doesn't exist or expired",
					data: null,
				})
			} else {
				res.json({
					success: true,
					message: "Successfully retrieved coupon",
					data: response,
				})
			}
		}
	)

	getCoupons = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await Coupon.find().select("-createdAt -updatedAt")
			res.json({
				success: response ? true : false,
				message: response
					? "Successfully retrieved coupons"
					: "Something went wrong while getting coupons",
				data: response ? response : {},
			})
		}
	)

	updateCoupon = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { coupon_id } = req.params
			const { expiry, discount, name } = req.body

			if (Object.keys(req.body).length === 0) {
				res.status(400).json({ success: false, message: "Missing inputs" })
				return
			}

			let updateObject: UpdateCoupon = {}
			if (expiry) {
				const calculatedExpiry = calculateExpiry(expiry)
				updateObject.expiry = calculatedExpiry
			}

			if (discount !== undefined) {
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
					? "Successfully updated coupon"
					: "Something went wrong while updating coupon",
				data: response ? response : {},
			})
		}
	)

	updateCouponsQuick = asyncHandler(async (req: Request, res: Response) => {
		try {
			const response = await Coupon.updateMany(
				{ activeCouple: { $exists: false } },
				{ $set: { activeCouple: true } }
			)
			res.json({
				success: response ? true : false,
				data: response ? response : [],
			})
		} catch (err) {
			res.status(500).json({
				success: false,
				message: err,
			})
		}
	})

	deleteCoupon = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { coupon_id } = req.params

			const response = await Coupon.findByIdAndDelete(coupon_id)

			res.json({
				success: response ? true : false,
				message: response
					? "Successfully deleted coupon"
					: "Something went wrong while deleting coupon",
				data: response ? response : {},
			})
		}
	)
}

export default new CouponController()
