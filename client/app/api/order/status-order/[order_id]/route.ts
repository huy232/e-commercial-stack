import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function PUT(
	request: NextRequest,
	{ params }: { params: { order_id: string } }
) {
	try {
		const body = await request.json()
		const res = await fetch(`${API}/order/status-order/${params.order_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})
		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to update order status" },
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
