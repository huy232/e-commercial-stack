"use client"
import { FC, useCallback, useEffect } from "react"
import { Button } from "@/components"

interface ProductQuantityProps {
	quantity: number
	setQuantity: React.Dispatch<React.SetStateAction<number>>
	allowQuantity: boolean
	quantityLimit: number
}

const ProductQuantity: FC<ProductQuantityProps> = ({
	quantity,
	setQuantity,
	allowQuantity,
	quantityLimit,
}) => {
	const handleIncrement = useCallback(() => {
		if (quantity < quantityLimit) {
			setQuantity((prevQuantity) => prevQuantity + 1)
		}
	}, [quantity, setQuantity, quantityLimit])

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
			} else if (value > quantityLimit) {
				value = quantityLimit // Set to the maximum value if the entered value is greater than the limit
			}
			setQuantity(value)
		},
		[setQuantity, quantityLimit]
	)

	useEffect(() => {
		if (quantity > quantityLimit) {
			setQuantity(quantityLimit)
		}
	}, [quantity, quantityLimit, setQuantity])

	return (
		<div className="flex gap-2 items-center">
			{allowQuantity && (
				<>
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
				</>
			)}
		</div>
	)
}

export default ProductQuantity
