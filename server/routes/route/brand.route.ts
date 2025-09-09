import express from "express"
import { BrandController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"

const router = express.Router()

router.get("/", BrandController.getBrands)
router.post("/", [verifyAccessToken, isAdmin], BrandController.createBrand)
router.put(
	"/:brand_id",
	[verifyAccessToken, isAdmin],
	BrandController.updateBrand
)
router.delete(
	"/:brand_id",
	[verifyAccessToken, isAdmin],
	BrandController.deleteBrand
)

export { router as brandRouter }
