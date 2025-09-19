"use client"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { API } from "@/constant"
import { useSelector } from "react-redux"
import { selectAuthUser } from "@/store/slices/authSlice"
import { Button } from "@/components"
import { formatDate, formatHourMinute } from "@/utils"

const socketServerURL =
	process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

interface Props {
	roomId: string
}

let socket: Socket

const MessageSkeleton = () => (
	<div className="mb-2 flex">
		<div className="bg-gray-500 rounded-lg w-32 h-6 animate-pulse" />
	</div>
)

const AdminChatWindow = ({ roomId }: Props) => {
	const user = useSelector(selectAuthUser)
	const [messages, setMessages] = useState<
		{ sender: string; message: string; createdAt: string }[]
	>([])
	const [input, setInput] = useState("")
	const [loading, setLoading] = useState(true)
	const adminId = user._id || "admin-static-id"
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const sendMessage = async () => {
		if (!input.trim()) return

		try {
			await fetch(`/api/chat/send`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					roomId: roomId,
					sender: adminId,
					message: input.trim(),
				}),
			})
			setInput("")
		} catch (err) {
			console.error("Error sending message", err)
		}
	}

	useEffect(() => {
		if (!roomId) return

		const loadMessages = async () => {
			try {
				const res = await fetch(`/api/chat/messages/${roomId}`, {
					credentials: "include",
				})
				const data = await res.json()
				setMessages(data.messages || [])
			} catch (err) {
				console.error("Failed to load messages", err)
			} finally {
				setLoading(false)
			}
		}

		loadMessages()
	}, [roomId])

	useEffect(() => {
		if (!roomId) return

		socket = io(socketServerURL, {
			withCredentials: true,
		})

		socket.emit("joinRoom", roomId)

		socket.on("newMessage", (msg) => {
			setMessages((prev) => [...prev, msg])
		})

		return () => {
			socket.disconnect()
		}
	}, [roomId])

	const groupedMessages = messages.reduce((groups, msg) => {
		const dateKey = formatDate(msg.createdAt)
		if (!groups[dateKey]) groups[dateKey] = []
		groups[dateKey].push(msg)
		return groups
	}, {} as Record<string, typeof messages>)

	return (
		<div className="flex flex-col border rounded-lg overflow-hidden">
			<div className="p-2 overflow-y-auto bg-gray-50 h-[500px]">
				{loading ? (
					<div>
						{Array.from({ length: 6 }).map((_, i) => (
							<MessageSkeleton key={i} />
						))}
					</div>
				) : (
					Object.entries(groupedMessages).map(([date, msgs]) => (
						<div key={date}>
							{/* Date divider */}
							<div className="flex justify-center my-3">
								<span className="text-xs bg-gray-300 text-gray-600 px-3 py-1 rounded-full">
									{date}
								</span>
							</div>

							{/* Messages */}
							{msgs.map((msg, i) => (
								<div
									key={i}
									className={`mb-2 text-sm ${
										msg.sender === adminId
											? "text-right text-blue-700"
											: "text-left text-gray-700"
									}`}
								>
									<div className="inline-block bg-white px-3 py-1 rounded shadow">
										{msg.message}
									</div>
									<div className="text-[10px] text-gray-400 mt-1">
										{formatHourMinute(msg.createdAt)}
									</div>
								</div>
							))}
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>
			<div className="p-2 border-t flex gap-2">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					className="flex-1 border px-2 py-1 rounded"
					placeholder="Reply to client..."
					disabled={loading}
					autoFocus
				/>
				<Button
					className="bg-blue-600 text-white px-4 py-1 rounded"
					onClick={sendMessage}
					type="button"
					disabled={!input.trim() || loading}
					aria-label="Send Message"
					loading={loading}
				>
					Send
				</Button>
			</div>
		</div>
	)
}

export default AdminChatWindow
