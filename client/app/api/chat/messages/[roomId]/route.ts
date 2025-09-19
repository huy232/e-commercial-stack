import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

type Params = {
	params: { roomId: string }
}

export async function GET(req: NextRequest, { params }: Params) {
	try {
		const { roomId } = params

		const res = await fetch(`${API}/chat/messages/${roomId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			credentials: "include",
			cache: "no-cache",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch messages" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		console.error("Error fetching chat messages:", error)
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
