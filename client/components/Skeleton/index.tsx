"use client"
import { FC } from "react"

interface SkeletonProps {
	className?: string
}

const Skeleton: FC<SkeletonProps> = ({ className }) => {
	return (
		<div
			className={`animate-pulse rounded-md bg-gray-300 dark:bg-gray-700 ${className}`}
		/>
	)
}

export default Skeleton
