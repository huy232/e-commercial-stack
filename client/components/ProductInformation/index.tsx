"use client"
import { FC, useCallback, useState } from "react"
import { productInformationTabs } from "@/constant"
import clsx from "clsx"
import { memo } from "react"
import { Button, Modal, ReviewOption, VoteBar } from "@/components"
import { renderStarFromNumber } from "@/utils"

interface ProductInformationProps {
	ratingTotal: number
	ratingCount: number
	productName: string
}

const ProductInformation: FC<ProductInformationProps> = ({
	ratingTotal,
	ratingCount,
	productName,
}) => {
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

	return (
		<div>
			<Modal isOpen={isVote} onClose={handleToggleVote}>
				<div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
					<ReviewOption productName={productName} />
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
								<span className="font-semibold">{`${ratingTotal}/5`}</span>
								<span className="flex items-center gap-1">
									{renderStarFromNumber(ratingTotal)}
								</span>
								<span className="text-xs">{`${ratingCount} reviews`}</span>
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
							<Button onClick={handleToggleVote} className="">
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
