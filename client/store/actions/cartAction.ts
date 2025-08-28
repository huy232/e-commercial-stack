import { API } from "@/constant"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserCartType } from "./userAction"

export interface DeleteCartI {
	product_id: string
	variant_id?: string | null
}

export const handleGetUserCart = createAsyncThunk(
	"cart/handleGetUserCart",
	async () => {
		try {
			// const response = await fetch(API + `/cart/`, {
			// 	method: "GET",
			// 	credentials: "include",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	cache: "no-cache",
			// })

			const response = await fetch(`api/cart/`, {
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
			console.error("Error fetching cart:", error)
			throw error
		}
	}
)

export const handleCreateUserCart = createAsyncThunk(
	"cart/handleCreateUserCart",
	async (userCart: UserCartType) => {
		try {
			const response = await fetch(API + `/cart/`, {
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
			return responseData
		} catch (error) {
			throw error
		}
	}
)

export const handleUpdateCart = createAsyncThunk(
	"cart/handleUpdateCart",
	async (userCart: UserCartType[]) => {
		try {
			const response = await fetch(API + `/cart/`, {
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
			return responseData
		} catch (error) {
			throw error
		}
	}
)

export const handleDeleteCart = createAsyncThunk(
	"cart/handleDeleteCart",
	async (cartItem: DeleteCartI) => {
		try {
			const response = await fetch(API + `/cart/`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(cartItem),
				cache: "no-cache",
			})
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}
			const responseData = await response.json()
			return responseData
		} catch (error) {
			throw error
		}
	}
)

export const handleWipeCart = createAsyncThunk(
	"cart/handleWipeCart",
	async () => {
		try {
			const response = await fetch(API + `/cart/wipe-cart`, {
				method: "DELETE",
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
			throw error
		}
	}
)
