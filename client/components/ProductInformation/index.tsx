"use client"
import { FC, useCallback, useState } from "react"
import { productInformationTabs } from "@/constant"
import clsx from "clsx"
import { memo } from "react"
import { Button, Modal, ReviewOption, VoteBar } from "@/components"
import { renderStarFromNumber } from "@/utils"
import { productRating } from "@/app/api"
import { ProductType } from "@/types"

interface ProductInformationProps {
	product: ProductType
}

const ProductInformation: FC<ProductInformationProps> = ({ product }) => {
	const {
		brand,
		category,
		color,
		createdAt,
		description,
		images,
		price,
		quantity,
		ratings,
		slug,
		sold,
		title,
		totalRatings,
		updatedAt,
		_id,
		thumbnail,
	} = product
	const [activeTab, setActiveTab] = useState(1)
	const [isVote, setIsVote] = useState(false)

	const tabClass = (id: number) =>
		clsx(`font-semibold p-2 rounded cursor-pointer whitespace-nowrap`, {
			"bg-gray-300": id === activeTab,
		})

	const handleTabClick = (id: number) => {
		setActiveTab(id)
	}

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
				const response = await productRating(star, value, productId)
				closeVoteModal()
			} catch (error) {
				console.log(error)
			}
		},
		[closeVoteModal]
	)

	return (
		<div>
			<Modal isOpen={isVote} onClose={handleToggleVote}>
				<div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
					<ReviewOption
						productName={title}
						handleSubmitReview={handleSubmitReview}
						productId={_id}
					/>
				</div>
			</Modal>
			<div className="flex items-center gap-2">
				{productInformationTabs.map((tab) => (
					<span
						className={tabClass(tab.id)}
						key={tab.id}
						onClick={() => handleTabClick(tab.id)}
					>
						{tab.name}
					</span>
				))}
			</div>
			<div className="w-full h-[300px]">
				{activeTab === 5 && (
					<>
						<div className="flex p-4">
							<div className="flex-4 flex flex-col items-center justify-center">
								<span className="font-semibold">{`${totalRatings}/5`}</span>
								<span className="flex items-center gap-1">
									{renderStarFromNumber(totalRatings)}
								</span>
								<span className="text-xs">{`${ratings.length} reviews`}</span>
							</div>
							<div className="flex-6 p-4 gap-2 flex flex-col">
								{Array.from(Array(5).keys()).map((element) => (
									<VoteBar
										key={element}
										ratingNumber={element + 1}
										ratingTotal={5}
										ratingCount={2}
									/>
								))}
							</div>
						</div>
						<div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
							<span>Do you want to review this product?</span>
							<Button
								onClick={handleToggleVote}
								className="rounded bg-red-500 text-white p-1 hover-effect"
							>
								Review now!
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default memo(ProductInformation)
