import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
	req: NextRequest,
	{ params }: { params: { product_id: string } }
) {
	try {
		const formData = await req.formData()

		const res = await fetch(
			`${API}/product/update-product/${params.product_id}`,
			{
				method: "PUT",
				body: formData,
				credentials: "include",
				cache: "no-cache",
			}
		)

		const data = await res.json()

		return NextResponse.json(data, { status: res.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to update product" },
			{ status: 500 }
		)
	}
}
