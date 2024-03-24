import { VariantType } from "@/types"
import { CustomImage } from ".."
import { FC } from "react"
import { formatPriceNumber } from "@/utils"

interface ProductVariantSelectProps {
	variant: VariantType
}

const ProductVariantSelect: FC<ProductVariantSelectProps> = ({ variant }) => {
	return (
		<div className="flex gap-1 items-center">
			<CustomImage
				className="w-[30px] h-[30px]"
				src={variant.thumbnail}
				alt="Product variant image"
				fill
			/>
			<div className="flex w-[120px] flex-col">
				<span className="text-sm line-clamp-1">{variant.color}</span>
				<span className="text-xs">{formatPriceNumber(variant.price)}</span>
			</div>
		</div>
	)
}
export default ProductVariantSelect
