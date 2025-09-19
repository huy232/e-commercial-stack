import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { product_id: string } }
) {
	try {
		const res = await fetch(
			`${API}/product/delete-product/${params.product_id}`,
			{
				method: "DELETE",
				credentials: "include",
				headers: {
					cookie: req.headers.get("cookie") || "",
				},
				cache: "no-cache",
			}
		)

		const data = await res.json()
		return NextResponse.json(data, { status: res.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to delete product" },
			{ status: 500 }
		)
	}
}
