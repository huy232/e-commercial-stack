"use client"
import { motion } from "framer-motion"

const SkeletonBox = ({ className }: { className?: string }) => (
	<div className={`bg-gray-400 rounded-md animate-pulse ${className}`} />
)

const PaymentSkeleton = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex flex-col col-span-1 lg:col-start-2 lg:col-end-2 mb-4"
		>
			<div className="mx-4 border-2 border-gray-400 rounded p-4 mb-4">
				<div className="flex justify-between items-center py-3">
					<SkeletonBox className="h-4 w-24" />
					<SkeletonBox className="h-4 w-16" />
				</div>
				<div className="flex justify-between items-center py-3">
					<SkeletonBox className="h-4 w-20" />
					<SkeletonBox className="h-5 w-24 rounded" />
				</div>
				<div className="flex justify-between items-center py-3">
					<SkeletonBox className="h-4 w-20" />
					<SkeletonBox className="h-5 w-28" />
				</div>
			</div>

			<div className="mx-4 border-2 border-gray-400 rounded p-6 space-y-4">
				<SkeletonBox className="h-6 w-1/2" />
				<SkeletonBox className="h-10 w-full" />
				<SkeletonBox className="h-10 w-full" />
			</div>
		</motion.div>
	)
}

export default PaymentSkeleton
