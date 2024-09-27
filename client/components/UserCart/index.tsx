"use client"
import {
	selectAuthUser,
	selectIsLoading,
	selectOriginalCart,
	updateUserCart,
} from "@/store/slices/authSlice"
import { AppDispatch, ICoupon, UserCart, VariantProperties } from "@/types"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, CustomImage } from "@/components"
import { useMounted } from "@/hooks"
import Link from "next/link"
import { FaTrash } from "@/assets/icons"
import { handleUserBulkCart } from "@/store/actions"
import { useForm } from "react-hook-form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import { FormatDiscountEnum } from "@/types/formatDiscountEnum"
import { formatPrice, formatDiscount, formatDiscountDisplay } from "@/utils"
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
	const originalCart = useSelector(selectOriginalCart)
	const isLoading = useSelector(selectIsLoading)
	const mounted = useMounted()
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<CouponFormInputs>()

	const [error, setError] = useState<string>("")

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

	const handleCalculatePrice = (item: UserCart) => {
		let total = 0
		if (item.variant) {
			total = (item.product.price + item.variant.price) * item.quantity
		} else {
			total = item.product.price * item.quantity
		}
		return total
	}

	const handleQuantityChange = async (index: number, quantity: number) => {
		// if (quantity < 1 || isNaN(quantity)) return 1
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

	const originalCartPrice = user
		? user.cart.reduce((acc: number, item: UserCart) => {
				return acc + handleCalculatePrice(item)
		  }, 0)
		: 0

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
	}, [discount, setValue])

	useEffect(() => {
		if (mounted && !user) {
			router.push("/login")
		}
	}, [mounted, user, router])

	if (!mounted) {
		return null
	}

	if (mounted && (!user || !user.cart)) {
		return <div>There is no product in the cart right now.</div>
	}
	return (
		<div>
			<div className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 mb-4">
				<div className="font-semibold">Product details</div>
				<div className="font-semibold">Quantity</div>
				<div className="font-semibold">Price</div>
				<div className="font-semibold">Total</div>
			</div>
			{user.cart.map((item: UserCart, index: number) => (
				<div
					key={item.product._id}
					className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 mb-4 items-center"
				>
					<div className="flex items-center gap-4 group">
						<div className="relative flex justify-center items-center">
							<CustomImage
								src={item.product.thumbnail}
								alt={item.product.title}
								width={120}
								height={120}
								className="w-full"
							/>
							<div
								className="absolute z-10 cursor-pointer hover-effect hidden group-hover:block text-red-500 p-2 rounded-full bg-black/70"
								onClick={() => {
									deleteCartItem(index)
								}}
							>
								<FaTrash size={16} />
							</div>
						</div>
						<div>
							<span className="font-semibold">{item.product.title}</span>
							{item.variant && renderVariantDetails(item.variant)}
						</div>
					</div>
					<div>
						<input
							className="outline-none mx-2 rounded text-center"
							type="number"
							min="1"
							max={item.variant ? item.variant.stock : item.product.quantity}
							value={item.quantity}
							onChange={(e) =>
								handleQuantityChange(index, parseInt(e.target.value))
							}
						/>
					</div>
					<div className="flex flex-col">
						<span className="text-sm">
							{item.product.price.toLocaleString("it-IT", {
								style: "currency",
								currency: "VND",
							})}
						</span>
						{item.variant && (
							<span className="italic text-xs flex flex-col">
								<span className="text-gray-500">(Variant)</span>
								<span className="text-gray-500">
									{item.variant.price.toLocaleString("it-IT", {
										style: "currency",
										currency: "VND",
									})}
								</span>
							</span>
						)}
					</div>
					<div className="text-xs">
						{handleCalculatePrice(item).toLocaleString("it-IT", {
							style: "currency",
							currency: "VND",
						})}
					</div>
				</div>
			))}
			<div className="grid grid-cols-2 gap-4">
				<Button
					className="inline py-3 px-6 rounded-md bg-rose-500 text-gray-50 before:border-rose-500 hover-effect my-2"
					onClick={() => {
						handleUpdateCart()
					}}
					disabled={isLoading}
					loading={isLoading}
				>
					Update cart
				</Button>
				<Button className="inline py-3 px-6 rounded-md bg-rose-500 text-gray-50 before:border-rose-500 hover-effect my-2">
					Empty all the cart
				</Button>
			</div>
			<div className="md:grid grid-cols-3">
				<div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col items-end gap-y-3 border border-gray-900 rounded-md p-5">
							{coupon && coupon.message && (
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
								className="w-full border rounded-md py-2 px-4"
								{...register("couponCode")}
							/>
							<Button
								type="submit"
								className="inline py-3 px-6 rounded-md bg-rose-500 text-gray-50 before:border-rose-500 hover-effect"
								disabled={isLoading}
								loading={isLoading}
							>
								Apply coupon
							</Button>
						</div>
					</form>
				</div>
				<div></div>
				<div className="border border-gray-900 rounded-md p-5 mt-5 md:mt-0">
					<div className="text-xl font-medium">Summary</div>
					<div className="divide-y">
						<div className="flex justify-between items-center py-4">
							<span className="font-medium">Orignal price</span>
							<span className="text-xs text-gray-500">
								{formatPrice(originalCartPrice)}
							</span>
						</div>
						<div className="flex justify-between items-center py-4">
							<span className="font-medium">Discount</span>
							<span className="text-sm bg-yellow-500 rounded p-1 text-black">
								{coupon && coupon.data
									? formatDiscountDisplay(coupon.data)
									: "None"}
							</span>
						</div>
						<div className="flex justify-between items-center py-4">
							<span className="font-medium">Total price</span>
							<span className="text-sm text-teal-500">
								{coupon && coupon.data
									? formatPrice(
											formatDiscount(
												coupon.data.discountType,
												coupon.data.discount,
												originalCartPrice
											)
									  )
									: formatPrice(originalCartPrice)}
							</span>
						</div>
					</div>
					<div className="flex justify-center mt-3 w-full">
						<Button
							className="w-full hover-effect"
							loading={isLoading}
							disabled={isLoading}
						>
							<Link
								className="w-full block py-3 text-center bg-rose-500 text-gray-50 rounded-md font-medium"
								href={createCheckoutUrl(coupon?.data || null)}
							>
								Checkout
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserCart
