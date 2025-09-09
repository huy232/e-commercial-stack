export const userTableColumns = {
	index: "w-[50px]",
	email: "w-[250px]",
	firstName: "w-[140px]",
	lastName: "w-[140px]",
	role: "w-[120px]",
	phone: "w-[120px]",
	status: "w-[100px]",
	created: "w-[120px]",
	actions: "w-[120px]",
} as const

export type UserColumnKey = keyof typeof userTableColumns

export const userTableHeaders: {
	key: UserColumnKey
	title: string
	align?: "left" | "center" | "right"
}[] = [
	{ key: "index", title: "#" },
	{ key: "email", title: "Email" },
	{ key: "firstName", title: "First Name" },
	{ key: "lastName", title: "Last Name" },
	{ key: "role", title: "Role", align: "center" },
	{ key: "phone", title: "Phone" },
	{ key: "status", title: "Status", align: "center" },
	{ key: "created", title: "Created" },
	{ key: "actions", title: "Actions", align: "center" },
]
