"use client"
import { FC, useMemo, useState, useEffect, useCallback } from "react"
import { ProductType } from "@/types/product"
import { CustomSlider } from "@/app/components"
import { getProductCategories, getProducts } from "@/app/api"
import { CategoryType } from "@/types"

export const HotCollections: FC = () => {
	const [categories, setCategories] = useState<CategoryType[]>([])

	const fetchCategories = useCallback(async () => {
		try {
			const response = await getProductCategories()
			setCategories(response.productCategory)
		} catch (error) {
			console.error("Error fetching products:", error)
		}
	}, [])

	useEffect(() => {
		fetchCategories()
	}, [fetchCategories])

	return (
		<div className="w-full flex flex-wrap gap-4">
			{categories.length > 0 &&
				categories.map((category) => (
					<div key={category._id} className="w-1/3 flex-initial p-2 mx-[-8px]">
						<div className="border"></div>
					</div>
				))}
		</div>
	)
}
