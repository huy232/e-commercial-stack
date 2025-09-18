"use client"
import { memo, FC, useState } from "react"
import clsx from "clsx"
import { reviewRating } from "@/constant"
import { AiFillStar } from "@/assets/icons"
import { Button, TextEditor } from "@/components"
import { motion } from "framer-motion"

interface ReviewOptionsProps {
	productName: string
	handleSubmitReview: ({
		value,
		star,
		productId,
	}: {
		value: string
		star: number
		productId: string
	}) => void
	productId: string
	onClose?: () => void
}

const ReviewOption: FC<ReviewOptionsProps> = ({
	productName,
	handleSubmitReview,
	productId,
	onClose,
}) => {
	const [value, setValue] = useState("")
	const [star, setStar] = useState<number>(0)
	const [hoverStar, setHoverStar] = useState<number | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const resetForm = () => {
		setValue("")
		setStar(0)
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className="w-full mx-auto bg-white rounded-2xl shadow-lg p-2 flex flex-col gap-4"
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className="text-xl font-bold text-gray-800">{productName}</h2>

			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">
					Your Review
				</label>
				<div className="border rounded-lg shadow-sm">
					<TextEditor
						value={value}
						onChange={setValue}
						disableUploadImage={true}
					/>
				</div>
			</div>

			<div className="text-center">
				<p className="text-gray-700 font-medium mb-3">
					How do you like this product?
				</p>
				<div className="flex justify-center gap-2">
					{reviewRating.map((review) => (
						<motion.div
							key={review.id}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onMouseEnter={() => setHoverStar(review.id)}
							onMouseLeave={() => setHoverStar(null)}
							onClick={() => setStar(review.id)}
							className={clsx(
								"cursor-pointer p-2 rounded-lg transition-colors",
								star === review.id || hoverStar === review.id
									? "bg-yellow-100"
									: "bg-gray-100 hover:bg-gray-200"
							)}
						>
							<AiFillStar
								size={28}
								className={
									review.id <= (hoverStar ?? star)
										? "text-yellow-500"
										: "text-gray-400"
								}
							/>
						</motion.div>
					))}
				</div>

				{star > 0 && (
					<p className="mt-2 text-sm text-gray-600">
						You rated <span className="font-semibold">{star} stars</span>:{" "}
						<span className="italic">{reviewRating[star - 1].text}</span>
					</p>
				)}
			</div>

			<Button
				onClick={() => {
					setIsSubmitting(true)
					try {
						handleSubmitReview({ value, star, productId })
						resetForm()
					} finally {
						setIsSubmitting(false)
					}
				}}
				className="w-full w-max-md rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 font-semibold hover:opacity-90 transition"
				aria-label="Submit review"
				role="button"
				tabIndex={0}
				data-testid="submit-review-button"
				id="submit-review-button"
				disabled={star === 0 || value.trim() === "" || isSubmitting}
				loading={isSubmitting}
			>
				Submit Review
			</Button>
		</motion.div>
	)
}
export default memo(ReviewOption)
