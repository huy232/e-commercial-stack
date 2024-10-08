"use client"
import { FC } from "react"
import { CategoryType } from "@/types/category"
import Link from "next/link"

interface SidebarProps {
	categories: any
}

const Sidebar: FC<SidebarProps> = ({ categories }) => {
	const categoriesSidebar = categories.data

	if (categoriesSidebar) {
		return (
			<div className="flex flex-col">
				{categoriesSidebar.map((category: CategoryType) => (
					<Link
						key={category._id}
						href={`/products?category=${category.slug}`}
						className="hover:text-main hover:bg-black/20 opacity-80 duration-200 ease-linear text-sm px-5 py-3 rounded"
					>
						{category.title}
					</Link>
				))}
			</div>
		)
	}

	return <div>No categories available</div>
}

export default Sidebar
