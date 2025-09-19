import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const response = await fetch(`${API}/user/logout`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-cache",
		})

		const data = await response.json()

		// 🔑 forward Set-Cookie headers back to browser
		const headers = new Headers()
		headers.set("Content-Type", "application/json")

		const setCookie = response.headers.get("set-cookie")
		if (setCookie) {
			headers.set("set-cookie", setCookie)
		}

		return new Response(JSON.stringify(data), {
			status: response.status,
			headers,
		})
	} catch (error) {
		console.error("Error while logging out:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while logging out",
			},
			{ status: 500 }
		)
	}
}
