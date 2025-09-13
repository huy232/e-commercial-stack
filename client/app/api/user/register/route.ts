import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const response = await fetch(`${API}/user/register`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			body: JSON.stringify(body),
		})

		const data = await response.json()

		return new Response(JSON.stringify(data), {
			status: response.status,
		})
	} catch (error) {
		console.error("Error while registering user:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while registering",
			},
			{ status: 500 }
		)
	}
}
