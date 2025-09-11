import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const res = await fetch(`${API}/chat/start`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			body: JSON.stringify(body),
		})

		if (!res.ok) {
			const errorText = await res.text()
			return NextResponse.json(
				{ success: false, message: `Failed to start chat: ${errorText}` },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		console.error("Error starting chat:", error)
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
