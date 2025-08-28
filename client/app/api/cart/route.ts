import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const response = await fetch(API + `/cart/`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-cache",
		})

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`)
		}

		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error while fetching cart:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while fetching cart due to server",
			},
			{ status: 500 }
		)
	}
}
