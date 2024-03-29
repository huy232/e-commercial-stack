"use client"
import { selectAuthUser, selectIsAuthenticated } from "@/store/slices/authSlice"
import { AppDispatch, ProfileUser } from "@/types"
import { useDispatch, useSelector } from "react-redux"
import defaultAvatar from "@/assets/images/defaultAvatar.png"
import { Button, CustomImage, InputForm } from "@/components"
import { FieldError, useForm } from "react-hook-form"
import { useCallback, useState } from "react"
import clsx from "clsx"
import { useMounted } from "@/hooks"
import moment from "moment"
import { validatePhoneNumber } from "@/validators"
interface CustomFieldError extends FieldError {
	message: string
}
interface FormData {
	email: string
	firstName: string
	lastName: string
}
const ProfileInformation = () => {
	const dispatch = useDispatch<AppDispatch>()
	const user: ProfileUser = useSelector(selectAuthUser)
	const isAuthenticated = useSelector(selectIsAuthenticated)
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
		},
	})
	const onSubmit = useCallback(
		async (data: any) => {
			if (!loading && isDirty) {
				console.log(data)
			}
		},
		[isDirty, loading]
	)
	const submitClass = clsx(
		`border-2 hover-effect rounded p-1`,
		loading || !isDirty
			? `border-gray-500 bg-gray-500 opacity-80 cursor-not-allowed`
			: `border-red-500 hover:bg-red-500`
	)
	return (
		<div className="flex w-full">
			<div className="flex flex-col items-center">
				<CustomImage
					src={user?.avatar || defaultAvatar}
					alt="Profile avatar"
					width={60}
					height={60}
				/>
				<span>
					{user.firstName} {user.lastName}
				</span>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
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
