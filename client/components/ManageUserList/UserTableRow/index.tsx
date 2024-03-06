"use client"
import { FC, useState } from "react"
import { Users } from "@/types"
import { FieldError, FieldErrors, useForm } from "react-hook-form"
import { InputForm } from "@/components"
import { roleSelection, tableHeaders } from "@/constant"
import moment from "moment"
import {
	FaCircleXmark,
	IoMdCheckmarkCircleOutline,
	MdDelete,
	MdEdit,
} from "@/assets/icons"
import clsx from "clsx"
import { deleteUser, updateUser } from "@/app/api"
import { useRouter } from "next/navigation"

interface CustomFieldError extends FieldError {
	message: string
}

interface EditElement {
	_id?: string
	firstName?: string
	lastName?: string
	email?: string
	avatar?: string
	mobile?: number
	role: string[]
	isBlocked?: boolean
	createdAt?: string
}

interface UserTableRowProps {
	userList: Users[] | []
	onUserListChange: () => void
}

const UserTableRow: FC<UserTableRowProps> = ({
	userList,
	onUserListChange,
}) => {
	const router = useRouter()
	const [editElement, setEditElement] = useState<EditElement | null>(null)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const validateEmail = (value: string) => {
		if (!value) return "Email is required"
		if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email address"
		return true
	}
	const tdClass = (additionClassName?: string) =>
		clsx("px-1 py-1", additionClassName)

	const handleRoleChange = (role: string, checked: boolean) => {
		const normalizedRole = role.toLowerCase()
		const updatedRoles = checked
			? [...(editElement?.role || []), normalizedRole]
			: (editElement?.role || []).filter((r) => r !== normalizedRole)
		setEditElement((prevEditElement) => ({
			...prevEditElement,
			role: updatedRoles,
		}))
	}

	const onSubmit = handleSubmit(async (data) => {
		const editedUser = editElement
		const { email, firstName, lastName } = data
		if (editedUser && editedUser._id) {
			const userInformation = {
				firstName,
				lastName,
				email,
				_id: editedUser._id,
				isBlocked: editedUser.isBlocked,
				role: editedUser.role,
			}
			try {
				const updateUserInformation = await updateUser(
					editedUser._id,
					userInformation
				)
				if (updateUserInformation.success) {
					onUserListChange()
				}
			} catch (error) {
				console.error("Error updating user:", error)
			}
		}
	})

	const handleDeleteUser = async (_id: string) => {
		const deleteUserResponse = await deleteUser(_id)
		onUserListChange()
		console.log(deleteUserResponse)
	}

	return (
		<form onSubmit={onSubmit}>
			<table className="table-auto mb-6 text-left w-full">
				<thead className="font-bold bg-gray-700 text-[13px] text-white">
					<tr className="border border-blue-300">
						{tableHeaders.map((header, index) => (
							<th key={index} className="px-1 py-2">
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="text-left">
					{userList.map((user, index) => (
						<tr key={user._id} className="border border-gray-500 text-sm">
							<td className={tdClass()}>{index + 1}</td>
							<td className={tdClass()}>
								{editElement?._id ? (
									<InputForm
										register={register}
										errors={errors as { [key: string]: CustomFieldError }}
										id={"email"}
										validate={validateEmail}
										defaultValue={user.email}
									/>
								) : (
									<span>{user.email}</span>
								)}
							</td>
							<td className={tdClass()}>
								{editElement?._id ? (
									<InputForm
										register={register}
										errors={errors as { [key: string]: CustomFieldError }}
										id={"firstName"}
										defaultValue={user.firstName}
									/>
								) : (
									user.firstName
								)}
							</td>
							<td className={tdClass()}>
								{editElement?._id ? (
									<InputForm
										register={register}
										errors={errors as { [key: string]: CustomFieldError }}
										id={"lastName"}
										defaultValue={user.lastName}
									/>
								) : (
									user.lastName
								)}
							</td>
							<td className={tdClass("flex flex-col")}>
								{editElement?._id
									? roleSelection.map((role) => (
											<>
												<input
													type="checkbox"
													key={role.id}
													defaultChecked={editElement.role.includes(
														role.role.toLowerCase()
													)}
													onChange={(e) =>
														handleRoleChange(role.role, e.target.checked)
													}
													value={role.role.normalize()}
													name={role.role}
													id={role.role}
												/>
												<label htmlFor={role.role}>{role.role}</label>
											</>
									  ))
									: user.role.sort().map((userRole, index) => (
											<span key={index} className="capitalize">
												{userRole}
											</span>
									  ))}
							</td>
							<td className={tdClass()}>0123456789</td>
							<td className={tdClass()}>
								{editElement?._id ? (
									<>
										<input
											type="checkbox"
											id="user-status"
											name="user-status"
											defaultChecked={user.isBlocked}
											onChange={(e) =>
												setEditElement(
													(prevEditElement: EditElement | null) => ({
														...prevEditElement!,
														isBlocked: e.target.checked,
													})
												)
											}
										/>
										<label htmlFor="user-status">Block</label>
									</>
								) : user.isBlocked ? (
									"Blocked"
								) : (
									"Active"
								)}
							</td>
							<td className={tdClass()}>{moment(user.createdAt).fromNow()}</td>
							<td
								className={tdClass(
									"flex gap-1 items-center justify-center h-full"
								)}
							>
								{editElement?._id ? (
									<>
										<button type="submit" className="text-orange-600 h-full">
											<IoMdCheckmarkCircleOutline />
										</button>
										<button
											onClick={() => setEditElement(null)}
											className="text-orange-600 h-full"
										>
											<FaCircleXmark />
										</button>
									</>
								) : (
									<>
										<button
											onClick={(e) => {
												e.preventDefault()
												setEditElement(user)
											}}
											className="text-orange-600 h-full"
										>
											<MdEdit />
										</button>
										<button
											className="text-orange-600 h-full"
											onClick={() => handleDeleteUser(user._id)}
										>
											<MdDelete />
										</button>
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</form>
	)
}

export default UserTableRow
