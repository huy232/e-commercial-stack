import express from "express"
import { uploadCloudECommercial } from "../../config/cloudinaryOption"
import { UploadImageController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"
const router = express.Router()

router.post(
	"/",
	[verifyAccessToken, isAdmin],
	uploadCloudECommercial.array("images", 10),
	UploadImageController.uploadImages
)

router.post(
	"/single-image",
	[verifyAccessToken, isAdmin],
	uploadCloudECommercial.single("image"),
	UploadImageController.uploadImage
)

router.post(
	"/delete",
	[verifyAccessToken, isAdmin],
	UploadImageController.deleteImages
)

export { router as uploadImage }
