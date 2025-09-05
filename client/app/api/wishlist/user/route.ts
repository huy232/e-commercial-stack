import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const query = request.nextUrl.searchParams
		const res = await fetch(API + `/wishlist/user${query ? `?${query}` : ""}`, {
			method: "GET",
			credentials: "include",
			cache: "no-store",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch user wishlist" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: (error as Error).message || "Internal Server Error",
			},
			{ status: 500 }
		)
	}
}
