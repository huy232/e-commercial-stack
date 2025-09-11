import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const res = await fetch(`${API}/chat/send`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to send message" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		console.error("Error in send message proxy:", error)
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
