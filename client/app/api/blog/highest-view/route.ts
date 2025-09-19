import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function GET(request: NextRequest) {
	try {
		const res = await fetch(API + `/blog/highest-view`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			cache: "no-cache",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch highest view blogs" },
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
