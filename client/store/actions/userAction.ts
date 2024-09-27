import { showToast } from "@/components"
import { API } from "@/constant"
import { createAsyncThunk } from "@reduxjs/toolkit"

export interface UserCartType {
	product_id: string
	variant_id: string | null
	quantity: number
}

export const checkAuthentication = createAsyncThunk<boolean, void>(
	"auth/checkAuthentication",
	async () => {
		try {
			const response = await fetch(API + `/user/check-auth`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			})

			const data = await response.json()
			return data.success
		} catch (error) {
			console.error("Error checking authentication:", error)
			return false
		}
	}
)

export const checkIsAdmin = createAsyncThunk<boolean, void>(
	"auth/checkIsAdmin",
	async () => {
		try {
			const response = await fetch(API + `/user/check-admin`, {
				method: "GET",
				credentials: "include",
			})

			const data = await response.json()
			return data.success
		} catch (error) {
			return false
		}
	}
)

export const handleUserCart = createAsyncThunk(
	"auth/handleUserCart",
	async (userCart: UserCartType) => {
		try {
			const response = await fetch(API + `/user/update-cart`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userCart),
				cache: "no-cache",
			})
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}
			const responseData = await response.json()
			return responseData.cart
		} catch (error) {
			throw error
		}
	}
)

export const handleUserBulkCart = createAsyncThunk(
	"auth/handleUserBulkCart",
	async (userCart: UserCartType[]) => {
		try {
			const response = await fetch(API + `/user/update-cart`, {
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userCart),
				cache: "no-cache",
			})
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}
			const responseData = await response.json()
			return responseData.cart
		} catch (error) {
			throw error
		}
	}
)

export const handleApplyCoupon = createAsyncThunk(
	"auth/handleApplyCoupon",
	async (couponCode) => {
		try {
			const response = await fetch(API + `/coupon`, {
				method: "GET",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(couponCode),
				cache: "no-cache",
			})
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}
			const responseData = await response.json()
			return responseData.json()
		} catch (error) {
			throw error
		}
	}
)

export const handleUserWishlist = createAsyncThunk(
	"auth/handleWishlist",
	async (product_id: string) => {
		try {
			const response = await fetch(API + `/user/wishlist`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-cache",
				body: JSON.stringify({ product_id: product_id }),
			})
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}
			const responseData = await response.json()
			showToast("Wishlist updated successfully", "success")
			return responseData.data
		} catch (error) {
			showToast("Failed to update wishlist", "error")
			throw error
		}
	}
)
