"use client"
import { FC, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Minus, Plus } from "lucide-react" // nice icons
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
			setQuantity((prev) => prev + 1)
		}
	}, [quantity, setQuantity, quantityLimit])

	const handleDecrement = useCallback(() => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1)
		}
	}, [quantity, setQuantity])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = parseInt(e.target.value, 10)
			if (isNaN(value) || value < 1) {
				value = 1
			} else if (value > quantityLimit) {
				value = quantityLimit
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
		<div className="max-sm:mx-auto flex gap-3 items-center my-3">
			{allowQuantity && (
				<>
					<span className="font-semibold text-gray-700">Quantity</span>
					<div className="flex items-center bg-white border rounded-full shadow-sm overflow-hidden">
						{/* Decrement button */}
						<motion.button
							whileTap={{ scale: 0.9 }}
							onClick={handleDecrement}
							disabled={quantity <= 1}
							className="p-2 px-3 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
						>
							<Minus className="w-4 h-4" />
						</motion.button>

						{/* Input */}
						<input
							className="w-[60px] text-center py-2 border-x outline-none text-gray-900 font-medium"
							type="number"
							value={quantity}
							onChange={handleChange}
						/>

						{/* Increment button */}
						<motion.button
							whileTap={{ scale: 0.9 }}
							onClick={handleIncrement}
							disabled={quantity >= quantityLimit}
							className="p-2 px-3 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
						>
							<Plus className="w-4 h-4" />
						</motion.button>
					</div>
				</>
			)}
		</div>
	)
}

export default ProductQuantity
