import { NextRequest, NextResponse } from "next/server"
import { API } from "@/constant"

export async function PUT(
	request: NextRequest,
	context: { params: { brand_id: string } }
) {
	try {
		const { brand_id } = context.params
		if (!brand_id) {
			return NextResponse.json(
				{ success: false, message: "Brand ID is required" },
				{ status: 400 }
			)
		}

		const body = await request.json()

		const res = await fetch(`${API}/brand/${brand_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
			cache: "no-cache",
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

export async function DELETE(
	request: NextRequest,
	context: { params: { brand_id: string } }
) {
	try {
		const { brand_id } = context.params
		if (!brand_id) {
			return NextResponse.json(
				{ success: false, message: "Brand ID is required" },
				{ status: 400 }
			)
		}

		const res = await fetch(`${API}/brand/${brand_id}`, {
			method: "DELETE",
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
			credentials: "include",
			cache: "no-cache",
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
