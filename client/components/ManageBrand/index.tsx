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
		<>
			<form
				onSubmit={handleSubmitBrand}
				// className="w-full lg:w-[480px] flex flex-col space-y-4 mb-2 mx-4 lg:mx-6"
				className="lg:w-[480px] mx-4"
			>
				<h2 className="text-xl font-bold font-bebasNeue">Create brand</h2>
				<div className="flex flex-row items-center justify-between">
					<InputField
						name="brand"
						register={register}
						required="Brand name is required"
						errorMessage={
							errors.brand &&
							(errors.brand.message?.toString() ||
								"Please enter a valid brand name.")
						}
						placeholder={"Brand name"}
					/>
					<Button
						type="submit"
						className="bg-rose-500 p-1 rounded hover:brightness-125 hover:opacity-90 duration-300 ease-in-out text-white hover:bg-transparent hover:border-rose-500 border-transparent border-[2px] hover:text-black w-[120px]"
						aria-label="Submit new brand"
						role="button"
						tabIndex={0}
						data-testid="submit-brand-button"
						id="submit-brand-button"
					>
						Submit
					</Button>
				</div>
			</form>

			<h2 className="text-2xl font-bold mb-4 font-bebasNeue text-center">
				Available brand list
			</h2>
			<div className="flex flex-wrap flex-row gap-3 items-center flex-inline mx-4">
				{!loading && brandList ? (
					brandList.map((brand) => (
						<div
							className="bg-black/40 rounded p-1 text-base font-inter w-fit"
							key={brand._id}
						>
							{brand.title}
						</div>
					))
				) : (
					<div>Loading</div>
				)}
			</div>
		</>
	)
}

export default ManageBrand
