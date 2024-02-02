"use client"
import { useState } from "react"
import { productInformationTabs } from "@/constant"
import clsx from "clsx"
import { memo } from "react"

const ProductInformation = () => {
	const [activeTab, setActiveTab] = useState(1)

	const tabClass = (id: number) =>
		clsx(`font-semibold p-2 rounded cursor-pointer`, {
			"bg-gray-300": id === activeTab,
		})

	const handleTabClick = (id: number) => {
		setActiveTab(id)
	}

	return (
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
			<div className="w-full h-[300px]"></div>
		</div>
	)
}

export default memo(ProductInformation)
