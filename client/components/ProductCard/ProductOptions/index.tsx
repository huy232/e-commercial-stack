"use client"
import {
	AiFillEye,
	AiOutlineLoading,
	AiOutlineMenu,
	BsFillSuitHeartFill,
} from "@/assets/icons"
import {
	Button,
	CustomImage,
	Modal,
	ProductQuickView,
	Toast,
	showToast,
} from "@/components"
import { useMounted } from "@/hooks"
import { handleUserWishlist } from "@/store/actions"
import { selectAuthUser } from "@/store/slices/authSlice"
import { AppDispatch, ProductType } from "@/types"
import { path } from "@/utils"
import clsx from "clsx"
import Link from "next/link"
import { FC, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export interface ProductOptionsProps {
	productSlug: string
	product: ProductType
}

export const productHoverOptions = [
	{ id: 1, icon: <AiFillEye /> },
	{ id: 2, icon: <AiOutlineMenu /> },
	{ id: 3, icon: <BsFillSuitHeartFill /> },
]

const ProductOptions: FC<ProductOptionsProps> = ({ productSlug, product }) => {
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector(selectAuthUser)
	const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const mounted = useMounted()

	const optionClass = clsx(
		`w-10 h-10 rounded-full border-solid border-gray-500 border-[1px] shadow-md flex items-center justify-center hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800 duration-200 ease-linear`
	)
	const handleQuickView = () => {
		setShowModal(!showModal)
	}
	const handleCloseQuickView = () => {
		setShowModal(false)
	}
	const handleWishlist = async (product_id: string) => {
		if (!user) {
			showToast("Please login to add items to your wishlist", "warn")
			return
		}
		setLoading(true)
		await dispatch(handleUserWishlist(product_id))
		setLoading(false)
	}
	if (!mounted) {
		return null
	}
	return (
		<>
			{showModal && (
				<Modal isOpen={showModal} onClose={handleCloseQuickView}>
					<ProductQuickView product={product} />
				</Modal>
			)}
			{productHoverOptions.map((option, index) => {
				if (option.id === 1) {
					return (
						<div
							className={clsx(optionClass, "bg-white")}
							onClick={handleQuickView}
							key={option.id}
							title="Quick view"
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
							title="Product detail"
						>
							<div className={clsx(optionClass, "bg-white")}>{option.icon}</div>
						</Link>
					)
				}
				if (option.id === 3) {
					return (
						<Button
							key={option.id}
							className={clsx(optionClass, {
								"bg-red-500 text-white":
									user && user.wishlist.includes(product._id),
								"opacity-50 cursor-not-allowed": loading,
							})}
							onClick={() => handleWishlist(product._id)}
							title={
								user && user.wishlist.includes(product._id)
									? "Remove from wishlist"
									: "Add to wishlist"
							}
							disabled={loading}
						>
							{loading ? (
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
