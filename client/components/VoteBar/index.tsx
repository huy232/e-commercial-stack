"use client"
import { AiFillStar } from "@/assets/icons"
import { FC, memo, useRef, useEffect } from "react"

interface VoteBarProps {
	ratingNumber: number
	ratingCount: number
	ratingTotal: number
}

const VoteBar: FC<VoteBarProps> = ({
	ratingNumber,
	ratingCount,
	ratingTotal,
}) => {
	const percentRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!percentRef.current) return
		const percentBar = percentRef.current
		percentBar.style.cssText = `right: ${
			100 - Math.round((ratingCount * 100) / ratingTotal)
		}`
	}, [ratingNumber, ratingCount, ratingTotal])
	return (
		<div className="flex items-center gap-2 text-sm text-gray-500">
			<div className="flex w-[10%] items-center gap-1 text-sm">
				<span>{ratingNumber}</span>
				<AiFillStar color="orange" />
			</div>
			<div className="w-[70%]">
				<div className="relative w-full h-[6px] bg-gray-600 rounded-l-full rounded-r-full">
					<div ref={percentRef} className="absolute inset-0 bg-red-500"></div>
				</div>
			</div>
			<div className="w-[20%] flex justify-end text-xs text-400">{`${
				ratingCount || 0
			} reviews`}</div>
		</div>
	)
}
export default memo(VoteBar)
