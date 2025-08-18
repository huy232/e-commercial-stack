"use client"
import { FC } from "react"
import { CategoryType } from "@/types/category"
import Link from "next/link"
import clsx from "clsx"

interface SidebarProps {
	categories: CategoryType[]
}

const Sidebar: FC<SidebarProps> = ({ categories }) => {
	const sidebarClass = clsx(
		`max-lg:bg-[#121212] text-white hover:text-main hover:bg-white/20 opacity-80 duration-200 ease-linear text-sm px-2 mx-1 py-1 lg:py-2 rounded`
	)

	if (categories) {
		return (
			<div className="lg:bg-[#282A3E] mx-1 p-1 rounded-md w-full flex-1">
				<h2 className="font-bebasNeue font-bold text-2xl mx-1 uppercase h-[40px] mb-1 lg:border-b-2 lg:border-b-gray-200 text-black lg:text-[#EDF2F4] text-center lg:text-left bg-[#5f5f5f29]">
					Categories
				</h2>
				<div className="flex max-lg:items-center lg:flex-col max-lg:overflow-x-scroll max-lg:h-[48px] lg:overflow-y-scroll lg:h-[420px]">
					{categories.map((category: CategoryType) => (
						<Link
							key={category._id}
							href={`/products?category=${category.slug}`}
							className={sidebarClass}
						>
							{category.title}
						</Link>
					))}
				</div>
			</div>
		)
	}

	return <div>No categories available</div>
}

export default Sidebar
