"use client"

import { selectAuthUser } from "@/store/slices/authSlice"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { io, Socket } from "socket.io-client"
import { Button } from "@/components"
import { formatDate, formatHourMinute } from "@/utils"

const socketServerURL =
	process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

let socket: Socket

const ChatBox = () => {
	const user = useSelector(selectAuthUser)
	const [loading, setLoading] = useState(false)
	const [chatStarted, setChatStarted] = useState(false)
	const [isMinimized, setIsMinimized] = useState(false)
	const [isInitialMinimized, setIsInitialMinimized] = useState(true)

	const [unreadCount, setUnreadCount] = useState(0)

	const [chatSessionId, setChatSessionId] = useState<string | null>(null)
	const [currentSender, setCurrentSender] = useState<string | null>(null)
	const [messages, setMessages] = useState<
		{ sender: string; message: string; createdAt: string }[]
	>([])
	const [inputMessage, setInputMessage] = useState("")
	const [guestNameInput, setGuestNameInput] = useState(
		user ? user.firstName + user.lastName : ""
	)

	const messagesEndRef = useRef<HTMLDivElement>(null)

	const generateGuestId = () => {
		let id = sessionStorage.getItem("guestId")
		if (!id) {
			id = `guest-${Date.now()}`
			sessionStorage.setItem("guestId", id)
		}
		return id
	}

	const generateGuestName = () => {
		let name = sessionStorage.getItem("guestName")
		if (!name) {
			const randomNum = Math.floor(100000 + Math.random() * 900000)
			name = `Guest-${randomNum}`
			sessionStorage.setItem("guestName", name)
		}
		return name
	}

	const initSocket = useCallback(
		(sessionId: string, clientId: string) => {
			socket = io(socketServerURL)

			socket.on("connect", () => {
				socket.emit("joinRoom", sessionId)
			})

			socket.on("newMessage", (msg) => {
				setMessages((prev) => {
					const alreadyExists = prev.some(
						(m) => m.message === msg.message && m.sender === msg.sender
					)
					if (alreadyExists) return prev
					return [...prev, msg]
				})

				if (msg.sender !== clientId && isMinimized) {
					setUnreadCount((prev) => prev + 1)
				}
			})
		},
		[isMinimized]
	)

	useEffect(() => {
		if (typeof window === "undefined") return

		const existingSessionId = sessionStorage.getItem("chatSessionId")
		const existingGuestId = sessionStorage.getItem("guestId")
		const clientId = user?.id || existingGuestId || generateGuestId()

		setCurrentSender(clientId)

		if (existingSessionId) {
			setChatStarted(true)
			setChatSessionId(existingSessionId)

			fetchMessages(existingSessionId)

			initSocket(existingSessionId, clientId)
		}
	}, [initSocket, user?.id])

	const startChat = async () => {
		const clientId = user?.id || generateGuestId()
		const clientName =
			user?.username || guestNameInput.trim() || generateGuestName() // Fallback to Guest-UUID

		if (!user && guestNameInput.trim()) {
			sessionStorage.setItem("guestName", guestNameInput.trim())
		}

		try {
			setLoading(true)
			const res = await fetch("/api/chat/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					adminId: user._id,
					clientId,
					clientName,
					isGuest: !user,
					isAdminGuest: false,
				}),
			})

			if (!res.ok) {
				const errorText = await res.text()
				throw new Error(`HTTP ${res.status}: ${errorText}`)
			}

			const data = await res.json()
			const sessionId = data?._id
			if (!sessionId) throw new Error("No session ID returned")

			sessionStorage.setItem("chatSessionId", sessionId)
			setCurrentSender(clientId)
			setChatSessionId(sessionId)
			setChatStarted(true)
			initSocket(sessionId, clientId)
		} catch (err) {
			console.error("Error starting chat:", err)
		} finally {
			setLoading(false)
		}
	}

	const fetchMessages = async (sessionId: string) => {
		setLoading(true)
		try {
			const res = await fetch(`/api/chat/${sessionId}`)
			if (!res.ok) {
				throw new Error("Failed to fetch messages")
			}
			const data = await res.json()
			setMessages(data?.messages || [])
		} catch (error) {
			console.error("Error fetching chat messages:", error)
		} finally {
			setLoading(false)
		}
	}

	const sendMessage = async () => {
		if (!inputMessage.trim() || !chatSessionId) return

		const messageObj = {
			roomId: chatSessionId,
			sender: currentSender || generateGuestId(),
			message: inputMessage.trim(),
			senderName: guestNameInput || generateGuestName(),
		}

		try {
			setLoading(true)
			if (!chatSessionId) {
				console.error("❌ No chatSessionId available")
				return
			}

			if (!socket) {
				console.error("❌ Socket not initialized")
				return
			}
			socket?.emit("sendMessage", messageObj)
			setInputMessage("")
		} catch (err) {
			console.error("Error sending message:", err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (!isMinimized) {
			setUnreadCount(0)
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
		}
	}, [messages, isMinimized])

	const handleToggleMinimize = useCallback(() => {
		setIsMinimized((prev) => !prev)
		if (isMinimized) {
			// Opening the chat, clear unread
			setUnreadCount(0)
		}
	}, [isMinimized])

	const groupedMessages = messages.reduce((groups, msg) => {
		const dateKey = formatDate(msg.createdAt)
		if (!groups[dateKey]) groups[dateKey] = []
		groups[dateKey].push(msg)
		return groups
	}, {} as Record<string, typeof messages>)

	// ========== UI ===========

	if (!chatStarted) {
		if (isInitialMinimized) {
			return (
				<Button
					onClick={() => setIsInitialMinimized(false)}
					className="bg-blue-600 text-white px-3 py-2 rounded-full shadow-md text-sm sm:text-base"
					type="button"
				>
					Need help?
				</Button>
			)
		}

		return (
			<div className="bg-gray-300 p-2 md:p-4 rounded shadow-heavy w-full md:w-60">
				<div className="flex justify-between items-center mb-2">
					<p className="font-medium">Need help?</p>
					<Button
						onClick={() => setIsInitialMinimized(true)}
						className="text-sm text-gray-500"
						type="button"
					>
						×
					</Button>
				</div>
				<input
					className="w-full border px-2 py-1 rounded mb-2"
					type="text"
					placeholder="What should we call you? (optional)"
					value={guestNameInput}
					onChange={(e) => setGuestNameInput(e.target.value)}
				/>
				<Button
					onClick={startChat}
					className="bg-blue-600 text-white w-full px-4 py-2 rounded"
					type="button"
					loading={loading}
					disabled={loading}
				>
					Start Chat
				</Button>
			</div>
		)
	}

	return (
		<div className="w-[280px] md:w-80 bg-gray-300 shadow-heavy rounded-lg overflow-hidden">
			<div className="bg-blue-600 text-white p-2 flex justify-between items-center">
				<span className="text-sm">Chat with Admin</span>
				<Button
					onClick={handleToggleMinimize}
					className="text-sm"
					type="button"
				>
					{isMinimized ? "Open" : "Minimize"}
				</Button>
			</div>

			{/* Notification badge */}
			{isMinimized && unreadCount > 0 && (
				<div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
					{unreadCount}
				</div>
			)}

			{!isMinimized && (
				<>
					<div className="flex-1 p-2 h-64 sm:h-80 max-h-[60vh] overflow-y-auto bg-gray-50">
						{loading ? (
							/* Skeleton loader */
							<div className="space-y-2">
								<div className="h-4 w-2/3 bg-gray-500 rounded animate-pulse" />
								<div className="h-4 w-1/2 bg-gray-500 rounded animate-pulse" />
								<div className="h-4 w-3/4 bg-gray-500 rounded animate-pulse" />
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

									{msgs.map((msg, idx) => (
										<div
											key={idx}
											className={`mb-2 text-sm ${
												msg.sender === currentSender
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
					<div className="p-1 md:p-2 border-t flex gap-1 md:gap-2">
						<input
							className="w-[200px] md:w-fit flex-1 border px-2 py-1 rounded"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && sendMessage()}
							placeholder="Type a message..."
							disabled={loading}
						/>
						<Button
							className="w-fit bg-blue-600 text-white text-xs md:text-base px-1 md:px-2 rounded"
							onClick={sendMessage}
							type="button"
							disabled={loading || !inputMessage.trim()}
							loading={loading}
						>
							Send
						</Button>
					</div>
				</>
			)}
		</div>
	)
}

export default ChatBox
