"use client"

import { API } from "@/constant"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectAuthUser } from "../../store/slices/authSlice"
import AdminChatWindow from "./AdminChatWindow"

interface ChatRoom {
	_id: string
	clientId: string
	clientName: string
	isGuest: boolean
	adminId: string | null
	updatedAt: string
}

const AdminChatRoomList = () => {
	const user = useSelector(selectAuthUser)
	const [rooms, setRooms] = useState<ChatRoom[]>([])
	const [activeRoomId, setActiveRoomId] = useState<string | null>(null)

	// Fetch rooms
	useEffect(() => {
		const fetchRooms = async () => {
			try {
				const res = await fetch(`${API}/chat/rooms`, {
					credentials: "include",
				})
				const data = await res.json()
				setRooms(data || [])
			} catch (err) {
				console.error("Failed to fetch rooms", err)
			}
		}

		fetchRooms()
	}, [])

	// Claim room if not already assigned
	const handleJoinRoom = async (room: ChatRoom) => {
		if (!user?._id) return

		if (room.adminId && room.adminId !== user._id) {
			alert("Another admin is already handling this chat.")
			return
		}

		if (!room.adminId) {
			try {
				const res = await fetch(`${API}/chat/rooms/${room._id}/assign-admin`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ adminId: user._id }),
				})
				if (!res.ok) throw new Error("Failed to claim room")
			} catch (err) {
				console.error("Error assigning admin to room:", err)
				return
			}
		}

		setActiveRoomId(room._id)
	}

	return (
		<div className="flex gap-4">
			{/* Room list */}
			<div className="w-60 border-r p-4 h-screen overflow-y-auto">
				<h2 className="font-bold text-lg mb-2">Active Rooms</h2>
				{rooms.map((room) => {
					const claimedByOther = room.adminId && room.adminId !== user._id
					return (
						<div
							key={room._id}
							onClick={() => !claimedByOther && handleJoinRoom(room)}
							className={`p-2 cursor-pointer rounded ${
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
										{new Date(room.updatedAt).toLocaleString()}
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

			{/* Chat Window Placeholder */}
			<div className="flex-1 p-4">
				{activeRoomId ? (
					<AdminChatWindow sessionId={activeRoomId} />
				) : (
					<p>Select a room to join the chat</p>
				)}
			</div>
		</div>
	)
}

export default AdminChatRoomList
