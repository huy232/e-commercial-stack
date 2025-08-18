// export interface AdminSidebarSubOption {
// 	id: number
// 	text: string
// 	path: string
// }

// export interface AdminSidebarOption {
// 	id: number
// 	type: "SINGLE" | "PARENT"
// 	text: string
// 	path: string | null
// 	icon?: React.ReactNode
// 	subMenu?: AdminSidebarSubOption[]
// }

export interface AdminSidebarSubOption {
	id: number
	text: string
	path: string
}

export interface AdminSidebarOptionBase {
	text: string
	icon: JSX.Element
	path: string | null
}

export interface AdminSidebarOptionSingle extends AdminSidebarOptionBase {
	type: "SINGLE"
	id: number
}

export interface AdminSidebarOptionParent extends AdminSidebarOptionBase {
	type: "PARENT"
	id: number
	subMenu: AdminSidebarSubOption[]
}

export type AdminSidebarOption =
	| AdminSidebarOptionSingle
	| AdminSidebarOptionParent
