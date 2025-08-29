import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const page = searchParams.get("page") || "1"
		const limit = searchParams.get("limit") || "6"

		const res = await fetch(`${API}/order?page=${page}&limit=${limit}`, {
			method: "GET",
			credentials: "include",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})

		if (!res.ok) {
			return NextResponse.json(
				{ message: "Failed to fetch user orders" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ message: (error as Error).message || "Internal Server Error" },
			{ status: 500 }
		)
	}
}
