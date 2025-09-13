import { ProfileUser, RootState } from "@/types"
import { createSlice } from "@reduxjs/toolkit"
import {
	checkAuthentication,
	checkIsAdmin,
	handleApplyCoupon,
	handleUserWishlist,
	handleUserLogin,
	getUserWishlist,
	getInformUserWishlist,
} from "../actions"

export interface AuthState {
	isAuthenticated: boolean
	user: ProfileUser | null
	isAdmin: boolean
	isLoading: boolean
	error: string
	isWishlistLoading: boolean
	wishlist: []
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	isAdmin: false,
	isLoading: true,
	error: "",
	isWishlistLoading: true,
	wishlist: [],
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.isAuthenticated = true
			state.user = action.payload
			state.isAdmin = action.payload.role.includes("admin")
			state.isLoading = false
		},
		logout: (state) => {
			state.isAuthenticated = false
			state.user = null
			state.isAdmin = false
			state.isLoading = false
			state.wishlist = []
		},
		updateUserCart: (state, action) => {
			if (state.user) {
				state.user.cart = action.payload
			}
		},
		updateOriginalCart: (state, action) => {},
		setWishlistLoading: (state, action) => {
			state.isWishlistLoading = action.payload
		},
	},
	extraReducers: (builder) => {
		// Login
		builder.addCase(handleUserLogin.fulfilled, (state, action) => {
			const userData = action.payload?.userData
			if (userData) {
				state.isAuthenticated = true
				state.user = userData
				state.isAdmin = userData.role?.includes("admin") || false
			} else {
				state.isAuthenticated = false
				state.user = null
				state.isAdmin = false
			}
			state.isLoading = false
		})

		builder.addCase(handleUserLogin.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(handleUserLogin.rejected, (state, action) => {
			state.isAuthenticated = false
			state.user = null
			state.isAdmin = false
			state.isLoading = false
			state.error = action.payload as string // gets "Invalid credentials"
		})

		// Check authentication
		builder.addCase(checkAuthentication.fulfilled, (state, action) => {
			state.isAuthenticated = action.payload
			state.isLoading = false
			state.isWishlistLoading = false
		})
		builder.addCase(checkAuthentication.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(checkAuthentication.rejected, (state) => {
			state.isAuthenticated = false
			state.user = null
			state.isAdmin = false
			state.isLoading = false
			state.isWishlistLoading = false
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
		// Handle handleApplyCoupon actions
		builder.addCase(handleApplyCoupon.fulfilled, (state, action) => {
			if (state.user) {
				state.user.cart = action.payload
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
		// Handle add/remove user wishlist
		builder.addCase(handleUserWishlist.pending, (state, action) => {
			state.isWishlistLoading = true
		})
		builder.addCase(handleUserWishlist.rejected, (state, action) => {
			state.isWishlistLoading = false
		})
		builder.addCase(handleUserWishlist.fulfilled, (state, action) => {
			state.wishlist = action.payload.data || []
			state.isWishlistLoading = false
		})
		// Handle get user wishlist
		builder.addCase(getUserWishlist.pending, (state, action) => {
			state.isWishlistLoading = true
		})
		builder.addCase(getUserWishlist.rejected, (state, action) => {
			state.isWishlistLoading = false
		})
		builder.addCase(getUserWishlist.fulfilled, (state, action) => {
			state.wishlist = action.payload.data || []
			state.isWishlistLoading = false
		})

		// Handle get inform user wishlist
		builder.addCase(getInformUserWishlist.pending, (state, action) => {
			state.isWishlistLoading = true
		})
		builder.addCase(getInformUserWishlist.rejected, (state, action) => {
			state.isWishlistLoading = false
		})
		builder.addCase(getInformUserWishlist.fulfilled, (state, action) => {
			state.wishlist = action.payload.data || []
			state.isWishlistLoading = false
		})
	},
})

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectWishlist = (state: RootState) => state.auth.wishlist
export const selectIsAuthenticated = (state: RootState) =>
	state.auth.isAuthenticated
export const selectIsAdmin = (state: RootState) => state.auth.isAdmin
export const selectOriginalCart = (state: RootState) => state.auth.originalCart
export const selectIsUserLoading = (state: RootState) => state.auth.isLoading
export const selectIsWishlistLoading = (state: RootState) =>
	state.auth.isWishlistLoading
export const { loginSuccess, logout, setWishlistLoading } = authSlice.actions
export default authSlice.reducer
