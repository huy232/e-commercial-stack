import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function GET(
	request: NextRequest,
	context: { params: { blog_id: string } }
) {
	try {
		const { blog_id } = context.params
		const res = await fetch(API + `/blog/${blog_id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch blogs" },
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
