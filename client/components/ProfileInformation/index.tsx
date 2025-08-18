"use client"
import {
	loginSuccess,
	selectAuthUser,
	selectIsAuthenticated,
} from "@/store/slices/authSlice"
import { AppDispatch, ProfileUser } from "@/types"
import { useDispatch, useSelector } from "react-redux"
import defaultAvatar from "@/assets/images/defaultAvatar.png"
import { Button, CustomImage, InputForm } from "@/components"
import { FieldError, FieldValues, useForm } from "react-hook-form"
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react"
import clsx from "clsx"
import moment from "moment"
import { validatePhoneNumber } from "@/validators"
import { FaFileUpload } from "@/assets/icons"
import { API } from "@/constant"
import { useRouter } from "next/navigation"
import { useMounted } from "@/hooks"
import { path } from "@/utils"
import { WEB_URL } from "@/constant"
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

	const [imageAvatar, setImageAvatar] = useState<string | File | null>(
		user?.avatar || null
	)
	const [removeAvatar, setRemoveAvatar] = useState(false)
	const [isImageChanged, setIsImageChanged] = useState(false)
	const [loading, setLoading] = useState(false)

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
			mobile: user?.mobile,
			address: user?.address?.[0] || "",
		},
	})

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
				mobile: user.mobile,
				address: user.address?.[0] || "",
			})
		}
	}, [user, reset])

	if (!mounted || !user) {
		return null
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
			if (!loading && (isDirty || isImageChanged)) {
				let hasError = false
				const formData = new FormData()
				for (let [key, value] of Object.entries(data)) {
					formData.append(key, value)
				}
				if (imageAvatar) {
					formData.append("avatar", imageAvatar)
				} else {
					hasError = true
				}
				if (hasError) {
					return
				}
				setLoading(true)

				const updateUserResponse = await fetch(API + "/user/user-update", {
					method: "PUT",
					credentials: "include",
					body: formData,
				})
				const updateUser = await updateUserResponse.json()

				if (updateUser.success) {
					const currentUserResponse = await fetch(`${API}/user/current`, {
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					})
					const currentUser = await currentUserResponse.json()
					const updatedUserData = currentUser.data

					// Dispatch new user data to Redux
					await dispatch(loginSuccess(updatedUserData))

					// Reset form with updated data
					reset({
						email: updatedUserData.email,
						firstName: updatedUserData.firstName,
						lastName: updatedUserData.lastName,
						mobile: updatedUserData.mobile,
						address: updatedUserData.address[0],
					})

					setRemoveAvatar(false)
					setIsImageChanged(false) // Reset image change flag
				}
				setLoading(false)
			}
		}
	)
	const submitClass = clsx(
		`w-[120px] h-[40px] relative block ml-auto mr-0 border-2 hover-effect rounded p-1 group overflow-hidden my-2`,
		loading || !(isDirty || isImageChanged)
			? `border-gray-500 bg-gray-500 opacity-80 cursor-not-allowed`
			: `border-red-500 hover:bg-red-500`
	)

	return (
		<div className="flex w-full">
			<div className="flex flex-col items-center w-1/5">
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
					<button
						className="hover-effect rounded border-2 border-red-500 hover:bg-red-500 hover:text-white my-1 p-1"
						onClick={() => handleRemoveImage()}
					>
						Remove
					</button>
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
			<form onSubmit={handleSubmitProfile} className="w-4/5">
				<div>
					<InputForm
						register={register}
						errorMessage={errors as { [key: string]: CustomFieldError }}
						id="email"
						defaultValue={user.email}
						label="Email"
						disabled={true}
						className="cursor-not-allowed select-none"
					/>
				</div>
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
				<InputForm
					register={register}
					errorMessage={errors as { [key: string]: CustomFieldError }}
					id={"address"}
					defaultValue={user.address}
					label="Address"
				/>
				<InputForm
					register={register}
					errorMessage={errors as { [key: string]: CustomFieldError }}
					id={"mobile"}
					defaultValue={user.mobile ? user.mobile.toString() : ""}
					label="Phone number"
					// validate={validatePhoneNumber}
				/>
				<Button
					className={submitClass}
					type="submit"
					disabled={loading || !(isDirty || isImageChanged)}
					loading={loading}
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
