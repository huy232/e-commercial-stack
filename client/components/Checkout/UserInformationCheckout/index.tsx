"use client"

import { CountryCode } from "libphonenumber-js"
import { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import {
	getDistrictsByProvinceCode,
	getProvinces,
	getWardsByDistrictCode,
} from "vn-local-plus"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"

interface CheckoutFormValues {
	phoneNumber: string
	country: CountryCode
	province: string
	district: string
	ward: string
	fullName: string
	address: string
	email: string
	notes?: string
}

interface UserInformationCheckoutProps {
	setDistricts: React.Dispatch<
		React.SetStateAction<{ code: string; name: string }[]>
	>
	setWards: React.Dispatch<
		React.SetStateAction<{ code: string; name: string }[]>
	>
}

const UserInformationCheckout: React.FC<UserInformationCheckoutProps> = ({
	setDistricts,
	setWards,
}) => {
	const {
		setValue,
		watch,
		register,
		formState: { errors },
	} = useFormContext<CheckoutFormValues>()

	const provinces = getProvinces()
	const selectedProvince = watch("province")
	const selectedDistrict = watch("district")
	const [districts, internalSetDistricts] = useState<
		{ code: string; name: string }[]
	>([])
	const [wards, internalSetWards] = useState<{ code: string; name: string }[]>(
		[]
	)

	// State for phone number and country
	const [phoneNumber, setPhoneNumber] = useState<string>("")
	const [country, setCountry] = useState<CountryCode>("VN")

	useEffect(() => {
		if (selectedProvince) {
			const fetchedDistricts = getDistrictsByProvinceCode(selectedProvince).map(
				(district) => ({
					code: district.code,
					name: district.name,
				})
			)
			internalSetDistricts(fetchedDistricts)
			setDistricts(fetchedDistricts)
			setValue("district", "")
			internalSetWards([])
			setWards([])
			setValue("ward", "")
		}
	}, [selectedProvince, setValue, setDistricts, setWards])

	useEffect(() => {
		if (selectedDistrict) {
			const fetchedWards = getWardsByDistrictCode(selectedDistrict).map(
				(ward) => ({
					code: ward.code,
					name: ward.name,
				})
			)
			internalSetWards(fetchedWards)
			setWards(fetchedWards)
			setValue("ward", "")
		}
	}, [selectedDistrict, setValue, setWards])

	useEffect(() => {
		// Sync phone number and country with react-hook-form values
		setValue("phoneNumber", phoneNumber)
		setValue("country", country)
	}, [phoneNumber, country, setValue])

	return (
		<div>
			<div>
				<PhoneInput
					placeholder="Enter phone number"
					value={phoneNumber}
					onChange={(value) => setPhoneNumber(value || "")}
					defaultCountry={country}
					onCountryChange={(country) => setCountry(country as CountryCode)}
					international
					displayInitialValueAsLocalNumber={false}
				/>
				{errors.phoneNumber && (
					<p className="text-red-500">{errors.phoneNumber.message}</p>
				)}
			</div>

			<div>
				<input
					type="text"
					placeholder="Full Name"
					className="w-full p-2 border rounded"
					{...register("fullName", { required: "Full Name is required" })}
				/>
				{errors.fullName && (
					<p className="text-red-500">{errors.fullName.message}</p>
				)}
			</div>

			<div>
				<input
					type="email"
					placeholder="Email"
					className="w-full p-2 border rounded"
					{...register("email", {
						required: "Email is required",
						pattern: {
							value: /^\S+@\S+$/i,
							message: "Invalid email address",
						},
					})}
				/>
				{errors.email && <p className="text-red-500">{errors.email.message}</p>}
			</div>

			<div>
				<select
					{...register("province", { required: "Province is required" })}
					className="w-full p-2 border rounded"
				>
					<option value="">Select Province</option>
					{provinces.map((province) => (
						<option key={province.code} value={province.code}>
							{province.name}
						</option>
					))}
				</select>
				{errors.province && (
					<p className="text-red-500">{errors.province.message}</p>
				)}
			</div>

			{selectedProvince && districts.length > 0 && (
				<div>
					<select
						{...register("district", { required: "District is required" })}
						className="w-full p-2 border rounded"
					>
						<option value="">Select District</option>
						{districts.map((district) => (
							<option key={district.code} value={district.code}>
								{district.name}
							</option>
						))}
					</select>
					{errors.district && (
						<p className="text-red-500">{errors.district.message}</p>
					)}
				</div>
			)}

			{selectedDistrict && wards.length > 0 && (
				<div>
					<select
						{...register("ward", { required: "Ward is required" })}
						className="w-full p-2 border rounded"
					>
						<option value="">Select Ward</option>
						{wards.map((ward) => (
							<option key={ward.code} value={ward.code}>
								{ward.name}
							</option>
						))}
					</select>
					{errors.ward && <p className="text-red-500">{errors.ward.message}</p>}
				</div>
			)}

			<div>
				<input
					type="text"
					placeholder="Address"
					className="w-full p-2 border rounded"
					{...register("address", { required: "Address is required" })}
				/>
				{errors.address && (
					<p className="text-red-500">{errors.address.message}</p>
				)}
			</div>

			<div>
				<textarea
					placeholder="Notes (optional)"
					className="w-full p-2 border rounded"
					{...register("notes")}
				/>
			</div>
		</div>
	)
}

export default UserInformationCheckout
