export const formatTime = (duration: moment.Duration) => {
	const hours = Math.floor(duration.asHours())
	const minutes = duration.minutes()
	const seconds = duration.seconds()
	return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
		seconds < 10 ? "0" : ""
	}${seconds}`
}
