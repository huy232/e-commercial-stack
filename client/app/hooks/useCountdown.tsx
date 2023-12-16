"use client"

import { useEffect, useState } from "react"
import moment from "moment"

interface UseCountdownProps {
	expirationTime: string
	onExpiration: () => void
}

export const useCountdown = ({
	expirationTime,
	onExpiration,
}: UseCountdownProps) => {
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
				// If time has expired, trigger the provided callback
				clearInterval(intervalId)
				onExpiration()
			}

			setTimeRemaining(newTimeRemaining)
		}

		calculateTimeRemaining()

		intervalId = setInterval(calculateTimeRemaining, 1000)

		return () => clearInterval(intervalId)
	}, [expirationTime, onExpiration])

	return timeRemaining
}
