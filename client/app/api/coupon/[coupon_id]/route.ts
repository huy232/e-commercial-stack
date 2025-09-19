import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function GET(
	request: NextRequest,
	context: { params: { coupon_id: string } }
) {
	try {
		const { coupon_id } = context.params
		const res = await fetch(API + `/coupon/${coupon_id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
			cache: "no-cache",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch coupon" },
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

export async function DELETE(
	request: NextRequest,
	context: { params: { coupon_id: string } }
) {
	try {
		const { coupon_id } = context.params
		const res = await fetch(API + `/coupon/${coupon_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ message: "Failed to delete coupon" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
// PUT coupon
export async function PUT(
	request: NextRequest,
	context: { params: { coupon_id: string } }
) {
	try {
		const body = await request.json()
		const { coupon_id } = context.params

		const res = await fetch(`${API}/coupon/${coupon_id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(body),
		})

		if (!res.ok) {
			return NextResponse.json(
				{ message: "Failed to update coupon" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: res.status })
	} catch (error) {
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
