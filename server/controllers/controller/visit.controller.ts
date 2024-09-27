import { Visit } from "../../models"
import { Request, Response } from "express"

class VisitController {
	getMonthlyVisits = async (req: Request, res: Response) => {
		try {
			const startOfMonth = new Date(
				new Date().getFullYear(),
				new Date().getMonth(),
				1
			)
			const endOfMonth = new Date(
				new Date().getFullYear(),
				new Date().getMonth() + 1,
				1
			)

			const visitCount = await Visit.countDocuments({
				visitDate: { $gte: startOfMonth, $lt: endOfMonth },
			})

			res.status(200).json({ visitCount })
		} catch (error) {
			res.status(500).json({ message: "Failed to update monthly visits" })
		}
	}
}
export default new VisitController()
