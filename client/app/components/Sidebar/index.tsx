"use client"
import { FC, useEffect } from "react"
import { CategoryType } from "@/types/category"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/types/redux"
import { getCategoriesAction } from "@/store/actions/asyncAction"

export const Sidebar: FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { categories, isLoading, errorMessage } = useSelector(
		(state: RootState) => state.app
	)

	useEffect(() => {
		dispatch(getCategoriesAction())
	}, [dispatch])

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (errorMessage) {
		return <div>{errorMessage}</div>
	}

	if (categories && categories.length > 0) {
		return (
			<div className="flex flex-col">
				{categories.map((category: CategoryType) => (
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
