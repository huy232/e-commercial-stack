"use client"
import { API } from "@/constant"
import { AppDispatch, ProductType, ProfileUser } from "@/types"
import { FC, useState } from "react"
import { CustomImage, showToast } from "@/components"
import { formatPrice } from "../../utils/formatPrice"
import { renderStarFromNumber } from "@/utils"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { handleUserWishlist } from "@/store/actions"
import { AiOutlineLoading } from "@/assets/icons"

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
	const { data } = userWishlist
	if (!data) {
		return <div>There's currently no wishlist.</div>
	}
	const handleRemoveWishlist = async (product_id: string) => {
		if (!user) {
			showToast("Please login to add items to your wishlist", "warn")
			return
		}
		setLoading(true)
		await dispatch(handleUserWishlist(product_id))
		setLoading(false)
	}

	return (
		<div>
			{data.map((wishlistItem: ProductType) => (
				<div className="flex flex-row">
					<div>
						<CustomImage
							alt={wishlistItem.title}
							src={wishlistItem.thumbnail}
							height={120}
							width={120}
						/>
					</div>
					<div className="flex flex-col">
						<Link
							href={`/products/${wishlistItem.slug}`}
							className="font-bold text-xl line-clamp-2 hover-effect hover:opacity-70 duration-300 ease-in-out"
						>
							{wishlistItem.title}
						</Link>
						<p className="text-md">In stock: {wishlistItem.quantity}</p>
						<p className="text-xs">{formatPrice(wishlistItem.price)}</p>
						<span className="flex">
							{renderStarFromNumber(wishlistItem.ratings.length)}
						</span>
						<div className="mt-2">
							<button
								onClick={() => handleRemoveWishlist(wishlistItem._id)}
								className="border-red-500 border-2 hover:bg-red-500 duration-300 ease-in-out p-1 rounded-md inline-block"
							>
								{loading ? (
									<span className="animate-spin">
										<AiOutlineLoading />
									</span>
								) : (
									"Remove from wishlist"
								)}
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default UserWishlist
