import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json()
		const { categoryIds } = body
		if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
			return NextResponse.json(
				{ success: false, message: "No category IDs provided for deletion." },
				{ status: 400 }
			)
		}

		const backendRes = await fetch(`${API}/product-category/bulk-delete`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify({ categoryIds }), // Sending the array of IDs to the backend
		})
		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to delete product categories" },
			{ status: 500 }
		)
	}
}
