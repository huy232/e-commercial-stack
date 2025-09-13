import { CustomImage } from "@/components"
import { Cart, ProfileUser, VariantProperties, VariantType } from "@/types"
import { formatPrice, handleCalculatePrice } from "@/utils"
import { AnimatePresence, motion } from "framer-motion"

interface ICartCheckout {
	mounted: boolean
	cart: Cart[] | null
}

const CartCheckout = ({ mounted, cart }: ICartCheckout) => {
	if (!mounted) {
		return null
	}
	if (!cart) {
		return <div className="text-center">No product in your cart.</div>
	}

	const renderVariantDetails = (variant: VariantType) => (
		<div className="mt-1">
			{variant.variant.map((key, index) => (
				<div key={index} className="text-xs text-gray-500">
					<span className="capitalize font-medium">{key.type}: </span>
					{key.value}
				</div>
			))}
		</div>
	)

	return (
		<div className="space-y-3">
			<AnimatePresence>
				{cart.map((cartItem, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						className="flex items-center gap-3 p-3 bg-white rounded-lg shadow hover:shadow-lg transition-all"
					>
						<div className="relative w-[80px] h-[80px] flex-shrink-0">
							<CustomImage
								src={cartItem.product.thumbnail}
								alt={cartItem.product.title}
								fill
								className="rounded-lg"
							/>
							<span className="absolute -top-2 -left-2 bg-rose-500 text-white text-xs font-bold rounded-full w-[28px] h-[28px] flex justify-center items-center shadow">
								{cartItem.quantity}
							</span>
						</div>
						<div className="flex-1">
							<p className="font-semibold line-clamp-2">
								{cartItem.product.title}
							</p>
							{cartItem.variant && renderVariantDetails(cartItem.variant)}
							<p className="text-sm text-teal-600 mt-1">
								{formatPrice(handleCalculatePrice(cartItem))}
							</p>
						</div>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}
export default CartCheckout
