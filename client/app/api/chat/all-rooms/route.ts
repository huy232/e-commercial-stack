export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const queryString = searchParams.toString()

		const res = await fetch(
			`${API}/chat/all-rooms${queryString ? `?${queryString}` : ""}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					cookie: request.headers.get("cookie") || "",
				},
				credentials: "include",
				cache: "no-cache",
			}
		)

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch all chat rooms" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		console.error("Error fetching all chat rooms:", error)
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
