import express from "express"
import { AuthController } from "../../controllers"

const router = express.Router()

router.post("/google-login", AuthController.socialLogin)

export { router as socialAuthRouter }
