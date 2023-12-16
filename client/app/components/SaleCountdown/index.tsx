"use client"
import { FC } from "react"
import { formatTime } from "@/utils"
import { useCountdown } from "@/app/hooks"

interface SaleCountdownProps {
	expirationTime: string
}

export const SaleCountdown: FC<SaleCountdownProps> = ({ expirationTime }) => {
	const timeRemaining = useCountdown(expirationTime)

	return (
		<div>
			<p>Time Remaining: {formatTime(timeRemaining)}</p>
		</div>
	)
}
