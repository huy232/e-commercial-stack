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
import { ChangeEvent, FC, useCallback, useState } from "react"
import clsx from "clsx"
import moment from "moment"
import { validatePhoneNumber } from "@/validators"
import { getCurrentUser, updateUserProfile } from "@/app/api"
import { FaFileUpload } from "@/assets/icons"
interface CustomFieldError extends FieldError {
	message: string
}
interface FormData extends FieldValues {
	email: string
	firstName: string
	lastName: string
	phone: number
	address: string
}

interface ProfileInformationProps {
	user: ProfileUser
}
const ProfileInformation: FC<ProfileInformationProps> = ({ user }) => {
	const dispatch = useDispatch<AppDispatch>()
	const [imageAvatar, setImageAvatar] = useState<string | File | null>(
		user?.avatar || null
	)
	const [removeAvatar, setRemoveAvatar] = useState(false)
	const [loading, setLoading] = useState(false)
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<FormData>({
		defaultValues: {
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user?.phone,
			address: user?.address[0],
		},
	})

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setImageAvatar(file)
			setRemoveAvatar(true)
		}
	}

	const handleRemoveImage = () => {
		setImageAvatar(user?.avatar || null)
		setRemoveAvatar(false)
	}

	const handleSubmitProfile = handleSubmit(
		async (data: Record<string, string>) => {
			if (!loading && isDirty) {
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
				const response = await updateUserProfile(formData)
				if (response.success) {
					const response = await getCurrentUser()
					const userData = response.data
					dispatch(loginSuccess(userData))
				}
				setLoading(false)
			}
		}
	)
	const submitClass = clsx(
		`border-2 hover-effect rounded p-1`,
		loading || !isDirty
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
							(imageAvatar &&
								(imageAvatar === "string"
									? imageAvatar
									: URL.createObjectURL(imageAvatar as File))) ||
							defaultAvatar
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
			</div>
			<form onSubmit={handleSubmitProfile} className="w-4/5">
				<div>
					<InputForm
						register={register}
						errors={errors as { [key: string]: CustomFieldError }}
						id="email"
						defaultValue={user.email}
						label="Email"
						disabled={true}
						className="cursor-not-allowed select-none"
					/>
				</div>
				<InputForm
					register={register}
					errors={errors as { [key: string]: CustomFieldError }}
					id={"firstName"}
					defaultValue={user.firstName}
					label="First name"
				/>
				<InputForm
					register={register}
					errors={errors as { [key: string]: CustomFieldError }}
					id={"lastName"}
					defaultValue={user.lastName}
					label="Last name"
				/>
				<InputForm
					register={register}
					errors={errors as { [key: string]: CustomFieldError }}
					id={"address"}
					defaultValue={user.address}
					label="Address"
				/>
				<InputForm
					register={register}
					errors={errors as { [key: string]: CustomFieldError }}
					id={"phone"}
					defaultValue={user.phone ? user.phone.toString() : ""}
					label="Phone number"
					// validate={validatePhoneNumber}
				/>
				<div className="flex flex-col">
					<span>Status: {user.isBlocked ? "Blocked" : "Active"}</span>
					<span>Created: {moment(user.createdAt).fromNow()}</span>
				</div>
				<Button
					className={submitClass}
					type="submit"
					disabled={loading || !isDirty}
					loading={loading}
				>
					Update information
				</Button>
			</form>
		</div>
	)
}
export default ProfileInformation
