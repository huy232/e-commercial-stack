"use client"
import {
	AiFillEye,
	AiOutlineLoading,
	AiOutlineMenu,
	BsFillSuitHeartFill,
} from "@/assets/icons"
import { Button, Modal, ProductQuickView, showToast } from "@/components"
import { useMounted } from "@/hooks"
import { handleUserWishlist } from "@/store/actions"
import {
	selectAuthUser,
	selectIsWishlistLoading,
	selectWishlist,
} from "@/store/slices/authSlice"
import { AppDispatch, ProductExtraType } from "@/types"
import { path } from "@/utils"
import clsx from "clsx"
import Link from "next/link"
import { FC, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export interface ProductOptionsProps {
	productSlug: string
	product: ProductExtraType
}

const productHoverOptions = [
	{ id: 1, icon: <AiFillEye />, title: "Quick view" },
	{ id: 2, icon: <AiOutlineMenu />, title: "Product detail" },
	{ id: 3, icon: <BsFillSuitHeartFill />, title: "Wishlist" },
]

const ProductOptions: FC<ProductOptionsProps> = ({ productSlug, product }) => {
	const dispatch = useDispatch<AppDispatch>()
	const authUser = useSelector(selectAuthUser)
	const wishlistLoading = useSelector(selectIsWishlistLoading)
	const wishlist = useSelector(selectWishlist)
	const isWishlisted = wishlist.some(
		(item: { product_id: string }) => item.product_id === product._id
	)

	const [showModal, setShowModal] = useState(false)
	const [localLoading, setLocalLoading] = useState(false)
	const mounted = useMounted()

	const optionClass =
		"w-8 h-8 rounded-full border border-gray-500 shadow-md flex items-center justify-center hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800 duration-200"

	const handleQuickView = () => setShowModal(true)
	const handleCloseQuickView = () => setShowModal(false)

	const handleWishlist = async () => {
		if (!authUser) {
			showToast("Please login to add items to your wishlist", "warn")
			return
		}
		setLocalLoading(true)
		await dispatch(handleUserWishlist(product._id))
		setLocalLoading(false)
	}

	if (!mounted) return null

	return (
		<>
			{showModal && (
				<Modal isOpen={showModal} onClose={handleCloseQuickView}>
					<ProductQuickView product={product} />
				</Modal>
			)}
			{productHoverOptions.map((option) => {
				if (option.id === 1) {
					return (
						<div
							className={`${optionClass} bg-white`}
							onClick={handleQuickView}
							key={option.id}
							title={option.title}
						>
							{option.icon}
						</div>
					)
				}
				if (option.id === 2) {
					return (
						<Link
							href={`${path.PRODUCTS}/${productSlug}`}
							key={option.id}
							title={option.title}
						>
							<div className={`${optionClass} bg-white`}>{option.icon}</div>
						</Link>
					)
				}
				if (option.id === 3) {
					return (
						<Button
							key={option.id}
							className={clsx(optionClass, {
								"bg-white text-black": !isWishlisted,
								"bg-red-500 text-white": isWishlisted,
								"cursor-not-allowed": localLoading || wishlistLoading,
							})}
							onClick={handleWishlist}
							title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
							disabled={localLoading || wishlistLoading}
						>
							{localLoading || wishlistLoading ? (
								<span className="animate-spin">
									<AiOutlineLoading />
								</span>
							) : (
								option.icon
							)}
						</Button>
					)
				}
			})}
		</>
	)
}

export default ProductOptions
