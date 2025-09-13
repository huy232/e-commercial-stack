"use client"
import { memo, FC, useState, useEffect } from "react"
import clsx from "clsx"
import { reviewRating } from "@/constant"
import { AiFillStar, IoIosCloseCircle } from "@/assets/icons"
import { Button, TextEditor } from "@/components"

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
	const [isSubmitting, setIsSubmitting] = useState(false)

	const headingClassName = clsx(
		`hidden lg:block mb-1 text-lg font-bold border-l-2 border-main pl-1 uppercase font-bebasNeue`
	)

	const handleReviewScore = (star: number) => {
		setStar(star)
	}

	const resetForm = () => {
		setValue("")
		setStar(0)
	}

	return (
		<div
			className="flex flex-col gap:1 lg:gap-4 items-center justify-center"
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className={headingClassName}>Digital World</h2>
			<div className="mb-1">
				<span className="w-fit line-clamp-2 font-semibold">{productName}</span>
			</div>

			<TextEditor value={value} onChange={setValue} />
			<div className="w-full flex flex-col gap-4">
				<p className="text-center mt-2">How do you like this product</p>
				<div className="flex items-center justify-center gap-4">
					{reviewRating.map((review) => (
						<div
							key={review.id}
							className="w-[40px] h-[40px] lg:w-[100px] lg:h-[100px] flex items-center justify-center flex-col gap-2 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md p-1 lg:p-4"
							onClick={() => handleReviewScore(review.id)}
						>
							{review.id > star ? (
								<AiFillStar color="gray" />
							) : (
								<AiFillStar color="orange" />
							)}
							<span className="hidden lg:block">{review.text}</span>
						</div>
					))}
				</div>
			</div>
			{star > 0 && (
				<span className="block lg:hidden">{reviewRating[star - 1].text}</span>
			)}
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
				className="rounded bg-red-500 text-white p-1 hover-effect"
				aria-label="Submit review"
				role="button"
				tabIndex={0}
				data-testid="submit-review-button"
				id="submit-review-button"
				disabled={star === 0 || value.trim() === "" || isSubmitting}
				loading={isSubmitting}
			>
				Submit
			</Button>
		</div>
	)
}
export default memo(ReviewOption)
