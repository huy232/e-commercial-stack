import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const response = await fetch(API + `/user/check-auth`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})

		const data = await response.json()
		return NextResponse.json(data, { status: response.status })
	} catch (error) {
		console.error("Error checking authentication:", error)
		return NextResponse.json(
			{ success: false, message: "Error while check auth due to server" },
			{ status: 500 }
		)
	}
}
