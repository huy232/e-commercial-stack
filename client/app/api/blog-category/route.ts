import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function GET(request: NextRequest) {
	try {
		const res = await fetch(API + `/blog-category`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch blog categories" },
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

		const res = await fetch(API + `/blog-category`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to create blog category" },
				{ status: res.status }
			)
		}

		const data = await res.json()
		return NextResponse.json(data, { status: 201 })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		)
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		const { blogCategory_id } = body

		if (!blogCategory_id) {
			return NextResponse.json(
				{ success: false, message: "Blog category ID is required" },
				{ status: 400 }
			)
		}

		const res = await fetch(API + `/blog-category/${blogCategory_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to update blog category" },
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

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const blogCategory_id = searchParams.get("blogCategory_id")

		if (!blogCategory_id) {
			return NextResponse.json(
				{ success: false, message: "Blog category ID is required" },
				{ status: 400 }
			)
		}

		const res = await fetch(API + `/blog-category/${blogCategory_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to delete blog category" },
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
