"use client"
import { FC, useState } from "react"
import { Users } from "@/types"
import { FieldError, useForm } from "react-hook-form"
import { InputForm } from "@/components"

interface CustomFieldError extends FieldError {
	message: string
}

interface UserTableRowProps {
	user: Users
	index: number
}

const UserTableRow: FC<UserTableRowProps> = ({ user, index }) => {
	const [editElement, setEditElement] = useState<Users | null>(null)
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm()

	const validateEmail = (value: string) => {
		if (!value) return "Email is required"
		if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email address"
		return true
	}

	return (
		<tr key={user._id} className="border border-gray-500">
			<td className="py-2 px-4">{index + 1}</td>
			<td className="py-2 px-4">
				{editElement?._id ? (
					<InputForm
						register={register}
						errors={errors as { [key: string]: CustomFieldError }}
						id={"email"}
						validate={validateEmail}
					/>
				) : (
					<span>{user.email}</span>
				)}
			</td>
			<td className="py-2 px-4">{user.firstName}</td>
			<td className="py-2 px-4">{user.lastName}</td>
			<td className="py-2 px-4">{user.role}</td>
			<td className="py-2 px-4">Phone number</td>
			<td className="py-2 px-4">{user.isBlocked ? "Blocked" : "Active"}</td>
			<td className="py-2 px-4">{user.createdAt}</td>
			<td className="py-2 px-4">
				<button
					onClick={() => setEditElement(user)}
					className="px-2 text-orange-600 hover:underline"
				>
					Edit
				</button>
				<button className="px-2 text-orange-600 hover:underline">Delete</button>
			</td>
		</tr>
	)
}

export default UserTableRow
