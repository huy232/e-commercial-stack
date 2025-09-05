import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	try {
		// extract query params from the request
		const searchParams = req.nextUrl.searchParams
		const queryString = searchParams.toString()

		// forward query string to backend
		const backendRes = await fetch(
			`${API}/product-category${queryString ? `?${queryString}` : ""}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					cookie: req.headers.get("cookie") || "",
				},
				credentials: "include",
			}
		)

		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to fetch product categories" },
			{ status: 500 }
		)
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const backendRes = await fetch(`${API}/product-category`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
		})

		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to create product category" },
			{ status: 500 }
		)
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { productCategory_id: string } }
) {
	try {
		const body = await req.json()
		const { productCategory_id } = params

		const backendRes = await fetch(
			`${API}/product-category/${productCategory_id}`,
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
			{ success: false, message: "Failed to update product category" },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { productCategory_id: string } }
) {
	try {
		const { productCategory_id } = params

		const backendRes = await fetch(
			`${API}/product-category/${productCategory_id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					cookie: req.headers.get("cookie") || "",
				},
				credentials: "include",
			}
		)

		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to delete product category" },
			{ status: 500 }
		)
	}
}
