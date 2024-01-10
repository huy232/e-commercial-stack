"use client"
import { FC, useEffect } from "react"
import { CategoryType } from "@/types/category"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/types/redux"
import { getCategoriesAction } from "@/store/actions/asyncAction"

interface SidebarProps {
	categories: any
}

const Sidebar: FC<SidebarProps> = ({ categories }) => {
	console.log(categories)
	const products = categories.data
	if (products) {
		return (
			<div className="flex flex-col">
				{products.map((category: CategoryType) => (
					<Link
						key={category._id}
						href={category.slug}
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
