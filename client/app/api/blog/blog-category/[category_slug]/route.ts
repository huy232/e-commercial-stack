import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function GET(
	request: NextRequest,
	context: { params: { category_slug: string } }
) {
	try {
		const { category_slug } = context.params
		const query = request.nextUrl.searchParams.toString()
		const res = await fetch(
			API + `/blog/blog-category/${category_slug}${query ? `?${query}` : ""}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		)

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch blogs by category" },
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
