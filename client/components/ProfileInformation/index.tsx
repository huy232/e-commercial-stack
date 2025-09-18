"use client"
import { loginSuccess, selectAuthUser } from "@/store/slices/authSlice"
import { AppDispatch, ProfileUser } from "@/types"
import { useDispatch, useSelector } from "react-redux"
import defaultAvatar from "@/assets/images/defaultAvatar.png"
import { Button, CustomImage, InputForm, showToast } from "@/components"
import { FieldError, FieldValues, useForm } from "react-hook-form"
import { ChangeEvent, useEffect, useState } from "react"
import clsx from "clsx"
import moment from "moment"
import { FaFileUpload } from "@/assets/icons"
import { useRouter } from "next/navigation"
import { useMounted } from "@/hooks"
import { LoadingSpinner, path } from "@/utils"
import { WEB_URL } from "@/constant"
import { AddressElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

interface CustomFieldError extends FieldError {
	message: string
}
interface FormData extends FieldValues {
	email: string
	firstName: string
	lastName: string
	mobile: number
	address: string
}

const ProfileInformation = () => {
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const mounted = useMounted()
	const user: ProfileUser = useSelector(selectAuthUser)
	const stripe = useStripe()
	const elements = useElements()
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<FormData>({
		defaultValues: {
			email: user?.email || "",
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
		},
	})

	const [isAddressDirty, setIsAddressDirty] = useState(false)
	const [imageAvatar, setImageAvatar] = useState<string | File | null>(
		user?.avatar || null
	)
	const [removeAvatar, setRemoveAvatar] = useState(false)
	const [isImageChanged, setIsImageChanged] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (mounted && !user) {
			router.push(`${WEB_URL}${path.LOGIN}`)
		}
	}, [mounted, user, router])

	useEffect(() => {
		if (user) {
			reset({
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			})
		}
	}, [user, reset])

	if (!mounted) {
		return (
			<div className="flex items-center justify-center w-full h-[300px]">
				<LoadingSpinner />
			</div>
		)
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center w-full h-[300px]">
				<p className="text-gray-600">No user data found</p>
			</div>
		)
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setImageAvatar(file)
			setRemoveAvatar(true)
			setIsImageChanged(true)
		}
	}

	const handleRemoveImage = () => {
		setImageAvatar(user?.avatar || null)
		setRemoveAvatar(false)
		setIsImageChanged(false)
	}

	const handleSubmitProfile = handleSubmit(
		async (data: Record<string, string>) => {
			if (!loading && (isDirty || isImageChanged || isAddressDirty)) {
				setLoading(true)

				const addressElement = elements?.getElement(AddressElement)

				if (!addressElement) {
					alert("Billing form not ready yet.")
					setLoading(false)
					return
				}

				const { complete, value } = await addressElement.getValue()

				if (!complete) {
					alert("Please complete your billing information.")
					setLoading(false)
					return
				}

				const formData = new FormData()
				for (let [key, value] of Object.entries(data)) {
					if (key !== "address") {
						formData.append(key, value as string)
					}
				}

				formData.append("address", JSON.stringify(value))

				if (imageAvatar) {
					formData.append("avatar", imageAvatar)
				}

				try {
					const updateUserResponse = await fetch(`/api/user/user-update`, {
						method: "PUT",
						credentials: "include",
						body: formData,
					})

					const updateUser = await updateUserResponse.json()

					if (updateUser.success) {
						const currentUserResponse = await fetch(`/api/user/current`, {
							method: "GET",
							credentials: "include",
							headers: { "Content-Type": "application/json" },
						})
						const currentUser = await currentUserResponse.json()
						const updatedUserData = currentUser.data

						await dispatch(loginSuccess(updatedUserData))

						reset({
							email: updatedUserData.email,
							firstName: updatedUserData.firstName,
							lastName: updatedUserData.lastName,
						})

						setRemoveAvatar(false)
						setIsImageChanged(false)
						setIsAddressDirty(false)
						showToast("Successfully update user information", "success")
					}
				} catch (err) {
					showToast(
						"Something went wrong while update user information",
						"error"
					)
					console.log(err)
				} finally {
					setLoading(false)
				}
			}
		}
	)

	const submitClass = clsx(
		`w-[120px] h-[40px] relative block ml-auto mr-0 border-2 hover-effect rounded p-1 group overflow-hidden my-2`,
		loading || !(isDirty || isImageChanged || isAddressDirty)
			? `border-gray-500 bg-gray-500 opacity-80 cursor-not-allowed`
			: `border-red-500 hover:bg-red-500`
	)

	console.log(user)

	return (
		<div className="flex flex-col md:flex-row w-full">
			<div className="flex flex-col items-center lg:w-[120px] w-full">
				<div
					className="relative h-[80px] w-[80px] rounded-full overflow-hidden group cursor-pointer"
					onClick={() => document.getElementById("avatar-input")?.click()}
				>
					<CustomImage
						src={
							imageAvatar instanceof File || typeof imageAvatar === "string"
								? imageAvatar instanceof File
									? URL.createObjectURL(imageAvatar)
									: imageAvatar
								: defaultAvatar
						}
						alt="Profile avatar"
						width={80}
						height={80}
						className="absolute cursor-pointer"
					/>
					<label
						className={clsx(
							"absolute flex justify-center items-center opacity-0 group-hover:opacity-100 duration-300 text-xs w-full bottom-0 bg-gray-500 cursor-pointer p-1"
						)}
						htmlFor="avatar-input"
						style={{ pointerEvents: "none" }}
					>
						<FaFileUpload />
					</label>
					<input
						type="file"
						id="avatar-input"
						className="hidden"
						onChange={handleFileChange}
						accept="image/*"
					/>
				</div>
				{removeAvatar && (
					<Button
						className="hover-effect rounded border-2 border-red-500 hover:bg-red-500 hover:text-white my-1 p-1"
						onClick={() => handleRemoveImage()}
						aria-label="Remove selected avatar"
						role="button"
						tabIndex={0}
						data-testid="remove-avatar-button"
						id="remove-avatar-button"
						disabled={loading}
					>
						Remove
					</Button>
				)}
				<span>
					{user.firstName} {user.lastName}
				</span>
				<div className="flex flex-col items-center">
					<span
						className={clsx(
							"text-xs p-[4px] rounded bg-opacity-70 tracking-wider",
							user.isBlocked ? "bg-red-500" : "bg-green-500"
						)}
					>
						{user.isBlocked ? "Blocked" : "Active"}
					</span>
					<span className="text-xs">{moment(user.createdAt).fromNow()}</span>
				</div>
			</div>
			<form
				onSubmit={handleSubmitProfile}
				className="w-full md:w-[220px] lg:w-[330px] xl:w-[440px] p-4"
			>
				<span className="font-bebasNeue text-xl mb-2">Account information</span>
				<InputForm
					register={register}
					errorMessage={errors as { [key: string]: CustomFieldError }}
					id="email"
					defaultValue={user.email}
					label="Email"
					disabled={true}
					className="cursor-not-allowed select-none"
				/>
				<InputForm
					register={register}
					errorMessage={errors as { [key: string]: CustomFieldError }}
					id={"firstName"}
					defaultValue={user.firstName}
					label="First name"
				/>
				<InputForm
					register={register}
					errorMessage={errors as { [key: string]: CustomFieldError }}
					id={"lastName"}
					defaultValue={user.lastName}
					label="Last name"
				/>

				<div className="flex items-center gap-2 w-full my-2">
					<div className="flex-1 border-t border-gray-300"></div>
				</div>

				<span className="font-bebasNeue text-xl mt-4 mb-2">
					Billing information for order
				</span>
				<AddressElement
					options={{
						mode: "shipping",
						allowedCountries: ["VN"],
						fields: {
							phone: "always",
						},
						validation: {
							phone: { required: "always" },
						},
						defaultValues: {
							name: user.address?.name,
							phone: user.address?.phone,
							address: {
								line1: user.address?.line1 || "",
								line2: user.address?.line2 || "",
								city: user.address?.city || "",
								state: user.address?.state || "",
								postal_code: user.address?.postal_code || "",
								country: user.address?.country || "VN",
							},
						},
					}}
					onChange={(event) => {
						if (event.complete) {
							setIsAddressDirty(true)
						}
					}}
				/>
				<Button
					className={submitClass}
					type="submit"
					disabled={loading || !(isDirty || isImageChanged || isAddressDirty)}
					loading={loading}
					aria-label="Update profile information"
					role="button"
					tabIndex={0}
					data-testid="update-profile-button"
					id="update-profile-button"
				>
					<span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
						Update
					</span>
					<span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
						Information
					</span>
				</Button>
			</form>
		</div>
	)
}
export default ProfileInformation
