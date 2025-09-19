import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

// UPDATE blog
export async function PUT(
	request: NextRequest,
	context: { params: { blog_id: string } }
) {
	try {
		const body = await request.json()
		const { blog_id } = context.params

		const res = await fetch(`${API}/blog/${blog_id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(body),
			cache: "no-cache",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to update blog" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: res.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}

// DELETE blog
export async function DELETE(
	request: NextRequest,
	context: { params: { blog_id: string } }
) {
	try {
		const { blog_id } = context.params

		if (!blog_id) {
			return NextResponse.json(
				{ message: "Blog ID is required" },
				{ status: 400 }
			)
		}

		const res = await fetch(`${API}/blog/${blog_id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to delete blog" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: res.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
