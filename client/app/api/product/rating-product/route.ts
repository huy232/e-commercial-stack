import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json()

		const backendRes = await fetch(`${API}/product/rating-product`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
			cache: "no-cache",
		})

		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to submit product rating" },
			{ status: 500 }
		)
	}
}
