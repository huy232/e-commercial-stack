import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { email } = body
		const response = await fetch(`${API}/user/forgot-password`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			body: JSON.stringify({ email }),
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
		console.error("Error forgotting password:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error forgotting password",
			},
			{ status: 500 }
		)
	}
}
