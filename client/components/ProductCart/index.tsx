"use client"
import { FC, memo, useState } from "react"
import { Button, ProductQuantity, ProductVariantSelect } from "@/components"
import { VariantType } from "@/types"

interface ProductCartProps {
	variants?: VariantType[]
	handleProductDetail: (variant: VariantType | null) => void
}

const ProductCart: FC<ProductCartProps> = ({
	variants,
	handleProductDetail,
}) => {
	const [quantity, setQuantity] = useState(1)
	const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(
		null
	)

	const handleVariantSelect = (variant: VariantType) => {
		if (variant === selectedVariant) {
			setSelectedVariant(null)
			handleProductDetail(null)
		} else {
			setSelectedVariant(variant)
			handleProductDetail(variant)
		}
	}

	return (
		<>
			{variants && (
				<div className="grid grid-cols-2">
					{variants.map((variant, index) => (
						<ProductVariantSelect
							key={index}
							variant={variant}
							handleVariantSelect={() => handleVariantSelect(variant)}
							isSelected={variant === selectedVariant}
						/>
					))}
				</div>
			)}
			<ProductQuantity quantity={quantity} setQuantity={setQuantity} />
			<Button className="w-full bg-rose-500 text-white hover:opacity-80 hover-effect p-2 rounded">
				Add to cart
			</Button>
		</>
	)
}

export default memo(ProductCart)
