import { useState, useRef, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchNotifications, markAllNotificationsAsRead } from "@/store/actions"
import {
	AppDispatch,
	NotifyProps,
	NotifyPropsWithProduct,
	ProfileUser,
} from "@/types"
import { selectIsAuthenticated } from "@/store/slices/authSlice"
import { BiSolidBell, BiSolidBellRing } from "@/assets/icons"
import { Button } from "@/components"
import clsx from "clsx"
import Link from "next/link"
import moment from "moment"

interface UserProps {
	user: ProfileUser
	notifications: NotifyPropsWithProduct
}

const Notification = ({ user, notifications }: UserProps) => {
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

	const dropdownRef = useRef<HTMLDivElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)

	const dispatch = useDispatch<AppDispatch>()
	const isUserAuthenticated = useSelector(selectIsAuthenticated)

	const notificationAvailable =
		notifications?.notifications?.length > 0 && isUserAuthenticated

	const handleFilterChange = useCallback(
		(newFilter: "all" | "unread" | "read") => {
			setFilter(newFilter)
			setPage(1) // Reset pagination when changing filters
			dispatch(fetchNotifications({ page: 1, type: newFilter }))
		},
		[dispatch]
	)

	const handleScroll = useCallback(async () => {
		if (!scrollRef.current || loading || !notifications.hasNextPage) return

		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current

		if (scrollTop + clientHeight >= scrollHeight * 0.8) {
			setLoading(true)
			await dispatch(fetchNotifications({ page: page + 1, type: filter }))
			setPage((prev) => prev + 1)
			setLoading(false)
		}
	}, [dispatch, loading, notifications.hasNextPage, page, filter])

	// Toggle dropdown on bell click
	const toggleDropdown = () => setIsOpen((prev) => !prev)

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false)
		}
	}, [])

	// Close dropdown if clicking outside
	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside)
		} else {
			document.removeEventListener("mousedown", handleClickOutside)
		}

		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [handleClickOutside, isOpen])

	useEffect(() => {
		if (!isOpen) return // Don't add listener if dropdown isn't open

		if (!scrollRef.current) {
			console.log("scrollRef is NULL - dropdown might not be open yet")
			return
		}

		const scrollContainer = scrollRef.current
		scrollContainer.addEventListener("scroll", handleScroll)

		return () => scrollContainer.removeEventListener("scroll", handleScroll)
	}, [handleScroll, isOpen])

	// Handle marking all notifications as read
	const markAllAsRead = async () => {
		await dispatch(markAllNotificationsAsRead()) // Dispatch action to mark all as read
	}

	return (
		notificationAvailable && (
			<div className="relative group cursor-pointer w-fit" ref={dropdownRef}>
				<div
					className="relative group-hover:opacity-80 group-hover:brightness-110 duration-300 ease-in-out w-full"
					onClick={toggleDropdown}
				>
					{isOpen ? <BiSolidBell size={24} /> : <BiSolidBellRing size={24} />}
				</div>
				{notifications.unreadCount > 0 && (
					<div className="select-none absolute -bottom-1 -left-1 bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center shadow-sm pointer-events-none">
						<span className="text-[8px] pointer-events-auto">
							{notifications.unreadCount > 99
								? "99+"
								: notifications.unreadCount}
						</span>
					</div>
				)}
				{isOpen && (
					<div
						className={clsx(
							"absolute z-10 min-w-[280px] duration-300 transition-all bg-white shadow-heavy border-b border-black/60 rounded-lg flex flex-col",
							"top-[42px] right-[-60px] md:-right-2"
						)}
					>
						<div className="p-2 border-b border-gray-300 flex justify-end items-center text-xs gap-2">
							<Button
								className={clsx(
									filter === "all" ? "text-blue-600 font-bold" : "text-gray-600"
								)}
								onClick={() => handleFilterChange("all")}
								aria-label="Show All Notifications"
								role="button"
								tabIndex={0}
								data-testid="show-all-notifications-button"
								id="show-all-notifications-button"
							>
								All
							</Button>
							<Button
								className={clsx(
									filter === "unread"
										? "text-blue-600 font-bold"
										: "text-gray-600"
								)}
								onClick={() => handleFilterChange("unread")}
								aria-label="Show Unread Notifications"
								role="button"
								tabIndex={0}
								data-testid="show-unread-notifications-button"
								id="show-unread-notifications-button"
							>
								Unread
							</Button>
							<Button
								className={clsx(
									filter === "read"
										? "text-blue-600 font-bold"
										: "text-gray-600"
								)}
								onClick={() => handleFilterChange("read")}
								aria-label="Show Read Notifications"
								role="button"
								tabIndex={0}
								data-testid="show-read-notifications-button"
								id="show-read-notifications-button"
							>
								Read
							</Button>
						</div>
						<div ref={scrollRef} className="max-h-[300px] overflow-y-scroll">
							{notifications.notifications.length > 0 ? (
								<ul className="space-y-1 p-1">
									{notifications.notifications.map((notification, index) => {
										const isExpired = moment().isAfter(
											notification.product_id.discount.expirationDate
										)

										return (
											<li
												key={index}
												className={clsx(
													"p-2 border-b border-gray-500/50 last:border-none rounded-md",
													isExpired
														? "bg-gray-200 text-gray-500"
														: "bg-white text-green-500"
												)}
											>
												<Link
													href={`/products/${notification.product_id.slug}`}
													className="block"
												>
													<span className="text-sm">
														{notification.message}
													</span>
													<br />
													<span className="text-xs font-medium text-gray-600">
														<span className="mr-1">Expires:</span>
														{moment(
															notification.product_id.discount.expirationDate
														).format("MMM DD, YYYY - hh:mm A")}
													</span>
												</Link>
											</li>
										)
									})}
								</ul>
							) : (
								<p className="text-center text-sm text-gray-500 p-3">
									No new notifications
								</p>
							)}
							{loading && (
								<div className="text-center text-sm text-gray-500 p-2">
									Loading more...
								</div>
							)}
						</div>
						{notifications.notifications.length > 0 && (
							<div className="p-2 border-t border-gray-300 bg-white sticky bottom-0">
								<Button
									onClick={markAllAsRead}
									className="w-full text-sm font-medium text-blue-600 hover:text-blue-800 transition-all hover:bg-black/30 hover:bg-opacity-50 duration-300 ease-in-out py-1 rounded-md"
									aria-label="Mark all notifications as read"
									role="button"
									tabIndex={0}
									data-testid="mark-all-as-read-button"
									id="mark-all-as-read-button"
								>
									Mark all as read
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
		)
	)
	// }
}

export default Notification
