import { VariantType } from "@/types"
import { CustomImage } from ".."
import { FC } from "react"
import { formatPriceNumber } from "@/utils"

interface ProductVariantSelectProps {
	variant: VariantType
}

const ProductVariantSelect: FC<ProductVariantSelectProps> = ({ variant }) => {
	return (
		<div>
			<CustomImage src={variant.images[0]} alt="Product variant image" fill />
			<span>{formatPriceNumber(variant.price)}</span>
		</div>
	)
}
export default ProductVariantSelect
