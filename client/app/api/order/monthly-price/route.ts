import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function GET(request: NextRequest) {
	try {
		const params = request.nextUrl.searchParams
		const res = await fetch(
			`${API}/order/monthly-price${params ? `?${params.toString()}` : ""}`,
			{
				method: "GET",
				credentials: "include",
				cache: "no-cache",
				headers: {
					"Content-Type": "application/json",
					cookie: request.headers.get("cookie") || "",
				},
			}
		)
		if (!res.ok) {
			return NextResponse.json(
				{ message: "Failed to fetch monthly orders price" },
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
