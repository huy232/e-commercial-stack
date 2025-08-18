import { showToast } from "@/components"
import { API } from "@/constant"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchNotifications = createAsyncThunk(
	"notify/fetchNotifications",
	async (
		{ page, type }: { page: number; type?: string },
		{ rejectWithValue }
	) => {
		try {
			const url = type
				? `${API}/notification?page=${page}&type=${type}`
				: `${API}/notification?page=${page}`

			const response = await fetch(url, {
				credentials: "include",
			})

			const data = await response.json()
			return data
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const markAllNotificationsAsRead = createAsyncThunk(
	"notify/markAllAsRead",
	async () => {
		try {
			const response = await fetch(API + `/notification/mark-all-as-read`, {
				method: "PUT",
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
