import { Express } from "express"
import { notFound, errorHandler } from "../middlewares/errorHandler"
import {
	blogCategoryRouter,
	blogRouter,
	brandRouter,
	couponRouter,
	insertDataRoute,
	orderRouter,
	productCategoryRouter,
	productRouter,
	userRouter,
	visitRouter,
	cartRouter,
	wishlistRouter,
	notifyRouter,
	socialAuthRouter,
	uploadImage,
	chatRouter,
} from "./route"

const initRoutes = (app: Express): void => {
	app.use("/api/user", userRouter)
	app.use("/api/product", productRouter)
	app.use("/api/product-category", productCategoryRouter)
	app.use("/api/blog-category", blogCategoryRouter)
	app.use("/api/blog", blogRouter)
	app.use("/api/brand", brandRouter)
	app.use("/api/coupon", couponRouter)
	app.use("/api/order", orderRouter)
	app.use("/api/insert-data", insertDataRoute)
	app.use("/api/cart", cartRouter)
	app.use("/api/wishlist", wishlistRouter)
	app.use("/api/auth", socialAuthRouter)
	app.use("/api/upload-image", uploadImage)
	app.use("/api/chat", chatRouter)
	// app.use("/api/visit", visitRouter)

	app.use("/api/notification", notifyRouter)

	// Error handling middleware
	app.use(notFound)
	app.use(errorHandler)
}

export default initRoutes
