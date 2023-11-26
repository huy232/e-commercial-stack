import mongoose from "mongoose"

const dbConnect = async () => {
	try {
		const dbConnect = await mongoose.connect(process.env.MONGODB_URI as string)
		// ready states being:
		// 0: disconnected
		// 1: connected
		// 2: connecting
		// 3: disconnecting
		if (dbConnect.connection.readyState === 1) {
			console.log("Database is connected")
		} else {
			console.log(
				"Database connection failed, connection state: ",
				dbConnect.connection.readyState
			)
		}
	} catch (error) {
		console.log("Database connection failed")
		if (error instanceof Error) {
			throw error
		} else {
			throw new Error("An unknown error occurred")
		}
	}
}

export default dbConnect
