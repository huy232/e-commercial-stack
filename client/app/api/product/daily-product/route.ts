import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	try {
		const backendRes = await fetch(`${API}/product/daily-product`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			cache: "no-cache",
		})
		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to fetch daily deal products" },
			{ status: 500 }
		)
	}
}
