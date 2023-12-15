import { ProductType } from "@/types/product"
import { FC } from "react"
import { CustomImage } from "@/app/components/CustomImage"
import NoProductImage from "@/assets/images/no-product-image.png"
import { formatPrice } from "@/utils/"
import clsx from "clsx"

interface ProductProps {
	product: ProductType
	markLabel: string
}
export const Product: FC<ProductProps> = ({ product, markLabel }) => {
	const labelProduct = clsx(
		"absolute top-0 left-0 text-xs font-medium me-2 px-2.5 py-0.5 rounded border",
		{ "bg-red-100 text-red-800 border-red-400": markLabel === "Trending" },
		{ "bg-blue-100 text-blue-800 border-blue-400": markLabel === "New" }
	)

	return (
		<div className="w-full text-base px-1">
			<div className="w-[240px] h-[240px] border p-4 flex flex-col items-center relative">
				<CustomImage
					src={product.thumbnail || NoProductImage}
					alt={product.title}
					className="object-contain"
				/>
				<div className={labelProduct}>{markLabel}</div>
			</div>
			<div className="flex flex-col gap-1 mt-4 items-star w-full">
				<span className="line-clamp-2 h-[60px]">{product.title}</span>
				<span>{formatPrice(product.price)} VND</span>
			</div>
		</div>
	)
}
