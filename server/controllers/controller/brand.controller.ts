import { Request, Response } from "express"
import { Brand } from "../../models"
import asyncHandler from "express-async-handler"

class BrandController {
	createBrand = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await Brand.create(req.body)
			res.json({
				success: response ? true : false,
				message: response
					? "Success created brand"
					: "Something went wrong while created brand",
				createdBrand: response ? response : {},
			})
		}
	)

	getBrands = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await Brand.find()
			res.json({
				success: response ? true : false,
				message: response
					? "Successfully get brand"
					: "Something went wrong while getting brand",
				brands: response ? response : {},
			})
		}
	)

	updateBrand = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { brand_id } = req.params

			const response = await Brand.findByIdAndUpdate(brand_id, req.body, {
				new: true,
			})
			res.json({
				success: response ? true : false,
				message: response
					? "Success update brand"
					: "Something went wrong while update brand",
				updatedBrand: response ? response : {},
			})
		}
	)

	deleteBrand = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { brand_id } = req.params

			const response = await Brand.findByIdAndDelete(brand_id)
			res.json({
				success: response ? true : false,
				message: response
					? "Success delete a brand"
					: "Something went wrong while delete brand",
				deletedBrand: response ? response : {},
			})
		}
	)
}

export default new BrandController()
