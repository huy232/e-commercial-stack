"use client"
import { FC, memo, useState } from "react"
import { Button, ProductQuantity, ProductVariantSelect } from "@/components"
import { VariantType } from "@/types"

interface ProductCartProps {
	variants?: VariantType[]
}

const ProductCart: FC<ProductCartProps> = ({ variants }) => {
	const [quantity, setQuantity] = useState(1)

	return (
		<>
			{variants &&
				variants.map((variant, index) => (
					<ProductVariantSelect key={index} variant={variant} />
				))}
			<ProductQuantity quantity={quantity} setQuantity={setQuantity} />
			<Button className="w-full bg-rose-500 text-white hover:opacity-80 hover-effect p-2 rounded">
				Add to cart
			</Button>
		</>
	)
}

export default memo(ProductCart)
