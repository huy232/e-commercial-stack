import express from "express"
import { InsertDataController } from "../../controllers"

const router = express.Router()

router.post("/", InsertDataController.insertProduct)
router.delete("/", InsertDataController.deleteAllProducts)
router.post("/brand-category", InsertDataController.insertCategory)
router.delete(
	"/delete-brand-category",
	InsertDataController.deleteAllCategories
)
router.post("/edit-product", InsertDataController.editProduct)

export { router as insertDataRoute }
