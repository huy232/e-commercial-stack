import express from "express"
import { VisitController } from "../../controllers"
import {
	isAdmin,
	verifyAccessToken,
	verifyRefreshToken,
} from "../../middlewares/verifyToken"
import logVisit from "../../middlewares/logVisit"

const router = express.Router()

router.get(
	"/monthly-visit",
	[verifyAccessToken, isAdmin, logVisit],
	VisitController.getMonthlyVisits
)

export { router as visitRouter }
