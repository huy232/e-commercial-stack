"use client"
import { FC, useState } from "react"
import { Users } from "@/types"
import { useForm } from "react-hook-form"
import { Button, Modal, SortableTableHeader } from "@/components"
import { API, WEB_URL, sortableUserFields, userHeaders } from "@/constant"
import moment from "moment"
import { MdDelete, MdEdit } from "@/assets/icons"
import clsx from "clsx"
import UserTableAction from "./UserTableAction"
import { AnimatePresence, motion } from "framer-motion"

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
	const columnWidths = {
		index: "w-[50px]",
		email: "w-[250px]",
		firstName: "w-[140px]",
		lastName: "w-[140px]",
		role: "w-[120px]",
		phone: "w-[120px]",
		status: "w-[100px]",
		created: "w-[120px]",
		actions: "w-[120px]",
	}

	const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
	const [editElement, setEditElement] = useState<EditElement | null>(null)
	const [isModalOpen, setModalOpen] = useState(false)
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const tdClass = (additionClassName?: string, width?: string) =>
		clsx("px-1 py-1 align-middle", additionClassName, width)

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
				const updateUserInformationResponse = await fetch(
					`/api/user/user-update/${editedUser._id}`,
					{
						method: "PUT",
						credentials: "include",
						body: JSON.stringify(userInformation),
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				const updateUserInformation = await updateUserInformationResponse.json()
				if (updateUserInformation.success) {
					onUserListChange()
				}
			} catch (error) {
				console.error("Error updating user:", error)
			}
		}
	})

	const handleDeleteUser = async (_id: string) => {
		const deleteUserResponse = await fetch("/api/user/delete-user", {
			method: "DELETE",
			credentials: "include",
			body: JSON.stringify({ _id }),
		})
		const deleteUser = await deleteUserResponse.json()
		if (deleteUser.success) {
			onUserListChange()
		}
	}

	const handleCopyEmail = (email: string) => {
		navigator.clipboard.writeText(email)
		setCopiedEmail(email)
		setTimeout(() => setCopiedEmail(null), 2000) // Reset after 2 seconds
	}

	const handleOpenModal = (userId: string) => {
		setSelectedUserId(userId)
		setModalOpen(true)
	}

	const handleCloseModal = () => {
		setModalOpen(false)
		setSelectedUserId(null)
	}

	const handleConfirmDelete = () => {
		if (selectedUserId) {
			handleDeleteUser(selectedUserId)
		}
		handleCloseModal()
	}

	return (
		<>
			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<h2 className="text-lg font-semibold">Confirm Delete</h2>
				<p className="mt-2 text-gray-600">
					Are you sure you want to delete this user?
				</p>
				<div className="flex justify-end gap-2 mt-6">
					<Button
						className="px-4 py-2 bg-gray-300 text-black rounded"
						onClick={handleCloseModal}
						aria-label="Cancel user deletion"
						role="button"
						tabIndex={0}
						data-testid="cancel-delete-user-button"
						id="cancel-delete-user-button"
					>
						No
					</Button>
					<Button
						className="px-4 py-2 bg-red-600 text-white rounded"
						onClick={handleConfirmDelete}
						aria-label="Confirm user deletion"
						role="button"
						tabIndex={0}
						data-testid="confirm-delete-user-button"
						id="confirm-delete-user-button"
					>
						Yes
					</Button>
				</div>
			</Modal>

			<form onSubmit={onSubmit}>
				<table className="block lg:table lg:table-auto lg:mb-6 lg:text-left lg:w-full">
					<SortableTableHeader
						headers={userHeaders}
						sortableFields={sortableUserFields}
					/>
					<AnimatePresence>
						{userList.map((user, index) =>
							editElement && editElement._id === user._id ? (
								<UserTableAction
									onUserListChange={onUserListChange}
									user={user}
									key={index}
									editElement={editElement}
									setEditElement={setEditElement}
									onSubmit={onSubmit}
									errors={errors}
									register={register}
									index={index + 1}
								/>
							) : (
								<motion.tr
									key={user._id}
									layout
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="p-2 mt-2 flex flex-col lg:table-row text-xs even:bg-gray-500/40 odd:bg-gray-300/40"
								>
									<td
										className={tdClass(
											"hidden lg:table-cell text-sm",
											columnWidths.index
										)}
									>
										{index + 1}
									</td>
									<td className="lg:hidden">
										<div className="flex items-center gap-2">
											<span>
												{user.firstName} {user.lastName}
											</span>
											<div
												className="flex gap-1 overflow-x-auto scrollbar-none"
												style={{
													scrollbarWidth: "none" /* Firefox */,
													msOverflowStyle: "none" /* IE and Edge */,
													WebkitOverflowScrolling:
														"touch" /* Enable smooth scrolling */,
												}}
											>
												{user.role.sort().map((userRole, index) => (
													<p
														key={index}
														className={clsx(
															"inline-block capitalize rounded px-1 lg:p-1 text-[12px] font-semibold before:content-[''] tracking-wider opacity-60",
															userRole === "admin"
																? "text-yellow-700 bg-yellow-100"
																: "bg-gray-400"
														)}
													>
														{userRole}
													</p>
												))}
											</div>
										</div>
										<dl className="grid grid-cols-[70px_auto] gap-1 [&>*]:mt-1 lg:hidden">
											<dt className="col-start-1 font-semibold">Email</dt>
											<dd
												className="col-start-2 line-clamp-1 overflow-x-auto scrollbar-none"
												style={{
													scrollbarWidth: "none" /* Firefox */,
													msOverflowStyle: "none" /* IE and Edge */,
													WebkitOverflowScrolling:
														"touch" /* Enable smooth scrolling */,
												}}
											>
												{user.email}
											</dd>
											<dt className="col-start-1 font-semibold">Phone</dt>
											<dd className="col-start-2">0123456789</dd>
											<dt className="col-start-1 font-semibold">Created</dt>
											<dd className="col-start-2">
												{moment(user.createdAt).fromNow()}
											</dd>
											<dt className="col-start-1 font-semibold">Status</dt>
											<dd className="col-start-2">
												<span
													className={clsx(
														"tracking-wider bg-opacity-50 px-1 lg:p-1 rounded text-[12px] font-semibold",
														user.isBlocked
															? "bg-red-300 text-red-800"
															: "bg-green-300 text-green-800"
													)}
												>
													{user.isBlocked ? "Blocked" : "Active"}
												</span>
											</dd>
										</dl>
									</td>
									<td
										className={tdClass(
											"hidden lg:table-cell text-sm flex-inline relative group cursor-pointer",
											columnWidths.email
										)}
										onClick={() => handleCopyEmail(user.email)}
										data-title={userHeaders[1].title}
									>
										<span className="select-none">
											{user.email.split("@")[0]}
										</span>
										<span className="group-hover:opacity-100 transition-opacity absolute left-1/3 -translate-x-full translate-y-2/3 opacity-0 mx-auto">
											<div
												className={clsx(
													"clip-bottom h-2 w-4 mx-auto",
													copiedEmail === user.email
														? "bg-green-400 opacity-60"
														: "bg-gray-800"
												)}
											/>
											<motion.span
												initial={{ opacity: 0, y: -5 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -5 }}
												transition={{ duration: 0.2 }}
												className={clsx(
													"p-1 text-sm text-white rounded-md select-none mx-auto",
													copiedEmail === user.email
														? "bg-green-400 bg-opacity-60"
														: "bg-gray-800"
												)}
											>
												{copiedEmail === user.email
													? `Copied!`
													: `@${user.email.split("@")[1]}`}
											</motion.span>
										</span>
									</td>
									<td
										className={tdClass(
											"hidden lg:table-cell text-sm",
											columnWidths.firstName
										)}
									>
										{user.firstName}
									</td>
									<td
										className={tdClass(
											"hidden lg:table-cell text-sm",
											columnWidths.lastName
										)}
									>
										{user.lastName}
									</td>
									<td
										className={tdClass(
											"hidden lg:flex lg:flex-col h-[100px] overflow-y-auto justify-center",
											columnWidths.role
										)}
									>
										{user.role.sort().map((userRole, index) => (
											<span
												key={index}
												className={clsx(
													"capitalize rounded p-1 mt-1 text-[12px] font-semibold",
													userRole === "admin"
														? "text-yellow-700 bg-yellow-100 opacity-60 tracking-wider"
														: "bg-gray-400 opacity-60 tracking-wider"
												)}
											>
												{userRole}
											</span>
										))}
									</td>
									<td
										className={tdClass(
											"hidden lg:table-cell text-xs",
											columnWidths.phone
										)}
									>
										0123456789
									</td>
									<td
										className={tdClass(
											"hidden lg:table-cell",
											columnWidths.status
										)}
									>
										<span
											className={clsx(
												"tracking-wider bg-opacity-50 px-1 lg:p-1 rounded my-1",
												user.isBlocked
													? "bg-red-300 text-red-800"
													: "bg-green-300 text-green-800"
											)}
										>
											{user.isBlocked ? "Blocked" : "Active"}
										</span>
									</td>
									<td
										className={tdClass(
											"hidden lg:table-cell text-[12px]",
											columnWidths.created
										)}
									>
										{moment(user.createdAt).fromNow()}
									</td>
									<td
										className={tdClass(
											"my-1 text-center",
											columnWidths.actions
										)}
									>
										<div className="flex items-center gap-2 h-full">
											<Button
												onClick={(e) => {
													setEditElement(user)
												}}
												className="flex flex-inline flex-row items-center gap-0.5 hover:bg-black/60 hover:bg-opacity-60 duration-300 ease-in-out hover:text-white rounded p-1 text-orange-600 h-full border-[1px] border-orange-600"
												type="button"
												aria-label="Edit user"
												role="button"
												tabIndex={0}
												data-testid={`edit-user-button-${user._id}`}
												id={`edit-user-button-${user._id}`}
											>
												<span className="lg:hidden text-semibold">Edit</span>
												<MdEdit size={24} />
											</Button>
											<Button
												className="flex flex-inline flex-row items-center gap-0.5 hover:bg-black/60 hover:bg-opacity-60 duration-300 ease-in-out hover:text-white rounded p-1 text-orange-600 h-full border-[1px] border-orange-600"
												onClick={() => handleOpenModal(user._id)}
												type="button"
												aria-label="Delete user"
												role="button"
												tabIndex={0}
												data-testid={`delete-user-button-${user._id}`}
												id={`delete-user-button-${user._id}`}
											>
												<span className="lg:hidden text-semibold">Delete</span>
												<MdDelete size={24} />
											</Button>
										</div>
									</td>
								</motion.tr>
							)
						)}
					</AnimatePresence>
				</table>
			</form>
		</>
	)
}

export default UserTableRow
