"use client"
import { useEffect, useState } from "react"
import { ApiProductResponse, ProductType } from "@/types"

interface FetchMaxPriceProps {
	fetchProducts: (params: {}) => Promise<ApiProductResponse<ProductType[]>>
}

export const useFetchMaxPrice = ({ fetchProducts }: FetchMaxPriceProps) => {
	const [maxPrice, setMaxPrice] = useState<number | null>(null)

	useEffect(() => {
		const fetchMaxPrice = async () => {
			try {
				const response = await fetchProducts({ sort: "-price", limit: 1 })
				if (response) {
					setMaxPrice(response.data[0].price)
				}
			} catch (error) {
				console.error("Error fetching max price:", error)
			} finally {
				console.log("Fetch max price operation completed")
			}
		}

		fetchMaxPrice()
	}, [])

	return maxPrice
}
