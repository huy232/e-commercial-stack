import { showToast } from "@/components"
import { API, WEB_URL } from "@/constant"
import { createAsyncThunk } from "@reduxjs/toolkit"

export interface UserCartType {
	product_id: string
	variant_id: string | null
	quantity: number
}

export const handleUserLogin = createAsyncThunk(
	"auth/handleUserLogin",
	async ({ email, password }: { email: string; password: string }) => {
		try {
			// const loginResponse = await fetch(API + "/user/login", {
			// 	method: "POST",
			// 	credentials: "include",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		email,
			// 		password,
			// 	}),
			// })

			const loginResponse = await fetch(`/api/user/login`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			})

			const response = await loginResponse.json()
			return response
		} catch (error) {
			console.error("Error while logging in:", error)
			return false
		}
	}
)

export const checkAuthentication = createAsyncThunk<boolean, void>(
	"auth/checkAuthentication",
	async () => {
		try {
			// const response = await fetch(API + `/user/check-auth`, {
			// 	method: "GET",
			// 	credentials: "include",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// })

			const response = await fetch(`/api/user/check-auth`, {
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
			const response = await fetch(`/api/user/check-admin`, {
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
			const response = await fetch(`/api/coupon`, {
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
			const response = await fetch(`/api/wishlist/`, {
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
			showToast(responseData.message, "success")
			return responseData
		} catch (error) {
			showToast("Failed to get user wishlist", "error")
			throw error
		}
	}
)

export const getUserWishlist = createAsyncThunk(
	"auth/getUserWishlist",
	async () => {
		try {
			const response = await fetch(`/api/wishlist/`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-cache",
			})
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}
			const responseData = await response.json()
			return responseData
		} catch (error) {
			showToast("Failed to get wishlist", "error")
			throw error
		}
	}
)

export const getInformUserWishlist = createAsyncThunk(
	"auth/getInformUserWishlist",
	async () => {
		try {
			const response = await fetch(`/api/wishlist/user`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-cache",
			})
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}
			const responseData = await response.json()
			return responseData
		} catch (error) {
			showToast("Failed to get wishlist information", "error")
			throw error
		}
	}
)
