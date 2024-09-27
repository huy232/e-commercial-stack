import { ProfileUser, RootState, UserCart } from "@/types"
import { createSlice } from "@reduxjs/toolkit"
import {
	checkAuthentication,
	checkIsAdmin,
	handleApplyCoupon,
	handleUserBulkCart,
	handleUserCart,
	handleUserWishlist,
} from "../actions"

export interface AuthState {
	isAuthenticated: boolean
	user: ProfileUser | null
	originalCart: UserCart[] | null
	isAdmin: boolean
	isLoading: boolean
	error: string
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	originalCart: null,
	isAdmin: false,
	isLoading: false,
	error: "",
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.isAuthenticated = true
			state.user = action.payload
			state.originalCart = action.payload.cart
			state.isAdmin = action.payload.role.includes("admin")
		},
		logout: (state) => {
			state.isAuthenticated = false
			state.user = null
			state.originalCart = null
			state.isAdmin = false
		},
		updateUserCart: (state, action) => {
			if (state.user) {
				state.user.cart = action.payload
			}
		},
		updateOriginalCart: (state, action) => {
			state.originalCart = action.payload
		},
	},
	extraReducers: (builder) => {
		// Check authentication
		builder.addCase(checkAuthentication.fulfilled, (state, action) => {
			state.isAuthenticated = action.payload
			state.isLoading = false
		})
		builder.addCase(checkAuthentication.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(checkAuthentication.rejected, (state) => {
			state.isAuthenticated = false
			state.user = null
			state.originalCart = null
			state.isAdmin = false
			state.isLoading = false
		})
		// Check admin role
		builder.addCase(checkIsAdmin.fulfilled, (state, action) => {
			state.isAdmin = action.payload
			state.isLoading = false
		})
		builder.addCase(checkIsAdmin.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(checkIsAdmin.rejected, (state) => {
			state.isAdmin = false
			state.isLoading = false
		})
		// Handle user cart
		builder.addCase(handleUserCart.fulfilled, (state, action) => {
			if (state.user) {
				state.user.cart = action.payload
				state.originalCart = action.payload
			}
			state.isLoading = false
		})
		builder.addCase(handleUserCart.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(handleUserCart.rejected, (state) => {
			state.isLoading = false
		})
		// Handle user bulk cart
		builder.addCase(handleUserBulkCart.fulfilled, (state, action) => {
			if (state.user) {
				state.user.cart = action.payload
				state.originalCart = action.payload
			}
			state.isLoading = false
		})
		builder.addCase(handleUserBulkCart.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(handleUserBulkCart.rejected, (state) => {
			state.isLoading = false
		})
		// Handle handleApplyCoupon actions
		builder.addCase(handleApplyCoupon.fulfilled, (state, action) => {
			if (state.user) {
				state.user.cart = action.payload
				state.originalCart = action.payload
			}
			state.isLoading = false
		})
		builder.addCase(handleApplyCoupon.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(handleApplyCoupon.rejected, (state, action) => {
			state.isLoading = false
			state.error = action.error.message || ""
		})
		// Handle user wishlist
		builder.addCase(handleUserWishlist.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(handleUserWishlist.rejected, (state, action) => {
			state.isLoading = false
		})
		builder.addCase(handleUserWishlist.fulfilled, (state, action) => {
			if (state.user) {
				state.user.wishlist = action.payload
			}
			state.isLoading = false
		})
	},
})

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
	state.auth.isAuthenticated
export const selectIsAdmin = (state: RootState) => state.auth.isAdmin
export const selectOriginalCart = (state: RootState) => state.auth.originalCart
export const selectIsLoading = (state: RootState) => state.auth.isLoading
export const { loginSuccess, logout, updateUserCart, updateOriginalCart } =
	authSlice.actions
export default authSlice.reducer
