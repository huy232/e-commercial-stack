import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function GET(req: NextRequest) {
	try {
		const backendRes = await fetch(`${API}/product/product-distribution`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				cookies: req.headers.get("cookie") || "",
			},
			cache: "no-cache",
		})
		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to fetch product distribution" },
			{ status: 500 }
		)
	}
}
