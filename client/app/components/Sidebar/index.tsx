"use client"
import { FC, useEffect, useState } from "react"
import { getCategories } from "@/app/api/home/route"
import { CategoryType } from "@/types/category"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/types/redux"

export const Sidebar = () => {
	const { categories } = useSelector((state: RootState) => state.app)
	console.log(categories)
	return (
		<div className="flex flex-col">
			{/* {categories.length > 0 &&
				categories.map((category) => (
					<Link
						key={category._id}
						href={category.slug}
						className="hover:text-main hover:bg-black/20 opacity-80 duration-200 ease-linear text-sm px-5 py-3"
					>
						{category.title}
					</Link>
				))} */}
		</div>
	)
}
