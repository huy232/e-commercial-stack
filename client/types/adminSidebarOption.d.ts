export interface AdminSidebarOption {
	id: number
	type: adminDashboardStatus
	text: string
	path: string | null
	icon: JSX.Element
	subMenu?: {
		id: number
		text: string
		path: string
	}[]
}
