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
import { Button, CustomImage } from "@/components"
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
		if (mounted && !user) {
			router.push("/login")
		}
		if (discount) {
			setValue("couponCode", Array.isArray(discount) ? discount[0] : discount)
		}
	}, [discount, mounted, router, setValue, user])

	if (!mounted) {
		return null
	}

	if (mounted && !cart) {
		return <div>There is no product in the cart right now.</div>
	}

	return (
		<>
			<div className="hidden lg:grid lg:grid-cols-[3fr_1fr_1fr_1fr] lg:gap-4 lg:mb-4">
				<div className="font-semibold">Product details</div>
				<div className="font-semibold text-center">Quantity</div>
				<div className="font-semibold text-center">Price</div>
				<div className="font-semibold text-right">Total</div>
			</div>
			{cart &&
				cart.map((item: Cart, index: number) => (
					<div
						key={item.product._id}
						className="border-rose-500 lg:border-transparent rounded border-2 p-1 mx-1 lg:grid lg:grid-cols-[3fr_1fr_1fr_1fr] lg:gap-4 mb-2 lg:mb-4 items-center"
					>
						<div className="flex items-center gap-1 lg:gap-4 group">
							<div className="relative flex justify-center items-center w-fit">
								<CustomImage
									src={item.product.thumbnail}
									alt={item.product.title}
									fill
									className="w-[120px] h-[120px]"
								/>
								<div
									className="absolute z-10 cursor-pointer hover-effect hidden group-hover:block text-red-500 p-2 rounded-full bg-black/70"
									onClick={() => {
										deleteCartItem(item)
									}}
								>
									<FaTrash size={16} />
								</div>
							</div>
							<div className="w-full">
								<span className="text-sm font-semibold line-clamp-2">
									{item.product.title}
								</span>
								{item.variant && renderVariantDetails(item.variant)}
							</div>
						</div>
						<div className="inline-block lg:w-full">
							<input
								className="w-[40px] lg:w-full outline-none text-xs lg:mx-2 rounded text-center"
								type="number"
								min="1"
								max={item.variant ? item.variant.stock : item.product.quantity}
								value={item.quantity}
								onChange={(e) =>
									handleQuantityChange(index, parseInt(e.target.value))
								}
							/>
						</div>
						<span className="inline-block lg:hidden text-xs font-light gap-1">
							x
						</span>
						<div className="inline-flex items-center lg:flex-col ml-0.5">
							<div className="text-xs">
								{discountValidate(item.product)
									? formatPrice(item.product.discount.productPrice)
									: formatPrice(item.product.price)}
							</div>
							{item.variant && (
								<>
									<div className="inline-block lg:hidden h-[42px] w-[6px] mx-2 my-1">
										<div className="self-stretch bg-gray-500 -skew-x-12 inline-block h-full w-[2px]"></div>
									</div>
									<span className="italic text-[14px] flex flex-col items-center">
										<span className="text-gray-500">(Variant)</span>
										<span className="text-gray-500">
											{formatPrice(item.variant.price)}
										</span>
									</span>
								</>
							)}
						</div>
						<div className="flex text-sm max-sm:bg-rose-500 max-sm:p-2 max-sm:rounded justify-end items-center">
							<span className="inline-block lg:hidden mr-1 font-anton text-sm">
								Total
							</span>
							<span className="text-xs text-green-500 italic font-semibold max-sm:mb-[2px]">
								{handleCalculatePrice(item).toLocaleString("it-IT", {
									style: "currency",
									currency: "VND",
								})}
							</span>
						</div>
					</div>
				))}
			<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
				<Button
					className="inline py-2 lg:py-3 lg:px-6 rounded-md bg-rose-500 text-gray-50 before:border-rose-500 hover-effect mx-4 my-1 lg:my-2"
					onClick={() => {
						handleUpdateCartQuantity()
					}}
					disabled={isLoading}
					loading={isLoading}
					aria-label="Update cart"
					role="button"
					tabIndex={0}
					data-testid="update-cart-button"
					id="update-cart-button"
				>
					Update cart
				</Button>
				<Button
					className="inline py-2 lg:py-3 lg:px-6 rounded-md bg-rose-500 text-gray-50 before:border-rose-500 hover-effect mx-4 my-1 lg:my-2"
					onClick={() => handleCartWipe()}
					disabled={isLoading}
					loading={isLoading}
					aria-label="Empty the cart"
					role="button"
					tabIndex={0}
					data-testid="empty-cart-button"
					id="empty-cart-button"
				>
					Empty the cart
				</Button>
			</div>
			<div className="lg:grid grid-cols-3 my-4">
				<form onSubmit={handleSubmit(onSubmit)} className="mx-2">
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
							aria-label="Apply coupon"
							role="button"
							tabIndex={0}
							data-testid="apply-coupon-button"
							id="apply-coupon-button"
						>
							Apply coupon
						</Button>
					</div>
				</form>
				<div />
				<div className="border border-gray-900 rounded-md p-5 mt-5 lg:mt-0 mx-2">
					<div className="text-xl font-medium">Summary</div>
					<div className="divide-y">
						<div className="flex justify-between items-center py-4">
							<span className="font-medium">Orignal price</span>
							<span className="text-xs text-gray-500">
								{formatPrice(totalPrice)}
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
												totalPrice
											)
									  )
									: formatPrice(totalPrice)}
							</span>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<Button
							className="w-full hover-effect"
							loading={isLoading}
							disabled={isLoading}
							aria-label="Proceed to checkout"
							role="button"
							tabIndex={0}
							data-testid="proceed-to-checkout-button"
							id="proceed-to-checkout-button"
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
		</>
	)
}

export default UserCart
