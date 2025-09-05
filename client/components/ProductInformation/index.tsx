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
	const [baseProduct, setBaseProduct] = useState(product)
	const [activeTab, setActiveTab] = useState(1)
	const [isVote, setIsVote] = useState(false)
	const [reviews, setReviews] = useState(product.ratings)
	const tabClass = (id: number) =>
		clsx(`font-semibold p-2 rounded cursor-pointer whitespace-nowrap`, {
			"bg-gray-300": id === activeTab,
		})

	const handleTabClick = useCallback((id: number) => {
		setActiveTab(id)
	}, [])

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
			}
		},
		[closeVoteModal, updateReviews]
	)

	return (
		<div>
			{/* <div className="flex items-center gap-2">
				{productInformationTabs.map((tab) => (
					<span
						className={tabClass(tab.id)}
						key={tab.id}
						onClick={() => handleTabClick(tab.id)}
					>
						{tab.name}
					</span>
				))}
			</div> */}
			{mounted ? (
				<Review
					totalRatings={baseProduct.totalRatings}
					ratings={baseProduct.ratings}
					handleToggleVote={handleToggleVote}
					isVote={isVote}
					productName={baseProduct.title}
					handleSubmitReview={handleSubmitReview}
					productId={baseProduct._id}
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
