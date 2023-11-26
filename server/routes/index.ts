import { Express } from "express"
import user from "./user.route"
import { notFound, errorHandler } from "../middlewares/errorHandler"

const initRoutes = (app: Express): void => {
	app.use("/api/user", user.router)
	app.use(notFound)
	app.use(errorHandler)
}

export default initRoutes
