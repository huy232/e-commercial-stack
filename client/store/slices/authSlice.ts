import { RootState, User } from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export interface AuthState {
	isAuthenticated: boolean
	user: User | null
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
}

export const checkAuthentication = createAsyncThunk<boolean, void>(
	"auth/checkAuthentication",
	async () => {
		try {
			const response = await fetch("/api/check-auth", {
				method: "GET",
				credentials: "include",
			})

			const data = await response.json()
			return data.success
		} catch (error) {
			console.error("Error checking authentication:", error)
			return false
		}
	}
)

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
		builder.addCase(checkAuthentication.fulfilled, (state, action) => {
			state.isAuthenticated = action.payload
		})
	},
})

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
	state.auth.isAuthenticated

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
