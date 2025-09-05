import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function PUT(
	request: NextRequest,
	context: { params: { blog_id: string } }
) {
	try {
		const body = await request.json()
		const { blog_id } = context.params

		if (!blog_id) {
			return NextResponse.json(
				{ success: false, message: "Blog ID is required" },
				{ status: 400 }
			)
		}

		const res = await fetch(`${API}/blog/blog-like/${blog_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})

		const data = await res.json()
		return NextResponse.json(data, { status: res.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
