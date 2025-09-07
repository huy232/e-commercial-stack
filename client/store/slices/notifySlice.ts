import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import {
	fetchNotifications,
	markAllNotificationsAsRead,
} from "../actions/notifyAction"
import { NotifyProps, RootState } from "@/types"

interface NotificationsState extends NotifyProps {
	loading: boolean
}

const initialState: NotificationsState = {
	_id: "",
	user_id: "",
	createdAt: new Date(),
	notifications: [],
	unreadCount: 0,
	hasNextPage: false,
	hasPrevPage: false,
	totalPages: 0,
	loading: false,
	currentPage: 1,
}

const notificationsSlice = createSlice({
	name: "notify",
	initialState,
	reducers: {
		notificationLogout(state) {
			state.notifications = []
			state.totalPages = 1
			state.hasNextPage = false
			state.hasPrevPage = false
			state.unreadCount = 0
			state.loading = false
		},
		addNewNotification(
			state,
			action: PayloadAction<NotifyProps["notifications"][number]>
		) {
			// Push new notification at the start (from socket event)
			state.notifications.unshift(action.payload)
			state.unreadCount += 1
		},
		setNotifications(state, action: PayloadAction<NotifyProps>) {
			return { ...state, ...action.payload, loading: false }
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchNotifications.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchNotifications.fulfilled, (state, action) => {
				if (action.payload.status === "fail" || !action.payload.data) {
					state.loading = false
					return
				}

				const {
					notifications = [],
					currentPage = 1,
					totalPages = 1,
					unreadCount = 0,
				} = action.payload.data

				if (currentPage === 1) {
					state.notifications = notifications
				} else {
					state.notifications.push(...notifications)
				}

				state.currentPage = currentPage
				state.hasNextPage = currentPage < totalPages
				state.unreadCount = unreadCount
				state.loading = false
			})
			.addCase(fetchNotifications.rejected, (state) => {
				state.loading = false
			})

		builder
			.addCase(markAllNotificationsAsRead.pending, (state) => {
				state.loading = true
			})
			.addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
				state.notifications = action.payload?.data || []
				state.loading = false
			})
			.addCase(markAllNotificationsAsRead.rejected, (state) => {
				state.loading = false
			})
	},
})

export const selectNotifyState = (state: RootState) => state.notify
export const selectNotifications = (state: RootState) =>
	state.notify.notifications
export const { notificationLogout, addNewNotification, setNotifications } =
	notificationsSlice.actions
export default notificationsSlice.reducer
