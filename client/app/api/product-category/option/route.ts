import { NextResponse, NextRequest } from "next/server"
import { API } from "@/constant"

export async function PUT(
	req: NextRequest,
	{ params }: { params: { productCategory_id: string } }
) {
	try {
		const body = await req.json()
		const { productCategory_id } = params
		const backendRes = await fetch(
			`${API}/product-category/option/${productCategory_id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					cookie: req.headers.get("cookie") || "",
				},
				credentials: "include",
				body: JSON.stringify(body),
			}
		)

		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to submit product rating" },
			{ status: 500 }
		)
	}
}
