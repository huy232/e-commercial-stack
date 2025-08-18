import { CategoryType } from "@/types"
import React from "react"
import CustomImage from "../CustomImage"
import Link from "next/link"

interface ProductCategoryProps {
	productCategory: CategoryType[]
}

const ProductCategory = ({ productCategory }: ProductCategoryProps) => {
	return (
		<div>
			<h2 className="text-3xl font-bold uppercase font-bebasNeue text-center border-r-2 border-l-2 border-black inline-block w-fit mx-auto px-2">
				List of <span className="text-red-500">Product Categories</span>
			</h2>
			<div className="border-t-2 border-black w-full"></div>
			<ul className="list-none my-2 mx-2 flex flex-wrap justify-center gap-4 mt-4">
				{productCategory.map((category) => (
					<li
						key={category._id}
						className="w-[220px] flex flex-col items-center"
					>
						<Link
							href={`/products?category=${category.slug}`}
							className="text-black flex flex-col items-center hover:text-blue-800 transition-colors duration-300"
						>
							<CustomImage
								src={category.image}
								alt={category.title}
								className="w-[120px] h-[120px] object-contain rounded mb-2 hover:scale-105 transition-transform duration-300"
								fill
							/>
							<span className="">{category.title}</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default ProductCategory
