"use client"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { API } from "@/constant"
import { useSelector } from "react-redux"
import { selectAuthUser } from "@/store/slices/authSlice"
import { Button } from "@/components"

const socketServerURL =
	process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

interface Props {
	sessionId: string
}

let socket: Socket

const AdminChatWindow = ({ sessionId }: Props) => {
	const user = useSelector(selectAuthUser)
	const [messages, setMessages] = useState<
		{ sender: string; message: string }[]
	>([])
	const [input, setInput] = useState("")
	const adminId = user._id || "admin-static-id"
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const sendMessage = async () => {
		if (!input.trim()) return

		try {
			await fetch(API + "/chat/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					roomId: sessionId,
					sender: adminId,
					message: input.trim(),
				}),
			})
			setInput("") // ✅ Only clear input, don’t update messages
		} catch (err) {
			console.error("Error sending message", err)
		}
	}

	useEffect(() => {
		if (!sessionId) return

		const loadMessages = async () => {
			try {
				const res = await fetch(`${API}/chat/messages/${sessionId}`, {
					credentials: "include",
				})
				const data = await res.json()
				setMessages(data.messages || [])
			} catch (err) {
				console.error("Failed to load messages", err)
			}
		}

		loadMessages()
	}, [sessionId])

	useEffect(() => {
		if (!sessionId) return

		socket = io(socketServerURL, {
			withCredentials: true,
		})

		socket.emit("joinRoom", sessionId)

		socket.on("newMessage", (msg) => {
			setMessages((prev) => [...prev, msg])
		})

		return () => {
			socket.disconnect()
		}
	}, [sessionId])

	return (
		<div className="flex flex-col h-[500px] border rounded-lg overflow-hidden">
			<div className="flex-1 p-2 overflow-y-auto bg-gray-50">
				{messages.map((msg, i) => (
					<div
						key={i}
						className={`mb-2 text-sm ${
							msg.sender === adminId
								? "text-right text-blue-700"
								: "text-left text-gray-700"
						}`}
					>
						<span className="inline-block bg-white px-3 py-1 rounded shadow">
							{msg.message}
						</span>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className="p-2 border-t flex gap-2">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					className="flex-1 border px-2 py-1 rounded"
					placeholder="Reply to client..."
				/>
				<Button
					className="bg-blue-600 text-white px-4 py-1 rounded"
					onClick={sendMessage}
					type="button"
					disabled={!input.trim()}
					aria-label="Send Message"
				>
					Send
				</Button>
			</div>
		</div>
	)
}

export default AdminChatWindow
