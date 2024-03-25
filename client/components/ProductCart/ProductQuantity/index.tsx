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

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = parseInt(e.target.value, 10)

			if (isNaN(value) || value < 1) {
				value = 1 // Set to the minimum value if the entered value is less than 1
			} else if (value > 99) {
				value = 99 // Set to the maximum value if the entered value is greater than 99
			}
			setQuantity(value)
		},
		[setQuantity]
	)

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
					onChange={handleChange}
				/>
				<Button className="border-l border-black" onClick={handleIncrement}>
					+
				</Button>
			</div>
		</div>
	)
}

export default ProductQuantity
