"use client"
import { CategoryType } from "@/types"
import React from "react"
import CustomImage from "../CustomImage"
import Link from "next/link"
import { motion } from "framer-motion"

interface ProductCategoryProps {
	productCategory: CategoryType[]
}

const ProductCategory = ({ productCategory }: ProductCategoryProps) => {
	// parent animation for stagger effect
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const item = {
		hidden: { opacity: 0, scale: 0.9, y: 30 },
		show: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: "easeOut" as const,
			},
		},
	}

	return (
		<div className="px-4 md:px-8 lg:px-16">
			<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-bebasNeue text-center border-r-2 border-l-2 border-black inline-block w-fit mx-auto px-2">
				List of <span className="text-red-500">Product Categories</span>
			</h2>
			<div className="border-t-2 border-black w-full mt-2"></div>

			{/* Motion container */}
			<motion.ul
				variants={container}
				initial="hidden"
				animate="show"
				className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-6"
			>
				{productCategory.map((category) => (
					<motion.li
						key={category._id}
						variants={item}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true, amount: 0.2 }}
						className="flex flex-col items-center text-center"
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
							<span>{category.title}</span>
						</Link>
					</motion.li>
				))}
			</motion.ul>
		</div>
	)
}

export default ProductCategory
