"use client"
import { ProductExtraType, ProductType } from "@/types/product"
import { FC } from "react"
import { CustomImage, ProductOptions } from "@/components/"
import {
	discountLabel,
	discountValidate,
	formatPrice,
	renderStarFromNumber,
} from "@/utils/"
import clsx from "clsx"
import { NoProductImage } from "@/assets/images"
import Link from "next/link"

interface ProductProps {
	product: ProductExtraType
	markLabel?: string
	enableOptions?: boolean
	enableTitle?: boolean
	enableStars?: boolean
	enablePrice?: boolean
}

const ProductCard: FC<ProductProps> = ({
	product,
	markLabel,
	enableOptions = false,
	enableTitle = true,
	enableStars = true,
	enablePrice = true,
}) => {
	const labelProduct = clsx(
		"absolute top-0 left-0 text-xs font-medium me-2 px-2.5 py-0.5 rounded",
		{ "bg-red-100 text-red-800 border-red-400": markLabel === "Trending" },
		{ "bg-blue-100 text-blue-800 border-blue-400": markLabel === "New" }
	)
	return (
		<div className="text-base w-[140px]">
			<div className="flex flex-col items-center relative group">
				<CustomImage
					src={product.thumbnail || NoProductImage}
					alt={product.title}
					fill
					className="w-full h-[140px]"
				/>
				{markLabel && <div className={labelProduct}>{markLabel}</div>}
				{enableOptions && (
					<div className="hidden bottom-[-10px] left-0 right-0 justify-center gap-2 group-hover:animate-slide-up group-hover:flex group-hover:absolute">
						<ProductOptions productSlug={product.slug} product={product} />
					</div>
				)}
				{discountValidate(product) && discountLabel(product.discount)}
			</div>
			<div className="flex flex-col gap-1 mt-4 items-star w-full">
				{enableTitle && (
					<Link
						href={`/products/${product.slug}`}
						className="line-clamp-2 h-[60px] font-bold hover-effect hover:opacity-70 duration-300 ease-in-out hover:underline"
					>
						{product.title}
					</Link>
				)}
				{enableStars && (
					<span className="flex h-4">
						{renderStarFromNumber(product.totalRatings)}
					</span>
				)}
				{enablePrice && (
					<div className="text-sm font-light text-green-500">
						{discountValidate(product) ? (
							<div className="flex flex-col">
								<span className="line-through text-gray-500 text-xs">
									{formatPrice(product.price)}
								</span>
								<span className="text-green-500 text-sm">
									{formatPrice(product.discount.productPrice)}
								</span>
							</div>
						) : (
							<span className="text-sm">{formatPrice(product.price)}</span>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default ProductCard
