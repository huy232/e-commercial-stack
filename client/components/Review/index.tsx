"use client"
import { renderStarFromNumber } from "@/utils"
import { Button, Modal, ReviewOption, VoteBar } from "@/components"
import { FC, useEffect, useState } from "react"
import { selectAuthUser, selectIsAuthenticated } from "@/store/slices/authSlice"
import Link from "next/link"
import { path } from "@/utils"
import { useSelector } from "react-redux"
import { ReviewType } from "@/types"

interface ReviewProps {
	totalRatings: number
	ratings: ReviewType[]
	handleToggleVote: () => void
	isVote: boolean
	productName: string
	handleSubmitReview: (data: any) => void
	productId: string
	loading: boolean
}

const Review: FC<ReviewProps> = ({
	totalRatings,
	ratings,
	handleToggleVote,
	isVote,
	productName,
	handleSubmitReview,
	productId,
	loading,
}) => {
	const user = useSelector(selectAuthUser)
	const isAuthenticated = useSelector(selectIsAuthenticated)
	const shouldShowModal = user && isAuthenticated
	if (!shouldShowModal) {
		return (
			<div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
				<span>Please login if you want to review this product</span>
				<Link
					href={path.LOGIN}
					className="hover-effect bg-red-500 text-white rounded p-1"
				>
					Login
				</Link>
			</div>
		)
	}
	return (
		<>
			<Modal isOpen={isVote} onClose={handleToggleVote}>
				<div className="flex items-center justify-center text-sm flex-col gap-2">
					<ReviewOption
						productName={productName}
						handleSubmitReview={handleSubmitReview}
						productId={productId}
						onClose={handleToggleVote}
					/>
				</div>
			</Modal>
			<div className="flex flex-col lg:flex-row mt-4 mx-2 mb-2">
				<div className="lg:flex-4 flex flex-row lg:flex-col items-center justify-center gap-4">
					<span className="font-semibold text-2xl font-poppins">{`${totalRatings}/5`}</span>
					<div className="flex flex-col items-center">
						<span className="flex items-center gap-1">
							{renderStarFromNumber(totalRatings)}
						</span>
						<span className="text-xs">{`${ratings.length} reviews`}</span>
					</div>
				</div>
				<div className="lg:flex-6 lg:mx-1 gap-2 flex flex-col">
					{Array.from(Array(5).keys()).map((element) => (
						<VoteBar
							key={element}
							ratingNumber={element + 1}
							ratingTotal={ratings.length}
							ratingCount={
								ratings.filter((rating) => rating.star === element + 1).length
							}
						/>
					))}
				</div>
			</div>
			<div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
				<span>Do you want to review this product?</span>
				<Button
					onClick={handleToggleVote}
					className="rounded bg-red-500 text-white p-1 hover-effect"
					aria-label="Review now"
					role="button"
					tabIndex={0}
					data-testid="review-now-button"
					id="review-now-button"
					disabled={loading}
					loading={loading}
				>
					Review now!
				</Button>
			</div>
		</>
	)
}
export default Review
