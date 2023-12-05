import { Express } from "express"
import { notFound, errorHandler } from "../middlewares/errorHandler"
import user from "./user.route"
import product from "./product.route"
import productCategory from "./productCategory.route"
import blogCategory from "./blogCategory.route"

const initRoutes = (app: Express): void => {
	app.use("/api/user", user.router)
	app.use("/api/product", product.router)
	app.use("/api/product-category", productCategory.router)
	app.use("/api/blog-category", blogCategory.router)

	app.use(notFound)
	app.use(errorHandler)
}

export default initRoutes
