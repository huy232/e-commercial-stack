import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function PUT(
	req: NextRequest,
	{ params }: { params: { roomId: string } }
) {
	try {
		const { roomId } = params
		const body = await req.json()

		const res = await fetch(`${API}/chat/rooms/${roomId}/assign-admin`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
			cache: "no-cache",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to assign admin" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		console.error("Error in assign-admin proxy:", error)
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
