import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const query = request.nextUrl.searchParams
		const response = await fetch(
			`${API}/user/get-all-users${query ? `?${query}` : ""}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					cookie: request.headers.get("cookie") || "",
				},
			}
		)

		const data = await response.json()
		return NextResponse.json(data, { status: response.status })
	} catch (error) {
		console.error("Error fetching users:", error)
		return NextResponse.json(
			{ success: false, message: "Error fetching users" },
			{ status: 500 }
		)
	}
}
