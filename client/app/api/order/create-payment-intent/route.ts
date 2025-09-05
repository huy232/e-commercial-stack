import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const res = await fetch(`${API}/order/create-payment-intent`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})
		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to create payment intent" },
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
