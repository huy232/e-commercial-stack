import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
	try {
		const response = await fetch(`${API}/notification/mark-all-as-read`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})

		const data = await response.json()
		return NextResponse.json(data, { status: response.status })
	} catch (error) {
		console.error("Error marking notifications as read:", error)
		return NextResponse.json(
			{ success: false, message: "Error marking notifications as read" },
			{ status: 500 }
		)
	}
}
