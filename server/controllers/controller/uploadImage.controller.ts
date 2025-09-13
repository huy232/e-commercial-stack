import { Request, Response } from "express"
import { v2 as cloudinary } from "cloudinary"

class UploadImageController {
	uploadImages = async (req: Request, res: Response) => {
		try {
			const files = req.files as Express.Multer.File[]

			if (!files || files.length === 0) {
				return res.status(400).json({ message: "No images uploaded" })
			}

			// Extract Cloudinary URLs from uploaded images
			const imageUrls = files.map((file) => file.path)

			res.status(200).json({ success: true, images: imageUrls })
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: "Failed to upload images" })
		}
	}

	uploadImage = async (req: Request, res: Response) => {
		try {
			const file = req.file as Express.Multer.File

			if (!file) {
				return res.status(400).json({ message: "No image uploaded" })
			}

			// Extract Cloudinary URL from uploaded image
			const imageUrl = file.path

			res.status(200).json({ success: true, image: imageUrl })
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: "Failed to upload image" })
		}
	}

	deleteImages = async (req: Request, res: Response) => {
		try {
			const { imageUrls } = req.body as { imageUrls: string[] }

			if (!imageUrls || imageUrls.length === 0) {
				return res.status(400).json({ message: "No image URLs provided" })
			}

			const getPublicIdFromUrl = (url: string): string | null => {
				const regex = /\/upload\/(?:v\d+\/)?(.+?)(\.[a-z]+)?$/
				const match = url.match(regex)
				return match ? match[1] : null
			}

			const deletionResults = await Promise.all(
				imageUrls.map(async (url) => {
					const publicId = getPublicIdFromUrl(url)
					if (!publicId)
						return { url, success: false, error: "Invalid Cloudinary URL" }

					try {
						await cloudinary.uploader.destroy(publicId)
						return { url, success: true }
					} catch (err) {
						console.error(`Failed to delete ${url}:`, err)
						return { url, success: false, error: "Cloudinary deletion failed" }
					}
				})
			)

			res.status(200).json({ success: true, results: deletionResults })
		} catch (error) {
			console.error("Image deletion error:", error)
			res
				.status(500)
				.json({ message: "Internal server error during image deletion" })
		}
	}
}

export default new UploadImageController()
