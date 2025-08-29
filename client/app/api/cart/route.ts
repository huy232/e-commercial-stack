import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const response = await fetch(API + `/cart/`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-cache",
		})

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`)
		}
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})
	} catch (error) {
		console.error("Error while fetching cart:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while fetching cart due to server",
			},
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		const response = await fetch(API + `/cart/`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-cache",
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`)
		}
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})
	} catch (error) {
		console.error("Error while creating cart:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while creating cart due to server",
			},
			{ status: 500 }
		)
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()

		const response = await fetch(API + `/cart/`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-cache",
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`)
		}
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})
	} catch (error) {
		console.error("Error while updating cart:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while updating cart due to server",
			},
			{ status: 500 }
		)
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json()
		const response = await fetch(API + `/cart/`, {
			method: "delete",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-cache",
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`)
		}
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
		})
	} catch (error) {
		console.error("Error while deleting cart item:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while deleting cart item due to server",
			},
			{ status: 500 }
		)
	}
}
