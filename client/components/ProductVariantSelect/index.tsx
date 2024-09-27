import { VariantType } from "@/types"
import { CustomImage } from ".."
import { FC } from "react"
import { formatPrice } from "@/utils"
import clsx from "clsx"

interface ProductVariantSelectProps {
	variant: VariantType
	handleVariantSelect: () => void
	isSelected: boolean
}

const ProductVariantSelect: FC<ProductVariantSelectProps> = ({
	variant,
	handleVariantSelect,
	isSelected,
}) => {
	const variantClass = (isSelected: boolean) =>
		clsx(
			`flex gap-1 items-center border-2 rounded hover-effect cursor-pointer p-1`,
			isSelected ? "border-red-500" : "border-transparent"
		)
	return (
		<div className="w-fit">
			<div className={variantClass(isSelected)} onClick={handleVariantSelect}>
				<CustomImage
					className="w-[30px] h-[30px]"
					src={variant.thumbnail}
					alt="Product variant image"
					fill
				/>
				<div className="flex w-[120px] flex-col">
					<span className="text-sm line-clamp-1">{variant.color}</span>
					<span className="text-xs">{formatPrice(variant.price)}</span>
				</div>
			</div>
		</div>
	)
}
export default ProductVariantSelect
