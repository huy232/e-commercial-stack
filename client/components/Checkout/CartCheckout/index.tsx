import { CustomImage } from "@/components"
import { ProfileUser, UserCart, VariantProperties } from "@/types"
import { formatPrice } from "@/utils"

interface ICartCheckout {
	mounted: boolean
	user: ProfileUser
}

const CartCheckout = ({ mounted, user }: ICartCheckout) => {
	if (!mounted) {
		return null
	}
	if (!user) {
		return <div>No product in your cart.</div>
	}
	const { cart } = user

	const handleCalculatePrice = (item: UserCart) => {
		let total = 0
		if (item.variant) {
			total = (item.product.price + item.variant.price) * item.quantity
		} else {
			total = item.product.price * item.quantity
		}
		return total
	}

	const renderVariantDetails = (variant: VariantProperties) => {
		const variantKeys = Object.keys(variant).filter(
			(key) => !["_id", "price", "stock"].includes(key)
		)
		return (
			<div>
				{variantKeys.map((key) => (
					<div key={key}>
						<span className="capitalize text-xs font-medium">{key}: </span>
						<span className="text-xs text-gray-500">{variant[key]}</span>
					</div>
				))}
			</div>
		)
	}

	return (
		<div>
			{cart.map((cartItem: UserCart) => (
				<div className="flex flex-row">
					<div className="relative">
						<CustomImage
							src={cartItem.product.thumbnail}
							width={120}
							height={120}
							alt={cartItem.product.title}
						/>
						<span className="text-xs absolute top-0 left-0 p-2 bg-black text-white rounded-full w-[30px] h-[30px] flex justify-center items-center">
							{cartItem.quantity}
						</span>
					</div>
					<div className="">
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
		</div>
	)
}
export default CartCheckout
