"use client"

import { useForm } from "react-hook-form"
import InputField from "../InputField"
import Button from "../Button"
import { API, BASE_SERVER_URL } from "@/constant"
import { FC, useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"
import { ProductCategories } from "@/types"

let socket: Socket | null = null

interface ManageBrandProps {
	categories: ProductCategories[]
}

const ManageBrand: FC<ManageBrandProps> = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
		setValue,
		setError, // Add setError from useForm
		clearErrors,
	} = useForm({
		defaultValues: {
			brand: "",
		},
	})

	const [loading, setLoading] = useState(true)
	const [brandList, setBrandList] = useState<{ _id: string; title: string }[]>(
		[]
	)

	const handleSubmitBrand = handleSubmit(async (data) => {
		clearErrors("brand") // Clear any previous errors before making a new request
		const brandResponse = await fetch(API + "/brand", {
			method: "POST",
			body: JSON.stringify({ title: data.brand }),
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
		const brand = await brandResponse.json()

		if (brand.success) {
			reset({ brand: "" })
			setValue("brand", "")
		} else {
			// Use setError to display the server error message
			setError("brand", {
				type: "server",
				message: brand.message || "An error occurred while creating the brand.",
			})
		}
	})

	useEffect(() => {
		const fetchBrandList = async () => {
			setLoading(true)
			const brandListResponse = await fetch(API + "/brand", {
				method: "GET",
				credentials: "include",
			})
			const brandList = await brandListResponse.json()
			if (brandList.success) {
				setBrandList(brandList.data)
			}
			setLoading(false)
		}
		fetchBrandList()
		if (!socket) {
			socket = io(BASE_SERVER_URL as string, {
				withCredentials: true,
			})

			socket.on("brandUpdate", async () => {
				await fetchBrandList()
			})
		}

		return () => {
			if (socket) {
				socket.off("brandUpdate")
				socket.disconnect()
				socket = null
			}
		}
	}, [])

	return (
		<div>
			<form onSubmit={handleSubmitBrand} className="w-full flex flex-col">
				<h2>Create brand</h2>
				<InputField
					name="brand"
					register={register}
					label="Brand name"
					required="Brand name is required"
					errorMessage={
						errors.brand &&
						(errors.brand.message?.toString() ||
							"Please enter a valid brand name.")
					}
				/>
				<Button type="submit">Submit</Button>
			</form>
			<div>
				<h2>Manage brand list</h2>
				{!loading && brandList ? (
					brandList.map((brand) => <div key={brand._id}>{brand.title}</div>)
				) : (
					<div>Loading</div>
				)}
			</div>
		</div>
	)
}

export default ManageBrand
