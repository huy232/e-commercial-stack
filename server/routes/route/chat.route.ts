import express from "express"
import { verifyAccessToken, isAdmin } from "../../middlewares/verifyToken"
import { ChatController } from "../../controllers"

const router = express.Router()

// Anyone (guest or user) can initiate chat
router.post("/start", ChatController.startChat)

// Admin-only: fetch messages from session
router.get(
	"/messages/:roomId",
	[verifyAccessToken, isAdmin],
	ChatController.getMessages
)

router.post("/send", ChatController.sendMessage)

router.get("/rooms", [verifyAccessToken, isAdmin], ChatController.getChatRooms)
router.put(
	"/rooms/:roomId/assign-admin",
	[verifyAccessToken, isAdmin],
	ChatController.assignAdminToRoom
)

router.get(
	"/all-rooms",
	[verifyAccessToken, isAdmin],
	ChatController.getAllChatRooms
)
router.get("/:roomId", ChatController.getChatSession)
export { router as chatRouter }
