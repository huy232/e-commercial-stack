import { ProductType } from "@/types/product"
import { FC } from "react"
import { CustomImage, ProductOptions } from "@/components/"
import { formatPrice, renderStarFromNumber } from "@/utils/"
import clsx from "clsx"
import { NoProductImage } from "@/assets/images"

interface ProductProps {
	product: ProductType
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
		"absolute top-0 left-0 text-xs font-medium me-2 px-2.5 py-0.5 rounded border",
		{ "bg-red-100 text-red-800 border-red-400": markLabel === "Trending" },
		{ "bg-blue-100 text-blue-800 border-blue-400": markLabel === "New" }
	)

	return (
		<div className="w-full text-base px-1">
			<div className="border p-4 flex flex-col items-center relative group">
				<CustomImage
					src={product.thumbnail || NoProductImage}
					alt={product.title}
				/>
				{markLabel && <div className={labelProduct}>{markLabel}</div>}
				{enableOptions && (
					<div
						className="
				hidden bottom-[-10px] left-0 right-0 justify-center gap-2 
				group-hover:animate-slide-up 
				group-hover:flex 
				group-hover:absolute"
					>
						<ProductOptions productSlug={product.slug} />
					</div>
				)}
			</div>
			<div className="flex flex-col gap-1 mt-4 items-star w-full">
				{enableTitle && (
					<span className="line-clamp-2 h-[60px]">{product.title}</span>
				)}
				{enableStars && (
					<span className="flex h-4">
						{renderStarFromNumber(product.totalRatings)}
					</span>
				)}
				{enablePrice && <span>{formatPrice(product.price)} VND</span>}
			</div>
		</div>
	)
}

export default ProductCard
