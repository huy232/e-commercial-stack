// import { NextApiRequest, NextApiResponse } from "next"
// import { getProductCategories } from "@/services/productCategoryService"
// import { NextRequest, NextResponse } from "next/server"

// const handleGet = async (req: NextRequest, res: NextResponse) => {
// 	try {
// 		const responseData = await getProductCategories()
// 		res.status(200).json(responseData)
// 	} catch (error) {
// 		res.status(500).json({
// 			data: [],
// 			message: "Error fetching product categories",
// 			success: false,
// 		})
// 	}
// }

// export { handleGet as GET }
import { API } from "@/constant"

export async function GET(request: Request) {
	try {
		const response = await fetch(`${API}/product-category`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const data = await response.json()
		return new Response(JSON.stringify(data))
	} catch (error) {
		console.error("Error fetching product categories:", error)
		return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		})
	}
}
