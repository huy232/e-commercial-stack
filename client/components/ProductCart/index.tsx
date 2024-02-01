"use client"
import { FC, memo, useState } from "react"
import { Button, ProductQuantity } from "@/components"

interface ProductCartProps {}

const ProductCart: FC<ProductCartProps> = () => {
	const [quantity, setQuantity] = useState(1)

	return (
		<>
			<ProductQuantity quantity={quantity} setQuantity={setQuantity} />
			<Button className="w-full bg-rose-500 text-white hover:opacity-80 hover-effect p-2 rounded">
				Add to cart
			</Button>
		</>
	)
}

export default memo(ProductCart)
