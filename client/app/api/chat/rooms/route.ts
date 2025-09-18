export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function GET(request: NextRequest) {
	try {
		const res = await fetch(`${API}/chat/rooms`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch chat rooms" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		console.error("Error in chat rooms proxy:", error)
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
