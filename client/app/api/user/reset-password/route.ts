import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		const { password, token } = body
		const response = await fetch(API + `/user/reset-password`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			body: JSON.stringify({ password, token }),
			cache: "no-cache",
		})
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})
	} catch (error) {
		console.error("Error while resetting password:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while resetting password",
			},
			{ status: 500 }
		)
	}
}
