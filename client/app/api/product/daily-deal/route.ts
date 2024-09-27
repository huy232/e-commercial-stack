import { API } from "@/constant"

export async function GET(request: Request) {
	try {
		const response = await fetch(`${API}/product/daily-product`, {
			method: "GET",
			cache: "no-cache",
		})
		const data = await response.json()
		return new Response(JSON.stringify(data))
	} catch (error) {
		console.error("Error fetching daily deal:", error)
		return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		})
	}
}
