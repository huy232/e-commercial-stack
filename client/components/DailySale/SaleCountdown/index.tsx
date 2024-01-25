"use client"
import { FC } from "react"
import { useCountdown } from "@/hooks"
import clsx from "clsx"

interface SaleCountdownProps {
	expirationTime: string
	onExpiration: () => void
}

const SaleCountdown: FC<SaleCountdownProps> = ({
	expirationTime,
	onExpiration,
}) => {
	const timeRemaining = useCountdown({
		expirationTime,
		onExpiration,
	})
	const units = ["Hours", "Minutes", "Seconds"]
	const timeValues: number[] = [
		Math.floor(timeRemaining.asHours()),
		timeRemaining.minutes(),
		timeRemaining.seconds(),
	]
	const timeClassName = clsx(
		"flex flex-col justify-center items-center bg-gray-300 p-1 rounded"
	)
	const time = units.map((unit, index) => (
		<div key={index} className={timeClassName}>
			<p>{timeValues[index]}</p>
			<p>{unit}</p>
		</div>
	))

	return <div className="flex flex-row gap-2 text-sm mt-4">{time}</div>
}

export default SaleCountdown
