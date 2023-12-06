import { Express } from "express"
import { notFound, errorHandler } from "../middlewares/errorHandler"
import {
	blogCategoryRouter,
	blogRouter,
	brandRouter,
	productCategoryRouter,
	productRouter,
	userRouter,
} from "./route"
const initRoutes = (app: Express): void => {
	app.use("/api/user", userRouter)
	app.use("/api/product", productRouter)
	app.use("/api/product-category", productCategoryRouter)
	app.use("/api/blog-category", blogCategoryRouter)
	app.use("/api/blog", blogRouter)
	app.use("/api/brand", brandRouter)

	app.use(notFound)
	app.use(errorHandler)
}

export default initRoutes
