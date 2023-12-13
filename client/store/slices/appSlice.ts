import { createSlice } from "@reduxjs/toolkit"
import * as actions from "../actions/asyncAction"

export const appSlice = createSlice({
	name: "app",
	initialState: {
		categories: null,
		isLoading: false,
		errorMessage: "",
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(actions.getCategoriesAction.fulfilled, (state, action) => {
			state.isLoading = false
			state.categories = action.payload
		})
		builder.addCase(actions.getCategoriesAction.rejected, (state, action) => {
			state.isLoading = false
			state.errorMessage = "Error while get categories"
		})
	},
})

export const {} = appSlice.actions

export default appSlice.reducer
