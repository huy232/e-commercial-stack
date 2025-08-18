import { CustomImage } from "@/components"
import { Cart, ProfileUser, VariantProperties, VariantType } from "@/types"
import { formatPrice, handleCalculatePrice } from "@/utils"

interface ICartCheckout {
	mounted: boolean
	cart: Cart[] | null
}

const CartCheckout = ({ mounted, cart }: ICartCheckout) => {
	if (!mounted) {
		return null
	}
	if (!cart) {
		return <div>No product in your cart.</div>
	}

	const renderVariantDetails = (variant: VariantType) => {
		return (
			<div>
				{variant.variant.map((key, index) => (
					<div key={index}>
						<span className="capitalize text-xs font-medium">{key.type}: </span>
						<span className="text-xs text-gray-500">{key.value}</span>
					</div>
				))}
			</div>
		)
	}

	return (
		<>
			{cart.map((cartItem, index) => (
				<div className="flex flex-row items-center mt-2" key={index}>
					<div className="relative my-auto">
						<CustomImage
							src={cartItem.product.thumbnail}
							alt={cartItem.product.title}
							fill
							className="w-[120px] h-[120px]"
						/>
						<span className="text-xs absolute top-0 left-0 p-2 bg-black text-white rounded-full w-[30px] h-[30px] flex justify-center items-center">
							{cartItem.quantity}
						</span>
					</div>
					<div>
						<span className="font-semibold line-clamp-2">
							{cartItem.product.title}
						</span>
						{cartItem.variant && renderVariantDetails(cartItem.variant)}
						<div>
							<span className="text-sm text-teal-500">
								{formatPrice(handleCalculatePrice(cartItem))}
							</span>
						</div>
					</div>
				</div>
			))}
		</>
	)
}
export default CartCheckout
