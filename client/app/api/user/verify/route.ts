import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { token } = body
		const url = new URL(`${API}/user/complete-registration`)
		url.searchParams.append("token", token)

		const response = await fetch(url.toString(), {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error verify user:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error verify user",
			},
			{ status: 500 }
		)
	}
}
