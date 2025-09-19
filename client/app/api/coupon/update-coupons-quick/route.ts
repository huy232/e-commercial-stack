import { NextResponse, NextRequest } from "next/server"
import { API, WEB_URL } from "@/constant"

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		const res = await fetch(WEB_URL + `/api/coupon/update-coupons-quick`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
			cache: "no-cache",
		})
		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to update coupons" },
				{ status: res.status }
			)
		}
		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
