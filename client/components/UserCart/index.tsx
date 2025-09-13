"use client"
import {
	selectAuthUser,
	selectIsUserLoading,
	selectOriginalCart,
} from "@/store/slices/authSlice"
import {
	AppDispatch,
	Cart,
	ICoupon,
	RootState,
	VariantProperties,
	VariantType,
} from "@/types"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, CustomImage, EmptyCart } from "@/components"
import { useMounted } from "@/hooks"
import Link from "next/link"
import { FaTrash } from "@/assets/icons"
import {
	handleDeleteCart,
	handleUpdateCart,
	handleUserBulkCart,
	handleWipeCart,
} from "@/store/actions"
import { useForm } from "react-hook-form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import { FormatDiscountEnum } from "@/types/formatDiscountEnum"
import {
	formatPrice,
	formatDiscount,
	formatDiscountDisplay,
	discountValidate,
	handleCalculatePrice,
} from "@/utils"
import {
	selectCart,
	selectCartLoading,
	updateCart,
} from "@/store/slices/cartSlice"
import { toast } from "react-toastify"
import { AnimatePresence, motion } from "framer-motion"
type CouponFormInputs = {
	couponCode: string
}

type UserCartProps = {
	discount?: string | string[]
	coupon: {
		message: string
		data: ICoupon
		success: boolean
	}
}

const UserCart = ({ discount, coupon }: UserCartProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector(selectAuthUser)
	const isLoading = useSelector(selectIsUserLoading)
	const cart = useSelector<RootState, Cart[] | null>(selectCart)
	const loadingCart = useSelector(selectCartLoading)
	const mounted = useMounted()
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const anyCartLoading = loadingCart || isLoading

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<CouponFormInputs>()
	const [error, setError] = useState<string>("")

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

	const totalPrice = useMemo(() => {
		if (!cart) {
			return 0
		}

		return cart.reduce((acc: number, item) => {
			return acc + handleCalculatePrice(item)
		}, 0)
	}, [cart])

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

	const handleCartWipe = async () => {
		if (cart) {
			const response = await dispatch(handleWipeCart()).unwrap()
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
		}
	}

	const onSubmit = async (data: CouponFormInputs) => {
		const newSearchParams = new URLSearchParams(searchParams.toString())
		newSearchParams.set("discount", data.couponCode)
		replace(`${pathname}?${newSearchParams.toString()}`)
	}

	const createCheckoutUrl = (coupon: ICoupon | null) => {
		const url = new URL("/checkout", window.location.origin)
		if (coupon && coupon.code) {
			url.searchParams.set("discount", coupon.code)
		}
		return url.toString()
	}

	useEffect(() => {
		if (discount) {
			setValue("couponCode", Array.isArray(discount) ? discount[0] : discount)
		}
	}, [discount, mounted, router, setValue, user])

	if (!mounted) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col items-center justify-center h-64 gap-4"
			>
				<div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
				<p className="text-gray-500 text-sm">Loading your cart...</p>
			</motion.div>
		)
	}

	return (
		<AnimatePresence>
			{cart && cart.length > 0 ? (
				<>
					{/* Table Header */}
					<div className="hidden lg:grid lg:grid-cols-[3fr_1fr_1fr_1fr] lg:gap-4 lg:mb-4">
						<div className="font-semibold">Product details</div>
						<div className="font-semibold text-center">Quantity</div>
						<div className="font-semibold text-center">Price</div>
						<div className="font-semibold text-right">Total</div>
					</div>

					{/* Cart Items */}
					{cart.map((item: Cart, index: number) => (
						<motion.div
							key={item.product._id}
							layout
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.3 }}
							className="border-rose-500 lg:border-transparent rounded border-2 p-1 mx-1 lg:grid lg:grid-cols-[3fr_1fr_1fr_1fr] lg:gap-4 mb-2 lg:mb-4 items-center hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
						>
							<div className="flex items-center gap-1 lg:gap-4 group">
								<div className="relative flex justify-center items-center w-[120px] h-[120px]">
									<CustomImage
										src={item.product.thumbnail}
										alt={item.product.title}
										fill
										className="w-[120px] h-[120px] rounded-lg"
									/>
									<div
										className="absolute z-10 cursor-pointer hover-effect hidden group-hover:block text-red-500 p-2 rounded-full bg-black/70"
										onClick={() => deleteCartItem(item)}
									>
										<FaTrash size={16} />
									</div>
								</div>
								<div className="">
									<span className="text-sm font-semibold line-clamp-2">
										{item.product.title}
									</span>
									{item.variant && renderVariantDetails(item.variant)}
								</div>
							</div>

							{/* Quantity */}
							<div className="inline-block w-full text-center">
								<input
									className="w-[40px] outline-none text-xs lg:mx-2 rounded text-center border border-gray-300 focus:ring-1 focus:ring-rose-500"
									type="number"
									min="1"
									max={
										item.variant ? item.variant.stock : item.product.quantity
									}
									value={item.quantity}
									onChange={(e) =>
										handleQuantityChange(index, parseInt(e.target.value))
									}
								/>
							</div>

							{/* Price */}
							<div className="inline-flex items-center lg:flex-col ml-0.5 text-xs">
								<div>
									{discountValidate(item.product)
										? formatPrice(item.product.discount.productPrice)
										: formatPrice(item.product.price)}
								</div>
								{item.variant && (
									<div className="italic text-gray-500 flex flex-col items-center">
										<span>(Variant)</span>
										<span>{formatPrice(item.variant.price)}</span>
									</div>
								)}
							</div>

							{/* Total */}
							<div className="flex text-sm justify-end items-center">
								<span className="text-xs text-green-500 italic font-semibold">
									{handleCalculatePrice(item).toLocaleString("it-IT", {
										style: "currency",
										currency: "VND",
									})}
								</span>
							</div>
						</motion.div>
					))}

					{/* Action Buttons */}
					<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
						<Button
							className="inline py-2 lg:py-3 lg:px-6 rounded-md bg-red-500 text-gray-50 hover:bg-red-600 hover:opacity-70 transition-all duration-300 mx-4 my-1 lg:my-2"
							onClick={handleUpdateCartQuantity}
							disabled={anyCartLoading}
							loading={anyCartLoading}
						>
							Update cart
						</Button>
						<Button
							className="inline py-2 lg:py-3 lg:px-6 rounded-md bg-gray-500 text-white hover:bg-red-500 transition-all duration-300 mx-4 my-1 lg:my-2"
							onClick={handleCartWipe}
							disabled={anyCartLoading}
							loading={anyCartLoading}
						>
							Empty the cart
						</Button>
					</div>

					{/* Coupon & Summary */}
					<div className="lg:grid grid-cols-3 my-4 gap-4">
						{/* Coupon Form */}
						<form onSubmit={handleSubmit(onSubmit)} className="mx-2">
							<div className="flex flex-col items-end gap-y-3 border border-gray-900 rounded-md p-5">
								{coupon?.message && (
									<span
										className={clsx(
											coupon.success ? "text-teal-500" : "text-red-500",
											"mr-auto ml-0"
										)}
									>
										{coupon.message}
									</span>
								)}
								<input
									type="text"
									placeholder="Enter discount code here"
									className="w-full border rounded-md py-2 px-4 focus:ring-1 focus:ring-rose-500"
									{...register("couponCode")}
								/>
								<Button
									type="submit"
									className="inline py-3 px-6 rounded-md bg-red-500 text-gray-50 hover:bg-red-600 hover:opacity-70 transition-all duration-300"
									disabled={anyCartLoading}
									loading={anyCartLoading}
								>
									Apply coupon
								</Button>
							</div>
						</form>

						<div />

						{/* Summary & Checkout */}
						<div className="border border-gray-900 rounded-md p-5 mt-5 lg:mt-0 mx-2 flex flex-col justify-between">
							<div>
								<div className="text-xl font-medium mb-4">Summary</div>
								<div className="divide-y divide-gray-300">
									<div className="flex justify-between items-center py-4">
										<span className="font-medium">Original price</span>
										<span className="text-xs text-gray-500">
											{formatPrice(totalPrice)}
										</span>
									</div>
									<div className="flex justify-between items-center py-4">
										<span className="font-medium">Discount</span>
										<span className="text-sm bg-yellow-500 rounded p-1 text-black">
											{coupon?.data
												? formatDiscountDisplay(coupon.data)
												: "None"}
										</span>
									</div>
									<div className="flex justify-between items-center py-4">
										<span className="font-medium">Total price</span>
										<span className="text-sm text-teal-500">
											{coupon?.data
												? formatPrice(
														formatDiscount(
															coupon.data.discountType,
															coupon.data.discount,
															totalPrice
														)
												  )
												: formatPrice(totalPrice)}
										</span>
									</div>
								</div>
							</div>

							<Button
								className="w-full mt-4 hover:scale-[1.02] transition-all duration-300 relative"
								disabled={anyCartLoading}
								loading={anyCartLoading}
							>
								<Link
									href={createCheckoutUrl(coupon?.data || null)}
									className="w-full block py-3 text-center bg-red-500 text-gray-50 rounded-md font-medium"
								>
									Checkout
								</Link>
							</Button>
						</div>
					</div>
				</>
			) : (
				// Empty Cart UI
				<EmptyCart />
			)}
		</AnimatePresence>
	)
}

export default UserCart
