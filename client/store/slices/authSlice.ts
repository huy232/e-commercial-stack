import { RootState, User } from "@/types"
import { createSlice } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"

export interface AuthState {
	isAuthenticated: boolean
	user: User | null
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.isAuthenticated = true
			state.user = action.payload
		},
		logout: (state) => {
			state.isAuthenticated = false
			state.user = null
		},
	},
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action) => {
			if ("auth" in action) {
				return {
					...(action as { auth: AuthState }).auth,
				}
			}
			return state
		})
	},
})

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
	state.auth.isAuthenticated

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
