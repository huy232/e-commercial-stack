"use client"

import { API } from "@/constant"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import { selectAuthUser } from "../../store/slices/authSlice"
import AdminChatWindow from "./AdminChatWindow"
import Pagination from "../Pagination"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu } from "react-icons/fi"

interface ChatRoom {
	_id: string
	clientId: string
	clientName: string
	isGuest: boolean
	adminId: string | null
	updatedAt: string
}

const SkeletonRoom = () => (
	<div className="p-2 mb-2 rounded bg-gray-300 animate-pulse h-14"></div>
)

const AdminChatRoomList = () => {
	const user = useSelector(selectAuthUser)
	const searchParams = useSearchParams()

	const [rooms, setRooms] = useState<ChatRoom[]>([])
	const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [sidebarOpen, setSidebarOpen] = useState(false) // mobile toggle

	// pagination state from URL
	const page = parseInt(searchParams.get("page") || "1")
	const limit = 10
	const [totalPages, setTotalPages] = useState(1)

	// fetch rooms
	const fetchAllRooms = async (page = 1, limit = 10) => {
		setLoading(true)
		try {
			const res = await fetch(
				`/api/chat/all-rooms?page=${page}&limit=${limit}`,
				{ credentials: "include" }
			)
			if (!res.ok) throw new Error("Failed to fetch rooms")
			const data = await res.json()
			setRooms(data.rooms)
			setTotalPages(data.totalPages)
		} catch (err) {
			console.error("Error loading all chat rooms:", err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAllRooms(page, limit)
	}, [page])

	// join room
	const handleJoinRoom = async (room: ChatRoom) => {
		if (!user?._id) return
		if (room.adminId && room.adminId !== user._id) {
			alert("Another admin is already handling this chat.")
			return
		}
		if (!room.adminId) {
			try {
				const res = await fetch(`/api/chat/rooms/${room._id}/assign-admin`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ adminId: user._id }),
				})
				if (!res.ok) throw new Error("Failed to claim room")
			} catch (err) {
				console.error("Error assigning admin:", err)
				return
			}
		}
		setActiveRoomId(room._id)
		setSidebarOpen(false)
	}

	return (
		<div className="flex">
			{/* Mobile Menu Toggle */}
			<div className="absolute top-4 left-4 lg:hidden z-50">
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="p-2 rounded bg-gray-200 hover:bg-gray-400"
				>
					<FiMenu size={20} />
				</button>
			</div>

			{/* Sidebar */}
			<AnimatePresence>
				{(sidebarOpen ||
					(typeof window !== "undefined" && window.innerWidth >= 1024)) && (
					<motion.div
						initial={{ x: -300, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -300, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="w-72 border-r bg-white p-4 overflow-y-auto fixed lg:static inset-y-0 left-0 z-40 lg:z-auto"
					>
						<h2 className="font-bold text-lg mb-2">Chat Rooms</h2>
						{loading ? (
							<div className="space-y-2">
								{Array.from({ length: 6 }).map((_, i) => (
									<SkeletonRoom key={i} />
								))}
							</div>
						) : (
							Object.entries(
								rooms.reduce((groups, room) => {
									const dateKey = new Date(room.updatedAt).toLocaleDateString(
										"en-GB"
									) // dd/mm/yyyy

									if (!groups[dateKey]) groups[dateKey] = []
									groups[dateKey].push(room)
									return groups
								}, {} as Record<string, ChatRoom[]>)
							).map(([date, groupedRooms]) => (
								<div key={date} className="mb-2">
									{/* Date divider */}
									<div className="text-center text-xs text-gray-400 my-2 relative">
										<span className="bg-white px-2">{date}</span>
										<div className="absolute left-0 right-0 top-1/2 border-t border-gray-300 -z-10" />
									</div>

									{/* Rooms for that date */}
									{groupedRooms.map((room) => {
										const claimedByOther =
											room.adminId && room.adminId !== user._id
										return (
											<div
												key={room._id}
												onClick={() => !claimedByOther && handleJoinRoom(room)}
												className={`p-2 cursor-pointer rounded mb-1 transition-colors ${
													activeRoomId === room._id
														? "bg-blue-500 text-white font-semibold"
														: claimedByOther
														? "text-gray-400 cursor-not-allowed"
														: "hover:bg-gray-200"
												}`}
											>
												<div className="flex justify-between items-center">
													<div className="flex flex-col">
														<span className="font-medium">
															{room.clientName} {room.isGuest ? "(Guest)" : ""}
														</span>
														<span className="text-xs text-gray-500">
															{new Date(room.updatedAt).toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}
														</span>
													</div>
													{claimedByOther && (
														<span className="text-xs text-red-500">Taken</span>
													)}
												</div>
											</div>
										)
									})}
								</div>
							))
						)}
						<div className="mt-auto mb-0">
							<Pagination totalPages={totalPages} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Chat Window */}
			<div className="flex-1 p-4 lg:ml-0 ml-0 lg:relative">
				{activeRoomId ? (
					<AdminChatWindow sessionId={activeRoomId} />
				) : (
					<p className="text-gray-500 text-center mt-10">
						Select a room to join the chat
					</p>
				)}
			</div>
		</div>
	)
}

export default AdminChatRoomList
