export const UserOrderSkeleton = () => {
	return (
		<div className="bg-gray-800 p-3 my-3 rounded-lg shadow-md md:mx-2 animate-pulse w-full">
			{/* Header */}
			<div className="flex justify-between items-center mb-3">
				<div className="h-5 w-28 bg-gray-600 rounded"></div>
				<div className="h-4 w-40 bg-gray-600 rounded"></div>
			</div>

			{/* Coupon / Total */}
			<div className="flex justify-end mb-2">
				<div className="h-4 w-24 bg-gray-600 rounded"></div>
			</div>

			{/* Products grid */}
			<div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 bg-white rounded-lg p-2 shadow-heavy">
				{Array.from({ length: 2 }).map((_, i) => (
					<div
						key={i}
						className="flex flex-col md:flex-row gap-2 p-2 border-b last:border-none"
					>
						{/* Image skeleton */}
						<div className="w-[120px] h-[120px] bg-gray-400 rounded-md"></div>

						{/* Text skeletons */}
						<div className="flex flex-col justify-between flex-1">
							<div className="h-4 w-32 bg-gray-400 rounded mb-2"></div>
							<div className="h-4 w-24 bg-gray-400 rounded mb-1"></div>
							<div className="h-4 w-20 bg-gray-400 rounded"></div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
