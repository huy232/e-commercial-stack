import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function GET(request: NextRequest) {
	try {
		const query = request.nextUrl.searchParams.get("orderId")
		const res = await fetch(`${API}/order/specific-order?orderId=${query}`, {
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
				{ success: false, message: "Failed to fetch specific order" },
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
