"use client"
import { BsHandbagFill, FaTrash, IoIosCloseCircle } from "@/assets/icons"
import { useDispatch, useSelector } from "react-redux"
import {
	selectAuthUser,
	selectOriginalCart,
	updateUserCart,
} from "@/store/slices/authSlice"
import { useClickOutside } from "@/hooks"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AppDispatch, UserCart, VariantProperties } from "@/types"
import { CustomImage } from "@/components"
import { useRouter } from "next/navigation"
import { URL } from "@/constant"
import { handleUserBulkCart } from "@/store/actions"
import Link from "next/link"
import { formatPrice, path } from "@/utils"

export const SidebarCart = () => {
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const user = useSelector(selectAuthUser)
	const originalCart = useSelector(selectOriginalCart)

	const sidebarCartRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const [error, setError] = useState<string>("")

	useClickOutside(sidebarCartRef, (event) => {
		setOpen(false)
	})

	useEffect(() => {
		if (open) {
			document.body.classList.add("overflow-hidden")
		} else {
			document.body.classList.remove("overflow-hidden")
		}
		return () => {
			document.body.classList.remove("overflow-hidden")
		}
	}, [open])

	const handleSidebarCart = () => {
		if (!user) {
			router.replace(URL + "/login")
		}
		if (user) {
			toggleSidebarCart()
		}
	}

	const toggleSidebarCart = () => {
		setOpen(!open)
	}

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
						<span className="capitalize">{key}: </span>
						<span>{variant[key]}</span>
					</div>
				))}
			</div>
		)
	}

	const handleQuantityChange = async (index: number, quantity: number) => {
		if (user) {
			const updatedCart = user.cart.map((item: UserCart, i: number) => {
				const maxQuantity = item.variant
					? item.variant.stock
					: item.product.quantity
				return i === index
					? { ...item, quantity: Math.min(quantity || 1, maxQuantity) }
					: item
			})
			await dispatch(updateUserCart(updatedCart))
		}
	}

	const totalPrice = useMemo(() => {
		if (!user || !user.cart) {
			return 0
		}

		return user.cart.reduce((acc: number, item: UserCart) => {
			return acc + handleCalculatePrice(item)
		}, 0)
	}, [user])

	const deleteCartItem = async (index: number) => {
		const updatedCart = [...user.cart]
		updatedCart.splice(index, 1)
		await dispatch(updateUserCart(updatedCart))
	}

	const handleUpdateCart = async () => {
		const transformCartData = user.cart.map((item: UserCart) => ({
			product_id: item.product._id,
			variant_id: item.variant ? item.variant._id : null,
			quantity: item.quantity,
		}))
		try {
			await dispatch(handleUserBulkCart(transformCartData)).unwrap()
			setError("")
		} catch (error) {
			await dispatch(updateUserCart(originalCart))
			setError("Something went wrong while updating user cart")
			console.error("Failed to update cart:", error)
		}
	}
	return (
		<>
			<div
				className="flex items-center justify-center gap-2 px-6 border-r cursor-pointer hover-effect opacity-80 hover:bg-black/40 rounded"
				onClick={() => handleSidebarCart()}
			>
				<BsHandbagFill color="red" />
				<span>{user && user.cart ? user.cart.length : 0} item(s)</span>
			</div>
			{user &&
				createPortal(
					<>
						<div
							className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
								open ? "opacity-100 visible" : "opacity-0 invisible"
							}`}
							onClick={() => setOpen(false)}
						></div>

						<div
							ref={sidebarCartRef}
							className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transition-transform transform ${
								open ? "translate-x-0 z-50" : "translate-x-full"
							}`}
						>
							<div className="p-4 flex flex-col h-full">
								<div className="flex items-center">
									<h2 className="text-xl font-semibold">Shopping Cart</h2>
									<span
										className="hover-effect cursor-pointer text-2xl hover:opacity-80 ml-auto"
										onClick={() => setOpen(false)}
									>
										<IoIosCloseCircle />
									</span>
								</div>
								<div className="flex-1 mt-4 overflow-y-auto">
									{user && user.cart && user.cart.length > 0 ? (
										user.cart.map((item: UserCart, index: number) => (
											<div
												key={index}
												className="grid grid-cols-[30%_70%] gap-2"
											>
												<div className="relative m-auto group">
													<CustomImage
														alt={item.product.title}
														src={item.product.thumbnail}
														width={120}
														height={200}
														className="w-full"
													/>
													<div
														className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer hover-effect hidden group-hover:block text-red-500 p-2 rounded-full bg-black/70 duration-300"
														onClick={() => deleteCartItem(index)}
													>
														<FaTrash size={16} />
													</div>
												</div>
												<div className="flex flex-col">
													<span className="text-sm font-semibold">
														{item.product.title}
													</span>
													{item.variant && (
														<div className="mt-2 text-sm text-gray-500">
															{renderVariantDetails(item.variant)}
														</div>
													)}
													<span className="text-sm text-black-500">
														Price:
														<span className="text-xs mx-1">
															{formatPrice(handleCalculatePrice(item))}
														</span>
													</span>
													<span className="text-sm">
														Quantity:
														<span>
															<input
																className="outline-none mx-2 rounded text-center"
																type="number"
																min="1"
																max={
																	item.variant
																		? item.variant.stock
																		: item.product.quantity
																}
																value={item.quantity}
																onChange={(e) =>
																	handleQuantityChange(
																		index,
																		parseInt(e.target.value)
																	)
																}
															/>
														</span>
													</span>
												</div>
											</div>
										))
									) : (
										<span>There is no items in the cart</span>
									)}
								</div>
								<div className="flex flex-col">
									{error && (
										<span className="text-red-500 text-xs">{error}</span>
									)}
									<span>Total: {formatPrice(totalPrice)}</span>
									<button
										onClick={() => handleUpdateCart()}
										className="rounded p-2 my-1 border-red-500 hover:bg-red-500 hover:text-white hover-effect duration-300 border-2"
									>
										Update cart
									</button>
									<Link
										className="rounded p-2 my-1 border-green-500 hover:bg-green-500 hover:text-black hover-effect duration-300 border-2 text-center"
										href={path.CART}
										onClick={() => {
											router.push(path.CART)
											setOpen(false)
										}}
									>
										Proceed
									</Link>
								</div>
							</div>
						</div>
					</>,
					document.body
				)}
		</>
	)
}
