import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function GET(request: NextRequest) {
	try {
		const query = request.nextUrl.searchParams

		const res = await fetch(API + `/coupon${query ? `?${query}` : ""}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch coupons" },
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

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const res = await fetch(API + `/coupon`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})

		if (!res.ok) {
			return NextResponse.json(
				{ message: "Failed to create coupon" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 201 })
	} catch (error) {
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
