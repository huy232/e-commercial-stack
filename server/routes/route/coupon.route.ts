import express from "express"
import { CouponController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"

const router = express.Router()

router.post("/", [verifyAccessToken, isAdmin], CouponController.createNewCoupon)
router.get("/", CouponController.getCoupons)
router.put("/:coupon_id", CouponController.updateCoupon)
router.delete("/:coupon_id", CouponController.deleteCoupon)

export { router as couponRouter }
