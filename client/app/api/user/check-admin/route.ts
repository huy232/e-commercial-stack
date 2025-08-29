import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const response = await fetch(API + `/user/check-admin`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
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
		console.error("Error checking is admin:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while check is admin due to server",
			},
			{ status: 500 }
		)
	}
}
