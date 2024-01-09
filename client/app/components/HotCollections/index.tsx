"use client"
import { FC, useState, useEffect, useCallback } from "react"
import { ProductType } from "@/types/product"
import { CustomImage, CustomSlider } from "@/app/components"
import { getProductCategories, getProducts } from "@/app/api"
import { CategoryType } from "@/types"
import Link from "next/link"

interface HotCollectionsProps {
	categories: any
}

const HotCollections: FC<HotCollectionsProps> = ({ categories }) => {
	return (
		<>
			<h3 className="uppercase text-lg font-semibold border-b-2 border-main py-2 mb-8">
				Hot collections
			</h3>
			<div className="w-full flex-wrap gap-12 grid grid-cols-2 md:grid-cols-3">
				{categories.length > 0 &&
					categories.map((category: any) => (
						<div key={category._id} className="flex">
							<div className="w-1/2 h-[140px]">
								<CustomImage src={category.image} alt={category.title} />
							</div>
							<div className="w-1/2">
								<h4 className="font-semibold uppercase text-sm text-black/80">
									{category.title}
								</h4>
								<ul className="text-xs mx-2 flex flex-col">
									{category.brand.map((eachBrand: any, index: any) => (
										<Link
											href={"#"}
											key={index}
											className="text-black/60 hover:opacity-80 hover:text-main duration-200 ease-in-out my-[2px]"
										>
											{eachBrand}
										</Link>
									))}
								</ul>
							</div>
						</div>
					))}
			</div>
		</>
	)
}

export default HotCollections
