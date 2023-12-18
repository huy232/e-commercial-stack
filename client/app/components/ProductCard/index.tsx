import { ProductType } from "@/types"
import { FC } from "react"
import { CustomImage } from "@/app/components"
import { formatPrice, renderStarFromNumber } from "@/utils"

interface ProductCardProps {
	product: ProductType
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
	return (
		<div className="flex flex-row border">
			<div className="flex-1 w-1/2">
				<CustomImage
					src={product.thumbnail}
					alt={product.title}
					className="object-contain"
				/>
			</div>
			<div className="flex-1 flex flex-col w-1/2 gap-2">
				<span className="line-clamp-1 text-xs">{product.title}</span>
				<span className="flex h-4">
					{renderStarFromNumber(product.totalRatings, 14)}
				</span>
				<span className="text-xs">{formatPrice(product.price)} VND</span>
			</div>
		</div>
	)
}
