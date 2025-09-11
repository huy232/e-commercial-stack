import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

interface Params {
	params: { sessionId: string }
}

export async function GET(request: NextRequest, { params }: Params) {
	try {
		const { sessionId } = params

		const res = await fetch(`${API}/chat/${sessionId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch chat session" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		console.error("Error in chat session proxy:", error)
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
