"use client"

import { ProductType } from "@/types/product"
import { FC } from "react"
import { CustomImage, ProductOptions } from "@/app/components/"
import { formatPrice, renderStarFromNumber } from "@/utils/"
import { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } from "@/assets/icons"
import clsx from "clsx"
import { NoProductImage } from "@/assets/images"

interface ProductProps {
	product: ProductType
	markLabel: string
}

const productHoverOptions = [
	{ id: 1, icon: <AiFillEye /> },
	{ id: 2, icon: <AiOutlineMenu /> },
	{ id: 3, icon: <BsFillSuitHeartFill /> },
]
export const Product: FC<ProductProps> = ({ product, markLabel }) => {
	const labelProduct = clsx(
		"absolute top-0 left-0 text-xs font-medium me-2 px-2.5 py-0.5 rounded border",
		{ "bg-red-100 text-red-800 border-red-400": markLabel === "Trending" },
		{ "bg-blue-100 text-blue-800 border-blue-400": markLabel === "New" }
	)

	const listProductOptions = productHoverOptions.map((option) => (
		<ProductOptions icon={option.icon} key={option.id} />
	))

	return (
		<div className="w-full text-base px-1">
			<div className="w-[274px] h-[274px] border p-4 flex flex-col items-center relative group">
				<CustomImage
					src={product.thumbnail || NoProductImage}
					alt={product.title}
					className="object-contain"
				/>
				<div className={labelProduct}>{markLabel}</div>
				<div
					className="
				hidden bottom-[-10px] left-0 right-0 justify-center gap-2 
				group-hover:animate-slide-up 
				group-hover:flex 
				group-hover:absolute"
				>
					{listProductOptions}
				</div>
			</div>
			<div className="flex flex-col gap-1 mt-4 items-star w-full">
				<span className="line-clamp-2 h-[60px]">{product.title}</span>
				<span className="flex h-4">
					{renderStarFromNumber(product.totalRatings)}
				</span>
				<span>{formatPrice(product.price)} VND</span>
			</div>
		</div>
	)
}
