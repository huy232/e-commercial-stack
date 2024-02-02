"use client"
import { FC, useCallback } from "react"
import { Button } from "@/components"

interface ProductQuantityProps {
	quantity: number
	setQuantity: React.Dispatch<React.SetStateAction<number>>
}

const ProductQuantity: FC<ProductQuantityProps> = ({
	quantity,
	setQuantity,
}) => {
	const handleIncrement = useCallback(() => {
		if (quantity < 99) {
			setQuantity((prevQuantity) => prevQuantity + 1)
		}
	}, [quantity, setQuantity])

	const handleDecrement = useCallback(() => {
		if (quantity > 1) {
			setQuantity((prevQuantity) => prevQuantity - 1)
		}
	}, [quantity, setQuantity])

	return (
		<div className="flex gap-2 items-center">
			<span className="font-semibold">Quantity</span>
			<div className="flex items-center">
				<Button className="border-r border-black" onClick={handleDecrement}>
					-
				</Button>
				<input
					className="py-2 outline-none w-[100px] text-black text-center"
					type="number"
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
				/>
				<Button className="border-l border-black" onClick={handleIncrement}>
					+
				</Button>
			</div>
		</div>
	)
}

export default ProductQuantity
