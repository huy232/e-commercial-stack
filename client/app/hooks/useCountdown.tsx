"use client"

import moment from "moment"
import { useEffect, useState } from "react"

export const useCountdown = (expirationTime: string) => {
	const [timeRemaining, setTimeRemaining] = useState(
		moment.duration(moment(expirationTime).diff(moment()))
	)

	useEffect(() => {
		let intervalId: NodeJS.Timeout

		const calculateTimeRemaining = () => {
			const now = moment()
			const expiration = moment(expirationTime)
			const newTimeRemaining = moment.duration(expiration.diff(now))

			if (newTimeRemaining.asMilliseconds() <= 0) {
				clearInterval(intervalId)
			}

			setTimeRemaining(newTimeRemaining)
		}

		calculateTimeRemaining()

		intervalId = setInterval(calculateTimeRemaining, 1000)

		return () => clearInterval(intervalId)
	}, [expirationTime])

	return timeRemaining
}
