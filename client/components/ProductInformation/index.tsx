"use client"
import { FC, useCallback, useState } from "react"
import clsx from "clsx"
import { memo } from "react"
import { Review, ReviewComment } from "@/components"
import { ProductExtraType, ProductType } from "@/types"
import { useMounted } from "@/hooks"
import { WEB_URL } from "@/constant"

interface ProductInformationProps {
	product: ProductExtraType
	updateReviews: () => Promise<ProductExtraType>
}

const ProductInformation: FC<ProductInformationProps> = ({
	product,
	updateReviews,
}) => {
	const mounted = useMounted()
	const [loading, setLoading] = useState(false)
	const [baseProduct, setBaseProduct] = useState(product)
	const [isVote, setIsVote] = useState(false)
	const [reviews, setReviews] = useState(product.ratings)
	const handleToggleVote = useCallback(() => {
		setIsVote(!isVote)
	}, [isVote])

	const closeVoteModal = useCallback(() => {
		setIsVote(false)
	}, [])

	const handleSubmitReview = useCallback(
		async (data: any) => {
			const { value, star, productId } = data
			if (!value || !star || !productId) {
				alert("Please enter all required fields")
				return
			}
			try {
				setLoading(true)
				const updatedAt = Date.now()
				const ratingResponse = await fetch("/api/product/rating-product", {
					method: "PUT",
					cache: "no-cache",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						star,
						comment: value,
						product_id: productId,
						updatedAt,
					}),
				})
				const rating = await ratingResponse.json()
				const productResponse = await updateReviews()
				setBaseProduct(productResponse)
				setReviews(rating.data.ratings)
				closeVoteModal()
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(true)
			}
		},
		[closeVoteModal, updateReviews]
	)

	return (
		<div>
			{mounted ? (
				<Review
					totalRatings={baseProduct.totalRatings}
					ratings={baseProduct.ratings}
					handleToggleVote={handleToggleVote}
					isVote={isVote}
					productName={baseProduct.title}
					handleSubmitReview={handleSubmitReview}
					productId={baseProduct._id}
					loading={loading}
				/>
			) : (
				<></>
			)}

			<div className="block w-full">
				<ReviewComment reviews={reviews} />
			</div>
		</div>
	)
}

export default memo(ProductInformation)
