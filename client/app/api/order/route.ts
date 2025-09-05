import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const query = request.nextUrl.searchParams

		const res = await fetch(`${API}/order${query ? `?${query}` : ""}`, {
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
				{ success: false, message: "Failed to fetch user orders" },
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

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const res = await fetch(`${API}/order`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})
		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to create order" },
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
