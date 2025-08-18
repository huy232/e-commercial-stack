import { FaCircleXmark, IoMdCheckmarkCircleOutline } from "@/assets/icons"
import { Button, Checkbox } from "@/components"
import InputForm from "@/components/Forms/InputForm"
import { roleSelection } from "@/constant"
import { Users } from "@/types"
import { inputClass } from "@/utils"
import { validateEmail } from "@/validators"
import clsx from "clsx"
import moment from "moment"
import {
	BaseSyntheticEvent,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useState,
} from "react"
import {
	FieldError,
	FieldErrors,
	FieldValues,
	useForm,
	UseFormRegister,
} from "react-hook-form"

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

interface CustomFieldError extends FieldError {
	message: string
}

interface UserTableRowProps {
	user: Users
	onUserListChange: () => void
	editElement: EditElement
	setEditElement: Dispatch<SetStateAction<EditElement | null>>
	onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
	errors: FieldErrors<FieldValues>
	register: UseFormRegister<FieldValues>
	index: number
}

const UserTableAction: FC<UserTableRowProps> = ({
	onUserListChange,
	user,
	editElement,
	setEditElement,
	errors,
	register,
	index,
}) => {
	// const [editElement, setEditElement] = useState<EditElement | null>(null)
	const isBlocked =
		editElement?._id === user._id ? editElement.isBlocked : user.isBlocked
	const tdClass = (additionClassName?: string) =>
		clsx("px-1 py-1 align-middle", additionClassName)

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

	return (
		<tr className="max-md:flex max-md:flex-col p-2 mt-2 text-xs">
			<td className={tdClass("hidden lg:table-cell text-sm w-[30px]")}>
				{index}
			</td>
			<td
				// className={tdClass("max-md:order-3")}
				className="order-3"
			>
				<dt className="font-semibold mt-1 lg:hidden">Email</dt>
				<InputForm
					register={register}
					errorMessage={errors as { [key: string]: CustomFieldError }}
					id={"email"}
					validate={validateEmail}
					defaultValue={user.email}
					className={inputClass()}
				/>
			</td>
			<td className={tdClass("lg:w-[120px] max-md:order-1")}>
				<dt className="font-semibold mt-1 lg:hidden">First name</dt>
				<InputForm
					register={register}
					errorMessage={errors as { [key: string]: CustomFieldError }}
					id={"firstName"}
					defaultValue={user.firstName}
					className={inputClass()}
				/>
			</td>
			<td className={tdClass("lg:w-[120px] max-md:order-2")}>
				<dt className="font-semibold mt-1 lg:hidden">Last name</dt>
				<InputForm
					register={register}
					errorMessage={errors as { [key: string]: CustomFieldError }}
					id={"lastName"}
					defaultValue={user.lastName}
					className={inputClass()}
				/>
			</td>
			<td
				className={tdClass(
					"overflow-y-auto lg:h-[100px] flex flex-col justify-center lg:w-[100px] order-4"
				)}
			>
				<dt className="font-semibold mt-1 lg:hidden">Roles</dt>
				{roleSelection.map((role) => (
					<div key={role.id}>
						<Checkbox
							// type="checkbox"
							// defaultChecked={editElement.role.includes(
							// 	role.role.toLowerCase()
							// )}
							checked={editElement.role.includes(role.role.toLowerCase())}
							onChange={(e) => handleRoleChange(role.role, e.target.checked)}
							// value={role.role.normalize()}
							name={role.role}
							label={role.role}
							// id={role.role}
							// autoComplete="false"
						/>
						{/* <label className="ml-1" htmlFor={role.role}>
							{role.role}
						</label> */}
					</div>
				))}
			</td>
			<td className={tdClass("lg:w-[100px] order-5")}>
				<dt className="font-semibold mt-1 lg:hidden">Phone</dt>
				<span className="text-xs">0123456789</span>
			</td>
			<td className={tdClass("lg:w-[110px] order-6")}>
				<dt className="font-semibold mt-1 lg:hidden">Status</dt>
				<Checkbox
					name="user-status"
					checked={isBlocked}
					onChange={(e) => {
						setEditElement((prevEditElement: EditElement | null) => ({
							...prevEditElement!,
							isBlocked: e.target.checked,
						}))
					}}
					label="Block"
				/>
			</td>
			<td className={tdClass("lg:w-[100px] order-7")}>
				<dt className="font-semibold mt-1 lg:hidden">Created</dt>
				<dd className="text-sm lg:text-[12px]">
					{moment(user.createdAt).fromNow()}
				</dd>
			</td>
			<td className={tdClass("my-1 lg:w-[120px] text-center order-8")}>
				<div className="flex items-center gap-2 h-full">
					<Button
						type="submit"
						className="flex flex-inline flex-row gap-1 items-center justify-center hover:bg-black/60 hover:bg-opacity-60 duration-300 ease-in-out hover:text-white rounded p-1 text-orange-600 border-[1px] border-orange-600 h-full"
					>
						<span className="lg:hidden text-semibold">Confirm</span>
						<IoMdCheckmarkCircleOutline size={22} />
					</Button>
					<Button
						onClick={() => setEditElement(null)}
						className=" flex flex-inline flex-row gap-1 items-center justify-center hover:bg-black/60 hover:bg-opacity-60 duration-300 ease-in-out hover:text-white rounded p-1 text-orange-600 border-[1px] border-orange-600 h-full"
					>
						<span className="lg:hidden text-semibold">Cancel</span>
						<FaCircleXmark size={22} />
					</Button>
				</div>
			</td>
		</tr>
	)
}

export default UserTableAction
