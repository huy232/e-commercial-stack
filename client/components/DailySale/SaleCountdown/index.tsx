"use client"
import { FC, useEffect, useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"

interface SaleCountdownProps {
	expirationTime: string
	onExpiration: () => void
}

const SaleCountdown: FC<SaleCountdownProps> = ({
	expirationTime,
	onExpiration,
}) => {
	const [isMounted, setIsMounted] = useState(false)
	const startTime = Math.floor(Date.now() / 1000) // Use floor to sync with seconds
	const endTime = Math.floor(new Date(expirationTime).getTime() / 1000) // Use floor for seconds
	const initialRemainingTime = Math.max(endTime - startTime, 0)
	const [remainingTime, setRemainingTime] = useState(initialRemainingTime)

	const minuteSeconds = 60
	const hourSeconds = 3600
	const daySeconds = 86400

	const getTime = {
		hours: (time: number) => Math.floor((time % daySeconds) / hourSeconds),
		minutes: (time: number) => Math.floor((time % hourSeconds) / minuteSeconds),
		seconds: (time: number) => Math.floor(time % minuteSeconds),
	}

	const timerProps = {
		isPlaying: true,
		strokeWidth: 4,
		size: 36,
	}

	useEffect(() => {
		setIsMounted(true)

		// Start interval to decrement remaining time
		const interval = setInterval(() => {
			setRemainingTime((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(interval)
					onExpiration()
					return 0
				}
				return prevTime - 1
			})
		}, 1000)

		return () => clearInterval(interval) // Cleanup interval on unmount
	}, [onExpiration])

	if (!isMounted) {
		return null
	}

	const renderTime = (value: number) => (
		<div className="flex flex-col justify-center items-center text-center">
			<p className="text-xs font-medium">{value}</p>
		</div>
	)

	return (
		<div className="flex gap-2 text-sm">
			<CountdownCircleTimer
				{...timerProps}
				duration={hourSeconds}
				initialRemainingTime={remainingTime % daySeconds}
				colors="#D14081"
				onComplete={() => ({ shouldRepeat: true })}
			>
				{() => renderTime(getTime.hours(remainingTime))}
			</CountdownCircleTimer>
			<CountdownCircleTimer
				{...timerProps}
				duration={minuteSeconds}
				initialRemainingTime={(remainingTime % hourSeconds) % minuteSeconds}
				colors="#EF798A"
				onComplete={() => ({ shouldRepeat: true })}
			>
				{() => renderTime(getTime.minutes(remainingTime))}
			</CountdownCircleTimer>
			<CountdownCircleTimer
				{...timerProps}
				duration={minuteSeconds}
				initialRemainingTime={remainingTime % minuteSeconds}
				colors="#218380"
				onComplete={() => ({ shouldRepeat: true })}
			>
				{() => renderTime(getTime.seconds(remainingTime))}
			</CountdownCircleTimer>
		</div>
	)
}

export default SaleCountdown
