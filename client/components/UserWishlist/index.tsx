"use client"
import { API } from "@/constant"
import {
	AppDispatch,
	ProductExtraType,
	ProductType,
	ProfileUser,
} from "@/types"
import { FC, useState } from "react"
import { Button, CustomImage, showToast } from "@/components"
import { formatPrice } from "../../utils/formatPrice"
import { renderStarFromNumber } from "@/utils"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { handleUserWishlist } from "@/store/actions"
import { AiOutlineLoading, FaTrashAlt } from "@/assets/icons"

interface UserOrderProps {
	user: ProfileUser
	userWishlist: any
}

interface Product {
	_id: string
	title: string
	thumbnail: string
	allowVariants: boolean
	price: number
}

const UserWishlist: FC<UserOrderProps> = ({ user, userWishlist }) => {
	const [loading, setLoading] = useState(false)
	const dispatch = useDispatch<AppDispatch>()
	const handleRemoveWishlist = async (product_id: string) => {
		if (!user) {
			showToast("Please login to add items to your wishlist", "warn")
			return
		}
		setLoading(true)
		await dispatch(handleUserWishlist(product_id))
		setLoading(false)
	}

	if (userWishlist.length === 0) {
		return <div>There is currently no wishlist.</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
			{userWishlist.map((wishlistItem: { product_id: ProductExtraType }) => {
				const product = wishlistItem.product_id

				if (!product) {
					return null
				}
				return (
					<div
						className="flex flex-row gap-2 p-2 items-center border rounded-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
						key={product._id}
					>
						<CustomImage
							alt={product.title}
							src={product.thumbnail}
							className="rounded-md w-[120px] h-[120px]"
							width={120}
							height={120}
						/>
						<div className="flex flex-col justify-between">
							<Link
								href={`/products/${product.slug}`}
								className="h-[60px] font-bold text-base line-clamp-2 hover-effect hover:opacity-70 duration-300 ease-in-out"
							>
								{product.title}
							</Link>
							<span className="flex">
								{renderStarFromNumber(
									product.ratings && product.ratings.length > 0
										? product.ratings.reduce(
												(sum, rating) => sum + rating.star,
												0
										  ) / product.ratings.length
										: 0
								)}
							</span>
							<p className="text-xs font-medium text-green-500">
								{formatPrice(product.price)}
							</p>
							<p className="text-xs">In stock: {product.quantity}</p>
							<div className="mt-2">
								<Button
									onClick={() => handleRemoveWishlist(product._id)}
									className="text-xs border-red-500 border-2 hover:bg-red-500 duration-300 ease-in-out p-0.5 rounded-md inline-block"
									disabled={loading}
									loading={loading}
									aria-label="Remove from wishlist"
									role="button"
									tabIndex={0}
									data-testid="remove-from-wishlist-button"
									id="remove-from-wishlist-button"
								>
									{loading ? (
										<span className="animate-spin">
											<AiOutlineLoading />
										</span>
									) : (
										<span className="flex items-center gap-0.5">
											<span>Delete</span> <FaTrashAlt />
										</span>
									)}
								</Button>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default UserWishlist
