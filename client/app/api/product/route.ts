import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const queryParams = new URLSearchParams(searchParams)

		let url = `${API}/product/get-all-product`
		if (queryParams) {
			url = `${API}/product/get-all-product?${queryParams.toString()}`
		}
		const response = await fetch(url, {
			method: "GET",
			cache: "no-cache",
		})
		const data = await response.json()
		return Response.json(data)
	} catch (error) {}
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const cookieArray = request.cookies.getAll()
		const cookieString = cookieArray
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ")
		const response = await fetch(`${API}/product/create-product`, {
			method: "POST",
			cache: "no-cache",
			headers: {
				Cookie: cookieString,
			},
			credentials: "include",
			body: formData,
		})
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error creating product:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error creating product",
			},
			{ status: 500 }
		)
	}
}
