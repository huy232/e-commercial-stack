import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage, Options } from "multer-storage-cloudinary"
import multer, { Multer } from "multer"
require("dotenv").config()

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
})

// Configure CloudinaryStorage for Multer
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "e-commercial",
		allowed_formats: ["jpg", "png"],
		use_filename: true,
		unique_filename: false,
	} as Options["params"],
})

// Create multer instance
const uploadCloud: Multer = multer({ storage })

export default uploadCloud
