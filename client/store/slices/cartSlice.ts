import { createSlice } from "@reduxjs/toolkit"
import {
	handleGetUserCart,
	handleCreateUserCart,
	handleUpdateCart,
	handleDeleteCart,
	handleWipeCart,
} from "../actions"
import { CartState, RootState } from "@/types"

const initialState: CartState = {
	cart: null,
	isLoading: true,
	error: "",
}

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		updateCart: (state, action) => {
			state.cart = action.payload
			state.isLoading = false
		},
		clearCart: (state) => {
			state.cart = null
			state.isLoading = false
		},
	},
	extraReducers: (builder) => {
		// Get current cart
		builder.addCase(handleGetUserCart.fulfilled, (state, action) => {
			state.cart = action.payload.data
			state.isLoading = false
		})
		builder.addCase(handleGetUserCart.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(handleGetUserCart.rejected, (state, action) => {
			state.isLoading = false
			state.error = action.error.message || "Failed to fetch cart"
		})

		// Create new cart
		builder.addCase(handleCreateUserCart.fulfilled, (state, action) => {
			state.cart = action.payload.data
			state.isLoading = false
		})
		builder.addCase(handleCreateUserCart.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(handleCreateUserCart.rejected, (state, action) => {
			state.isLoading = false
			state.error = action.error.message || "Failed to create cart"
		})

		// Update cart
		builder.addCase(handleUpdateCart.fulfilled, (state, action) => {
			state.cart = action.payload.data
			state.isLoading = false
		})
		builder.addCase(handleUpdateCart.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(handleUpdateCart.rejected, (state, action) => {
			state.isLoading = false
			state.error = action.error.message || "Failed to update cart"
		})
		// Delete cart
		builder.addCase(handleDeleteCart.fulfilled, (state, action) => {
			state.cart = action.payload.data
			state.isLoading = false
		})
		builder.addCase(handleDeleteCart.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(handleDeleteCart.rejected, (state, action) => {
			state.isLoading = false
			state.error = action.error.message || "Failed to delete cart"
		})

		// Wipe cart
		builder.addCase(handleWipeCart.fulfilled, (state, action) => {
			state.cart = action.payload.data
			state.isLoading = false
		})
		builder.addCase(handleWipeCart.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(handleWipeCart.rejected, (state, action) => {
			state.isLoading = false
			state.error = action.error.message || "Failed to wipe cart"
		})
	},
})

export const { updateCart, clearCart } = cartSlice.actions

export const selectCart = (state: RootState) => state.cart.cart
export const selectCartLoading = (state: RootState) => state.cart.isLoading

export default cartSlice.reducer
