"use client"
import { BsHandbagFill, FaTrash, IoIosCloseCircle } from "@/assets/icons"
import { useDispatch, useSelector } from "react-redux"
import { selectAuthUser, selectIsUserLoading } from "@/store/slices/authSlice"
import { useClickOutside } from "@/hooks"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AppDispatch, Cart, VariantType } from "@/types"
import { Button, CustomImage } from "@/components"
import { useRouter } from "next/navigation"
import {
	handleDeleteCart,
	handleGetUserCart,
	handleUpdateCart,
} from "@/store/actions"
import Link from "next/link"
import { formatPrice, handleCalculatePrice, path } from "@/utils"
import clsx from "clsx"
import {
	selectCart,
	selectCartLoading,
	updateCart,
} from "@/store/slices/cartSlice"
import { RootState } from "@/store"
import { toast } from "react-toastify"
const SidebarCart = () => {
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const cart = useSelector<RootState, Cart[] | null>(selectCart)
	const loadingCart = useSelector(selectCartLoading)
	const loadingUser = useSelector(selectIsUserLoading)
	const sidebarCartRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const [error, setError] = useState<string>("")

	useClickOutside(sidebarCartRef, (event) => {
		setOpen(false)
	})

	useEffect(() => {
		if (!loadingUser) {
			const getCurrentCart = async () => {
				await dispatch(handleGetUserCart())
			}
			getCurrentCart()
		}
	}, [dispatch, loadingUser])

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

	const toggleSidebarCart = () => {
		setOpen(!open)
	}

	const renderVariantDetails = (variant: VariantType) => {
		return (
			<div>
				{variant.variant.map((key, index) => (
					<div key={index}>
						<span className="capitalize">{key.type}: </span>
						<span>{String(key.value)}</span> {/* Convert value to string */}
					</div>
				))}
			</div>
		)
	}

	const handleQuantityChange = async (index: number, quantity: number) => {
		if (cart && cart.length > 0) {
			const updatedCart = cart.map((item, i: number) => {
				const maxQuantity = item.variant
					? item.variant.stock
					: item.product.quantity
				return i === index
					? { ...item, quantity: Math.min(quantity || 1, maxQuantity) }
					: item
			})
			await dispatch(updateCart(updatedCart))
		}
	}

	const handleUpdateCartQuantity = async () => {
		if (cart) {
			const transformCartData = cart.map((item) => ({
				product_id: item.product._id,
				variant_id: item.variant ? item.variant._id : null,
				quantity: item.quantity,
			}))
			try {
				const response = await dispatch(
					handleUpdateCart(transformCartData)
				).unwrap()
				toast.success(response.message, {
					position: "top-left",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				})
				setError("")
			} catch (error) {
				setError("Something went wrong while updating user cart")
				console.error("Failed to update cart:", error)
			}
		}
	}

	const deleteCartItem = async (product: Cart) => {
		if (cart) {
			try {
				const response = await dispatch(
					handleDeleteCart({
						product_id: product.product._id,
						variant_id: product.variant?._id,
					})
				).unwrap()
				toast.success(response.message, {
					position: "top-left",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				})
				setError("")
			} catch (error) {
				setError("Something went wrong while delete cart")
				console.error("Failed to delete cart:", error)
			}
		}
	}

	const totalPrice = useMemo(() => {
		if (!cart) {
			return 0
		}

		return cart.reduce((acc: number, item) => {
			return acc + handleCalculatePrice(item)
		}, 0)
	}, [cart])

	return (
		<>
			<div
				className="flex items-center justify-center gap-1 px-2 mx-2 sm:mx-4 md:mx-6 border-r cursor-pointer hover-effect opacity-80 hover:bg-black/40 rounded text-xs h-full"
				onClick={() => toggleSidebarCart()}
			>
				<BsHandbagFill color="red" />

				{!loadingCart && (
					<span className="whitespace-nowrap">
						{cart ? cart.length : 0} item(s)
					</span>
				)}
			</div>

			{typeof window !== "undefined" &&
				createPortal(
					<>
						<div
							className={`z-10 fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
								open ? "opacity-100 visible" : "opacity-0 invisible"
							}`}
							onClick={() => setOpen(false)}
						></div>

						<div
							ref={sidebarCartRef}
							className={clsx(
								"fixed top-0 right-0 w-full lg:w-[400px] h-full bg-white shadow-lg transition-transform transform",
								open ? "translate-x-0 z-50" : "translate-x-full"
							)}
						>
							<div className="p-4 flex flex-col h-full">
								<div className="flex items-center">
									<h2 className="text-3xl tracking-wide font-semibold font-bebasNeue">
										Shopping Cart
									</h2>
									<span
										className="hover-effect cursor-pointer text-2xl hover:opacity-80 ml-auto"
										onClick={() => setOpen(false)}
									>
										<IoIosCloseCircle />
									</span>
								</div>
								<div className="flex-1 mt-4 overflow-y-auto">
									{cart && cart && cart.length > 0 ? (
										cart.map((item, index: number) => (
											<div
												key={index}
												className="grid grid-cols-[40%_60%] mt-4"
											>
												<div className="relative m-auto group">
													<CustomImage
														alt={item.product.title}
														src={item.product.thumbnail}
														fill
														className="w-[120px] h-[120px]"
													/>
													<div
														className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer hover-effect hidden group-hover:block text-red-500 p-2 rounded-full bg-black/70 duration-300"
														onClick={() => deleteCartItem(item)}
													>
														<FaTrash size={16} />
													</div>
												</div>
												<div className="flex flex-col">
													<span className="text-sm font-semibold line-clamp-2">
														{item.product.title}
													</span>
													{item.variant && (
														<div className="mt-1 text-sm text-gray-500">
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
										<span>There are no items in the cart</span>
									)}
								</div>
								{cart && cart.length > 0 && (
									<div className="flex flex-col">
										{error && (
											<span className="text-red-500 text-xs">{error}</span>
										)}
										<div className="flex items-center gap-2 my-1">
											<span className="font-semibold text-xl">Total</span>
											<span className="text-green-500 font-medium tracking-wider">
												{formatPrice(totalPrice)}
											</span>
										</div>
										<Button
											onClick={() => handleUpdateCartQuantity()}
											className="rounded p-2 my-1 border-red-500 hover:bg-red-500 hover:text-white hover-effect duration-300 border-2"
											disabled={loadingCart}
											loading={loadingCart}
										>
											Update cart
										</Button>
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
								)}
							</div>
						</div>
					</>,
					document.body
				)}
		</>
	)
}
export default SidebarCart
